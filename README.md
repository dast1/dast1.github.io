# Dastan Aitzhanov

Personal site for Dastan Aitzhanov: AI systems, governance, and ownership. Essays, shorter notes, and a selected record of public work. The public site is [dast1.github.io](https://dast1.github.io).

The site is a static [Astro](https://astro.build) app: TypeScript, MDX and Markdown, and a small amount of CSS. There is no application server. GitHub Pages serves the built files.

## Develop

Requires Node.js 22.

```bash
npm install
npm run dev
```

The dev server prints a local URL. Pages refresh when content or components change.

## Build

```bash
npm run build
npm run preview
```

`npm run build` writes the site to `dist/`. `npm run preview` serves that folder.

`npm run verify` typechecks, builds, and checks the output: required pages, metadata, the feed, the sitemap, internal links, and that draft writing stayed unpublished.

```bash
npm run check   # astro check
npm run lint    # checks dist/ — run a build first
npm run verify  # check, build, and lint
```

## Deploy

The live site is a GitHub Pages **user site**. It is served from this repository at the domain root (`https://dast1.github.io`), not from a project subpath.

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) does two things:

- On every pull request, and on every push to `master`, it installs dependencies and runs `npm run verify`.
- On a push to `master`, it uploads `dist/` and deploys that artifact to GitHub Pages.

Pages is still configured, in the repository settings, to publish the files at the root of `master` directly. That was the right setup for the old single-page template. It is the wrong setup for this site, because the HTML people should see is the build output, not the source tree.

Cutover, once you are ready for the live site to change:

1. Merge this branch into `master`.
2. Open **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. If the deploy workflow has not already succeeded, run the **Site** workflow on `master` with **Run workflow**.

Do the settings change in the same sitting as the merge. Until Source is GitHub Actions, Pages will try to publish the repository root, which no longer contains a finished `index.html`.

The workflow does not deploy from pull requests, so opening a PR leaves the current site alone.

## Custom domain

The public origin lives in [`src/site.ts`](src/site.ts) as `siteUrl`, and Astro reads it from [`astro.config.ts`](astro.config.ts). Canonical URLs, the sitemap, RSS, and Open Graph tags all use that value.

To move the site to your own domain later:

1. Change `siteUrl`.
2. Add `public/CNAME` containing only the hostname, for example `example.com`.
3. In the repository Pages settings, set the custom domain and turn on HTTPS.
4. Point the domain's DNS at GitHub Pages.

No base path change is required. This repository is a user site, so pages stay at `/writing/…`, `/ideas/…`, and `/projects/…`.

## Add writing

Create `src/content/writing/your-slug.mdx` (Markdown `.md` is fine too):

```yaml
---
title: Title
description: One or two sentences used on indexes, in RSS, and in social cards.
date: "2026-09-22"
tags:
  - Context
draft: false
---
```

`date` is a calendar day, quoted. `draft: true` keeps the piece out of the site, the sitemap, and the feed. Tags become pages under `/writing/tags/…`.

Footnotes use standard Markdown (`[^1]`). Fenced code blocks are highlighted. Reading time is calculated from the body.

The URL is `/writing/your-slug/`.

## Add an idea

Create `src/content/ideas/your-slug.md`:

```yaml
---
title: Title
description: The claim in a sentence or two.
date: "2026-09-22"
---
```

The URL is `/ideas/your-slug/`.

## Add a project

Create `src/content/projects/your-slug.md`:

```yaml
---
title: Title
description: What it is, in a sentence or two.
date: "2018-08-22"
status: published
order: 2
links:
  - label: Source
    href: https://github.com/dast1/example
---
```

`status` is one of `active`, `published`, `reference`, or `paused`. `order` sets the position on the projects page (lower comes first). The URL is `/projects/your-slug/`.

Keep the list curated. A repository existing on GitHub is not by itself a reason to add it.

## Marks

`public/favicon.svg` is the mark. `npm run marks` regenerates `favicon-32.png`, `apple-touch-icon.png`, and `og.png` from that file and a small SVG card. `sharp` is a dev dependency used only by that script.

## Editorial

Write in the first person. Prefer leaving a fact out to guessing it. Do not publish a personal phone number. Drafts stay drafts until `draft` is removed or set to false.
