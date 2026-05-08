# All Content

All Content is a Jekyll-powered publishing site for practical eCommerce, technology, and web operations articles.

## Local Development

Install dependencies:

```bash
bundle install
```

Run the site locally:

```bash
bundle exec jekyll serve
```

Build the static site:

```bash
bundle exec jekyll build
```

The generated site is written to `_site/`.

## Content

Articles live in `_posts/` and use standard Jekyll front matter.

Recommended front matter:

```yaml
---
layout: post
title: Article title
date: 2026-01-01 10:00:00
categories: [Magento, Commerce]
tags: [Adobe Commerce, eCommerce]
summary: Short reader-facing summary.
meta_description: Search-focused description around 150-160 characters.
image: /assets/images/posts/example.svg
image_alt: Short description of the article artwork.
featured: false
---
```

Use `summary` for on-site cards and `meta_description` for search/social snippets. Keep post images in `assets/images/posts/` and reference them with root-relative paths.

## Site Structure

- `_config.yml` controls site metadata, navigation, feature flags, and plugin configuration.
- `_layouts/` contains page and post templates.
- `_includes/` contains shared HTML snippets for navigation, footer, sharing, and forms.
- `_sass/` contains theme styles compiled into `assets/css/pixyll.css`.
- `search.json` builds the client-side article search index.
- `sw.js` registers the service worker for basic offline caching.

## Deployment

The GitHub Pages deployment workflow is in `.github/workflows/deploy.yml`. It builds on pushes to `master` using:

```bash
bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
```

Before deployment, run:

```bash
bundle exec jekyll build
```

## Maintenance Checklist

- Keep article dates, product names, and platform claims current.
- Keep `meta_description` values concise and unique.
- Add a unique `image` and `image_alt` for every post.
- Run a production build before publishing.
- Review external scripts and analytics settings in `_includes/head.html` and `_config.yml`.
