import numpy as np
from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

ref = Image.open(f"{BASE}/runs/forensics-20260921/T8/T8_1.png").convert('RGB')
web = Image.open(f"{BASE}/project/.runtime/gate_run11/T8-profile-web.png").convert('RGB')

# crop around the badge + avatar: dp x 270..390, y 45..140
def crop(img, x0, y0, x1, y1, off):
    px0, py0, px1, py1 = int(x0*K), int((off+y0)*K), int(x1*K), int((off+y1)*K)
    return img.crop((px0, py0, px1, py1))

for name, img, off in (("ref", ref, STATUS), ("web", web, 0)):
    c = crop(img, 270, 45, 390, 140, off)
    c = c.resize((c.width*2, c.height*2), Image.NEAREST)
    c.save(f"{BASE}/project/.runtime/_diag_t8_badge_{name}.png")
    print(name, c.size)

# also: in ref box, print a coarse ascii map of darkness (16x16 cells over 48dp box)
def amap(img, b, off, tag):
    x,y,w,h = b
    reg = np.array(crop(Image.fromarray(img), x, y, x+w, y+h, off)).astype(int)
    cells = []
    step = reg.shape[0]//12
    for cy in range(12):
        row = ''
        for cx in range(12):
            blk = reg[cy*step:(cy+1)*step, cx*step:(cx+1)*step]
            m = blk.sum(axis=2).mean()
            row += '#' if m < 250 else ('+' if m < 550 else ('.' if m < 700 else ' '))
        cells.append(row)
    print(tag)
    print('\n'.join(cells))

refa = np.array(ref); weba = np.array(web)
amap(refa, [284.2, 79.7, 48, 48], STATUS, "REF addPlate box (12x12 cells):")
print()
amap(weba, [284.2, 79.7, 48, 48], 0, "WEB addPlate box (12x12 cells):")
