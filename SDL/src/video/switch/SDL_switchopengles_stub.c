/* Stub GL hooks for the SDL switch video driver.
 * We run the software renderer, so GL contexts are never created.
 * These stubs only exist to satisfy the linker.
 */
#include "../../SDL_internal.h"

#if SDL_VIDEO_DRIVER_SWITCH

#include "SDL_video.h"
#include "../SDL_sysvideo.h"

int
SWITCH_GLES_LoadLibrary(SDL_VideoDevice * _this, const char *path)
{
    (void)path;
    return SDL_SetError("OpenGL is not available in the software build");
}

void *
SWITCH_GLES_GetProcAddress(SDL_VideoDevice * _this, const char *proc)
{
    (void)proc;
    return NULL;
}

void
SWITCH_GLES_UnloadLibrary(SDL_VideoDevice * _this)
{
}

SDL_GLContext
SWITCH_GLES_CreateContext(SDL_VideoDevice * _this, SDL_Window *window)
{
    (void)window;
    SDL_SetError("OpenGL is not available in the software build");
    return NULL;
}

int
SWITCH_GLES_MakeCurrent(SDL_VideoDevice * _this, SDL_Window *window, SDL_GLContext context)
{
    (void)window;
    (void)context;
    return SDL_SetError("OpenGL is not available in the software build");
}

int
SWITCH_GLES_SetSwapInterval(SDL_VideoDevice * _this, int interval)
{
    (void)interval;
    return -1;
}

int
SWITCH_GLES_GetSwapInterval(SDL_VideoDevice * _this)
{
    return 0;
}

int
SWITCH_GLES_SwapWindow(SDL_VideoDevice * _this, SDL_Window *window)
{
    (void)window;
    return -1;
}

void
SWITCH_GLES_DeleteContext(SDL_VideoDevice * _this, SDL_GLContext context)
{
    (void)context;
}

void
SWITCH_GLES_DefaultProfileConfig(SDL_VideoDevice * _this, int *mask, int *major, int *minor)
{
    *mask = SDL_GL_CONTEXT_PROFILE_ES;
    *major = 2;
    *minor = 0;
}

#endif /* SDL_VIDEO_DRIVER_SWITCH */
