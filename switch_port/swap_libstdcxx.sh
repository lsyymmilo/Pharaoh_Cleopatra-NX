#!/bin/bash
# Swap the freshly built posix libstdc++ (archive + headers) into the xpack
# toolchain so aarch64-none-elf-g++ compiles/links the posix runtime by default.
# Original single-thread pieces are kept as *.single-orig backups.
set -e
ROOT=/c/pharaoh-build
XPACK=$ROOT/tc/xpack-aarch64-none-elf-gcc-15.2.1-1.1
HOSTCC=$ROOT/hostcc/opt/bin
export PATH="$HOSTCC:$XPACK/bin:/usr/bin:$PATH"
NEWLIB=$ROOT/dkp-newlib
NEWA=$NEWLIB/lib/libstdc++.a
NEWH=$NEWLIB/aarch64-none-elf/include/c++/15.2.1-posix
XPLIB=$XPACK/aarch64-none-elf/lib
XPHDR=$XPACK/aarch64-none-elf/include/c++/15.2.1
XBK=$XPACK/aarch64-none-elf/include/c++/15.2.1-single-orig

[ -f "$NEWA" ] || { echo "missing $NEWA"; exit 2; }
[ -d "$NEWH" ] || { echo "missing $NEWH"; exit 2; }

# --- backups (once) ---
if [ ! -f "$XPLIB/libstdc++.a.single-orig" ]; then
  cp "$XPLIB/libstdc++.a" "$XPLIB/libstdc++.a.single-orig"
fi
if [ ! -d "$XBK" ]; then
  mv "$XPHDR" "$XBK"
fi

# --- swap in ---
rm -rf "$XPHDR"
cp -r "$NEWH" "$XPHDR"
cp "$NEWA" "$XPLIB/libstdc++.a"

# --- verify ---
grep -q '_GLIBCXX_HAS_GTHREADS 1' "$XPHDR/aarch64-none-elf/bits/c++config.h" || { echo "c++config verify failed"; exit 3; }
grep -q '_GLIBCXX_GCC_GTHR_POSIX_H' "$XPHDR/aarch64-none-elf/bits/gthr-default.h" || { echo "gthr verify failed"; exit 4; }
"$XPACK/bin/aarch64-none-elf-nm" "$NEWA" | grep -q ' T pthread' || true
echo "SWAP_DONE"
