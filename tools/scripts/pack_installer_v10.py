# -*- coding: utf-8 -*-
"""V1.0 安装包打包脚本（2026-11-23）
把 C:\pharaoh-build\output\sdcard\switch\ 整树 + 中文安装说明 打成 zip。
用 Python zipfile 保证：
  - 中文条目名自动置 UTF-8 flag（tar.exe 在 GB 代码页下有乱码风险）
  - switch 树内不含任何非 ASCII 路径（Switch devoptab 不认多字节文件名）
输出：E:\法老王NS移植版\Pharaoh_Cleopatra-NX_V1.0_安装包.zip
"""
import os, sys, time, zipfile, hashlib

SRC_ROOT = r"C:\pharaoh-build\output\sdcard\switch"
README = r"E:\法老王NS移植版\安装说明.txt"
OUT = r"E:\法老王NS移植版\Pharaoh_Cleopatra-NX_V1.0_安装包.zip"

def md5_of(path, chunk=1 << 20):
    h = hashlib.md5()
    with open(path, "rb") as f:
        while True:
            b = f.read(chunk)
            if not b:
                break
            h.update(b)
    return h.hexdigest().upper()

def main():
    t0 = time.time()
    n_files = 0
    n_bytes = 0
    # 预扫描：统计 + 非 ASCII 防线
    entries = []  # (arcname, abspath)
    for root, dirs, files in os.walk(SRC_ROOT):
        for name in sorted(files):
            abspath = os.path.join(root, name)
            arc = "switch/" + os.path.relpath(abspath, SRC_ROOT).replace("\\", "/")
            if any(ord(c) > 127 for c in arc):
                print("FATAL non-ascii entry: %s" % arc)
                sys.exit(2)
            entries.append((arc, abspath))
    # 顶层中文安装说明（zip 根，不在 switch 树内）
    entries.append(("安装说明.txt", README))
    print("entries=%d" % len(entries))

    if os.path.exists(OUT):
        os.remove(OUT)

    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=1, allowZip64=True) as z:
        for arc, abspath in entries:
            z.write(abspath, arc)
            n_files += 1
            n_bytes += os.path.getsize(abspath)
            if n_files % 200 == 0:
                print("packed %d/%d ..." % (n_files, len(entries)))

    # 验证：条目数、无损坏、关键文件在
    with zipfile.ZipFile(OUT, "r") as z:
        bad = z.testzip()
        names = z.namelist()
        assert bad is None, "corrupt entry: %s" % bad
        assert "switch/Pharaoh_Cleopatra-NX.nro" in names
        assert "switch/pharaoh/Pharaoh_Cleopatra-NX.nro" in names
        assert "安装说明.txt" in names
        nro1 = z.read("switch/Pharaoh_Cleopatra-NX.nro")
        inner_md5 = hashlib.md5(nro1).hexdigest().upper()
        # switch 树内必须无非 ASCII
        tree_non_ascii = [n for n in names if n != "安装说明.txt" and any(ord(c) > 127 for c in n)]
        assert not tree_non_ascii, tree_non_ascii[:5]
        utf8_flag_ok = all(
            (zi.filename.encode("utf-8") == zi.filename.encode("cp437", "ignore")) or zi.flag_bits & 0x800
            for zi in z.infolist()
        )

    zsize = os.path.getsize(OUT)
    print("=== DONE ===")
    print("zip=%s" % OUT)
    print("zip_size=%d (%.1f MB)" % (zsize, zsize / 1048576.0))
    print("source_bytes=%d (%.1f MB)" % (n_bytes, n_bytes / 1048576.0))
    print("entries=%d" % n_files)
    print("nro_md5_in_zip=%s" % inner_md5)
    print("utf8_flag_ok=%s" % utf8_flag_ok)
    print("zip_md5=%s" % md5_of(OUT))
    print("elapsed=%.1fs" % (time.time() - t0))

if __name__ == "__main__":
    main()
