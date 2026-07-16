<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title?: string;
        count?: number | null;
        sub?: string;
        padded?: boolean;
        collapsible?: boolean;
        defaultOpen?: boolean;
    }>(),
    {
        title: undefined,
        count: undefined,
        sub: undefined,
        padded: true,
        collapsible: false,
        defaultOpen: true
    }
);

const open = ref(props.defaultOpen);
</script>

<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
    >
        <div
            v-if="title || $slots.header || $slots.actions || $slots.sub || sub"
            class="px-5 py-3.5 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between gap-3"
            :class="collapsible ? 'cursor-pointer select-none' : ''"
            @click="collapsible ? (open = !open) : undefined"
        >
            <div class="min-w-0 flex items-center gap-2">
                <i
                    v-if="collapsible"
                    class="pi text-surface-400 text-xs transition-transform duration-150"
                    :class="open ? 'pi-chevron-down' : 'pi-chevron-right'"
                />
                <div class="min-w-0">
                    <slot name="header">
                        <p class="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">
                            {{ title }}
                            <span
                                v-if="count !== undefined && count !== null"
                                class="text-surface-400 font-normal"
                                >({{ count }})</span
                            >
                        </p>
                    </slot>
                    <slot name="sub">
                        <p v-if="sub" class="text-xs text-surface-400 truncate">{{ sub }}</p>
                    </slot>
                </div>
            </div>
            <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0" @click.stop>
                <slot name="actions" />
            </div>
        </div>
        <div v-show="!collapsible || open" :class="padded ? 'p-5' : ''">
            <slot />
        </div>
    </div>
</template>
