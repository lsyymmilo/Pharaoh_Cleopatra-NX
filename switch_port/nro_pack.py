#!/usr/bin/env python3
"""Pack a GCC-produced ELF64 (PIE, switch.ld layout) into a Switch NRO.

Follows libnx switch/nro.h structures and the hbloader/hbmenu loading contract:
 - NroStart (0x10) is taken verbatim from the first 16 bytes of the ELF text
   segment (libnx crt0 places the MOD0 offset there and reserves 0x80 bytes).
 - NroHeader (0x70) written at 0x10; segment offsets are relative to the NRO
   image start; text segment begins at 0 (its first 0x80 bytes are the header).
 - Segments are padded to 0x1000 alignment.
 - Optional asset section ("ASET") with icon PNG + NACP (0x4000) is appended
   at NroHeader.size, with offsets relative to the asset header.
"""
import struct
import sys
import os

PAGE = 0x1000


def align(v, a):
    return (v + a - 1) & ~(a - 1)


class Elf64:
    def __init__(self, data):
        if data[:4] != b'\x7fELF' or data[4] != 2:
            raise ValueError('not a 64-bit ELF')
        self.data = data
        (self.e_type, self.e_machine, _ver, self.e_entry, self.e_phoff,
         self.e_shoff, _flags, self.e_ehsize, self.e_phentsize, self.e_phnum,
         self.e_shentsize, self.e_shnum, self.e_shstrndx) = struct.unpack_from(
            '<HHIQQQIHHHHHH', data, 16)
        self.phdrs = []
        for i in range(self.e_phnum):
            off = self.e_phoff + i * self.e_phentsize
            (p_type, p_flags, p_offset, p_vaddr, p_paddr, p_filesz, p_memsz,
             p_align) = struct.unpack_from('<IIQQQQQQ', data, off)
            self.phdrs.append(dict(
                type=p_type, flags=p_flags, offset=p_offset, vaddr=p_vaddr,
                filesz=p_filesz, memsz=p_memsz))
        # sections for symbol lookup
        self.symtab = None
        self.strtab = None
        self.shstrtab = None
        self.sections = []
        for i in range(self.e_shnum):
            off = self.e_shoff + i * self.e_shentsize
            (sh_name, sh_type, sh_flags, sh_addr, sh_offset, sh_size,
             sh_link, sh_info, sh_addralign, sh_entsize) = struct.unpack_from(
                '<IIQQQQIIQQ', data, off)
            self.sections.append(dict(
                name_off=sh_name, type=sh_type, addr=sh_addr, offset=sh_offset,
                size=sh_size, link=sh_link, entsize=sh_entsize))
        if self.e_shnum:
            shstr = self.sections[self.e_shstrndx]
            names = data[shstr['offset']:shstr['offset'] + shstr['size']]
            for s in self.sections:
                end = names.find(b'\x00', s['name_off'])
                s['name'] = names[s['name_off']:end].decode('utf-8', 'replace')
            for s in self.sections:
                if s['type'] == 2 and s['name'] in ('.symtab',):  # SHT_SYMTAB
                    self.symtab = s
                    self.strtab = self.sections[s['link']]
        self.build_id = b''
        for s in self.sections:
            if s['name'] == '.note.gnu.build-id':
                blob = data[s['offset']:s['offset'] + s['size']]
                # note: namesz, descsz, type, name, desc
                if len(blob) >= 16:
                    namesz, descsz, _type = struct.unpack_from('<III', blob, 0)
                    off = 12 + namesz
                    self.build_id = blob[off:off + descsz]

    def symbol(self, name):
        if not self.symtab:
            return None
        d = self.data
        st = self.symtab
        names = d[self.strtab['offset']:self.strtab['offset'] + self.strtab['size']]
        n = st['size'] // 24
        for i in range(n):
            off = st['offset'] + i * 24
            st_name, _info, _other, _shndx, st_value, _sz = struct.unpack_from(
                '<IBBHQQ', d, off)
            end = names.find(b'\x00', st_name)
            nm = names[st_name:end].decode('utf-8', 'replace')
            if nm == name:
                return st_value
        return None

    def segment_bytes(self, ph):
        return self.data[ph['offset']:ph['offset'] + ph['filesz']]


def make_nacp(title, author, version):
    nacp = bytearray(0x4000)

    def put(off, s, enc='utf-8'):
        b = s.encode(enc)[:0x200]
        nacp[off:off + len(b)] = b

    # ApplicationControlProperty (switchbrew):
    # 0x000 title (0x200), 0x200 author (0x100), 0x300 version (0x20)
    put(0x000, title)
    put(0x200, author)
    put(0x300, version)
    # 0x3060: BAC saveData? leave zeros; a few useful fields:
    # 0x3020: user_account_save_data_size (u64) -> small nonzero
    struct.pack_into('<Q', nacp, 0x3020, 0x100000)
    # 0x3230: video_capture (0 = disabled)
    return bytes(nacp)


def pack_nro(elf_path, out_path, icon_png=None, title='Akhenaten',
             author='dalerank / TeleAgent', version='1.0'):
    data = open(elf_path, 'rb').read()
    elf = Elf64(data)
    loads = [p for p in elf.phdrs if p['type'] == 1]  # PT_LOAD
    if len(loads) < 3:
        raise ValueError(f'expected 3 PT_LOAD segments, got {len(loads)}')
    text, ro, dt = loads[0], loads[1], loads[2]

    text_bytes = bytearray(elf.segment_bytes(text))
    if len(text_bytes) < 0x80:
        raise ValueError('text segment too small')

    segs = []
    for seg in (text, ro, dt):
        segs.append(elf.segment_bytes(seg))

    # layout: text at 0 (header overlays first 0x80), then aligned ro, data
    text_size = align(len(segs[0]), PAGE)
    ro_off = align(text_size, PAGE)
    ro_size = align(len(segs[1]), PAGE)
    data_off = align(ro_off + ro_size, PAGE)
    data_size = align(len(segs[2]), PAGE)
    bss_size = align(max(0, dt['memsz'] - dt['filesz']), PAGE)
    code_size = data_off + data_size

    out = bytearray(code_size)
    # The ELF text segment already contains the NroStart placeholder in its
    # first 0x10 bytes (libnx crt0) and reserves 0x70 bytes for the header.
    out[0:len(segs[0])] = segs[0]
    struct.pack_into('<IIII', out, 0x10, 0x304F524E, 0, code_size, 0)
    struct.pack_into('<II', out, 0x20, 0, text_size)
    struct.pack_into('<II', out, 0x28, ro_off, ro_size)
    struct.pack_into('<II', out, 0x30, data_off, data_size)
    struct.pack_into('<II', out, 0x38, bss_size, 0)
    bid = elf.build_id[:0x20]
    out[0x40:0x40 + len(bid)] = bid
    out[ro_off:ro_off + len(segs[1])] = segs[1]
    out[data_off:data_off + len(segs[2])] = segs[2]

    # asset section: the NroAssetHeader must sit immediately after the code
    # (i.e. at NroHeader.size); its section offsets are relative to that point.
    nacp = make_nacp(title, author, version)
    icon_data = b''
    if icon_png and os.path.exists(icon_png):
        icon_data = open(icon_png, 'rb').read()

    header_size = 56
    icon_off = header_size if icon_data else 0
    icon_size = len(icon_data)
    nacp_off = header_size + icon_size
    nacp_size = len(nacp)

    asset = bytearray(header_size)  # magic, version + 3x{u64 off, u64 size}
    struct.pack_into('<II', asset, 0, 0x54455341, 0)      # 'ASET', version 0
    struct.pack_into('<Q', asset, 8, icon_off)            # icon.offset
    struct.pack_into('<Q', asset, 16, icon_size)          # icon.size
    struct.pack_into('<Q', asset, 24, nacp_off)           # nacp.offset
    struct.pack_into('<Q', asset, 32, nacp_size)          # nacp.size
    struct.pack_into('<Q', asset, 40, 0)                  # romfs.offset
    struct.pack_into('<Q', asset, 48, 0)                  # romfs.size

    out += bytes(asset)
    out += icon_data
    out += nacp

    open(out_path, 'wb').write(out)
    print(f'wrote {out_path}: code {code_size / 1048576:.1f}MB, '
          f'icon {len(icon_data)}B, total {len(out) / 1048576:.1f}MB')


if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('elf')
    ap.add_argument('out')
    ap.add_argument('--icon', default=None)
    ap.add_argument('--title', default='Akhenaten')
    ap.add_argument('--author', default='dalerank')
    ap.add_argument('--version', default='1.0')
    a = ap.parse_args()
    pack_nro(a.elf, a.out, a.icon, a.title, a.author, a.version)
