/**
 * Shared button appearance, so anything that must render as a real `<button>`
 * (e.g. a form submit, which cannot be the `<a>`-based Button component) still
 * looks identical to Button and stays in sync when the styling changes here.
 *
 * Button.astro is the primary consumer; keep visual tweaks in this file rather
 * than inlining button classes elsewhere.
 */

export type ButtonStyle = 'primary' | 'accent' | 'secondary' | 'ghost';

/**
 * Button scale. Each token is a self-contained set of size utilities (font-size,
 * weight, padding, min-height, tracking) so a button only ever carries ONE of
 * each -- sizes are chosen here, never layered via overriding classes at the call
 * site. That keeps sizing immune to Tailwind's source-order cascade, which bites
 * whenever two conflicting utilities (e.g. `text-sm` over `text-[0.8125rem]`)
 * fight and the wrong one happens to be emitted later.
 *
 * - `sm`  nav chrome: compact, sits beside 11-12px nav links.
 * - `md`  site-wide default: deliberately heavier than body copy (prose is
 *         14-18px regular lower-case; this is 13px bold uppercase + tracking, so
 *         it reads as the stronger element wherever a CTA sits next to a
 *         description -- the QA ask).
 * - `lg`  hero / CTA banner: the page's primary action, one step up again.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

// Everything that is NOT size-related. Size comes from buttonSize() so the two
// never collide. Flat and square, sentence case; filled buttons lift a pixel
// on a soft shadow when hovered.
export const buttonBase =
	'group inline-flex items-center justify-center gap-2.5 rounded-(--radius-brand) whitespace-nowrap font-heading transition-[color,background-color,border-color,transform,box-shadow] duration-200';

const lifted =
	'border border-transparent shadow-[0_1px_2px_rgba(15,27,51,0.12)] hover:-translate-y-px hover:shadow-[0_10px_24px_-10px_rgba(15,27,51,0.45)] active:translate-y-0';

/** Size utilities for a given scale token. One font-size/padding/min-height each. */
export function buttonSize(size: ButtonSize): string {
	switch (size) {
		case 'sm':
			return 'min-h-10 px-5 text-sm font-semibold tracking-[-0.005em]';
		case 'lg':
			return 'min-h-[3.5rem] px-8 text-base font-semibold tracking-[-0.01em]';
		default:
			return 'min-h-12 px-7 text-[0.9375rem] font-semibold tracking-[-0.01em]';
	}
}

/** Variant classes. `onDark` inverts the outline variants for dark surfaces. */
export function buttonVariant(style: ButtonStyle, onDark = false): string {
	switch (style) {
		// The orange CTA: the one hot colour, legible on white, navy and dark alike.
		case 'accent':
			return `bg-cta text-cta-fg hover:bg-cta-hover ${lifted}`;
		case 'secondary':
			return onDark
				? 'border border-current/35 text-current hover:border-current hover:bg-current/10'
				: 'border border-ink/25 text-ink hover:border-ink';
		case 'ghost':
			return onDark
				? 'px-0 text-current underline decoration-current/40 decoration-1 underline-offset-[6px] hover:decoration-current'
				: 'px-0 text-brand underline decoration-brand/40 decoration-1 underline-offset-[6px] hover:decoration-brand';
		// Primary hovers to the apricot accent so the change always reads. On dark
		// grounds a navy fill would vanish, so it starts white instead.
		default:
			return onDark
				? `bg-surface text-ink hover:bg-accent hover:text-accent-fg ${lifted}`
				: `bg-brand text-brand-fg hover:bg-accent hover:text-accent-fg ${lifted}`;
	}
}
