<template>
  <div class="min-h-[95vh] bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
    <!-- Configuration Sidebar -->
    <ConfigurationSidebar />
    
    <!-- Backdrop for mobile -->
    <Backdrop />
    
    <!-- Main content -->
    <div :class="[
      'transition-all duration-300 ease-in-out',
      sidebarStore.isExpanded ? 'lg:ml-64' : 'lg:ml-16',
      'flex flex-col min-h-[107vh]'
    ]">
      <!-- Header -->
      <ConfigurationHeader />
      
      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
      
      <!-- Footer -->
      <footer class="mt-auto">
        <AppFooter />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { useSidebar } from '../../composables/useSidebar'
import ConfigurationSidebar from '../../components/layout/ConfigurationSidebar.vue'
import Backdrop from '../../components/layout/Backdrop.vue'
import ConfigurationHeader from '../../components/layout/ConfigurationHeader.vue'
import AppFooter from '../../components/layout/AppFooter.vue'

const sidebarStore = useSidebar()
</script>

<style scoped>
/* Dark mode cascade for Configuration pages */
/* Adjust common light classes used inside configuration views when in dark mode */
:deep(.dark .bg-white) { background-color: #1f2937 !important; } /* gray-800 */
:deep(.dark .bg-gray-50) { background-color: #111827 !important; } /* gray-900 */
:deep(.dark .text-gray-900) { color: #e5e7eb !important; } /* gray-200 */
:deep(.dark .text-gray-800) { color: #e5e7eb !important; }
:deep(.dark .text-gray-700) { color: #d1d5db !important; } /* gray-300 */
:deep(.dark .text-gray-600) { color: #9ca3af !important; } /* gray-400 */
:deep(.dark .text-gray-500) { color: #94a3b8 !important; } /* slate-400 */
:deep(.dark .border-gray-200) { border-color: #374151 !important; } /* gray-700 */
</style>