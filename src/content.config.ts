import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { sectionSchema } from './lib/section-schemas';
import { serviceSchema, projectSchema, locationSchema, templateSchema } from './lib/collections';

const seoSchema = z
	.object({
		title: z.string().optional(),
		description: z.string().optional(),
		ogImage: z.string().optional(),
		noindex: z.boolean().default(false),
	})
	.default({ noindex: false });

/**
 * Every routable page is one JSON file holding an ordered array of sections.
 * The file's path under `src/content/pages` becomes its URL: `_home.json` is the
 * site root, `services/scorpions.json` is `/services/scorpions`.
 */
const pages = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
	schema: z.object({
		title: z.string(),
		/**
		 * Read-only mirror of the live URL, shown in the CMS so an editor can
		 * see where the page publishes. Not used for routing -- the route comes
		 * from `slug` or the file path. Kept in sync by scripts/sync-permalinks.
		 */
		permalink: z.string().optional(),
		/** Overrides the path-derived URL when set. Use sparingly. */
		slug: z.string().optional(),
		/** CMS sidebar sort position only; the home page is 0 to pin it on top. */
		order: z.number().default(100),
		seo: seoSchema,
		draft: z.boolean().default(false),
		sections: z.array(sectionSchema).default([]),
	}),
});

/**
 * Collections are the pages nobody hand-builds: a row of data becomes a card
 * in an index and a page of its own. This is what keeps a large site editable.
 */
const services = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
	schema: serviceSchema,
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
	schema: projectSchema,
});

const locations = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/locations' }),
	schema: locationSchema,
});

/**
 * Template pages: one body, many generated pages. Editing this changes every
 * location page at once, which is the point.
 */
const templates = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/templates' }),
	schema: templateSchema,
});

export const collections = { pages, services, projects, locations, templates };
