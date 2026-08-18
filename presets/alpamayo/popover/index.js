/*
 * Popover placement, and why the arrow is driven by these two signals only.
 *
 * PrimeVue's Popover positions itself in `alignOverlay()`: the panel goes
 * directly below the trigger, or directly above it when it would overflow the
 * viewport. The only placement facts it publishes are `data-p-popover-flipped`
 * (set when it went above) and the `--p-popover-arrow-left` custom property
 * (how far the arrow has to move to stay on the trigger when the panel was
 * pushed sideways to fit). It never emits `data-pc-position` — that attribute
 * does not exist anywhere in PrimeVue 4, so the earlier left/right rules keyed
 * on it never matched, leaving the arrow's geometry and colour unconditional
 * and painting a stray triangle at the panel's left edge on every popover.
 *
 * The gutter equals the arrow height so the arrow exactly bridges trigger and
 * panel. Structure mirrors PrimeVue's own theme: `before` is the border-colour
 * triangle, `after` the 2px-smaller background-colour triangle drawn over it,
 * which is what gives the arrow the panel's 1px border.
 *
 * Every class below has to stay a literal: Tailwind scans this file as raw text
 * (`@source "../../presets/**\/*.js"`), so an interpolated class name is never
 * generated.
 */
export default {
    root: {
        class: [
            // Position
            'absolute left-0 top-0',
            'z-40 transform origin-center',

            // Gutter: below the trigger by default, above it when flipped.
            'mt-2.5',
            'data-[p-popover-flipped="true"]:-mt-2.5',

            // Color
            'bg-transparent',
            'text-surface-700 dark:text-surface-0/80',

            // Arrow — border colour
            `
      before:absolute
      before:h-0
      before:w-0
      before:border-10
      before:border-solid
      before:border-transparent
      before:bottom-full
      before:left-[calc(1.25rem_+_var(--p-popover-arrow-left,0px))]
      before:-ml-[10px]
      before:border-b-surface-200
      dark:before:border-b-surface-800

      data-[p-popover-flipped="true"]:before:bottom-auto
      data-[p-popover-flipped="true"]:before:top-full
      data-[p-popover-flipped="true"]:before:border-b-transparent
      data-[p-popover-flipped="true"]:before:border-t-surface-200
      dark:data-[p-popover-flipped="true"]:before:border-t-surface-800
      `,

            // Arrow — panel surface, inset by the 2px border
            `
      after:absolute
      after:h-0
      after:w-0
      after:border-8
      after:border-solid
      after:border-transparent
      after:bottom-full
      after:left-[calc(1.25rem_+_var(--p-popover-arrow-left,0px))]
      after:-ml-[8px]
      after:border-b-surface-0
      dark:after:border-b-surface-900

      data-[p-popover-flipped="true"]:after:bottom-auto
      data-[p-popover-flipped="true"]:after:top-full
      data-[p-popover-flipped="true"]:after:border-b-transparent
      data-[p-popover-flipped="true"]:after:border-t-surface-0
      dark:data-[p-popover-flipped="true"]:after:border-t-surface-900
      `
        ]
    },
    content: {
        class: [
            // Shape
            'rounded-lg shadow-lg',
            'bg-surface-0 dark:bg-surface-900',

            // No offset from the root: the arrow is anchored to the root's edges,
            // so any nudge here opens a gap between the arrow and the panel.
            'p-5 items-center flex',
            'border border-surface-200 dark:border-surface-700'
        ]
    },
    transition: {
        enterFromClass: 'opacity-0 scale-y-[0.8]',
        enterActiveClass: 'transition-[transform,opacity] duration-120 ease-out',
        leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        leaveToClass: 'opacity-0'
    }
};
