# App Privacy Policies

Static site hosting one privacy policy per app at `/<slug>/privacy_policy/`.
All content lives in JSON — adding an app never touches UI code.

```
src/data/
├── site.json              publisher, url, email + shared legal sections
└── apps/
    └── sample-app.json    one file per app
```

## Commands

```bash
npm run dev
```

```bash
npm run lint && npm run typecheck && npm run build
```

## Adding an app

Create one JSON file in `src/data/apps/`. That's it — the loader reads the
directory, so there is no index to register the app in.

**The filename is the URL:** `focus-timer.json` → `/focus-timer/privacy_policy/`

```bash
cp src/data/apps/sample-app.json src/data/apps/focus-timer.json
```

### Sample JSON

```json
{
  "name": "Focus Timer",
  "tagline": "A distraction-free Pomodoro timer for deep work.",
  "icon": "⏳",
  "accent": "#6366f1",
  "platforms": ["iOS", "Android"],
  "effectiveDate": "2026-01-10",
  "lastUpdated": "2026-06-02",
  "contactEmail": "support@example.com",
  "storeLinks": {
    "appStore": "https://apps.apple.com/app/id0000000000",
    "playStore": "https://play.google.com/store/apps/details?id=com.example.focustimer"
  },
  "overview": [
    "This Privacy Policy describes how {{app}} handles information when you use the app."
  ],
  "summary": [
    "Your timer sessions never leave your device.",
    "No account, no sign-in required."
  ],
  "collects": [
    {
      "category": "Diagnostics",
      "items": ["Crash logs", "Device model"],
      "purpose": "Identify and fix crashes.",
      "linked": false
    }
  ],
  "notCollected": ["Precise location", "Contacts", "Photos or media"],
  "permissions": [
    {
      "name": "Notifications",
      "required": false,
      "reason": "Alert you when a session ends."
    }
  ],
  "thirdParties": [
    {
      "name": "Firebase Crashlytics",
      "purpose": "Crash reporting.",
      "url": "https://firebase.google.com/support/privacy"
    }
  ]
}
```

Optional, safe to omit: `contactEmail`, `storeLinks`, `overview`, `sections`.
Everything else is required — but `collects` / `permissions` / `thirdParties`
may be `[]`.

### Things worth knowing

- `linked: true` means the data can be tied to a person (App Store
  nutrition-label wording); it renders an amber badge.
- `collects: []` renders a "does not collect any data" note instead of an
  empty table.
- An empty array hides its section, and its table-of-contents entry.
- `{{app}}`, `{{publisher}}` and `{{email}}` are substituted inside `overview`
  and `sections`.
- A `sections` entry reusing an id from `site.json` (e.g. `security`)
  **replaces** that shared section for this app only; a new id **appends** one.

## Deploy

Push to `main` — GitHub Actions builds the static export and publishes it to
Pages.

One-time setup: **Settings → Pages → Source → GitHub Actions**.

Set `site.url` in `site.json` to the real deployed URL before going live; the
sitemap and canonical tags are built from it.
