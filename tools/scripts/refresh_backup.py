# -*- coding: utf-8 -*-
"""刷新桌面全树备份 zip（复刻历史备份方式：pharaoh-build 整树）。
先打临时文件，成功后原子替换桌面备份，避免中途失败损坏原备份。
排除：临时 zip 自身。
"""
import os, sys, time, zipfile, hashlib

SRC = r"E:\移植项目\pharaoh-build"
TMP = r"C:\Users\Lsyym\Desktop\法老王Switch移植项目备份_20261123.zip.tmp"  # 与 DEST 同盘，os.replace 才能原子替换
DEST = r"C:\Users\Lsyym\Desktop\法老王Switch移植项目备份_20261123.zip"
SKIP = {os.path.abspath(TMP).lower(), os.path.abspath(DEST).lower()}

def archive_current_nro():
    """备份前先把当前 nro 归档到 output/nro_history/（每版独立文件夹）。"""
    try:
        import importlib.util
        p = os.path.join(SRC, "tools", "scripts", "archive_nro.py")
        spec = importlib.util.spec_from_file_location("archive_nro", p)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        mod.main()
    except Exception as e:
        print("nro archive skipped: %s" % e)


def main():
    t0 = time.time()
    archive_current_nro()
    if os.path.exists(TMP):
        os.remove(TMP)
    n = 0
    with zipfile.ZipFile(TMP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=1, allowZip64=True) as z:
        for root, dirs, files in os.walk(SRC):
            for name in sorted(files):
                abspath = os.path.join(root, name)
                if os.path.abspath(abspath).lower() in SKIP or name.endswith('.tmp.zip'):
                    continue
                arc = "pharaoh-build/" + os.path.relpath(abspath, SRC).replace("\\", "/")
                try:
                    z.write(abspath, arc)
                    n += 1
                except (OSError, PermissionError) as e:
                    print("skip locked: %s (%s)" % (arc, e))
                if n % 20000 == 0 and n:
                    print("packed %d ..." % n)
    # 完整性验证
    with zipfile.ZipFile(TMP, "r") as z:
        assert z.testzip() is None
        cnt = len(z.namelist())
    print("temp entries=%d" % cnt)
    os.replace(TMP, DEST)  # 原子替换（同盘）
    h = hashlib.md5()
    with open(DEST, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    print("=== DONE ===")
    print("dest=%s" % DEST)
    print("size=%d (%.1f MB)" % (os.path.getsize(DEST), os.path.getsize(DEST) / 1048576.0))
    print("md5=%s" % h.hexdigest().upper())
    print("elapsed=%.1fs" % (time.time() - t0))

if __name__ == "__main__":
    main()
