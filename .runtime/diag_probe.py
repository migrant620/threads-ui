import numpy as np
from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

r3 = np.array(Image.open(f"{BASE}/runs/forensics-20260921/T3/T3_1.png").convert('RGB')).astype(int)

def probe(y0, y1, x0, x1, tag):
    reg = r3[int(STATUS + y0*K):int(STATUS + y1*K), int(x0*K):int(x1*K)]
    d = np.linalg.norm(reg - 255, axis=2)
    n = int((d > 60).sum())
    if n:
        ys, xs = np.where(d > 60)
        # dominant non-white color
        px = reg[d > 60]
        uniq, cnt = np.unique(px, axis=0, return_counts=True)
        top = uniq[np.argsort(-cnt)][0].tolist()
        print(f"{tag}: non-white n={n} y {y0+ys.min()/K:.1f}..{y0+ys.max()/K:.1f} x {x0+xs.min()/K:.1f}..{x0+xs.max()/K:.1f} top={top}")
    else:
        print(f"{tag}: EMPTY")

# candidates from the gray_dots scan
probe(248, 255, 355, 385, "band@250")
probe(334, 342, 355, 385, "band@336 (box1 dots)")
probe(365, 371, 355, 385, "band@367")
probe(467, 473, 355, 385, "band@469")
# full sweep: 5dp windows every 5dp from 240 to 620
print()
print("sweep (x 358-380):")
y = 240.0
while y < 620:
    probe(y, y+5, 358, 380, f"  y{y:.0f}-{y+5:.0f}")
    y += 5
