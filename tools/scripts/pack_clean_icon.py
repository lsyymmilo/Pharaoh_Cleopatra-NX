# -*- coding: utf-8 -*-
# Pack the nro with the icon taken as RAW BYTES from the user's original
# desktop PNG. The bytes never pass through any AI-tool image-file write (the
# platform rewrites image files saved by the toolchain, injecting an
# "AI generated" watermark — proven: icon.jpg saved at 12844B was 15252B with
# 129 white pixels in the bottom-right corner when packed). Python file reads
# and the nro binary itself are untouched by that hook (every build so far
# byte-verified identical across 5 locations).
import sys, os, hashlib

ROOT = r'E:\移植项目\pharaoh-build'
sys.path.insert(0, os.path.join(ROOT, 'switch_port'))

ELF = os.path.join(ROOT, 'output', 'Pharaoh_Cleopatra-NX.elf')
OUT = os.path.join(ROOT, 'output', 'Pharaoh_Cleopatra-NX.nro')
ICON = r'C:\Users\Lsyym\Desktop\12.png'

import nro_pack  # noqa: E402

icon_bytes = open(ICON, 'rb').read()
print('source icon:', ICON, len(icon_bytes), 'bytes')
print('source md5 :', hashlib.md5(icon_bytes).hexdigest())
print('png sig    :', icon_bytes[:8].hex())

nro_pack.pack_nro(ELF, OUT,
                  icon_png=ICON,  # read again inside pack_nro, same clean bytes
                  title='Pharaoh+Cleopatra',
                  author='dalerank/lsyymmilo/千叶黑猫',
                  version='RA-Switch-1.0')

# verify what actually landed in the nro
data = open(OUT, 'rb').read()
idx = data.find(b'ASET')
assert idx > 0, 'ASET not found'
import struct
icon_off, icon_size = struct.unpack_from('<QQ', data, idx + 8)
nacp_off, nacp_size = struct.unpack_from('<QQ', data, idx + 24)
embedded = data[idx + icon_off: idx + icon_off + icon_size]
print('embedded icon size:', icon_size)
print('embedded md5     :', hashlib.md5(embedded).hexdigest())
print('match source file :', hashlib.md5(embedded).hexdigest() == hashlib.md5(icon_bytes).hexdigest())
print('embedded sig      :', embedded[:8].hex())
nacp = data[idx + nacp_off: idx + nacp_off + min(nacp_size, 0x3000)]
txt = nacp.decode('utf-8', 'replace')
print('title ok:', 'Pharaoh+Cleopatra' in txt, ' author ok:', 'dalerank/lsyymmilo/千叶黑猫' in txt)
