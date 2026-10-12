import numpy as np
from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

def load(p):
    return np.array(Image.open(p).convert('RGB')).astype(int)

def bands(img, off, x0, x1, y0, y1, thr=30, bg=None):
    """find y-bands in column x0..x1 (dp) with pixels far from background"""
    reg = img[int((off+y0)*K):int((off+y1)*K), int(x0*K):int(x1*K)]
    if bg is None:
        bg = np.median(reg.reshape(-1,3), axis=0)
    d = np.linalg.norm(reg - bg, axis=2)
    mask = (d > thr).any(axis=1) if d.ndim == 2 else (d > thr)
    rows = np.where(mask)[0]
    out = []
    if len(rows):
        start = rows[0]; prev = rows[0]
        for r in rows[1:]:
            if r - prev > 6:
                out.append((start, prev)); start = r
            prev = r
        out.append((start, prev))
    res = []
    for a, b in out:
        sub = reg[a:b+1]
        dd = np.linalg.norm(sub - bg, axis=2)
        xs = np.where((dd > thr).any(axis=0))[0]
        # dominant non-bg color
        px = sub[dd > thr]
        med = np.median(px, axis=0).astype(int).tolist() if len(px) else None
        res.append({
            'y_dp': (round(y0 + a/K, 1), round(y0 + b/K, 1)),
            'x_dp': (round(x0 + xs.min()/K, 1), round(x0 + xs.max()/K, 1)),
            'n': int((dd > thr).sum()),
            'col': med,
        })
    return res

def ink(img, b, off):
    x,y,w,h = b
    reg = img[max(0,int(off+y*K)):int(off+(y+h)*K), max(0,int(x*K)):int((x+w)*K)]
    px = reg.reshape(-1,3).astype(float)
    far = np.linalg.norm(px-np.median(px,axis=0),axis=1)
    cut = np.percentile(far,99)
    return [int(v) for v in np.median(px[far>=cut],axis=0)]

print("======== T3 post-detail: right column x 340-393, y 170-620 ========")
r3 = load(f"{BASE}/runs/forensics-20260921/T3/T3_1.png")
w3 = load(f"{BASE}/project/.runtime/gate_run11/T3-post-detail-web.png")
print("REF bands:")
for b in bands(r3, STATUS, 340, 393, 170, 620): print(" ", b)
print("WEB bands:")
for b in bands(w3, 0, 340, 393, 170, 620): print(" ", b)

print()
print("======== T7 activity: right column x 340-393, y 100-420 ========")
r7 = load(f"{BASE}/runs/forensics-20260921/T7/T7_1.png")
w7 = load(f"{BASE}/project/.runtime/gate_run11/T7-activity-web.png")
print("REF bands:")
for b in bands(r7, STATUS, 340, 393, 100, 420): print(" ", b)
print("WEB bands:")
for b in bands(w7, 0, 340, 393, 100, 420): print(" ", b)

print()
print("======== T1 feed: blue badge + box contents ========")
r1 = load(f"{BASE}/runs/forensics-20260921/T1/T1_1.png")
w1 = load(f"{BASE}/project/.runtime/gate_run11/T1-home-feed-web.png")
box = [148.5, 666.6, 48, 48]
print("ref ink @box:", ink(r1, box, STATUS), " web ink @box:", ink(w1, box, 0))
# blue pixel map in region y 640-730, x 100-250
def blue_map(img, off, tag):
    reg = img[int((off+640)*K):int((off+730)*K), int(100*K):int(250*K)]
    r, g, b = reg[:,:,0], reg[:,:,1], reg[:,:,2]
    m = (b > 180) & (b - r > 80) & (g > 100) & (g < 200)
    ys, xs = np.where(m)
    if len(ys):
        print(f"{tag}: blue n={len(ys)} x_dp {100+xs.min()/K:.1f}..{100+xs.max()/K:.1f}  y_dp {640+ys.min()/K:.1f}..{640+ys.max()/K:.1f}")
    else:
        print(f"{tag}: no blue")
blue_map(r1, STATUS, "REF")
blue_map(w1, 0, "WEB")
# dark pixels in ref box
def dark(img, off, tag):
    x,y,w,h = box
    reg = img[int((off+y)*K):int((off+(y+h))*K), int(x*K):int((x+w)*K)]
    m = reg.sum(axis=2) < 300
    ys, xs = np.where(m)
    if len(ys):
        print(f"{tag} box dark n={len(ys)} x_dp {x+xs.min()/K:.1f}..{x+xs.max()/K:.1f} y_dp {y+ys.min()/K:.1f}..{y+ys.max()/K:.1f}")
    else:
        print(f"{tag}: box has no dark px")
dark(r1, STATUS, "REF")
dark(w1, 0, "WEB")
# full-row band scan across x 100-393 y 655-700 (post 2 header line)
print("REF row bands x100-393 y650-700:")
for b in bands(r1, STATUS, 100, 393, 650, 700): print(" ", b)
print("WEB row bands x100-393 y650-700:")
for b in bands(w1, 0, 100, 393, 650, 700): print(" ", b)
