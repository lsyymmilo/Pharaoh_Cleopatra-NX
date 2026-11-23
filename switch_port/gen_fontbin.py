#!/usr/bin/env python3
"""Generate default_font_bin.h/.s for libnx console (bin2o replacement)."""
d = open(r'C:\phsw\deps\libnx\libnx-master\nx\data\default_font.bin', 'rb').read()
name = 'default_font_bin'

h = '''#pragma once
#include <stdint.h>
extern const uint8_t {n}[];
extern const uint32_t {n}_size;
extern const uint8_t {n}_end[];
'''.format(n=name)
open(r'C:\phsw\deps\libnx\libnx-master\nx\data\default_font_bin.h', 'w').write(h)

lines = []
for i in range(0, len(d), 16):
    lines.append('  .byte ' + ','.join(str(b) for b in d[i:i + 16]))
asm = '''.section .rodata.{n},"a"
.balign 4
.global {n}
.type {n}, @object
{cn}:
{body}
.size {cn}, {sz}
.global {cn}_size
.type {cn}_size, @object
{cn}_size:
  .word {sz}
.global {cn}_end
.type {cn}_end, @object
{cn}_end:
  .byte 0
.size {cn}_end, 1
'''.format(n=name, cn=name, body='\n'.join(lines), sz=len(d))
open(r'C:\phsw\deps\libnx\libnx-master\nx\data\default_font_bin.s', 'w').write(asm)
print('generated', len(d), 'bytes')
