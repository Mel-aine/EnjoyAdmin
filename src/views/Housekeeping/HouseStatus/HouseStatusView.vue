<template>
  <AdminLayout>
    <FullScreenLayout>
      <PageBreadcrumb :pageTitle="$t('house_status')"/>
      <div class="flex flex-col p-4 w-full bg-white mt-10 rounded-lg">
        <!-- Header section -->
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-lg font-medium">House Status View</h1>
          <div class="flex items-center space-x-2">
            <!-- Search input -->
            <div class="relative">
              <input
                type="text"
                :placeholder="$t('search...')"
                class="border border-gray-300 rounded px-3 py-1.5 pr-8 w-64 text-sm block leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                v-model="searchQuery"
              />
              <SearchIcon
                :size="16"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <!-- Action buttons -->
            <!-- <button class="flex items-center space-x-1 border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-purple-500 hover:text-purple-500">
              <ListIcon :size="16" />
              <span class="text-sm">Views</span>
            </button> -->
            <button class="flex items-center space-x-1 border border-gray-300 rounded px-3 py-1.5 bg-white hover:bg-orange-500 hover:text-white">
              <FileTextIcon :size="16" />
              <span class="text-sm">Audit Trail</span>
            </button>
          </div>
        </div>

        <!-- Notifications pour les actions bulk -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>

        <!-- Room Status Table -->
        <RoomStatusTable
          :search-query="searchQuery"
          @selection-change="handleSelectionChange"
          @bulk-update-success="handleBulkUpdateSuccess"
          @bulk-update-error="handleBulkUpdateError"
        />
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search as SearchIcon, List as ListIcon, FileText as FileTextIcon } from 'lucide-vue-next'
import RoomStatusTable from './RoomStatusTable.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

// Reactive data
const selectedRoomsCount = ref<number>(0)
const searchQuery = ref<string>('')
const successMessage = ref<string>('')
const errorMessage = ref<string>('')

// Handle selection changes from the table
const handleSelectionChange = (count: number) => {
  selectedRoomsCount.value = count
}

// Handle bulk update success
const handleBulkUpdateSuccess = () => {
  successMessage.value = 'Update completed successfully!'
  errorMessage.value = ''

  // Clear success message after 5 seconds
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

// Handle bulk update error
const handleBulkUpdateError = (error: string) => {
  errorMessage.value = 'Error while updating!'
  successMessage.value = ''

  // Clear error message after 8 seconds
  setTimeout(() => {
    errorMessage.value = ''
  }, 8000)
}
</script>
