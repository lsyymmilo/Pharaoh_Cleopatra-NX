#!/usr/bin/env python3
"""Offline sg3 header/entry-table inspector for the Akhenaten pak format."""
import struct
import sys
import os

DATA = r'C:\pharaoh-build\output\sdcard\switch\pharaoh\assets\Data'
PAK_GROUPS_MAX = 300
BMP_CAP = 200
ENTRY_BYTES_BASE = 63          # fixed part of one entry header
HEADER_BASE = 680
ENTRY_TABLE_OFF = HEADER_BASE + BMP_CAP * BMP_CAP  # 40680

def inspect(name):
    path = os.path.join(DATA, name + '.sg3')
    raw = open(path, 'rb').read()
    print(f'==== {name}.sg3 ({len(raw)} bytes) ====')
    vals = struct.unpack_from('<20I', raw, 0)
    labels = ['unk00','version','unk02','unk03','entries_num+1','num_bmp_names',
              'unk06','unk07','555_size','unk09'] + [f'unk{i}' for i in range(10,20)]
    for l, v in zip(labels, vals):
        print(f'  {l:16s} = {v}')
    ver = vals[1]
    entries = vals[4] + 1
    num_names = vals[5]
    groups = struct.unpack_from('<300H', raw, 80)
    real_groups = [g for g in groups if g != 0]
    print(f'  groups: first={groups[0]} nonzero={len(real_groups)} sample={real_groups[:12]}')
    ebytes = ENTRY_BYTES_BASE + (8 if ver >= 214 else 0)
    print(f'  entry bytes = {ebytes}, table off = {ENTRY_TABLE_OFF}, '
          f'table end = {ENTRY_TABLE_OFF + entries*ebytes}')
    bad_off = bad_wh = bad_mirror = bad_group = 0
    max_group_id = -1
    first_off = None
    for i in range(entries):
        base = ENTRY_TABLE_OFF + i * ebytes
        if base + ebytes > len(raw):
            print(f'  !! entry {i} header beyond file end')
            break
        (data_off, dlen, ulen, unk00, mirror) = struct.unpack_from('<5i', raw, base)
        wid, hei, gid, gidx, unk03, nspr, u04, sox, soy, u05, u06, u07, u08, u09 = \
            struct.unpack_from('<hhHHhhhhhhhhhh', raw, base + 20)
        can_rev, u10, itype, comp, ext, isotop, u11, u12, bmpgid = \
            struct.unpack_from('<8Bb', raw, base + 48)
        if i == 0:
            first_off = data_off
        if data_off < ENTRY_TABLE_OFF + entries * ebytes or data_off % 4 != 0:
            bad_off += 1
            if bad_off <= 5:
                print(f'  entry {i}: suspicious data_off={data_off} dlen={dlen}')
        if wid < 0 or hei < 0 or wid > 4096 or hei > 4096:
            bad_wh += 1
            if bad_wh <= 5:
                print(f'  entry {i}: odd size {wid}x{hei} bmpgid={bmpgid} type={itype}')
        if mirror != 0:
            bad_mirror += 1
            if bad_mirror <= 8:
                tgt = i + mirror
                flag = '' if 0 <= tgt < entries else '  <== OUT OF RANGE'
                print(f'  entry {i}: mirror={mirror} -> idx {tgt}{flag}')
        if bmpgid > max_group_id:
            max_group_id = bmpgid
        if bmpgid >= PAK_GROUPS_MAX:
            bad_group += 1
    print(f'  summary: entries={entries} bad_off={bad_off} bad_wh={bad_wh} '
          f'mirrors={bad_mirror} bmpgid_max={max_group_id} bad_bmpgid={bad_group} '
          f'first_data_off={first_off}')
    print()

for n in sys.argv[1:]:
    inspect(n)