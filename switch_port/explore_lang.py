import struct
import sys

def explore_text(path):
    d = open(path, 'rb').read()
    print('sig:', d[:24])
    print('size:', len(d))
    # candidate: entries begin at some offset; find first (1, x) pattern with increasing x
    # print bytes 0..80
    print(' '.join(f'{b:02x}' for b in d[:120]))
    # try julius model: header 28, entries (offset, in_use)
    for hdr in (28, 24, 42, 20, 17):
        ok = 0
        offs = []
        for i in range(6):
            o, u = struct.unpack_from('<ii', d, hdr + i * 8)
            offs.append((o, u))
        print(f'hdr={hdr} julius order:', offs)
        offs = []
        for i in range(6):
            u, o = struct.unpack_from('<ii', d, hdr + i * 8)
            offs.append((u, o))
        print(f'hdr={hdr} swapped  :', offs)

def try_dump(path, hdr, order, count):
    d = open(path, 'rb').read()
    entries = []
    for i in range(count):
        a, b = struct.unpack_from('<ii', d, hdr + i * 8)
        entries.append((a, b) if order == 'julius' else (b, a))
    # entries = (offset, in_use)
    end = hdr + count * 8
    print('entries end:', end, hex(end))
    # offsets relative to data start?
    valid = 0
    for (o, u) in entries[:12]:
        if u:
            print('off', o, hex(o), 'bytes@o:', d[o:o+60] if o < len(d) else 'OOR')

if __name__ == '__main__':
    p = sys.argv[1] if len(sys.argv) > 1 else r'D:\Games\Pharaoh Gold\Pharaoh_Text.eng'
    explore_text(p)
