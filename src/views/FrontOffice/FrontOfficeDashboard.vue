<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="bg-white shadow-md font-bold text-gray-900 dark:text-white mb-2 p-3 text-md">
          {{ $t('frontOffice.dashboard.title') }}
        </h1>
      </div>

      <!-- Main Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-0 mb-8">
        <!-- Arrival Card -->
        <div class="bg-white dark:bg-gray-800  p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('frontOffice.dashboard.arrival') }}
            </h3>
          </div>
          <div class="flex items-center justify-center mb-4">
            <div class="relative w-24 h-24">
              <!-- Circular Progress for Arrival -->
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  stroke-width="8"
                  fill="none"
                  :stroke-dasharray="`${(arrivalStats.pending / arrivalStats.total) * 251.2} 251.2`"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ arrivalStats.total }}
                </span>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.pending') }} ({{ arrivalStats.pending }})
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.arrived') }} ({{ arrivalStats.arrived }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Checked Out Card -->
        <div class="bg-white dark:bg-gray-800  p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('frontOffice.dashboard.checkedOut') }}
            </h3>
          </div>
          <div class="flex items-center justify-center mb-4">
            <div class="relative w-24 h-24">
              <!-- Circular Progress for Checked Out -->
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f59e0b"
                  stroke-width="8"
                  fill="none"
                  :stroke-dasharray="`${(checkedOutStats.pending / checkedOutStats.total) * 251.2} 251.2`"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ checkedOutStats.total }}
                </span>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.pending') }} ({{ checkedOutStats.pending }})
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.checkedOut') }} ({{ checkedOutStats.checkedOut }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Guest In House Card -->
        <div class="bg-white dark:bg-gray-800  p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('frontOffice.dashboard.guestInHouse') }}
            </h3>
          </div>
          <div class="flex items-center justify-center mb-4">
            <div class="relative w-24 h-24">
              <!-- Circular Progress for Guest In House -->
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  stroke-width="8"
                  fill="none"
                  :stroke-dasharray="`${(guestInHouseStats.adult / guestInHouseStats.total) * 251.2} 251.2`"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ guestInHouseStats.total }}
                </span>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.adult') }} ({{ guestInHouseStats.adult }})
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.child') }} ({{ guestInHouseStats.child }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Room Status Card -->
        <div class="bg-white dark:bg-gray-800  p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('frontOffice.dashboard.roomStatus') }}
            </h3>
          </div>
          <div class="flex items-center justify-center mb-4">
            <div class="relative w-24 h-24">
              <!-- Circular Progress for Room Status -->
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#ef4444"
                  stroke-width="8"
                  fill="none"
                  :stroke-dasharray="`${(roomStatusStats.vacant / roomStatusStats.total) * 251.2} 251.2`"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ roomStatusStats.total }}
                </span>
              </div>
            </div>
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.vacant') }} ({{ roomStatusStats.vacant }})
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.ooo') }} ({{ roomStatusStats.ooo }})
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.dayUse') }} ({{ roomStatusStats.dayUse }})
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.complimentary') }} ({{ roomStatusStats.complimentary }})
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  {{ $t('frontOffice.dashboard.blocked') }} ({{ roomStatusStats.blocked }})
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800  p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('frontOffice.dashboard.housekeepingStatus') }}
            </h3>
            <div class="flex items-center justify-center h-52">
              <!-- Bar Chart for Housekeeping Status -->
              <div class="flex items-end space-x-4 h-50 overflow-auto">
                <div class="flex flex-col items-center">
                  <div class="bg-green-500 rounded-t" :style="{ height: `${(housekeepingStats.clean / Math.max(...Object.values(housekeepingStats))) * 180}px`, width: '40px' }"></div>
                  <span class="text-xs text-gray-600 dark:text-gray-400 mt-2">{{ $t('frontOffice.dashboard.clean') }}</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ housekeepingStats.clean }}</span>
                </div>
                <div class="flex flex-col items-center">
                  <div class="bg-yellow-500 rounded-t" :style="{ height: `${(housekeepingStats.hkAssign / Math.max(...Object.values(housekeepingStats))) * 180}px`, width: '40px' }"></div>
                  <span class="text-xs text-gray-600 dark:text-gray-400 mt-2">{{ $t('frontOffice.dashboard.hkAssign') }}</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ housekeepingStats.hkAssign }}</span>
                </div>
                <div class="flex flex-col items-center">
                  <div class="bg-orange-500 rounded-t max-h-40" :style="{ height: `${(housekeepingStats.dirty / Math.max(...Object.values(housekeepingStats))) * 180}px`, width: '40px' }"></div>
                  <span class="text-xs text-gray-600 dark:text-gray-400 mt-2">{{ $t('frontOffice.dashboard.dirty') }}</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ housekeepingStats.dirty }}</span>
                </div>
                <div class="flex flex-col items-center">
                  <div class="bg-red-500 rounded-t max-h-40" :style="{ height: `${(housekeepingStats.block / Math.max(...Object.values(housekeepingStats))) * 180}px`, width: '40px' }"></div>
                  <span class="text-xs text-gray-600 dark:text-gray-400 mt-2">{{ $t('frontOffice.dashboard.block') }}</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ housekeepingStats.block }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        

        <!-- Notifications Panel -->
        <div class="bg-white dark:bg-gray-800  p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('frontOffice.dashboard.notifications') }}
          </h3>
          <div class="space-y-4 grid grid-cols-3 gap-4">
            <div v-for="notification in notifications" :key="notification.id" class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex-shrink-0 mr-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <component :is="notification.icon" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.count }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ $t(notification.label) }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Activity Feeds -->
      <div class="bg-white dark:bg-gray-800  p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('frontOffice.dashboard.activityFeeds') }}
          </h3>
          <div class="flex space-x-2">
            <button class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              {{ $t('common.all') }}
            </button>
            <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="activity in activities" :key="activity.id" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0 mr-3">
                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-900 dark:text-white">{{ activity.message }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ activity.time }}</p>
              </div>
            </div>
            <span class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {{ $t(activity.status) }}
            </span>
          </div>
        </div>
      </div>
      </div>

      
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { RefreshCw, User, FileText, Calendar, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-vue-next'

const { t } = useI18n()

// Sample data - replace with actual API calls
const arrivalStats = ref({
  total: 8,
  pending: 1,
  arrived: 7
})

const checkedOutStats = ref({
  total: 3,
  pending: 1,
  checkedOut: 2
})

const guestInHouseStats = ref({
  total: 21,
  adult: 21,
  child: 0
})

const roomStatusStats = ref({
  total: 50,
  vacant: 4,
  ooo: 10,
  dayUse: 0,
  complimentary: 2,
  blocked: 6
})

const housekeepingStats = ref({
  clean: 1,
  hkAssign: 5,
  dirty: 2,
  block: 4
})

const notifications = ref([
  { id: 1, icon: FileText, count: 0, label: 'frontOffice.dashboard.workOrder' },
  { id: 2, icon: Calendar, count: 0, label: 'frontOffice.dashboard.bookingInquiry' },
  { id: 3, icon: AlertTriangle, count: 0, label: 'frontOffice.dashboard.paymentFailed' },
  { id: 4, icon: FileText, count: 0, label: 'frontOffice.dashboard.overbooking' },
  { id: 5, icon: MessageSquare, count: 0, label: 'frontOffice.dashboard.guestPortal' },
  { id: 6, icon: MessageSquare, count: 0, label: 'frontOffice.dashboard.guestMessage' },
  { id: 7, icon: AlertTriangle, count: 0, label: 'frontOffice.dashboard.carvertyFailed' },
  { id: 8, icon: FileText, count: 1, label: 'frontOffice.dashboard.tasks' },
  { id: 9, icon: CheckCircle, count: 0, label: 'frontOffice.dashboard.review' }
])

const activities = ref([
  {
    id: 1,
    message: 'Guest checked out from the room 123, Folio: #213 by user admin',
    time: '2024-01-15 10:30 AM',
    status: 'frontOffice.dashboard.checkedOut'
  }
])

onMounted(() => {
  // Load dashboard data
  loadDashboardData()
})

const loadDashboardData = async () => {
  // Implement API calls to load actual data
  console.log('Loading front office dashboard data...')
}
</script>