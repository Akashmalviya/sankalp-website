#!/usr/bin/env python3
"""Inject Google Analytics snippet into all HTML files that don't already have it."""

import os
import glob

SNIPPET = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-F6SVRXGV2Q"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-F6SVRXGV2Q');
</script>"""

MARKER = "G-F6SVRXGV2Q"

root = os.path.dirname(os.path.abspath(__file__))
files = glob.glob(os.path.join(root, "*.html")) + glob.glob(os.path.join(root, "blog", "*.html"))

for path in sorted(files):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if MARKER in content:
        print(f"  skipped (already has GA): {os.path.relpath(path, root)}")
        continue

    if "</head>" not in content:
        print(f"  skipped (no </head> found): {os.path.relpath(path, root)}")
        continue

    updated = content.replace("</head>", SNIPPET + "\n</head>", 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(updated)
    print(f"  injected: {os.path.relpath(path, root)}")

print("Done.")
