<script setup lang="ts">
import type { NavSection } from './AlpSidebar.vue';

const props = defineProps<{
    sections: NavSection[];
    activeKey?: string;
}>();

const emit = defineEmits<{
    select: [key: string];
}>();

function isActive(section: NavSection): boolean {
    return props.activeKey === section.key;
}
</script>

<template>
    <aside
        class="hidden md:flex flex-col items-center bg-primary-900 w-[72px] flex-shrink-0 py-2 gap-0.5 rounded-xl"
    >
        <nav class="flex flex-col items-center gap-1 flex-1 w-full px-2">
            <component
                :is="section.to ? 'NuxtLink' : 'button'"
                v-for="section in sections"
                :key="section.key"
                :type="section.to ? undefined : 'button'"
                :to="section.to"
                class="flex flex-col items-center gap-1 w-full px-1 py-2 rounded-lg transition-colors"
                :class="
                    isActive(section)
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                "
                data-testid="icon-rail-item"
                @click="emit('select', section.key)"
            >
                <i :class="[section.icon || 'pi pi-circle', 'text-base']" />
                <span class="text-[10px] leading-none font-semibold">{{ section.label }}</span>
            </component>
        </nav>

        <!-- Caller-provided footer (e.g. a pinned Settings link) -->
        <div class="mt-auto px-2 w-full">
            <slot name="footer" />
        </div>
    </aside>
</template>
