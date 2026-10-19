import { z } from 'astro/zod';
import { imageSchema } from './section-base';
import { sectionSchema } from './section-schemas';

/**
 * Shared shape for every collection entry.
 *
 * Each entry is both a card somewhere (title, summary, image) and a page of
 * its own (seo, sections). Splitting those would mean editing a service in two
 * places, so they live together.
 */
const entryBase = {
	title: z.string(),
	/** Card text. Kept short on purpose; the page carries the detail. */
	summary: z.string(),
	image: imageSchema.optional(),
	draft: z.boolean().default(false),
	/** Lower sorts first. Ties fall back to title. */
	order: z.number().default(100),
	seo: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			ogImage: z.string().optional(),
			noindex: z.boolean().default(false),
		})
		.default({ noindex: false }),
	sections: z.array(sectionSchema).default([]),
};

export const serviceSchema = z.object({
	...entryBase,
	/**
	 * Public heading override. `title` doubles as the CMS list label, so a room
	 * main page sets title to "Scorpions — Main Page" to read clearly in the
	 * sidebar; `heading` then carries the real on-page H1 ("Scorpion Control").
	 * Omit on sub-services -- their title is already the heading.
	 */
	heading: z.string().optional(),
	/** Shown on cards as a from-price or range. Free text, not a number. */
	priceNote: z.string().optional(),
	/**
	 * An intermediate breadcrumb between Services and this page, for a
	 * sub-category that lives under a parent (e.g. UV Scorpion Hunts under Scorpion
	 * Control). Omit on top-level services; the trail stays Home / Services / Title.
	 */
	parent: z
		.object({
			label: z.string(),
			href: z.string(),
		})
		.optional(),
});

export const projectSchema = z.object({
	...entryBase,
	location: z.string().optional(),
	completed: z.coerce.date().optional(),
	/** Ties a project to the services it demonstrates. */
	services: z.array(z.string()).default([]),
});

/**
 * A location is data, not a page.
 *
 * Title, summary, SEO and body all come from the shared template, so ten towns
 * do not mean ten near-identical section arrays to keep in sync. Only the
 * facts that differ live here.
 */
export const locationSchema = z.object({
	city: z.string(),
	region: z.string(),
	postalCodes: z.array(z.string()).default([]),
	phone: z.string().optional(),
	/** Nearby towns this branch also covers, listed on the page. */
	serves: z.array(z.string()).default([]),
	image: imageSchema.optional(),
	draft: z.boolean().default(false),
	order: z.number().default(100),
	/**
	 * Take full control of the page instead of inheriting the shared template.
	 *
	 * When true, the route skips the template sections and the layout skips its
	 * auto-generated header, so `sections` render alone from the top of the page
	 * (starting with a hero). Left false, a town behaves as before: template
	 * body first, row sections appended. Lets one flagship town diverge without
	 * touching the ten that share the template.
	 */
	customLayout: z.boolean().default(false),
	/** Appended after the template sections, for anything town-specific. */
	sections: z.array(sectionSchema).default([]),
	/**
	 * Card text, shown wherever this town appears in a list.
	 *
	 * Separate from the template on purpose: the template owns the page body,
	 * the row owns the facts about the town, and a card is a fact about the
	 * town. Astro does not apply Zod transforms on collection schemas, so this
	 * cannot be derived at load time.
	 */
	title: z.string(),
	summary: z.string(),
});

/** The shared body every location page is built from. */
export const templateSchema = z.object({
	title: z.string(),
	summary: z.string(),
	seo: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			ogImage: z.string().optional(),
			noindex: z.boolean().default(false),
		})
		.default({ noindex: false }),
	sections: z.array(sectionSchema).default([]),
});

export type CollectionName = 'services' | 'projects' | 'locations';

/** Where each collection lives in the URL. */
export const collectionBasePath: Record<CollectionName, string> = {
	services: '/services',
	projects: '/projects',
	locations: '/locations',
};

/**
 * The URL slug for a collection entry id.
 *
 * A room's main page lives inside its own folder as `_main.json` so the CMS
 * groups it with its sub-services and sorts it to the top of the group
 * (scorpions/_main.json above scorpions/bark-scorpions.json). On disk that gives the id
 * `scorpions/_main`, but the page is still `/services/scorpions` -- so the trailing
 * `/_main` is dropped here, in one place, for every link and route.
 */
export function entrySlug(id: string): string {
	return id.replace(/\/_main$/, '');
}
