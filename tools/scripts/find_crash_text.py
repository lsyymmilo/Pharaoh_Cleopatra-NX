# -*- coding: utf-8 -*-
# 在脚本与数据文件中定位崩溃栈上的中文文本片段
import io, os, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 从崩溃报告栈 Dump 还原的 UTF-8 片段
# e7 8d a8 e7 89 b9 e7 9a 84 e7 8e 8b e5 9c 8b e3 80 82 80 2e 2e 2e
frag = bytes.fromhex('e78da8e789b9e79a84e78e8be5 9c8be380 82'.replace(' ', ''))
try:
    s = frag.decode('utf-8', errors='replace')
except Exception as e:
    s = str(e)
print("stack fragment decoded:", repr(s))

needle1 = "獨特的王國"
needle2 = "甚而一直永遠下去"

roots = [
    r'C:\pharaoh-build\src\Akhenaten-master\src\scripts',
    r'C:\pharaoh-build\output\sdcard\switch\pharaoh\assets',
]

for root in roots:
    for dirpath, dirs, files in os.walk(root):
        for fn in files:
            if not fn.lower().endswith(('.js', '.txt', '.dat', '.cht', '.eng', '.inf')):
                continue
            p = os.path.join(dirpath, fn)
            try:
                data = open(p, 'rb').read()
            except Exception:
                continue
            for needle in (needle1, needle2):
                nb = needle.encode('utf-8')
                if nb in data:
                    # 找到上下文
                    idx = data.find(nb)
                    ctx = data[max(0, idx-80): idx+200]
                    print("FOUND %r in %s @%d" % (needle, p, idx))
                    try:
                        print("   ctx:", ctx.decode('utf-8', errors='replace').replace('\n', ' ')[:220])
                    except Exception:
                        pass
                    break
