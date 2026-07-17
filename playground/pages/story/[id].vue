<script setup lang="ts">
import Column from 'primevue/column';
import type { Story, StoryVariant } from '../../../stories/_types';

const route = useRoute();
const modules = import.meta.glob<{ default: Story }>('../../../stories/*.story.ts', { eager: true });
const story = computed<Story | null>(() => {
    const id = route.params.id as string;
    const entry = Object.entries(modules).find(([path]) => path.endsWith(`/${id}.story.ts`));
    return entry ? entry[1].default : null;
});

// Runtime component registry: import.meta.glob over both component dirs
const comps = import.meta.glob<{ default: unknown }>('../../../components/{volt,alp}/*.vue', { eager: true });
function resolve(name: string | null) {
    if (!name) return null;
    for (const [path, mod] of Object.entries(comps)) {
        const file = path.split('/').pop()!.replace('.vue', '');
        const registered = path.includes('/volt/') ? `Volt${file}` : file;
        if (registered === name) return (mod as { default: unknown }).default;
    }
    return null;
}

// Every tag name a story's slot content can reference: Volt*/Alp* design-system components (by their
// registered story name) plus PrimeVue's Column (used for table column declarations).
const tagComponents: Record<string, unknown> = { Column };
for (const [path, mod] of Object.entries(comps)) {
    const file = path.split('/').pop()!.replace('.vue', '');
    const registered = path.includes('/volt/') ? `Volt${file}` : file;
    tagComponents[registered] = (mod as { default: unknown }).default;
}

// Story `slots` are authored as raw template-string markup (e.g. `<Column field="name" .../>`) so
// that component tags inside them actually instantiate — and so components that rely on synchronous
// static slot-vnode introspection (e.g. PrimeVue DataTable's Column collection, which walks the exact
// vnode array `$slots.default()` returns *without* mounting anything) can see them, the component
// usage and its slot content must be compiled together as a *single* runtime template. Compiling the
// slot content in isolation and nesting it under the component via a separate wrapper component hides
// those vnodes one component-instance deeper than that synchronous walk looks, so e.g. DataTable
// silently sees zero columns. `runtimeCompiler: true` (playground/nuxt.config.ts) enables compiling
// the generated `template` string below at runtime; `components` gives it app-context resolution for
// every tag name it might reference.
function compileVariant(componentName: string | null, variant: StoryVariant) {
    const slotTemplates = Object.entries(variant.slots ?? {})
        .map(([name, html]) => `<template #${name}>${html}</template>`)
        .join('');
    return {
        components: { StoryComponent: resolve(componentName), ...tagComponents },
        setup: () => ({ variantProps: variant.props ?? {} }),
        template: `<StoryComponent v-bind="variantProps">${slotTemplates}</StoryComponent>`
    };
}
</script>

<template>
    <div
        v-if="story"
        data-story-card
        :data-story-group="story.group"
        :data-story-component="story.component ?? ''"
    >
        <h1 class="text-xl font-bold text-surface-900 mb-1">{{ story.title }}</h1>
        <p class="text-sm text-surface-500 mb-6">{{ story.description }}</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section class="rounded-xl border border-black/10 overflow-hidden">
                <p
                    class="text-[10px] font-bold uppercase tracking-widest text-surface-400 bg-black/5 px-3 py-1.5 m-0"
                >
                    Light
                </p>
                <div class="bg-surface-50 p-6 space-y-4">
                    <div v-for="v in story.variants" :key="v.name">
                        <p class="text-[11px] font-semibold uppercase text-surface-400 mb-2">{{ v.name }}</p>
                        <component :is="compileVariant(story.component, v)" v-if="story.component" />
                    </div>
                </div>
            </section>
            <section class="dark rounded-xl border border-white/10 overflow-hidden">
                <p
                    class="text-[10px] font-bold uppercase tracking-widest text-surface-500 bg-white/5 px-3 py-1.5 m-0"
                >
                    Dark
                </p>
                <div class="bg-primary-900 p-6 space-y-4">
                    <div v-for="v in story.variants" :key="v.name">
                        <p class="text-[11px] font-semibold uppercase text-surface-500 mb-2">{{ v.name }}</p>
                        <component :is="compileVariant(story.component, v)" v-if="story.component" />
                    </div>
                </div>
            </section>
        </div>
        <footer class="mt-6 text-xs text-surface-500 border-t border-surface-200 pt-3" data-story-footer>
            <p>
                <b>Component:</b> {{ story.component ?? 'design tokens' }} · <b>Source:</b>
                {{ story.sourcePath }}
            </p>
            <pre
                class="mt-2 bg-surface-100 rounded p-2 overflow-x-auto"
            ><code>{{ story.snippet }}</code></pre>
        </footer>
    </div>
    <p v-else>Story not found.</p>
</template>
