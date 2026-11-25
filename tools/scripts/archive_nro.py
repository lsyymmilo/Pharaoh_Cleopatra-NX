# -*- coding: utf-8 -*-
"""把当前 output/Pharaoh_Cleopatra-NX.nro 归档到 output/nro_history/r<NN>_<md5前8>/。

目的：每版 nro 独立成文件夹保存在构建树内，桌面备份 zip 是整树打包，
因此会自动包含全部历史版本，随时可回退到任意一版。

用法：
  python archive_nro.py [--label "第58轮"] [--note "说明文字"]
已存在同 MD5 的归档目录时直接跳过（幂等）。
"""
import os
import re
import sys
import time
import shutil
import hashlib

ROOT = r"E:\移植项目\pharaoh-build"
NRO = os.path.join(ROOT, "output", "Pharaoh_Cleopatra-NX.nro")
HIST = os.path.join(ROOT, "output", "nro_history")


def md5_of(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest().upper()


def _arg(name, default=""):
    a = sys.argv[1:]
    if name in a:
        i = a.index(name)
        if i + 1 < len(a):
            return a[i + 1]
    return default


def main():
    if not os.path.exists(NRO):
        print("nro not found:", NRO)
        return 1

    h = md5_of(NRO)
    size = os.path.getsize(NRO)
    os.makedirs(HIST, exist_ok=True)

    # 已归档则跳过
    for d in sorted(os.listdir(HIST)):
        p = os.path.join(HIST, d)
        info = os.path.join(p, "info.txt")
        if os.path.isdir(p) and os.path.exists(info):
            try:
                with open(info, encoding="utf-8") as f:
                    for line in f:
                        if line.startswith("md5=") and line.strip().split("=", 1)[1].upper() == h:
                            print("already archived:", d)
                            return 0
            except OSError:
                pass

    nums = []
    for d in os.listdir(HIST):
        m = re.match(r"r(\d+)_", d)
        if m and os.path.isdir(os.path.join(HIST, d)):
            nums.append(int(m.group(1)))
    nn = (max(nums) + 1) if nums else 1

    name = "r%02d_%s" % (nn, h[:8])
    dst = os.path.join(HIST, name)
    os.makedirs(dst, exist_ok=True)
    shutil.copy2(NRO, os.path.join(dst, "Pharaoh_Cleopatra-NX.nro"))

    lines = [
        "# NRO 归档",
        "md5=%s" % h,
        "size=%d" % size,
        "time=%s" % time.strftime("%Y-%m-%d %H:%M:%S"),
        "label=%s" % _arg("--label"),
        "note=%s" % _arg("--note"),
        "",
        "安装：Pharaoh_Cleopatra-NX.nro 拷到 SD 卡 switch\\ 与 switch\\pharaoh\\ 两处。",
    ]
    with open(os.path.join(dst, "info.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print("archived:", dst)
    print("md5=", h)
    return 0


if __name__ == "__main__":
    sys.exit(main())