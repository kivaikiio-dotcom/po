"""
Builds XML sitemaps for policy.co.ke.

- Scans every .html file in the repo
- Skips redirect stubs, noindex pages, Google verification files,
  and pages whose canonical points to a different URL
- Writes one sitemap per top-level section (kenya, uganda, courses, glossary...)
- Writes sitemap_index.xml listing them all
- Creates robots.txt if one does not already exist
"""

import os
import re
import datetime
from collections import defaultdict
from xml.sax.saxutils import escape

BASE = "https://policy.co.ke"
ROOT = "."
SKIP_DIRS = {".git", ".github", "node_modules", "scripts"}
SKIP_ROOT_FILES = {"index.html", "404.html"}  # root index.html only redirects
MAX_URLS = 45000

canon_re = re.compile(r'<link[^>]*rel=["\']canonical["\'][^>]*>', re.I)
href_re = re.compile(r'href=["\']([^"\']+)["\']', re.I)
noindex_re = re.compile(r'<meta[^>]*name=["\']robots["\'][^>]*noindex', re.I)
refresh_re = re.compile(r'http-equiv=["\']refresh["\']', re.I)
google_re = re.compile(r'^google[0-9a-f]+\.html$')

groups = defaultdict(list)
skipped = defaultdict(int)

for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
    for name in filenames:
        if not name.endswith(".html"):
            continue
        path = os.path.join(dirpath, name)
        rel = os.path.relpath(path, ROOT).replace(os.sep, "/")

        if rel in SKIP_ROOT_FILES or google_re.match(name):
            skipped["excluded file"] += 1
            continue

        with open(path, encoding="utf-8", errors="ignore") as fh:
            head = fh.read(20000)

        if noindex_re.search(head):
            skipped["noindex"] += 1
            continue
        if refresh_re.search(head):
            skipped["redirect page"] += 1
            continue

        url = f"{BASE}/{rel}"

        m = canon_re.search(head)
        if m:
            h = href_re.search(m.group(0))
            if h:
                canonical = h.group(1).replace("://www.", "://")
                if canonical.rstrip("/") != url.rstrip("/"):
                    skipped["canonical points elsewhere"] += 1
                    continue

        section = rel.split("/")[0] if "/" in rel else "pages"
        groups[section].append(url)

today = datetime.date.today().isoformat()
sitemap_files = []

for section, urls in sorted(groups.items()):
    urls.sort()
    parts = range(0, len(urls), MAX_URLS)
    for n, start in enumerate(parts, 1):
        suffix = f"-{n}" if len(urls) > MAX_URLS else ""
        fname = f"sitemap-{section}{suffix}.xml"
        with open(fname, "w", encoding="utf-8") as out:
            out.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            out.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
            for u in urls[start:start + MAX_URLS]:
                out.write(f"  <url><loc>{escape(u)}</loc></url>\n")
            out.write("</urlset>\n")
        sitemap_files.append(fname)

with open("sitemap_index.xml", "w", encoding="utf-8") as out:
    out.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    out.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for fname in sitemap_files:
        out.write(f"  <sitemap><loc>{BASE}/{fname}</loc><lastmod>{today}</lastmod></sitemap>\n")
    out.write("</sitemapindex>\n")

if not os.path.exists("robots.txt"):
    with open("robots.txt", "w", encoding="utf-8") as out:
        out.write("User-agent: *\nAllow: /\n\n")
        out.write(f"Sitemap: {BASE}/sitemap_index.xml\n")

total = sum(len(v) for v in groups.values())
print(f"Sitemaps written: {len(sitemap_files)}, URLs included: {total}")
for section, urls in sorted(groups.items()):
    print(f"  {section}: {len(urls)}")
for reason, count in skipped.items():
    print(f"Skipped ({reason}): {count}")
