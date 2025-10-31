<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="py-2">
        <button
          @click="goBack"
          class="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-lg transition-all duration-200 shadow"
        >
          ← {{ $t('Back') }}
        </button>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden" v-if="selectedRoom">
        <!-- Header -->
        <div class="text-white p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="w-16 h-16 bg-blue-100 bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              >
                <BuildingIcon class="w-8 h-8 text-gray-950" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">
                  {{ selectedRoom.name }} {{ selectedRoom.room_number || '' }}
                </h1>
                <p class="text-black font-medium">{{ selectedRoom.roomType }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span
                    class="inline-flex items-center px-3 py-1 bg-blue-50 text-gray-950 bg-opacity-20 rounded-full text-sm font-medium"
                  >
                    <DollarSignIcon class="w-4 h-4 mr-1" />
                    {{ selectedRoom.price?.toLocaleString() || 0 }} XAF
                  </span>
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      getStatusColor(selectedRoom.status),
                    ]"
                  >
                    {{ $t(`statut.${selectedRoom.status}`) }}
                  </span>
                </div>
              </div>
            </div>
            <!-- <div class="flex items-center space-x-3">
          <button
            @click="handleEdit"
            class="inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-20 text-gray-950 rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
          >
            <EditIcon class="w-4 h-4 mr-2" />
            {{ $t('edit') }}
          </button>
          <button
            @click="handleDelete"
            class="inline-flex items-center px-4 py-2 bg-red-500 bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
          >
            <Trash2Icon class="w-4 h-4 mr-2" />
            {{ $t('delete') }}
          </button>
        </div> -->
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <div class="flex items-center space-x-2">
                <component :is="tab.icon" class="w-5 h-5" />
                <span>{{ tab.label }}</span>
              </div>
            </button>
          </nav>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Details Tab -->
          <div
            v-if="activeTab === 'details'"
            class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <!-- Informations de base -->
            <div
              class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
            >
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <InfoIcon class="w-5 h-5 mr-2 text-blue-600" />
                {{ $t('Basic_Information') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('Name')" :value="selectedRoom.name || $t('common.na')" />
                <DetailRow :label="$t('number')" :value="selectedRoom.room_number || $t('common.na')" />
                <DetailRow :label="$t('Rent')" :value="selectedRoom.price || 0" suffix="XAF" />
                <DetailRow :label="$t('RoomTypes')" :value="selectedRoom.roomType || $t('common.na')" />
                <DetailRow
                  :label="$t('Status')"
                  :value="$t(`statut.${selectedRoom.status}`) || $t('common.na')"
                  type="badge"
                />
              </div>
            </div>

            <!-- Spécifications -->
            <div
              class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200"
            >
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <HomeIcon class="w-5 h-5 mr-2 text-green-600" />
                {{ $t('Specifications') }}
              </h3>
              <div class="space-y-1">
                <DetailRow
                  :label="$t('RoomSize(sqm)')"
                  :value="selectedRoom.options?.option_12 || $t('common.na')"
                  suffix="m²"
                />
                <DetailRow
                  :label="$t('NumberofRooms')"
                  :value="selectedRoom.options?.option_13 || $t('common.na')"
                />
                <DetailRow
                  :label="$t('numberBeds')"
                  :value="selectedRoom.options?.option_31 || $t('common.na')"
                />
                <DetailRow
                  :label="$t('numberBathrooms')"
                  :value="selectedRoom.options?.option_32 || $t('common.na')"
                />
                <DetailRow
                  :label="$t('BedType')"
                  :value="$t(`options.values.${selectedRoom.options?.option_2}`) || $t('common.na')"
                />
              </div>
            </div>

            <!-- Équipements -->
            <div
              class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200"
            >
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <StarIcon class="w-5 h-5 mr-2 text-purple-600" />
                {{ $t('Amenities') }}
              </h3>
              <div class="space-y-1">
                <DetailRow
                  :label="$t('AirConditioning')"
                  :value="selectedRoom.options?.option_6 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('Wi-fi')"
                  :value="selectedRoom.options?.option_7 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('TV')"
                  :value="$t(`options.values.${selectedRoom.options?.option_15}`) || $t('common.na')"
                />
                <DetailRow
                  :label="$t('MiniBar')"
                  :value="selectedRoom.options?.option_16 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('SafeDepositBox')"
                  :value="selectedRoom.options?.option_17 || $t('common.no')"
                  type="boolean"
                />
              </div>
            </div>

            <!-- Services -->
            <div
              class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200"
            >
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <CoffeeIcon class="w-5 h-5 mr-2 text-indigo-600" />
                {{ $t('Services') }}
              </h3>
              <div class="space-y-1">
                <DetailRow
                  :label="$t('BreakfastIncluded')"
                  :value="selectedRoom.options?.option_8 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('Housekeeping')"
                  :value="selectedRoom.options?.option_24 || $t('common.na')"
                />
                <DetailRow
                  :label="$t('Parking')"
                  :value="selectedRoom.options?.option_25 || $t('common.na')"
                />
                <DetailRow
                  :label="$t('RoomService')"
                  :value="selectedRoom.options?.option_26 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('SelfCheck-in')"
                  :value="selectedRoom.options?.option_27 || $t('common.no')"
                  type="boolean"
                />
              </div>
            </div>

            <!-- Caractéristiques -->
            <div
              class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200"
            >
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <EyeIcon class="w-5 h-5 mr-2 text-orange-600" />
                {{ $t('Features') }}
              </h3>
              <div class="space-y-1">
                <DetailRow
                  :label="$t('View')"
                  :value="$t(`options.values.${selectedRoom.options?.option_3}`) || $t('common.na')"
                />
                <DetailRow
                  :label="$t('Balcony')"
                  :value="selectedRoom.options?.option_4 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('Terrace')"
                  :value="selectedRoom.options?.option_5 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('PrivatePool')"
                  :value="selectedRoom.options?.option_20 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('Jacuzzi/Spa')"
                  :value="selectedRoom.options?.option_21 || $t('common.no')"
                  type="boolean"
                />
              </div>
            </div>

            <!-- Politiques -->
            <div
              class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200"
            >
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <ShieldIcon class="w-5 h-5 mr-2 text-red-600" />
                {{ $t('Policies') }}
              </h3>
              <div class="space-y-1">
                <DetailRow
                  :label="$t('SmokingAllowed')"
                  :value="$t(`options.values.${selectedRoom.options?.option_22}`) || $t('common.na')"
                />
                <DetailRow
                  :label="$t('PetsAllowed')"
                  :value="selectedRoom.options?.option_23 || $t('common.no')"
                  type="boolean"
                />
                <DetailRow
                  :label="$t('WheelchairAccessible')"
                  :value="selectedRoom.options?.option_19 || $t('common.no')"
                  type="boolean"
                />
              </div>
            </div>
          </div>

          <!-- History Tab -->
          <div v-if="activeTab === 'history'" class="bg-white rounded-xl border border-gray-200">
          <template v-if="activitiesLogs && activitiesLogs.length > 0">
            <ActivitiesLogs :activity-logs="activitiesLogs" />
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center text-gray-500 py-10">
              <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
              <p class="text-sm">{{ $t('no_recente_activity') }}</p>
            </div>
          </template>
          </div>

          <!-- Calendar Tab -->
          <div v-if="activeTab === 'calendar'" class="bg-white rounded-xl border border-gray-200">
            <!-- <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                    <CalendarIcon class="w-5 h-5 mr-2 text-blue-600" />
                    {{ $t('booking_calendar') }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1 capitalize">{{ currentMonth }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="previousMonth"
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    @click="nextMonth"
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRightIcon class="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-7 gap-1 mb-4">
                <div
                  v-for="day in daysOfWeek"
                  :key="day"
                  class="p-3 text-center text-sm font-medium text-gray-500"
                >
                  {{ $t(day) }}
                </div>
              </div>
              <div class="grid grid-cols-7 gap-1">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  :class="[
                    'aspect-square p-2 text-sm border rounded-lg relative cursor-pointer transition-all duration-200',
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                    day.isToday ? 'bg-blue-100 border-blue-300 font-bold' : 'border-gray-200',
                    day.isReserved && !day.isMaintenance ? 'bg-red-50 border-red-300' : '',
                    day.isMaintenance ? 'bg-yellow-50 border-yellow-300' : '',
                    !day.isReserved && !day.isMaintenance ? 'hover:bg-gray-50' : '',
                  ]"
                >
                  <div class="font-medium">{{ day.day }}</div>


                  <div
                    v-if="day.isReserved && !day.isMaintenance"
                    class="absolute bottom-1 left-1 right-1"
                  >
                    <div class="h-1 bg-red-500 rounded-full mb-1"></div>
                    <div class="text-xs text-red-600 font-medium truncate">
                      {{ day.reservation?.guest }}
                    </div>
                  </div>


                  <div v-if="day.isMaintenance" class="absolute bottom-1 left-1 right-1">
                    <div class="h-1 bg-yellow-500 rounded-full mb-1"></div>
                    <div class="text-xs text-yellow-600 font-medium truncate">
                      {{ $t('maintenance') }}
                    </div>
                  </div>
                </div>
              </div>

               Légende
              <div class="mt-6 flex items-center justify-center space-x-6">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                  <span class="text-sm text-gray-600">{{ $t('now') }}</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-red-50 border border-red-300 rounded mr-2"></div>
                  <span class="text-sm text-gray-600">{{ $t('roomStatus.booked') }}</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-yellow-50 border border-yellow-300 rounded mr-2"></div>
                  <span class="text-sm text-gray-600">{{ $t('roomStatus.maintenance') }}</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
                  <span class="text-sm text-gray-600">{{ $t('roomStatus.available') }}</span>
                </div>
              </div>
            </div> -->
            <BaseCalendar
              :title="$t('booking_calendar')"
              :initial-date="selectedDate"
              :events="calendarEvents"
              :day-modifiers="dayModifiers"
            >
            <template #day-content="{ day }">
              <div v-for="(event,indx) in day.events" :key="indx">
                <div v-if="event.type === 'reserved'" class="bg-red-50 border-red-300 p-1 rounded">
                  <div class="h-1 bg-red-500 rounded-full mb-1"></div>
                  <div class="text-xs text-red-600 truncate">
                    {{ event.reservation?.guest }}
                  </div>
                </div>

                <div v-else-if="event.type === 'maintenance'" class="bg-yellow-50 border-yellow-300 p-1 rounded mt-1">
                  <div class="h-1 bg-yellow-500 rounded-full mb-1"></div>
                  <div class="text-xs text-yellow-600 truncate">
                    {{ $t('maintenance') }}
                  </div>
                </div>
              </div>
            </template>

              <template #legend>
                <div class="flex items-center justify-center space-x-6">
                  <LegendItem color="blue" :label="$t('now')" />
                  <LegendItem color="red" :label="$t('roomStatus.booked')" />
                  <LegendItem color="yellow" :label="$t('roomStatus.maintenance')" />
                  <LegendItem color="gray" :label="$t('roomStatus.available')" />
                </div>
              </template>
            </BaseCalendar>

          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              {{ $t('Last_updated') }}: {{ formatDateTime(selectedRoom.updatedAt) }}
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">{{ $t('system_update') }}</span>
            </div>
          </div>
        </div>
      </div>
      <OverLoading v-if="isLoading" />
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { getServiceProductAndReservationById ,getRoomHistoryById } from '@/services/api'
import DetailRow from './DetailRow.vue'
import router from '@/router'
import { useI18n } from 'vue-i18n'
import OverLoading from '@/components/spinner/OverLoading.vue'
import ActivitiesLogs from '../Setting/ActivitiesLogs.vue';
import type { ActivityLog} from '@/utils/models';
import BaseCalendar from '@/components/calendars/BaseCalendar.vue'
import LegendItem from '@/components/calendars/LegendItem.vue'

import {
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Info as InfoIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Building as BuildingIcon,
  Home as HomeIcon,
  Star as StarIcon,
  Coffee as CoffeeIcon,
  Eye as EyeIcon,
  Shield as ShieldIcon,
  FileSearch,
  User as UserIcon,
  Settings as SettingsIcon,
  XCircle as XCircleIcon,
  Activity as ActivityIcon,
  CheckCircle as CheckCircleIcon,
  DollarSign as DollarSignIcon,
} from 'lucide-vue-next'



// Reactive data
const activeTab = ref<string>('details')
const currentDate = ref<Date>(new Date())
const selectedRoom = ref<any>(null)
const isLoading = ref(false)
const room_id = router.currentRoute.value.params.id as string
const { t, locale } = useI18n()
const activitiesLogs = ref<ActivityLog[]>([]);

onMounted(() => {
  getRoomDetails()
})


const tabs = computed(() => [
  { id: 'details', label: t('tab.details'), icon: InfoIcon },
  { id: 'history', label: t('tab.history'), icon: ClockIcon },
  { id: 'calendar', label: t('tab.calendar'), icon: CalendarIcon },
])




// Méthodes utilitaires
const getStatusColor = (status:any) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800'
    case 'booked':
      return 'bg-blue-100 text-blue-800'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800'
    case 'occupied':
      return 'bg-red-100 text-red-800'
    case 'dirty' :
      return 'bg-red-50 text-orange-700'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}


const formatDateTime = (date:any) => {
  if (!date) return t('common.na')
  return new Date(date).toLocaleString('fr-FR')
}

const getRoomDetails = async () => {
  isLoading.value = true
  try {
    const response = await getServiceProductAndReservationById(parseInt(room_id))
    activitiesLogs.value = await (await getRoomHistoryById(parseInt(room_id))).data
    console.log('Room data:', response.data)
    console.log('activitiesLogs.value:', activitiesLogs.value)

    if (response.status === 200) {
      selectedRoom.value = response.data
      console.log('Selected room set:', selectedRoom.value)
    }
  } catch (error) {
    console.error('Error fetching room details:', error)
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {
  getRoomDetails()
})

function goBack() {
  router.back()
}

function dayModifiers(day: any): string {
  const hasReserved = day.events?.some((e: any) => e.type === 'reserved')
  const hasMaintenance = day.events?.some((e: any) => e.type === 'maintenance')

  if (hasReserved && !hasMaintenance) return 'bg-red-50 border-red-300'
  if (hasMaintenance) return 'bg-yellow-50 border-yellow-300'
  if (day.isToday) return 'bg-blue-100 border-blue-300 font-bold'
  return 'hover:bg-gray-50'
}


const calendarEvents = computed<any[]>(() => {
  const events = []
  const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const selectedRoomData = selectedRoom.value
  if (!selectedRoomData) return []

  selectedRoomData.reservations?.forEach((reservation: any) => {
    if (reservation.status !== 'checked-in') return
    let current = new Date(reservation.checkIn)
    const checkOut = new Date(reservation.checkOut)

    while (normalizeDate(current) <= normalizeDate(checkOut)) {
      events.push({
        date: new Date(current),
        type: 'reserved',
        reservation
      })
      current.setDate(current.getDate() + 1)
    }
  })

  const maintenance = selectedRoomData.maintenance
  if (maintenance) {
    let current = new Date(maintenance.startDate)
    const end = new Date(maintenance.endDate)

    while (normalizeDate(current) <= normalizeDate(end)) {
      events.push({
        date: new Date(current),
        type: 'maintenance'
      })
      current.setDate(current.getDate() + 1)
    }

  }

  return events
})

const selectedDate = ref(new Date())


function onDayClick(day: any) {
  console.log(day)
}
</script>
