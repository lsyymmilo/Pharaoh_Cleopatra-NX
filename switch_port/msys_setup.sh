#!/bin/bash
# Configure TUNA mirror + install make (retry-friendly)
conf=/etc/pacman.d/mirrorlist.mingw64
for f in /etc/pacman.d/mirrorlist.*; do
  [ -f "$f" ] || continue
  printf 'Server = %s\n' 'https://mirrors.tuna.tsinghua.edu.cn/msys2/mingw/x86_64' > "$f" 2>/dev/null || true
done
if [ -f /etc/pacman.d/mirrorlist.msys ]; then
  printf 'Server = %s\n' 'https://mirrors.tuna.tsinghua.edu.cn/msys2/ms/x86_64' > /etc/pacman.d/mirrorlist.msys
fi
grep -h Server /etc/pacman.d/mirrorlist* 2>/dev/null | head -4
echo '--- install ---'
pacman --noconfirm -Sy make 2>&1 | tail -6
which make && make --version | head -1
