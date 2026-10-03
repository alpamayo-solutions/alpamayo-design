<script setup lang="ts">
import { navigateSidebar } from '../utils/keyboard';
</script>

<template>
    <div class="alp-workbench-sidebar-sections" @keydown="navigateSidebar">
        <slot />
    </div>
</template>
