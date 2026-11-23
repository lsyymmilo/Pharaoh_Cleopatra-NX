#!/bin/bash
# Clean rebuild of libstdc++ (posix): wipe all stale libtool artifacts from the
# interrupted single-config run, keep patched config.h/Makefile/include headers.
set -e
set -o pipefail
ROOT=/c/pharaoh-build
BUILD=$ROOT/build/libstdcxx-build
XPACK=$ROOT/tc/xpack-aarch64-none-elf-gcc-15.2.1-1.1
HOSTCC=$ROOT/hostcc/opt/bin
NEWLIB=$ROOT/dkp-newlib/aarch64-none-elf
LIBNXLIB=$ROOT/dkp/libnx/lib
export PATH="$HOSTCC:$XPACK/bin:/usr/bin:$PATH"
export CPPFLAGS="-isystem $NEWLIB/include"
export LDFLAGS="-L$NEWLIB/lib -L$LIBNXLIB -L$XPACK/lib/gcc/aarch64-none-elf/15.2.1"
export LIBS="-Wl,--start-group -lsysbase -lpthread -lnx -lc -lm -Wl,--end-group"

cd "$BUILD"
# sanity: the config surgery must still be in place
grep -q '^#define _GLIBCXX_HAS_GTHREADS 1' config.h
grep -q '^thread_header = gthr-posix.h' include/Makefile

find . -name '*.lo' -delete
find . -name '*.la' -delete
find . -name '*.o'  -delete
find . -name '*.a'  -delete
find . -type d -name '.libs' -exec rm -rf {} +

make -j14 2>&1 | tail -40
make install 2>&1 | tail -20
echo "LIBSTDCXX_CLEAN_REBUILD_DONE"
