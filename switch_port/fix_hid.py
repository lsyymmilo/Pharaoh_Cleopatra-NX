import re
p = r'C:\phsw\deps\libnx\libnx-master\nx\source\services\hid.c'
c = open(p, encoding='utf-8', errors='replace').read()
# replace every atomic_load_explicit(&EXPR, memory_order_acquire) with (*(EXPR))
pat = re.compile(r'atomic_load_explicit\(&([^;()]+(?:\([^;()]*\))?[^;]*?),\s*memory_order_acquire\)')
def rep(m):
    expr = m.group(1).rstrip()
    return '(*({0}))'.format(expr)
c, n = pat.subn(rep, c)
open(p, 'w', encoding='utf-8').write(c)
print('replaced', n)
