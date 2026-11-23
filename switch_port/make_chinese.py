#!/usr/bin/env python3
"""Convert GOG Pharaoh Gold official Traditional Chinese resources
(Pharaoh_Text.cht / Pharaoh_MM.cht / eventmsg.txt) into Akhenaten
JS language packs (localization_base_ch.js, game_messages_ch.js,
eventmsg_ch.js) and register the CJK font in localization.js.
"""
import os
import re
import sys

GOG = r'D:\Games\Pharaoh Gold'
SCRIPTS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       'src', 'Akhenaten-master', 'src', 'scripts')

NUM_TEXT_ENTRIES = 1000
NUM_MM_ENTRIES = 1000


def decode(raw):
    return raw.decode('big5', errors='replace')


# ---------------- text file (.eng/.cht) ----------------

def parse_text_file(path):
    d = open(path, 'rb').read()
    entries = []
    for i in range(NUM_TEXT_ENTRIES):
        off, in_use = struct_unpack_ii(d, 28 + i * 8)
        entries.append((off, in_use))
    base = 28 + NUM_TEXT_ENTRIES * 8
    data_end = len(d)
    used = [i for i, (o, u) in enumerate(entries) if u]
    out = {}  # (group, idx) -> text

    def get_string(gpos, index):
        # julius lang_get_string semantics
        p = gpos
        prev = 0
        while index > 0:
            if p >= data_end:
                return None
            if d[p] == 0 and (prev >= 32 or prev == 0):
                index -= 1
            prev = d[p]
            p += 1
        while p < data_end and d[p] < 32:
            p += 1
        start = p
        while p < data_end and d[p] != 0:
            p += 1
        return d[start:p]

    for k, g in enumerate(used):
        off = entries[g][0]
        gpos = base + off
        # group end = next used group offset or data end
        if k + 1 < len(used):
            gend = base + entries[used[k + 1]][0]
        else:
            gend = data_end
        idx = 0
        p = gpos
        while p < gend:
            s = get_string(gpos, idx)
            if s is None:
                break
            # position after this string:
            # recompute walk position
            p = advance_after_string(d, gpos, idx, gend)
            if p is None or p >= gend:
                break
            txt = decode(s)
            if txt and txt.strip():
                out[(g, idx)] = txt
            idx += 1
            if idx > 5000:
                break
    return out


def struct_unpack_ii(d, off):
    import struct as _s
    return _s.unpack_from('<ii', d, off)


def advance_after_string(d, gpos, index, gend):
    """Return position after reading string `index` from group start gpos."""
    p = gpos
    prev = 0
    while index > 0:
        if p >= gend:
            return None
        if d[p] == 0 and (prev >= 32 or prev == 0):
            index -= 1
        prev = d[p]
        p += 1
    while p < gend and d[p] < 32:
        p += 1
    start = p
    while p < gend and d[p] != 0:
        p += 1
    if p >= gend:
        return None
    return p + 1  # past NUL


def js_escape(s):
    out = []
    for ch in s:
        if ch == '\\':
            out.append('\\\\')
        elif ch == '"':
            out.append('\\"')
        elif ch == '\n':
            out.append('\\n')
        elif ch == '\r':
            pass
        elif ch == '\t':
            out.append('\\t')
        else:
            out.append(ch)
    return ''.join(out)


def gen_localization_base(strings):
    lines = ['log_info("akhenaten: localization_base_ch config started")', '',
             'localization_base_ch = [']
    for (g, i), txt in sorted(strings.items()):
        lines.append('    { group:%d, id:%d, text: "%s" }' % (g, i, js_escape(txt)))
    lines.append(']')
    return '\n'.join(lines)


# ---------------- mm file ----------------

def parse_mm_file(path):
    d = open(path, 'rb').read()
    base = 24 + NUM_MM_ENTRIES * 80
    records = []
    for rid in range(NUM_MM_ENTRIES):
        rec = 24 + rid * 80
        if rec + 80 > base:
            break
        t, mt = _s_unpack('<hh', d, rec)
        w, h = _s_unpack('<hh', d, rec + 10)
        img_id = _s_unpack('<h', d, rec + 14)[0]
        urgent = _s_unpack('<i', d, rec + 56)[0]
        voff = _s_unpack('<i', d, rec + 60)[0]
        toff = _s_unpack('<i', d, rec + 68)[0]
        soff = _s_unpack('<i', d, rec + 72)[0]
        coff = _s_unpack('<i', d, rec + 76)[0]

        def gt(off):
            if off == 0:
                return ''
            p = base + off
            if p >= len(d):
                return ''
            e = d.find(b'\x00', p)
            txt = decode(d[p:e])
            return txt

        records.append(dict(
            id=rid, type=t, message_type=mt, size=(w, h), img=img_id,
            urgent=urgent,
            video=gt(voff), title=gt(toff), subtitle=gt(soff), content=gt(coff)))
    return records


def _s_unpack(fmt, d, off):
    import struct
    return struct.unpack_from(fmt, d, off)


# ---------------- game_messages_en.js rewriting ----------------

def read_js_string(c, i):
    """c[i] is the opening quote; return (string_value_unescaped_from_raw,
    end_index_after_closing_quote). We keep the RAW text (without unescaping)
    via a parallel raw scan: return raw inner text and end pos."""
    q = c[i]
    j = i + 1
    buf = []
    while j < len(c):
        ch = c[j]
        if ch == '\\' and j + 1 < len(c):
            buf.append(ch)
            buf.append(c[j + 1])
            j += 2
            continue
        if ch == q:
            j += 1
            break
        buf.append(ch)
        j += 1
    return ''.join(buf), j


def replace_block_text(body, block_name, new_text):
    """Find `block_name { ... text: "..." }` inside body and replace the
    string literal. Returns (new_body, replaced_bool)."""
    m = re.search(re.escape(block_name) + r'\s*\{', body)
    if not m:
        return body, False
    # find the first `text` literal inside this block (before its closing brace)
    depth = 0
    i = m.end() - 1
    start = i
    n = len(body)
    text_lit = None
    text_span = None
    while i < n:
        ch = body[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                break
        elif ch == '"' and depth >= 1:
            # is this a text: literal?
            head = body[max(0, i - 60):i]
            if re.search(r'text\s*:\s*$', head):
                raw, end = read_js_string(body, i)
                text_lit = raw
                text_span = (i, end)
                break
        i += 1
    if text_span is None:
        return body, False
    s, e = text_span
    return body[:s] + '"' + js_escape(new_text) + '"' + body[e:], True


def gen_game_messages(records):
    en_path = os.path.join(SCRIPTS, 'game_messages_en.js')
    c = open(en_path, encoding='utf-8', errors='replace').read()
    header = 'log_info("akhenaten: game_messages_ch config started")\n\ngame_messages_ch {'
    # find top-level message blocks inside game_messages_en { ... }
    i = c.find('game_messages_en')
    i = c.find('{', i)
    depth = 0
    blocks = []  # (start, end) spans of message blocks (inner bodies)
    start = None
    n = len(c)
    while i < n:
        ch = c[i]
        if ch == '{':
            depth += 1
            if depth == 2:
                start = i + 1
        elif ch == '}':
            if depth == 2 and start is not None:
                blocks.append((start, i))
                start = None
            depth -= 1
            if depth == 0:
                break
        i += 1
    out_blocks = []
    used_ids = 0
    for (a, b) in blocks:
        body = c[a:b]
        # the block name sits immediately before the '{' at a-1
        head = c[max(0, a - 160):a - 1]
        km = re.search(r'message_(\w+)\s*$', head)
        key = km.group(1) if km else None
        idm = re.search(r'\bid\s*:\s*(\d+)', body)
        rid = int(idm.group(1)) if idm else -1
        rec = records[rid] if 0 <= rid < len(records) else None
        if rec and key:
            for field, src in (('title', rec['title']), ('content', rec['content']),
                               ('subtitle', rec['subtitle']), ('video', rec['video'])):
                if src and src.strip():
                    body, ok = replace_block_text(body, field, src)
        out_blocks.append((key, rid, body))
        if rid >= 0:
            used_ids += 1
    out = [header]
    for key, rid, body in out_blocks:
        mname = 'message_' + (key or ('unk_%d' % rid))
        out.append('    %s {\n%s\n    }' % (mname, body.rstrip()))
    out.append('}')
    return '\n'.join(out), used_ids


# ---------------- eventmsg.txt ----------------

def parse_eventmsg_txt(path):
    d = open(path, 'rb').read()
    out = {}
    for line in d.split(b'\n'):
        line = line.strip(b' \t\r')
        if not line.startswith(b'PHRASE_'):
            continue
        # key token
        j = 0
        while j < len(line) and (line[j:j + 1].isalnum() or line[j:j + 1] == b'_'):
            j += 1
        key = line[:j].decode('ascii', 'replace')
        rest = line[j:]
        q = rest.find(b'"')
        if q < 0:
            continue
        # scan closing quote respecting big5 lead bytes
        p = q + 1
        buf = bytearray()
        while p < len(rest):
            b = rest[p]
            if b == 0x22:  # '"'
                break
            if 0x81 <= b <= 0xFE and p + 1 < len(rest):
                buf.append(b)
                buf.append(rest[p + 1])
                p += 2
                continue
            buf.append(b)
            p += 1
        out[key] = decode(bytes(buf))
    return out


def gen_eventmsg(phrases):
    lines = ['log_info("akhenaten: eventmsg chinese started")', '',
             'eventmsg_ch = [']
    for key, txt in phrases.items():
        if not key:
            continue
        lines.append('  { key:%s, text: "%s" }' % (key, js_escape(txt)))
    lines.append(']')
    return '\n'.join(lines)


def main():
    print('parsing', GOG)
    strings = parse_text_file(os.path.join(GOG, 'Pharaoh_Text.cht'))
    print('text strings:', len(strings))
    with open(os.path.join(SCRIPTS, 'localization_base_ch.js'), 'w', encoding='utf-8') as f:
        f.write(gen_localization_base(strings) + '\n')

    records = parse_mm_file(os.path.join(GOG, 'Pharaoh_MM.cht'))
    nonempty = sum(1 for r in records if r['title'] or r['content'])
    print('mm records with text:', nonempty)
    gm, used = gen_game_messages(records)
    with open(os.path.join(SCRIPTS, 'game_messages_ch.js'), 'w', encoding='utf-8') as f:
        f.write(gm + '\n')
    print('game_messages_ch blocks:', used)

    phrases = parse_eventmsg_txt(os.path.join(GOG, 'eventmsg.txt'))
    print('eventmsg phrases:', len(phrases))
    with open(os.path.join(SCRIPTS, 'eventmsg_ch.js'), 'w', encoding='utf-8') as f:
        f.write(gen_eventmsg(phrases) + '\n')

    # patch localization.js ch entry: caption, font, letter spacing, symbols
    loc = os.path.join(SCRIPTS, 'localization.js')
    c = open(loc, encoding='utf-8').read()
    c = c.replace('lang:"ch", caption:"Chinese (Tradition)"',
                  'lang:"ch", caption:"中文（繁體）"')
    start = c.find('lang:"ch"')
    if start >= 0:
        end = c.find('lang:"hu"', start)
        if end < 0:
            end = start + 4000
        block = c[start:end]
        block = block.replace('font:"data/neucha.ttf"', 'font:"data/notosanssc-vf.ttf"')
        block = re.sub(r'letter_spacing:-?\d+', 'letter_spacing:0', block)
        block = block.replace(
            'symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"',
            'symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,，。、：；！？「」『』（）《》…—％"' )
        c = c[:start] + block + c[end:]
        open(loc, 'w', encoding='utf-8').write(c)
        print('localization.js patched')
    else:
        print('WARN: ch entry not found in localization.js')


if __name__ == '__main__':
    main()
