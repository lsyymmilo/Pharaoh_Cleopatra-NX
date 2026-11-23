#!/bin/bash
# Build devkitPro libsysbase (syscall glue + pthread) for aarch64-none-elf.
set -e
ROOT=/c/phsw
SRC=$ROOT/deps/nl-up/newlib-4.6.0.20260123
BUILD=$ROOT/build/libsysbase-build
PREFIX=$ROOT/deps/dkp-newlib
XPACK=$(ls -d $ROOT/deps/xpack-gcc/xpack-aarch64-none-elf-gcc-* | head -1)
HOSTCC=/c/phsw/deps/hostcc/opt/bin
export PATH="$HOSTCC:$XPACK/bin:/usr/bin:$PATH"
export CC="aarch64-none-elf-gcc"
export CXX="aarch64-none-elf-g++"
export CFLAGS="-O2 -ffunction-sections -fdata-sections -march=armv8-a+crc+crypto -mtune=cortex-a57 -fPIC -ftls-model=local-exec"
export CXXFLAGS="$CFLAGS"

mkdir -p "$BUILD"
cd "$BUILD"
if [ ! -f configured ]; then
  "$SRC/libgloss/configure" \
    --target=aarch64-none-elf \
    --prefix="$PREFIX" \
    2>&1 | tail -20
  touch configured
fi
make -j8
make install
echo "LIBSYSBASE_BUILD_DONE"
