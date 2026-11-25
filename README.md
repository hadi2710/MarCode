# MarCode Growth

Marketing site for MarCode Growth (AI chatbots, AI agents, workflow automation and growth systems). The design follows `hadi code.html`: a minimal black and white look with logo-blue accents and large rounded black panels.

## Run

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The static site is generated in `dist/`. It uses client-side routing (`/services/:id`), so the host must serve `index.html` for unknown paths (SPA fallback).

## Stack

- React 19 + TypeScript + Vite, React Router
- Lenis smooth scrolling
- Inter Tight + Montserrat (Google Fonts)
- Plain CSS in `src/App.css` (design tokens in `src/index.css`)

## Structure

- `src/pages/Home.tsx`: hero with animated chat demo, service cards, before/after, stats, founders, FAQ, contact
- `src/pages/ServicePage.tsx`: one page per service (`/services/chatbots`, `/automation`, `/agents`, `/growth`)
- `src/components/ChatBot.tsx`: scripted chat assistant (no server or API key)
- `src/components/Cursor.tsx`, `ChatDemo.tsx`, `Stats.tsx`: interactive pieces
- `src/hooks/use-page-motion.ts`: scroll reveals, card expansion, smooth anchor links
- `src/data/site.ts`: all copy (services, founders, FAQs, stats), plus the Calendly URL and email

See `TODO.md` for open items (images, company LinkedIn link).
