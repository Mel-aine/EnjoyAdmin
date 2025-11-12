<template>
  <AdminLayout>
    <div class="p-6 pt-0">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md">
          <h1 class="font-bold text-gray-900 dark:text-white p-3 text-md">
            {{ $t('frontOffice.dashboard.title') }}
          </h1>
          <div class="mr-3 flex items-center">
            <button @click="loadDashboardData"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
            </button>
          </div>
        </div>
      </div>

      <!-- Main Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 mb-8 shadow-md">
        <!-- Arrival Card -->
        <div class="border-e-2 bg-white dark:bg-gray-800 p-6">
          <DashboardCircle :title="$t('frontOffice.dashboard.arrival')" :isLoading="isLoading" :data="{
            pending: dashboardData?.arrival?.pending || 0,
            arrived: dashboardData?.arrival?.arrived || 0,
          }" :colors="['#3b82f6', '#10b981']" />
        </div>

        <!-- Checked Out Card -->
        <div class="border-e-2 bg-white dark:bg-gray-800 ">
          <DashboardCircle :title="$t('frontOffice.dashboard.checkedOut')" :isLoading="isLoading" :data="{
            pending: dashboardData?.departure?.pending || 0,
            checkedOut: dashboardData?.departure?.checkedOut || 0,
          }" :colors="['#f59e0b', '#10b981']" />
        </div>
        <!-- Guest In House Card -->
        <div class="border-e-2 bg-white dark:bg-gray-800 ">
          <DashboardCircle :title="$t('frontOffice.dashboard.guestInHouse')" :isLoading="isLoading" :data="{
            adult: dashboardData?.guestInHouse?.adult || 0,
            child: dashboardData?.guestInHouse?.child || 0,
          }" :colors="['#3b82f6', '#10b981']" />
        </div>
        <!-- Room Status Card -->
        <div class="border-e-2 bg-white dark:bg-gray-800  ">
          <DashboardCircle :title="$t('frontOffice.dashboard.roomStatus')" :isLoading="isLoading" :data="{
            available: dashboardData?.roomStatus?.availableRooms || 0,
            sold: dashboardData?.roomStatus?.sold || 0,
            dayUse: dashboardData?.roomStatus?.dayUse || 0,
            complimentary: dashboardData?.roomStatus?.complimentary || 0,
            blocked: dashboardData?.roomStatus?.blockedForDate || 0,
          }" :colors="['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#6b7280']" />
        </div>
        <!-- Housekeeping Status Card -->

        <div class="lg:col-span-1 bg-white dark:bg-gray-800 ">
          <div class="bg-white dark:bg-gray-800 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 justify-center">
              {{ $t('frontOffice.dashboard.housekeepingStatus') }}
            </h3>
            <div class="flex items-center justify-center h-24">
              <!-- Loading Spinner for Bar Chart -->
              <div v-if="isLoading" class="flex items-center justify-center h-full">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
              <!-- Bar Chart for Housekeeping Status - Corrigé -->
              <div v-else class="flex items-end justify-center space-x-4 h-24 w-full">
                <div v-for="stat in housekeepingStatsArray" :key="stat.key" class="flex flex-col items-center">
                  <div class="rounded-t border-b-2 transition-all duration-300" :class="stat.color" :style="{
                    height: `${Math.max((stat.value / maxHousekeepingValue) * 50, 5)}px`,
                    width: '20px'
                  }"></div>
                  <span class="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {{ $t(`frontOffice.dashboard.${stat.key}`) }}
                  </span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ stat.value }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

     <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 ">
          <!-- folio unpaid Panel -->

          <div class="bg-white dark:bg-gray-800 p-6 shadow-md">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                <div class="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg mr-3">
                  <DollarSign class="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                {{ $t('frontOffice.dashboard.folioUnpaidList') }}
                <span class="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                  ({{ UnsettledFolios.length || 0 }})
                </span>
              </h3>
            </div>

            <!-- List -->
            <div v-if="isLoading" class="flex items-center justify-center py-8 ">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
            <div v-else-if="UnsettledFolios.length > 0" class="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
              <div v-for="folio in UnsettledFolios" :key="folio.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-red-900/10 rounded-xl border border-gray-200/60 dark:border-red-800/30 hover:shadow-md transition-all duration-200">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      <span class="text-xs text-gray-500 dark:text-gray-400 mr-1">#{{ folio.folioNumber }}</span>
                      {{ folio.guestName }}
                    </p>
                    <span class="text-lg font-bold text-red-600 dark:text-red-400">
                      {{ formatCurrency(folio.balance) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-10">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle class="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {{ $t('unsettledFolios.noFoliosFound') }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ $t('unsettledFolios.allPaid') }}
              </p>
            </div>
          </div>

          <!-- roomtype -->
          <div class="bg-white dark:bg-gray-800 p-6 shadow-md">
            <div class="relative">
              <!-- Header with Controls -->
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                  <div class="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mr-3">
                    <Star class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  {{ $t('occupancy') }}
                  <span class="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                    ({{ Object.keys(dashboardData?.suites || {}).length }})
                  </span>
                </h3>
              </div>

              <!-- List View -->
              <div class="space-y-3">
                <!-- Loader -->
                <div v-if="isLoading" class="flex items-center justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>

                <!-- Suites data -->
                <div v-else-if="dashboardData?.suites?.length">
                  <ul class="text-sm space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                    <li v-for="suite in dashboardData.suites" :key="suite.roomTypeId"
                      class="flex justify-between gap- border-b py-1">
                      <span class="font-medium w-6/12">{{ suite.roomTypeName }}</span>
                      <span class="text-gray-600  gap-3 w-6/12 grid grid-cols-3 dark:text-gray-400 font-normal">
                        <span>{{ $t('occupied') }}: {{ suite.occupied }}</span>
                        <span>{{ $t('available') }}: {{ suite.free }}</span>
                        <span class="">
                          {{ $t('reports.frontOffice.occupancyRate') }}:
                          <span :class="{
                            'text-green-600 font-semibold': parseFloat(suite.occupancyRate) < 50,
                            'text-yellow-600 font-semibold':
                              parseFloat(suite.occupancyRate) >= 50 &&
                              parseFloat(suite.occupancyRate) < 80,
                            'text-red-600 font-semibold': parseFloat(suite.occupancyRate) >= 80,
                          }">
                            {{ suite.occupancyRate }}
                          </span>
                        </span>

                      </span>
                    </li>
                  </ul>
                </div>

                <!-- Empty state -->
                <div v-else class="text-center py-10">
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {{ $t('no_roomtype_found') }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ $t('all_rooms_vacant') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- Activity Feeds -->
          <div class="bg-white dark:bg-gray-800 p-6 shadow-md">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mr-3">
                  <Clock class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                {{ $t('frontOffice.dashboard.activityFeeds') }}
              </h3>

              <div class="flex space-x-2">
                <button @click="loadDashboardData"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                </button>
              </div>
            </div>
            <div class="space-y-3">
              <!-- Loading state -->
              <div v-if="isLoading" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>

              <!-- Activities List -->
              <div v-else-if="dashboardData?.activityFeeds?.length > 0"
                class="space-y-4 h-80 overflow-y-auto scrollbar-hide">
                <div v-for="activity in dashboardData.activityFeeds" :key="activity.id"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm text-gray-900 dark:text-white wrap-anywhere">{{ localizeActivityDescription(activity.description) }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ activity.timestamp }}</p>
                    </div>
                  </div>

                  <span :class="getActivityTypeClass(activity.type)"
                    class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {{ $t(`frontOffice.dashboard.activityTypes.${activity.type}`) }}
                  </span>
                </div>
              </div>
              <!-- Empty state -->
              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Clock class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {{ $t('no_recente_activity') }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ $t('new_activities') }}
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import DashboardCircle from '@/components/frontOffice/DashboardCircle.vue'
import {
  RefreshCw,
  User,
  FileText,
  Calendar,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Home,
  Star,
  Wrench,
  ChevronDown,
  DollarSign,
} from 'lucide-vue-next'
import { getFrontOfficeDashboard } from '@/services/dashboard'
import { useServiceStore } from '@/composables/serviceStore'
import { formatCurrency } from '@/components/utilities/UtilitiesFunction'

const { t } = useI18n()
// Localisation des descriptions d'activités renvoyées par l'API (en anglais)
const activityDescriptionMap: Record<string, string> = {
  'receipt created for payment transaction': 'frontOffice.dashboard.activityDescriptions.receiptCreatedForPayment',
}

function localizeActivityDescription(description?: string): string {
  if (!description) return ''
  const key = activityDescriptionMap[description.toLowerCase().trim()]
  return key ? t(key) : description
}
const serviceStore = useServiceStore()

// Reactive data
const isLoading = ref(true)
const dashboardData = ref<any>(null)
const selectedRange = ref('today')
const customDate = ref(new Date().toISOString().split('T')[0])
const lastUpdate = ref<Date | null>(null)
const UnsettledFolios = ref<any[]>([])

// Computed properties

const housekeepingStats = computed(() => {
  if (!dashboardData.value?.housekeepingStatus) {
    return { clean: 0, inspected: 0, dirty: 0, blocked: 0 }
  }

  return {
    clean: dashboardData.value.housekeepingStatus.clean || 0,
    inspected: dashboardData.value.housekeepingStatus.inspected || 0,
    dirty: dashboardData.value.housekeepingStatus.dirty || 0,
    blocked: dashboardData.value.housekeepingStatus?.blocked || 0,
  }
})
const getStartOfWeek = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  return new Date(d.setDate(diff))
}

const dateRange = computed(() => {
  const today = new Date()
  let startDate = new Date()
  let endDate = new Date()

  switch (selectedRange.value) {
    case 'today':
      startDate = today
      endDate = today
      break
    case 'yesterday':
      startDate.setDate(today.getDate() - 1)
      endDate.setDate(today.getDate() - 1)
      break
    case 'thisWeek':
      startDate = getStartOfWeek(today)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      break
    case 'lastWeek':
      const lastWeekStartDate = new Date()
      lastWeekStartDate.setDate(today.getDate() - 7)
      startDate = getStartOfWeek(lastWeekStartDate)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      break
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
    case 'lastMonth':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    case 'custom':
      startDate = new Date(customDate.value)
      endDate = new Date(customDate.value)
      break
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
})



const notificationItems = computed(() => {
  const notifications = dashboardData.value?.notifications || {}
  return [
    {
      key: 'workOrder',
      icon: FileText,
      count: notifications.workOrder || 0,
      label: 'frontOffice.dashboard.workOrders',
    },
    {
      key: 'bookingInquiry',
      icon: Calendar,
      count: notifications.bookingInquiry || 0,
      label: 'frontOffice.dashboard.bookingInquiries',
    },
    {
      key: 'paymentFailed',
      icon: AlertTriangle,
      count: notifications.paymentFailed || 0,
      label: 'frontOffice.dashboard.paymentFailed',
    },
    {
      key: 'overbooking',
      icon: AlertTriangle,
      count: notifications.overbooking || 0,
      label: 'frontOffice.dashboard.overbooking',
    },
    {
      key: 'guestMessage',
      icon: MessageSquare,
      count: notifications.guestMessage || 0,
      label: 'frontOffice.dashboard.guestMessages',
    },
    {
      key: 'unpaidFolios',
      icon: FileText,
      count: notifications.unpaidFolios || 0,
      label: 'frontOffice.dashboard.unpaidFolios',
    },
    {
      key: 'tasks',
      icon: CheckCircle,
      count: notifications.tasks || 0,
      label: 'frontOffice.dashboard.tasks',
    },
    {
      key: 'review',
      icon: Star,
      count: notifications.review || 0,
      label: 'frontOffice.dashboard.reviews',
    },
  ]
})

const loadDashboardData = async () => {
  try {
    isLoading.value = true
    const hotelId = serviceStore.serviceId
    if (!hotelId) {
      console.warn('Aucun hotelId trouvé')
      return
    }

    const params = {
      range: selectedRange.value,
      date: selectedRange.value === 'custom' ? customDate.value : undefined,
      startDate: dateRange.value.startDate,
      endDate: dateRange.value.endDate,
    }

    console.log('Loading dashboard with params:', params)
    console.log('Selected range:', selectedRange.value)
    console.log('Date range computed:', dateRange.value)

    const response = await getFrontOfficeDashboard(hotelId, params)
    console.log('Dashboard response:', response)

    if (response.success) {
      dashboardData.value = response.data
      UnsettledFolios.value = dashboardData.value.unpaidFoliosData?.unpaidFolios?.foliosList || []
      console.log('UnsettledFolios:', UnsettledFolios.value)
    } else {
      console.error('Erreur:', response.message)
      dashboardData.value = null
    }
    lastUpdate.value = new Date()
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error)
    dashboardData.value = null
  } finally {
    isLoading.value = false
  }
}

// Enhanced styling methods

const getActivityTypeClass = (type: string) => {
  const classes: any = {
    arrival:
      'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700',
    departure:
      'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-700',
    booking:
      'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700',
    modification:
      'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700',
    cancellation:
      'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700',
    payment:
      'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700',
    maintenance:
      'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/40 dark:to-gray-900/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
    housekeeping:
      'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700',
    communication:
      'bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 text-pink-800 dark:text-pink-200 border border-pink-200 dark:border-pink-700',
    system:
      'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/40 dark:to-gray-900/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
  }
  return classes[type] || classes['system']
}

const housekeepingStatsArray = computed(() => [
  { key: 'clean', value: housekeepingStats.value.clean, color: 'bg-green-500' },
  { key: 'inspected', value: housekeepingStats.value.inspected, color: 'bg-yellow-500' },
  { key: 'dirty', value: housekeepingStats.value.dirty, color: 'bg-orange-500' },
  { key: 'blocked', value: housekeepingStats.value.blocked, color: 'bg-gray-500' },
])

// Max pour calcul proportionnelle
const maxHousekeepingValue = computed(() =>
  Math.max(...Object.values(housekeepingStats.value).map(v => Number(v)), 1)
)


// Lifecycle
onMounted(() => {
  loadDashboardData()
})

// Watch for date changes to trigger data reload
watch(
  [selectedRange, customDate],
  () => {
    console.log('Date filters changed:', {
      selectedRange: selectedRange.value,
      customDate: customDate.value,
    })
    loadDashboardData()
  },
  { deep: true },
)
</script>

<style scoped>
.hover\:scale-102:hover {
  transform: scale(1.02);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slideInUp 0.3s ease-out;
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.shadow-blue-500\/25 {
  box-shadow:
    0 10px 15px -3px rgba(59, 130, 246, 0.25),
    0 4px 6px -2px rgba(59, 130, 246, 0.1);
}

.shadow-blue-500\/40 {
  box-shadow:
    0 10px 15px -3px rgba(59, 130, 246, 0.4),
    0 4px 6px -2px rgba(59, 130, 246, 0.2);
}

.shadow-red-500\/25 {
  box-shadow:
    0 10px 15px -3px rgba(239, 68, 68, 0.25),
    0 4px 6px -2px rgba(239, 68, 68, 0.1);
}

.shadow-red-500\/10 {
  box-shadow:
    0 10px 15px -3px rgba(239, 68, 68, 0.1),
    0 4px 6px -2px rgba(239, 68, 68, 0.05);
}

/* Scrollbar invisible pour tous les navigateurs */
.scrollbar-hide {
  /* Firefox */
  scrollbar-width: none;
  /* Safari et Chrome */
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
