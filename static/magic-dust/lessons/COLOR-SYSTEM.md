# Magic Dust light-paper color system

This is the runtime UI palette for Saga, learning cells, modules, and utility
overlays. Teal is no longer a filled action color. It is limited to pale mint
surfaces, borders, and occasional informational text. Warm honey identifies
buttons, selected choices, and numbered badges.

| Group | Token | Hex | Use | Required text |
|---|---|---:|---|---|
| Paper | `--paper` | `#fffaf0` | Editor and main cell body | `--ink` |
| Paper | `--paper-raised` | `#fffdf5` | Raised cards and quiet buttons | `--ink` |
| Paper | `--paper-warm` | `#fff0dc` | Notes and warm callouts | dark brown/ink |
| Mint | `--mint-soft` | `#edf7ef` | Secondary panel and console family | `--ink` |
| Mint | `--mint-mid` | `#d9eee5` | Headers and control bars | `--ink` |
| Mint | `--mint-line` | `#78b2a5` | Borders and separators only | n/a |
| Ink | `--ink` | `#183f49` | Primary text | light surfaces only |
| Ink | `--ink-muted` | `#4f6f73` | Secondary text | paper surfaces only |
| Action | `--honey` | `#f4c85a` | RUN, main actions, numbered badges | `--honey-ink` |
| Action | `--honey-soft` | `#ffe6a0` | Hover and selected states | `--honey-ink` |
| Action | `--honey-ink` | `#533b00` | Text on honey | honey surfaces only |
| Action | `--honey-line` | `#d69a20` | Action border | n/a |
| Success | `--success-soft` | `#e3f3dc` | Success background | `--success-ink` |
| Success | `--success-ink` | `#2d6425` | Successful output | light surfaces only |
| Error | `--danger-soft` | `#fde7e5` | Error background | `--danger-ink` |
| Error | `--danger-ink` | `#9b3845` | Error and failure text | light surfaces only |

Rules:

- Never place white text on pale teal or mint.
- Never use saturated teal as a filled button or numbered badge.
- Console output uses a warm paper-mint surface, dark ink for normal output,
  muted ink for system messages, green ink for success, and red ink for errors.
- Dark colors inside camera feeds, simulations, or illustration assets are
  content, not UI chrome, and are allowed.
- `theme-palette.json` is the machine-readable source. Run
  `node lessons/audit-theme-colors.mjs` to print the table, contrast ratios,
  and enforce the project-wide color limit.

All component stylesheets use variables from `palette.css`; raw hex is allowed
only in that palette file. JavaScript, HTML, lesson data, and VFX may contain
the same 16 base hex values because canvas and runtime configuration cannot
resolve CSS variables. Alpha variants are allowed only when their six-digit
base is one of these colors. The audit fails on any seventeenth base color.
