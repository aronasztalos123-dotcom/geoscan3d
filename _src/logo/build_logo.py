"""Geoscan3D logo: a 'G' built from horizontal LiDAR scan lines, lit like a sphere, with the laser as its crossbar.
Wordmark outlined from Switzer Semibold so the SVG renders identically everywhere."""
import math, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
FONT = os.path.join(ROOT, "_src/raw/switzer/Switzer_Complete/Fonts/OTF/Switzer-Semibold.otf")
OUT = os.path.join(ROOT, "public/brand")
os.makedirs(OUT, exist_ok=True)

R, CX, CY, SW = 42.0, 50.0, 50.0, 7.6
YS = [14, 26, 38, 50, 62, 74, 86]
CAP = SW / 2

def bars():
    """(y, x1, x2, role) for every scan line."""
    out = []
    for y in YS:
        dy = abs(y - CY)
        h = math.sqrt(max(R * R - dy * dy, 0)) - CAP
        x1, x2 = CX - h, CX + h
        if y in (26, 38):            # the G's aperture
            x2 = CX - 4
        if y == 50:                  # crossbar: ink stub on the left, laser from the centre out
            out.append((y, x1, CX - 12, "ink"))
            out.append((y, CX - 2, CX + h + 14, "beam"))
            continue
        out.append((y, x1, x2, "ink"))
    return out

def mark_svg(ramp, beam, extra=""):
    lines = []
    for i, (y, x1, x2, role) in enumerate(bars()):
        col = beam if role == "beam" else ramp[min(YS.index(y), len(ramp) - 1)]
        lines.append(f'<line x1="{x1:.2f}" y1="{y}" x2="{x2:.2f}" y2="{y}" stroke="{col}" stroke-width="{SW}" stroke-linecap="round"{extra}/>')
    return "\n  ".join(lines)

def word_paths(text, size, x0, baseline):
    f = TTFont(FONT)
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f["head"].unitsPerEm
    s = size / upm
    hmtx = f["hmtx"]
    kern = {}
    x = x0; paths = []
    prev = None
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        tp = TransformPen(pen, (s, 0, 0, -s, x, baseline))
        gs[g].draw(tp)
        paths.append(pen.getCommands())
        x += hmtx[g][0] * s - size * 0.028   # tight tracking
        prev = g
    return paths, x

LIGHT = {"ramp": ["#A2AC82", "#8A9870", "#5B6D49", "#3E5631", "#24470F", "#0C3C01", "#0C3C01"], "beam": "#B8E62E", "word": "#0C3C01", "three": "#0C3C01"}
DARK  = {"ramp": ["#FFFFFF", "#F1F2ED", "#DDE3CF", "#C3CCA9", "#A2AC82", "#8A9870", "#738260"], "beam": "#C9F24D", "word": "#FFFFFF", "three": "#C9F24D"}

def lockup(theme, name):
    size = 64
    gw, x_end = word_paths("Geoscan", size, 0, 0)
    tw, x_end2 = word_paths("3D", size, x_end + 2, 0)
    mark_h = 100
    # mark 100x100 scaled to 76 tall, word baseline aligned to mark centre + cap/2
    ms = 0.86
    word_x = 100 * ms + 22
    base = 50 * ms + size * 0.35
    W = word_x + x_end2 + 4
    H = 100 * ms
    g1 = "".join(f'<path d="{d}"/>' for d in gw)
    g2 = "".join(f'<path d="{d}"/>' for d in tw)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}" role="img" aria-label="Geoscan3D">
  <g transform="scale({ms})">
  {mark_svg(theme["ramp"], theme["beam"])}
  </g>
  <g transform="translate({word_x:.1f} {base:.1f})" fill="{theme["word"]}">{g1}</g>
  <g transform="translate({word_x:.1f} {base:.1f})" fill="{theme["three"]}">{g2}</g>
</svg>'''
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(svg)
    return W, H

def mark_file(theme, name, bg=None):
    rect = f'<rect width="100" height="100" rx="22" fill="{bg}"/>' if bg else ""
    vb = "0 0 100 100"
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Geoscan3D">
  {rect}
  {mark_svg(theme["ramp"], theme["beam"])}
</svg>'''
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(svg)

print(lockup(LIGHT, "geoscan3d-logo.svg"))
print(lockup(DARK, "geoscan3d-logo-white.svg"))
mark_file(LIGHT, "geoscan3d-mark.svg")
mark_file(DARK, "geoscan3d-mark-white.svg")
# favicon: mark on forest tile, beam clipped inside
mark_file(DARK, "geoscan3d-icon.svg", bg="#0C3C01")
# print the path data for the React component
import json
gw, xe = word_paths("Geoscan", 64, 0, 0); tw, xe2 = word_paths("3D", 64, xe + 2, 0)
json.dump({"geoscan": gw, "three": tw, "width": xe2, "bars": bars(), "sw": SW}, open(os.path.join(HERE, "paths.json"), "w"))
