# FlowRead Website

Marketing and legal website for **FlowRead**, the iOS teleprompter app. A static, dependency-free site — no build step, no framework, no Node required.

## Structure

```
.
├── index.html        # Landing page (hero, features, pricing, sparkles)
├── privacy.html      # Privacy Policy
├── terms.html        # Terms of Use / EULA (incl. Apple subscription disclosures)
├── contact.html      # Contact & Support page (with form)
├── styles.css         # Shared design system (used by all pages)
├── script.js          # Shared behavior (nav, reveals, sparkles, pricing toggle, form)
├── _headers           # Security headers (Netlify / Cloudflare Pages format)
└── assets/
    └── images/         # App screenshots used on the landing page
```

## Local preview

No build step needed — just serve the folder over HTTP (opening `index.html`
directly via `file://` mostly works, but the Content-Security-Policy and the
contact form behave more accurately over a real server):

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then open `http://localhost:8080`.

## Deployment

This is a static site — drag-and-drop or connect-and-deploy works on
**Netlify**, **Cloudflare Pages**, **Vercel**, or **GitHub Pages**.

### Netlify / Cloudflare Pages (recommended)
- The `_headers` file is picked up automatically and applies the security
  headers (CSP, HSTS, X-Frame-Options, etc.) and long-cache rules for
  `styles.css` / `script.js`.
- The contact form on `contact.html` is written for **Netlify Forms**
  (`data-netlify="true"`, hidden `form-name` field, `bot-field` honeypot).
  On Netlify, form submissions appear under **Site → Forms** automatically —
  no extra backend needed.

### GitHub Pages
- GitHub Pages serves `index.html` at the root automatically — no config
  needed beyond enabling Pages for the repo (Settings → Pages → Deploy from
  branch).
- GitHub Pages does **not** support the `_headers` file or custom response
  headers. If you need the security headers in `_headers`, put **Cloudflare**
  in front of the GitHub Pages site (free plan), or host on Netlify/Cloudflare
  Pages instead.
- The contact form will not submit anywhere on GitHub Pages (no Netlify
  Forms backend). It will fall back to the "couldn't send automatically,
  email us directly" message. Swap the form's `action`/JS for a service like
  Formspree if you need a working form on GitHub Pages.

### Vercel
- Use the included `_headers` file's contents to populate the `headers`
  section of a `vercel.json` (Vercel uses its own config format, not
  Netlify's `_headers` syntax).

## Before you launch — checklist

- [ ] Replace placeholder emails `support@flowread.app` and
      `privacy@flowread.app` in `privacy.html`, `terms.html`, `contact.html`,
      and the fallback message in `script.js`.
- [ ] Fill in **Section 11 (Governing Law)** of `terms.html` with your actual
      jurisdiction and dispute-resolution process.
- [ ] Update the "Last updated" dates in `privacy.html` and `terms.html`
      when you make changes.
- [ ] Confirm pricing in `index.html` (`#plans` section, `data-monthly` /
      `data-yearly` attributes on each `.price-card`) matches what's
      configured in App Store Connect.
- [ ] Add this site's Privacy Policy and Support URLs to your App Store
      Connect listing (`privacy.html` and `contact.html`).
- [ ] If deploying somewhere other than Netlify/Cloudflare Pages, decide how
      the contact form will actually deliver messages (Formspree, a small
      serverless function, etc.).

## Credits

- Ambient sparkle background effect adapted from
  [Aceternity UI](https://21st.dev/community/aceternity) (converted from the
  React/`@tsparticles/react` component to vanilla JS using the
  [tsParticles](https://particles.js.org/) CDN bundle).
- Fonts: [Inter](https://fonts.google.com/specimen/Inter) and
  [Manrope](https://fonts.google.com/specimen/Manrope) via Google Fonts
  (SIL Open Font License).

## License

© 2026 FlowRead. All rights reserved. The contents of this repository
(design, copy, and code) are proprietary to the FlowRead project unless
you choose to add an open-source license.
