# Agent Guide (Codex / any non-Claude agent)

Read `CLAUDE.md` in this repo — it is the full guide (commands, Hugo
conventions, production-branch gotcha). The single most important rule is
repeated here because violating it has already broken production:

## Shared static/ tenants — do not touch other apps' files

`static/` hosts several independently developed apps besides the blog:
`static/magic-dust/`, `static/cao-hoc/`, `static/on-tap/`,
`static/speaking/`. Each app's own pipeline copies its build snapshot here,
and every `npm run deploy` ships ALL of them (hugo builds the whole
`static/` into `public/`).

- **NEVER `git stash`, `git checkout --`, `git restore`, or `git clean`
  paths under a `static/<app>/` you are not deploying.** Dirty files there
  are another app's freshly-copied build waiting for its own commit.
  Incident 2026-07-13: a magic-dust deploy stashed the uncommitted
  `static/cao-hoc/` build around its commit; hugo + wrangler ran inside the
  stash window and production reverted cao-hoc to a week-old bundle.
- A dirty tree is fine — the deploy script passes `--commit-dirty=true`.
  Commit only your own tenant's paths (`git add static/<your-app>` plus
  `static/_headers` if you changed it), never `git add -A`.
