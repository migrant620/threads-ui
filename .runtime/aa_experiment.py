# -*- coding: utf-8 -*-
"""Try CSS candidates that might force grayscale text AA on Windows Chromium; measure the T5 Hello box ink."""
import threading, functools, json
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
import numpy as np
from PIL import Image

DIST = r"F:/Workspaces_2026/Blog/OPC/Github-620/apps/threads/project/dist"
K = 1080 / 393.0
BOX = (60, 89.5, 316.9, 40.4)

handler = functools.partial(SimpleHTTPRequestHandler, directory=DIST)
srv = ThreadingHTTPServer(("127.0.0.1", 0), handler)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{port}/index.html"

VARIANTS = {
    "baseline": None,
    "filter-opacity": "textarea,input{filter:opacity(1)}",
    "translateZ": "textarea,input{transform:translateZ(0)}",
    "will-change": "textarea,input{will-change:transform}",
    "geo-precision-input": "textarea,input{text-rendering:geometricPrecision}",
    "geo-precision-all": "*{text-rendering:geometricPrecision}",
    "font-smooth-antialiased": "textarea,input{-webkit-font-smoothing:antialiased}",
    "text-shadow-hack": "textarea,input{text-shadow:0 0 currentColor}",
}

def ink_of(png_path):
    img = np.asarray(Image.open(png_path).convert("RGB")).astype(int)
    x, y, w, h = BOX
    px = img[int(y * K):int((y + h) * K), int(x * K):int((x + w) * K)]
    f = px.reshape(-1, 3)
    med = np.median(f, axis=0)
    d = np.sqrt(((f - med) ** 2).sum(axis=1))
    cut = np.percentile(d, 99)
    sel = f[d >= cut]
    ink = np.median(sel, axis=0)
    sat = ((np.abs(f[:, 0] - f[:, 1]) > 20) | (np.abs(f[:, 1] - f[:, 2]) > 20) | (np.abs(f[:, 0] - f[:, 2]) > 20)).sum()
    return med.round(1).tolist(), round(float(cut), 1), len(sel), ink.round(1).tolist(), int(sat)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 393, "height": 777}, device_scale_factor=K)
    pg = ctx.new_page()
    pg.goto(url, wait_until="load", timeout=60000)
    pg.get_by_label("m620ui", exact=True).wait_for(timeout=30000)
    pg.get_by_label("Create", exact=True).click()
    pg.get_by_label("Thread text", exact=True).fill("Hello")
    pg.get_by_label("Add to thread", exact=True).click()
    pg.wait_for_timeout(600)
    for name, css in VARIANTS.items():
        if css:
            pg.add_style_tag(content=css)
            pg.wait_for_timeout(120)
        shot = f"_aa_{name}.png"
        pg.screenshot(path=shot)
        med, cut, n, ink, sat = ink_of(shot)
        print(f"{name:24s} ink={ink} med={med} cut={cut} sel={n} sat={sat}")
    b.close()
srv.shutdown()
