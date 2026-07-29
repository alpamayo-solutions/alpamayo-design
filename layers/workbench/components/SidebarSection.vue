<script setup lang="ts">
import { computed, useId } from 'vue';

const props = defineProps<{
    /** Header text. Also the accessible name of the section body. */
    title: string;
    expanded: boolean;
    /** Optional stable id, used to build the heading id. Falls back to Vue's useId. */
    sectionId?: string;
}>();

const emit = defineEmits<{ 'update:expanded': [boolean] }>();

const generatedId = useId();
const headingId = computed(() => `alp-workbench-section-${props.sectionId ?? generatedId}`);
</script>

<template>
    <section class="alp-workbench-sidebar-section" :data-expanded="String(props.expanded)">
        <div class="alp-workbench-sidebar-section-heading">
            <button
                type="button"
                class="alp-workbench-sidebar-section-header"
                :aria-expanded="props.expanded"
                @click="emit('update:expanded', !props.expanded)"
            >
                <i
                    :class="props.expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                    aria-hidden="true"
                />
                <span :id="headingId" class="alp-workbench-sidebar-section-title">{{ props.title }}</span>
            </button>
            <slot name="badge" />
            <slot name="actions" />
        </div>
        <div
            v-if="props.expanded"
            class="alp-workbench-sidebar-section-body"
            role="group"
            :aria-labelledby="headingId"
        >
            <slot />
        </div>
    </section>
</template>
