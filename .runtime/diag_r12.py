# -*- coding: utf-8 -*-
"""Diagnose the three colour-box failures of gate_run12 (T1 icon@172,691 / T3 icon@369,333 / T5 Hello)."""
import numpy as np
from PIL import Image

ROOT = r"F:/Workspaces_2026/Blog/OPC/Github-620/apps/threads"
RUN12 = ROOT + r"/project/.runtime/gate_run12"
REFS = ROOT + r"/runs/forensics-20260921"
K = 1080 / 393.0
REF_STATUS = 136


def load(p):
    return np.asarray(Image.open(p).convert("RGB"))


def box(img, bx, ref=False):
    x, y, w, h = bx
    x0, x1 = int(round(x * K)), int(round((x + w) * K))
    if ref:
        y0, y1 = int(round(y * K)) + REF_STATUS, int(round((y + h) * K)) + REF_STATUS
    else:
        y0, y1 = int(round(y * K)), int(round((y + h) * K))
    return img[y0:y1, x0:x1]


def ink_sim(px):
    """Replicate the gate's ink(): median colour -> 1% farthest -> median of selected."""
    flat = px.reshape(-1, 3).astype(float)
    med = np.median(flat, axis=0)
    d = np.sqrt(((flat - med) ** 2).sum(axis=1))
    cut = np.percentile(d, 99)
    sel = flat[d >= cut]
    return med, cut, len(sel), np.median(sel, axis=0)


def classify(px):
    """Count pixels in coarse classes."""
    f = px.reshape(-1, 3).astype(int)
    grey = (np.abs(f[:, 0] - f[:, 1]) < 12) & (np.abs(f[:, 1] - f[:, 2]) < 12)
    page = grey & (f[:, 0] > 246)
    sep = grey & (f[:, 0] >= 228) & (f[:, 0] <= 246)
    dots = grey & (f[:, 0] >= 120) & (f[:, 0] < 210)
    dark = grey & (f[:, 0] < 120)
    colored = ~grey
    return page.sum(), sep.sum(), dots.sum(), dark.sum(), colored.sum()


def bbox_of(mask, bx, ref=False):
    ys, xs = np.where(mask)
    if len(ys) == 0:
        return None
    x, y, w, h = bx
    x0 = x + xs.min() / K
    x1 = x + xs.max() / K
    if ref:
        y0 = y + (ys.min() - REF_STATUS) / K
        y1 = y + (ys.max() - REF_STATUS) / K
    else:
        y0 = y + ys.min() / K
        y1 = y + ys.max() / K
    return (round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1))


def report(tag, img, bx, ref=False):
    px = box(img, bx, ref)
    med, cut, nsel, ink = ink_sim(px)
    print(f"  {tag}: median={med.round(1)} cut={cut:.1f} sel={nsel} ink={ink.round(1)}")
    print(f"    classes page/sep/dots/dark/colored = {classify(px)}")
    return px


print("=== T1 icon@172,691  box [148.5,666.6,48,48] ===")
B1 = (148.5, 666.6, 48, 48)
ref1 = load(REFS + "/T1/T1_1.png")
web1 = load(RUN12 + "/T1-home-feed-web.png")
print(" ref img", ref1.shape, " web img", web1.shape)
report("ref", ref1, B1, ref=True)
pxw = report("web", web1, B1)
# where are the blue pixels in web box?
f = pxw.reshape(-1, 3).astype(int)
blue = (f[:, 2] - f[:, 0] > 60) & (f[:, 2] > 150)
print("    web blue px:", blue.sum(), "bbox dp:", bbox_of(blue.reshape(pxw.shape[:2]), B1))
if blue.sum():
    uniq, cnt = np.unique(f[blue].reshape(-1, 3), axis=0, return_counts=True)
    top = cnt.argsort()[::-1][:5]
    print("    top blue colors:", [(tuple(uniq[i]), int(cnt[i])) for i in top])
# what is black-ish in ref box?
fr = box(ref1, B1, True).reshape(-1, 3).astype(int)
darkr = fr.sum(axis=1) < 200
print("    ref dark(<67avg) px:", darkr.sum(), "bbox dp:", bbox_of(darkr.reshape(box(ref1, B1, True).shape[:2]), B1, True))

print()
print("=== T3 icon@369,333  box [345,309.3,48,48] ===")
B3 = (345, 309.3, 48, 48)
ref3 = load(REFS + "/T3/T3_1.png")
web3 = load(RUN12 + "/T3-post-detail-web.png")
pr = report("ref", ref3, B3, ref=True)
pw = report("web", web3, B3)
fr = box(ref3, B3, True).reshape(-1, 3).astype(int)
fw = box(web3, B3).reshape(-1, 3).astype(int)
for tag, f, p in (("ref", fr, pr), ("web", fw, pw)):
    dots = (np.abs(f[:, 0] - f[:, 1]) < 12) & (np.abs(f[:, 1] - f[:, 2]) < 12) & (f[:, 0] >= 120) & (f[:, 0] < 210)
    sep = (np.abs(f[:, 0] - f[:, 1]) < 12) & (np.abs(f[:, 1] - f[:, 2]) < 12) & (f[:, 0] >= 228) & (f[:, 0] <= 246)
    print(f"    {tag} dots bbox dp:", bbox_of(dots.reshape(p.shape[:2]), B3, tag == "ref"),
          " sep bbox dp:", bbox_of(sep.reshape(p.shape[:2]), B3, tag == "ref"))

print()
print("=== T5 Hello  box [60,89.5,316.9,40.4] ===")
B5 = (60, 89.5, 316.9, 40.4)
ref5 = load(REFS + "/T5/T5_1.png")
web5 = load(RUN12 + "/T5-composer-two-web.png")
report("ref", ref5, B5, ref=True)
pw5 = report("web", web5, B5)
f5 = pw5.reshape(-1, 3).astype(int)
sat = (np.abs(f5[:, 0] - f5[:, 1]) > 20) | (np.abs(f5[:, 1] - f5[:, 2]) > 20) | (np.abs(f5[:, 0] - f5[:, 2]) > 20)
print("    web saturated px:", sat.sum(), "bbox dp:", bbox_of(sat.reshape(pw5.shape[:2]), B5))
if sat.sum():
    uniq, cnt = np.unique(f5[sat].reshape(-1, 3), axis=0, return_counts=True)
    top = cnt.argsort()[::-1][:8]
    print("    top saturated colors:", [(tuple(uniq[i]), int(cnt[i])) for i in top])
# strong dark in web vs ref
for tag, p in (("ref", box(ref5, B5, True)), ("web", pw5)):
    f = p.reshape(-1, 3).astype(int)
    d = f.sum(axis=1)
    print(f"    {tag} px <90 avg:", (d < 270).sum(), " <60 avg:", (d < 180).sum())
