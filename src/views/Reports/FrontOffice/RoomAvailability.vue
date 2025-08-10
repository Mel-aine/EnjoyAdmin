<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.frontOffice.roomAvailability') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.frontOffice.roomAvailabilityDescription') }}
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t('common.filters') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            {{ $t('common.roomType') }}
          </label>
          <select
            v-model="filters.roomType"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="standard">{{ $t('rooms.types.standard') }}</option>
            <option value="deluxe">{{ $t('rooms.types.deluxe') }}</option>
            <option value="suite">{{ $t('rooms.types.suite') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.floor') }}
          </label>
          <select
            v-model="filters.floor"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="1">{{ $t('common.floor') }} 1</option>
            <option value="2">{{ $t('common.floor') }} 2</option>
            <option value="3">{{ $t('common.floor') }} 3</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadRoomAvailability"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ $t('common.search') }}
        </button>
        <button
          @click="exportReport"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {{ $t('common.export') }}
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.totalRooms') }}</h3>
        <p class="text-2xl font-bold text-blue-600">{{ summary.totalRooms }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.availableRooms') }}</h3>
        <p class="text-2xl font-bold text-green-600">{{ summary.availableRooms }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.occupiedRooms') }}</h3>
        <p class="text-2xl font-bold text-red-600">{{ summary.occupiedRooms }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.occupancyRate') }}</h3>
        <p class="text-2xl font-bold text-purple-600">{{ summary.occupancyRate }}%</p>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t('reports.frontOffice.availabilityCalendar') }}
      </h2>
      <div class="grid grid-cols-7 gap-2 mb-4">
        <div v-for="day in daysOfWeek" :key="day" class="text-center font-medium text-gray-700 dark:text-gray-300 py-2">
          {{ $t(`common.days.${day}`) }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="date in calendarDates"
          :key="date.date"
          :class="getDateClass(date)"
          class="p-2 text-center rounded cursor-pointer transition-colors"
          @click="selectDate(date)"
        >
          <div class="text-sm font-medium">{{ date.day }}</div>
          <div class="text-xs">{{ date.available }}/{{ date.total }}</div>
        </div>
      </div>
    </div>

    <!-- Room Details Table -->
    <ReusableTable
      :title="$t('reports.frontOffice.roomDetails')"
      :columns="tableColumns"
      :data="rooms"
      :actions="tableActions"
      :searchable="true"
      :empty-message="$t('reports.noRoomsFound')"
    >
      <template #nextAvailable="{ item }">
        <span class="text-sm text-gray-900 dark:text-white">
          {{ item.nextAvailable ? formatDate(item.nextAvailable) : $t('common.today') }}
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
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

interface Room {
  id: string
  roomNumber: string
  roomType: string
  floor: number
  status: string
  currentGuest?: string
  checkOutDate?: string
  nextAvailable?: string
}

interface CalendarDate {
  date: string
  day: number
  available: number
  total: number
  isToday: boolean
  isSelected: boolean
}

const filters = ref({
  dateFrom: new Date().toISOString().split('T')[0],
  dateTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  roomType: '',
  floor: ''
})

const rooms = ref<Room[]>([])
const selectedDate = ref<string | null>(null)
const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const summary = computed(() => {
  const totalRooms = rooms.value.length
  const availableRooms = rooms.value.filter(room => room.status === 'available').length
  const occupiedRooms = rooms.value.filter(room => room.status === 'occupied').length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  
  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    occupancyRate
  }
})

const calendarDates = computed(() => {
  const dates: CalendarDate[] = []
  const startDate = new Date(filters.value.dateFrom)
  const endDate = new Date(filters.value.dateTo)
  const today = new Date().toISOString().split('T')[0]
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    dates.push({
      date: dateStr,
      day: d.getDate(),
      available: Math.floor(Math.random() * 20) + 10, // Mock data
      total: 30, // Mock total rooms
      isToday: dateStr === today,
      isSelected: dateStr === selectedDate.value
    })
  }
  
  return dates
})

const loadRoomAvailability = async () => {
  // Mock data for demonstration
  rooms.value = [
    {
      id: '1',
      roomNumber: '101',
      roomType: 'standard',
      floor: 1,
      status: 'available'
    },
    {
      id: '2',
      roomNumber: '102',
      roomType: 'standard',
      floor: 1,
      status: 'occupied',
      currentGuest: 'John Doe',
      checkOutDate: '2024-01-15',
      nextAvailable: '2024-01-15'
    },
    {
      id: '3',
      roomNumber: '201',
      roomType: 'deluxe',
      floor: 2,
      status: 'maintenance'
    },
    {
      id: '4',
      roomNumber: '301',
      roomType: 'suite',
      floor: 3,
      status: 'available'
    }
  ]
}

const exportReport = () => {
  console.log('Exporting room availability report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getRoomStatusClass = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'occupied':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    case 'cleaning':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const getDateClass = (date: CalendarDate) => {
  let classes = 'hover:bg-gray-100 dark:hover:bg-gray-700'
  
  if (date.isToday) {
    classes += ' bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
  } else if (date.isSelected) {
    classes += ' bg-blue-200 dark:bg-blue-800'
  }
  
  const availabilityRate = date.available / date.total
  if (availabilityRate > 0.7) {
    classes += ' text-green-600 dark:text-green-400'
  } else if (availabilityRate > 0.3) {
    classes += ' text-yellow-600 dark:text-yellow-400'
  } else {
    classes += ' text-red-600 dark:text-red-400'
  }
  
  return classes
}

const selectDate = (date: CalendarDate) => {
  selectedDate.value = date.date
}

const viewRoomDetails = (id: string) => {
  console.log('Viewing room details:', id)
}

const bookRoom = (id: string) => {
  console.log('Booking room:', id)
}

// Table configuration
const tableColumns = computed(() => [
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { key: 'roomType', label: t('common.roomType'), type: 'text', translatable: true },
  { key: 'floor', label: t('common.floor'), type: 'text' },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'available': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'occupied': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      'maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'cleaning': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    }
  },
  { key: 'currentGuest', label: t('common.currentGuest'), type: 'text' },
  { key: 'checkOutDate', label: t('common.checkOutDate'), type: 'date' },
  { key: 'nextAvailable', label: t('common.nextAvailable'), type: 'custom' }
])

const tableActions = computed(() => [
  {
    label: t('common.view'),
    handler: (item: Room) => viewRoomDetails(item.id),
    variant: 'primary'
  },
  {
    label: t('common.book'),
    handler: (item: Room) => bookRoom(item.id),
    variant: 'success',
    condition: (item: Room) => item.status === 'available'
  }
])

onMounted(() => {
  loadRoomAvailability()
})
</script>