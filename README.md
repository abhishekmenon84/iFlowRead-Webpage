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
