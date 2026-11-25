# -*- coding: utf-8 -*-
# 查 localization_base_ch.js / localization_base_en.js 中的菜单文本条目
import io, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CH = r'E:\移植项目\pharaoh-build\src\Akhenaten-master\src\scripts\localization_base_ch.js'
EN = r'E:\移植项目\pharaoh-build\src\Akhenaten-master\src\scripts\localization_base_en.js'

ch = open(CH, encoding='utf-8').read()
en = open(EN, encoding='utf-8').read()

# 对象语法无逗号，条目形如 { group:13, id:5, text:"..." }
item = re.compile(r'\{\s*group:\s*(\d+)\s*,\s*id:\s*(\d+)\s*,\s*text:\s*"((?:[^"\\]|\\.)*)"')

ch_map = {(int(m.group(1)), int(m.group(2))): m.group(3) for m in item.finditer(ch)}
en_map = {(int(m.group(1)), int(m.group(2))): m.group(3) for m in item.finditer(en)}

targets = [(13,5),(30,0),(30,5),(2,0),(30,4)]
print("=== menu textids ===")
for t in targets:
    print("[%d,%d] ch: %r" % (t[0], t[1], ch_map.get(t, '<MISSING>')[:60]))
    print("        en: %r" % (en_map.get(t, '<MISSING>')[:60]))

print()
print("ch entries: %d, en entries: %d" % (len(ch_map), len(en_map)))
# 中文表里第一个条目长什么样
for k in list(ch_map)[:3]:
    print("ch sample", k, repr(ch_map[k][:40]))
for k in list(en_map)[:3]:
    print("en sample", k, repr(en_map[k][:40]))
