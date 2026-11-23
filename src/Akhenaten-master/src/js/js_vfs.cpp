#include "content/vfs.h"

#include "cmrc/cmrc.hpp"
#include "js/js_register.h"
#include "core/log.h"
#include "platform/version.hpp"
#include <iostream>
#include <fstream>
#include <filesystem>

#if defined(GAME_PLATFORM_NSWITCH)
extern "C" int switch_boot_log(const char* fmt, ...);
#define UNPAK_PROBE(...) switch_boot_log(__VA_ARGS__)
#else
#define UNPAK_PROBE(...) do {} while (0)
#endif

CMRC_DECLARE(akhenaten);

namespace fs = std::filesystem;

namespace vfs {

    constexpr pcstr internal_scripts_path = "src/scripts/";
    constexpr pcstr unpacked_version_file = "akhenaten_scripts_version.txt";

    namespace {
        std::pair<void *, uint32_t> open_embedded_file(pcstr prefix, pcstr path) {
            if (!path || !*path) {
                return { nullptr, 0 };
            }

            auto fs = cmrc::akhenaten::get_filesystem();

            bstring256 fs_path(prefix, (*path == ':') ? (path + 1) : path);
            if (!fs.exists(fs_path.c_str())) {
                return { nullptr, 0 };
            }

            auto fd1 = fs.open(fs_path.c_str());
            return { (void *)fd1.begin(), (uint32_t)fd1.size() };
        }
    }

    std::pair<void *, uint32_t> internal_file_open(pcstr path) {
        return open_embedded_file(internal_scripts_path, path);
    }

    std::pair<void *, uint32_t> internal_resource_open(pcstr path) {
        return open_embedded_file("", path);
    }

    // Helper function to unpack a directory recursively
    void unpack_directory(const cmrc::embedded_filesystem &filesystem, const std::string &internal_path, const fs::path &output_base, int &files_unpacked, int &files_failed) {
        static int unpack_depth = 0;
        UNPAK_PROBE("unpak: dir '%s' (depth=%d)", internal_path.c_str(), unpack_depth);
        unpack_depth++;
        struct depth_guard_t {
            ~depth_guard_t() { unpack_depth--; }
        } depth_guard;

        for (auto &&entry : filesystem.iterate_directory(internal_path)) {
            std::string filename = entry.filename;
            std::string full_internal_path = internal_path + filename;

            if (entry.is_directory) {
                // Create subdirectory and recurse
                fs::path subdir = output_base / filename;
                std::error_code ec;
                fs::create_directories(subdir, ec);
                if (ec) {
                    UNPAK_PROBE("unpak: mkdir FAILED '%s' ec=%d", subdir.string().c_str(), (int)ec.value());
                    logs::error("Failed to create directory: %s (ec=%d)", subdir.string().c_str(), (int)ec.value());
                    files_failed++;
                    continue;
                }
                logs::info("Created directory: %s", subdir.string().c_str());

                // Recurse into subdirectory
                unpack_directory(filesystem, full_internal_path + "/", subdir, files_unpacked, files_failed);

            } else if (entry.is_file) {
                // Open the embedded file
                auto file = filesystem.open(full_internal_path.c_str());

                // Create output file path
                fs::path output_file = output_base / filename;

                // Write file to disk
                std::ofstream out(output_file, std::ios::binary);
                if (!out) {
                    UNPAK_PROBE("unpak: open FAILED '%s'", output_file.string().c_str());
                    logs::error("Failed to create file: %s", output_file.string().c_str());
                    files_failed++;
                    continue;
                }

                out.write(file.begin(), file.size());
                out.close();

                if (out.fail()) {
                    UNPAK_PROBE("unpak: write FAILED '%s' (%zu bytes)", output_file.string().c_str(), (size_t)file.size());
                    files_failed++;
                    continue;
                }

                UNPAK_PROBE("unpak: wrote '%s' (%zu bytes)", output_file.string().c_str(), (size_t)file.size());
                logs::info("Unpacked: %s (%zu bytes)", full_internal_path.c_str(), file.size());
                files_unpacked++;
            }
        }
    }

    // Function to unpack embedded scripts to disk
    xstring platform_unpack_scripts() {
        UNPAK_PROBE("unpak: START");
        logs::info("=== Starting to unpack embedded scripts ===");

        auto filesystem = cmrc::akhenaten::get_filesystem();

        // Get base path for writing files
        pcstr base_path = vfs::platform_file_manager_get_base_path();
        if (!base_path) {
            logs::error("Failed to get base path for unpacking scripts");
            return xstring{};
        }

        // Create output directory
        fs::path output_dir = fs::path(base_path) / "Scripts";
        std::error_code ec;
        fs::create_directories(output_dir, ec);
        if (ec && !fs::is_directory(output_dir)) {
            UNPAK_PROBE("unpak: base mkdir FAILED '%s' ec=%d", output_dir.string().c_str(), (int)ec.value());
            logs::error("Failed to create output directory: %s", output_dir.string().c_str());
            return xstring{};
        }
        logs::info("Output directory: %s", output_dir.string().c_str());
        UNPAK_PROBE("unpak: base dir '%s'", output_dir.string().c_str());

        // Unpack all scripts
        constexpr const char *scripts_path = "src/scripts/";
        int files_unpacked = 0;
        int files_failed = 0;

        vfs::unpack_directory(filesystem, scripts_path, output_dir, files_unpacked, files_failed);

        std::ofstream stamp(output_dir / unpacked_version_file, std::ios::binary | std::ios::trunc);
        stamp << get_version().c_str();
        if (!stamp) {
            UNPAK_PROBE("unpak: stamp write FAILED");
            logs::error("Failed to write %s; the unpacked scripts will be ignored", unpacked_version_file);
        } else {
            UNPAK_PROBE("unpak: stamp ok");
        }

        logs::info("=== Unpack complete! ===");
        logs::info("Files unpacked: %d", files_unpacked);
        logs::info("Files failed: %d", files_failed);
        logs::info("Location: %s", output_dir.string().c_str());
        UNPAK_PROBE("unpak: DONE ok=%d failed=%d", files_unpacked, files_failed);

        return xstring(output_dir.string().c_str());
    }

    bool scripts_folder_matches_build(pcstr dir, xstring& found_version) {
        found_version = {};
        std::ifstream stamp(fs::path(dir) / unpacked_version_file, std::ios::binary);
        if (!stamp) {
            return false;
        }
        std::string version;
        std::getline(stamp, version);
        found_version = version.c_str();
        return found_version == get_version();
    }
}

