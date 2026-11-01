<script setup lang="ts">
import { computed } from 'vue';
import AlpIcon from '../../../components/alp/AlpIcon.vue';
import { alpIconId } from '../../../composables/alpIcons';

/** A workbench icon string: `alp_*` draws from the icon set, anything else stays an icon class. */
const props = defineProps<{
    icon: string;
    variant?: 'detail' | 'small';
    size?: number | string;
}>();

const id = computed(() => alpIconId(props.icon));
</script>

<template>
    <AlpIcon v-if="id" :name="id" :variant="variant" :size="size" />
    <i v-else :class="icon" aria-hidden="true" />
</template>
