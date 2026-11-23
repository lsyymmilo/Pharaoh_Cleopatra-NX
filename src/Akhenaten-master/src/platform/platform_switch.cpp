#include "platform.h"

#if defined(GAME_PLATFORM_NSWITCH)

#include "input/touch.h"
#include "platform/switch/switch_input.h"

#include <SDL.h>

// -----------------------------------------------------------------------------
// Port additions: symbols that are referenced unconditionally from
// platform.cpp / platform_js.cpp / innoextract_util.cpp / app_updater.cpp.
// The other platform_*_unix/windows files are compiled with platform guards
// that exclude __SWITCH__, so these must live here.
// -----------------------------------------------------------------------------

void platform_resolve_user_directory(bstring512& dir) {
    // Writable location next to the NRO: saves, config, logs.
    dir = "sdmc:/switch/pharaoh/";
}

void platform_t::open_url(pcstr url, pcstr prefix) {
    (void)url; (void)prefix;
}

pcstr platform_t::get_steam_path() {
    return {};
}

uint64_t platform_t::get_qpc() {
    return SDL_GetPerformanceCounter();
}

uint64_t platform_t::get_qpf() {
    return SDL_GetPerformanceFrequency();
}

void platform_t::init_timers() {
    const uint64_t freq = get_qpf();
    qpc_per_second = freq;
    qpc_per_milisec = freq / 1000u;
    qpc_per_microsec = freq / 1000000u;
    _qpc_per_second = freq;
    _qpc_base = get_qpc();
    start_time_ms = platform.get_elapsed_ms();
}

uint32_t platform_init_sdl_flags() {
    // SDL_INIT_JOYSTICK: switch_poll_event translates pad buttons.
    // SDL_INIT_AUDIO: the audren-backed "switch" audio driver is compiled in
    // (SDL_switchaudio.c, audrenInitialize in OpenDevice) — sound.cpp's
    // Mix_OpenAudio needs the audio subsystem up or the game runs silent.
    return SDL_INIT_JOYSTICK | SDL_INIT_AUDIO;
}

void platform_post_hint_init() {
}

void platform_setup_begin() {
}

void platform_run_init_callback() {
    // NOT touchpad: the touchpad emulator's handle_emulated_mouse_clicks()
    // runs on EVERY frame without touch and its default branch calls
    // mouse::reset_button_state() — which wipes the system_change flags our
    // SDL mouse events (A/B buttons, touch mapping in switch_input.cpp) had
    // just set. The logo screen's "advance on __mouse.left.went_up" could
    // therefore never trigger. Direct mode keeps our synthetic mouse events
    // authoritative; the touch layer then only handles real fingers.
    g_touch.set_mode(e_touch_mode::direct);
}

void platform_run_per_frame_callback() {
    platform_per_frame_callback();
}

int platform_poll_event(CoreEvent* event) {
    return switch_poll_event(reinterpret_cast<SDL_Event*>(event));
}

pcstr platform_request_initial_data_directory() {
    // The GOG Pharaoh install lives at sdmc:/switch/pharaoh/assets.
    return "sdmc:/switch/pharaoh/assets";
}

extern "C" int switch_boot_log(const char* fmt, ...);

void platform_append_startup_log(pcstr message) {
    switch_boot_log("startup: %s", message);
}

void platform_hide_startup_log() {
}

bool platform_run_main_loop(platform_pump_frame_cb pump_frame, platform_should_continue_cb should_continue) {
    while (should_continue()) {
        pump_frame();
    }
    return true;
}

void platform_show_virtual_keyboard(const uint8_t *text, int max_length) {
    switch_show_virtual_keyboard(text, max_length);
}

void platform_hide_virtual_keyboard(void) {
    switch_hide_virtual_keyboard();
}

#endif
