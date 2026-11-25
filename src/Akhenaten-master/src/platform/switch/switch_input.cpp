#include "switch_input.h"
#include "switch.h"
#include <cmath>
#include <switch.h>

#include "core/calc.h"
#include "core/encoding.h"
#include "graphics/screen.h"
#include "input/keyboard.h"
#include "input/mouse.h"
#include "input/touch.h"

extern "C" int switch_boot_log(const char* fmt, ...);

// Direct pad state for the OpenRCT2-style button bridge (padGetButtons needs
// a polled PadState; the SDL joystick driver owns its own, so keep a second
// one here and update it in the same per-frame callback).
static PadState bridge_pad;
static bool bridge_pad_ready = false;
void switch_poll_pad_buttons_direct(void);

static void switch_bridge_pad_init(void) {
    if (bridge_pad_ready) {
        return;
    }
    padInitializeDefault(&bridge_pad);
    bridge_pad_ready = true;
}

// Cursor position in LOGICAL screen space (screen_width() x screen_height(),
// 960x540): the engine mouse coordinates and the visible software cursor both
// live there. Synthetic motion/button events are pushed with windowID 0 so
// SDL's renderer event watch (which only remaps events carrying the renderer
// window's ID) never touches them — window coords here used to make the cursor
// land 1.33x away from the finger.
static int cursor_window_x = -1;
static int cursor_window_y = -1;
static void switch_cursor_ensure_init(void);

// The event watch only rescales events whose windowID matches the renderer's
// window. Synthetic events pushed with windowID 0 bypassed the logical-size
// mapping entirely — the engine then saw raw window coords (y=573 on a
// 480-logical screen), pinning the cursor off-screen: no visible pointer and
// clicks could never hit any UI element.
static Uint32 switch_active_window_id(void) {
    SDL_Window* win = SDL_GetKeyboardFocus();
    if (win) {
        return SDL_GetWindowID(win);
    }
    return 0;
}

// Window-size helper removed: touch and analog events now work in the
// engine's LOGICAL space directly (see switch_handle_touch).

static void switch_cursor_ensure_init(void) {
    if (cursor_window_x < 0) {
        cursor_window_x = screen_width() / 2;
        cursor_window_y = screen_height() / 2;
    }
}

// Touch -> mouse mapping (handheld: the primary input for menus).
// Touch panel native space is 1280x720, but the engine works in LOGICAL space
// (screen_width() x screen_height(), 960x540). Events are pushed with
// windowID 0: SDL's renderer event watch only remaps events whose windowID
// matches the renderer window, so our already-logical coords pass straight to
// the engine (and the drawn cursor) with no second scaling.
// Single tap = left button; double tap (<320 ms, <40 px apart) = right button.
// NOTE: the Switch touch panel is single-touch hardware — two-finger taps
// cannot be read; double tap is the equivalent gesture.
static void switch_handle_touch(void) {
    static int touch_was_down = 0;
    static int touch_left_down = 0;
    static int touch_probe_logged = 0;
    static Uint32 last_tap_tick = 0;
    static int last_tap_x = -1000;
    static int last_tap_y = -1000;

    HidTouchScreenState ts;
    size_t n = hidGetTouchScreenStates(&ts, 1);
    int touched = (n > 0 && ts.count > 0);

    if (touched && !touch_probe_logged) {
        switch_boot_log("inp: touch first x=%d y=%d count=%u", ts.touches[0].x, ts.touches[0].y, (unsigned)ts.count);
        touch_probe_logged = 1;
    }

    const int lw = screen_width();
    const int lh = screen_height();
    switch_cursor_ensure_init();

    if (touched) {
        int x = (int)(((int64_t)ts.touches[0].x * lw) / 1280);
        int y = (int)(((int64_t)ts.touches[0].y * lh) / 720);
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        if (x > lw - 1) { x = lw - 1; }
        if (y > lh - 1) { y = lh - 1; }
        int xrel = x - cursor_window_x;
        int yrel = y - cursor_window_y;
        cursor_window_x = x;
        cursor_window_y = y;

        SDL_Event ev;
        SDL_zero(ev);
        ev.type = SDL_MOUSEMOTION;
        ev.motion.windowID = 0; // logical coords already — bypass the renderer watch
        ev.motion.x = x;
        ev.motion.y = y;
        ev.motion.xrel = xrel;
        ev.motion.yrel = yrel;
        SDL_PushEvent(&ev);

        if (!touch_was_down) {
            const Uint32 now = SDL_GetTicks();
            const int dx = x - last_tap_x;
            const int dy = y - last_tap_y;
            const bool is_double = last_tap_tick && (now - last_tap_tick) < 320
                && dx > -40 && dx < 40 && dy > -40 && dy < 40;

#if defined(GAME_PLATFORM_NSWITCH)
            {
                static int s_tap_probes = 0;
                if (s_tap_probes < 8) {
                    s_tap_probes++;
                    switch_boot_log("inp: tap raw=(%d,%d) logical=(%d,%d) screen=%dx%d%s",
                                    ts.touches[0].x, ts.touches[0].y, x, y, lw, lh,
                                    is_double ? " double->right" : " left");
                }
            }
#endif

            SDL_zero(ev);
            ev.type = SDL_MOUSEBUTTONDOWN;
            ev.button.windowID = 0;
            ev.button.state = SDL_PRESSED;
            ev.button.x = x;
            ev.button.y = y;
            if (is_double) {
                // Right click as one complete press+release; the tap's left
                // click is suppressed (touch_left_down stays 0 until release).
                ev.button.button = SDL_BUTTON_RIGHT;
                ev.button.clicks = 2;
                SDL_PushEvent(&ev);
                ev.type = SDL_MOUSEBUTTONUP;
                ev.button.state = SDL_RELEASED;
                SDL_PushEvent(&ev);
                last_tap_tick = 0; // a third quick tap starts a new single tap
            } else {
                ev.button.button = SDL_BUTTON_LEFT;
                ev.button.clicks = 1;
                SDL_PushEvent(&ev);
                touch_left_down = 1;
            }
        }
        touch_was_down = 1;
    } else if (touch_was_down) {
        if (touch_left_down) {
            SDL_Event ev;
            SDL_zero(ev);
            ev.type = SDL_MOUSEBUTTONUP;
            ev.button.windowID = 0;
            ev.button.button = SDL_BUTTON_LEFT;
            ev.button.state = SDL_RELEASED;
            ev.button.clicks = 1;
            ev.button.x = cursor_window_x;
            ev.button.y = cursor_window_y;
            SDL_PushEvent(&ev);
        }
        touch_was_down = 0;
        touch_left_down = 0;
        last_tap_tick = SDL_GetTicks();
        last_tap_x = cursor_window_x;
        last_tap_y = cursor_window_y;
    }
}

#define NO_MAPPING 0xFF
#define MAX_VKBD_TEXT_SIZE 600

enum {
    SWITCH_PAD_A = 0,
    SWITCH_PAD_B = 1,
    SWITCH_PAD_X = 2,
    SWITCH_PAD_Y = 3,
    SWITCH_LSTICK = 4,
    SWITCH_RSTICK = 5,
    SWITCH_PAD_L = 6,
    SWITCH_PAD_R = 7,
    SWITCH_PAD_ZL = 8,
    SWITCH_PAD_ZR = 9,
    SWITCH_PAD_PLUS = 10,
    SWITCH_PAD_MINUS = 11,
    SWITCH_PAD_LEFT = 12,
    SWITCH_PAD_UP = 13,
    SWITCH_PAD_RIGHT = 14,
    SWITCH_PAD_DOWN = 15,
    SWITCH_NUM_BUTTONS = 16
};

enum { ANALOG_LEFT = 0, ANALOG_UP = 1, ANALOG_RIGHT = 2, ANALOG_DOWN = 3, ANALOG_MAX = 4 };

static int can_change_touch_mode = 1;

static SDL_Joystick* joy = NULL;

static struct {
    char utf8_text[MAX_VKBD_TEXT_SIZE];
    int requested;
    int max_length;
    uint8_t* target_text; // captured internal buffer to write the swkbd result into
} vkbd;

static float hires_dx = 0.0f; // sub-pixel accumulator: slow pushes glide instead of stepping
static float hires_dy = 0.0f;
static int fast_mouse = 0;
static int slow_mouse = 0;
static int pressed_buttons[SWITCH_NUM_BUTTONS];
static int right_analog_state[ANALOG_MAX];
static SDL_Keycode map_switch_button_to_sdlkey[SWITCH_NUM_BUTTONS] = {
  NO_MAPPING,    // SWITCH_PAD_A
  NO_MAPPING,    // SWITCH_PAD_B
  SDLK_PAGEUP,   // SWITCH_PAD_X
  SDLK_PAGEDOWN, // SWITCH_PAD_Y
  NO_MAPPING,    // SWITCH_PAD_LSTICK
  NO_MAPPING,    // SWITCH_PAD_RSTICK
  NO_MAPPING,    // SWITCH_PAD_L
  NO_MAPPING,    // SWITCH_PAD_R
  NO_MAPPING,    // SWITCH_PAD_ZL
  NO_MAPPING,    // SWITCH_PAD_ZR
  NO_MAPPING,    // SWITCH_PAD_PLUS
  NO_MAPPING,    // SWITCH_PAD_MINUS
  SDLK_LEFT,     // SWITCH_PAD_LEFT
  SDLK_UP,       // SWITCH_PAD_UP
  SDLK_RIGHT,    // SWITCH_PAD_RIGHT
  SDLK_DOWN      // SWITCH_PAD_DOWN
};
#define ANALOG_DIRECTION_TO_SDLKEY_OFFSET 12

static uint8_t map_switch_button_to_sdlmousebutton[SWITCH_NUM_BUTTONS] = {
  SDL_BUTTON_LEFT,  // SWITCH_PAD_A
  SDL_BUTTON_RIGHT, // SWITCH_PAD_B
  NO_MAPPING,       // SWITCH_PAD_X
  NO_MAPPING,       // SWITCH_PAD_Y
  NO_MAPPING,       // SWITCH_PAD_LSTICK
  NO_MAPPING,       // SWITCH_PAD_RSTICK
  SDL_BUTTON_RIGHT, // SWITCH_PAD_L
  SDL_BUTTON_LEFT,  // SWITCH_PAD_R
  NO_MAPPING,       // SWITCH_PAD_ZL
  NO_MAPPING,       // SWITCH_PAD_ZR
  NO_MAPPING,       // SWITCH_PAD_PLUS
  NO_MAPPING,       // SWITCH_PAD_MINUS
  NO_MAPPING,       // SWITCH_PAD_LEFT
  NO_MAPPING,       // SWITCH_PAD_UP
  NO_MAPPING,       // SWITCH_PAD_RIGHT
  NO_MAPPING        // SWITCH_PAD_DOWN
};

static void switch_start_text_input(void);
static void switch_rescale_analog(int* x, int* y, int dead);
static void switch_button_to_sdlkey_event(int switch_button, SDL_Event* event, uint32_t event_type);
static void switch_button_to_sdlmouse_event(int switch_button, SDL_Event* event, uint32_t event_type);

static void switch_create_and_push_sdlkey_event(uint32_t event_type, SDL_Scancode scan, SDL_Keycode key);
static void switch_create_key_event_for_direction(int direction, int key_pressed);

void platform_per_frame_callback(void) {
    static int cb_probe_count = 0;
    if ((++cb_probe_count % 300) == 0) {
        switch_boot_log("inp: cb=%d joy=%d mx=%d my=%d", cb_probe_count, joy ? 1 : 0, mouse::get().x, mouse::get().y);
    }
    if (vkbd.requested) {
        switch_start_text_input();
        vkbd.requested = 0;
    }
    switch_handle_analog_sticks();
    switch_handle_touch();
    switch_poll_pad_buttons_direct();
}

// ---------------------------------------------------------------------------
// OpenRCT2-style direct pad->mouse bridge (fallback alongside the SDL event
// path): read the pad button state EVERY FRAME before window_draw's
// determine_button_state() runs, and write mouse::ref() button state directly.
// The SDL event path (switch_poll_event) already reaches mouse_module (probe:
// "mou: btn down/up" pairs) yet the logo screen never advanced — the event
// system_change flags are getting wiped somewhere between. This direct bridge
// makes the click flags immune to whatever consumed them: set_left_down /
// set_right_down set exactly the system_change bits determine_button_state
// converts to went_down/went_up in the same frame.
// ---------------------------------------------------------------------------
void switch_poll_pad_buttons_direct(void) {
    switch_bridge_pad_init();
    padUpdate(&bridge_pad);
    static bool a_was = false, b_was = false;
    u64 buttons = padGetButtons(&bridge_pad);
    const bool a_now = (buttons & HidNpadButton_A) != 0;
    const bool b_now = (buttons & HidNpadButton_B) != 0;

    if (a_now != a_was) {
        mouse::ref().set_left_down(a_now);
        a_was = a_now;
    }
    if (b_now != b_was) {
        mouse::ref().set_right_down(b_now);
        b_was = b_now;
    }
}

void switch_show_virtual_keyboard(const uint8_t *text, int max_length) {
    vkbd.max_length = calc_bound(max_length, 0, MAX_VKBD_TEXT_SIZE);
    encoding_to_utf8(text, vkbd.utf8_text, MAX_VKBD_TEXT_SIZE, 0);
    vkbd.target_text = const_cast<uint8_t*>(text);
    vkbd.requested = 1;
}

void switch_hide_virtual_keyboard(void) {
}

int switch_poll_event(SDL_Event* event) {
    int ret = SDL_PollEvent(event);
    if (event != NULL) {
        switch (event->type) {
        case SDL_JOYBUTTONDOWN:
            {
                static int joy_btn_probes = 0;
                if (joy_btn_probes < 3) {
                    switch_boot_log("inp: joy btn=%d which=%d", event->jbutton.button, event->jbutton.which);
                    joy_btn_probes++;
                }
            }
            if (event->jbutton.which != 0) { // Only Joystick 0 controls the game
                break;
            }
            switch (event->jbutton.button) {
            case SWITCH_PAD_Y:
            case SWITCH_PAD_X:
            case SWITCH_PAD_UP:
            case SWITCH_PAD_DOWN:
            case SWITCH_PAD_LEFT:
            case SWITCH_PAD_RIGHT: // intentional fallthrough
                switch_button_to_sdlkey_event(event->jbutton.button, event, SDL_KEYDOWN);
                break;
            case SWITCH_PAD_B:
            case SWITCH_PAD_R:
            case SWITCH_PAD_A:
            case SWITCH_PAD_L: // intentional fallthrough
                switch_button_to_sdlmouse_event(event->jbutton.button, event, SDL_MOUSEBUTTONDOWN);
                break;
            case SWITCH_PAD_ZL:
                fast_mouse = 1;
                hires_dx = 0;
                hires_dy = 0;
                break;
            case SWITCH_PAD_ZR:
                slow_mouse = 1;
                hires_dx = 0;
                hires_dy = 0;
                break;
            case SWITCH_PAD_PLUS:
                vkbd.requested = 1;
                break;
            case SWITCH_PAD_MINUS:
                if (can_change_touch_mode) {
                    g_touch.cycle_mode();
                    can_change_touch_mode = 0;
                }
                break;
            default:
                break;
            }
            break;
        case SDL_JOYBUTTONUP:
            if (event->jbutton.which != 0) { // Only Joystick 0 controls the game
                break;
            }
            switch (event->jbutton.button) {
            case SWITCH_PAD_Y:
            case SWITCH_PAD_X:
            case SWITCH_PAD_UP:
            case SWITCH_PAD_DOWN:
            case SWITCH_PAD_LEFT:
            case SWITCH_PAD_RIGHT: // intentional fallthrough
                switch_button_to_sdlkey_event(event->jbutton.button, event, SDL_KEYUP);
                break;
            case SWITCH_PAD_B:
            case SWITCH_PAD_R:
            case SWITCH_PAD_A:
            case SWITCH_PAD_L: // intentional fallthrough
                switch_button_to_sdlmouse_event(event->jbutton.button, event, SDL_MOUSEBUTTONUP);
                break;
            case SWITCH_PAD_ZL:
                fast_mouse = 0;
                hires_dx = 0;
                hires_dy = 0;
                break;
            case SWITCH_PAD_ZR:
                slow_mouse = 0;
                hires_dx = 0;
                hires_dy = 0;
                break;
            case SWITCH_PAD_MINUS:
                can_change_touch_mode = 1;
                break;
            default:
                break;
            }
        default:
            break;
        }
    }
    return ret;
}

void switch_handle_analog_sticks(void) {
    if (!joy) {
        int num = SDL_NumJoysticks();
        SDL_JoystickEventState(SDL_ENABLE);
        joy = SDL_JoystickOpen(0);
        switch_boot_log("inp: open n=%d rc=%d", num, joy ? 1 : 0);
    }
    int left_x = SDL_JoystickGetAxis(joy, 0);
    int left_y = SDL_JoystickGetAxis(joy, 1);
    static int axis_probe_count = 0;
    if ((++axis_probe_count % 300) == 1) {
        switch_boot_log("inp: axes %d,%d,%d,%d", left_x, left_y,
                        SDL_JoystickGetAxis(joy, 2), SDL_JoystickGetAxis(joy, 3));
    }
    switch_rescale_analog(&left_x, &left_y, 2000);

    // ---- analog cursor precision + smoothness --------------------------------
    // 1) radial dead zone: stick drift never nudges the pointer
    // 2) gamma response curve: a small push moves a fraction of a pixel per
    //    frame (fine aiming), full deflection still crosses the screen fast
    // 3) one-pole low-pass on the shaped axis: kills per-frame jitter
    // 4) float sub-pixel accumulator: slow motion glides instead of stepping
    //    (the old integer accumulator produced a visible 4-frame stutter at
    //    low speeds because statically-halved values never reached 1 px)
    {
        const float dead = 0.16f;
        const float gamma = 1.45f;
        const float smoothing = 0.62f;
        float raw_x = (float)left_x / 2000.0f;
        float raw_y = (float)left_y / 2000.0f;
        float mag = std::sqrt(raw_x * raw_x + raw_y * raw_y);
        float shaped_x = 0.0f;
        float shaped_y = 0.0f;
        if (mag > 0.0001f) {
            float m = (mag > 1.0f) ? 1.0f : mag;
            float t = 0.0f;
            if (m > dead) {
                t = (m - dead) / (1.0f - dead);
                t = std::pow(t, gamma);
            }
            shaped_x = (raw_x / mag) * t;
            shaped_y = (raw_y / mag) * t;
        }
        static float smooth_x = 0.0f;
        static float smooth_y = 0.0f;
        smooth_x += (shaped_x - smooth_x) * smoothing;
        smooth_y += (shaped_y - smooth_y) * smoothing;
        if (std::fabs(smooth_x) < 0.0005f) {
            smooth_x = 0.0f;
        }
        if (std::fabs(smooth_y) < 0.0005f) {
            smooth_y = 0.0f;
        }

        // Analog-cursor speed: joystick rescale caps |axis| at 2000, so slowdown
        // is the px-per-frame divisor in LOGICAL space (960x540). 245 ≈ 8.2 px
        // per frame at full tilt (screen crossed in ~2 s); gamma 1.45 keeps the
        // low end around 0.6–2 px/frame so small buttons stay clickable.
        // ZL (fast) ×3, ZR (slow) ÷8.
        int slowdown = 245;
        if (fast_mouse) {
            slowdown /= 3;
        }
        if (slow_mouse) {
            slowdown *= 8;
        }
        hires_dx += smooth_x * (2000.0f / (float)slowdown);
        hires_dy += smooth_y * (2000.0f / (float)slowdown);
    }

    if (hires_dx != 0.0f || hires_dy != 0.0f) {
        int xrel = (int)hires_dx;
        int yrel = (int)hires_dy;
        hires_dx -= (float)xrel;
        hires_dy -= (float)yrel;
        if (xrel != 0 || yrel != 0) {
            // Analog cursor in LOGICAL screen space (engine coordinates): same
            // space as the visible software cursor and the A/B click path.
            // windowID 0 bypasses the renderer's window->logical remap.
            switch_cursor_ensure_init();
            const int lw = screen_width();
            const int lh = screen_height();
            int x = cursor_window_x + xrel;
            int y = cursor_window_y + yrel;
            if (x < 0) {
                x = 0;
            }
            if (x >= lw) {
                x = lw - 1;
            }
            if (y < 0) {
                y = 0;
            }
            if (y >= lh) {
                y = lh - 1;
            }
            xrel = x - cursor_window_x;
            yrel = y - cursor_window_y;
            cursor_window_x = x;
            cursor_window_y = y;
            SDL_Event event;
            SDL_zero(event);
            event.type = SDL_MOUSEMOTION;
            event.motion.windowID = 0;
            event.motion.x = x;
            event.motion.y = y;
            event.motion.xrel = xrel;
            event.motion.yrel = yrel;
            SDL_PushEvent(&event);
        }
    }

    // map right stick to cursor keys
    float right_x = SDL_JoystickGetAxis(joy, 2);
    float right_y = -1 * SDL_JoystickGetAxis(joy, 3);
    float right_joy_dead_zone_squared = 10240.0 * 10240.0;
    float slope = 0.414214f; // tangent of 22.5 degrees for size of angular zones

    int direction_states[ANALOG_MAX] = {0, 0, 0, 0};

    if (right_x * right_x + right_y * right_y > right_joy_dead_zone_squared) {
        if (right_y > 0 && right_x > 0) {
            // upper right quadrant
            if (right_y > slope * right_x) {
                direction_states[ANALOG_UP] = 1;
            }
            if (right_x > slope * right_y) {
                direction_states[ANALOG_RIGHT] = 1;
            }
        } else if (right_y > 0 && right_x <= 0) {
            // upper left quadrant
            if (right_y > slope * -right_x) {
                direction_states[ANALOG_UP] = 1;
            }
            if (-right_x > slope * right_y) {
                direction_states[ANALOG_LEFT] = 1;
            }
        } else if (right_y <= 0 && right_x > 0) {
            // lower right quadrant
            if (-right_y > slope * right_x) {
                direction_states[ANALOG_DOWN] = 1;
            }
            if (right_x > slope * -right_y) {
                direction_states[ANALOG_RIGHT] = 1;
            }
        } else if (right_y <= 0 && right_x <= 0) {
            // lower left quadrant
            if (-right_y > slope * -right_x) {
                direction_states[ANALOG_DOWN] = 1;
            }
            if (-right_x > slope * -right_y) {
                direction_states[ANALOG_LEFT] = 1;
            }
        }
    }

    for (int direction = 0; direction < ANALOG_MAX; ++direction) {
        if (right_analog_state[direction] != direction_states[direction]) {
            right_analog_state[direction] = direction_states[direction];
            switch_create_key_event_for_direction(direction, direction_states[direction]);
        }
    }
}

static int switch_keyboard_get(char* title, char* buffer, int max_len) {
    Result rc = 0;

#if defined(GAME_PLATFORM_NSWITCH)
    switch_boot_log("vkbd: swkbdCreate next (len=%d)", max_len);
#endif

    SwkbdConfig kbd;

    rc = swkbdCreate(&kbd, 0);

#if defined(GAME_PLATFORM_NSWITCH)
    switch_boot_log("vkbd: swkbdCreate rc=%x", (unsigned)rc);
#endif
    if (R_SUCCEEDED(rc)) {
        swkbdConfigMakePresetDefault(&kbd);
        swkbdConfigSetInitialText(&kbd, buffer);
        rc = swkbdShow(&kbd, buffer, max_len);
#if defined(GAME_PLATFORM_NSWITCH)
        switch_boot_log("vkbd: swkbdShow rc=%x first='%.16s'", (unsigned)rc, buffer);
#endif
        swkbdClose(&kbd);
    }
    return R_SUCCEEDED(rc);
}

static void switch_start_text_input(void) {
    if (!switch_keyboard_get("Enter New Text:", vkbd.utf8_text, vkbd.max_length))
        return;
#if defined(GAME_PLATFORM_NSWITCH)
    switch_boot_log("vkbd: text '%.32s' -> direct buffer write", vkbd.utf8_text);
#endif
    // Direct buffer write instead of the original 2*MAX_VKBD_TEXT_SIZE backspace/
    // delete SDL event storm + per-character TEXTINPUT injection: that path ran
    // the keyboard capture's 2-byte "multibyte" assumptions over real 3-byte
    // UTF-8 CJK, splitting characters, planting NULs mid-string and freezing
    // the app. Writing the result buffer directly and refreshing the capture
    // is exact and cheap. The capture must still own the cached buffer
    // (window may have closed while the modal swkbd was up).
    if (vkbd.target_text && g_keyboard.is_capturing_buffer(vkbd.target_text) && vkbd.max_length > 0) {
        int n = 0;
        for (; n < vkbd.max_length - 1 && vkbd.utf8_text[n]; ++n) {
            vkbd.target_text[n] = (uint8_t)vkbd.utf8_text[n];
        }
        vkbd.target_text[n] = 0;
        g_keyboard.refresh();
    } else {
#if defined(GAME_PLATFORM_NSWITCH)
        switch_boot_log("vkbd: write skipped (capture moved on)");
#endif
    }
}

static void switch_rescale_analog(int* x, int* y, int dead) {
    // radial and scaled dead_zone
    // http://www.third-helix.com/2013/04/12/doing-thumbstick-dead-zones-right.html
    // input and output values go from -32767...+32767;

    // the maximum is adjusted to account for SCE_CTRL_MODE_DIGITALANALOG_WIDE
    // where a reported maximum axis value corresponds to 80% of the full range
    // of motion of the analog stick

    if (dead == 0)
        return;
    if (dead >= 32767) {
        *x = 0;
        *y = 0;
        return;
    }

    const float max_axis = 32767.0f;
    float analog_x = (float)*x;
    float analog_y = (float)*y;
    float dead_zone = (float)dead;

    float magnitude = sqrtf(analog_x * analog_x + analog_y * analog_y);
    if (magnitude >= dead_zone) {
        // adjust maximum magnitude
        float abs_analog_x = fabs(analog_x);
        float abs_analog_y = fabs(analog_y);
        float max_x;
        float max_y;
        if (abs_analog_x > abs_analog_y) {
            max_x = max_axis;
            max_y = (max_axis * analog_y) / abs_analog_x;
        } else {
            max_x = (max_axis * analog_x) / abs_analog_y;
            max_y = max_axis;
        }
        float maximum = sqrtf(max_x * max_x + max_y * max_y);
        if (maximum > 1.25f * max_axis)
            maximum = 1.25f * max_axis;
        if (maximum < magnitude)
            maximum = magnitude;

        // find scaled axis values with magnitudes between zero and maximum
        float scalingFactor = maximum / magnitude * (magnitude - dead_zone) / (maximum - dead_zone);
        analog_x = (analog_x * scalingFactor);
        analog_y = (analog_y * scalingFactor);

        // clamp to ensure results will never exceed the max_axis value
        float clamping_factor = 1.0f;
        abs_analog_x = fabs(analog_x);
        abs_analog_y = fabs(analog_y);
        if (abs_analog_x > max_axis || abs_analog_y > max_axis) {
            if (abs_analog_x > abs_analog_y) {
                clamping_factor = max_axis / abs_analog_x;
            } else {
                clamping_factor = max_axis / abs_analog_y;
            }
        }
        *x = (int)(clamping_factor * analog_x);
        *y = (int)(clamping_factor * analog_y);
    } else {
        *x = 0;
        *y = 0;
    }
}

static void switch_button_to_sdlkey_event(int switch_button, SDL_Event* event, uint32_t event_type) {
    event->type = event_type;
    event->key.keysym.sym = map_switch_button_to_sdlkey[switch_button];
    event->key.keysym.mod = 0;
    event->key.repeat = 0;

    if (event_type == SDL_KEYDOWN) {
        pressed_buttons[switch_button] = 1;
    }
    if (event_type == SDL_KEYUP) {
        pressed_buttons[switch_button] = 0;
    }
}

static void switch_button_to_sdlmouse_event(int switch_button, SDL_Event* event, uint32_t event_type) {
    event->type = event_type;
    event->button.button = map_switch_button_to_sdlmousebutton[switch_button];
    event->button.windowID = switch_active_window_id();
    event->button.which = 0; // genuine mouse device (queue leftover was 256; must differ from SDL_TOUCH_MOUSEID)
    event->button.clicks = 1;
    if (event_type == SDL_MOUSEBUTTONDOWN) {
        event->button.state = SDL_PRESSED;
        pressed_buttons[switch_button] = 1;
    }
    if (event_type == SDL_MOUSEBUTTONUP) {
        event->button.state = SDL_RELEASED;
        pressed_buttons[switch_button] = 0;
    }
    // LOGICAL coords: this event is rewritten in place AFTER SDL_PollEvent, so
    // the renderer's logical-size event watch (which converts window->logical
    // for SDL_PushEvent'ed touch/motion events) never sees it. mouse::get()
    // is the logical position the visible software cursor is drawn at — the
    // click must land exactly there. Window-space coords here made every A/B
    // click land at a different spot than the cursor (probe: mou: btn down at
    // 1622,510 on a 1280x720 logical screen = always a miss).
    event->button.x = mouse::get().x;
    event->button.y = mouse::get().y;
}

static void switch_create_and_push_sdlkey_event(uint32_t event_type, SDL_Scancode scan, SDL_Keycode key) {
    SDL_Event event;
    event.type = event_type;
    event.key.keysym.scancode = scan;
    event.key.keysym.sym = key;
    event.key.keysym.mod = 0;
    SDL_PushEvent(&event);
}

static void switch_create_key_event_for_direction(int direction, int key_pressed) {
    uint32_t event_type = key_pressed ? SDL_KEYDOWN : SDL_KEYUP;
    switch (direction) {
    case ANALOG_UP:
        switch_create_and_push_sdlkey_event(event_type, SDL_SCANCODE_UP, SDLK_UP);
        break;
    case ANALOG_DOWN:
        switch_create_and_push_sdlkey_event(event_type, SDL_SCANCODE_DOWN, SDLK_DOWN);
        break;
    case ANALOG_LEFT:
        switch_create_and_push_sdlkey_event(event_type, SDL_SCANCODE_LEFT, SDLK_LEFT);
        break;
    case ANALOG_RIGHT:
        switch_create_and_push_sdlkey_event(event_type, SDL_SCANCODE_RIGHT, SDLK_RIGHT);
        break;
    }
}
