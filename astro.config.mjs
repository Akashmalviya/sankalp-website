import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sankalphealth.in',
  // Every page/link in this site is an explicit `.html` URL (canonical tags,
  // sitemap, internal <a href> all say e.g. /for-doctors.html). Astro's default
  // "directory" build format would instead serve these as extension-less
  // /for-doctors/ routes, breaking every existing link — so keep the legacy
  // file-per-page output.
  build: {
    format: 'file',
  },
});
