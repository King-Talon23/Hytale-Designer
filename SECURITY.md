# Security

## Design
- **No server side.** Static files only: no accounts, passwords, database, cookies, analytics or ads. There is nothing of a
  player's to steal from the site, because the site holds nothing of theirs.
- **Game files and skins stay in the player's browser** (IndexedDB). Nothing is uploaded.
- **One outside request, on demand:** the player lookup sends the typed username to `https://playerdb.co`. It is the only
  host allowed by the Content Security Policy.
- **Strict Content Security Policy** (`site/_headers`): scripts, styles and fonts from this origin only; no inline script or
  style; no frames, forms, plugins or `eval`. Plus HSTS (preload), `nosniff`, `no-referrer`, a locked Permissions-Policy and
  same-origin opener/resource policies.
- **No HTML strings.** The interface is built with `textContent` and DOM properties only (`el()` in `main.js`); nothing typed,
  imported or looked up is ever parsed as markup.
- **Everything from outside is validated.** Skins (files, lookups, backups) pass `sanitize()` in `skin.js`: known slots only,
  values matching a strict pattern. Names are stripped and capped. Zip parsing is bounds-checked with size limits, and only
  file names under the known character folders are read.
- **No third-party code at runtime.** three.js and the fonts are vendored at pinned versions with recorded hashes; no CDN,
  no package install on deploy.

## Before going public (owner's checklist)
- GitHub: two-factor on the account, branch protection on `main` (no force-push, required review for outside PRs),
  secret scanning and Dependabot alerts on, no deploy secrets in the repo.
- Host: deploy only `site/`; confirm the headers with securityheaders.com and the CSP with csp-evaluator.
- Domain: registrar lock and two-factor at the registrar, DNSSEC on, HSTS preload submitted after HTTPS is confirmed, CAA
  record limited to the host's certificate authority.
- If a server side is ever added (accounts, cloud sync, sharing), it needs its own review first: that is where the real
  attack surface would start.

## Reporting
Open a private security advisory on the GitHub repository.
