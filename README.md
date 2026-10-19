# Clearline — pest control site template

A reusable Astro template for a contractor or service business, edited through
[Pages CMS](https://pagescms.org/). Content lives in `src/content/`; the layout
shapes that render it live in `src/components/`. The build validates that the two
stay in sync.

## Quick start

```sh
npm install
npm run dev        # local dev server at localhost:4321
```

## Commands

All commands run from the project root:

| Command                  | Action                                                      |
| :----------------------- | :---------------------------------------------------------- |
| `npm install`            | Install dependencies                                        |
| `npm run dev`            | Start the local dev server                                  |
| `npm run build`          | Build to `./dist/` — runs all checks below and fails on any |
| `npm run preview`        | Preview the production build locally                        |
| `npm run check:types`    | Type-check (`astro check`)                                  |
| `npm run check:sections` | Verify every section is registered in all three places      |
| `npm run check:pages`    | Audit heading structure across pages                        |
| `npm run check:links`    | Verify every internal link resolves                         |
| `npm run format`         | Format all files with Prettier                              |
| `npm run format:check`   | Check formatting without writing                            |

## How it's organised

- **`src/content/`** — the words & data an editor types (CMS-editable)
- **`src/components/`** — `chrome/` (Header, Footer…), `sections/` (page blocks),
  `ui/` (Button, Heading…)
- **`src/pages/`** — routes; `[...slug].astro` renders any CMS page
- **`src/lib/`** — shared logic and the section registries
- **`src/layouts/`** — page shells

A section is defined in **three places keyed by the same `type` string** —
schema (validation), component (rendering), and `.pages.yml` (editing) — and the
build fails if they drift apart.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — full folder tour and the
  three-registry model. **Read this before adding a section or page.**
- [`docs/SECTIONS.md`](docs/SECTIONS.md) — the section catalogue and naming rule.
- [Astro docs](https://docs.astro.build) — the underlying framework.

## Image credits

The specimen macro photos in `public/media/images/` (scorpions, ant, spider,
cricket, termite, tick, wasps, mouse, mosquito, cockroach, black widow, bed bug,
attic rodent damage) are public-domain or CC0 images sourced via
[Openverse](https://openverse.org/), mostly from the USGS Bee Inventory and
Monitoring Lab and the Insects Unlocked project. No attribution is required, but
swap them for the client's own job photos before launch.
