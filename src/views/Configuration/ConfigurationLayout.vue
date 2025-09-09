<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Configuration Sidebar -->
    <ConfigurationSidebar />
    
    <!-- Backdrop for mobile -->
    <Backdrop />
    
    <!-- Main content -->
    <div :class="[
      'transition-all duration-300 ease-in-out',
      sidebarStore.isExpanded ? 'lg:ml-64' : 'lg:ml-16'
    ]">
      <!-- Header -->
      <AppHeader />
      
      <!-- Page content -->
      <main >
        <slot />
      </main>
      
      <!-- Footer -->
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { useSidebar } from '../../composables/useSidebar'
import ConfigurationSidebar from '../../components/layout/ConfigurationSidebar.vue'
import Backdrop from '../../components/layout/Backdrop.vue'
import AppHeader from '../../components/layout/AppHeader.vue'
import AppFooter from '../../components/layout/AppFooter.vue'

const sidebarStore = useSidebar()
</script>