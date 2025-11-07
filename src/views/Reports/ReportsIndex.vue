<template>
<!-- @reference tailwindcss -->
  <ReportsLayout>
    <div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div class="text-center space-y-6 p-8">
        <!-- Icon -->
        <div class="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        
        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Rapports
        </h1>
        
        <!-- Description -->
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Please select a report from the side menu to begin.
        </p>
        
        <!-- Decorative element -->
        <div class="flex justify-center space-x-2 mt-8">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('../../components/layout/ReportsLayout.vue'));


</script>