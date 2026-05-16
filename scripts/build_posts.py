#!/usr/bin/env python3
"""Build blog post pages from posts/<category>/<slug>/index.md.

For each markdown file:
  - parse YAML-ish front matter (flat key: value, lists as [a, b])
  - convert Notion-style math `$`...`$` -> `$`...`$` (drop backticks)
  - render body via `markdown` package with TOC + tables + fenced code
  - write index.html alongside it using scripts/post-template.html

Then inline the blog list into homepage index.html between
<!-- BLOG_TECHNICAL_START --> ... END markers and the same for LITERATURE.

Run: python3 scripts/build_posts.py
"""

import re
import sys
from datetime import date as _date
from html import escape
from pathlib import Path

try:
    import markdown as md_lib
    from markdown.extensions.toc import TocExtension
except ImportError:
    sys.stderr.write(
        "Missing dependency: markdown. Install with `pip3 install markdown`.\n"
    )
    sys.exit(1)


ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "posts"
INDEX = ROOT / "index.html"
TEMPLATE = ROOT / "scripts" / "post-template.html"

CATEGORIES = ("technical", "literature")
CATEGORY_LABEL = {"technical": "TECHNICAL", "literature": "LITERATURE"}

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?(.*)", re.DOTALL)
LIST_RE = re.compile(r"^\[(.*)\]$")

# Notion uses $`<latex>`$ for inline math; KaTeX wants $<latex>$.
NOTION_INLINE_MATH_RE = re.compile(r"\$`([^`]+)`\$")


def parse_frontmatter(text: str):
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}, text
    fm_text, body = m.group(1), m.group(2)
    fm = {}
    for line in fm_text.splitlines():
        if not line.strip() or ":" not in line:
            continue
        key, _, val = line.partition(":")
        val = val.strip().strip('"').strip("'")
        lm = LIST_RE.match(val)
        if lm:
            val = [
                v.strip().strip('"').strip("'")
                for v in lm.group(1).split(",")
                if v.strip()
            ]
        fm[key.strip()] = val
    return fm, body


def normalize_math(body: str) -> str:
    """Convert Notion-style $`...`$ inline math to plain $...$ for KaTeX."""
    return NOTION_INLINE_MATH_RE.sub(r"$\1$", body)


DISPLAY_MATH_RE = re.compile(r"\$\$(.+?)\$\$", re.DOTALL)
INLINE_MATH_RE = re.compile(r"\$([^\$\n]+)\$")


def render_markdown(body: str):
    """Render markdown and return (html, toc_html).

    Math blocks (`$$...$$` and `$...$`) are stashed before markdown processing
    so the underscore-italic parser etc. don't mangle LaTeX content. They get
    restored verbatim afterwards so KaTeX can render them in the browser.
    """
    body = normalize_math(body)

    # Stash math blocks with placeholders
    math_blocks: dict[str, str] = {}

    def _stash(m: re.Match) -> str:
        key = f"@@MATH{len(math_blocks):04d}@@"
        math_blocks[key] = m.group(0)
        return key

    body = DISPLAY_MATH_RE.sub(_stash, body)
    body = INLINE_MATH_RE.sub(_stash, body)

    toc_ext = TocExtension(toc_depth="2-3", marker="")
    md = md_lib.Markdown(
        extensions=[
            "extra",
            "sane_lists",
            "smarty",
            "fenced_code",
            "codehilite",
            toc_ext,
        ],
        extension_configs={
            "codehilite": {
                "css_class": "highlight",
                "guess_lang": False,
                "linenums": False,
            },
        },
    )
    html = md.convert(body)

    # Restore math blocks verbatim
    for key, content in math_blocks.items():
        html = html.replace(key, content)

    return html, md.toc_tokens


def category_for(md_path: Path) -> str:
    return md_path.parent.parent.name


def slug_for(md_path: Path) -> str:
    return md_path.parent.name


def format_date_display(fm: dict, category: str) -> tuple[str, str]:
    raw = fm.get("date", "")
    tags = fm.get("tags", []) or []
    if not isinstance(tags, list):
        tags = [tags]

    if category == "literature":
        year = raw.split("-")[0] if raw else ""
        genre = next((t for t in tags if t != "文学"), "")
        return year, (f" &middot; {genre}" if genre else "")

    if raw:
        try:
            d = _date.fromisoformat(raw)
            return d.strftime("%b %Y"), ""
        except ValueError:
            return raw, ""
    return "", ""


def render_toc(toc_tokens) -> str:
    """Render the post's H2s as flat left-toc links. H3 headings still get IDs
    from the markdown TOC extension (for direct anchor links) but aren't shown
    in the rail — we keep the navigation single-level for visual restraint."""
    if not toc_tokens:
        return ""
    return "\n".join(
        f'          <li><a href="#{t["id"]}" data-toc>{t["name"]}</a></li>'
        for t in toc_tokens
    )


def render_post(md_path: Path, template: str):
    text = md_path.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(text)
    category = category_for(md_path)
    slug = slug_for(md_path)
    title = fm.get("title", slug)
    date_raw = fm.get("date", "")
    summary = fm.get("summary", "")
    date_display, meta_extra = format_date_display(fm, category)

    html_body, toc_tokens = render_markdown(body)
    toc_html = render_toc(toc_tokens)
    authors = fm.get("authors", "")
    authors_html = (
        f'<span class="post-meta__authors">{authors}</span> &middot; '
        if authors
        else ""
    )

    page = template
    page = page.replace("{{title}}", escape(str(title)))
    page = page.replace("{{authors_line}}", authors_html)
    page = page.replace("{{date_display}}", date_display)
    page = page.replace("{{meta_extra}}", meta_extra)
    page = page.replace("{{root}}", "../../../")
    page = page.replace("{{toc}}", toc_html)
    page = page.replace("{{content}}", html_body)

    (md_path.parent / "index.html").write_text(page, encoding="utf-8")

    return {
        "category": category,
        "slug": slug,
        "title": title,
        "date": date_raw,
        "date_display": date_display,
        "meta_extra": meta_extra,
        "summary": summary,
    }


def render_list_item(post: dict) -> str:
    href = f"posts/{post['category']}/{post['slug']}/"
    title_html = escape(str(post["title"]))
    date_html = post["date_display"] + post["meta_extra"]
    excerpt = post["summary"]
    excerpt_html = (
        f'\n              <p class="post-list__excerpt">{escape(str(excerpt))}</p>'
        if excerpt
        else ""
    )
    return (
        '            <li>\n'
        f'              <a href="{href}">\n'
        f'                <span class="post-list__title">{title_html}</span>\n'
        f'                <span class="post-list__date">{date_html}</span>\n'
        f'              </a>{excerpt_html}\n'
        '            </li>'
    )


def replace_marker(html: str, name: str, replacement: str) -> str:
    pattern = re.compile(
        rf"(<!-- {name}_START -->).*?(<!-- {name}_END -->)",
        re.DOTALL,
    )
    new_block = (
        f"<!-- {name}_START -->\n"
        f"{replacement}\n"
        f"            <!-- {name}_END -->"
    )
    return pattern.sub(lambda _m: new_block, html)


def main():
    if not TEMPLATE.exists():
        sys.exit(f"Missing template: {TEMPLATE}")
    template = TEMPLATE.read_text(encoding="utf-8")

    posts_by_cat = {c: [] for c in CATEGORIES}
    for md_path in sorted(POSTS_DIR.glob("*/*/index.md")):
        info = render_post(md_path, template)
        if info["category"] in posts_by_cat:
            posts_by_cat[info["category"]].append(info)

    for posts in posts_by_cat.values():
        posts.sort(key=lambda p: p.get("date", ""), reverse=True)

    html = INDEX.read_text(encoding="utf-8")
    for cat in CATEGORIES:
        items = "\n".join(render_list_item(p) for p in posts_by_cat[cat])
        html = replace_marker(html, f"BLOG_{CATEGORY_LABEL[cat]}", items)
    INDEX.write_text(html, encoding="utf-8")

    counts = " · ".join(f"{len(v)} {k}" for k, v in posts_by_cat.items())
    print(f"Built {sum(len(v) for v in posts_by_cat.values())} posts ({counts}).")


if __name__ == "__main__":
    main()
