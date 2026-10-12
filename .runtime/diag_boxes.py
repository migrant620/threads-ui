import numpy as np
from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

def load(p):
    return np.array(Image.open(p).convert('RGB')).astype(int)

def box_analysis(img, off, box, tag):
    x,y,w,h = box
    reg = img[max(0,int(off+y*K)):int(off+(y+h)*K), max(0,int(x*K)):int((x+w)*K)]
    px = reg.reshape(-1,3).astype(float)
    med = np.median(px, axis=0)
    far = np.linalg.norm(px-med, axis=1)
    cut = np.percentile(far, 99)
    ink = [int(v) for v in np.median(px[far>=cut], axis=0)]
    # grayish pixels (150-200, low chroma)
    r,g,b = reg[:,:,0], reg[:,:,1], reg[:,:,2]
    grayish = (abs(r-g)<8)&(abs(g-b)<8)&(r>120)&(r<210)
    dark = reg.sum(axis=2) < 300
    ys,xs = np.where(grayish)
    ginfo = f"gray n={len(ys)} y {y+ys.min()/K:.1f}..{y+ys.max()/K:.1f}" if len(ys) else "gray none"
    ys,xs = np.where(dark)
    dinfo = f"dark n={len(ys)} y {y+ys.min()/K:.1f}..{y+ys.max()/K:.1f}" if len(ys) else "dark none"
    print(f"  {tag}: ink={ink} median={[int(v) for v in med]} | {ginfo} | {dinfo}")

print("==== T3 boxes (ref=T3_1, web=run11) ====")
r3 = load(f"{BASE}/runs/forensics-20260921/T3/T3_1.png")
w3 = load(f"{BASE}/project/.runtime/gate_run11/T3-post-detail-web.png")
for i, by in enumerate((309.3, 428.3, 530.5)):
    box = [345.0, by, 48.0, 48.0]
    box_analysis(r3, STATUS, box, f"REF box{i+1} y={by}")
    box_analysis(w3, 0, box, f"WEB box{i+1} y={by}")

print()
print("==== T7 boxes ====")
r7 = load(f"{BASE}/runs/forensics-20260921/T7/T7_1.png")
w7 = load(f"{BASE}/project/.runtime/gate_run11/T7-activity-web.png")
for i, by in enumerate((200.1, 287.8)):
    box = [345.0, by, 48.0, 48.0]
    box_analysis(r7, STATUS, box, f"REF box{i+1} y={by}")
    box_analysis(w7, 0, box, f"WEB box{i+1} y={by}")

print()
print("==== T7 full column gray-dot scan (x 355-385, finer) ====")
def gray_dots(img, off, y0, y1, tag):
    reg = img[int((off+y0)*K):int((off+y1)*K), int(355*K):int(385*K)]
    r,g,b = reg[:,:,0], reg[:,:,1], reg[:,:,2]
    m = (abs(r-g)<10)&(abs(g-b)<10)&(r>120)&(r<210)
    rows = np.where(m.any(axis=1))[0]
    out=[]
    if len(rows):
        s=p=rows[0]
        for rr in rows[1:]:
            if rr-p>10: out.append((s,p)); s=rr
            p=rr
        out.append((s,p))
    for a,bnd in out:
        sub=m[a:bnd+1]
        ys,xs=np.where(sub)
        print(f"  {tag}: dots y {y0+a/K:.1f}..{y0+bnd/K:.1f}  x {355+xs.min()/K:.1f}..{355+xs.max()/K:.1f} n={int(sub.sum())}")
gray_dots(r7, STATUS, 100, 420, "REF")
gray_dots(w7, 0, 100, 420, "WEB")
print()
print("==== T3 full column gray-dot scan (x 355-385) ====")
gray_dots(r3, STATUS, 170, 620, "REF")
gray_dots(w3, 0, 170, 620, "WEB")
