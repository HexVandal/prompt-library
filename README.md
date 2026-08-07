# MotionPrompt Library

A searchable library of 132 curated prompts for building 3D, motion-first, and animated websites with AI coding tools. Each prompt is a complete design specification — fonts, color tokens, animation timings, component breakdowns, and responsive behavior — written to be pasted directly into Claude Code, Cursor, Lovable, Bolt.new, or Windsurf.

## What's in it

Every prompt in the library carries structured metadata beyond its text:

- **Design tokens** — extracted hex palettes and font families, copyable individually
- **Component specs** — named components with types and descriptions
- **Visual preview** — video or still reference where the source provided one
- **Tags** — category, style, and layout classification for filtering

## Features

**Prompt library** (`/`) — Grid and list views over all 132 prompts with full-text search across titles, descriptions, content, and tags. Filter by tag, bookmark favorites, and switch card density.

**Prompt detail** (`/prompts/:id`) — Full specification with tabbed views for prompt text, design tokens, and component structure. One-click copy tailored per target tool.

**Design system tokens** (`/patterns`) — Aggregate analysis across the whole library: color frequency ranking, font usage counts, and component type distribution. Useful for spotting which palettes and typefaces recur in motion-heavy design.

**Comparator** (`/diff/:id`) — Side-by-side diff of any two prompts across color swatches, typography, and full specification text.

**Export** — Whole library to JSON (structured, with all metadata) or plain text (formatted per prompt).

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Primitives | Radix UI |
| Icons | Lucide |
| Toasts | Sonner |
| Data layer | TanStack Query |
| Lint | Oxlint |

## Running locally

Requires Node 18 or newer.

```bash
npm install
npm run dev
```

The dev server prints its local URL on start.

## Commands

```bash
npm run dev       # start dev server with HMR
npm run build     # typecheck (tsc -b) then production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

## Deploying

Configured for Vercel via `vercel.json` — `dist` output, SPA rewrites so client-side routes resolve on direct navigation. Any static host works; point it at `dist/` and rewrite unmatched paths to `index.html`.

## Project structure

```
src/
  components/
    ui/                      Radix-based primitives
    layout.tsx               shell, nav, export actions
    prompt-card.tsx          grid/list card
    prompt-modal.tsx         quick-view overlay
    prompt-visual-preview.tsx
  pages/
    prompt-list.tsx          library index, search, filter
    prompt-detail.tsx        single prompt view
    pattern-analysis.tsx     cross-library token analysis
    diff-view.tsx            two-prompt comparator
    settings.tsx             preferences panel
  data/prompts.ts            the 132 prompts (lazy-loaded chunk)
  types/index.ts             LibraryPrompt and related types
  lib/utils.ts               cn, formatting helpers
```

## Bundle notes

`src/data/prompts.ts` is roughly 1 MB of prompt text and splits into its own chunk, loaded on demand rather than in the initial payload. The app shell is about 286 kB (89 kB gzipped). Route components are lazy-loaded, so `/settings` and `/diff` cost nothing until visited.

## Notes on the settings page

The settings panel is presentational — the toggles, connection fields, and maintenance actions render but are not wired to a backend. This is a static site with prompts compiled in at build time; there is no database or search service behind it. Treat that page as a design reference rather than working configuration.

## License

Prompts are free to use. The application code is provided as-is.
