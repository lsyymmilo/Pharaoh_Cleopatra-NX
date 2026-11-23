import re
t = open(r'build/gen/rc/rc_fs.cpp', encoding='utf-8', errors='replace').read()
paths = re.findall(r'\{"([^"]+)", rcb_', t)
hits = [p for p in paths if 'unload' in p.lower() or 'pharaoh_' in p.lower()]
print('\n'.join(hits))
