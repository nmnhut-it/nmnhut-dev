# nmnhut.dev

Personal blog by Minh-Nhut Nguyen. Built with [Hugo](https://gohugo.io/) and the
[PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (vendored under `themes/`).

## Develop

```sh
hugo server -D        # local preview at http://localhost:1313
```

## Build

```sh
hugo --minify         # outputs static site to public/
```

## Deploy (Cloudflare Pages — direct upload)

One-time auth:

```sh
npx wrangler login
```

Then build + ship:

```sh
npm run deploy        # hugo --minify && wrangler pages deploy public --project-name=nmnhut-dev --branch=master --commit-dirty=true
```

The live site is `https://nmnhut.dev/` (custom domain). The Cloudflare Pages
project's **production branch is `master`**, while this repo is on `main` — so
`deploy` passes `--branch=master` explicitly to publish to production. Without
it, a deploy lands in a Preview environment (`main.nmnhut-dev.pages.dev`) and
the custom domain is *not* updated.

## Structure

- `content/posts/` — blog posts
- `content/about.md` — about page
- `static/` — assets referenced by posts (`md/`, `slides/`)
- `themes/PaperMod/` — vendored theme
- `hugo.toml` — site config
