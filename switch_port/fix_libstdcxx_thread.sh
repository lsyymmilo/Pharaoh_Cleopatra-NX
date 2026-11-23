#!/bin/bash
# Post-configure surgery for the standalone libstdc++-v3 build:
# xpack gcc reports "Thread model: single", so configure picked gthr-single.h
# and left _GLIBCXX_HAS_GTHREADS undefined. Force the posix gthr + gthreads here.
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

# 1) config.h: enable gthreads
sed -i 's,^/\* #undef _GLIBCXX_HAS_GTHREADS \*/$,#define _GLIBCXX_HAS_GTHREADS 1,' config.h
grep -q '^#define _GLIBCXX_HAS_GTHREADS 1' config.h || { echo "config.h patch failed"; exit 2; }

# 2) include/Makefile: posix gthr header
sed -i 's,^thread_header = gthr-single.h$,thread_header = gthr-posix.h,' include/Makefile
grep -q '^thread_header = gthr-posix.h' include/Makefile || { echo "Makefile patch failed"; exit 2; }

# 3) drop stale generated headers + all objects (they were built single-config)
rm -f include/aarch64-none-elf/bits/gthr-default.h
rm -f include/aarch64-none-elf/bits/c++config.h
find . -name '*.o' -delete

# 4) rebuild + install
make -j14 2>&1 | tail -40
make install 2>&1 | tail -20
echo "LIBSTDCXX_FIXED_DONE"
