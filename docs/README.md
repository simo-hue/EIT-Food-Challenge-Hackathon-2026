# FridgeMate site

Static site served by GitHub Pages from this `docs/` folder. No build step.

- `index.html`, `site.css`: landing page. Edit the text straight in `index.html`.
- `app/`: demo app. All demo content (fridge items, recipes, flatmates, seed stats) is in `app/data.js`.
- `assets/`: illustrations (colour-matched to `#F8F8EC`), icons and the Bricolage Grotesque font.
- `sw.js`: offline cache.

After any change:

1. If you changed `app/data.js`, raise `SEED_VERSION` in it by one.
2. Change `VERSION` in `sw.js` (for example `fridgemate-v2`).
3. Commit and push. On a phone that already opened the site, reload twice.

Demo controls: long-press the FridgeMate logo in the app (or press `C` on a laptop) to fire a camera event. "Reset demo" is under the three dots.
