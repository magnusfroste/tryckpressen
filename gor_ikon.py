#!/usr/bin/env python3
"""Ikoner för Tryckpressen: en stämpel som trycker ett spegelvänt blad.
Tre former, inga tunna streck – läses även vid 48 px."""
from PIL import Image, ImageDraw

INK = (47, 79, 143)
PAPER = (251, 247, 239)
GOLD = (217, 154, 33)


def draw(size, maskable=False):
    S = size * 4
    im = Image.new("RGB", (S, S), INK)
    d = ImageDraw.Draw(im)
    # mjuk inre yta (papper) som tryckets ark
    m = S * 0.16
    d.rounded_rectangle([m, m, S - m, S - m], radius=S * 0.09, fill=PAPER)
    # bladmönstret: tre block i trappa (osymmetriskt -> spegelvändningen syns)
    bw = S * 0.16
    x0 = S * 0.28
    y0 = S * 0.26
    for i in range(3):
        for j in range(3 - i):
            x = x0 + (j + i * 0.5) * bw
            y = y0 + i * bw
            d.rounded_rectangle([x, y, x + bw * 0.9, y + bw * 0.9], radius=bw * 0.16, fill=INK)
    # stämpelhandtag uppe till höger
    d.rounded_rectangle([S * 0.63, S * 0.63, S * 0.83, S * 0.79], radius=S * 0.03, fill=GOLD)
    im = im.resize((size, size), Image.LANCZOS)
    if maskable:
        full = Image.new("RGB", (size, size), INK)
        inner = im.resize((int(size * 0.72), int(size * 0.72)), Image.LANCZOS)
        full.paste(inner, (int(size * 0.14), int(size * 0.14)))
        return full
    return im


for s in (192, 512):
    draw(s).save(f"/opt/data/projects/skolappar-next/tryckpressen/public/icon-{s}.png")
draw(512, True).save("/opt/data/projects/skolappar-next/tryckpressen/public/icon-maskable-512.png")
draw(180).save("/opt/data/projects/skolappar-next/tryckpressen/public/apple-touch-icon.png")
draw(48).save("/tmp/ikon48.png")
print("klart")