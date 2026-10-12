import numpy as np
from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

r3 = np.array(Image.open(f"{BASE}/runs/forensics-20260921/T3/T3_1.png").convert('RGB')).astype(int)
w3 = np.array(Image.open(f"{BASE}/project/.runtime/gate_run11/T3-post-detail-web.png").convert('RGB')).astype(int)

def dmap(img, off, box, tag):
    x,y,w,h = box
    reg = img[max(0,int(off+y*K)):int(off+(y+h)*K), max(0,int(x*K)):int((x+w)*K)]
    px = reg.reshape(-1,3).astype(float)
    med = np.median(px, axis=0)
    d = np.linalg.norm(reg - med, axis=2)
    # 12x12 cells, show max distance per cell as char
    ch = d.shape[0]//12
    print(f"{tag} (median={med.astype(int).tolist()}):")
    for cy in range(12):
        row = ''
        for cx in range(12):
            blk = d[cy*ch:(cy+1)*ch, cx*ch:(cx+1)*ch]
            m = blk.max()
            row += '#' if m > 150 else ('+' if m > 60 else ('.' if m > 25 else ' '))
        print('   ' + row)

for i, by in enumerate((309.3, 428.3, 530.5)):
    box = [345.0, by, 48.0, 48.0]
    dmap(r3, STATUS, box, f"REF box{i+1} y={by}")
    dmap(w3, 0, box, f"WEB box{i+1} y={by}")
    print()
