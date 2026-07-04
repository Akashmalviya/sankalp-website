import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sankalphealth.in',
  // Every page/link in this site is an explicit `.html` URL (canonical tags,
  // sitemap, internal <a href> all say e.g. /for-doctors.html). Astro's default
  // "directory" build format would instead serve these as extension-less
  // /for-doctors/ routes, breaking every existing link.
  // 'file' would fix that but collapses nested index routes (src/pages/blog/index.astro,
  // route "/blog") to blog.html instead of blog/index.html — breaking every
  // link that points at the crawlable "/blog/" hub. 'preserve' keeps index
  // routes as <dir>/index.html while still flattening every other route to
  // <name>.html, which is what every existing link on this site expects.
  build: {
    format: 'preserve',
  },
});
