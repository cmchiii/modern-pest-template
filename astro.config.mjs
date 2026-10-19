// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	// Overridden per client site. Used by @astrojs/sitemap and canonical URLs.
	site: 'https://clearline-pest-template.vercel.app',
	integrations: [
		sitemap({
			// /theme is an internal reference marked noindex. Listing it in the
			// sitemap while telling crawlers to ignore it is a contradiction.
			filter: (page) => !page.includes('/theme'),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
