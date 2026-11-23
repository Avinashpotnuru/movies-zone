# Movies-Zone

A premium movie discovery app built with Next.js. Browse trending titles, explore genres, open detailed movie and cast profiles, search the archive, and save favorites.

## Features

- **Landing page** — editorial hero carousel with trending titles, genre explorer, and a dense movie library
- **Movie details** — overview, cast and crew, trailers, similar titles, watch providers, and favorite action
- **Cast profiles** — biography, known-for credits, filmography with filters and sorting, crew work, and a photo gallery with lightbox
- **Genre pages** — curated representative titles and a browsable genre index
- **Regional collections** — language-based collections such as Hindi, Telugu, Tamil, Kannada, and Malayalam
- **Search** — debounced, URL-synced results with sorting, grid/list views, and pagination
- **Favorites** — persisted through the app's TMDB-backed account endpoints
- **Navigation** — command-bar navbar with mega-menu, `⌘K` palette, and mobile panel
- **SEO** — per-route titles, descriptions, canonical URLs, Open Graph/Twitter cards, and JSON-LD for movies and people

## Tech stack

- Next.js (Pages Router)
- React
- Redux Toolkit + RTK Query
- Tailwind CSS
- `next/image` for TMDB imagery
- `react-icons`
- Inter (body) and Space Grotesk (headings), loaded via Google Fonts in `globals.css`

## Design system

| Token | Value |
| --- | --- |
| Navy | `#04152d` |
| Slate | `#475569` |
| Cyan | `#51E5FF` |
| Coral-red | `#F4442E` |

Sharp edges, hairline borders, oversized numerals, restrained motion, and asymmetric editorial layouts are used throughout. Accent colors are used sparingly against the navy base.

## Getting started

Use **Yarn only** for installs and scripts. The committed `package-lock.json` is stale and out of sync with `yarn.lock`.

```bash
yarn install --frozen-lockfile
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` in the project root and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_BACKEND_BASEURL=
NEXT_PUBLIC_BACKEND_BASEURL_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TWITTER_HANDLE=
```

The first two point to the TMDB-backed API used by the RTK Query endpoints in `src/store/api/restApis.js`. `NEXT_PUBLIC_SITE_URL` builds canonical and social image URLs (falls back to `http://localhost:3000` when empty), and `NEXT_PUBLIC_TWITTER_HANDLE` is optional. `.env.local` is gitignored; `.env.example` is the tracked template.

## Scripts

```bash
yarn dev     # start the development server
yarn lint    # run Next.js ESLint checks
yarn build   # create a production build
yarn start   # serve the production build
```

If a build fails with stale-page or `PageNotFoundError` messages, delete `.next` and rebuild:

```bash
# Windows CMD
rmdir /s /q .next
yarn build
```

Stop the running dev server before building, then restart it with `yarn dev`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/movies` | Full movie library |
| `/movies/[id]` | Movie details |
| `/cast/[id]` | Cast profile |
| `/category/[id]` | Genre collection |
| `/special/[page]` | Regional collections |
| `/favorite` | Saved favorites |
| `/images/[id]` | Movie image gallery |
| `/search-movies/[name]` | Search results |
| `/404` | Not-found page |

## Project structure

```text
src/
├── components/     # Page sections and reusable UI (incl. Seo)
├── config/         # Site-wide SEO constants and helpers
├── hooks/          # Shared React hooks
├── pages/          # Next.js routes
├── store/
│   ├── api/        # RTK Query API definitions
│   └── slice/      # Redux state slices
├── styles/         # Global CSS and Tailwind entry
└── utilities.js    # Shared image URL helpers
```

## Notes

- The navbar and landing hero are protected UI areas; avoid silent structural changes to them.
- Horizontal scrollbars are intentionally hidden on horizontal rows while scrolling remains enabled.
- Pagination is centralized in `src/components/Pagination` and shared by all paged routes.
- Every route renders a single page-level `src/components/Seo`; dynamic routes fetch their metadata in `getServerSideProps` and load the server-only helpers from `src/config/seo` via dynamic import so they stay out of the client bundle.
- The gallery uses top-aligned `object-cover` tiles to keep faces visible and avoid blank side gutters.
