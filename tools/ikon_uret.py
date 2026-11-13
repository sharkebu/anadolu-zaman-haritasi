#!/usr/bin/env python3
# Uygulama simgelerini ve paylaşım görselini üretir:  python tools/ikon_uret.py icons
# Gereken: Pillow (pip install pillow). Windows dışında Georgia yazı tipi yoksa varsayılan yazı tipi kullanılır.
import sys, os
from PIL import Image, ImageDraw, ImageFont

out = sys.argv[1]
ACC, P1, P2, GOLD, INK = "#9b2335", "#f7f0e3", "#e4d6bd", "#d9a441", "#2b241b"
# 24'lük ızgarada katlanmış harita
PAN = [
    ([(3.5, 6.8), (9, 4.5), (9, 17.2), (3.5, 19.5)], P1),
    ([(9, 4.5), (15, 6.8), (15, 19.5), (9, 17.2)], P2),
    ([(15, 6.8), (20.5, 4.5), (20.5, 17.2), (15, 19.5)], P1),
]


def svg():
    s = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">',
         f'<rect width="512" height="512" rx="112" fill="{ACC}"/>',
         '<g transform="translate(64 66) scale(16)" stroke-linejoin="round">']
    for pts, c in PAN:
        s.append(f'<path d="M{" L".join(f"{x} {y}" for x, y in pts)}Z" fill="{c}"/>')
    s.append(f'<circle cx="12" cy="11.2" r="2.1" fill="{ACC}"/><circle cx="12" cy="11.2" r="0.9" fill="{GOLD}"/>')
    s.append(f'<path d="M5.2 13.5c2-1.6 3.6-.6 5 0M16.5 10.2c1.2-.9 2.2-.7 2.6-.4" fill="none" stroke="{ACC}" stroke-opacity=".45" stroke-width=".55" stroke-linecap="round" stroke-dasharray="1 .9"/>')
    s.append('</g></svg>')
    return "\n".join(s)


def png(size, pad_frac=0.0, rounded=True):
    S = 4 * size
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if rounded:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 112 / 512), fill=ACC)
    else:
        d.rectangle([0, 0, S, S], fill=ACC)
    k = S / 512
    ox, oy, sc = 64 * k, 66 * k, 16 * k
    if pad_frac:
        c = S / 2
        ox, oy, sc = c - (c - ox) * (1 - pad_frac), c - (c - oy) * (1 - pad_frac), sc * (1 - pad_frac)
    T = lambda x, y: (ox + x * sc, oy + y * sc)
    for pts, c in PAN:
        d.polygon([T(x, y) for x, y in pts], fill=c)
    cx, cy = T(12, 11.2)
    for r, c in ((2.1, ACC), (0.9, GOLD)):
        d.ellipse([cx - r * sc, cy - r * sc, cx + r * sc, cy + r * sc], fill=c)
    return im.resize((size, size), Image.LANCZOS)


os.makedirs(out, exist_ok=True)
open(os.path.join(out, "icon.svg"), "w", encoding="utf-8").write(svg())
png(192).save(os.path.join(out, "icon-192.png"))
png(512).save(os.path.join(out, "icon-512.png"))
png(512, pad_frac=0.22, rounded=False).save(os.path.join(out, "icon-maskable-512.png"))
a = png(180, rounded=False)
a.save(os.path.join(out, "apple-touch-icon.png"))

# Paylaşım görseli 1200x630
W, H = 1200, 630
og = Image.new("RGB", (W, H), "#ece3d1")
d = ImageDraw.Draw(og)
ic = png(300)
og.paste(ic, (90, 165), ic)
try:
    f1 = ImageFont.truetype("georgiab.ttf", 54)
    f2 = ImageFont.truetype("georgia.ttf", 34)
except OSError:
    f1 = f2 = ImageFont.load_default()
d.text((450, 230), "Anadolu Zaman Haritası", font=f1, fill=INK)
d.text((452, 320), "Göbekli Tepe'den Cumhuriyet'e,", font=f2, fill="#4a3f31")
d.text((452, 365), "bu topraklarda neler yaşandı?", font=f2, fill="#4a3f31")
eras = ["#8b6f5a", "#5a9a3a", "#c99a1c", "#e0703a", "#8a56c2", "#2b9bc0", "#c8407a", "#3a56c8", "#13a08a", "#9e2a2a", "#e5383b", "#55657a"]
x = 452
for c in eras:
    d.rounded_rectangle([x, 440, x + 52, 448], radius=4, fill=c)
    x += 58
og.save(os.path.join(out, "og.png"), optimize=True)
print("ok")

