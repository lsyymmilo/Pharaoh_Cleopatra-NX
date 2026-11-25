p = r'E:\移植项目\phsw\build\SDL-release-2.28.5\src\video\switch\SDL_switchopengles_stub.c'
c = open(p, encoding='utf-8').read()
c = c.replace('"..../SDL_internal.h"', '"../../SDL_internal.h"')
open(p, 'w', encoding='utf-8').write(c)
i = c.find('SDL_internal')
print(repr(c[max(0, i - 30):i + 30]))
