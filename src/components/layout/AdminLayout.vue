<template>
  <div class="min-h-full xl:flex">
    <div class="flex-1 flex flex-col transition-all duration-300 ease-in-out"><app-header />

      <!-- <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6"> -->
      <div class="p-4 h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 md:p-6">
        <slot></slot>
      </div>
      <app-footer class="mt-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
const { isExpanded, isHovered } = useSidebar()
</script>
