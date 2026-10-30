# KokoJob

An orders console for people who check order status all day: search, filter, sort, and edit 60 orders. It is built to stay legible and fast at any width, keyboard-first, and honest about failure.

## Live

No deployment is available yet.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview
```

Runtime dependencies: `react`, `react-dom`. No component library, icon package, CSS framework or state library.

## Three design decisions

### 1. Container queries, not media queries, for the list

There is one list of rows. Each row is a CSS Grid with named areas (`id`, `customer`, `status`, `items`, `total`, `created`). A container query on the list redefines `grid-template`. Below 720px of the **list's own width**, each row is a card. At 720px and up, the same rows line up as a table.

- **No JS in layout.** No resize listener, no `useMediaQuery`, no re-render on resize.
- **It responds to its container, not the viewport.** Drop the list into a 300px sidebar on a 1440px screen and it becomes cards. A viewport query can't do that.
- **One accessible DOM.** No table on desktop plus a card copy on mobile. Every cell keeps its grid area in both layouts and is only moved, never hidden or duplicated.

The list is a semantic `<ul>`, deliberately not `role="table"`. A row that reflows into a card is not a table row at phone width, and telling assistive tech otherwise would mislead it. The visual column header is `aria-hidden`; each row's text is complete on its own ("18 items" keeps its unit in the accessible name even where the table layout hides it visually).

The detail panel is a viewport overlay, so it uses an ordinary media query: bottom sheet below 900px, side drawer above.

### 2. Optimistic updates with rollback, written by hand

Edits apply instantly, then save in the background. The fake API fails about 15% of saves on purpose (8% of loads), so anyone clicking around for two minutes will see a rollback. The **Demo: force failures** toggle makes every request fail, for live walkthroughs.

`useOrders` is about 50 lines. Two details:

- **Rollback is per field, per order.** Before an edit, the hook remembers only the fields that edit touches. If the save fails, it restores just those fields, so a failure never undoes a different edit made while this one was in flight.
- **The server echo is not trusted blindly.** The fake API merges onto its static record, which knows nothing about earlier edits. So on success the hook applies only the patch plus the server's `updatedAt`, rather than replacing the whole order.

When a save fails, the toast says what failed and what happened: _"Could not save changes. The order was restored."_

### 3. No component library

The status system is the one bold design move, because a user's eye hunts for status on every row. Each status pairs a hue with a distinct CSS-drawn shape: pending ○, processing ◐, shipped ◆, delivered ●, cancelled – (struck through). It still reads in greyscale and for colour-blind users. Everything else stays neutral: six colour tokens defined with `light-dark()` that follow the OS theme, one `system-ui` type family on a 1.2 scale (no network cost, native feel), and four hand-drawn 16px SVG icons.

A component library would have cost more bytes than the whole app, and still wouldn't give container-query rows or this status system.

### Smaller calls

- **No debounce on search.** Sixty local records filter in well under a frame; a debounce would only add lag.
- **URL is the source of truth for view state.** `?q=north&status=pending,shipped&sort=total-desc&order=ORD-2482` is shareable. Filter changes use `replaceState`, so typing doesn't flood history. Opening an order uses `pushState`, so browser Back closes the panel.
- **Focus.** The panel traps Tab, closes on Esc, makes the rest of the page `inert`, and returns focus to the row that opened it. Inert and focus live in one effect, so the background is never still inert when focus tries to return. (The spec asked for inert only at sheet width. Detecting width would need JS, and the panel is modal at every width anyway, so it is inert at every width.)
- **No service worker.** The manifest makes the app installable and standalone. A service worker would add a stale-cache failure mode with no benefit for a static demo that needs the network only once.

### Measured

| Check                                                                   | Result                                |
| ----------------------------------------------------------------------- | ------------------------------------- |
| Lighthouse (mobile): Performance / Accessibility / Best Practices / SEO | 100 / 100 / 100 / 100                 |
| Cumulative layout shift, load → filter → open panel → edit              | 0                                     |
| JS, gzipped                                                             | 54.7 KB (React DOM is ~45 KB of that) |
| CSS, gzipped                                                            | 3.9 KB                                |
| Horizontal scroll at 320 / 375 / 768 / 1024 / 1440                      | none                                  |
| Tap targets at 320 and 375                                              | all ≥ 44px                            |
| Keyboard-only: tab order, Enter opens, trap, Esc, focus return, Back    | pass                                  |

## Next, with more time

- Exit animation for the drawer (it currently closes instantly), using `@starting-style` and `transition-behavior: allow-discrete`.
- Undo on the toast, not just a report of the rollback.
- Virtualise the list past a few hundred rows, keeping the same grid.
- Playwright versions of the keyboard and rollback checks, run in CI.
- Swap the fake API for a real endpoint behind the same two functions.

## Time spent per phase

| Phase           | Scope                                                     | Time     |
| --------------- | --------------------------------------------------------- | -------- |
| 1. Layout spine | Scaffold, tokens, data, `useOrders`, container-query rows | TODO     |
| 2. Interaction  | Toolbar, filter/sort, URL sync, four list states          | TODO     |
| 3. Panel        | Drawer/sheet, inline edit, rollback, toast, focus trap    | TODO     |
| 4. Finish       | PWA, Lighthouse, README, recording                        | TODO     |
| **Total**       |                                                           | **TODO** |
