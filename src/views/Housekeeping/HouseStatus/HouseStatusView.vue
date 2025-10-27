<template>
  <AdminLayout>
      <PageBreadcrumb :pageTitle="$t('house_status')" :breadcrumb="breadcrumb"/>
      <div class="flex flex-col p-4 w-full bg-white dark:bg-gray-800 mt-10 rounded-lg">
        <!-- Header section -->
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-lg font-medium dark:text-gray-100">{{ $t('house_status_view') }}</h1>
          <div class="flex items-center space-x-2">
            <!-- Search input -->
            <div class="relative">
              <input
                type="text"
                :placeholder="$t('search...')"
                class="border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 pr-8 w-64 text-sm block leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                v-model="searchQuery"
              />
              <SearchIcon
                :size="16"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400"
              />
            </div>

            <!-- Action buttons -->
            <!-- <button class="flex items-center space-x-1 border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-purple-500 hover:text-purple-500">
              <ListIcon :size="16" />
              <span class="text-sm">Views</span>
            </button> -->
            <button @click="openAuditTrail" class="flex items-center space-x-1 border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-100 hover:bg-orange-500 dark:hover:bg-orange-600 hover:text-white">
              <FileTextIcon :size="16" />
              <span class="text-sm">{{ $t('audit_trial') }}</span>
            </button>
          </div>
        </div>

        <!-- Room Status Table -->
        <RoomStatusTable
          :search-query="searchQuery"
          @selection-change="handleSelectionChange"
        />
      </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search as SearchIcon, List as ListIcon, FileText as FileTextIcon } from 'lucide-vue-next'
import RoomStatusTable from './RoomStatusTable.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'

// Reactive data
const selectedRoomsCount = ref<number>(0)
const searchQuery = ref<string>('')
const { t } = useI18n()
const breadcrumb = [
  { label: t('navigation.housekeeping'), href: '#' },
  { label: t('house_status'), href: '#' }
]

// Handle selection changes from the table
const handleSelectionChange = (count: number) => {
  selectedRoomsCount.value = count
}

const openAuditTrail = () => {
  router.push({ name: 'AuditTrailEntity', params: { entityType: 'Room', entityId: 'all' } })
}

</script>
