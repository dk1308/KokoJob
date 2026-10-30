# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

KokoJob is a static React 18 + TypeScript + Vite orders console (60 seeded orders, fake async API). `README.md` holds the design rationale and measured budgets; read it before changing layout, the status system, or the edit flow.

## Commands

- `npm run dev`: dev server on http://localhost:5173
- `npm run typecheck`: `tsc -b`, the only automated check (strict, `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`)
- `npm run build`: typecheck, then build into `dist/`; `npm run preview` serves it

There is no test runner and no linter. Verify behaviour in the browser: keyboard flow, rollback (the **Demo: force failures** toggle makes every request fail), and widths 320 / 375 / 768 / 1024 / 1440.

## Architecture

State lives in two hooks, composed in `src/App.tsx`, which also does filtering and sorting synchronously in a `useMemo`:

- **`useOrders`** (`src/hooks/useOrders.ts`): owns the order array and the optimistic edit. Before an edit it snapshots only the fields the patch touches (plus `updatedAt`); on failure it restores just those, so concurrent edits to other fields survive. On success it applies the patch plus the server's `updatedAt`, never the whole echoed record, because `src/data/api.ts` merges onto the static seed and knows nothing of earlier edits. `update` rethrows; `App` turns the error into the toast.
- **`useUrlState`** (`src/hooks/useUrlState.ts`): the URL is the source of truth for `q`, `status`, `sort` and the open `order`; React state mirrors it. Filter changes use `replaceState`; opening an order uses `pushState` with `{ panel: true }`, so Back closes the panel. `closeOrder` calls `history.back()` only for that pushed entry, and `replaceState` for a deep link.

`src/data/api.ts` fails ~8% of loads and ~15% of saves on purpose. Keep that: it is how rollback gets exercised. A real backend would replace `loadOrders` / `saveOrder` behind the same signatures.

`useFocusTrap` (`src/hooks/useFocusTrap.ts`) handles Tab trapping, Esc, background `inert`, and focus return in one effect, so the background is un-inerted before focus goes back to the trigger. Keep those in that single effect.

## Conventions

- Runtime dependencies are only `react` and `react-dom`. Styling is hand-written CSS Modules (`camelCaseOnly`, so `.foo-bar` is `styles.fooBar`); icons are inline SVG in `src/components/icons.tsx`.
- Colours come from the tokens in `src/styles/tokens.css`, defined with `light-dark()`. Each status pairs a hue with a distinct CSS-drawn glyph shape, so status reads without colour.
- The order list is one semantic `<ul>`. Each row is a CSS Grid with named areas, and a **container query** on the list's own width switches card (<720px) to table (≥720px). Cells are rearranged by grid area and stay in the DOM at every width; layout stays out of JS. The detail panel is a viewport overlay, so it uses a media query instead (bottom sheet <900px, drawer ≥900px).
- Each row's accessible text is complete on its own (e.g. "18 items" keeps its unit); the visual column header is `aria-hidden`.
- Tap targets are at least `var(--tap)` (44px).
- Commits use conventional prefixes (`feat:`, `style:`, `docs:`).
