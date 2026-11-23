#!/bin/bash
# Rebuild libstdc++ (posix threads) for aarch64-none-elf with the dkp newlib.
set -e
ROOT=/c/phsw
SRC=$ROOT/deps/gcc-src  # extracted gcc source
BUILD=$ROOT/build/libstdcxx-build
PREFIX=$ROOT/deps/dkp-newlib
XPACK=$(ls -d $ROOT/deps/xpack-gcc/xpack-aarch64-none-elf-gcc-* | head -1)
HOSTCC=/c/phsw/deps/hostcc/opt/bin
NEWLIB=$ROOT/deps/dkp-newlib/aarch64-none-elf
export PATH="$HOSTCC:$XPACK/bin:/usr/bin:$PATH"

if [ ! -d "$SRC/libstdc++-v3" ]; then
  echo "gcc source missing; extracting"
  mkdir -p "$SRC"
  cd "$SRC"
  tar -xf $ROOT/deps/gcc-src.tar.xz --strip-components=1
fi

mkdir -p "$BUILD"
cd "$BUILD"
export CC="aarch64-none-elf-gcc"
export CXX="aarch64-none-elf-g++"
XPACKGCC="$XPACK/lib/gcc/aarch64-none-elf/15.2.1"
export CFLAGS_FOR_TARGET="-O2 -ffunction-sections -fdata-sections -march=armv8-a+crc+crypto -mtune=cortex-a57 -fPIC -ftls-model=local-exec"
export CXXFLAGS_FOR_TARGET="$CFLAGS_FOR_TARGET"
export CXXFLAGS="$CXXFLAGS_FOR_TARGET"
export CXXCPPFLAGS=""
export LDFLAGS="-L$XPACKGCC -L$NEWLIB/lib -L$ROOT/build/dkp/libnx/lib"
export GLIBCXX_ENABLE_THREADS=posix

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
    --with-sysroot="$NEWLIB" \
    --disable-nls \
    --disable-libstdcxx-pch \
    --disable-libgomp \
    --disable-libquadmath \
    --disable-libatomic \
    --disable-werror \
    --enable-threads=posix \
    --with-gxx-include-dir="$PREFIX/aarch64-none-elf/include/c++/posix" \
    ac_cv_header_fcntl=yes \
    gcc_no_link=no \
    2>&1 | tail -25
  touch configured
fi
make -j8 2>&1 | tail -30
make install 2>&1 | tail -10
echo "LIBSTDCXX_DONE"
