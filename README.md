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
npm run deploy        # hugo --minify && wrangler pages deploy public --project-name=nmnhut-dev
```

The first deploy creates the Cloudflare Pages project and prints the live
`https://nmnhut-dev.pages.dev` URL. A custom domain can be attached later in the
Cloudflare Pages dashboard (update `baseURL` in `hugo.toml` to match).

## Structure

- `content/posts/` — blog posts
- `content/about.md` — about page
- `static/` — assets referenced by posts (`md/`, `slides/`)
- `themes/PaperMod/` — vendored theme
- `hugo.toml` — site config
