import numpy as np
from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

w3 = np.array(Image.open(f"{BASE}/project/.runtime/gate_run11/T3-post-detail-web.png").convert('RGB')).astype(int)
r3 = np.array(Image.open(f"{BASE}/runs/forensics-20260921/T3/T3_1.png").convert('RGB')).astype(int)

def ink_dbg(img, off, box, tag):
    x,y,w,h = box
    reg = img[max(0,int(off+y*K)):int(off+(y+h)*K), max(0,int(x*K)):int((x+w)*K)]
    px = reg.reshape(-1,3).astype(float)
    med = np.median(px, axis=0)
    far = np.linalg.norm(px-med, axis=1)
    cut = np.percentile(far, 99)
    sel = px[far >= cut]
    inkv = [int(v) for v in np.median(sel, axis=0)]
    print(f"{tag}: shape={reg.shape} median={med.astype(int).tolist()} cut={cut:.2f} sel_n={len(sel)} ink={inkv}")
    # distribution of selected pixel colors
    uniq, cnt = np.unique(sel.astype(int), axis=0, return_counts=True)
    order = np.argsort(-cnt)
    top = [(uniq[i].tolist(), int(cnt[i])) for i in order[:6]]
    print(f"   selected top colors: {top}")
    return inkv

box1 = [345.0, 309.3, 48.0, 48.0]
ink_dbg(w3, 0, box1, "WEB box1")
ink_dbg(r3, STATUS, box1, "REF box1")

# where exactly are the gray 153-160 pixels in WEB box1? their x range:
x,y,w,h = box1
reg = w3[int(y*K):int((y+h)*K), int(x*K):int((x+w)*K)]
r,g,b = reg[:,:,0], reg[:,:,1], reg[:,:,2]
m = (abs(r-g)<6)&(abs(g-b)<6)&(r>140)&(r<170)
ys,xs = np.where(m)
print("web box1 gray153 x_dp:", x+xs.min()/K, "..", x+xs.max()/K, " y_dp:", y+ys.min()/K, "..", y+ys.max()/K, " n:", len(ys))
