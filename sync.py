"""
sync.py — Copy shared sections from games.html → practice/math.html

SETUP:
  1. Mark any div you want synced in BOTH files with data-sync="some-name"
     Example: <div data-sync="navbar"> ... </div>
  2. This script is run automatically by GitHub Actions on every push.

The script finds every data-sync block in games.html and overwrites
the matching block in practice/math.html. Everything else stays untouched.
"""

import re
from pathlib import Path

PAGE1 = "games.html"
PAGE2 = "practice/math.html"


def extract_blocks(html: str) -> dict:
    """Find all tags with data-sync="name" and return {name: full_outer_html}."""
    blocks = {}
    open_tag_re = re.compile(r'<(\w+)[^>]*data-sync=["\']([^"\']+)["\'][^>]*>', re.IGNORECASE)

    for m in open_tag_re.finditer(html):
        tag = m.group(1)
        name = m.group(2)
        start = m.start()

        depth = 1
        pos = m.end()
        open_re = re.compile(rf'<{tag}[\s>]', re.IGNORECASE)
        close_re = re.compile(rf'</{tag}>', re.IGNORECASE)

        while depth > 0 and pos < len(html):
            open_m = open_re.search(html, pos)
            close_m = close_re.search(html, pos)

            if close_m is None:
                break
            if open_m and open_m.start() < close_m.start():
                depth += 1
                pos = open_m.end()
            else:
                depth -= 1
                pos = close_m.end()

        blocks[name] = html[start:pos]

    return blocks


def replace_blocks(html: str, blocks: dict) -> tuple[str, list, list]:
    """Replace matching data-sync blocks in html. Returns (new_html, updated, missing)."""
    updated = []
    missing = []

    for name, new_block in blocks.items():
        open_tag_re = re.compile(r'<(\w+)[^>]*data-sync=["\']' + re.escape(name) + r'["\'][^>]*>', re.IGNORECASE)
        m = open_tag_re.search(html)

        if not m:
            missing.append(name)
            continue

        tag = m.group(1)
        start = m.start()
        depth = 1
        pos = m.end()
        open_re = re.compile(rf'<{tag}[\s>]', re.IGNORECASE)
        close_re = re.compile(rf'</{tag}>', re.IGNORECASE)

        while depth > 0 and pos < len(html):
            open_m = open_re.search(html, pos)
            close_m = close_re.search(html, pos)

            if close_m is None:
                break
            if open_m and open_m.start() < close_m.start():
                depth += 1
                pos = open_m.end()
            else:
                depth -= 1
                pos = close_m.end()

        html = html[:start] + new_block + html[pos:]
        updated.append(name)

    return html, updated, missing


def main():
    p1 = Path(PAGE1)
    p2 = Path(PAGE2)

    if not p1.exists():
        print(f"❌  {PAGE1} not found.")
        return
    if not p2.exists():
        print(f"❌  {PAGE2} not found.")
        return

    page1_html = p1.read_text(encoding="utf-8")
    page2_html = p2.read_text(encoding="utf-8")

    blocks = extract_blocks(page1_html)

    if not blocks:
        print("⚠️  No data-sync blocks found in games.html.")
        print('   Add data-sync="name" to any div you want synced.')
        return

    print(f"🔍  Found {len(blocks)} sync block(s) in {PAGE1}: {', '.join(blocks.keys())}")

    new_page2, updated, missing = replace_blocks(page2_html, blocks)

    if updated:
        p2.write_text(new_page2, encoding="utf-8")
        print(f"✅  Updated in {PAGE2}: {', '.join(updated)}")
    if missing:
        print(f"⚠️  Not found in {PAGE2} (add data-sync=\"{'\" or \"'.join(missing)}\" there too): {', '.join(missing)}")


if __name__ == "__main__":
    main()
