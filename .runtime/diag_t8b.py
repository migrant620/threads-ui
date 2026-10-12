import numpy as np
from PIL import Image

BASE = r"F:\Workspaces_2026\Blog\OPC\Github-620\apps\threads"
K = 1080/393.0
STATUS = 136

ref = np.array(Image.open(f"{BASE}/runs/forensics-20260921/T8/T8_1.png").convert('RGB'))
web = np.array(Image.open(f"{BASE}/project/.runtime/gate_run11/T8-profile-web.png").convert('RGB'))

def region(img, b, off):
    x,y,w,h = b
    return img[max(0,int(off+y*K)):int(off+(y+h)*K), max(0,int(x*K)):int((x+w)*K)]

# --- where are the dark pixels in the ref addPlate box?
box = [284.2, 79.7, 48, 48]
rreg = region(ref, box, STATUS)
wreg = region(web, box, 0)
print("ref region shape", rreg.shape)
dark_r = np.where(rreg.astype(int).sum(axis=2) < 200)
print("ref dark(<200 sum) count:", len(dark_r[0]))
if len(dark_r[0]):
    print("  y range px:", dark_r[0].min(), dark_r[0].max(), " x range px:", dark_r[1].min(), dark_r[1].max())
    # convert px back to dp within box
    print("  y dp:", dark_r[0].min()/K, dark_r[0].max()/K, " x dp:", dark_r[1].min()/K, dark_r[1].max()/K)
    ys, xs = dark_r
    print("  sample colors:", [rreg[ys[i], xs[i]].tolist() for i in range(0, len(ys), max(1, len(ys)//5))][:6])

dark_w = np.where(wreg.astype(int).sum(axis=2) < 200)
print("web dark(<200 sum) count:", len(dark_w[0]))
if len(dark_w[0]):
    print("  y dp:", dark_w[0].min()/K, dark_w[0].max()/K, " x dp:", dark_w[1].min()/K, dark_w[1].max()/K)

# blue-ish pixels (B > R+20) in web box
wb = wreg.astype(int)
blue = np.where((wb[:,:,2] > wb[:,:,0] + 20))
print("web blue count:", len(blue[0]))
if len(blue[0]):
    print("  y dp:", blue[0].min()/K, blue[0].max()/K, " x dp:", blue[1].min()/K, blue[1].max()/K)

# --- avatar box ink on both sides
abox = [312.94, 56.04, 64.04, 64.04]
def ink(img, b, off):
    reg = region(img, b, off)
    px = reg.reshape(-1,3).astype(float)
    far = np.linalg.norm(px-np.median(px,axis=0),axis=1)
    cut = np.percentile(far,99)
    return [int(v) for v in np.median(px[far>=cut],axis=0)]
print()
print("ref ink @avatar box:", ink(ref, abox, STATUS))
print("web ink @avatar box:", ink(web, abox, 0))

# --- ref avatar's own pixels in the overlap zone (x 313..332, y 80..120 dp)
ov = [313, 80, 19, 40]
print("ref ink @overlap zone:", ink(ref, ov, STATUS))
print("web ink @overlap zone:", ink(web, ov, 0))
print("ref scan overlap:", np.unique(region(ref, ov, STATUS).reshape(-1,3), axis=0)[:5].tolist())
