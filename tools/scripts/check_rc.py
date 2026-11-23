import re, bisect
t = open(r'build/gen/rc/rc_fs.cpp', encoding='utf-8', errors='replace').read()
paths = re.findall(r'\{"([^"]+)", rcb_', t)
print('entries:', len(paths))
print('sorted:', paths == sorted(paths))
print('has akhenaten.conf:', 'src/scripts/akhenaten.conf' in paths)
p = 'src/scripts/akhenaten.conf'
i = bisect.bisect_left(paths, p)
print('bisect pos:', i)
print('left neighbor:', paths[max(0, i-1)])
print('right neighbor:', paths[min(i, len(paths)-1)])
