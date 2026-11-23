#!/bin/bash
# Build devkitPro newlib for aarch64-none-elf using the xpack cross gcc.
set -e
ROOT=/c/phsw
SRC=$ROOT/deps/nl-up/newlib-4.6.0.20260123
BUILD=$ROOT/build/newlib-build
PREFIX=$ROOT/deps/dkp-newlib
XPACK=$(ls -d $ROOT/deps/xpack-gcc/xpack-aarch64-none-elf-gcc-* | head -1)
HOSTCC=/c/phsw/deps/hostcc/opt/bin
export PATH="$HOSTCC:$XPACK/bin:/usr/bin:$PATH"
export CC_FOR_TARGET="aarch64-none-elf-gcc"
export CXX_FOR_TARGET="aarch64-none-elf-g++"
HOSTCC=/c/phsw/deps/hostcc/opt/bin
export CC="$HOSTCC/gcc -B$HOSTCC"
export CXX="$HOSTCC/g++ -B$HOSTCC"
export CFLAGS_FOR_TARGET="-O2 -ffunction-sections -fdata-sections -march=armv8-a+crc+crypto -mtune=cortex-a57 -fPIC -ftls-model=local-exec"
export CXXFLAGS_FOR_TARGET="$CFLAGS_FOR_TARGET"
export MAKEINFO=true
export RANLIB_FOR_TARGET="aarch64-none-elf-ranlib"

mkdir -p "$BUILD"
cd "$BUILD"
if [ ! -f configured ]; then
  "$SRC/configure" \
    --disable-newlib-supplied-syscalls \
    --enable-newlib-mb \
    --disable-newlib-wide-orient \
    --enable-newlib-register-fini \
    --target=aarch64-none-elf \
    --prefix="$PREFIX"
  touch configured
fi
make -j8 all-target-newlib
make install-target-newlib
echo "NEWLIB_BUILD_DONE"
