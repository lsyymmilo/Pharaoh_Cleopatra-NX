#!/usr/bin/env python3
"""Faithful simulation of game_load_campaign_file() (mission.cpp) memory writes.

Models g_mission_data as flat memory and records every field write with its
offset, flagging any write that lands outside the intended field.
Layout (asserted against disasm): map_names[300*300] @0, map_name_nums @90000,
campaigns[10] @90008, campaign stride 3608 (steps[50] @+0, num_steps @+3600),
mission_step_t stride 72: scenario@0 intro@4 victory@8 paths@12..31
map_name@32 is_end@40 campaign_id@44 rank@48 prev@56 next@64.
"""
import struct

path = r'C:\pharaoh-build\output\sdcard\switch\pharaoh\assets\campaign.txt'
raw = open(path, 'rb').read()

MAX_NAMES, NAME_SIZE, MAX_STEPS, MAX_CAMPAIGNS = 300, 300, 50, 10
CAMPAIGN_STRIDE = 3608
CAMP_BASE = 90008
STEP = 72
OFF = dict(scen=0, intro=4, vict=8, paths=12, mapname=32, isend=40,
           cid=44, rank=48, prev=56, nxt=64)

mem = {}          # offset -> byte value (track writes)
bad_writes = []
state = dict(num_campaigns=0, map_name_nums=0)

def C_base(c):
    return CAMP_BASE + c * CAMPAIGN_STRIDE

def S(c, k):
    return C_base(c) + k * STEP

def write(off, size, value, what, intended_end=None):
    for i in range(size):
        mem[off + i] = value
    if intended_end is not None and not (CAMP_BASE <= off < CAMP_BASE + MAX_CAMPAIGNS * CAMPAIGN_STRIDE):
        bad_writes.append((what, off))
    if intended_end is not None and off + size > intended_end:
        bad_writes.append((what, off))

def read_num_steps(c):
    return state.setdefault(('num_steps', c), 0)

def w8(off, value, what):
    for i in range(8):
        mem[off + i] = (value >> (8 * i)) & 0xFF

# ---- parse loop ----
buf = raw
filesize = len(buf)
ptr = 0
action = -2
data_line_idx = 0
steps = {}        # (c,k) -> dict of fields
num_steps = {}    # c -> int

def get_steps(c):
    return steps.setdefault(c, {})

def ns(c):
    return num_steps.get(c, 0)

line_no = 0
while True:
    remaining = filesize - ptr
    # index_of(ptr, '\n', remaining) 1-based
    nl = buf.find(b'\n', ptr, ptr + remaining)
    if nl >= 0:
        line_end = nl - ptr + 1
        line_size = line_end - 1
        eol = 1
        if line_size > 0 and buf[ptr + line_size - 1:ptr + line_size] == b'\r':
            line_size -= 1
            eol = 2
    else:
        line_end = 0
        line_size = remaining
        eol = 0
    endl = ptr + line_size
    line = buf[ptr:endl]
    sem = line.find(b';')
    comment_pos = sem + 1 if sem >= 0 else 0
    if comment_pos != 1 and line_size > 0:
        if line.find(b'[') >= 0:
            data_line_idx = 0
            if line.find(b'MISSION_NAMES') >= 0:
                action = -1
            elif state['num_campaigns'] < MAX_CAMPAIGNS:
                state['num_campaigns'] += 1
                action += 1
            else:
                print(f'L{line_no}: more than {MAX_CAMPAIGNS} campaigns, ignored')
        else:
            if action == -1:
                if data_line_idx < MAX_NAMES:
                    name_size = min(line_size, NAME_SIZE - 1)
                    state['map_name_nums'] += 1
            elif state['num_campaigns'] <= 0:
                print(f'L{line_no}: data line outside any campaign section')
            else:
                c = state['num_campaigns'] - 1
                mission_row = line.find(b'mission') >= 0
                if mission_row and ns(c) >= MAX_STEPS:
                    print(f'L{line_no}: more than {MAX_STEPS} missions, ignored')
                elif mission_row:
                    num_steps[c] = ns(c) + 1
                    k = ns(c) - 1
                    base = S(c, k)
                    write(base + OFF['scen'], 4, 0, f'c{c}s{k}.scen')
                    write(base + OFF['intro'], 4, 0, f'c{c}s{k}.intro')
                    write(base + OFF['vict'], 4, 0, f'c{c}s{k}.vict')
                    # get_value chain (values irrelevant to layout)
                    if ns(c) > 1:
                        prevk = k - 1
                        write(S(c, prevk) + OFF['nxt'], 8, base, f'c{c}s{prevk}.next<-ptr', intended_end=C_base(c) + MAX_STEPS * STEP)
                    elif state['num_campaigns'] > 1:
                        pc = c - 1
                        pn = ns(pc)
                        tgt = S(pc, pn - 1) + OFF['nxt']
                        w8(tgt, base, f'c{c}s{k}.prevlink')
                        if pn - 1 < 0 or pn >= MAX_STEPS:
                            bad_writes.append((f'L{line_no}: OOB prev link c{pc} num_steps={pn} -> off {tgt}', tgt))
                    # is_campaign_end etc set later
                elif line.find(b'choicescreen') >= 0:
                    if ns(c) == 0:
                        num_steps[c] = 1
                    k = ns(c) - 1
                    base = S(c, k)
                    if k < 0 or k >= MAX_STEPS:
                        bad_writes.append((f'L{line_no}: choicescreen step idx {k}', base))
                    if state['num_campaigns'] > 1:
                        pc = c - 1
                        pn = ns(pc)
                        tgt = S(pc, pn - 1) + OFF['nxt']
                        w8(tgt, base, f'L{line_no} cs prevlink c{pc} pn={pn}')
                        if pn - 1 < 0 or pn >= MAX_STEPS:
                            bad_writes.append((f'L{line_no}: OOB cs prev link c{pc} num_steps={pn} -> off {tgt}', tgt))
            data_line_idx += 1
    line_no += 1
    if line_end == 0:
        break
    ptr = endl + eol
    if ptr > filesize:
        break

# ---- final is_campaign_end loop (the crash site) ----
print(f'\nnum_campaigns = {state["num_campaigns"]}')
worst = None
for c in range(state['num_campaigns']):
    n = ns(c)
    if n > 0:
        off = C_base(c) + (n - 1) * STEP + OFF['isend']
        print(f'  campaign {c}: num_steps={n} -> is_end write @ {off} '
              f'(delta {(n-1)*STEP:+d})')
        if worst is None or (n - 1) * STEP > worst[0]:
            worst = ((n - 1) * STEP, c, n)

print('\n== anomalies ==')
if bad_writes:
    for w in bad_writes:
        print('  BAD:', w)
else:
    print('  none in prev-link path')

# phantom empty campaigns check
empties = [c for c in range(state['num_campaigns']) if ns(c) == 0]
print('empty campaigns (num_steps==0):', empties or 'none')