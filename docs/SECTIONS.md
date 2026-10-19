# Section library

The complete catalogue for a contractor or service-business site, named by
layout shape so one component serves any trade.

## The naming rule

**Name a section by what it looks like, never by what it says.**

A competitor site ships a block called `terms-conditions` that renders "How
It Works". The name lies about the shape, so nobody can reuse it and nobody can
find it. That is the failure to avoid.

- Right: `card_grid`, `media_split`, `steps`
- Wrong: `services`, `why_choose_us`, `how_it_works`

Purpose is content the editor types into the heading. Shape is what the code
renders. Editors still see friendly labels: the `label` in `.pages.yml` is
human-facing, the `name` is the code contract.

## Variant or new section?

Add a **variant** when the content is the same shape arranged differently:
image left vs right, three columns vs four.

Add a **new section** when the fields diverge. Once two uses of a section need
different fields, the shared version becomes a component with eight toggles
that nobody understands. Cap a section at roughly eight fields.

## Status

| Status    | Meaning                                 |
| --------- | --------------------------------------- |
| **Built** | Shipped, in `.pages.yml`, verified      |
| **Next**  | Needed for a first complete client site |
| **Later** | Real demand exists, but not for launch  |

---

## Conversion

The sections that exist to produce a phone call or a booked appointment.

| Section        | Shape                                             | Variants                                                                               | Status    |
| -------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------- | --------- |
| `hero`         | Opening statement, optional media                 | `full` / `split` / `centered`; background `image` / `video` / `carousel` / none        | **Built** |
| `cta_banner`   | Headline plus buttons in a coloured band          | surface `brand` / `dark` / `muted`; buttons inline or stacked                          | **Built** |
| `form_block`   | Lead capture                                      | `short` (name, phone, postcode) / `full` (quote request) / `newsletter` / `multi_step` | **Built** |
| `search_block` | Postcode or city lookup that routes to a location | inline bar / centred panel                                                             | **Built** |
| `banner_strip` | Thin in-page promo                                | with CTA / text only; dismissible                                                      | Later     |
| `calculator`   | Interactive estimate or finance figure            | single input / multi input                                                             | Later     |

## Proof

Nobody buys a considered home service without evidence.

| Section         | Shape                                  | Variants                                                           | Status    |
| --------------- | -------------------------------------- | ------------------------------------------------------------------ | --------- |
| `quotes`        | Customer quotes as cards               | 2 / 3 columns; with or without star ratings; with or without photo | **Built** |
| `stat_band`     | A row of numbers                       | 2 / 3 / 4 items; counted up on scroll or static                    | **Built** |
| `media_gallery` | Project photography                    | grid / masonry; filterable by category; lightbox on or off         | **Built** |
| `media_compare` | Before and after                       | drag slider / side by side / tabbed                                | **Built** |
| `logo_row`      | Brands carried, certifications, awards | static grid / marquee; greyscale or full colour                    | **Built** |
| `review_widget` | Third-party reviews embed              | badge / carousel                                                   | Later     |
| `team_grid`     | People                                 | with or without bio; with or without social links                  | Later     |
| `quote_feature` | One large pull quote                   | with portrait / with logo / text only                              | Later     |

## Explaining the offer

| Section         | Shape                               | Variants                                                    | Status    |
| --------------- | ----------------------------------- | ----------------------------------------------------------- | --------- |
| `card_grid`     | Equal cards, optional image         | 2 / 3 / 4 columns; with or without image; whole card linked | **Built** |
| `media_split`   | Image beside text, bullets, buttons | image `left` / `right`; with or without bullets             | **Built** |
| `steps`         | Numbered sequence                   | 3 to 5 steps; horizontal / vertical                         | **Built** |
| `feature_list`  | Icon, title, body, no card chrome   | 2 / 3 columns; with or without icons                        | **Built** |
| `split_tabs`    | Image beside tabbed feature panels  | tabs on side / above                                        | Later     |
| `pricing_tiers` | Packages side by side               | 2 / 3 / 4 tiers; one highlighted                            | Later     |
| `table`         | Specification or comparison grid    | plain / comparison with a highlighted column                | Later     |
| `tabs`          | Tabbed content panels               | horizontal / vertical                                       | Later     |
| `download_list` | Brochures, spec sheets, warranties  | list / cards                                                | Later     |

## Narrative and reassurance

| Section      | Shape                           | Variants                                     | Status    |
| ------------ | ------------------------------- | -------------------------------------------- | --------- |
| `rich_text`  | A block of prose                | `left` / `center`; narrow or default measure | **Built** |
| `accordion`  | Collapsible question and answer | with or without intro; first item open       | **Built** |
| `timeline`   | Dated sequence, company history | vertical / horizontal                        | Later     |
| `legal_text` | Fine print and disclaimers      | muted / plain                                | **Built** |

## Location

The heart of a contractor site, and where most of the page count comes from.

| Section           | Shape                               | Variants                                         | Status    |
| ----------------- | ----------------------------------- | ------------------------------------------------ | --------- |
| `contact_details` | Address, hours, phone, optional map | with form / without                              | **Built** |
| `service_areas`   | Towns and regions served            | column list / map plus list / searchable         | **Built** |
| `map_block`       | A map                               | single pin / service radius / multiple locations | Later     |

## Dynamic

Sections that read a collection instead of hand-typed content. These are what
keep a 200-page site maintainable.

| Section           | Shape                            | Variants                                                                           | Status    |
| ----------------- | -------------------------------- | ---------------------------------------------------------------------------------- | --------- |
| `collection_feed` | Latest N items from a collection | source `projects` / `services` / `locations`; layout grid / list / carousel; limit | **Built** |
| `carousel`        | Sliding row of cards or media    | cards / media / quotes; auto or manual                                             | Later     |
| `video_embed`     | A single video                   | inline / lightbox                                                                  | Later     |
| `embed_block`     | Arbitrary third-party embed      | aspect-locked / free height                                                        | Later     |

Give `card_grid`, `media_gallery` and `collection_feed` a shared
`source: manual | auto` field. Manual means the editor picks items; auto means
the section queries a collection. Index pages then maintain themselves.

## Page structure

| Section          | Shape                        | Variants                           | Status    |
| ---------------- | ---------------------------- | ---------------------------------- | --------- |
| `page_header`    | Compact interior page opener | with or without image              | **Built** |
| `anchor_nav`     | Sticky in-page jump links    | sticky / static                    | Later     |
| `spacer_divider` | Deliberate gap or rule       | space only / rule / dimension line | Later     |

Breadcrumbs are not a section and not part of `page_header`. The trail is
derived from the route (`lib/breadcrumbs.ts`) and rendered by `BreadcrumbBar`
as its own band above the page body, so an editor cannot misplace it and a
crumb cannot drift from the page it names.

---

## Not sections

These live in `site.json` and appear on every page. Making them sections would
let an editor build a page with two footers.

Header and navigation, footer, announcement bar, cookie notice, skip link.

## Page types

Sections compose into pages. These are the pages a complete site needs, and the
ones marked _collection_ are generated from data rather than authored one by one.

| Page                                                         | Source                                     |
| ------------------------------------------------------------ | ------------------------------------------ |
| Home, About, Contact, FAQ, Financing, Careers, Free estimate | One JSON file each                         |
| Privacy, Terms, Accessibility, 404                           | One JSON file each                         |
| Services index, Projects index, Service areas index          | One JSON file, feeding a `collection_feed` |
| Service detail                                               | _collection_                               |
| Project detail                                               | _collection_                               |
| Location detail                                              | _collection_, one per town                 |

Location pages are where the page count explodes. A national pest control brand can run to a thousand or more
against roughly 35 hand-authored pages. They come from one template plus a data
row per town, not from an editor building them individually.

## What is built

All twenty sections above marked **Built** are shipped and in `.pages.yml`.
The site runs on them: 39 pages from 24 content files, of which 21 pages come
from collections rather than being authored one by one.

Remaining work is the **Later** tier, deliberately unbuilt. Adding
`pricing_tiers` or `timeline` before a client asks is how a template collects
components nobody uses.

The one piece of real infrastructure still missing is the **template page**:
one section array plus a data row per town, which is how a location count goes
from ten to a thousand. The collections prove the mechanism; that turns it into
scale.

Adding a section means three places keyed by the same string: the Zod union,
the component registry, and `.pages.yml`. `npm run check:sections` enforces it.
