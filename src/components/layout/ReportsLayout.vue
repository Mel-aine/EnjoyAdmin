<template>
  <div class="min-h-full bg-gray-50 dark:bg-gray-900 xl:flex">
    <!-- Reports Sidebar -->
    <ReportsSidebar />
    
    <!-- Backdrop for mobile -->
    <Backdrop />
    
    <!-- Main content area -->
    <div :class="[
      ' flex-1 transition-all duration-300 ease-in-out flex flex-col min-h-full',
      {
        'lg:ml-[290px]': isExpanded || isHovered,
        'lg:ml-[90px]': !isExpanded && !isHovered,
      },
    ]">
      <!-- Header -->
      <AppHeader :show-sidebar="false" />
      
      <!-- Page content -->
        <div class="p-6 h-full">
          <slot />
        </div>
      
      <!-- Footer -->
      <AppFooter class="mt-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import ReportsSidebar from './ReportsSidebar.vue'
import Backdrop from './Backdrop.vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

const { isExpanded } = useSidebar()
const isHovered = ref(false)
</script>