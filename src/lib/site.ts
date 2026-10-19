import { z } from 'astro/zod';
import siteData from '../content/site.json';
import { readableOn } from './contrast';

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Theme colours are interpolated into inline `style` attributes and into the
 * `:root` block BaseLayout emits, so an unvalidated value is a CSS injection
 * sink. Validating here fails the build instead, which is the right place to
 * find out.
 */
const hexColor = z.string().regex(HEX, 'Must be a hex colour, for example #22463a');

const navItemSchema: z.ZodType<NavItem> = z.lazy(() =>
	z.object({
		label: z.string(),
		// Optional so a parent can be a dropdown label with no page of its own.
		// The header renders such an item as a non-clickable button.
		href: z.string().optional(),
		children: z.array(navItemSchema).optional(),
	})
);

export interface NavItem {
	label: string;
	href?: string;
	children?: NavItem[];
}

/**
 * A labelled link with a button style. Shared by the header CTA, the
 * announcement bar and the popup, so it lives here and is imported where
 * needed rather than redeclared.
 */
export const linkSchema = z.object({
	label: z.string(),
	href: z.string(),
	style: z.enum(['primary', 'secondary', 'ghost']).default('primary'),
});

const siteSchema = z.object({
	name: z.string(),
	legalName: z.string().optional(),
	/**
	 * Schema.org type for the business. A trade-specific subtype tells search
	 * engines what this company actually does; plain LocalBusiness does not.
	 * Any schema.org LocalBusiness subtype is valid here.
	 */
	businessType: z.string().default('LocalBusiness'),
	/**
	 * Review totals, for AggregateRating. Only emitted when both are present,
	 * since a rating without a count is not eligible for rich results and
	 * inventing either is grounds for a manual penalty.
	 */
	rating: z
		.object({
			value: z.number().min(0).max(5),
			count: z.number().int().positive(),
		})
		.optional(),
	tagline: z.string().optional(),
	logo: z.object({ src: z.string(), alt: z.string() }).optional(),
	/** Light version of the logo for dark grounds (the footer). Falls back to a knocked-out `logo`. */
	logoOnDark: z.object({ src: z.string(), alt: z.string() }).optional(),
	contact: z.object({
		phone: z.string(),
		phoneHref: z.string(),
		email: z.string().optional(),
		address: z
			.object({
				street: z.string(),
				city: z.string(),
				region: z.string(),
				postalCode: z.string(),
				country: z.string().default('US'),
			})
			.optional(),
		hours: z.string().optional(),
	}),
	nav: z.array(navItemSchema).default([]),
	primaryCta: linkSchema.optional(),
	footer: z.object({
		columns: z
			.array(
				z.object({
					title: z.string(),
					links: z.array(z.object({ label: z.string(), href: z.string() })),
				})
			)
			.default([]),
		legal: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
	}),
	social: z.array(z.object({ platform: z.string(), href: z.string() })).default([]),
	theme: z.object({
		primary: hexColor,
		primaryHover: hexColor,
		primaryFg: hexColor,
		accent: hexColor,
		accentFg: hexColor,
		accentInk: hexColor,
		ink: hexColor,
		body: hexColor,
		muted: hexColor,
		line: hexColor,
		surface: hexColor,
		dark: hexColor,
		darkFg: hexColor,
		radius: z.string(),
		radiusMedia: z.string(),
		fontDisplay: z.string(),
		fontHeading: z.string(),
		fontBody: z.string(),
		fontMono: z.string(),
		fontHref: z.string().optional(),
	}),
});

/**
 * Global site config, parsed once at build time. An invalid `site.json` fails
 * the build here rather than rendering a half-broken header on every page.
 */
export const site = siteSchema.parse(siteData);

export type Site = typeof site;

/**
 * Readable text and heading colours for each section background, derived from
 * the background's luminance at build time rather than paired by hand. This is
 * what keeps the site legible when an editor changes a background in the CMS:
 * if `surface` is set to a dark hex, body text flips light automatically,
 * instead of staying the dark `body` colour and disappearing.
 *
 * Body prefers the muted brand text; headings prefer the stronger `ink`. Both
 * fall back through the opposite-end token, then to black/white, so the result
 * always clears a usable contrast ratio whatever the editor picks.
 */
export function surfaceContrast(theme: Site['theme']) {
	// Order matters: the first candidate that reads well wins ties, so the
	// on-brand colour is preferred over the plain black/white fallback.
	const bodyInk = (bg: string) => readableOn(bg, [theme.body, theme.ink, theme.darkFg]);
	const headInk = (bg: string) => readableOn(bg, [theme.ink, theme.body, theme.darkFg]);

	return {
		surface: { bg: theme.surface, fg: bodyInk(theme.surface), heading: headInk(theme.surface) },
		muted: { bg: theme.muted, fg: bodyInk(theme.muted), heading: headInk(theme.muted) },
		dark: { bg: theme.dark, fg: bodyInk(theme.dark), heading: headInk(theme.dark) },
		brand: { bg: theme.primary, fg: bodyInk(theme.primary), heading: headInk(theme.primary) },
	};
}

/** Maps `theme` onto the CSS custom properties declared in `global.css`. */
export function themeVars(theme: Site['theme']): string {
	const auto = surfaceContrast(theme);

	const map: Record<string, string> = {
		'--brand-primary': theme.primary,
		'--brand-primary-hover': theme.primaryHover,
		'--brand-primary-fg': theme.primaryFg,
		'--brand-accent': theme.accent,
		'--brand-accent-fg': theme.accentFg,
		'--brand-accent-ink': theme.accentInk,
		'--brand-ink': theme.ink,
		'--brand-body': theme.body,
		'--brand-muted': theme.muted,
		'--brand-line': theme.line,
		'--brand-surface': theme.surface,
		'--brand-dark': theme.dark,
		'--brand-dark-fg': theme.darkFg,
		'--brand-radius': theme.radius,
		'--brand-radius-media': theme.radiusMedia,
		'--brand-font-display': theme.fontDisplay,
		'--brand-font-heading': theme.fontHeading,
		'--brand-font-body': theme.fontBody,
		'--brand-font-mono': theme.fontMono,

		// Auto-contrast text per surface. Consumed by Section.astro so each
		// background carries a foreground proven readable against it.
		'--surface-light-fg': auto.surface.fg,
		'--surface-light-heading': auto.surface.heading,
		'--surface-muted-fg': auto.muted.fg,
		'--surface-muted-heading': auto.muted.heading,
		'--surface-dark-fg': auto.dark.fg,
		'--surface-dark-heading': auto.dark.heading,
		'--surface-brand-fg': auto.brand.fg,
		'--surface-brand-heading': auto.brand.heading,
	};

	return Object.entries(map)
		.map(([key, value]) => `${key}:${value};`)
		.join('');
}
