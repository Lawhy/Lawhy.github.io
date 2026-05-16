#!/usr/bin/env python3
"""Diff helper: extract display equations and paragraph fingerprints from a
Notion-flavored markdown string and a local markdown file, then report any
Notion fragments that don't appear in local.

Usage:
    python3 scripts/verify_against_notion.py
The Notion source strings are pasted inline below for each post.
"""

import re
from pathlib import Path


def normalize_math(s: str) -> str:
    """Normalize Notion's `$`...`$` inline math + display blocks to KaTeX form."""
    s = re.sub(r"\$`([^`]+)`\$", r"$\1$", s)
    return s


def extract_display_math(text: str) -> list[str]:
    """Return list of normalized display math content (between $$ ... $$)."""
    out = []
    for m in re.finditer(r"\$\$(.+?)\$\$", text, flags=re.DOTALL):
        body = m.group(1).strip()
        # Drop trailing , . that we deliberately strip in local
        while body and body[-1] in ",.":
            body = body[:-1].strip()
        out.append(_canon(body))
    return out


def extract_paragraphs(text: str, min_chars: int = 60) -> list[str]:
    """Return list of plain-text paragraphs that aren't math, code, or HTML."""
    out = []
    # Strip code blocks
    text = re.sub(r"```.+?```", "", text, flags=re.DOTALL)
    # Strip display math
    text = re.sub(r"\$\$.+?\$\$", "", text, flags=re.DOTALL)
    # Strip HTML blocks (best-effort: callouts, columns, details, mention-user)
    text = re.sub(r"<[^>]+>", "", text)
    # Strip image syntax
    text = re.sub(r"!\[[^\]]*\]\([^\)]+\)", "", text)
    for para in re.split(r"\n\s*\n", text):
        para = para.strip()
        if len(para) < min_chars:
            continue
        if para.startswith("#"):
            # skip headings
            continue
        out.append(_canon(para))
    return out


def _canon(s: str) -> str:
    """Canonicalize a string for fuzzy comparison: lowercase, collapse spaces,
    drop punctuation and special markdown chars."""
    s = s.lower()
    # Replace curly quotes with straight
    s = s.replace("“", '"').replace("”", '"')
    s = s.replace("‘", "'").replace("’", "'")
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"[*_`\\\[\]]", "", s)
    return s.strip()


def find_missing(notion_chunks: list[str], local_text: str) -> list[str]:
    """For each notion chunk, check if a substantial substring of it appears
    in local. Return chunks not found."""
    local_canon = _canon(local_text)
    missing = []
    for chunk in notion_chunks:
        if not chunk:
            continue
        # Use the middle 50 chars as a probe (avoids edge differences)
        probe_len = min(80, max(20, len(chunk) // 2))
        start = max(0, (len(chunk) - probe_len) // 2)
        probe = chunk[start : start + probe_len]
        if probe not in local_canon:
            missing.append(chunk)
    return missing


def verify(name: str, notion_source: str, local_path: Path) -> None:
    if not local_path.exists():
        print(f"!! {name}: local file not found at {local_path}")
        return
    local_text = local_path.read_text(encoding="utf-8")
    notion_source = normalize_math(notion_source)
    local_text_norm = normalize_math(local_text)

    notion_eqs = extract_display_math(notion_source)
    local_eqs = extract_display_math(local_text_norm)
    notion_paras = extract_paragraphs(notion_source)

    print(f"\n========== {name} ==========")
    print(f"Notion display equations: {len(notion_eqs)} | Local: {len(local_eqs)}")
    print(f"Notion paragraphs (>=60 chars): {len(notion_paras)}")

    missing_eqs = find_missing(notion_eqs, local_text_norm)
    if missing_eqs:
        print(f"\n*** MISSING EQUATIONS ({len(missing_eqs)}) ***")
        for eq in missing_eqs:
            print(f"  • {eq[:120]}...")
    else:
        print("  ✓ all equations present")

    missing_paras = find_missing(notion_paras, local_text_norm)
    if missing_paras:
        print(f"\n*** MISSING PARAGRAPHS ({len(missing_paras)}) ***")
        for p in missing_paras:
            print(f"  • {p[:140]}...")
    else:
        print("  ✓ all paragraphs present")


if __name__ == "__main__":
    # Notion sources are loaded from tmp files written by the caller
    posts = [
        ("adam-optimizer", "/tmp/notion-adam.md", "posts/technical/adam-optimizer/index.md"),
        ("approx-softmax", "/tmp/notion-softmax.md", "posts/technical/approx-softmax/index.md"),
        ("strands-sglang", "/tmp/notion-strands.md", "posts/technical/strands-sglang/index.md"),
    ]
    for name, notion_tmp, local in posts:
        if not Path(notion_tmp).exists():
            print(f"-- skip {name}: no {notion_tmp}")
            continue
        verify(name, Path(notion_tmp).read_text(), Path(local))
