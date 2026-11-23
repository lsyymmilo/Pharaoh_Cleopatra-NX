import struct, zlib
d = open(r"C:\Users\Lsyym\Desktop\12.png","rb").read()
pos=8; w=h=0; idat=b""
while pos<len(d):
    ln=struct.unpack(">I",d[pos:pos+4])[0]; typ=d[pos+4:pos+8]; dat=d[pos+8:pos+8+ln]; pos+=12+ln
    if typ==b"IHDR": w,h=struct.unpack(">II",dat[:8])
    elif typ==b"IDAT": idat+=dat
raw=zlib.decompress(idat); stride=w*4+1
white=0; br=0
for y in range(h):
    for x in range(w):
        o=y*stride+1+x*4
        r,g,b,a=raw[o],raw[o+1],raw[o+2],raw[o+3]
        if a>120 and r>225 and g>225 and b>225:
            white+=1
            if x>=160 and y>=160: br+=1
print("desktop 12.png: %dx%d, white pixels=%d, bottom-right white=%d" % (w,h,white,br))