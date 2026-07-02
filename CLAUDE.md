# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal blog of Minh-Nhut Nguyen, served at https://nmnhut.dev/. A pure
[Hugo](https://gohugo.io/) static site using the vendored
[PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme. There is no
custom Go, JS, or build tooling beyond Hugo itself — `package.json` exists only
to pin `wrangler` for deployment.

## Commands

```sh
hugo server -D        # local preview at http://localhost:1313 (includes drafts)
npm run preview       # same as above
hugo --minify         # build static site into public/
npm run build         # same as above
npm run deploy        # build + wrangler pages deploy --branch=master (production) --commit-dirty=true
```

Deployment is Cloudflare Pages via direct upload (`wrangler`). First deploy
requires `npx wrangler login`. There is no test suite.

**Production branch gotcha:** the Pages project's production branch is `master`
but this repo is on `main`. The custom domain `nmnhut.dev` serves *production*,
so a deploy must target `--branch=master` (the `deploy` script does this). A
deploy without it goes to a Preview env (`main.nmnhut-dev.pages.dev`) and does
not update `nmnhut.dev`.

## Authoring posts

- Posts live in `content/posts/`. Front matter is **TOML** (`+++` fences), per
  `archetypes/default.md` — not the YAML `---` style.
- New posts default to `draft = true`. Set `draft = false` to publish; drafts
  are excluded from `hugo --minify` but shown by `hugo server -D`.
- Only `content/posts/` is treated as the main section (`mainSections` in
  `hugo.toml`). Pages elsewhere (e.g. `content/about.md`) won't appear in the
  post list.
- Posts use `date`, `title`, `description`, and `tags`; `tags` drive the `/tags/`
  taxonomy pages automatically.

## Key conventions

- **Raw HTML in markdown is allowed** — `markup.goldmark.renderer.unsafe = true`
  in `hugo.toml`. Inline `<div>`, charts, etc. render as-is.
- **Full-screen interactive apps go in `static/`, not `content/`.** A full
  HTML document (own `<head>`, sidebar, Tailwind/KaTeX/Chart.js) placed in
  `content/posts/` gets **wrapped inside the PaperMod template** when built —
  its markup leaks into `<meta description>` and the layout breaks. Put such
  pages under `static/` instead (copied verbatim to the site root, theme
  bypassed). Example: `static/on-tap/` is a Vietnamese data-mining study hub
  (`index.html` + per-algorithm pages sharing `study.css`/`study.js`), served at
  `/on-tap/`; a small markdown post in `content/posts/` links to it for
  discoverability. Cross-link these pages with **relative** hrefs (`./x.html`)
  because `relativeURLs = true`.
- `static/` is copied verbatim to the site root: `static/md/` holds raw markdown
  downloads, `static/slides/` holds slide decks linked from posts.
- The theme under `themes/PaperMod/` is vendored (not a submodule). Prefer config
  in `hugo.toml` and overrides in a top-level `layouts/` dir over editing the
  theme directly.
- `relativeURLs = true` — keep internal links relative so the site works under
  the `*.pages.dev` preview domain and the custom domain alike.

## Not committed

`public/`, `resources/_gen/`, `node_modules/`, and `.hugo_build.lock` are
gitignored (build output and deps).
