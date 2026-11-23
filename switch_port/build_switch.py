#!/usr/bin/env python3
"""Akhenaten Nintendo Switch build driver (no cmake/make required).

Stages:
  libnx, zlib, freetype, libpng, imgui, sdl2, resources, game, link, nro

Usage: python build_switch.py <stage> [stage...]
       python build_switch.py all
"""
import argparse
import glob
import os
import shutil
import struct
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # pharaoh-switch
PORT = WS
SRC = os.path.join(PORT, 'src', 'Akhenaten-master')
DEPS = os.path.join(PORT, 'deps')
BUILD = os.path.join(PORT, 'build')
OUT = os.path.join(PORT, 'output')
SHIM = os.path.join(PORT, 'switch_port')

XPACK_ROOT = glob.glob(os.path.join(DEPS, 'xpack-gcc', 'xpack-aarch64-none-elf-gcc-*'))[0]
TC_BIN = os.path.join(XPACK_ROOT, 'bin')
CC = os.path.join(TC_BIN, 'aarch64-none-elf-gcc.exe')
CXX = os.path.join(TC_BIN, 'aarch64-none-elf-g++.exe')
AR = os.path.join(TC_BIN, 'aarch64-none-elf-ar.exe')
OBJCOPY = os.path.join(TC_BIN, 'aarch64-none-elf-objcopy.exe')

LIBNX = os.path.join(DEPS, 'libnx', 'libnx-master', 'nx')
DKP = os.path.join(BUILD, 'dkp')
DKP_LIBNX = os.path.join(DKP, 'libnx')

SDL_SRC = os.path.join(BUILD, 'SDL-release-2.28.5')
SDL_CONFIG = os.path.join(BUILD, 'SDL-config')

IMGUI_SRC = glob.glob(os.path.join(DEPS, 'imgui*.zip'))[0] if glob.glob(os.path.join(DEPS, 'imgui*.zip')) else None

ARCH = '-march=armv8-a+crc+crypto -mtune=cortex-a57 -fPIC -ftls-model=local-exec'
BASE_FLAGS = ARCH.split() + [
    '-D__SWITCH__', '-ffunction-sections', '-fdata-sections', '-O2', '-DNDEBUG',
    '-fno-strict-aliasing', '-Wno-attributes',
]
C_FLAGS = BASE_FLAGS + ['-std=gnu11']
CXX_FLAGS = BASE_FLAGS + ['-std=gnu++17', '-fno-exceptions', '-Wno-invalid-offsetof']

JOBS = max(2, (os.cpu_count() or 4) - 1)

LIB_OUT = os.path.join(BUILD, 'libs')


def ensure_dirs():
    for d in (BUILD, LIB_OUT, OUT, os.path.join(BUILD, 'obj'), DKP_LIBNX):
        os.makedirs(d, exist_ok=True)


def sh(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True,
                      encoding='utf-8', errors='replace', **kw)
    if r.returncode != 0:
        print('CMD FAILED:', ' '.join(cmd))
        print((r.stdout or '')[-4000:])
        print((r.stderr or '')[-8000:])
        raise SystemExit(1)
    return r


def tool_ok():
    r = subprocess.run([CC, '--version'], capture_output=True, text=True,
                      encoding='utf-8', errors='replace')
    return r.returncode == 0 and 'aarch64' in (r.stdout or '')


class CompilePool:
    def __init__(self):
        self.failed = []
        self.done = 0
        self.lock_print = True

    def compile(self, tasks):
        """tasks: list of (src_path, obj_path, cmd_extra_list)"""
        def one(t):
            src, obj, extra = t
            os.makedirs(os.path.dirname(obj), exist_ok=True)
            if os.path.exists(obj) and os.path.getmtime(obj) > os.path.getmtime(src):
                return None
            cmd = extra + ['-c', src, '-o', obj]
            r = subprocess.run(cmd, capture_output=True, text=True,
                               encoding='utf-8', errors='replace')
            if r.returncode != 0:
                return (src, (r.stderr or r.stdout or '')[-6000:])
            return None

        t0 = time.time()
        with ThreadPoolExecutor(JOBS) as pool:
            for res in pool.map(one, tasks):
                if res:
                    self.failed.append(res)
                    print(f'FAIL {os.path.basename(res[0])}')
        dt = time.time() - t0
        print(f'compiled {len(tasks)} files in {dt:.0f}s, {len(self.failed)} failed')
        if self.failed:
            for src, err in self.failed[:12]:
                print('=' * 60)
                print('FAIL:', src)
                print(err)
            raise SystemExit(1)


def glob_dir(base, sub, exts=('.c',)):
    pat = os.path.join(base, sub)
    out = []
    for e in exts:
        out.extend(glob.glob(os.path.join(pat, '*' + e)))
    return sorted(out)


def ar(output, objs):
    tmp = output + '.tmp'
    if os.path.exists(tmp):
        os.remove(tmp)
    # rsp file to avoid cmdline limits
    rsp = output + '.rsp'
    with open(rsp, 'w') as f:
        f.write('\n'.join('"' + o.replace('\\', '/') + '"' for o in objs))
    sh([AR, 'rcs', tmp.replace('\\', '/'), '@' + rsp.replace('\\', '/')])
    shutil.move(tmp, output)


def stage_libnx():
    outdir = DKP_LIBNX
    libdir = os.path.join(outdir, 'lib')
    os.makedirs(libdir, exist_ok=True)
    NEWLIB_INC = os.path.join(DEPS, 'dkp-newlib', 'aarch64-none-elf', 'include')
    TARG_INC = os.path.join(BUILD, 'newlib-build', 'aarch64-none-elf', 'newlib', 'targ-include')
    incs = ['-I' + os.path.join(LIBNX, 'include'),
            '-I' + os.path.join(LIBNX, 'external', 'bsd', 'include'),
            '-I' + LIBNX,
            '-iquote', os.path.join(LIBNX, 'include', 'switch'),
            '-isystem', NEWLIB_INC,
            '-isystem', TARG_INC,
            '-iquote', os.path.join(LIBNX, 'data')]
    src_dirs = ['source/arm', 'source/kernel', 'source/sf', 'source/services',
                'source/crypto', 'source/nvidia', 'source/nvidia/ioctl',
                'source/display', 'source/audio', 'source/applets',
                'source/runtime', 'source/runtime/devices',
                'source/runtime/util', 'source/runtime/util/utf']
    tasks = []
    objs = []
    for d in src_dirs:
        for f in glob_dir(LIBNX, d, ('.c',)):
            obj = os.path.join(BUILD, 'obj', 'libnx', d.replace('/', '_'),
                               os.path.basename(f) + '.o')
            tasks.append((f, obj, [CC] + C_FLAGS + incs + ['-DLIBNX_NO_DEPRECATION']))
            objs.append(obj)
        for f in glob_dir(LIBNX, d, ('.cpp',)):
            obj = os.path.join(BUILD, 'obj', 'libnx', d.replace('/', '_'),
                               os.path.basename(f) + '.o')
            tasks.append((f, obj, [CXX] + CXX_FLAGS + incs + ['-std=gnu++11', '-fno-rtti',
                                    '-DLIBNX_NO_DEPRECATION']))
            objs.append(obj)
        for f in glob_dir(LIBNX, d, ('.s',)):
            obj = os.path.join(BUILD, 'obj', 'libnx', d.replace('/', '_'),
                               os.path.basename(f) + '.o')
            tasks.append((f, obj, [CC] + ARCH.split() + ['-x', 'assembler-with-cpp', '-DLIBNX_NO_DEPRECATION']))
            objs.append(obj)
    # bin2o replacement: default_font_bin.s + header next to console.c
    font_s = os.path.join(LIBNX, 'data', 'default_font_bin.s')
    if os.path.exists(font_s):
        obj = os.path.join(BUILD, 'obj', 'libnx', 'default_font_bin.s.o')
        tasks.append((font_s, obj, [CC] + ARCH.split() + ['-x', 'assembler-with-cpp']))
        objs.append(obj)
    # newlib>=4.6 __libc_* <-> libnx __syscall_* bridge
    bridge = os.path.join(SHIM, 'libc_lock_bridge.c')
    obj = os.path.join(BUILD, 'obj', 'libnx', 'libc_lock_bridge.o')
    tasks.append((bridge, obj, [CC] + C_FLAGS + incs))
    objs.append(obj)
    # default_font.bin -> object
    binf = os.path.join(LIBNX, 'data', 'default_font.bin')
    if os.path.exists(binf):
        obj = os.path.join(BUILD, 'obj', 'libnx', 'default_font.bin.o')
        os.makedirs(os.path.dirname(obj), exist_ok=True)
        sh([OBJCOPY, '-I', 'binary', '-O', 'elf64-littleaarch64', '-B', 'aarch64',
            '--rename-section', '.data=.rodata.default_font.bin,alloc,load,readonly,data,contents',
            binf, obj])
        objs.append(obj)
    pool = CompilePool()
    pool.compile(tasks)
    # crti/crtn
    crti_o = os.path.join(libdir, 'crti.o')
    crtn_o = os.path.join(libdir, 'crtn.o')
    sh([CC] + ARCH.split() + ['-x', 'assembler-with-cpp', '-c',
                              os.path.join(SHIM, 'crti.s'), '-o', crti_o])
    sh([CC] + ARCH.split() + ['-x', 'assembler-with-cpp', '-c',
                              os.path.join(SHIM, 'crtn.s'), '-o', crtn_o])
    ar(os.path.join(libdir, 'libnx.a'), [o.replace('\\', '/') for o in objs])
    # install headers + ld script + specs
    shutil.copy(os.path.join(LIBNX, 'switch.ld'), os.path.join(outdir, 'switch.ld'))
    shutil.copytree(os.path.join(LIBNX, 'include'), os.path.join(outdir, 'include'),
                    dirs_exist_ok=True)
    shutil.copytree(os.path.join(LIBNX, 'external', 'bsd', 'include'),
                    os.path.join(outdir, 'bsd_include'), dirs_exist_ok=True)
    print(f'libnx: {len(objs)} objects -> {libdir}')


def stage_zlib():
    src = glob.glob(os.path.join(BUILD, 'zlib-x', 'zlib-*'))
    src = [s for s in src if os.path.isdir(s)][0]
    files = ['adler32', 'compress', 'crc32', 'deflate', 'gzclose', 'gzlib',
             'gzread', 'gzwrite', 'infback', 'inffast', 'inflate', 'inftrees',
             'trees', 'uncompr', 'zutil']
    tasks = [(os.path.join(src, 'zlib', f + '.c') if os.path.exists(os.path.join(src, 'zlib', f + '.c')) else os.path.join(src, f + '.c'),
              os.path.join(BUILD, 'obj', 'zlib', f + '.o'),
              [CC] + C_FLAGS + ['-I' + src, '-I' + os.path.join(src, 'zlib')])
             for f in files]
    tasks = [t for t in tasks if os.path.exists(t[0])]
    CompilePool().compile(tasks)
    ar(os.path.join(LIB_OUT, 'libz.a'), [t[1] for t in tasks])
    print('zlib ok')


def stage_libpng():
    src = glob.glob(os.path.join(BUILD, 'libpng-x', 'libpng-*'))
    src = [s for s in src if os.path.isdir(s)][0]
    prebuilt = os.path.join(src, 'scripts', 'pnglibconf.h.prebuilt')
    shutil.copy(prebuilt, os.path.join(src, 'pnglibconf.h'))
    files = ['png', 'pngerror', 'pngget', 'pngmem', 'pngpread', 'pngread',
             'pngrio', 'pngrtran', 'pngrutil', 'pngset', 'pngtrans', 'pngwio',
             'pngwrite', 'pngwtran', 'pngwutil']
    zlib_src = glob.glob(os.path.join(BUILD, 'zlib-x', 'zlib-*'))[0]
    tasks = [(os.path.join(src, f + '.c'), os.path.join(BUILD, 'obj', 'libpng', f + '.o'),
              [CC] + C_FLAGS + ['-I' + src, '-I' + zlib_src, '-DPNG_ARM_NEON_OPT=0']) for f in files]
    CompilePool().compile(tasks)
    ar(os.path.join(LIB_OUT, 'libpng.a'), [t[1] for t in tasks])
    print('libpng ok')


def stage_freetype():
    src = glob.glob(os.path.join(BUILD, 'freetype-x', 'freetype-*'))
    src = [s for s in src if os.path.isdir(s)][0]
    zlib_src = glob.glob(os.path.join(BUILD, 'zlib-x', 'zlib-*'))[0]
    libpng_src = glob.glob(os.path.join(BUILD, 'libpng-x', 'libpng-*'))[0]
    incs = ['-I' + os.path.join(src, 'include'), '-I' + src,
            '-I' + zlib_src, '-I' + libpng_src]
    base = ['ftsystem', 'ftinit', 'ftdebug', 'ftbase', 'ftbbox', 'ftglyph',
            'ftbitmap', 'ftstroke', 'ftsynth']
    modules = ['autofit/autofit', 'smooth/smooth', 'raster/raster',
               'sfnt/sfnt', 'truetype/truetype', 'type1/type1', 'cff/cff',
               'psaux/psaux', 'psnames/psnames', 'pshinter/pshinter',
               'winfonts/winfnt', 'pcf/pcf', 'bdf/bdf', 'sdf/sdf', 'svg/svg']
    files = []
    for f in base:
        p = os.path.join(src, 'src', 'base', f + '.c')
        if os.path.exists(p):
            files.append(p)
    for m in modules:
        p = os.path.join(src, 'src', m + '.c')
        if os.path.exists(p):
            files.append(p)
    defines = ['-DFT2_BUILD_LIBRARY', '-DFT_CONFIG_OPTION_USE_ZLIB=1']
    tasks = [(f, os.path.join(BUILD, 'obj', 'freetype',
                              os.path.basename(f) + '.o'),
              [CC] + C_FLAGS + incs + defines) for f in files]
    CompilePool().compile(tasks)
    ar(os.path.join(LIB_OUT, 'libfreetype.a'), [t[1] for t in tasks])
    print('freetype ok')


def stage_sdl2():
    # my SDL_config into the source include dir (quoted includes pick it first)
    shutil.copy(os.path.join(SHIM, 'SDL_config.h'),
                os.path.join(SDL_SRC, 'include', 'SDL_config.h'))
    incs = ['-I' + SDL_SRC + '/include',
            '-isystem', os.path.join(DEPS, 'dkp-newlib', 'aarch64-none-elf', 'include'),
            '-isystem', os.path.join(LIBNX, 'include'),
            '-isystem', os.path.join(LIBNX, 'external', 'bsd', 'include'),
            '-I' + os.path.join(SDL_SRC, 'src', 'video', 'khronos'),
            '-D_POSIX_THREADS', '-D_POSIX_TIMERS', '-DNINTENDO_SWITCH']
    skip_dirs = ['video/windows', 'video/cocoa', 'video/x11', 'video/wayland',
                 'video/kmsdrm', 'video/vita', 'video/psp', 'video/ps2',
                 'video/emscripten', 'video/android', 'video/uikit',
                 'video/metal', 'video/n3ds', 'video/ngage', 'video/offscreen',
                 'video/os2', 'video/pi', 'video/qnx', 'video/riscos',
                 'video/rosemary', 'video/rpi', 'video/winrt', 'video/haiku',
                 'audio/aaudio', 'audio/alsa', 'audio/android', 'audio/coreaudio',
                 'audio/directsound', 'audio/disk', 'audio/dsp', 'audio/dummy',
                 'audio/emscripten', 'audio/haiku', 'audio/jack', 'audio/n3ds',
                 'audio/netbsd', 'audio/openslES', 'audio/os2', 'audio/paudio',
                 'audio/pipewire', 'audio/ps2', 'audio/psp', 'audio/qsa',
                 'audio/sndio', 'audio/vita', 'audio/wasapi', 'audio/winmm',
                 'filesystem/android', 'filesystem/haiku', 'filesystem/n3ds',
                 'filesystem/posix', 'filesystem/ps2', 'filesystem/psp',
                 'filesystem/vita', 'filesystem/windows', 'filesystem/emscripten',
                 'filesystem/riscos', 'filesystem/os2',
                 'thread/windows', 'thread/os2', 'thread/vita', 'thread/ps2',
                 'thread/psp', 'thread/n3ds', 'thread/generic',
                 'timer/windows', 'timer/os2', 'timer/vita', 'timer/ps2',
                 'timer/psp', 'timer/n3ds', 'timer/haiku', 'timer/dummy',
                 'timer/unix',
                 'joystick/android', 'joystick/bsd', 'joystick/darwin',
                 'joystick/dummy', 'joystick/emscripten', 'joystick/haiku',
                 'joystick/iphoneos', 'joystick/linux', 'joystick/n3ds',
                 'joystick/os2', 'joystick/ps2', 'joystick/psp', 'joystick/vita',
                 'joystick/windows', 'joystick/hidapi', 'joystick/virtual',
                 'joysticksteam',
                 'loadso', 'locale', 'misc', 'sensor', 'core',
                 'render/direct3d', 'render/direct3d11', 'render/direct3d12',
                 'render/metal', 'render/opengl', 'render/opengles',
                 'render/opengles2', 'render/ps2', 'render/psp', 'render/vitagxm',
                 'render/vitagles', 'render/vitagles2',
                 'video/switch',  # added separately below
                 ]
    # include: all src/**/*.c except skip_dirs; switch dirs added explicitly
    all_files = glob.glob(os.path.join(SDL_SRC, 'src', '**', '*.c'), recursive=True)
    def skipped(f):
        rel = os.path.relpath(f, os.path.join(SDL_SRC, 'src')).replace('\\', '/')
        top = rel.split('/')[0]
        if top in ('main', 'libm', 'core', 'locale', 'misc', 'sensor', 'loadso',
                   'haptic', 'hidapi', 'dynapi', 'power', 'test'):
            return True
        for d in skip_dirs:
            if rel.startswith(d + '/'):
                return True
        if '/hidapi' in rel:
            return True
        if rel.startswith('power/'):
            return True
        if rel.startswith('dynapi'):
            return True
        return False
    files = [f for f in all_files if not skipped(f)]
    # explicit switch backend files
    for d in ('audio/switch', 'video/switch', 'joystick/switch',
              'filesystem/switch', 'power/switch', 'timer/switch'):
        files += glob.glob(os.path.join(SDL_SRC, 'src', d, '*.c'))
    files.append(os.path.join(SDL_SRC, 'src', 'video', 'switch', 'SDL_switchopengles_stub.c'))
    tasks = []
    for f in files:
        rel = os.path.relpath(f, SDL_SRC).replace('\\', '/')
        obj = os.path.join(BUILD, 'obj', 'sdl2', rel + '.o')
        tasks.append((f, obj, [CC] + C_FLAGS + incs))
    pool = CompilePool()
    pool.compile(tasks)
    ar(os.path.join(LIB_OUT, 'libSDL2.a'), [t[1] for t in tasks])
    print(f'sdl2: {len(tasks)} files')


def stage_imgui():
    import zipfile
    src = os.path.join(BUILD, 'imgui', 'imgui-1.92.2')
    if not os.path.exists(os.path.join(src, 'imgui.h')):
        zips = glob.glob(os.path.join(DEPS, 'imgui*.zip'))
        with zipfile.ZipFile(zips[0]) as z:
            os.makedirs(os.path.join(BUILD, 'imgui'), exist_ok=True)
            z.extractall(os.path.join(BUILD, 'imgui'))
    files = ['imgui.cpp', 'imgui_draw.cpp', 'imgui_tables.cpp',
             'imgui_widgets.cpp', 'backends/imgui_impl_sdl2.cpp',
             'backends/imgui_impl_sdlrenderer2.cpp', 'misc/cpp/imgui_stdlib.cpp']
    incs = ['-I' + src, '-I' + os.path.join(src, 'backends'),
            '-I' + os.path.join(src, 'misc', 'cpp'),
            '-I' + SDL_SRC + '/include']
    tasks = [(os.path.join(src, f), os.path.join(BUILD, 'obj', 'imgui',
              f.replace('/', '_') + '.o'), [CXX] + CXX_FLAGS + incs) for f in files]
    CompilePool().compile(tasks)
    ar(os.path.join(LIB_OUT, 'libimgui.a'), [t[1] for t in tasks])
    globals()['IMGUI_SRC_DIR'] = src
    print('imgui ok')


def stage_resources():
    import importlib.util
    spec = importlib.util.spec_from_file_location('gen_resources',
        os.path.join(SHIM, 'gen_resources.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    gen = os.path.join(BUILD, 'gen', 'rc')
    mod.gen(gen, SRC)
    files = glob.glob(os.path.join(gen, '*.cpp'))
    tasks = [(f, os.path.join(BUILD, 'obj', 'rc', os.path.basename(f) + '.o'),
              [CXX] + CXX_FLAGS + ['-I' + gen]) for f in files]
    CompilePool().compile(tasks)
    ar(os.path.join(LIB_OUT, 'librc.a'), [t[1] for t in tasks])
    print('resources ok')


def game_sources():
    g = lambda d: sorted(glob.glob(os.path.join(SRC, d, '*.cpp')))
    groups = [
        'src/platform', 'src/config', 'src/content', 'src/core', 'src/net',
        'src/core/encoding', 'src/building', 'src/building/construction',
        'src/city', 'src/empire', 'src/figure', 'src/figuretype', 'src/game',
        'src/tutorial', 'src/input', 'src/grid', 'src/grid/routing',
        'src/scenario', 'src/graphics/elements', 'src/graphics/view',
        'src/graphics/fontgen', 'src/sound', 'src/widget', 'src/widget/city',
        'src/overlays', 'src/widget/sidebar', 'src/window/advisor',
        'src/window', 'src/window/editor', 'src/window/building', 'src/dev',
        'src/debug', 'src/editor', 'src/translation',
    ]
    files = []
    for d in groups:
        files += g(d)
    for d in ('src/platform/switch', 'src/platform/vita'):
        for f in glob.glob(os.path.join(SRC, d, '*.cpp')):
            files.append(f)
    # vendored
    files += glob.glob(os.path.join(SRC, 'src', 'mujs', '*.cpp'))
    files += glob.glob(os.path.join(SRC, 'src', 'lzma', '*.c'))
    files += glob.glob(os.path.join(SRC, 'src', 'bzip', '*.c'))
    lame = glob.glob(os.path.join(SRC, 'src', 'lame', 'libmp3lame', '*.c'))
    files += lame
    files += glob.glob(os.path.join(SRC, 'src', 'js', '*.cpp'))
    files += glob.glob(os.path.join(SRC, 'src', 'js', 'test', '*.cpp'))
    return sorted(set(files))


def stage_game():
    imgui_src = globals().get('IMGUI_SRC_DIR') or os.path.join(BUILD, 'imgui', 'imgui-1.92.2')
    freetype = glob.glob(os.path.join(BUILD, 'freetype-x', 'freetype-*'))[0]
    zlibd = glob.glob(os.path.join(BUILD, 'zlib-x', 'zlib-*'))[0]
    libpngd = glob.glob(os.path.join(BUILD, 'libpng-x', 'libpng-*'))[0]
    gen = os.path.join(BUILD, 'gen', 'rc')
    incs = [
        '-I' + SRC + '/src', '-I' + SRC + '/ext', '-I' + SRC + '/src/mujs',
        '-I' + SRC + '/src/lame/include', '-I' + imgui_src,
        '-I' + imgui_src + '/backends', '-I' + imgui_src + '/misc/cpp',
        '-I' + SDL_SRC + '/include', '-I' + os.path.join(freetype, 'include'),
        '-I' + zlibd, '-I' + libpngd, '-I' + gen,
        '-I' + LIBNX + '/include', '-I' + os.path.join(LIBNX, 'external', 'bsd', 'include'),
    ]
    defines = ['-DGAME_BUILD_NUMBER=0', '-DGAME_BUILD_DATE=\\"2026-11-19\\"',
               '-DGAME_BUILD_TIME=\\"00:00:00\\"', '-DHAVE_CONFIG_H=ON',
               '-DCPU_IS_LITTLE_ENDIAN=1', '-DPACKAGE_NAME=\\"Ankh\\"',
               '-DPACKAGE_VERSION=\\"static\\"', '-DHAVE_MPGLIB=ON']
    tasks = []
    for f in game_sources():
        rel = os.path.relpath(f, SRC).replace('\\', '/')
        obj = os.path.join(BUILD, 'obj', 'game', rel + '.o')
        if f.endswith('.c'):
            cmd = [CC] + C_FLAGS
        else:
            cmd = [CXX] + CXX_FLAGS
        if 'lame' in rel.replace('\\', '/'):
            cmd += defines
        tasks.append((f, obj, cmd + incs))
    CompilePool().compile(tasks)
    print(f'game: {len(tasks)} files')


def stage_link():
    imgui_src = globals().get('IMGUI_SRC_DIR') or os.path.join(BUILD, 'imgui', 'imgui-1.92.2')
    NEWLIB_LIB = os.path.join(DEPS, 'dkp-newlib', 'aarch64-none-elf', 'lib')
    incs = ['-I' + SRC + '/src', '-I' + imgui_src, '-I' + SDL_SRC + '/include']
    objs = sorted(glob.glob(os.path.join(BUILD, 'obj', 'game', '**', '*.o'), recursive=True))
    env = dict(os.environ, DKP_LIBNX=DKP_LIBNX.replace('\\', '/'))
    rsp = os.path.join(BUILD, 'link.rsp')
    libs = [os.path.join(LIB_OUT, 'librc.a'),
            os.path.join(LIB_OUT, 'libSDL2.a'),
            os.path.join(LIB_OUT, 'libfreetype.a'),
            os.path.join(LIB_OUT, 'libpng.a'),
            os.path.join(LIB_OUT, 'libz.a'),
            os.path.join(LIB_OUT, 'libimgui.a')]
    elf = os.path.join(OUT, 'akhenaten.elf')
    cmd = [CXX] + BASE_FLAGS + incs + [
        '-specs=' + os.path.join(SHIM, 'akhenaten_switch.specs'),
        '-L' + os.path.join(DKP_LIBNX, 'lib'), '-L' + LIB_OUT,
        '-L' + NEWLIB_LIB,
        '-o', elf.replace('\\', '/'),
        '@' + rsp.replace('\\', '/'),
    ] + [l.replace('\\', '/') for l in libs] + [
        '-lnx', '-lpthread', '-lsysbase', '-lc', '-lm',
    ]
    with open(rsp, 'w') as f:
        f.write('\n'.join(o.replace('\\', '/') for o in objs))
    r = subprocess.run(cmd, capture_output=True, text=True, env=env)
    print(r.stdout[-3000:])
    print(r.stderr[-12000:])
    if r.returncode != 0:
        raise SystemExit('link failed')
    print('link ok ->', elf)


def stage_nro():
    import importlib.util
    spec = importlib.util.spec_from_file_location('nro_pack',
        os.path.join(SHIM, 'nro_pack.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.pack_nro(os.path.join(OUT, 'akhenaten.elf'),
                 os.path.join(OUT, 'akhenaten.nro'),
                 icon_png=os.path.join(SHIM, 'icon.png'),
                 title='Akhenaten 法老王', author='dalerank/TeleAgent',
                 version='RA-Switch-1.0')


STAGES = {
    'libnx': stage_libnx, 'zlib': stage_zlib, 'libpng': stage_libpng,
    'freetype': stage_freetype, 'sdl2': stage_sdl2, 'imgui': stage_imgui,
    'resources': stage_resources, 'game': stage_game, 'link': stage_link,
    'nro': stage_nro,
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('stages', nargs='*')
    args = ap.parse_args()
    ensure_dirs()
    if not tool_ok():
        print('toolchain missing/broken:', CC)
        raise SystemExit(1)
    stages = args.stages
    if stages == ['all']:
        stages = ['libnx', 'zlib', 'libpng', 'freetype', 'sdl2', 'imgui',
                  'resources', 'game', 'link', 'nro']
    for s in stages:
        print(f'=== stage {s} ===')
        STAGES[s]()


if __name__ == '__main__':
    main()
