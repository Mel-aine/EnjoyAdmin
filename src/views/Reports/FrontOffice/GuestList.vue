<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.guestList') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.guestListDescription') }}
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
              {{ $t('common.dateRange') }}
            </label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.endDate') }}
            </label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.status') }}
            </label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="checked-in">{{ $t('bookings.status.checked-in') }}</option>
              <option value="checked-out">{{ $t('bookings.status.checked-out') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadGuestList"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {{ $t('common.generateReport') }}
          </button>
        </div>
      </div>

      <!-- Results -->
      <ReusableTable
        :title="$t('reports.frontOffice.guestList')"
        :columns="tableColumns"
        :data="filteredGuests"
        :actions="tableActions"
        :searchable="true"
        :loading="loading"
        :empty-message="$t('reports.noDataAvailable')"
      />
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/common/ReusableTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

interface Guest {
  id: string
  guestName: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  status: string
}

const filters = ref({
  startDate: '',
  endDate: '',
  status: ''
})

const guests = ref<Guest[]>([])
const loading = ref(false)

const filteredGuests = computed(() => {
  return guests.value.filter(guest => {
    if (filters.value.status && guest.status !== filters.value.status) {
      return false
    }
    return true
  })
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'checked-in':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'checked-out':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  }
}

const loadGuestList = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    guests.value = [
      {
        id: '1',
        guestName: 'John Doe',
        roomNumber: '101',
        checkInDate: '2024-01-15',
        checkOutDate: '2024-01-18',
        status: 'checked-in'
      },
      {
        id: '2',
        guestName: 'Jane Smith',
        roomNumber: '102',
        checkInDate: '2024-01-14',
        checkOutDate: '2024-01-17',
        status: 'checked-out'
      }
    ]
  } catch (error) {
    console.error('Error loading guest list:', error)
  } finally {
    loading.value = false
  }
}

const viewDetails = (guestId: string) => {
  router.push(`/customer_detail/${guestId}`)
}

// Table configuration
const tableColumns = computed(() => [
  { key: 'guestName', label: t('common.guestName'), type: 'text' },
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { key: 'checkInDate', label: t('common.checkInDate'), type: 'date' },
  { key: 'checkOutDate', label: t('common.checkOutDate'), type: 'date' },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'checked-in': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'checked-out': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  }
])

const tableActions = computed(() => [
  {
    label: t('common.view'),
    handler: (item: Guest) => viewDetails(item.id),
    variant: 'primary'
  }
])

onMounted(() => {
  loadGuestList()
})
</script>