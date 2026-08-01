"""Batch PIL post-processor for Gemini-generated art (see lessons/README.md
"Art pipeline" and .claude/skills/gemini-art/SKILL.md). Gemini CANNOT output
transparency — every PNG it gives you has a baked-in background — so cutout
is always a post-process step here, never assumed to already exist.

Cutout method: EDGE-FLOOD-FILL keying, not a global color/brightness
threshold. A naive "anything dark = transparent" threshold (the first,
wrong, approach used on 2026-07-04 before this script existed) also erases
dark pixels INSIDE the subject (lighthouse windows, shadow creases) if
they happen to be as dark as the background. Flood-filling in from the 4
edges only marks background pixels that are actually CONNECTED to the
border and close in color to it — dark regions fully enclosed by the
subject survive even if their raw brightness matches the backdrop.

Usage:
    python lessons/tools/art-post.py <indir> <outdir> [--no-cutout]
        [--size 768] [--format png|webp|avif] [--quality 82]
        [--feather 2] [--tolerance 28] [--composite-bg PATH]

For every *.png/*.jpg in <indir>:
  1. (unless --no-cutout) edge-flood-fill the background to transparent,
     feather the cutout boundary --feather px (soft edge, not scissor-cut).
  2. Resize so the longer side is <= --size (px), keep aspect.
  3. Save in the requested runtime format. Map sprites should use WebP with
     alpha; AVIF is reserved for large opaque backgrounds because lossy AVIF
     can slightly change a cutout's alpha edge.
  4. Composite the result over --composite-bg (default:
     lessons/assets/world/world-map-bg.webp) and save a preview JPEG to
     <outdir>/previews/<name>.jpg — so a human can eyeball the WHOLE batch
     over the actual site background at a glance instead of opening each
     file. ALWAYS inspect previews/ before wiring a batch in; if a cutout
     reads badly after two prompt/tolerance attempts, fall back to keeping
     the dark square and letting the map's oval CSS mask hide the corners
     (say so explicitly rather than shipping a halo/scissor-cut sprite).
"""
import argparse
import os
import sys
from collections import deque

from PIL import Image


def flood_fill_background_mask(rgb, tolerance):
    """Returns a mask (H,W), 255 = background — a BFS flood fill from all 4
    border edges, connectivity-gated, but the color test is distance to a
    FIXED seed color (averaged from the four corners), not distance to the
    immediately-preceding neighbor pixel.

    Neighbor-to-neighbor chaining was tried first and rejected: a dark
    subject touching a dark background can drift the whole way in via a
    sequence of small per-step deltas that individually pass `tolerance`
    but accumulate past it — e.g. a lighthouse island's near-black rock
    underside (measured 2026-07-04: RGB ~(27,36,67), corner background
    ~(17,19,30), true distance ~42) got flood-filled away at tolerance 28
    because the anti-aliased blend between them stepped in increments of
    just a few units at a time. Fixed-seed distance rejects that pixel
    outright (42 > 28) while still only removing pixels actually
    CONNECTED to the border, so fully enclosed interior dark regions
    (a lighthouse window, a shadow crease) survive regardless of how dark
    they are, as long as they aren't within `tolerance` of the seed color."""
    w, h = rgb.size
    px = rgb.load()
    corners = [px[1, 1], px[w - 2, 1], px[1, h - 2], px[w - 2, h - 2]]
    seed = tuple(sum(c[i] for c in corners) / 4 for i in range(3))

    def close_to_seed(r, g, b, tol2):
        dr, dg, db = r - seed[0], g - seed[1], b - seed[2]
        return dr * dr + dg * dg + db * db <= tol2

    visited = bytearray(w * h)
    q = deque()

    def enqueue(x, y):
        i = y * w + x
        if not visited[i]:
            r, g, b = px[x, y]
            if close_to_seed(r, g, b, tol2):
                visited[i] = 1
                q.append((x, y))

    tol2 = tolerance * tolerance
    for x in range(w):
        enqueue(x, 0)
        enqueue(x, h - 1)
    for y in range(h):
        enqueue(0, y)
        enqueue(w - 1, y)

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                ni = ny * w + nx
                if not visited[ni]:
                    r, g, b = px[nx, ny]
                    if close_to_seed(r, g, b, tol2):
                        visited[ni] = 1
                        q.append((nx, ny))
    mask = Image.frombytes('L', (w, h), bytes(255 if v else 0 for v in visited))
    return mask


def cutout(img, tolerance, feather):
    rgb = img.convert('RGB')
    bg_mask = flood_fill_background_mask(rgb, tolerance)
    # feather: blur the mask so the alpha boundary is soft, not a hard cut
    if feather > 0:
        from PIL import ImageFilter
        bg_mask = bg_mask.filter(ImageFilter.GaussianBlur(feather))
    alpha = Image.eval(bg_mask, lambda v: 255 - v)
    out = rgb.convert('RGBA')
    out.putalpha(alpha)
    return out


def scrub_stray_components(img, min_area_frac=0.01):
    """Drop disconnected alpha blobs smaller than min_area_frac of the image
    area — a BFS over opaque pixels (alpha>0), grouped into connected
    components (4-connectivity); any component under the size floor gets its
    alpha zeroed. Catches stray sparkle/glyph artifacts that survive the
    edge flood-fill because they're not touching the border (so cutout()
    never saw them) but also aren't part of the main subject — found on the
    approved lighthouse pair, a stray sparkle glyph in a corner."""
    w, h = img.size
    alpha = img.getchannel('A')
    apx = alpha.load()
    visited = bytearray(w * h)
    components = []
    for sy in range(h):
        for sx in range(w):
            si = sy * w + sx
            if visited[si] or apx[sx, sy] == 0:
                continue
            q = deque([(sx, sy)])
            visited[si] = 1
            pixels = []
            while q:
                x, y = q.popleft()
                pixels.append((x, y))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        ni = ny * w + nx
                        if not visited[ni] and apx[nx, ny] != 0:
                            visited[ni] = 1
                            q.append((nx, ny))
            components.append(pixels)
    if not components:
        return img
    floor = w * h * min_area_frac
    largest = max(len(c) for c in components)
    out = img.copy()
    opx = out.load()
    for pixels in components:
        if len(pixels) < floor and len(pixels) < largest:
            for x, y in pixels:
                r, g, b, _ = opx[x, y]
                opx[x, y] = (r, g, b, 0)
    return out


def crop_to_content(img, pad=12):
    alpha = img.getchannel('A')
    bbox = alpha.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    x0 = max(x0 - pad, 0); y0 = max(y0 - pad, 0)
    x1 = min(x1 + pad, img.width); y1 = min(y1 + pad, img.height)
    return img.crop((x0, y0, x1, y1))


def make_composite_preview(sprite, bg_path, out_path):
    bg = Image.open(bg_path).convert('RGBA')
    # letterbox the sprite onto a crop of the bg roughly matching its aspect,
    # centered, at ~40% of the bg's height, so it reads like an in-map island
    target_h = int(bg.height * 0.4)
    scale = target_h / sprite.height
    target_w = int(sprite.width * scale)
    sprite_r = sprite.resize((target_w, target_h), Image.LANCZOS)
    x = (bg.width - target_w) // 2
    y = (bg.height - target_h) // 2
    canvas = bg.copy()
    canvas.alpha_composite(sprite_r, (x, y))
    canvas.convert('RGB').save(out_path, quality=88, optimize=True)


def process_one(path, outdir, args):
    name = os.path.splitext(os.path.basename(path))[0]
    img = Image.open(path)
    if not args.no_cutout:
        img = cutout(img, args.tolerance, args.feather)
        img = scrub_stray_components(img)
        img = crop_to_content(img)
    else:
        img = img.convert('RGBA')
    img.thumbnail((args.size, args.size), Image.LANCZOS)
    ext = args.format
    out_path = os.path.join(outdir, f'{name}.{ext}')
    if args.format == 'png':
        img.save(out_path, optimize=True)
    elif args.format == 'webp':
        img.save(out_path, format='WEBP', quality=args.quality,
                 method=args.method, alpha_quality=100)
    else:
        img.save(out_path, format='AVIF', quality=args.quality,
                 speed=args.speed)
    size_kb = os.path.getsize(out_path) / 1024

    previews_dir = os.path.join(outdir, 'previews')
    os.makedirs(previews_dir, exist_ok=True)
    preview_path = os.path.join(previews_dir, f'{name}.jpg')
    if os.path.exists(args.composite_bg):
        make_composite_preview(img, args.composite_bg, preview_path)
    else:
        preview_path = None

    return {'name': name, 'out': out_path, 'kb': size_kb, 'w': img.width, 'h': img.height, 'preview': preview_path}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('indir')
    ap.add_argument('outdir')
    ap.add_argument('--no-cutout', action='store_true', help='skip background removal, just resize/optimize')
    ap.add_argument('--size', type=int, default=768, help='max px on the longer side')
    ap.add_argument('--format', choices=('png', 'webp', 'avif'), default='png',
                    help='runtime output format; use webp for transparent map sprites')
    ap.add_argument('--quality', type=int, default=82,
                    help='lossy WebP/AVIF quality, 0-100 (ignored for PNG)')
    ap.add_argument('--method', type=int, default=6,
                    help='WebP encoder effort, 0-6')
    ap.add_argument('--speed', type=int, default=6,
                    help='AVIF encoder speed, 0-10; higher is faster')
    ap.add_argument('--budget-kb', type=float,
                    help='warn above this size; defaults to 250 for PNG, 120 otherwise')
    ap.add_argument('--feather', type=float, default=2.5, help='gaussian-blur radius (px) on the cutout alpha edge')
    ap.add_argument('--tolerance', type=float, default=28, help='color-distance threshold for the edge flood fill')
    ap.add_argument('--composite-bg', default='lessons/assets/world/world-map-bg.webp',
                     help='background to composite each sprite over for the preview')
    args = ap.parse_args()

    os.makedirs(args.outdir, exist_ok=True)
    files = [f for f in sorted(os.listdir(args.indir)) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if not files:
        print(f'no images found in {args.indir}', file=sys.stderr)
        return 1

    results = []
    for f in files:
        r = process_one(os.path.join(args.indir, f), args.outdir, args)
        results.append(r)
        print(f"{r['name']}: {r['w']}x{r['h']}  {r['kb']:.1f}KB  -> {r['out']}"
              + (f"  (preview: {r['preview']})" if r['preview'] else '  (no preview — composite-bg missing)'))

    budget_kb = args.budget_kb if args.budget_kb is not None else (250 if args.format == 'png' else 120)
    over_budget = [r for r in results if r['kb'] > budget_kb]
    if over_budget:
        print(f"\nWARNING: {len(over_budget)} file(s) over the {budget_kb:g}KB budget — lower quality or dimensions:")
        for r in over_budget:
            print(f"  {r['name']}: {r['kb']:.1f}KB")
    print(f"\n{len(results)} file(s) processed. Review {args.outdir}/previews/ before wiring the batch in.")
    return 0


if __name__ == '__main__':
    sys.exit(main())
