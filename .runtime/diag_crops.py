from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

def crop(img, x0, y0, x1, y1, off):
    return img.crop((int(x0*K), int((off+y0)*K), int(x1*K), int((off+y1)*K)))

jobs = [
    # (refpng, webpng, dp x0,y0,x1,y1, out)
    ("T3/T3_1.png", "T3-post-detail-web.png", 320, 170, 393, 620, "t3_right"),
    ("T7/T7_1.png", "T7-activity-web.png",    320, 100, 393, 420, "t7_right"),
    ("T1/T1_1.png", "T1-home-feed-web.png",   100, 620, 393, 730, "t1_badge"),
]
for refn, webn, x0, y0, x1, y1, out in jobs:
    ref = Image.open(f"{BASE}/runs/forensics-20260921/{refn}").convert('RGB')
    web = Image.open(f"{BASE}/project/.runtime/gate_run11/{webn}").convert('RGB')
    for tag, img, off in (("ref", ref, STATUS), ("web", web, 0)):
        c = crop(img, x0, y0, x1, y1, off)
        c = c.resize((c.width*2, c.height*2), Image.NEAREST)
        c.save(f"{BASE}/project/.runtime/_diag_{out}_{tag}.png")
        print(out, tag, c.size)
