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
                class="border border-gray-300 rounded px-3 py-1.5 pr-8 w-64 text-sm  block leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                v-model="searchQuery"
              />
              <SearchIcon
                :size="16"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <!-- Action buttons -->
            <button class="flex items-center space-x-1 border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-purple-500 hover:text-purple-500 ">
              <ListIcon :size="16" />
              <span class="text-sm">Views</span>
            </button>
            <button class="flex items-center space-x-1 border border-gray-300 rounded px-3 py-1.5 bg-white hover:bg-orange-500 hover:text-white">
              <FileTextIcon :size="16" />
              <span class="text-sm">Audit Trail</span>
            </button>
          </div>
        </div>

        <!-- Room type filters -->
        <!-- <div class="flex items-center mb-4 space-x-5">


          <div v-if="selectedRoomsCount" >
            <span class="text-sm">{{ selectedRoomsCount }} Records Selected</span>
          </div>

          <div v-if="selectedRoomsCount > 0" class="flex items-center space-x-2">
            <div class="w-50">
              <Select :placeholder="'select operation'" :options="Operations"/>

            </div>

            <div class="relative">
              <button
                class="bg-purple-500 text-white rounded px-4 py-2.5 text-sm w-24"
                @click="applyBulkAction"
              >
                Apply
              </button>
            </div>
          </div>
        </div> -->

       <!-- Room Status Table -->
        <RoomStatusTable @selection-change="handleSelectionChange" />
      </div>
  </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search as SearchIcon, List as ListIcon, FileText as FileTextIcon, ChevronDown as ChevronDownIcon } from 'lucide-vue-next'
import RoomStatusTable from './RoomStatusTable.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Select from '@/components/forms/FormElements/Select.vue';

// Reactive data
const selectedRoomsCount = ref<number>(0)
const searchQuery = ref<string>('')
const selectedStatus = ref<string>('')
const Operations = ref([])

// Handle selection changes from the table
const handleSelectionChange = (count: number) => {
  selectedRoomsCount.value = count
}

// Handle bulk action apply
const applyBulkAction = () => {
  if (selectedStatus.value && selectedRoomsCount.value > 0) {
    // Emit event or call API to apply bulk status change
    console.log(`Applying ${selectedStatus.value} to ${selectedRoomsCount.value} rooms`)
    // Reset after applying
    selectedStatus.value = ''
  }
}
</script>
