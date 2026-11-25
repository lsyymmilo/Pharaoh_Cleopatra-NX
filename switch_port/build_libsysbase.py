#!/usr/bin/env python3
"""Build devkitPro libsysbase + libpthread from the patched newlib tree.
Direct compilation without automake (avoids VPATH/makeinfo issues).
"""
import glob
import os
import subprocess
import sys

ROOT = r'E:\移植项目\phsw'
SRC = os.path.join(ROOT, 'deps', 'nl-up', 'newlib-4.6.0.20260123')
LIBSYS = os.path.join(SRC, 'libgloss', 'libsysbase')
NEWLIB_INC = os.path.join(SRC, 'newlib', 'libc', 'include')
XPACK = glob.glob(os.path.join(ROOT, 'deps', 'xpack-gcc', 'xpack-aarch64-none-elf-gcc-*'))[0]
BIN = os.path.join(XPACK, 'bin')
CC = os.path.join(BIN, 'aarch64-none-elf-gcc.exe')
AR = os.path.join(BIN, 'aarch64-none-elf-ar.exe')
OUTDIR = os.path.join(ROOT, 'deps', 'dkp-newlib', 'aarch64-none-elf', 'lib')
OBJDIR = os.path.join(ROOT, 'build', 'obj', 'libsysbase')

FLAGS = ['-march=armv8-a+crc+crypto', '-mtune=cortex-a57', '-fPIC',
         '-ftls-model=local-exec', '-O2', '-ffunction-sections',
         '-fdata-sections', '-D__SWITCH__', '-D_BUILDING_LIBSYSBASE',
         '-I', os.path.join(ROOT, 'build', 'newlib-build', 'aarch64-none-elf', 'newlib', 'targ-include'),
         '-I', os.path.join(ROOT, 'build', 'libsysbase-build'),
         '-I', os.path.join(ROOT, 'deps', 'dkp-newlib', 'aarch64-none-elf', 'include'),
         '-I', NEWLIB_INC, '-I', LIBSYS,
         '-Wall', '-w']


def compile_all(files, tag):
    objs = []
    import concurrent.futures
    def one(f):
        obj = os.path.join(OBJDIR, tag, os.path.basename(f) + '.o')
        os.makedirs(os.path.dirname(obj), exist_ok=True)
        cmd = [CC] + FLAGS + ['-c', f, '-o', obj]
        r = subprocess.run(cmd, capture_output=True, text=True,
                           encoding='utf-8', errors='replace')
        if r.returncode != 0:
            return (f, r.stderr[-3000:])
        return None
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        for res in ex.map(one, files):
            if res:
                print('FAIL:', res[0])
                print(res[1])
                sys.exit(1)
    for f in files:
        objs.append(os.path.join(OBJDIR, tag, os.path.basename(f) + '.o'))
    return objs


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    # pthread library
    pthread_src = os.path.join(LIBSYS, 'pthread.c')
    print('pthread src:', pthread_src, os.path.exists(pthread_src))
    objs = compile_all([pthread_src], 'pthread')
    libp = os.path.join(OUTDIR, 'libpthread.a')
    rsp = libp + '.rsp'
    with open(rsp, 'w') as f:
        f.write('\n'.join(o.replace('\\', '/') for o in objs))
    subprocess.run([AR, 'rcs', libp, '@' + rsp.replace('\\', '/')], check=True)
    print('libpthread.a done')

    # libsysbase: all .c except pthread.c, doc stuff
    sources = [f for f in glob.glob(os.path.join(LIBSYS, '*.c'))]
    sources = [f for f in sources if not f.endswith(('pthread.c',))]
    print('libsysbase sources:', len(sources))
    objs = compile_all(sources, 'sysbase')
    libs = os.path.join(OUTDIR, 'libsysbase.a')
    rsp = libs + '.rsp'
    with open(rsp, 'w') as f:
        f.write('\n'.join(o.replace('\\', '/') for o in objs))
    subprocess.run([AR, 'rcs', libs, '@' + rsp.replace('\\', '/')], check=True)
    print('libsysbase.a done')


if __name__ == '__main__':
    main()
