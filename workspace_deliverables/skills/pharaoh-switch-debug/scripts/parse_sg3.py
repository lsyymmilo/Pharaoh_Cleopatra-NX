#!/usr/bin/env python3
"""pharaoh-switch-debug: offline sg3/555 pak inspector (Switch port of Akhenaten).

Entry stride is 64 bytes for version<214 headers (+8 => 72 for version>=214).
NOTE: 63 is WRONG (a past debugging mistake) — never use it.

Usage:
  python parse_sg3.py <pak1> [pak2 ...]        # header + entry-table diagnostics
  python parse_sg3.py --entry <pak> <index>    # dump one entry in detail

Paks live in C:\\pharaoh-build\\output\\sdcard\\switch\\pharaoh\\assets\\Data\\.
"""
import os
import struct
import sys

DATA = r'C:\pharaoh-build\output\sdcard\switch\pharaoh\assets\Data'
PAK_GROUPS_MAX = 300
HDR_BASE = 680            # 80 (20 x u32) + 300 x u16 groups
ENTRY_TABLE_OFF = HDR_BASE + 200 * 200   # 40680 (200 reserved bmp-name slots x 200B)
BMP_NAME_CAP = 200


def inspect(name):
    path = os.path.join(DATA, name + '.sg3')
    raw = open(path, 'rb').read()
    v = struct.unpack_from('<20I', raw, 0)
    ver, entries, num_names = v[1], v[4] + 1, v[5]
    stride = 64 + (8 if ver >= 214 else 0)
    groups = struct.unpack_from('<%dH' % PAK_GROUPS_MAX, raw, 80)
    nz = [g for g in groups if g != 0]
    print(f'== {name}.sg3 ({len(raw)}B) ver={ver} entries={entries} '
          f'names={num_names} stride={stride} groups[nz]={len(nz)} first={groups[0]} '
          f'555_declared={v[8]}')
    big = (0, 0, -1)
    for i in range(entries):
        b = ENTRY_TABLE_OFF + i * stride
        if b + stride > len(raw):
            print(f'  !! entry {i} beyond file'); break
        doff, dlen, ulen, u0, mirror = struct.unpack_from('<5i', raw, b)
        w, h = struct.unpack_from('<hh', raw, b + 20)
        typ = raw[b + 50]
        ext = raw[b + 52]
        if i and w * h > big[0] * big[1]:
            big = (w, h, i)
        if i < 3 or i >= entries - 3:
            print(f'  e{i}: off={doff} dlen={dlen} {w}x{h} mirror={mirror} '
                  f'type={typ} ext={ext}')
    print(f'  largest: entry {big[2]} {big[0]}x{big[1]} '
          f'(fits 2048 atlas: {big[0] <= 2048 and big[1] <= 2048})')


def entry(name, idx):
    path = os.path.join(DATA, name + '.sg3')
    raw = open(path, 'rb').read()
    ver = struct.unpack_from('<20I', raw, 0)[1]
    stride = 64 + (8 if ver >= 214 else 0)
    b = ENTRY_TABLE_OFF + idx * stride
    fields = struct.unpack_from('<5i', raw, b)
    (w, h, gid, gidx, u3) = struct.unpack_from('<hhHHh', raw, b + 20)
    (nspr, u4, sx, sy) = struct.unpack_from('<Hhhh', raw, b + 32)
    tail = struct.unpack_from('<9B', raw, b + 48)
    print(f'{name} entry {idx} (stride {stride}):')
    print(f'  data_off={fields[0]} dlen={fields[1]} ulen={fields[2]} '
          f'unk00={fields[3]} mirror={fields[4]}')
    print(f'  {w}x{h} group={gid} gidx={gidx} sprites={nspr} off=({sx},{sy})')
    print(f'  can_rev={tail[0]} type={tail[2]} compressed={tail[3]} '
          f'external={tail[4]} iso_top={tail[5]} bmp_group={tail[8]}')


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(0)
    if args[0] == '--entry':
        entry(args[1], int(args[2]))
    else:
        for n in args:
            inspect(n)
