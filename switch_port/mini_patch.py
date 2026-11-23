#!/usr/bin/env python3
"""Minimal unified-diff applier for git-style patches (a/ b/ prefixes).

Supports: new files (--- /dev/null), context hunks with @@ -a,b +c,d @@.
"""
import os
import re
import sys

HUNK_RE = re.compile(rb'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@')


def parse_patch(patch_bytes):
    lines = patch_bytes.split(b'\n')
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        if line.startswith(b'diff --git '):
            old_path = new_path = None
            j = i + 1
            while j < n and not lines[j].startswith(b'diff --git '):
                if lines[j].startswith(b'--- '):
                    old_path = lines[j][4:].split(b'\t')[0]
                elif lines[j].startswith(b'+++ '):
                    new_path = lines[j][4:].split(b'\t')[0]
                    j += 1
                    break
                j += 1
            if old_path == b'/dev/null':
                old_path = None
            if new_path == b'/dev/null':
                new_path = None
            hunks = []
            cur = None
            while j < n and not lines[j].startswith(b'diff --git '):
                m = HUNK_RE.match(lines[j])
                if m:
                    old_start = int(m.group(1))
                    cur = (old_start, [])
                    hunks.append(cur)
                elif cur is not None:
                    t = lines[j][:1]
                    if t in (b' ', b'+', b'-'):
                        cur[1].append((t.decode(), lines[j][1:]))
                    elif lines[j] == b'\\ No newline at end of file':
                        pass
                    elif lines[j] == b'':
                        cur[1].append((' ', b''))
                j += 1
            yield (old_path, new_path, hunks)
            i = j
        else:
            i += 1


def strip_path(p):
    if p is None:
        return None
    p = p.decode('utf-8', 'replace')
    if p.startswith('a/'):
        return p[2:]
    if p.startswith('b/'):
        return p[2:]
    return p


def apply_hunks(src_lines, hunks):
    out = []
    pos = 0
    for old_start, changes in hunks:
        old_start -= 1
        out.extend(src_lines[pos:old_start])
        pos = old_start
        for tag, content in changes:
            if tag == ' ':
                if pos >= len(src_lines) or src_lines[pos] != content:
                    ctx = src_lines[pos][:60] if pos < len(src_lines) else b'EOF'
                    raise ValueError(f'context mismatch at line {pos + 1}: expected {content[:60]!r}, got {ctx!r}')
                out.append(content)
                pos += 1
            elif tag == '-':
                if pos >= len(src_lines) or src_lines[pos] != content:
                    raise ValueError(f'delete mismatch at line {pos + 1}')
                pos += 1
            elif tag == '+':
                out.append(content)
    out.extend(src_lines[pos:])
    return out


def main():
    if len(sys.argv) != 3:
        print('usage: mini_patch.py <patch> <target_dir>')
        sys.exit(2)
    patch_path, target = sys.argv[1], sys.argv[2]
    with open(patch_path, 'rb') as f:
        data = f.read()
    data = data.replace(b'\r\n', b'\n')
    applied = 0
    for old_path, new_path, hunks in parse_patch(data):
        path = strip_path(new_path) or strip_path(old_path)
        if not path:
            continue
        dest = os.path.join(target, path.replace('/', os.sep))
        if old_path is None:  # new file
            content = [c for t, c in hunks[0][1] if t == '+']
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, 'wb') as f:
                f.write(b'\n'.join(content) + b'\n')
            applied += 1
            print(f'new   {path}')
        else:
            with open(dest, 'rb') as f:
                src = f.read().replace(b'\r\n', b'\n')
            src_lines = src.split(b'\n')
            if src_lines and src_lines[-1] == b'':
                src_lines = src_lines[:-1]
            out = apply_hunks(src_lines, hunks)
            with open(dest, 'wb') as f:
                f.write(b'\n'.join(out) + b'\n')
            applied += 1
            print(f'patch {path}')
    print(f'applied {applied} file changes')


if __name__ == '__main__':
    main()
