#ifndef PLATFORM_SWITCH_H
#define PLATFORM_SWITCH_H

#ifdef __SWITCH__

#include "SDL.h"

#define SWITCH_DISPLAY_WIDTH 960
#define SWITCH_DISPLAY_HEIGHT 540
#define SWITCH_PIXEL_WIDTH 1920
#define SWITCH_PIXEL_HEIGHT 1080

typedef struct {
    SDL_Texture* texture;
    int hotspot_x;
    int hotspot_y;
} switch_cursor;

extern switch_cursor* current_cursor; // defined in switch/cursor.cpp

// Renderer/texture globals shared by switch/screen.cpp and switch/cursor.cpp.
// (Previously two anonymous-struct externs with mismatched layouts.)
struct switch_sdl_globals_t {
    SDL_Renderer* renderer;
    SDL_Texture* texture_ui;
    SDL_Texture* texture_city;
};
extern switch_sdl_globals_t g_switch_sdl;

#endif // __SWITCH__
#endif // PLATFORM_SWITCH_H
