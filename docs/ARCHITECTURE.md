# Architecture

How this template is organised, and why. Read this before adding a section,
a page, or a content type — the folder layout encodes rules the build enforces.

## The mental model

A service-business site is **content poured into reusable layout shapes**. This
template keeps those two things apart at every level:

- **Content** (`src/content/`) is the words and data an editor types.
- **Code** (`src/components/`, `src/lib/`) is the shapes that render it.

Editors touch content, never code. The build guarantees the two stay in sync.

## Folder map

```
clearline-pest-template/
├── .pages.yml            CMS config — what editors can edit, and how
├── astro.config.mjs      Astro + Tailwind config
├── tsconfig.json         TypeScript config
├── .prettierrc           Formatting rules
├── package.json          Dependencies + build/check scripts
├── docs/                 This file, plus SECTIONS.md (the section catalogue)
├── scripts/              Build-time validators (see "The three registries")
├── public/media/         Static assets served as-is
└── src/
    ├── content/          The words & data (CMS-editable)
    ├── components/       The building blocks (how it looks)
    ├── pages/            Routes (URLs)
    ├── layouts/          Page shells
    ├── lib/              Shared logic (no markup)
    └── styles/           global.css
```

## `src/content/` — the words & data

Markdown/JSON grouped by type. This is the CMS-editable layer; `.pages.yml`
maps each folder to an editing UI.

```
content/
├── site.json      Global settings (name, nav, contact)
├── pages/         Individual pages (home.json, …)
├── services/      Service entries (general-pest, scorpions, termites…)
├── locations/     Location / area pages
├── projects/      Portfolio entries
└── templates/     Reusable content templates
```

## `src/components/` — the building blocks

Three tiers by role:

```
components/
├── chrome/     Site-wide furniture: Header, Footer, AnnouncementBar, Popup
├── sections/   The page sections (Hero, CardGrid, Quotes…) — see below
└── ui/         Reusable primitives: Button, Heading, Breadcrumbs, Pagination…
```

Each section is a **pair of colocated files**:

- `Hero.astro` — renders the HTML (the _view_)
- `Hero.schema.ts` — a Zod schema defining the section's fields, defaults, and
  validation (the _data contract_), and the TypeScript type the `.astro` file
  imports for its props.

They sit side by side on purpose: editing a section means its view and its data
shape are one click apart. (In VS Code the `.schema.ts` files nest under their
`.astro` sibling in the Explorer — see `.vscode/settings.json`.)

## `src/pages/` — routes

Astro turns each file here into a URL.

```
pages/
├── [...slug].astro    Catch-all: renders any CMS page by its slug
├── 404.astro
├── locations/         /locations/*
├── projects/          /projects/*
├── services/          /services/*
├── robots.txt.ts      Generated robots.txt
└── llms.txt.ts        Generated llms.txt
```

## `src/lib/` — shared logic

Plain TypeScript, no markup. The engine room.

| File                 | Job                                                                  |
| -------------------- | -------------------------------------------------------------------- |
| `sections.ts`        | Registry: section `type` string → `.astro` component (rendering)     |
| `section-schemas.ts` | Registry: all Zod schemas, unioned by `type` (validation)            |
| `section-base.ts`    | Shared schema helpers (`imageSchema`, `linkSchema`, `defineSection`) |
| `collections.ts`     | Content-collection queries                                           |
| `markdown.ts`        | Markdown → HTML rendering                                            |
| `schema-org.ts`      | SEO structured data                                                  |
| `contrast.ts`        | Colour-contrast utilities                                            |
| `interpolate.ts`     | Template-string interpolation                                        |
| `site.ts`            | Global site-data access                                              |

## The three registries

This is the one rule that governs everything. A section (e.g. `hero`) is defined
in **three parallel places, all keyed by the same `type` string**:

```
content/*.json          the data an editor typed
      │
      ▼
lib/section-schemas.ts  VALIDATES it      (Hero.schema.ts, Zod)
lib/sections.ts         RENDERS it        (Hero.astro)
.pages.yml              EDITS it          (CMS field definitions)
```

Adding a section means adding it in all three. That is deliberate verbosity: the
`scripts/check-*.mjs` validators fail the build if the three drift apart, so the
boilerplate cannot silently rot. `sections.ts` is typed `Record<SectionType, …>`
so two of the three drift cases are caught at compile time; the CMS round-trip
(`check:sections`) catches the third.

## Build gates

`npm run build` only succeeds if every check passes (see `package.json`):

| Step             | Enforces                                      |
| ---------------- | --------------------------------------------- |
| `check-sections` | Every section wired into all three registries |
| `astro check`    | TypeScript + Astro type safety                |
| `astro build`    | The site compiles                             |
| `check-pages`    | One `h1` per page, no skipped heading levels  |
| `check-links`    | Every internal link resolves                  |

`npm run format:check` (Prettier) is the formatting gate, run separately.

## Adding things — quick reference

- **A new section:** create `Foo.astro` + `Foo.schema.ts` in `components/sections/`,
  register in `lib/sections.ts` and `lib/section-schemas.ts`, add to `.pages.yml`.
  See `docs/SECTIONS.md` for the naming rule ("name by shape, not by purpose").
- **A new page:** add content under `src/content/pages/`; the `[...slug]` route
  renders it. Add a dedicated file in `src/pages/` only for custom routing.
- **A new content type:** add a collection in `src/content/`, wire it in
  `src/content.config.ts`, and query it via `lib/collections.ts`.
