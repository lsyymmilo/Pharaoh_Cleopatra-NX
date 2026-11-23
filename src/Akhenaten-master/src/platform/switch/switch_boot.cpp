// Switch boot shim.
//
// When the NRO is chain-loaded by a forwarder NSP (Sphaira "install as
// forwarder") the new process does NOT inherit any filesystem sessions from
// the parent, so "sdmc:" is not mounted and every fopen()/chdir() under
// sdmc:/switch/pharaoh/ fails.  Mount it ourselves before the engine runs and
// keep a tiny boot log on the SD card so a silent early exit is diagnosable.
#include <switch.h>

#include <cstdarg>
#include <cstdio>
#include <cstring>
#include <sys/stat.h>

static FILE* g_boot_log = nullptr;

extern "C" int switch_boot_log(const char* fmt, ...) {
    if (!g_boot_log) {
        return 0;
    }
    va_list ap;
    va_start(ap, fmt);
    vfprintf(g_boot_log, fmt, ap);
    va_end(ap);
    fputc('\n', g_boot_log);
    fflush(g_boot_log);
    return 1;
}

extern "C" void switch_boot_init(void) {
    // Idempotent: returns an error if already initialised, which is fine.
    fsInitialize();
    fsdevMountSdmc();

    mkdir("sdmc:/switch/pharaoh", 0777);
    g_boot_log = fopen("sdmc:/switch/pharaoh/boot.log", "w");
    switch_boot_log("boot: fs=%s sd_mount=%s",
                    R_SUCCEEDED(fsInitialize()) ? "ok" : "already", 
                    "attempted");

    // Report whether the data the engine insists on is actually visible.
    static const char* required[] = {
        "sdmc:/switch/pharaoh/assets/Data/Pharaoh_General.555",
        "sdmc:/switch/pharaoh/assets/Data/neucha.ttf",
        "sdmc:/switch/pharaoh/assets/Data/pharaoh_fonts_pack.sgx",
        "sdmc:/switch/pharaoh/assets/campaign.txt",
    };
    for (const char* path : required) {
        struct stat st;
        const bool ok = stat(path, &st) == 0;
        switch_boot_log("boot: %-58s %s (%lld bytes)", path,
                        ok ? "OK" : "MISSING", ok ? (long long)st.st_size : 0);
    }
    switch_boot_log("boot: ---- engine start ----");
}