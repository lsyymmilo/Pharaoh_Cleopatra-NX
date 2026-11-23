// Switch port: POSIX-flavoured file manager backed by newlib stdio on the
// SD card (libnx maps "sdmc:/" to the SD mount).
#include "content.h"
#include "platform/platform.h"

#include <cstdio>
#include <string>

#if defined(__SWITCH__)

FILE *vfs::platform_file_manager_open_file(std::string_view filename, pcstr mode) {
    const std::string path(filename);
    return fopen(path.c_str(), mode);
}

bool vfs::platform_file_manager_remove_file(const char *filename) {
    return std::remove(filename) == 0;
}

#endif