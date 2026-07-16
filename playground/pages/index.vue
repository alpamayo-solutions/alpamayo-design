<script setup lang="ts">
import type { Story } from '../../stories/_types';
const modules = import.meta.glob<{ default: Story }>('../../stories/*.story.ts', { eager: true });
const stories = Object.entries(modules).map(([path, m]) => ({
    id: path.split('/').pop()!.replace('.story.ts', ''),
    ...m.default
}));
const groups = ['Foundations', 'Components', 'Signature'] as const;
</script>

<template>
    <div class="space-y-8">
        <section v-for="g in groups" :key="g">
            <h2 class="text-sm font-bold uppercase tracking-wide text-surface-400 mb-2">{{ g }}</h2>
            <ul class="space-y-1">
                <li v-for="s in stories.filter((s) => s.group === g)" :key="s.id">
                    <NuxtLink :to="`/story/${s.id}`" class="text-primary-600 hover:underline">{{
                        s.title
                    }}</NuxtLink>
                    <span class="text-xs text-surface-400 ml-2">{{ s.component }}</span>
                </li>
            </ul>
        </section>
    </div>
</template>
