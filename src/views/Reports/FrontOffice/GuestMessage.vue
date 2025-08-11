<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.guestMessage') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.guestMessageDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.messageType') }}
            </label>
            <select
              v-model="filters.messageType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="request">{{ $t('messages.types.request') }}</option>
              <option value="complaint">{{ $t('messages.types.complaint') }}</option>
              <option value="compliment">{{ $t('messages.types.compliment') }}</option>
              <option value="inquiry">{{ $t('messages.types.inquiry') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadGuestMessages"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {{ $t('common.generateReport') }}
          </button>
        </div>
      </div>

      <!-- Results -->
      <ReusableTable
        :title="`${$t('reports.frontOffice.guestMessage')} (${filteredMessages.length})`"
        :columns="tableColumns"
        :data="filteredMessages"
        :actions="tableActions"
        :searchable="true"
        :search-placeholder="$t('common.searchMessages')"
        :selectable="false"
        :loading="loading"
        :empty-state-title="$t('common.noDataFound')"
        :empty-state-message="$t('reports.noMessagesFound')"
      >
        <template #column-content="{ item }">
          <span class="text-sm text-gray-900 dark:text-white max-w-xs truncate block" :title="item.content">
            {{ item.content }}
          </span>
        </template>
      </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Column } from '../../../utils/models'

const { t } = useI18n()

interface GuestMessage {
  id: string
  date: string
  guestName: string
  roomNumber: string
  type: string
  content: string
  status: string
}

const filters = ref({
  dateFrom: '',
  dateTo: '',
  messageType: ''
})

const messages = ref<GuestMessage[]>([])
const loading = ref(false)

const filteredMessages = computed(() => {
  return messages.value.filter(message => {
    if (filters.value.messageType && message.type !== filters.value.messageType) {
      return false
    }
    return true
  })
})

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { key: 'date', label: t('common.date'), type: 'date' },
  { key: 'guestName', label: t('common.guestName'), type: 'text' },
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { 
    key: 'type', 
    label: t('common.messageType'), 
    type: 'badge',
    translatable: true,
 /*  badgeColors: {
      'request': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      'complaint': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      'compliment': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'inquiry': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    }*/
  },
  { key: 'content', label: t('common.message'), type: 'custom' },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    }
  }
])

const tableActions = computed(() => [
  {
    label: t('common.view'),
    handler: (item: GuestMessage) => viewMessage(item.id),
    variant: 'primary'
  },
  {
    label: t('common.resolve'),
    handler: (item: GuestMessage) => markAsResolved(item.id),
    variant: 'success',
    condition: (item: GuestMessage) => item.status === 'pending'
  }
])

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'request':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    case 'complaint':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    case 'compliment':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'inquiry':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'resolved':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const loadGuestMessages = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    messages.value = [
      {
        id: '1',
        date: '2024-01-15',
        guestName: 'John Doe',
        roomNumber: '101',
        type: 'request',
        content: 'Extra towels needed in room 101',
        status: 'pending'
      },
      {
        id: '2',
        date: '2024-01-14',
        guestName: 'Jane Smith',
        roomNumber: '102',
        type: 'complaint',
        content: 'Air conditioning not working properly',
        status: 'resolved'
      }
    ]
  } catch (error) {
    console.error('Error loading guest messages:', error)
  } finally {
    loading.value = false
  }
}

const viewMessage = (messageId: string) => {
  // Implement view message details
  console.log('View message:', messageId)
}

const markAsResolved = (messageId: string) => {
  const message = messages.value.find(m => m.id === messageId)
  if (message) {
    message.status = 'resolved'
  }
}

onMounted(() => {
  loadGuestMessages()
})
</script>