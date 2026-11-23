#ifndef SDL_switchopengles_h_
#define SDL_switchopengles_h_

#if SDL_VIDEO_DRIVER_SWITCH

#include "../SDL_sysvideo.h"

/* OpenGLES functions (software-render stub build: GL unavailable) */
extern int SWITCH_GLES_LoadLibrary(SDL_VideoDevice * _this, const char *path);
extern void *SWITCH_GLES_GetProcAddress(SDL_VideoDevice * _this, const char *proc);
extern void SWITCH_GLES_UnloadLibrary(SDL_VideoDevice * _this);
extern SDL_GLContext SWITCH_GLES_CreateContext(SDL_VideoDevice * _this, SDL_Window *window);
extern int SWITCH_GLES_MakeCurrent(SDL_VideoDevice * _this, SDL_Window *window, SDL_GLContext context);
extern int SWITCH_GLES_SetSwapInterval(SDL_VideoDevice * _this, int interval);
extern int SWITCH_GLES_GetSwapInterval(SDL_VideoDevice * _this);
extern int SWITCH_GLES_SwapWindow(SDL_VideoDevice * _this, SDL_Window *window);
extern void SWITCH_GLES_DeleteContext(SDL_VideoDevice * _this, SDL_GLContext context);
extern void SWITCH_GLES_DefaultProfileConfig(SDL_VideoDevice * _this, int *mask, int *major, int *minor);
extern void SWITCH_GLES_GetDrawableSize(SDL_VideoDevice * _this, SDL_Window *window, int *w, int *h);

#endif /* SDL_VIDEO_DRIVER_SWITCH */
#endif /* SDL_switchopengles_h_ */
