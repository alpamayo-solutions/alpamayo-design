import { defineComponent, h } from 'vue';

/**
 * Vitest stub for Nuxt's `#components` virtual module.
 *
 * In a real Nuxt build, `#components` exports the compile-time auto-imported
 * component set, including the built-in `NuxtLink`. Under vitest there is no
 * Nuxt build, so `vitest.config.ts` aliases `#components` to this file.
 *
 * This stub renders a plain anchor so tests can assert that link branches
 * resolve to a real `<a href>` element — the exact behaviour the string
 * `:is="'NuxtLink'"` form silently failed to produce at runtime.
 */
export const NuxtLink = defineComponent({
    name: 'NuxtLink',
    props: {
        to: { type: [String, Object], default: undefined }
    },
    setup(props, { slots, attrs }) {
        return () =>
            h(
                'a',
                { ...attrs, href: typeof props.to === 'string' ? props.to : undefined },
                slots.default ? slots.default() : []
            );
    }
});
