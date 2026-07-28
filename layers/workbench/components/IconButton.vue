<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        icon?: string;
        active?: boolean;
        disabled?: boolean;
    }>(),
    {
        icon: undefined,
        active: false,
        disabled: false
    }
);

defineEmits<{
    click: [event: MouseEvent];
}>();
</script>

<template>
    <VoltButton
        text
        rounded
        :icon="icon"
        :disabled="disabled"
        :aria-label="label"
        :title="label"
        class="alp-workbench-icon-button"
        :class="{ 'alp-workbench-icon-button--active': active }"
        @click="$emit('click', $event)"
    >
        <slot />
    </VoltButton>
</template>
