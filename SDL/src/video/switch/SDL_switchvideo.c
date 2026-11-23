/*
  Simple DirectMedia Layer
  Copyright (C) 1997-2018 Sam Lantinga <slouken@libsdl.org>

  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.

  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not
     claim that you wrote the original software. If you use this software
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.
*/

#include "../../SDL_internal.h"

#if SDL_VIDEO_DRIVER_SWITCH

#include <stdio.h>
#include <stdarg.h>
static void swdbg(const char* fmt, ...) {
    va_list ap;
    FILE* f = fopen("sdmc:/switch/pharaoh/sdl.log", "a");
    if (!f) return;
    va_start(ap, fmt);
    vfprintf(f, fmt, ap);
    va_end(ap);
    fputc('\n', f);
    fclose(f);
}

#include "../SDL_sysvideo.h"
#include "../../render/SDL_sysrender.h"
#include "../../events/SDL_keyboard_c.h"
#include "../../events/SDL_mouse_c.h"
#include "../../events/SDL_windowevents_c.h"

#include "SDL_switchvideo.h"
#include "SDL_switchopengles.h"
#include "SDL_switchtouch.h"
#include "SDL_switchkeyboard.h"
#include "SDL_switchmouse_c.h"
#include "SDL_switchswkb.h"

#include <switch.h>

/* Currently only one window */
static SDL_Window *switch_window = NULL;
static AppletOperationMode operationMode;

/* Software framebuffer state: SDL's window-surface path (SDL_GetWindowSurface)
 * requires the driver to implement CreateWindowFramebuffer. We back it with
 * libnx's Framebuffer API (NvMap-backed double buffering via NWindow), using a
 * linear shadow buffer so SDL can treat it as a plain RGBA8888 raster. */
static Framebuffer sw_fb;
static bool sw_fb_ready = false;
static void* sw_fb_shadow = NULL;   /* linear pixels, stride in sw_fb_stride */
static u32 sw_fb_stride = 0;

static int SWITCH_CreateWindowFramebuffer(_THIS, SDL_Window *window, Uint32 *format,
                                           void **pixels, int *pitch);
static int SWITCH_UpdateWindowFramebuffer(_THIS, SDL_Window *window, const SDL_Rect *rects,
                                           int numrects);
static void SWITCH_DestroyWindowFramebuffer(_THIS, SDL_Window *window);

static void
SWITCH_Destroy(SDL_VideoDevice *device)
{
    if (device != NULL) {
        if(device->driverdata != NULL) {
            SDL_free(device->driverdata);
        }
        SDL_free(device);
    }
}

static SDL_VideoDevice *
SWITCH_CreateDevice()
{
    SDL_VideoDevice *device;

    /* Initialize SDL_VideoDevice structure */
    device = (SDL_VideoDevice *) SDL_calloc(1, sizeof(SDL_VideoDevice));
    if (device == NULL) {
        SDL_OutOfMemory();
        return NULL;
    }

    /* Setup amount of available displays */
    device->num_displays = 0;

    /* Set device free function */
    device->free = SWITCH_Destroy;

    /* Setup all functions which we can handle */
    device->VideoInit = SWITCH_VideoInit;
    device->VideoQuit = SWITCH_VideoQuit;
    device->GetDisplayModes = SWITCH_GetDisplayModes;
    device->SetDisplayMode = SWITCH_SetDisplayMode;
    device->CreateSDLWindow = SWITCH_CreateWindow;
    device->CreateSDLWindowFrom = SWITCH_CreateWindowFrom;
    device->SetWindowTitle = SWITCH_SetWindowTitle;
    device->SetWindowIcon = SWITCH_SetWindowIcon;
    device->SetWindowPosition = SWITCH_SetWindowPosition;
    device->SetWindowSize = SWITCH_SetWindowSize;
    device->ShowWindow = SWITCH_ShowWindow;
    device->HideWindow = SWITCH_HideWindow;
    device->RaiseWindow = SWITCH_RaiseWindow;
    device->MaximizeWindow = SWITCH_MaximizeWindow;
    device->MinimizeWindow = SWITCH_MinimizeWindow;
    device->RestoreWindow = SWITCH_RestoreWindow;
    //device->SetWindowMouseGrab = SWITCH_SetWindowGrab; // SDL 2.0.16
    //device->SetWindowKeyboardGrab = SWITCH_SetWindowGrab; // SDL 2.0.16
    device->DestroyWindow = SWITCH_DestroyWindow;

    /* Software-render build: no GL at all.  Leaving these non-NULL makes
     * SDL_DefaultGraphicsBackends() force SDL_WINDOW_OPENGL onto every window
     * (its __SWITCH__ branch only checks GL_CreateContext != NULL); the flag
     * then fails in SDL_GL_LoadLibrary and kills SDL_CreateWindow outright.
     * NULL entries keep software windows creatable. */
    device->GL_LoadLibrary = NULL;
    device->GL_GetProcAddress = NULL;
    device->GL_UnloadLibrary = NULL;
    device->GL_CreateContext = NULL;
    device->GL_MakeCurrent = NULL;
    device->GL_SetSwapInterval = NULL;
    device->GL_GetSwapInterval = NULL;
    device->GL_SwapWindow = NULL;
    device->GL_DeleteContext = NULL;
    device->GL_DefaultProfileConfig = NULL;

    /* Software-rendering framebuffer path (SDL_GetWindowSurface). */
    device->CreateWindowFramebuffer = SWITCH_CreateWindowFramebuffer;
    device->UpdateWindowFramebuffer = SWITCH_UpdateWindowFramebuffer;
    device->DestroyWindowFramebuffer = SWITCH_DestroyWindowFramebuffer;

    device->StartTextInput = SWITCH_StartTextInput;
    device->StopTextInput = SWITCH_StopTextInput;
    device->HasScreenKeyboardSupport = SWITCH_HasScreenKeyboardSupport;
    device->IsScreenKeyboardShown = SWITCH_IsScreenKeyboardShown;

    device->PumpEvents = SWITCH_PumpEvents;

    return device;
}

VideoBootStrap SWITCH_bootstrap = {
    "Switch",
    "Nintendo Switch Video Driver",
    SWITCH_CreateDevice
};

/*****************************************************************************/
/* SDL Video and Display initialization/handling functions                   */
/*****************************************************************************/
int
SWITCH_VideoInit(_THIS)
{
    SDL_VideoDisplay display;
    SDL_DisplayMode current_mode;

    SDL_zero(current_mode);
    current_mode.w = 1920;
    current_mode.h = 1080;
    current_mode.refresh_rate = 60;
    /* HOS vi interprets PIXEL_FORMAT_RGBA_8888 framebuffers in memory byte
     * order R,G,B,A. SDL names formats by packed value (big-endian style), so
     * the SDL format whose little-endian MEMORY order is R,G,B,A is ABGR8888.
     * Declaring RGBA8888 here put SDL's alpha byte into the screen's red
     * channel: the whole game rendered magenta/red-tinted (verified on real
     * hardware, Cleopatra splash screenshot). */
    current_mode.format = SDL_PIXELFORMAT_ABGR8888;
    current_mode.driverdata = NULL;

    SDL_zero(display);
    display.desktop_mode = current_mode;
    display.current_mode = current_mode;
    display.driverdata = NULL;
    SDL_AddVideoDisplay(&display, SDL_FALSE);

    // init psm service
    psmInitialize();
    // init touch
    SWITCH_InitTouch();
    // init keyboard
    SWITCH_InitKeyboard();
    // init mouse
    SWITCH_InitMouse();
    // init software keyboard
    SWITCH_InitSwkb();

    return 0;
}

void
SWITCH_VideoQuit(_THIS)
{
    // Software build: GL is never loaded, nothing to unload.

    // exit touch
    SWITCH_QuitTouch();
    // exit keyboard
    SWITCH_QuitKeyboard();
    // exit mouse
    SWITCH_QuitMouse();
    // exit software keyboard
    SWITCH_QuitSwkb();
    // exit psm service
    psmExit();
}

void
SWITCH_GetDisplayModes(_THIS, SDL_VideoDisplay *display)
{
    SDL_DisplayMode mode;

    // 1920x1080, default mode
    SDL_AddDisplayMode(display, &display->current_mode);

    // Match the engine's logical resolution (960x540): the software renderer
    // blits the whole frame every time, and a 1:1 blit is a row memcpy while
    // any scaling multiplies the cost several-fold. vi stretches the layer to
    // the panel/TV anyway.
    mode.w = 960;
    mode.h = 540;
    mode.refresh_rate = 60;
    mode.format = SDL_PIXELFORMAT_ABGR8888;
    SDL_AddDisplayMode(display, &mode);
}

int
SWITCH_SetDisplayMode(_THIS, SDL_VideoDisplay *display, SDL_DisplayMode *mode)
{
    /* Software-render build: accept the requested mode; the NWindow buffer
     * geometry is fixed by the vi service, nothing to recreate here. */
    (void)mode;
    return 0;
}

int
SWITCH_CreateWindow(_THIS, SDL_Window *window)
{
    Result rc;
    SDL_WindowData *window_data = NULL;
    NWindow *nWindow = NULL;

    swdbg("CreateWindow %dx%d flags=%x", window->w, window->h, window->flags);

    if (switch_window != NULL) {
        return SDL_SetError("Switch only supports one window");
    }

    window_data = (SDL_WindowData *) SDL_calloc(1, sizeof(SDL_WindowData));
    if (window_data == NULL) {
        return SDL_OutOfMemory();
    }

    nWindow = nwindowGetDefault();
    if (nWindow == NULL) {
        SDL_free(window_data);
        return SDL_SetError("nwindowGetDefault returned NULL (vi not ready?)");
    }

    rc = nwindowSetDimensions(nWindow, window->w, window->h);
    swdbg("nwindowSetDimensions(%dx%d) = 0x%x", window->w, window->h, rc);
    if (R_FAILED(rc)) {
        SDL_free(window_data);
        return SDL_SetError("Could not set NWindow dimensions %dx%d: 0x%x", window->w, window->h, rc);
    }

    /* Setup driver data for this window */
    window->driverdata = window_data;
    switch_window = window;

    /* starting operation mode */
    operationMode = appletGetOperationMode();

    /* One window, it always has focus */
    SDL_SetMouseFocus(window);
    SDL_SetKeyboardFocus(window);

    /* Window has been successfully created */
    return 0;
}

void
SWITCH_DestroyWindow(_THIS, SDL_Window *window)
{
    SDL_WindowData *data = (SDL_WindowData *) window->driverdata;

    if (window == switch_window) {
        if (data != NULL) {
            if(window->driverdata != NULL) {
                SDL_free(window->driverdata);
                window->driverdata = NULL;
            }
        }
        switch_window = NULL;
    }
}

int
SWITCH_CreateWindowFrom(_THIS, SDL_Window *window, const void *data)
{
    return -1;
}

/* --- Software window framebuffer (SDL_GetWindowSurface path) --- */

static int
SWITCH_CreateWindowFramebuffer(_THIS, SDL_Window *window, Uint32 *format, void **pixels, int *pitch)
{
    Result rc;

    if (sw_fb_ready) {
        /* Only one framebuffer per process. */
        return 0;
    }

    NWindow* nw = nwindowGetDefault();
    if (nw == NULL) {
        return SDL_SetError("switchfb: no default NWindow");
    }

    /* SDL 2.28 passes w/h in the window; make sure they are set. */
    if (window->w <= 0 || window->h <= 0) {
        return SDL_SetError("switchfb: bad window size %dx%d", window->w, window->h);
    }

    rc = framebufferCreate(&sw_fb, nw, window->w, window->h, PIXEL_FORMAT_RGBA_8888, 2);
    swdbg("framebufferCreate(%dx%d) = 0x%x", window->w, window->h, rc);
    if (R_FAILED(rc)) {
        return SDL_SetError("switchfb: framebufferCreate failed: 0x%x", rc);
    }

    rc = framebufferMakeLinear(&sw_fb);
    swdbg("framebufferMakeLinear = 0x%x", rc);
    if (R_FAILED(rc)) {
        framebufferClose(&sw_fb);
        return SDL_SetError("switchfb: framebufferMakeLinear failed: 0x%x", rc);
    }

    sw_fb_stride = sw_fb.width_aligned * 4;
    sw_fb_shadow = framebufferBegin(&sw_fb, NULL);
    swdbg("framebufferBegin -> %p stride=%u", sw_fb_shadow, sw_fb_stride);
    if (sw_fb_shadow == NULL) {
        framebufferClose(&sw_fb);
        return SDL_SetError("switchfb: framebufferBegin returned NULL");
    }

    sw_fb_ready = true;

    /* See the display-mode comment: SDL format whose little-endian memory
     * order matches HOS PIXEL_FORMAT_RGBA_8888 (R,G,B,A bytes) is ABGR8888. */
    *format = SDL_PIXELFORMAT_ABGR8888;
    *pixels = sw_fb_shadow;
    *pitch = (int)sw_fb_stride;
    return 0;
}

static int
SWITCH_UpdateWindowFramebuffer(_THIS, SDL_Window *window, const SDL_Rect *rects, int numrects)
{
    if (!sw_fb_ready) {
        return 0;
    }
    /* Present the whole shadow buffer; the engine redraws it fully anyway and
     * the bounding box of many small dirty rects costs more than the copy. */
    framebufferEnd(&sw_fb);
    sw_fb_shadow = framebufferBegin(&sw_fb, NULL);
    if (sw_fb_shadow == NULL) {
        return SDL_SetError("switchfb: framebufferBegin returned NULL");
    }
    window->surface->pixels = sw_fb_shadow;
    window->surface->pitch = (int)sw_fb_stride;
    return 0;
}

static void
SWITCH_DestroyWindowFramebuffer(_THIS, SDL_Window *window)
{
    if (sw_fb_ready) {
        framebufferEnd(&sw_fb);
        framebufferClose(&sw_fb);
        sw_fb_ready = false;
        sw_fb_shadow = NULL;
        sw_fb_stride = 0;
    }
}

void
SWITCH_SetWindowTitle(_THIS, SDL_Window *window)
{
}
void
SWITCH_SetWindowIcon(_THIS, SDL_Window *window, SDL_Surface *icon)
{
}
void
SWITCH_SetWindowPosition(_THIS, SDL_Window *window)
{
}
void
SWITCH_SetWindowSize(_THIS, SDL_Window *window)
{
    NWindow *nWindow = nwindowGetDefault();
    if (window->w > 0 && window->h > 0) {
        nwindowSetDimensions(nWindow, window->w, window->h);
    }
}
void
SWITCH_ShowWindow(_THIS, SDL_Window *window)
{
}
void
SWITCH_HideWindow(_THIS, SDL_Window *window)
{
}
void
SWITCH_RaiseWindow(_THIS, SDL_Window *window)
{
}
void
SWITCH_MaximizeWindow(_THIS, SDL_Window *window)
{
}
void
SWITCH_MinimizeWindow(_THIS, SDL_Window *window)
{
}
void
SWITCH_RestoreWindow(_THIS, SDL_Window *window)
{
}
void
SWITCH_SetWindowGrab(_THIS, SDL_Window *window, SDL_bool grabbed)
{
}

void
SWITCH_PumpEvents(_THIS)
{
    AppletOperationMode om;

    if (!appletMainLoop()) {
        SDL_Event ev;
        ev.type = SDL_QUIT;
        SDL_PushEvent(&ev);
        return;
    }

    // we don't want other inputs overlapping with software keyboard
    if(!SDL_IsTextInputActive()) {
        // Touch is polled by the game itself (switch_handle_touch reads HID
        // directly and synthesises logical-space mouse events); the SDL
        // touch->finger path here fed a competing engine-side bridge.
        // SWITCH_PollTouch();
        SWITCH_PollKeyboard();
        SWITCH_PollMouse();
    }
    SWITCH_PollSwkb();

    // handle docked / un-docked modes
    // note that SDL_WINDOW_RESIZABLE is only possible in windowed mode,
    // so we don't care about current fullscreen/windowed status
    if(switch_window != NULL && switch_window->flags & SDL_WINDOW_RESIZABLE) {
        om = appletGetOperationMode();
        if(om != operationMode) {
            operationMode = om;
            // Keep the framebuffer at the logical 960x540 in both handheld
            // and docked modes (1:1 software blit; vi stretches to the
            // display). Docked 1080p/720p can be re-enabled once a GPU render
            // backend exists.
            SDL_SetWindowSize(switch_window, 960, 540);
        }
    }
}

#endif /* SDL_VIDEO_DRIVER_SWITCH */
