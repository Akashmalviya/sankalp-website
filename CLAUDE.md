# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Sankalp site now running on **Astro** as a thin static-build wrapper, migrated from a fully static, hand-authored HTML/CSS/JS site (landing page, an interactive Prakriti assessment, and a blog). Astro was introduced to have a real place to grow into (shared layouts, components, later re-theming) — but as of this migration, **every page is still the exact same self-contained HTML it always was**, just relocated under `src/pages/`. There is no shared layout, no components, no CSS/JS bundle yet. Files are passthrough: what's in `src/pages/*.html` is copied byte-for-byte into the build output at the same path.

## Local preview

```bash
npm install
npm run dev       # astro dev server with live reload
# or
npm run build && npm run preview   # build to dist/ then serve it
```

## Repo shape

- `src/pages/index.html` — the landing page. This is the **new** (redesign) homepage: white/green/gold, Fraunces + Inter fonts, WebGL "breathing orb" hero (vendored `three.min.js`). It replaced the old purple/gold homepage in this migration.
- `src/pages/prakriti-assessment.html` — standalone interactive quiz; all logic lives in its inline `<script>` at the bottom.
- `src/pages/blog/<slug>.html` — one self-contained file per article. Still uses the **old** brand (purple/gold, Cinzel/Cormorant Garamond) — not yet re-themed to match the new homepage.
- `src/pages/for-doctors.html`, `src/pages/privacy.html`, `src/pages/app.html` — also unchanged, old brand.
- `public/` — static passthrough assets, copied as-is to the build root: `images/`, `favicon.svg`, `manifest.json`, `robots.txt`, `sitemap.xml`, `three.min.js`.

## ⚠️ Two brands coexist right now

The homepage (`src/pages/index.html`) uses a **different design system** than every other page: white background, green/gold accents, Fraunces/Inter/Noto Sans Devanagari, CSS tokens like `--green`, `--ink`, `--muted`. Every other page (blog, prakriti assessment, for-doctors, privacy, app) still uses the **old** purple-cosmic brand described below. This is intentional and temporary — re-theming the rest of the site to match the new homepage is a deferred, separate task. Don't assume the token names or fonts below apply to the homepage.

## Architecture: every page is still self-contained

This is still the single most important thing to know before editing. There are **no shared CSS or JS files, no Astro layout/components yet**. Each page inlines its own Google Fonts link, its own `<style>` block re-declaring its own CSS custom properties, and its own inline `<script>` where needed.

Implications:
- Visual changes to global elements (nav, brand, color tokens, footer) must be applied to **every page individually** to stay consistent. Grep for the token or class across `src/pages/**/*.html`.
- Don't introduce a shared Astro layout, stylesheet, or JS bundle without the user's agreement — the per-page-self-contained convention is intentional for now, carried over unchanged from the pre-Astro site.

## Path conventions

Unchanged from before the migration — Astro preserves the exact directory structure of `src/pages/` in its build output, and `public/` files land at the build root, so all existing relative paths still resolve correctly:

- Pages directly under `src/pages/` use `favicon.svg`, `images/...`, `blog/<slug>.html` (root-relative).
- Pages under `src/pages/blog/` use `../favicon.svg`, `../images/...`, and link back via `../index.html`.
- Get this wrong and assets 404 silently in the browser.

## Adding a new blog post

A new post requires changes in **three** places (and one more if you want it indexed):

1. Create `src/pages/blog/<slug>.html`. Copy an existing post (e.g. `src/pages/blog/ashwagandha-the-ancient-herb-proven-by-modern-science.html`) as the template — it carries the nav, hero, article structure, color tokens, and mobile breakpoint already wired with the correct `../` paths. Update the head SEO block: `<title>`, `<meta description>`, `canonical`, OG/Twitter tags, and the JSON-LD (`BlogPosting` + `BreadcrumbList`; add `FAQPage`/`HowTo` if the post has a visible FAQ or step list). The shared social image is `https://sankalphealth.in/images/og-default.png`; the nav "All Articles" back-link points to `blog/index.html` (the `/blog/` hub).
2. Add a new `<a class="bcard">` inside the `.blog-grid` in `src/pages/index.html` (newest first). Each card needs: `href`, a `<span class="tag">`, `<h3>`, `<p>` description, and a "Read More →" span.
3. Add a matching `<a class="hcard">` to the `.hubgrid` in `src/pages/blog/index.html` (the crawlable blog hub) — newest first.
4. Add the post URL to `public/sitemap.xml` (priority `0.7`) so search engines discover it.

If you skip step 2 or 3 the post still works but is unreachable from the site's navigation; skip step 4 and it won't be in the sitemap.

> OG/Twitter share images use `images/og-default.png` (1200×630). It was rendered from an HTML template via headless Chrome — there is no committed source file, so regenerate from scratch if the brand changes. `apple-touch-icon.png`, `manifest.json`, and `theme-color` are wired into every page's `<head>`.

## Prakriti assessment

All quiz behavior is in `src/pages/prakriti-assessment.html` — the questions, dosha profiles, scoring, and rendering live in a single inline `<script>` near the bottom of the file.

- `questions[]` — each entry has `category`, optional `categoryIcon`/`categoryDesc` (only on the first question of a new category), `text`, and three `options` each tagged with a `dosha` ("vata" | "pitta" | "kapha").
- `doshaProfiles{}` — strengths, imbalance signs, food, lifestyle, and meditation copy used in the result page.
- Scoring counts dosha frequency across answers; if the top two are within 2 points it's reported as a dual constitution (e.g. "Vata-Pitta").
- The result page CTA links to the Sankalp WhatsApp community at `chat.whatsapp.com/KrM12p1vtUXF1ZQkssvBF3` (community/group invite URLs do not support prefilled `?text=`, so the prakriti label is no longer passed through).

When changing question count, don't hard-code the total — `questions.length` is used throughout.

## Brand & typography (old brand — blog/prakriti/for-doctors/privacy/app)

- English headings use **Cinzel**; body copy uses **Cormorant Garamond**; Sanskrit uses **Noto Sans Devanagari**.
- The brand wordmark is rendered as `<span>संकल्प</span> SANKALP` using HTML entities for the Devanagari (`&#2360;&#2306;&#2325;&#2354;&#2381;&#2346;`) — match this pattern rather than pasting Unicode directly so the site stays consistent across files that use different editors.
- The shared accent color is `--gold: #c9a87c` over a deep purple `--bg-deep: #0f0618`. The Prakriti page additionally defines `--vata`, `--pitta`, `--kapha` for the per-dosha UI.

The new homepage (`src/pages/index.html`) instead uses **Fraunces** (headings) + **Inter** (body) + Noto Sans Devanagari, with `--green: #157a5b`, `--gold: #b0894f`, `--ink`/`--text`/`--muted` on a white `--bg`.

## Deployment

Deployed via **Netlify**. Build command is `npm run build` (Astro outputs to `dist/`), publish directory `dist` — configured directly in the Netlify dashboard (there is no `netlify.toml` in the repo by choice, so check the dashboard if a build starts failing or serving stale settings).
