---
name: build-posts
description: Build blog post HTML pages from markdown sources and inline the post list into the homepage. Use when the user adds/edits a post in posts/<category>/<slug>/index.md and wants the site refreshed.
---

# Build blog posts

Render markdown in `posts/<category>/<slug>/index.md` to sibling `index.html` files, and inline the homepage blog lists.

## Steps

1. Ensure the `markdown` Python package is installed. If `python3 -c "import markdown"` fails, install it:
   ```
   pip3 install markdown
   ```

2. Run the build script:
   ```
   python3 scripts/build_posts.py
   ```

3. Report the output to the user — number of posts built per category.

4. If the local dev server is running (port 8000), the user can refresh the homepage to see updated entries.

## What it does

- Walks `posts/*/*/index.md`
- Parses YAML-ish front matter (`title`, `date`, `tags`, `slug`, `summary`)
- Renders body with `markdown.extra` + `sane_lists` + `smarty`
- Writes `posts/<category>/<slug>/index.html` from `scripts/post-template.html`
- Replaces content between `<!-- BLOG_TECHNICAL_START --> ... END -->` and `<!-- BLOG_LITERATURE_START --> ... END -->` markers in `index.html`
