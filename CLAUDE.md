# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A fully static, hand-authored HTML/CSS/JS site for Sankalp — landing page, an interactive Prakriti assessment, and a blog. There is **no build system, no package manager, no test framework, no linter, no bundler**. Files in the repo are exactly what gets served.

## Local preview

Open any HTML file directly in a browser, or serve from the repo root:

```bash
python3 -m http.server 8000   # then http://localhost:8000
```

Use a server (not `file://`) because pages reference relative assets like `images/...` and `../favicon.svg`.

## Repo shape

- `index.html` — landing page; contains the blog index grid (the only place blog cards are listed).
- `prakriti-assessment.html` — standalone interactive quiz; all logic lives in its inline `<script>` at the bottom.
- `blog/<slug>.html` — one self-contained file per article.
- `images/`, `favicon.svg` — shared static assets.

## Architecture: every page is self-contained

This is the single most important thing to know before editing. There are **no shared CSS or JS files**. Each HTML page inlines:

1. Google Fonts link (`Cinzel`, `Cormorant Garamond`, `Noto Sans Devanagari`).
2. A `<style>` block that re-declares the same CSS custom properties (`--bg-deep`, `--bg-dark`, `--gold`, `--text-light`, `--text-muted`, `--pink-stone`, etc.) and re-defines `nav`, `.nav-brand`, footer, and section styles.
3. The page body.
4. (Only on `index.html` and `prakriti-assessment.html`) an inline `<script>` block.

Implications:
- Visual changes to global elements (nav, brand, color tokens, footer) must be applied to **every page** to stay consistent. Grep for the token or class across `index.html`, `prakriti-assessment.html`, and `blog/*.html`.
- Don't introduce a shared stylesheet or JS bundle without the user's agreement — the per-page-self-contained convention is intentional and matches how the site is currently deployed.

## Path conventions

- Pages at the repo root use `favicon.svg`, `images/...`, `blog/<slug>.html`.
- Blog pages use `../favicon.svg`, `../images/...`, and link back via `../index.html` and `../index.html#blog`.
- Get this wrong and assets 404 silently in the browser.

## Adding a new blog post

A new post requires changes in **two** places:

1. Create `blog/<slug>.html`. Copy an existing post (e.g. `blog/ashwagandha-the-ancient-herb-proven-by-modern-science.html`) as the template — it carries the nav, hero, article structure, color tokens, and mobile breakpoint already wired with the correct `../` paths.
2. Add a new `<a class="blog-card">` inside the `.blog-grid` in `index.html`. There is a `<!-- ADD MORE BLOG CARDS HERE -->` marker right after the last card (around line 1264) — insert above it. Each card needs: `href`, a `<span class="blog-tag">`, `<h3>`, `<p>` description, and a "Read More →" span.

If you only do step 1, the post exists but is unreachable from the homepage.

## Prakriti assessment

All quiz behavior is in `prakriti-assessment.html` — the questions, dosha profiles, scoring, and rendering live in a single inline `<script>` near the bottom of the file (~line 609 onward).

- `questions[]` — each entry has `category`, optional `categoryIcon`/`categoryDesc` (only on the first question of a new category), `text`, and three `options` each tagged with a `dosha` ("vata" | "pitta" | "kapha").
- `doshaProfiles{}` — strengths, imbalance signs, food, lifestyle, and meditation copy used in the result page.
- Scoring counts dosha frequency across answers; if the top two are within 2 points it's reported as a dual constitution (e.g. "Vata-Pitta").
- The result page CTA links to the Sankalp WhatsApp community at `chat.whatsapp.com/KrM12p1vtUXF1ZQkssvBF3` (community/group invite URLs do not support prefilled `?text=`, so the prakriti label is no longer passed through).

When changing question count, don't hard-code the total — `questions.length` is used throughout.

## Brand & typography

- English headings use **Cinzel**; body copy uses **Cormorant Garamond**; Sanskrit uses **Noto Sans Devanagari**.
- The brand wordmark is rendered as `<span>संकल्प</span> SANKALP` using HTML entities for the Devanagari (`&#2360;&#2306;&#2325;&#2354;&#2381;&#2346;`) — match this pattern rather than pasting Unicode directly so the site stays consistent across files that use different editors.
- The shared accent color is `--gold: #c9a87c` over a deep purple `--bg-deep: #0f0618`. The Prakriti page additionally defines `--vata`, `--pitta`, `--kapha` for the per-dosha UI.

## Deployment

Pushes to `main` deploy the site (recent history includes a "Trigger rebuild" commit). Because it's static, there is nothing to build — what's in the repo is what ships.
