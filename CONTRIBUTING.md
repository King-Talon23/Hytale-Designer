# Code standard

Every commit goes through `dev/hooks/pre-commit`. It refuses the commit unless:

1. **It is formatted.** Run `cd dev/tools && npm run format` (Prettier: 140 columns, single quotes).
2. **It is lint-clean, with no warnings.** Run `npm run lint` (ESLint, `--max-warnings 0`). The linter catches unused code, undefined names, unreachable code, constant conditions, and files over 3,200 lines.
3. **Every changed script parses** (`node --check`).
4. **The tests pass.** Run `npm run test` (Node's built-in runner over `dev/tests/*.test.js`).

The hook needs the dev tools installed once (`cd dev/tools && npm install`) and the hook folder switched on once (`git config core.hooksPath dev/hooks`). Nothing in `dev/` is deployed; Cloudflare publishes `site/` and `functions/`.

## How the code is laid out

- **One module per tab** (`wardrobe.js`, `locker.js`, `animations.js`, `animate.js`, `creator.js`, `workspace.js`, `players.js`, `help.js`), plus `walk.js`, `transport.js` and `stage.js`.
  - Each is a `createX(app)` factory. Modules never import `main.js` and never assign its variables.
  - Shared state is read through `app` getters and changed through setter functions.
- **`main.js` keeps only what every tab shares:** the connect screen, shared state, undo/autosave and tab switching. New features go in the tab's module, or in a new module when a file nears the size limit.

## Use the shared pieces instead of writing new ones

| Need | Use |
|---|---|
| A drop-down that picks something | `picklist.js` (previews on hover and arrows, search, groups, pictures) |
| localStorage | `prefs.js` (never call `localStorage` directly) |
| Mirroring a list of files into the skins folder | `foldersync.js` `mirrorDir` |
| Comparing animation key values | `anim.js` `sameDelta` |
| A number box that puts the old value back on junk | `numField` in `animate.js` |
| Server write endpoints (origin, sign-in, rate limit, owner) | `lib/api.js` `writer`, `ownedResource`, `unpublish` |

## Rules learned the hard way

- **Comments go on their own line.** A `//` comment in the middle of a line once swallowed code and broke the live site.
- **Edit code as normal, formatted code.** Never cram a function onto one line from a script; Prettier undoes that anyway.
- **Respect the security header (CSP):** no inline scripts and no `style="..."` attributes in HTML. Setting `el.style.x` from JS is fine.
- **A bug fix gets a test** when it can be tested without a browser (`anim.js`, `lib/api.js`, endpoints, folder sync).
