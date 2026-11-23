/* Stub GL hooks for the SDL switch video driver.
 * We run the software renderer, so GL contexts are never created.
 * These stubs only exist to satisfy the linker.
 */
#include "../../SDL_internal.h"

#if SDL_VIDEO_DRIVER_SWITCH

#include "SDL_video.h"

int
SWITCH_GLES_LoadLibrary(_THIS, const char *path)
{
    (void)path;
    return SDL_SetError("OpenGL is not available in the software build");
}

void *
SWITCH_GLES_GetProcAddress(_THIS, const char *proc)
{
    (void)proc;
    return NULL;
}

void
SWITCH_GLES_UnloadLibrary(_THIS)
{
}

SDL_GLContext
SWITCH_GLES_CreateContext(_THIS, SDL_Window *window)
{
    (void)window;
    SDL_SetError("OpenGL is not available in the software build");
    return NULL;
}

int
SWITCH_GLES_MakeCurrent(_THIS, SDL_Window *window, SDL_GLContext context)
{
    (void)window;
    (void)context;
    return SDL_SetError("OpenGL is not available in the software build");
}

int
SWITCH_GLES_SetSwapInterval(_THIS, int interval)
{
    (void)interval;
    return -1;
}

int
SWITCH_GLES_GetSwapInterval(_THIS)
{
    return 0;
}

int
SWITCH_GLES_SwapWindow(_THIS, SDL_Window *window)
{
    (void)window;
    return -1;
}

void
SWITCH_GLES_DeleteContext(_THIS, SDL_GLContext context)
{
    (void)context;
}

void
SWITCH_GLES_DefaultProfileConfig(_THIS, int *mask, int *major, int *minor)
{
    *mask = SDL_GL_CONTEXT_PROFILE_ES;
    *major = 2;
    *minor = 0;
}

#endif /* SDL_VIDEO_DRIVER_SWITCH */
