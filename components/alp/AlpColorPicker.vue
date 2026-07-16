<template>
    <div
        class="relative overflow-hidden cursor-pointer shrink-0 shadow-sm ring-1 ring-black/10 dark:ring-white/10"
        :class="size"
        :style="{ background: modelValue }"
    >
        <input
            type="color"
            :value="modelValue"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        modelValue: string;
        size?: string;
    }>(),
    { size: 'w-9 h-9 rounded-lg' }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>
