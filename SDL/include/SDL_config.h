/*
    SDL - Switch software-render build configuration (generated for this port)
*/
#ifndef SDL_config_h_
#define SDL_config_h_

#include "SDL_platform.h"

/* Switch port: software renderer, libnx pthreads (devkitPro newlib) */

/* -- enabled drivers -- */
#define SDL_AUDIO_DRIVER_SWITCH 1
#define SDL_JOYSTICK_SWITCH 1
#define SDL_VIDEO_DRIVER_SWITCH 1
#define SDL_FILESYSTEM_SWITCH 1
#define SDL_POWER_SWITCH 1
#define SDL_TIMER_SWITCH 1
#define SDL_VIDEO_RENDER_SW 1
#define SDL_THREAD_PTHREAD 1
#define SDL_SEM_PTHREADS 1
#define HAVE_GCC_ATOMICS 1
#define HAVE_GCC_SYNC_LOCK_TEST_AND_SET 1

/* -- disabled subsystems -- */
#define SDL_HAPTIC_DISABLED 1
#define SDL_SENSOR_DISABLED 1
#define SDL_LOADSO_DISABLED 1
#define SDL_CPUINFO_DISABLED 1
#define SDL_LOCALE_DISABLED 1
#define SDL_MISC_DISABLED 1
#define SDL_DYNAMIC_API 0
#define SDL_VIDEO_OPENGL 0
#define SDL_VIDEO_OPENGL_ES 0
#define SDL_VIDEO_OPENGL_ES2 0
#define SDL_VIDEO_OPENGL_BGL 0
#define SDL_VIDEO_OPENGL_CGL 0
#define SDL_VIDEO_OPENGL_GLX 0
#define SDL_VIDEO_OPENGL_WGL 0
#define SDL_VIDEO_OPENGL_EGL 0
#define SDL_RENDER_DISABLED 0
#define SDL_TIMERS_DISABLED 0

/* -- libc (newlib) -- */
#define HAVE_LIBC 1
#define HAVE_ALLOCA_H 1
#define HAVE_SYS_TYPES_H 1
#define HAVE_STDIO_H 1
#define STDC_HEADERS 1
#define HAVE_STDLIB_H 1
#define HAVE_STDARG_H 1
#define HAVE_MALLOC_H 1
#define HAVE_MEMORY_H 1
#define HAVE_STRING_H 1
#define HAVE_STRINGS_H 1
#define HAVE_INTTYPES_H 1
#define HAVE_STDINT_H 1
#define HAVE_CTYPE_H 1
#define HAVE_MATH_H 1
#define HAVE_FLOAT_H 1
#define HAVE_SIGNAL_H 1
#define HAVE_UNISTD_H 1

#define HAVE_MALLOC 1
#define HAVE_CALLOC 1
#define HAVE_REALLOC 1
#define HAVE_FREE 1
#define HAVE_ALLOCA 1
#define HAVE_QSORT 1
#define HAVE_ABS 1
#define HAVE_MEMSET 1
#define HAVE_MEMCPY 1
#define HAVE_MEMMOVE 1
#define HAVE_MEMCMP 1
#define HAVE_MEMCHR 1
#define HAVE_STRLEN 1
#define HAVE_STRLCPY 1
#define HAVE_STRLCAT 1
#define HAVE_STRDUP 1
#define HAVE_STRCHR 1
#define HAVE_STRRCHR 1
#define HAVE_STRSTR 1
#define HAVE_STRTOL 1
#define HAVE_STRTOUL 1
#define HAVE_STRTOLL 1
#define HAVE_STRTOULL 1
#define HAVE_STRTOD 1
#define HAVE_ATOI 1
#define HAVE_ATOF 1
#define HAVE_STRCMP 1
#define HAVE_STRNCMP 1
#define HAVE_STRCASECMP 1
#define HAVE_STRNCASECMP 1
#define HAVE_SSCANF 1
#define HAVE_VSSCANF 1
#define HAVE_SNPRINTF 1
#define HAVE_VSNPRINTF 1
#define HAVE_VA_COPY 1
#define HAVE__VA_COPY 1
#define HAVE_FSEEKO 1
#define HAVE_FTELL 1
#define HAVE_FSEEK 1
#define HAVE_FOPEN 1
#define HAVE_FCLOSE 1
#define HAVE_FREAD 1
#define HAVE_FWRITE 1
#define HAVE_FFLUSH 1
#define HAVE_REWIND 1
#define HAVE_FPUTS 1
#define HAVE_FPUTC 1
#define HAVE_UNSETENV 1
#define HAVE_SETENV 1
#define HAVE_GETENV 1
#define HAVE_ATAN 1
#define HAVE_ATAN2 1
#define HAVE_ACOS 1
#define HAVE_ASIN 1
#define HAVE_CEIL 1
#define HAVE_COPYSIGN 1
#define HAVE_COS 1
#define HAVE_EXP 1
#define HAVE_FABS 1
#define HAVE_FLOOR 1
#define HAVE_FMOD 1
#define HAVE_LOG 1
#define HAVE_LOG10 1
#define HAVE_POW 1
#define HAVE_SCALBN 1
#define HAVE_SIN 1
#define HAVE_SQRT 1
#define HAVE_SQRTF 1
#define HAVE_TAN 1
#define HAVE_ACOSF 1
#define HAVE_ASINF 1
#define HAVE_ATANF 1
#define HAVE_ATAN2F 1
#define HAVE_CEILF 1
#define HAVE_COPYSIGNF 1
#define HAVE_COSF 1
#define HAVE_EXPF 1
#define HAVE_FABSF 1
#define HAVE_FLOORF 1
#define HAVE_FMODF 1
#define HAVE_LOGF 1
#define HAVE_LOG10F 1
#define HAVE_POWF 1
#define HAVE_SCALBNF 1
#define HAVE_SINF 1
#define HAVE_TANF 1
#define HAVE_M_PI 1
#define HAVE_CLOCK_GETTIME 1
#define HAVE_GETPAGESIZE 0

#define SDL_ASSEMBLY_ROUTINES 0
#define SDL_VIDEO_DISABLE_SCREENSAVER 0

#endif /* SDL_config_h_ */
