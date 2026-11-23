#!/bin/bash
# Rebuild libstdc++ (posix threads) for aarch64-none-elf against dkp newlib.
# v2: all-ASCII paths (C:/pharaoh-build) — the v1 failure was ld receiving
# mojibake'd Chinese paths for crt files, failing every link test.
set -e
set -o pipefail
ROOT=/c/pharaoh-build
SRC=$ROOT/src/gcc-src
BUILD=$ROOT/build/libstdcxx-build
PREFIX=$ROOT/dkp-newlib
XPACK=$ROOT/tc/xpack-aarch64-none-elf-gcc-15.2.1-1.1
HOSTCC=$ROOT/hostcc/opt/bin
NEWLIB=$ROOT/dkp-newlib/aarch64-none-elf
LIBNXLIB=$ROOT/dkp/libnx/lib
export PATH="$HOSTCC:$XPACK/bin:/usr/bin:$PATH"

[ -d "$SRC/libstdc++-v3" ] || { echo "MISSING gcc source"; exit 2; }
[ -f "$NEWLIB/lib/libc.a" ] || { echo "MISSING dkp newlib libc"; exit 2; }
[ -f "$LIBNXLIB/libnx.a" ] || { echo "MISSING libnx.a"; exit 2; }

mkdir -p "$BUILD"
cd "$BUILD"
export CC="aarch64-none-elf-gcc"
export CXX="aarch64-none-elf-g++"
XPACKGCC="$XPACK/lib/gcc/aarch64-none-elf/15.2.1"
# dkp newlib headers must win over xpack's bundled newlib (pthread ABI!)
export CPPFLAGS="-isystem $NEWLIB/include"
COMMON="-O2 -ffunction-sections -fdata-sections -march=armv8-a+crc+crypto -mtune=cortex-a57 -fPIC -ftls-model=local-exec"
export CFLAGS="$COMMON"
export CXXFLAGS="$COMMON"
export LDFLAGS="-L$NEWLIB/lib -L$LIBNXLIB -L$XPACKGCC"
# every conftest link must resolve pthread/nx/sysbase symbols
export LIBS="-Wl,--start-group -lsysbase -lpthread -lnx -lc -lm -Wl,--end-group"

if [ ! -f configured ]; then
  "$SRC/libstdc++-v3/configure" \
    --host=aarch64-none-elf \
    --target=aarch64-none-elf \
    --prefix="$PREFIX" \
    --disable-multilib \
    --disable-shared \
    --enable-static \
    --with-newlib=yes \
    --with-build-sysroot="$NEWLIB" \
    --disable-nls \
    --disable-libstdcxx-pch \
    --disable-werror \
    --enable-threads=posix \
    --with-gxx-include-dir="$PREFIX/aarch64-none-elf/include/c++/15.2.1-posix" \
    ac_cv_header_fcntl=yes \
    gcc_no_link=no \
    GLIBCXX_ENABLE_THREADS=posix \
    2>&1 | tail -40
  rc=$?
  if ! grep -q '^#define _GLIBCXX_HAS_GTHREADS' config.h 2>/dev/null; then
    echo "WARN: _GLIBCXX_HAS_GTHREADS missing in config.h"
  fi
  touch configured
fi
make -j14 2>&1 | tail -40
make install 2>&1 | tail -20
echo "LIBSTDCXX_DONE"
