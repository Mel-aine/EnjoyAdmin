<template>
    <div class="flex items-center justify-center h-full">
        <div class="relative flex items-center w-full">
            <!-- Left green chevron -->
            <div
                class="chevron-left py-5 bg-gray-300 text-black flex items-center justify-center w-8/12 h-full relative z-10">
                <slot name="left"></slot>
            </div>
            <!-- Right blue rectangle -->
            <div class=" bg-gray-100 py-5 text-blak flex items-center justify-center h-full w-8/12 ml-[-40px] ">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// No logic needed
</script>

<style scoped>
.chevron-left {
    clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 0 0);
    border-right: none;
}
</style>
