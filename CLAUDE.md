# Harmony Moments site — rules for Claude

**Edit only source files. Never read or edit the built HTML.**

| Change | Edit this | NOT this |
|---|---|---|
| Header, footer, nav, analytics, schema | `src/layout.html` | any `index.html` |
| A page's content | `src/pages/<name>.html` | `occasions/*/`, `journal/*/`, `terms/`, root `index.html` |
| Shared contact/about blocks | `src/partials/` | |
| Styles / JS | `styles.css` / `script.js` (then bump `CSS_VERSION`/`JS_VERSION` in `build.js`) | |

Root `index.html`, `occasions/`, `journal/`, `terms/`, `sitemap.xml` are **generated** by `node build.js` — reading them wastes tokens and edits get overwritten.

Occasion pages (not proposals): spec lives in `src/build-occasions.js` → run `node src/build-occasions.js` then `node build.js`.

After any change: `node build.js && node check-assets.js .`

- Images stay flat in this folder (build rewrites to `/name.jpg`).
- Don't open `styles.css` / `script.js` whole — grep for the selector/function you need.
- This folder is the live Netlify publish dir; don't rename or move it.
