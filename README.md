# Story

Anandu Ramachandran's personal site — [Astro](https://astro.build), plain CSS (no framework), Markdown-backed blog.

## Structure

```
src/
  content/blog/*.md      # blog posts (content collection, schema in content.config.ts)
  data/site.ts            # name, tagline, nav
  data/work.ts             # experience, achievements, education, skills (from resume)
  data/bookshelf.ts        # reading list — plain array, edit directly
  data/links.ts             # grouped external links (essays / blogs / videos / elsewhere)
  layouts/BaseLayout.astro  # <head>, nav, footer, SEO/OG meta
  components/               # Nav, Footer
  pages/                     # one file per route
  styles/global.css          # design tokens (colors, type, spacing) + base styles
scripts/
  generate-images.mjs        # regenerates the self-drawn PNGs in public/images/
  fonts/                     # local .ttf copies used only for image generation (OFL licensed)
public/images/                # generated hero background, OG card, favicon
```

## Adding a blog post

Create `src/content/blog/my-post.md`:

```md
---
title: "Post title"
description: "One line, used in the listing and social previews."
date: 2026-03-01
tags: ["optional", "tags"]
---

Body in Markdown.
```

Omit `draft` (or set `draft: false`) to publish; `draft: true` hides it from the listing and build.

## Editing content

- **Bookshelf** — edit the `books` array in `src/data/bookshelf.ts`.
- **Links** — edit `linkSections` in `src/data/links.ts`.
- **Work** — edit `src/data/work.ts` (pulled from your resume; update as things change).

## Regenerating images

`public/images/hero-field.png`, `og-cover.png`, and `favicon.png` are generated locally from hand-written SVG (no external image service) via [resvg](https://github.com/RazrFalcon/resvg), using the same brand fonts as the site. To tweak and regenerate:

```sh
node scripts/generate-images.mjs
```

## Development

```sh
npm install
npm run dev       # localhost:4321
npm run build     # -> dist/
npm run preview   # serve the production build locally
```

## Deployment — GitHub Pages + custom domain

This repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys to GitHub Pages on every push to `main`.

One-time setup, after pushing this repo to GitHub as `AnanduRamachandran/Story`:

1. **Repo → Settings → Pages → Build and deployment → Source**: select **GitHub Actions**.
2. **Custom domain**: `public/CNAME` is set to `corazonan.com` — make sure the same value is set under **Settings → Pages → Custom domain**.
3. **DNS**: point your domain at GitHub Pages —
   - Apex domain (`example.com`): four `A` records to `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`.
   - `www` subdomain: a `CNAME` record to `ananduramachandran.github.io`.
4. `astro.config.mjs`'s `site` field should match your final domain (used for canonical URLs, sitemaps, and OG tags).

If you'd rather not use a custom domain yet, delete `public/CNAME` and the site will be reachable at `https://ananduramachandran.github.io/Story/` — in that case also add `base: '/Story'` to `astro.config.mjs`.
