# TODO

Items left open after converting the site to the "hadi code.html" design.

## Images (not added yet)
- [ ] **Logo cube `mark.webp`** → put it in `public/assets/mark.webp`, then:
  - replace the placeholder `<Mark />` SVG in `src/components/icons.tsx` (used in the header, footer, hero chat demo, chatbot and contact panel) with `<img src="/assets/mark.webp" alt="" width={359} height={401} />`
  - switch the favicon in `index.html` to `/assets/mark.webp`
  - add `<meta property="og:image" content="https://marcodegrowth.com/assets/mark.webp">` to `index.html`
- [ ] **Founder photos** `founder-1.webp`, `founder-2.webp`, `founder-3.webp` → put them in `public/assets/`, then set `photo: '/assets/founder-N.webp'` on each founder in `src/data/site.ts` (initials show until then).

## Links
- [ ] **Company LinkedIn URL**: the footer icon is hidden until the real URL is known. Re-enable it in `src/components/Footer.tsx` (see the comment there).

## Notes
- `src/hooks/use-mobile.ts` is unused and has a lint error that was already there before the redesign. It can be deleted.
- `vite.config.ts` now uses `base: '/'` (was `'./'`) so deep links like `/services/chatbots` load correctly. If the site is ever hosted in a sub-folder, change `base` to that folder.
- Backup of the previous version: `../marcode-growth-backup-before-redesign/`
