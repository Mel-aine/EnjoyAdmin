<template>
  <div class="min-h-[95vh] bg-gray-50">
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