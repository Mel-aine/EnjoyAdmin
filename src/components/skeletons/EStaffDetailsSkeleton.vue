<template>
  <div class="animate-pulse">


    <!-- Main Content Area -->
    <div class="p-6 space-y-6">
      <!-- Profile Card Skeleton -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-start space-x-6">
          <!-- Avatar Skeleton -->
          <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          
          <!-- Profile Info Skeleton -->
          <div class="flex-1 space-y-4">
            <div class="space-y-2">
              <div class="w-48 h-7 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            
            <!-- Status and Role Skeleton -->
            <div class="flex items-center space-x-4">
              <div class="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div class="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div class="w-28 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            
            <!-- Department and Contact Info -->
            <div class="space-y-2">
              <div class="w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-36 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-44 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          
          <!-- Action Buttons Skeleton -->
          <div class="flex space-x-2">
            <div class="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs Skeleton -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <div v-for="i in 4" :key="i" class="py-4">
              <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </nav>
        </div>
        
        <!-- Tab Content Skeleton -->
        <div class="p-6 space-y-6">
          <!-- Form Sections -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div class="space-y-2">
                <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-4">
              <div class="space-y-2">
                <div class="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          
          <!-- Additional Form Elements -->
          <div class="space-y-4">
            <div class="w-36 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payroll Section Skeleton -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="w-28 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <!-- Payroll Table Skeleton -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <!-- Table Header -->
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex space-x-4">
              <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          
          <!-- Table Rows -->
          <div v-for="i in 5" :key="i" class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div class="flex space-x-4">
              <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contract History Section Skeleton -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <!-- Contract Cards Skeleton -->
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <div class="space-y-2">
                <div class="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="flex space-x-2">
                <div class="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this skeleton
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>