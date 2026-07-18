<script setup lang="ts">
/**
 * Reusable image lightbox with thumbnail grid.
 *
 * Props:
 *   - images: array of { id, url, filename }
 *
 * Renders a thumbnail grid. Clicking a thumbnail opens a fullscreen lightbox
 * with keyboard navigation (arrows, escape).
 */
import { ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

export interface LightboxImage {
    id: string;
    url: string;
    filename: string;
}

const props = defineProps<{
    images: LightboxImage[];
}>();

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const lightboxRef = ref<HTMLElement | null>(null);

watch(lightboxOpen, (open) => {
    if (open) nextTick(() => lightboxRef.value?.focus());
});

function open(image: LightboxImage) {
    const idx = props.images.findIndex((i) => i.id === image.id);
    lightboxIndex.value = Math.max(0, idx);
    lightboxOpen.value = true;
}

function prev() {
    lightboxIndex.value = (lightboxIndex.value - 1 + props.images.length) % props.images.length;
}

function next() {
    lightboxIndex.value = (lightboxIndex.value + 1) % props.images.length;
}

defineExpose({ open });
</script>

<template>
    <div v-if="images.length" class="flex flex-wrap gap-2 mb-3">
        <VoltButton
            v-for="img in images"
            :key="img.id"
            type="button"
            severity="ghost"
            text
            class="group relative !h-20 !w-20 overflow-hidden !rounded-lg !border !border-surface-200 !p-0 transition-all hover:ring-2 hover:ring-primary-400 dark:!border-surface-600"
            @click="open(img)"
        >
            <img :src="img.url" :alt="img.filename" class="w-full h-full object-cover" loading="lazy" />
            <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
            >
                <i
                    class="pi pi-search-plus text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                />
            </div>
        </VoltButton>
    </div>

    <!-- Fullscreen lightbox -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="lightboxOpen"
                ref="lightboxRef"
                data-testid="lightbox-overlay"
                tabindex="0"
                class="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center outline-none"
                @click.self="lightboxOpen = false"
                @keydown.escape="lightboxOpen = false"
                @keydown.left="prev"
                @keydown.right="next"
            >
                <VoltButton
                    v-tooltip.top="t('design.actions.close')"
                    type="button"
                    severity="ghost"
                    text
                    size="large"
                    icon="pi pi-times"
                    :aria-label="t('design.actions.close')"
                    class="absolute top-4 right-4 z-10 !h-10 !w-10 !p-0 !text-white/70 hover:!text-white"
                    @click="lightboxOpen = false"
                />
                <VoltButton
                    v-if="images.length > 1"
                    v-tooltip.top="t('design.actions.previous')"
                    type="button"
                    severity="ghost"
                    text
                    size="large"
                    icon="pi pi-chevron-left"
                    :aria-label="t('design.actions.previous')"
                    class="absolute left-4 z-10 !h-10 !w-10 !p-0 !text-white/70 hover:!text-white"
                    @click="prev"
                />
                <img
                    :src="images[lightboxIndex]?.url"
                    :alt="images[lightboxIndex]?.filename"
                    class="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                />
                <VoltButton
                    v-if="images.length > 1"
                    v-tooltip.top="t('design.actions.next')"
                    type="button"
                    severity="ghost"
                    text
                    size="large"
                    icon="pi pi-chevron-right"
                    :aria-label="t('design.actions.next')"
                    class="absolute right-4 z-10 !h-10 !w-10 !p-0 !text-white/70 hover:!text-white"
                    @click="next"
                />
                <div class="absolute bottom-4 text-white/60 text-sm">
                    <span class="sensitive">{{ images[lightboxIndex]?.filename }}</span>
                    <span v-if="images.length > 1" class="ml-2"
                        >{{ lightboxIndex + 1 }} / {{ images.length }}</span
                    >
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
