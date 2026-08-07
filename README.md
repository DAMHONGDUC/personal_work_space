# App Privacy Policies

Static site hosting one privacy policy per app, at `/<app-slug>/privacy_policy/`.
All content lives in a single hardcoded JSON file — adding an app never requires
touching the UI code.

## Commands

```bash
npm run dev
```

```bash
npm run dev:open
```

`dev:open` waits for the server, then opens the browser (macOS only — `next dev`
has no built-in browser auto-open).

```bash
npm run lint && npm run typecheck && npm run build
```

`build` produces a static export in `out/`, the same thing CI deploys.

## Adding an app

Add one object to `apps` in [`src/data/apps.json`](src/data/apps.json). Copy the
`sample-app` entry — it shows every supported field. The slug becomes the URL:

```
/<slug>/privacy_policy/
```

`/<slug>/` also works and forwards to the policy.

### Shared vs per-app text

`defaults.sections` holds the eight boilerplate legal sections rendered on every
app's page. Inside them, `{{app}}`, `{{publisher}}` and `{{email}}` are replaced
automatically.

An app's own `sections` array is optional and merges with the defaults:

- reuse an id from `defaults.sections` (e.g. `security`) to **replace** that
  section for that app only
- use a new id to **append** an extra section

### Before going live

Set `site.url` in `apps.json` to the real deployed URL — the sitemap and the
canonical tags are built from it.

## Deployment

Pushing to `main` runs two workflows:

- [`ci.yml`](.github/workflows/ci.yml) — lint, typecheck, build (also on PRs)
- [`deploy.yml`](.github/workflows/deploy.yml) — static export to GitHub Pages

The base path is injected at build time from `actions/configure-pages`, so a
project site (`user.github.io/<repo>`) and a custom domain both work without any
code change.

One-time setup: **Settings → Pages → Source → GitHub Actions**.
