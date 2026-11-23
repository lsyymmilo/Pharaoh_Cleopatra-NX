# 检查 build/gen/rc/rc_fs.cpp 的存在检查里两个更早的嫌疑: "hotkeys.conf"
import re
t = open(r'build/gen/rc/rc_fs.cpp', encoding='utf-8', errors='replace').read()
paths = re.findall(r'\{"([^"]+)", rcb_', t)
print('has hotkeys.conf:', 'src/scripts/hotkeys.conf' in paths)
print('akhenaten.conf count:', t.count('akhenaten.conf'))
# 查 jss 队列里 56 之后还有什么: modules.js 的完整 include 列表
m = open(r'src/Akhenaten-master/src/scripts/modules.js', encoding='utf-8', errors='replace').read()
print('--- modules.js full ---')
print(m)
