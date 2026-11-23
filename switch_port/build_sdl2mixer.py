#!/usr/bin/env python3
"""Build SDL_mixer 2.6.3 (WAV + built-in dr_mp3) for the Akhenaten Switch port."""
import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor

ROOT = 'C:/pharaoh-build'
SM = os.path.join(ROOT, 'build', 'SDL_mixer')
SDL_INC = os.path.join(ROOT, 'SDL', 'include')
XPACK = os.path.join(ROOT, 'tc', 'xpack-aarch64-none-elf-gcc-15.2.1-1.1')
CC = os.path.join(XPACK, 'bin', 'aarch64-none-elf-gcc.exe')
AR = os.path.join(XPACK, 'bin', 'aarch64-none-elf-ar.exe')
NEWLIB_INC = os.path.join(ROOT, 'dkp-newlib', 'aarch64-none-elf', 'include')
LIBNX_INC = os.path.join(ROOT, 'dkp', 'libnx', 'include')
LIBNX_BSD = os.path.join(ROOT, 'dkp', 'libnx', 'bsd_include')
OUT = os.path.join(ROOT, 'libs', 'libSDL2mixer.a')
OBJDIR = os.path.join(ROOT, 'build', 'obj', 'sdl2mixer')

ARCH = '-march=armv8-a+crc+crypto -mtune=cortex-a57 -fPIC -ftls-model=local-exec'.split()
CFLAGS = ARCH + ['-D__SWITCH__', '-DNDEBUG', '-O2', '-ffunction-sections', '-fdata-sections',
                 '-fno-strict-aliasing', '-Wno-attributes', '-std=gnu11',
                 '-DMUSIC_WAV', '-DMUSIC_MP3_DRMP3',
                 '-DSOUND_SUPPORTS_FORMAT_8BIT', '-DSOUND_SUPPORTS_FORMAT_16BIT',
                 '-DHAVE_LIBC=1']

FILES = [
    'src/mixer.c', 'src/music.c', 'src/utils.c',
    'src/effect_position.c', 'src/effect_stereoreverse.c', 'src/effects_internal.c',
    'src/codecs/load_aiff.c', 'src/codecs/load_voc.c', 'src/codecs/mp3utils.c',
    'src/codecs/music_drmp3.c', 'src/codecs/music_wav.c',
]

INCS = ['-I' + os.path.join(SM, 'include'),
        '-I' + SDL_INC,
        '-I' + os.path.join(SM, 'src'),
        '-I' + os.path.join(SM, 'src', 'codecs'),
        '-I' + os.path.join(SM, 'src', 'codecs', 'dr_libs'),
        '-isystem', NEWLIB_INC,
        '-I' + LIBNX_INC, '-I' + LIBNX_BSD]


def build():
    os.makedirs(OBJDIR, exist_ok=True)
    tasks = []
    for f in FILES:
        obj = os.path.join(OBJDIR, f.replace('/', '_') + '.o')
        tasks.append((os.path.join(SM, f), obj))
    errs = []

    def one(t):
        src, obj = t
        cmd = [CC] + CFLAGS + INCS + ['-c', src, '-o', obj]
        r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
        if r.returncode != 0:
            return (src, (r.stderr or '')[-3000:])
        return None

    with ThreadPoolExecutor(10) as pool:
        for res in pool.map(one, tasks):
            if res:
                errs.append(res)
                print('FAIL', os.path.basename(res[0]))
    if errs:
        for s, e in errs[:4]:
            print('=' * 60)
            print('FAIL:', s)
            print(e[-1500:])
        sys.exit(1)
    rsp = OUT + '.rsp'
    with open(rsp, 'w') as f:
        f.write('\n'.join('"' + t[1].replace('\\', '/') + '"' for t in tasks))
    tmp = OUT + '.tmp'
    r = subprocess.run([AR, 'rcs', tmp.replace('\\', '/'), '@' + rsp.replace('\\', '/')],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr)
        sys.exit(1)
    os.replace(tmp, OUT)
    print(f'SDL2mixer: {len(tasks)} files -> {OUT} ({os.path.getsize(OUT) // 1024}KB)')


if __name__ == '__main__':
    build()
