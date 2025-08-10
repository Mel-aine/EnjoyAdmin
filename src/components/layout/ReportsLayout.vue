<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Reports Sidebar -->
    <ReportsSidebar />
    
    <!-- Backdrop for mobile -->
    <Backdrop />
    
    <!-- Main content area -->
    <div :class="[
      'transition-all duration-300 ease-in-out',
      {
        'lg:ml-[290px]': isExpanded || isHovered,
        'lg:ml-[90px]': !isExpanded && !isHovered,
      },
    ]">
      <!-- Header -->
      <AppHeader />
      
      <!-- Page content -->
      <main class="pt-16 lg:pt-0">
        <div class="p-6">
          <slot />
        </div>
      </main>
      
      <!-- Footer -->
      <AppFooter />
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