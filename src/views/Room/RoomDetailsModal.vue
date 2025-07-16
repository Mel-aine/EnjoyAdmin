<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Header -->
        <div class=" text-white p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-blue-100 bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BuildingIcon class="w-8 h-8 text-gray-950" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">{{ roomData.productName }} {{ roomData.roomNumber }}</h1>
                <p class="text-black font-medium">{{ roomData.RoomTypeName }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="inline-flex items-center px-3 py-1 bg-blue-50 text-gray-950 bg-opacity-20 rounded-full text-sm font-medium">
                    <DollarSignIcon class="w-4 h-4 mr-1" />
                    {{ roomData.price?.toLocaleString() }} XAF
                  </span>
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    roomData.statusColor?.color === 'green' ? 'bg-green-100 text-green-800' :
                    roomData.statusColor?.color === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ roomData.statusColor?.label }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
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
            </div>
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <div v-if="activeTab === 'details'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- Informations de base -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <InfoIcon class="w-5 h-5 mr-2 text-blue-600" />
                {{ $t('Basic_Information') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('Name')" :value="roomData.productName" />
                <DetailRow :label="$t('number')" :value="roomData.roomNumber" />
                <DetailRow :label="$t('Rent')" :value="roomData.price?.toLocaleString()" suffix="XAF" />
                <DetailRow :label="$t('RoomTypes')" :value="roomData.RoomTypeName" />
                <DetailRow :label="$t('Status')"  :value="roomData.statusColor?.label" type="badge" />
              </div>
            </div>


            <!-- Spécifications -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <HomeIcon class="w-5 h-5 mr-2 text-green-600" />
                 {{ $t('Specifications') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('RoomSize(sqm)')" :value="room?.option_12" suffix="m²" />
                <DetailRow :label="$t('NumberofRooms')" :value="room?.option_13" />
                <DetailRow :label="$t('numberBeds')" :value="room?.option_31" />
                <DetailRow :label="$t('numberBathrooms')" :value="room?.option_32" />
                <DetailRow :label="$t('BedType')" :value="$t(`options.values.${room?.option_2}`)" />
              </div>
            </div>

            <!-- Équipements -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <StarIcon class="w-5 h-5 mr-2 text-purple-600" />
                {{ $t('Amenities') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('AirConditioning')" :value="room?.option_6" type="boolean" />
                <DetailRow :label="$t('Wi-fi')" :value="room?.option_7" type="boolean" />
                <DetailRow :label="$t('TV')" :value="$t(`options.values.${room?.option_15}`)"  />
                <DetailRow :label="$t('MiniBar')" :value="room?.option_16" type="boolean" />
                <DetailRow :label="$t('SafeDepositBox')" :value="room?.option_17" type="boolean" />
              </div>
            </div>

            <!-- Services -->
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <CoffeeIcon class="w-5 h-5 mr-2 text-indigo-600" />
                {{ $t('Services') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('BreakfastIncluded')" :value="room?.option_8" type="boolean" />
                <DetailRow :label="$t('Housekeeping')"  :value="$t(`options.values.${room?.option_24}`)" />
                <DetailRow :label="$t('Parking')"  :value="$t(`options.values.${room?.option_25}`)" />
                <DetailRow :label="$t('RoomService')" :value="room?.option_26" type="boolean" />
                <DetailRow :label="$t('SelfCheck-in')" :value="room?.option_27" type="boolean" />
              </div>
            </div>

            <!-- Caractéristiques -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <EyeIcon class="w-5 h-5 mr-2 text-orange-600" />
                {{ $t('Features') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('View')" :value="$t(`options.values.${room?.option_3}`)" />
                <DetailRow :label="$t('Balcony')" :value="room?.option_4" type="boolean" />
                <DetailRow :label="$t('Terrace')" :value="room?.option_5" type="boolean" />
                <DetailRow :label="$t('PrivatePool')" :value="room?.option_20" type="boolean" />
                <DetailRow :label="$t('Jacuzzi/Spa')" :value="room?.option_21" type="boolean" />
              </div>
            </div>

            <!-- Politiques -->
            <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <ShieldIcon class="w-5 h-5 mr-2 text-red-600" />
                {{ $t('Policies') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('SmokingAllowed')" :value="$t(`options.values.${room?.option_22}`)" />
                <DetailRow :label="$t('PetsAllowed')" :value="room?.option_23" type="boolean" />
                <DetailRow :label="$t('WheelchairAccessible')" :value="room?.option_19" type="boolean" />
              </div>
            </div>
          </div>

          <!-- History Tab -->
          <div v-if="activeTab === 'history'" class="bg-white rounded-xl border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <ClockIcon class="w-5 h-5 mr-2 text-blue-600" />
                Historique des activités
              </h3>
              <p class="text-sm text-gray-600">Toutes les actions effectuées sur cette chambre</p>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                v-for="log in activityLogs"
                :key="log.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 mt-1">
                    <component :is="getLogIcon(log.type)" class="w-4 h-4" :class="getLogIconColor(log.type)" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900">{{ log.action }}</p>
                      <p class="text-xs text-gray-500">{{ formatDateTime(log.timestamp) }}</p>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ log.details }}</p>
                    <div class="flex items-center mt-2">
                      <UserIcon class="w-4 h-4 text-gray-400 mr-1" />
                      <span class="text-xs text-gray-500">{{ log.user }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendar Tab -->
          <div v-if="activeTab === 'calendar'" class="bg-white rounded-xl border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                    <CalendarIcon class="w-5 h-5 mr-2 text-blue-600" />
                    Calendrier des réservations
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
                  {{ day }}
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
                    day.isReserved ? 'bg-red-50 border-red-300' : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="font-medium">{{ day.day }}</div>
                  <div v-if="day.isReserved" class="absolute bottom-1 left-1 right-1">
                    <div class="h-1 bg-red-500 rounded-full mb-1"></div>
                    <div class="text-xs text-red-600 font-medium truncate">
                      {{ day.reservation?.guest }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Légende -->
              <div class="mt-6 flex items-center justify-center space-x-6">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                  <span class="text-sm text-gray-600">Aujourd'hui</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-red-50 border border-red-300 rounded mr-2"></div>
                  <span class="text-sm text-gray-600">Réservé</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
                  <span class="text-sm text-gray-600">Disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              {{ $t('Last_updated') }}: {{ formatDateTime(roomData.updatedAt) }}
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Système à jour</span>
            </div>
          </div>
        </div>
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
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
  User as UserIcon,
  Settings as SettingsIcon,
  XCircle as XCircleIcon,
  Activity as ActivityIcon,
  CheckCircle as CheckCircleIcon,
  DollarSign as DollarSignIcon
} from 'lucide-vue-next'

// Types
interface StatusColor {
  label: string
  color: string
}

interface Room {
  id: string
  productName: string
  roomNumber: string
  price: number
  statusColor: StatusColor
  RoomTypeName: string
  updatedAt: string
  option_12: string
  option_13: string
  option_31: string
  option_32: string
  option_2: string
  option_6: boolean
  option_7: boolean
  option_15: string
  option_16: boolean
  option_17: boolean
  option_8: boolean
  option_24: string
  option_25: string
  option_26: boolean
  option_27: boolean
  option_3: string
  option_4: boolean
  option_5: boolean
  option_20: boolean
  option_21: boolean
  option_28: string
  option_29: string
  option_22: string
  option_23: boolean
  option_19: boolean
}

interface ActivityLog {
  id: number
  action: string
  user: string
  timestamp: string
  type: string
  details: string
}

interface Reservation {
  id: number
  checkIn: string
  checkOut: string
  guest: string
  status: string
}

interface Tab {
  id: string
  label: string
  icon: any
}

interface CalendarDay {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isReserved: boolean
  reservation?: Reservation
}

// Props
interface Props {
  room?: Room
}

const props = withDefaults(defineProps<Props>(), {
  room: undefined
})

// Emits
const emit = defineEmits<{
  edit: [room: Room]
  delete: [room: Room]
}>()

// Reactive data
const activeTab = ref<string>('details')
const currentDate = ref<Date>(new Date())

// Default room data
const defaultRoom: Room = {
  id: '101',
  productName: 'Chambre Standard',
  roomNumber: '101',
  price: 50000,
  statusColor: { label: 'Disponible', color: 'green' },
  RoomTypeName: 'Standard',
  updatedAt: '2024-02-01T10:00:00Z',
  option_12: '25',
  option_13: '2',
  option_31: '1',
  option_32: '1',
  option_2: 'Lit double',
  option_6: true,
  option_7: true,
  option_15: 'Smart TV 42"',
  option_16: true,
  option_17: true,
  option_8: true,
  option_24: 'Quotidien',
  option_25: 'Gratuit',
  option_26: true,
  option_27: false,
  option_3: 'Vue jardin',
  option_4: true,
  option_5: false,
  option_20: false,
  option_21: false,
  option_28: '14:00',
  option_29: '12:00',
  option_22: 'Non autorisé',
  option_23: false,
  option_19: true,
}

// Mock data
const activityLogs: ActivityLog[] = [
  {
    id: 1,
    action: 'Chambre créée',
    user: 'Admin System',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'create',
    details: 'Chambre Standard 101 créée avec succès'
  },
  {
    id: 2,
    action: 'Statut modifié',
    user: 'Marie Dubois',
    timestamp: '2024-01-20T14:15:00Z',
    type: 'update',
    details: 'Statut changé de "Disponible" à "Occupée"'
  },
  {
    id: 3,
    action: 'Prix mis à jour',
    user: 'Jean Martin',
    timestamp: '2024-01-25T09:45:00Z',
    type: 'update',
    details: 'Prix modifié de 45,000 XAF à 50,000 XAF'
  },
  {
    id: 4,
    action: 'Maintenance programmée',
    user: 'Service Technique',
    timestamp: '2024-02-01T16:20:00Z',
    type: 'maintenance',
    details: 'Maintenance préventive programmée pour le 5 février'
  },
  {
    id: 5,
    action: 'Réservation annulée',
    user: 'Réception',
    timestamp: '2024-02-03T11:30:00Z',
    type: 'cancellation',
    details: 'Réservation du client Pierre Kouam annulée'
  }
]

const reservations: Reservation[] = [
  {
    id: 1,
    checkIn: '2024-01-15',
    checkOut: '2024-01-20',
    guest: 'Jean Dupont',
    status: 'confirmed'
  },
  {
    id: 2,
    checkIn: '2024-01-25',
    checkOut: '2024-01-30',
    guest: 'Marie Martin',
    status: 'completed'
  },
  {
    id: 3,
    checkIn: '2024-02-05',
    checkOut: '2024-02-10',
    guest: 'Pierre Kouam',
    status: 'pending'
  },
  {
    id: 4,
    checkIn: '2024-02-15',
    checkOut: '2024-02-18',
    guest: 'Sophie Nkomo',
    status: 'confirmed'
  }
]

const tabs: Tab[] = [
  { id: 'details', label: 'Détails', icon: InfoIcon },
  { id: 'history', label: 'Historique', icon: ClockIcon },
  { id: 'calendar', label: 'Calendrier', icon: CalendarIcon }
]

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

// Computed properties
const roomData = computed(() => props.room || defaultRoom)

const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days: CalendarDay[] = []
  const today = new Date()

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const isReserved = reservations.some(reservation => {
      const checkIn = new Date(reservation.checkIn)
      const checkOut = new Date(reservation.checkOut)
      return date >= checkIn && date <= checkOut
    })

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      isReserved,
      reservation: isReserved ? reservations.find(r => {
        const checkIn = new Date(r.checkIn)
        const checkOut = new Date(r.checkOut)
        return date >= checkIn && date <= checkOut
      }) : undefined
    })
  }

  return days
})

// Methods
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLogIcon = (type: string) => {
  switch (type) {
    case 'create':
      return SettingsIcon
    case 'update':
      return EditIcon
    case 'maintenance':
      return SettingsIcon
    case 'cancellation':
      return XCircleIcon
    default:
      return ActivityIcon
  }
}

const getLogIconColor = (type: string): string => {
  switch (type) {
    case 'create':
      return 'text-green-500'
    case 'update':
      return 'text-blue-500'
    case 'maintenance':
      return 'text-orange-500'
    case 'cancellation':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const handleEdit = () => {
  emit('edit', roomData.value)
}

const handleDelete = () => {
  emit('delete', roomData.value)
}
</script>
