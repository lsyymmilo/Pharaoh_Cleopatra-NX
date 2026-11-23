#!/bin/bash
# Continue the libstdc++ posix build: disable _GTHREAD_USE_MUTEX_TIMEDLOCK
# (dkp newlib hides the pthread_mutex_timedlock declaration behind visibility
# macros and libpthread.a does not provide the symbol at all), then rebuild.
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
sed -i 's,^#define _GTHREAD_USE_MUTEX_TIMEDLOCK 1$,/* #undef _GTHREAD_USE_MUTEX_TIMEDLOCK */,' config.h
grep -q '^#define _GLIBCXX_HAS_GTHREADS 1' config.h
! grep -q '^#define _GTHREAD_USE_MUTEX_TIMEDLOCK 1' config.h

make -j14 2>&1 | tail -40
make install 2>&1 | tail -20
echo "LIBSTDCXX_CLEAN_REBUILD_DONE"
