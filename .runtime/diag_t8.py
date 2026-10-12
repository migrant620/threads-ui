import re, sys, math
import numpy as np
from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

# 1) parse XML for nodes near the addPlate center
xml_path = f"{BASE}/runs/forensics-20260921/T8/T8_1.xml"
txt = open(xml_path, encoding='utf-8').read()
bounds_re = re.compile(r'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"')
nodes = []
for m in bounds_re.finditer(txt):
    x1,y1,x2,y2 = map(int, m.groups())
    # convert to dp (content coords)
    cx = ((x1+x2)/2)/K
    cy = ((y1+y2)/2 - STATUS)/K
    w = (x2-x1)/K
    h = (y2-y1)/K
    # surrounding text snippet
    seg = txt[m.start():m.end()+400]
    tmatch = re.search(r'text="([^"]*)"', seg)
    cmatch = re.search(r'class="([^"]*)"', seg)
    dmatch = re.search(r'content-desc="([^"]*)"', seg)
    label = (tmatch.group(1) if tmatch else '') or (dmatch.group(1) if dmatch else '')
    cls = cmatch.group(1) if cmatch else ''
    nodes.append((cx, cy, w, h, label, cls, x1, y1, x2, y2))

print("=== ref nodes within 25dp of addPlate center (308.2,103.69) ===")
target = (308.2, 103.69)
for n in nodes:
    d = math.hypot(n[0]-target[0], n[1]-target[1])
    if d < 25:
        print(f"  center=({n[0]:.1f},{n[1]:.1f}) w={n[2]:.1f} h={n[3]:.1f} dist={d:.1f} cls={n[5]} label={n[4]!r}")

print()
print("=== ref nodes whose box overlaps [284.2,79.7,48,48] (dp) ===")
bx0,bx1 = 284.2, 284.2+48
by0,by1 = 79.7, 79.7+48
for n in nodes:
    nx0,nx1 = n[0]-n[2]/2, n[0]+n[2]/2
    ny0,ny1 = n[1]-n[3]/2, n[1]+n[3]/2
    ox = max(0, min(bx1,nx1)-max(bx0,nx0))
    oy = max(0, min(by1,ny1)-max(by0,ny0))
    if ox>2 and oy>2:
        print(f"  center=({n[0]:.1f},{n[1]:.1f}) w={n[2]:.1f} h={n[3]:.1f} overlap=({ox:.1f},{oy:.1f}) cls={n[5]} label={n[4]!r}")

# 2) compute ink() on both rasters
def ink(img, b, off):
    x,y,w,h = b
    reg = img[max(0,int(off+y*K)):int(off+(y+h)*K), max(0,int(x*K)):int((x+w)*K)]
    if reg.size==0: return None
    px = reg.reshape(-1,3).astype(float)
    far = np.linalg.norm(px-np.median(px,axis=0),axis=1)
    cut = np.percentile(far,99)
    return [int(v) for v in np.median(px[far>=cut],axis=0)]

box = [284.2, 79.7, 48, 48]
ref = np.array(Image.open(f"{BASE}/runs/forensics-20260921/T8/T8_1.png").convert('RGB'))
web = np.array(Image.open(f"{BASE}/project/.runtime/gate_run11/T8-profile-web.png").convert('RGB'))
print()
print("ref img shape", ref.shape, "web img shape", web.shape)
print("ref ink @addPlate:", ink(ref, box, STATUS))
print("web ink @addPlate:", ink(web, box, 0))

# scan the region to see colors
def scan(img, b, off):
    x,y,w,h = b
    reg = img[max(0,int(off+y*K)):int(off+(y+h)*K), max(0,int(x*K)):int((x+w)*K)]
    px = reg.reshape(-1,3).astype(int)
    med = np.median(px,axis=0)
    # count distinct color clusters
    uniq, counts = np.unique(px, axis=0, return_counts=True)
    order = np.argsort(-counts)
    return med.tolist(), [(uniq[i].tolist(), int(counts[i])) for i in order[:8]]

print("ref scan:", scan(ref, box, STATUS))
print("web scan:", scan(web, box, 0))
