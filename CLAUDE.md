# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A hand-rolled static site published to GitHub Pages (yuanhe.wiki / Lawhy.github.io). No JS framework, no Node toolchain — the entire build is a single Python script that renders Markdown posts into HTML files committed to the repo.

## Build & preview

```bash
# Set up Python deps (one time per machine)
uv venv
uv pip install markdown pygments

# Wire up the pre-commit hook (one time per clone)
git config core.hooksPath .github/hooks

# Rebuild after editing any post or the template
.venv/bin/python scripts/build_posts.py

# Preview at http://localhost:8000
python3 -m http.server 8000
```

`pygments` is **required**, not optional: `codehilite` is configured with `css_class: "highlight"` and the site's `assets/css/syntax.css` targets Pygments-emitted class names (`.kn`, `.nf`, …). Without pygments installed, the extension silently falls back to `<pre><code class="language-…">` and code blocks render with no highlighting.

The pre-commit hook (`.github/hooks/pre-commit`) runs `build_posts.py` and stages any regenerated artifacts (`index.html`, `404.html`, every post's `index.html`, `sitemap.xml`, `feed.xml`, `robots.txt`) before each commit, so committed HTML can't drift from its markdown source.

## How the build works

`scripts/build_posts.py` walks `posts/*/*/index.md` and for each one:

1. Parses YAML-ish front matter (flat `key: value`, lists as `[a, b]` — not real YAML).
2. Normalizes Notion's `` $`…`$ `` inline math to plain `$…$`.
3. **Stashes** `$$…$$` and `$…$` with placeholders **before** running Markdown, then restores them verbatim afterwards. This is load-bearing: without it the Markdown parser mangles underscores and asterisks inside LaTeX. Don't move math handling out of `render_markdown`.
4. Runs `markdown` with extensions: `extra`, `sane_lists`, `smarty`, `fenced_code`, `codehilite`, `toc` (depth 2–3).
5. Writes `index.html` next to the `.md` using `scripts/post-template.html` (variable substitution via `str.replace`, not Jinja).
6. After all posts render, rewrites the homepage `index.html` between `<!-- BLOG_TECHNICAL_START -->…END -->` and `<!-- BLOG_LITERATURE_START -->…END -->` markers with the sorted post list.
7. Emits `sitemap.xml` (every post + homepage) and `feed.xml` (RSS 2.0, newest first) at the site root.
8. Stamps content-hash cache-busters (`?v=<md5[:8]>`) onto `assets/css/{site,syntax}.css` and `assets/js/goatcounter.js` in every rendered HTML. Hash only changes when the asset content changes, so day-to-day rebuilds don't churn `?v=` values.

Posts are sorted by `date` desc. The two categories (`technical`, `literature`) are hardcoded in `CATEGORIES` and format dates differently — literature shows just the year + genre tag, technical shows `Mon YYYY`.

**Rendered `index.html` files are committed.** Always rebuild after editing markdown; don't hand-edit the HTML (it'll be overwritten on the next build). The pre-commit hook normally handles this for you.

## Post structure

```
posts/<category>/<slug>/
  index.md           ← source
  index.html         ← built artifact (committed)
  images/...         ← assets referenced from the post
```

Front matter fields:

- `title` — string
- `date` — ISO (e.g. `2026-01-14`). Literature can also use just a year (`2026`).
- `tags` — list, e.g. `[AI Agents, RL]`
- `slug` — must match the directory name
- `summary` — optional curated string. When empty, the build derives a 2-line preview from the opening paragraphs (Lilian-Weng style with trailing `…`).
- `authors` — raw HTML allowed.
- `cover` — relative path under the post (e.g. `images/cover.webp`). Renders as a wider-than-body 16:9 hero. Also becomes the `og:image` for that post. **Use WebP for photographic covers** — the literature post covers were one-time-converted from PNG/JPEG to WebP at q=82 with ~92% size reduction.
- `cover_position` — CSS `object-position` override (e.g. `center 75%` to push a bottom-of-frame subject into view, as in `lao-mao`).
- `comments` — `true` to render a giscus discussion block below the post. Default off.

Posts can use raw HTML inline. Custom primitives styled in `assets/css/site.css`:

- **Margin notes** — Tufte-style sidenotes. Pattern: `<sup class="margin-marker"><a href="#note-X">N</a></sup><span class="margin-note" id="note-X"><span class="margin-note__label">Note N</span>…</span>`. Floats into the right gutter on desktop; on `max-width: 1100px` the `.margin-note` becomes `display: block` and renders as an inline callout. Click is intercepted in `scrollspy.js` so it doesn't scroll-jump.
- **`.post-aside`** — same right-gutter idea but post-level, not anchored to a paragraph.
- **`.references`** — bottom-of-post citation list, anchor-linkable from inline `[N]`.
- **`.method-list`** — definition-list for comparison tables (used in adam-optimizer).

## Math

KaTeX is loaded via CDN in the template and renders client-side on `DOMContentLoaded` via `auto-render`. Display equations get horizontal scroll (not page-wide overflow) via `.post-body .katex-display { overflow-x: auto }` in `site.css`.

## TOC + scrollspy

The TOC rail renders only H2 headings (`render_toc` filters `toc_tokens` — H3s still get IDs from the markdown extension for direct anchor links, but aren't listed). `assets/js/scrollspy.js` drives the active-section dot marker and includes a small handler that swallows margin-marker clicks.

## SEO, feeds, and link previews

The build emits every SEO surface from a single source of truth in `build_posts.py`:

- **`<meta name="description">`** and the **Open Graph / Twitter Card** tags in each page's `<head>` — driven by the post's frontmatter summary (or auto-summary) truncated to 200 chars.
- **`og:image`** — the post's `cover` if set, else `assets/images/og-default.png` (a 1200×630 banner with "Blog" in Newsreader serif over a hairline divider above "yuanhe.wiki"). Generated once; not regenerated per build.
- **`<link rel="canonical">`** and **`<link rel="alternate" type="application/rss+xml" href="/feed.xml">`** in every page.
- **`sitemap.xml`** — homepage + every post with `<lastmod>` from the frontmatter date.
- **`robots.txt`** — Allow `/` + Sitemap line.
- **`feed.xml`** — RSS 2.0, every post newest-first, with title/link/pubDate (RFC 822) and CDATA-wrapped summaries.

Site-wide constants live near the top of `build_posts.py`:

```python
SITE_URL = "https://yuanhe.wiki"
DEFAULT_OG_IMAGE = "/assets/images/og-default.png"
```

`google7cb99e7f456cca10.html` at the site root is the Google Search Console verification file — public by design, not a secret.

## Analytics and comments

- **GoatCounter** — `<script>` in every page beacons to `yuanhe.goatcounter.com`. `assets/js/goatcounter.js` (loaded with cache-busting) fetches the `/counter/<path>.json` endpoint and populates the footer's `#pagevisits` span with "N here · M visits · by GoatCounter" (sitewide-only on the homepage). Requires "Allow adding visitor counts on your website" enabled in GoatCounter settings.
- **Cloudflare Web Analytics** — beacon-only, dashboard-only, no on-page rendering. Lives next to the GoatCounter script.
- **giscus comments** — opt-in per post via `comments: true`. Threads live in GitHub Discussions on `Lawhy/Lawhy.github.io`, keyed by post pathname. Theme is a custom file at `assets/css/giscus.css` that overrides GitHub Primer CSS variables to match the site palette (cream canvas, terracotta primary button). Loaded from the production URL, so localhost previews show the default GitHub theme.

## Helpers

`scripts/verify_against_notion.py` — diffs a Notion-pasted markdown string (inlined in the script) against the local `.md`, reporting display equations and paragraph fingerprints that exist in Notion but not locally. Used when porting posts from Notion to catch dropped content.
