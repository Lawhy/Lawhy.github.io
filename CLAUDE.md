# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A hand-rolled static site published to GitHub Pages (yuanhe.wiki / Lawhy.github.io). No JS framework, no Node toolchain — the entire build is a single Python script that renders Markdown posts into HTML files committed to the repo.

## Build & preview

```bash
# Set up Python deps (one time per machine)
uv venv
uv pip install markdown pygments

# Rebuild after editing any post or the template
.venv/bin/python scripts/build_posts.py

# Preview at http://localhost:8000
python3 -m http.server 8000
```

`pygments` is **required**, not optional: `codehilite` is configured with `css_class: "highlight"` and the site's `assets/css/syntax.css` targets Pygments-emitted class names (`.kn`, `.nf`, …). Without pygments installed, the extension silently falls back to `<pre><code class="language-…">` and code blocks render with no highlighting.

## How the build works

`scripts/build_posts.py` walks `posts/*/*/index.md` and for each one:

1. Parses YAML-ish front matter (flat `key: value`, lists as `[a, b]` — not real YAML).
2. Normalizes Notion's `` $`…`$ `` inline math to plain `$…$`.
3. **Stashes** `$$…$$` and `$…$` with placeholders **before** running Markdown, then restores them verbatim afterwards. This is load-bearing: without it the Markdown parser mangles underscores and asterisks inside LaTeX. Don't move math handling out of `render_markdown`.
4. Runs `markdown` with extensions: `extra`, `sane_lists`, `smarty`, `fenced_code`, `codehilite`, `toc` (depth 2–3).
5. Writes `index.html` next to the `.md` using `scripts/post-template.html` (variable substitution via `str.replace`, not Jinja).
6. After all posts render, rewrites the homepage `index.html` between `<!-- BLOG_TECHNICAL_START -->…END -->` and `<!-- BLOG_LITERATURE_START -->…END -->` markers with the sorted post list.

Posts are sorted by `date` desc. The two categories (`technical`, `literature`) are hardcoded in `CATEGORIES` and format dates differently — literature shows just the year + genre tag, technical shows `Mon YYYY`.

**Rendered `index.html` files are committed.** Always rebuild after editing markdown; don't hand-edit the HTML (it'll be overwritten on the next build).

## Post structure

```
posts/<category>/<slug>/
  index.md           ← source
  index.html         ← built artifact (committed)
  images/...         ← assets referenced from the post
```

Front matter fields: `title`, `date` (ISO), `tags` (list), `slug`, `summary`, `authors` (raw HTML allowed).

Posts can use raw HTML inline. Custom primitives styled in `assets/css/site.css`:

- **Margin notes** — Tufte-style sidenotes. Pattern: `<sup class="margin-marker"><a href="#note-X">N</a></sup><span class="margin-note" id="note-X"><span class="margin-note__label">Note N</span>…</span>`. Floats into the right gutter on desktop; on `max-width: 1100px` the `.margin-note` becomes `display: block` and renders as an inline callout. Click is intercepted in `scrollspy.js` so it doesn't scroll-jump.
- **`.post-aside`** — same right-gutter idea but post-level, not anchored to a paragraph.
- **`.references`** — bottom-of-post citation list, anchor-linkable from inline `[N]`.
- **`.method-list`** — definition-list for comparison tables (used in adam-optimizer).

## Math

KaTeX is loaded via CDN in the template and renders client-side on `DOMContentLoaded` via `auto-render`. Display equations get horizontal scroll (not page-wide overflow) via `.post-body .katex-display { overflow-x: auto }` in `site.css`.

## TOC + scrollspy

The TOC rail renders only H2 headings (`render_toc` filters `toc_tokens` — H3s still get IDs from the markdown extension for direct anchor links, but aren't listed). `assets/js/scrollspy.js` drives the active-section dot marker and includes a small handler that swallows margin-marker clicks.

## Helpers

`scripts/verify_against_notion.py` — diffs a Notion-pasted markdown string (inlined in the script) against the local `.md`, reporting display equations and paragraph fingerprints that exist in Notion but not locally. Used when porting posts from Notion to catch dropped content.
