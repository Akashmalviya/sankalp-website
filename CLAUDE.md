# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Sankalp site running on **Astro**, migrated from a fully static, hand-authored HTML/CSS/JS site (landing page, an interactive Prakriti assessment, and a blog). The site was originally moved to Astro as a thin passthrough wrapper (every page still its own self-contained HTML file), then a second pass introduced real shared infrastructure: a common `Header`/`Footer` and layouts, and re-themed the blog + `for-doctors`/`privacy`/`app` pages onto the new brand introduced with the homepage redesign. `prakriti-assessment.html` is the one remaining page still on the old brand/self-contained pattern (see "One page still on the old brand" below).

## Local preview

```bash
npm install
npm run dev       # astro dev server with live reload
# or
npm run build && npm run preview   # build to dist/ then serve it
```

## Repo shape

- `src/pages/index.html` — the landing page. This is the **new** (redesign) homepage: white/green/gold, Fraunces + Inter fonts, WebGL "breathing orb" hero (vendored `three.min.js`). It's still a fully self-contained `.html` file (its own inline nav/footer, not the shared components below) since its hero/orb wiring is bespoke — but every other page now visually matches it.
- `src/pages/prakriti-assessment.html` — standalone interactive quiz; all logic lives in its inline `<script>` at the bottom. Still on the **old** purple/gold brand (Cinzel/Cormorant Garamond) — the one page not yet re-themed.
- `src/pages/blog/<slug>.astro` — one `.astro` file per article, using `BlogPostLayout` (see below). Re-themed to the new brand.
- `src/pages/blog/index.astro` — the blog hub/listing page (builds to `blog/index.html`). Uses `Header`/`Footer` directly (no `BlogPostLayout`, since it's a card grid, not an article).
- `src/pages/for-doctors.astro`, `src/pages/privacy.astro`, `src/pages/app.astro` — re-themed to the new brand via `PageLayout`.
- `src/layouts/BlogPostLayout.astro` — wraps `<head>`/meta/JSON-LD, `Header`, the hero (tag/title/sub props), an `.article` slot, and `Footer`. Also exposes a named `head` slot for extra JSON-LD (`FAQPage`, `HowTo`) beyond the `BlogPosting` schema it generates itself.
- `src/layouts/PageLayout.astro` — simpler layout for non-article pages (`<head>`/meta, `Header`, a default slot, `Footer`). Used by `privacy.astro`, `for-doctors.astro`, `app.astro`.
- `src/components/Header.astro` / `Footer.astro` — the shared nav (lotus logo + links + mobile toggle) and footer, used by every page except `index.html` and `prakriti-assessment.html`. Take a `base` prop (`""` at root, `"../"` one level down, e.g. `blog/*`) since links are root-relative, and `Header` takes an optional `active` prop (`'app' | 'blog' | 'for-doctors'`) to highlight the current nav item.
- `src/styles/brand.css` — global tokens (colors, fonts) + nav/button/footer CSS, imported by both layouts.
- `src/styles/blog-post.css` — shared article-component CSS (hero, quote, highlight/dosage/warning boxes, dual-lens, benefit cards, mechanism list, paper list, FAQ accordion, related-reading box, CTA), imported by `BlogPostLayout`.
- `public/` — static passthrough assets, copied as-is to the build root: `images/`, `favicon.svg`, `manifest.json`, `robots.txt`, `sitemap.xml`, `three.min.js`.

## ⚠️ One page still on the old brand

`src/pages/prakriti-assessment.html` is the one page not yet re-themed — it's still purple/gold, Cinzel/Cormorant Garamond, fully self-contained. Everything else (homepage, blog, for-doctors, privacy, app) is on the new white/green/gold brand now, though `index.html` and `prakriti-assessment.html` don't use the shared `Header`/`Footer` components (see above).

## Architecture: shared Header/Footer/layouts, but pages beyond that are still fairly self-contained

Blog posts, `for-doctors.astro`, `privacy.astro`, and `app.astro` all get their nav/footer/base tokens from the shared components and `brand.css` — edit those in one place and every page picks it up. Beyond that, each page still owns its own page-specific `<style>` block for its unique sections (hero, phone mockups, comparison tables, etc.), scoped per-file the normal Astro way. `index.html` and `prakriti-assessment.html` remain fully self-contained (their own inline nav/footer/tokens), since they weren't part of this re-theme.

Implications:
- A nav/footer/brand-color change belongs in `Header.astro`/`Footer.astro`/`brand.css` and propagates everywhere **except** `index.html` and `prakriti-assessment.html`, which still need manual updates to stay visually in sync.
- Page-specific visual components (e.g. a blog post's custom `dosha-*`/`guna-*` classes, or `app.astro`'s phone-mockup CSS) live in that page's own scoped `<style>` block — grep the specific class/page, not the whole repo.

## Path conventions

Unchanged from before the migration — Astro preserves the exact directory structure of `src/pages/` in its build output, and `public/` files land at the build root, so all existing relative paths still resolve correctly:

- Pages directly under `src/pages/` use `favicon.svg`, `images/...`, `blog/<slug>.html` (root-relative).
- Pages under `src/pages/blog/` use `../favicon.svg`, `../images/...`, and link back via `../index.html`.
- Get this wrong and assets 404 silently in the browser.

## Adding a new blog post

A new post requires changes in **three** places (and one more if you want it indexed):

1. Create `src/pages/blog/<slug>.astro`. Copy an existing post (e.g. `src/pages/blog/ashwagandha-the-ancient-herb-proven-by-modern-science.astro`) as the template. It imports `BlogPostLayout` and passes `title`, `description`, `path` (e.g. `/blog/<slug>.html`), `headline` (plain text, used in JSON-LD), `publishDate` (ISO date), `tag` (the small eyebrow above the hero title), `heroTitle`/`heroSub` (HTML allowed). The article body is just the children of `<BlogPostLayout>...</BlogPostLayout>` — reuse the shared classes from `blog-post.css` (`.article`, `.quote`, `.highlight-box`, `.dual-lens`, `.benefits-grid`/`.benefit-card`, `.mechanism-list`, `.paper-list`, `.dosage-box`, `.warning-box`, `.faq`, `.related`, `.blog-cta`) wherever they fit; add a page-scoped `<style>` block only for genuinely new components. If the post needs `FAQPage`/`HowTo` JSON-LD beyond the standard `BlogPosting` schema the layout already emits, pass it via `<Fragment slot="head"><script type="application/ld+json" set:html={JSON.stringify(...)} /></Fragment>` (see `yoga-and-pranayama-for-anxiety.astro` for the pattern).
2. Add a new `<a class="bcard">` inside the `.blog-grid` in `src/pages/index.html` (newest first). Each card needs: `href`, a `<span class="tag">`, `<h3>`, `<p>` description, and a "Read More →" span.
3. Add a matching `<a class="hcard">` to the `.hubgrid` in `src/pages/blog/index.astro` (the crawlable blog hub) — newest first.
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

## Brand & typography (current brand — everything except prakriti-assessment.html)

- Headings use **Fraunces** (serif), body copy uses **Inter**, Sanskrit uses **Noto Sans Devanagari** (`class="dev"` in `brand.css`).
- Tokens (defined in `src/styles/brand.css`, all pages that import it share these): `--green: #157a5b` / `--green-dark` / `--green-soft` (primary accent), `--gold: #b0894f` / `--gold-soft` (secondary accent), `--ink` (headings), `--text` (body), `--muted` (secondary text), `--line` (borders), `--bg`/`--bg-soft`/`--bg-card` (white-based surfaces), `--accent`/`--accent-soft` (orange, "stress mode" / warning contexts), `--air`/`--fire`/`--earth` (Vata/Pitta/Kapha color-coding — reused across dosha comparisons wherever they appear), `--radius`, `--shadow`/`--shadow-lg`.
- The logo is the animated lotus mark (inline SVG, defined in `Header.astro`/`Footer.astro` and duplicated inline in `index.html`'s own nav) + "Sankalp" wordmark in Fraunces — not the old Devanagari-span wordmark below.

### Old brand (prakriti-assessment.html only)

- English headings use **Cinzel**; body copy uses **Cormorant Garamond**; Sanskrit uses **Noto Sans Devanagari**.
- The brand wordmark is rendered as `<span>संकल्प</span> SANKALP` using HTML entities for the Devanagari (`&#2360;&#2306;&#2325;&#2354;&#2381;&#2346;`) — match this pattern rather than pasting Unicode directly so the file stays consistent with itself.
- The accent color is `--gold: #c9a87c` over a deep purple `--bg-deep: #0f0618`, with `--vata`, `--pitta`, `--kapha` for the per-dosha UI.

## Deployment

Deployed via **Netlify**. Build command is `npm run build` (Astro outputs to `dist/`), publish directory `dist` — configured directly in the Netlify dashboard (there is no `netlify.toml` in the repo by choice, so check the dashboard if a build starts failing or serving stale settings).
