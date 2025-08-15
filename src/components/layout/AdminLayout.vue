<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar v-if="isExpanded || isHovered" />
    <Backdrop />
    
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
    ><app-header />
      
      <!-- <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6"> -->
        <div class="p-4 mx-auto  md:p-6 ">
        <slot></slot>
      </div>
      <app-footer/>
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
