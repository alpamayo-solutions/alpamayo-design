<script setup lang="ts">
import { computed, resolveDynamicComponent } from 'vue';

/**
 * Router-agnostic link, used by every Alp* component that renders a navigable
 * target.
 *
 * This package ships as a Nuxt layer, but its components are also deep-imported
 * by plain Vue 3 + Vite apps. `<NuxtLink>` only ever resolves through Nuxt's
 * compile-time component auto-import: outside Nuxt it rendered an inert
 * `<nuxtlink>` element with no href, so the CTA looked right and did nothing.
 * Importing it from `#components` is not a way out either — that breaks
 * consumer `vue-tsc` — and a literal `<NuxtLink>` tag anywhere in a template
 * emits `resolveComponent('NuxtLink')` unconditionally, which warns on every
 * render outside Nuxt even when the branch never renders.
 *
 * `RouterLink` is the one link component both worlds share: vue-router
 * registers it globally from `install()`, and Nuxt installs vue-router itself.
 * It is looked up with `resolveDynamicComponent`, which hands the name back
 * instead of warning when nothing is registered, so a router-less app degrades
 * quietly to a plain anchor.
 *
 * Two deliberate consequences: under Nuxt this gives up NuxtLink's viewport
 * prefetching, and external targets are recognised here rather than by NuxtLink
 * — RouterLink would otherwise try to resolve `https://…` as a route.
 */
defineOptions({ inheritAttrs: false });

const props = defineProps<{
    to?: string;
    /** Render only the slot, with `{ href, navigate }` — RouterLink's `custom`. */
    custom?: boolean;
}>();

/** The slot contract, deliberately narrower than RouterLink's, so consumers
 *  cannot start depending on props the plain-anchor fallback cannot supply. */
defineSlots<{
    default(props: { href?: string; navigate: (event?: MouseEvent) => void }): unknown;
}>();

const resolved = resolveDynamicComponent('RouterLink');
const routerLink = typeof resolved === 'string' ? undefined : resolved;

const isExternal = computed(() => !!props.to && /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i.test(props.to));
const isRouted = computed(() => !!routerLink && !!props.to && !isExternal.value);

/** The rendered anchor carries the href; letting the click through is the navigation. */
function navigateNatively() {}
</script>

<template>
    <component :is="routerLink" v-if="isRouted" v-bind="$attrs" :to="to" :custom="custom">
        <template #default="{ href, navigate }"><slot :href="href" :navigate="navigate" /></template>
    </component>
    <slot v-else-if="custom" :href="to" :navigate="navigateNatively" />
    <a v-else v-bind="$attrs" :href="to"><slot :href="to" :navigate="navigateNatively" /></a>
</template>
