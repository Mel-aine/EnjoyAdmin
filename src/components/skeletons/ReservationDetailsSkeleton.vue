<template>
  <div class="h-full animate-pulse">
    <!-- Header Skeleton -->
    <div class="shadow-sm px-4 py-2 mx-4 bg-white dark:bg-gray-800 flex justify-between">
      <div class="flex gap-2 align-middle self-center items-center">
        <!-- Back arrow skeleton -->
        <div class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <!-- Building icon skeleton -->
        <div class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <!-- Guest name skeleton -->
        <div class="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <!-- Adults skeleton -->
        <div class="flex gap-1">
          <div class="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <!-- Children skeleton -->
        <div class="flex gap-1">
          <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      
      <div class="flex gap-8">
        <!-- Arrival skeleton -->
        <div class="flex flex-col">
          <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div class="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <!-- Departure skeleton -->
        <div class="flex flex-col">
          <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div class="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <!-- Nights skeleton -->
        <div class="flex flex-col">
          <div class="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div class="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <!-- Room/Rate types skeleton -->
        <div class="flex flex-col">
          <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div class="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <!-- Reservation number skeleton -->
        <div class="flex flex-col">
          <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div class="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      
      <div class="flex gap-x-2">
        <!-- Status skeleton -->
        <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-700"></div>
        <!-- Action button skeleton -->
        <div class="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    <!-- Tabs Navigation Skeleton -->
    <div class="shadow-sm px-2 pt-1 mx-4 bg-white dark:bg-gray-800 mt-5 flex justify-between">
      <div class="flex justify-between w-full">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <!-- Tab skeletons -->
            <div v-for="i in 5" :key="i" class="py-4 px-2">
              <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </nav>
        </div>
        <div class="align-middle self-center items-center">
          <!-- Options dropdown skeleton -->
          <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-700"></div>
        </div>
      </div>
    </div>

    <!-- Tab Content Skeleton -->
    <div class="mx-4 mt-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
      <!-- Content area skeleton -->
      <div class="space-y-6">
        <!-- Section header -->
        <div class="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        
        <!-- Content rows -->
        <div class="space-y-4">
          <div v-for="i in 8" :key="i" class="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div class="space-y-1">
                <div class="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <!-- Action buttons skeleton -->
        <div class="flex gap-3 pt-4">
          <div class="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="w-28 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        <!-- Additional content sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="space-y-4">
            <div class="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="space-y-2">
              <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="w-28 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="space-y-2">
              <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Table skeleton -->
        <div class="mt-8">
          <div class="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <!-- Table header -->
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex space-x-4">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <!-- Table rows -->
            <div v-for="i in 5" :key="i" class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div class="flex space-x-4">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
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