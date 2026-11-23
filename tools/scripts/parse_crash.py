# -*- coding: utf-8 -*-
# 解析 Atmosphère thread_info.bin：成对的 (u64 地址, 0x10 字节数据)
# 将落在模块范围内的所有疑似代码地址（栈上的返回地址）符号化
import io, struct, sys, subprocess

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BIN = r'C:\Users\Lsyym\Desktop\c\01795322912_05623de1466dd000_thread_info.bin'
ELF = r'C:\pharaoh-build\output\akhenaten.elf'
ADDR2LINE = r'C:\pharaoh-build\tc\xpack-aarch64-none-elf-gcc-15.2.1-1.1\bin\aarch64-none-elf-addr2line.exe'
A2L = ELF  # addr2line 参数里放 elf 路径

MOD_LO = 0x0000000d3ca51000
MOD_HI = 0x0000000d3d105000
STACK_LO = 0x000000006895f000
STACK_HI = 0x0000000068a5f000

data = open(BIN, 'rb').read()
print("bin size:", len(data))

# 尝试格式：每 24 字节 = (u64 addr, 16 bytes data)
entries = []
off = 0
ok24 = 0
while off + 24 <= len(data):
    addr = struct.unpack_from('<Q', data, off)[0]
    entries.append((addr, data[off+8:off+24]))
    off += 24
if off == len(data):
    print("format: 24-byte pairs, entries:", len(entries))
else:
    print("24-byte parse leftover:", len(data) - off, "bytes — trying raw scan")
    entries = None

code_addrs = set()
if entries:
    for addr, blob in entries:
        # blob 里的 8 字节对齐值当作候选指针
        for i in range(0, 16, 8):
            v = struct.unpack_from('<Q', blob, i)[0]
            if MOD_LO <= v < MOD_HI:
                code_addrs.add((addr, v - MOD_LO))
            elif STACK_LO <= addr < STACK_HI:
                pass
    print("module-range pointers found:", len(code_addrs))
    offsets = sorted(set(o for _, o in code_addrs))
    # 只保留落在 .text 段合理范围内的（排除数据段指针，先全部符号化再人工判断）
    arg = ' '.join(hex(o) for o in offsets[:120])
    r = subprocess.run([ADDR2LINE, '-e', ELF, '-f', '-C'] + offsets[:200],
                       capture_output=True, text=True, errors='replace')
    lines = r.stdout.splitlines()
    pairs = [(lines[i], lines[i+1] if i+1 < len(lines) else '?') for i in range(0, len(lines), 2)]
    for (addr, o), (fn, loc) in zip(sorted(code_addrs, key=lambda t: t[1]), pairs):
        print("  stack@%012x  +%06x  %s  (%s)" % (addr, o, fn[:90], loc[:60]))
else:
    # 未知格式：裸扫 8 字节对齐的模块内指针
    print("raw scanning for module pointers...")
    found = {}
    for off in range(0, len(data) - 8, 8):
        v = struct.unpack_from('<Q', data, off)[0]
        if MOD_LO <= v < MOD_HI:
            found.setdefault(v - MOD_LO, off)
    print("raw module pointers:", len(found))
    offsets = sorted(found)
    r = subprocess.run([ADDR2LINE, '-e', ELF, '-f', '-C'] + [str(x) for x in offsets[:200]],
                       capture_output=True, text=True, errors='replace')
    lines = r.stdout.splitlines()
    pairs = [(lines[i], lines[i+1] if i+1 < len(lines) else '?') for i in range(0, len(lines), 2)]
    for o, (fn, loc) in zip(offsets, pairs):
        print("  +%06x (bin@%05x)  %s  (%s)" % (o, found[o], fn[:90], loc[:60]))
