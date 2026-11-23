// Platform stubs for the Switch port: OS-integration entry points that are
// referenced by imgui / imgui-SDL2 backend but have no Switch implementation.
#include <stddef.h>
#include <errno.h>

extern "C" {

int waitpid(int pid, int* status, int options) {
    (void)pid; (void)status; (void)options;
    errno = ENOSYS;
    return -1;
}

int execvp(const char* file, char* const argv[]) {
    (void)file; (void)argv;
    errno = ENOSYS;
    return -1;
}

int execv(const char* path, char* const argv[]) {
    (void)path; (void)argv;
    errno = ENOSYS;
    return -1;
}

int pipe(int fds[2]) {
    (void)fds;
    errno = ENOSYS;
    return -1;
}

int fork(void) {
    errno = ENOSYS;
    return -1;
}

int SDL_OpenURL(const char* url) {
    (void)url;
    return -1;
}

int SDL_SetClipboardText(const char* text) {
    (void)text;
    return -1;
}

char* SDL_GetClipboardText(void) {
    return nullptr;
}

} // extern "C"
