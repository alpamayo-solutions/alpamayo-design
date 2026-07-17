<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AlpFlagIcon from './AlpFlagIcon.vue';

// Presentational: locale data and the active locale come in as props, and
// selection is reported via `update:modelValue`. Persisting the choice and
// actually switching vue-i18n's locale are the consumer's responsibility.
const props = defineProps<{
    locales: { code: string; name: string }[];
    modelValue: string;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', code: string): void }>();

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const activeOption = computed(
    () => props.locales.find((l) => l.code === props.modelValue) ?? props.locales[0]
);

function select(code: string) {
    open.value = false;
    if (code === props.modelValue) return;
    emit('update:modelValue', code);
}

onMounted(() => {
    document.addEventListener('click', (e) => {
        if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
            open.value = false;
        }
    });
});
</script>

<template>
    <div ref="rootRef" class="relative">
        <VoltButton
            type="button"
            severity="ghost"
            text
            class="!gap-2 !p-2"
            :aria-label="activeOption?.name"
            v-tooltip.bottom="activeOption?.name"
            @click="open = !open"
        >
            <AlpFlagIcon :code="activeOption?.code ?? 'en'" class="w-6 h-4" />
            <span class="font-mono text-xs font-semibold uppercase">{{ activeOption?.code }}</span>
        </VoltButton>

        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="open"
                class="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 py-1 z-50 flex flex-col"
            >
                <VoltButton
                    v-for="opt in locales"
                    :key="opt.code"
                    type="button"
                    severity="ghost"
                    text
                    fluid
                    :class="[
                        '!w-full !justify-start !gap-2.5 !rounded-none !px-3 !py-2 !text-sm',
                        opt.code === modelValue
                            ? '!bg-primary-50 dark:!bg-primary-900/40 !text-primary-700 dark:!text-primary-300 !font-semibold'
                            : '!text-surface-700 dark:!text-surface-200 hover:!bg-surface-50 dark:hover:!bg-surface-700'
                    ]"
                    :aria-label="opt.name"
                    @click="select(opt.code)"
                >
                    <AlpFlagIcon :code="opt.code" class="w-6 h-4 flex-shrink-0" />
                    <span class="font-mono text-xs font-semibold uppercase">{{ opt.code }}</span>
                </VoltButton>
            </div>
        </Transition>
    </div>
</template>
