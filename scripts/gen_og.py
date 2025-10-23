import os, sys, textwrap, re
from pathlib import Path

# Minimal, clean OG images: title only on a dark background.

try:
    from PIL import Image, ImageDraw, ImageFont
except Exception:
    print("ERROR: Pillow not installed. Run:  python3 -m pip install --user Pillow")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "content" / "posts"
OUTDIR = ROOT / "public" / "blog"
OUTDIR.mkdir(parents=True, exist_ok=True)

def parse_frontmatter(md_path: Path):
    slug = md_path.stem
    data = {"slug": slug, "title": slug}
    try:
        txt = md_path.read_text(encoding="utf-8")
    except Exception:
        return data
    if not txt.startswith("---"):
        return data
    parts = txt.split("\n", 1)[1].split("\n---", 1)
    if len(parts) < 2:
        return data
    fm = parts[0]
    for line in fm.splitlines():
        m = re.match(r"\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$", line)
        if not m: 
            continue
        k, v = m.group(1), m.group(2)
        v = v.strip().strip('"').strip("'")
        data[k] = v
    return data

def load_font(size):
    # Try common macOS fonts, fall back to default
    for p in [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
    ]:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()

def draw_minimal(title: str, out_path: Path):
    W, H = 1200, 630
    bg = Image.new("RGB", (W, H), (18, 18, 18))
    d  = ImageDraw.Draw(bg)

    title_font = load_font(80)
    # conservative wrapping so title stays readable
    lines = textwrap.wrap(title, width=24) or [title]
    total_h = sum(title_font.size for _ in lines) + int((len(lines)-1) * title_font.size * 0.15)
    y = (H - total_h) // 2

    for ln in lines:
        tw = d.textlength(ln, font=title_font)
        d.text(((W - tw)//2, y), ln, fill=(240,240,240), font=title_font)
        y += int(title_font.size * 1.15)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out_path)
    return out_path

def gen_for_slug(slug: str, force=False):
    md = POSTS / f"{slug}.md"
    mdx = POSTS / f"{slug}.mdx"
    src = md if md.exists() else (mdx if mdx.exists() else None)
    if not src:
        print(f"skip: no markdown for slug '{slug}'")
        return
    fm = parse_frontmatter(src)
    title = fm.get("title") or slug
    out = OUTDIR / slug / "og.png"
    if out.exists() and not force:
        print(f"exists: {out.relative_to(ROOT)} (use --force to overwrite)")
        return
    path = draw_minimal(title, out)
    print(f"wrote: {path.relative_to(ROOT)}")

def all_slugs():
    if not POSTS.exists(): 
        return []
    return sorted([p.stem for p in POSTS.iterdir() if p.suffix.lower() in (".md",".mdx")])

def main():
    import argparse
    ap = argparse.ArgumentParser(description="Generate minimal per-post OG images")
    ap.add_argument("--slug", help="generate only for this slug")
    ap.add_argument("--all", action="store_true", help="generate for all posts")
    ap.add_argument("--force", action="store_true", help="overwrite existing images")
    args = ap.parse_args()

    if args.slug:
        gen_for_slug(args.slug, force=args.force)
        return
    if args.all:
        slugs = all_slugs()
        if not slugs:
            print("no posts found in content/posts")
            return
        for s in slugs:
            gen_for_slug(s, force=args.force)
        return
    ap.print_help()

if __name__ == "__main__":
    main()
