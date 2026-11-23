#!/bin/bash
printf 'int main(){return 7;}' > /tmp/x.c
/c/phsw/deps/hostcc/opt/bin/gcc -B/c/phsw/deps/hostcc/opt/bin -o /tmp/x.exe /tmp/x.c
echo "cc rc=$?"
/tmp/x.exe
echo "run rc=$?"
