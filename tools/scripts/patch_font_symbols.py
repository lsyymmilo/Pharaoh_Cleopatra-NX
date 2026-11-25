# -*- coding: utf-8 -*-
"""补全 ch 字体白名单：扫描所有中文 UI 源，把缺失字符追加到 localization.js
的 ch symbols 字符串，使首次启动的预烘焙覆盖全部 UI 文字（消除"问号→重烘焙"）。
"""
import sys, re, os
sys.stdout.reconfigure(encoding='utf-8')

BASE = r'E:\移植项目\pharaoh-build\src\Akhenaten-master\src\scripts'
LOCJS = os.path.join(BASE, 'localization.js')

def is_cjk(cp):
    return (0x2E80 <= cp <= 0x9FFF or 0x3000 <= cp <= 0x303F or
            0xFF00 <= cp <= 0xFFEF or 0x2000 <= cp <= 0x206F)

def cjk_chars_from_text(txt):
    out = set()
    for ch in txt:
        cp = ord(ch)
        if is_cjk(cp):
            out.add(ch)
    return out

# 1) 源字符：ch UI 表 + mod 窗口脚本
src_chars = set()
ch_table = open(os.path.join(BASE, 'localization_ch.js'), encoding='utf-8').read()
src_chars |= cjk_chars_from_text(ch_table)
modwin = open(os.path.join(BASE, 'ui_mods_window.js'), encoding='utf-8').read()
src_chars |= cjk_chars_from_text(modwin)
print('source CJK chars: %d' % len(src_chars))

# 2) 读 localization.js，定位 ch 段 symbols 行
txt = open(LOCJS, encoding='utf-8').read()
m = re.search(r'lang\s*:\s*"ch"[^\n]*\n(?:.*\n)*?\s*symbols\s*:\s*"([^"]*)"', txt)
assert m, 'ch symbols not found'
symbols_str = m.group(1)
existing = set(s for s in symbols_str.split(',') if s)
print('existing symbols entries: %d' % len(existing))

# 3) 缺失（只补单字符 CJK；symbols 里已有字符集按单字符判断）
missing = sorted([c for c in src_chars if c not in existing])
print('missing: %d -> %s' % (len(missing), ''.join(missing)))
if not missing:
    print('nothing to add')
    sys.exit(0)

# 4) 追加（保持原有格式，逗号分隔），写回
new_symbols = symbols_str + ',' + ','.join(missing)
txt2 = txt[:m.start(1)] + new_symbols + txt[m.end(1):]
open(LOCJS, 'w', encoding='utf-8', newline='').write(txt2)

# 5) 验证
txt3 = open(LOCJS, encoding='utf-8').read()
m3 = re.search(r'lang\s*:\s*"ch"[^\n]*\n(?:.*\n)*?\s*symbols\s*:\s*"([^"]*)"', txt3)
vals = set(s for s in m3.group(1).split(',') if s)
still = [c for c in missing if c not in vals]
print('verify: entries_now=%d still_missing=%d' % (len(vals), len(still)))
assert not still