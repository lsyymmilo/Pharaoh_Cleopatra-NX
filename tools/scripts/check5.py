import re
t = open(r'build/gen/rc/rc_fs.cpp', encoding='utf-8', errors='replace').read()
paths = re.findall(r'\{"([^"]+)", rcb_', t)
hits = [p for p in paths if 'pharaoh' in p.lower()]
print('pharaoh entries:', hits)
hits2 = [p for p in paths if p.endswith('.sgx') or p.endswith('.sg3')]
print('pak files:', hits2[:20])
