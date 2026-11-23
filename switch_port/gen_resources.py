#!/usr/bin/env python3
"""Generate a CMRC-compatible embedded resource library for the game.

Outputs into <out>/:
  cmrc/cmrc.hpp              API-compatible header
  rc_data_N.cpp              binary blobs (chunked by size)
  rc_fs.cpp                  file table + filesystem implementation
"""
import os

MAX_CHUNK = 3 * 1024 * 1024  # bytes of data per generated cpp


def collect_files(src_root):
    scripts_dir = os.path.join(src_root, 'src', 'scripts')
    files = []
    for dirpath, _dirnames, filenames in os.walk(scripts_dir):
        for fn in filenames:
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, src_root).replace('\\', '/')
            files.append(rel)
    for extra in ('res/akhenaten_72.png', 'res/patreon_48.png'):
        p = os.path.join(src_root, extra)
        if os.path.exists(p):
            files.append(extra)
    files.sort()
    return files


def gen(out_dir, src_root):
    os.makedirs(os.path.join(out_dir, 'cmrc'), exist_ok=True)
    files = collect_files(src_root)

    hpp = r'''#pragma once
// CMRC-compatible embedded filesystem (generated for the Akhenaten Switch port)
#include <cstddef>
#include <string>
#include <vector>

namespace cmrc {

class embedded_file {
    const char* _begin = nullptr;
    std::size_t _size = 0;
public:
    embedded_file() = default;
    embedded_file(const char* b, std::size_t s) : _begin(b), _size(s) {}
    const char* begin() const { return _begin; }
    const char* end() const { return _begin + _size; }
    std::size_t size() const { return _size; }
};

struct directory_entry {
    std::string filename;
    bool is_directory = false;
    bool is_file = false;
};

class embedded_filesystem {
public:
    bool exists(const char* path) const;
    embedded_file open(const char* path) const;
    std::vector<directory_entry> iterate_directory(const std::string& path) const;
};

namespace akhenaten {
embedded_filesystem get_filesystem();
} // namespace akhenaten

} // namespace cmrc

#define CMRC_DECLARE(ns) \
    namespace cmrc { namespace ns { embedded_filesystem get_filesystem(); } }
'''
    with open(os.path.join(out_dir, 'cmrc', 'cmrc.hpp'), 'w', encoding='utf-8') as f:
        f.write(hpp)

    # data files
    entries = []  # (relpath, var)
    chunks = []   # list of (cpp_path, [(rel, var)])
    cur = []
    cur_size = 0
    cidx = 0
    for idx, rel in enumerate(files):
        with open(os.path.join(src_root, rel), 'rb') as rf:
            data = rf.read()
        var = 'rcb_%d' % idx
        entries.append((rel, var, len(data)))
        cur.append((rel, var, data))
        cur_size += len(data)
        if cur_size >= MAX_CHUNK:
            chunks.append(cur)
            cur = []
            cur_size = 0
    if cur:
        chunks.append(cur)

    for c, chunk in enumerate(chunks):
        with open(os.path.join(out_dir, 'rc_data_%d.cpp' % c), 'w', encoding='ascii') as f:
            f.write('// generated resource blobs (chunk %d)\nextern "C" {\n' % c)
            for _rel, var, data in chunk:
                f.write('const unsigned char %s[] = {' % var)
                f.write(','.join(str(b) for b in data))
                f.write('};\n')
                f.write('const unsigned %s_len = %d;\n' % (var, len(data)))
            f.write('}\n')

    # fs table + implementation
    with open(os.path.join(out_dir, 'rc_fs.cpp'), 'w', encoding='ascii') as f:
        f.write('// generated resource table\n')
        f.write('#include "cmrc/cmrc.hpp"\n')
        f.write('#include <algorithm>\n#include <cstring>\n\n')
        f.write('extern "C" {\n')
        for _rel, var, _sz in entries:
            f.write('extern const unsigned char %s[];\nextern const unsigned %s_len;\n' % (var, var))
        f.write('}\n\nnamespace {\n\nstruct RcEntry {\n    const char* path;\n    const unsigned char* data;\n    unsigned len;\n};\n\n')
        f.write('const RcEntry g_rc_entries[] = {\n')
        for rel, var, _sz in entries:
            f.write('    {"%s", %s, %s_len},\n' % (rel, var, var))
        f.write('};\n\n')
        f.write('struct RcPathLess {\n    bool operator()(const RcEntry& a, const char* b) const { return strcmp(a.path, b) < 0; }\n    bool operator()(const char* b, const RcEntry& a) const { return strcmp(b, a.path) < 0; }\n};\n\n')
        f.write('''std::string rc_normalize(std::string p) {
    while (!p.empty() && p.back() == '/') p.pop_back();
    return p;
}

} // namespace

namespace cmrc {

bool embedded_filesystem::exists(const char* path) const {
    if (!path || !*path) return false;
    std::string p = rc_normalize(path);
    auto it = std::lower_bound(std::begin(g_rc_entries), std::end(g_rc_entries), p.c_str(), RcPathLess{});
    return it != std::end(g_rc_entries) && strcmp(it->path, p.c_str()) == 0;
}

embedded_file embedded_filesystem::open(const char* path) const {
    std::string p = rc_normalize(path);
    auto it = std::lower_bound(std::begin(g_rc_entries), std::end(g_rc_entries), p.c_str(), RcPathLess{});
    if (it != std::end(g_rc_entries) && strcmp(it->path, p.c_str()) == 0)
        return embedded_file(reinterpret_cast<const char*>(it->data), it->len);
    return embedded_file();
}

std::vector<directory_entry> embedded_filesystem::iterate_directory(const std::string& path) const {
    std::string prefix = rc_normalize(path);
    std::vector<directory_entry> out;
    if (!prefix.empty()) prefix += '/';
    for (const RcEntry& e : g_rc_entries) {
        if (strncmp(e.path, prefix.c_str(), prefix.size()) != 0) continue;
        const char* rest = e.path + prefix.size();
        const char* slash = strchr(rest, '/');
        if (slash) {
            // subdirectory entry; ensure single occurrence
            std::string dirname(rest, slash - rest);
            std::string full = prefix + dirname;
            bool present = false;
            for (auto& d : out) if (d.filename == dirname) { present = true; break; }
            if (!present) out.push_back(directory_entry{dirname, true, false});
        } else {
            out.push_back(directory_entry{rest, false, true});
        }
    }
    return out;
}

namespace akhenaten {
embedded_filesystem get_filesystem() { return embedded_filesystem(); }
} // namespace akhenaten

} // namespace cmrc
''')
    total = sum(sz for _r, _v, sz in entries)
    print(f'rc: {len(entries)} files, {total / 1048576:.2f}MB in {len(chunks)} data TUs')


if __name__ == '__main__':
    import sys
    gen(sys.argv[1], sys.argv[2])
