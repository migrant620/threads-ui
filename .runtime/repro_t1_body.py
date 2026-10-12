# -*- coding: utf-8 -*-
"""Reproduce the unpainted post-2 body: inspect computed style + paint of 'We are in a simulation'."""
import threading, socket, functools, sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

DIST = r"F:/Workspaces_2026/Blog/OPC/Github-620/apps/threads/project/dist"
OUT = r"F:/Workspaces_2026/Blog/OPC/Github-620/apps/threads/project/.runtime/_repro_t1.png"

handler = functools.partial(SimpleHTTPRequestHandler, directory=DIST)
srv = ThreadingHTTPServer(("127.0.0.1", 0), handler)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{port}/index.html"

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 393, "height": 777}, device_scale_factor=1080 / 393)
    pg = ctx.new_page()
    pg.goto(url, wait_until="load", timeout=60000)
    pg.get_by_label("m620ui", exact=True).wait_for(timeout=30000)
    pg.wait_for_timeout(800)
    info = pg.evaluate(
        """() => {
        const out = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const t = walker.currentNode;
          if (t.textContent.includes('We are in a simulation')) {
            const el = t.parentElement;
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            const chain = [];
            let n = el;
            for (let i = 0; i < 8 && n; i++) {
              const s = getComputedStyle(n);
              chain.push({tag: n.tagName, cls: (n.className||'').toString().slice(0,40),
                ov: s.overflow, vis: s.visibility, disp: s.display, op: s.opacity,
                col: s.color, bg: s.backgroundColor, z: s.zIndex, pos: s.position,
                clip: (s.clipPath||'').slice(0,30)});
              n = n.parentElement;
            }
            out.push({rect: {x: r.x, y: r.y, w: r.width, h: r.height},
                      color: cs.color, vis: cs.visibility, disp: cs.display, op: cs.opacity,
                      fontSize: cs.fontSize, family: cs.fontFamily.slice(0,40), chain});
          }
        }
        return out;
      }"""
    )
    import json
    print(json.dumps(info, indent=1, ensure_ascii=False))
    pg.screenshot(path=OUT)
    b.close()
srv.shutdown()
print("shot saved:", OUT)
