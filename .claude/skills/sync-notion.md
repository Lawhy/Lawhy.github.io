---
name: sync-notion
description: Sync all blog posts from the user's Notion "Blog Posts" database into posts/<category>/<slug>/index.md, downloading images locally and rewriting paths. Use when the user adds, edits, or wants to refresh posts from Notion. Invokes the build script after.
---

# Sync Notion blog posts to local markdown

This pulls every entry in the user's Notion **Blog Posts** database, converts each page's body to clean markdown, downloads embedded images to the post's local `images/` folder, and writes `posts/<category>/<slug>/index.md`. After all posts are synced, the build script renders HTML.

## Prerequisites

- **Notion MCP** must be connected (tools `mcp__notion__notion-search` and `mcp__notion__notion-fetch` should be available; if not, ask the user to authorize via `/mcp` or run `claude mcp add --transport http notion https://mcp.notion.com/mcp`).
- **Database**: Blog Posts — page id `2f955dc580e680498f47de3674a34c76`, data source `collection://2f955dc5-80e6-80dc-a7d2-000bca072c74`.

## Steps

### 1. Enumerate posts

Call `mcp__notion__notion-search` with:

- `query`: `"blog post"`
- `query_type`: `"internal"`
- `data_source_url`: `"collection://2f955dc5-80e6-80dc-a7d2-000bca072c74"`
- `page_size`: `25`
- `filters`: `{}`

Collect every result's `id` and `title`.

### 2. For each post, fetch + convert + download + write

Do these in parallel where possible (multiple `notion-fetch` calls in one message). For each post:

#### 2a. Fetch the page

Call `mcp__notion__notion-fetch` with the post's `id`. Parse the `<properties>` JSON to extract:

- `Title` (string)
- `Summary` (string, may be empty)
- `Tags` (JSON array of strings)
- `date:Published Date:start` (ISO date)

#### 2b. Determine category and slug

- **Category**: `"literature"` if any tag is `"文学"`, `"古诗词"`, `"古散文"`, or `"散文"`; otherwise `"technical"`.
- **Slug**:
  - **English titles** → kebab-case (lowercase, hyphenate words, strip punctuation). Example: `"Making Softmax Cheaper: A Theoretical Lens"` → `softmax-cheaper`.
  - **Chinese titles** → Pinyin **syllables** joined with hyphens. Example: `春折` → `chun-zhe`; `登爱城山座` → `deng-ai-cheng-shan-zuo`.
  - If `posts/<cat>/<slug>/index.md` already exists with this title, reuse the existing slug to avoid renames.

#### 2c. Convert Notion enhanced markdown to clean markdown

Strip / rewrite these Notion-specific constructs in the body:

- `<synced_block url="...">CONTENT</synced_block>` → keep `CONTENT`, drop wrapper.
- `<columns>` / `<column>` / `<empty-block/>` → drop wrapper, keep inner content.
- `<callout color="...">CONTENT</callout>` → convert to blockquote (`> CONTENT`, multiline).
- `<mention-user url="...">...</mention-user>` → drop.
- `<details>` / `<summary>` / `<table>` / `<tr>` / `<td>` → keep as-is (markdown supports inline HTML).
- Notion inline math `$`...`$` (with backticks) → keep as-is; the build script normalizes to `$...$` for KaTeX.
- `$$...$$` display math → keep as-is.
- Reference-style `\[1\]` → `[1]`.

#### 2d. Extract image URLs and download

Find every markdown image reference of the form `![alt](https://prod-files-secure.s3.us-west-2.amazonaws.com/...)`. The URLs are **signed and expire in ~1 hour**, so download immediately.

For each image, in one batched `Bash` call:

1. Derive a stable filename:
   - Try the URL's basename before `?` (e.g. `hsoftmax.png`, `image.png`).
   - If multiple images would collide (e.g. several `image.png`), suffix with `-1`, `-2`, …
   - Or pick a descriptive name from the alt text if present.
2. `mkdir -p posts/<cat>/<slug>/images`
3. `curl -sSL "<full-signed-url>" -o posts/<cat>/<slug>/images/<filename>`
4. Rewrite the markdown reference to `![alt](images/<filename>)`.

#### 2e. Write the markdown file

Compose front matter:

```yaml
---
title: <Title>
date: <Published Date YYYY-MM-DD>
tags: [<tag1>, <tag2>, ...]
slug: <slug>
summary: "<Summary, escaped if it contains quotes>"
---
```

Followed by the cleaned body. Write to `posts/<category>/<slug>/index.md`. **Read** the file first if it exists (the Edit tool requires it).

### 3. Build

After all posts are synced, run:

```
python3 scripts/build_posts.py
```

### 4. Report

Print a one-line summary: posts synced, images downloaded, build status. List any failed image downloads so the user can re-fetch.

## Notes

- The S3 URL expiry means re-running the skill always re-fetches and re-signs. If an image is already downloaded locally and the markdown still references `images/<file>`, **leave it alone** — don't re-download unchanged images. Only download URLs that are still external (`https://prod-files-secure.s3...`).
- For posts where the only content is an image (like `燋食`), the body becomes just `![](images/...)`.
- Slug for Chinese titles: convert character by character via standard pinyin. Pinyin tones are dropped. See [[user-oss-status]] for the user's preferred conventions if there's ambiguity.
- Don't add `notion_id` to front matter — markdown is the source of truth going forward.
