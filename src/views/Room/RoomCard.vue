<!-- <script setup>
import { computed, ref } from 'vue'
import {
  Wifi,
  Utensils,
  Bed,
  Car,
  Sun,
  Coffee,
  Tv,
  LogIn,
  LogOut,
  Wrench,
  PlusCircle,
  CheckCircle
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
// const isCheckingOut = ref(false)

const props = defineProps({
  room: Object,
  isCheckingIn: Boolean,
  isCheckingOut: Boolean,
})

const emit = defineEmits(['change', 'checkin', 'checkout', 'cleaned','request-status-change'])





const optionLabels = {
  // option_1: 'Type de chambre',
  option_2: 'Type de lit',
  option_3: 'Vue',
  option_4: 'Petit-déjeuner inclus',
  option_5: 'WiFi',
  option_6: 'Climatisation',
  option_7: 'Parking',
  option_8: 'Service de chambre',
}

const iconsMap = {
  option_2: Bed,
  option_3: Sun,
  option_4: Coffee,
  option_5: Wifi,
  option_6: Car,
  option_7: Utensils,
  option_8: Utensils,
}

const maxOptions = 2

const allOptions = computed(() => {
  return Object.entries(optionLabels)
    .filter(([key]) => props.room[key] !== undefined && props.room[key] !== null)
    .map(([key, label]) => ({
      key,
      label,
      value: props.room[key],
      Icon: iconsMap[key],
    }))
})

 const displayedOptions = computed(() => allOptions.value.slice(0, maxOptions))


const equipmentIcons = {
  'TV écran plat': Tv,
  'Mini-bar': Utensils,
  WiFi: Wifi,
  Climatisation: Car,
}
// Fonction pure avec statut et t()
const getRoomStatusUI = (status, t) => {
  switch (status) {
    case 'available':
      return {
        text: t('roomStatus.available'),
        classes: 'bg-emerald-600 text-white',
        canBook: true,
        canCheckIn: false,
        canCheckOut: false,
      }
    case 'booked':
      return {
        text: t('roomStatus.booked'),
        classes: 'bg-blue-600 text-white',
        canBook: false,
        canCheckIn: true,
        canCheckOut: false,
      }
    case 'occupied':
      return {
        text: t('roomStatus.occupied'),
        classes: 'bg-rose-600 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: true,
      }

    case 'checkout':
      return {
        text: t('roomStatus.checkout'),
        classes: 'bg-orange-500 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false,
      }
    case 'cleaning':
      return {
        text: t('roomStatus.cleaning'),
        classes: 'bg-purple-500 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false,
      }
    case 'maintenance':
      return {
        text: t('roomStatus.maintenance'),
        classes: 'bg-amber-500 text-black',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false,
      }
    case 'dirty':
      return {
        text: t('roomStatus.dirty'),
        classes: 'bg-red-500 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false,
      }
    default:
      return {
        text: t('roomStatus.unknown'),
        classes: 'bg-gray-500 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false,
      }
  }
}
const statusConfig = computed(() => getRoomStatusUI(props.room.status, t))

const toggleStatus = () => {
  let newStatus
  switch (props.room.status) {
    case 'available':
      newStatus = 'booked'
      break
    case 'booked':
      newStatus = 'occupied'
      break
    case 'occupied':
      newStatus = 'checkout'
      break
    case 'checkout':
      newStatus = 'cleaning'
      break
    case 'cleaning':
      newStatus = 'available'
      break
    case 'maintenance':
      newStatus = 'available'
      break
    default:
      newStatus = 'available'
  }

  emit('change', { room: props.room, status: newStatus })
}

const handleCheckIn = () => {
  emit('checkin', props.room)
}


const handleCheckOut = async () => {
  emit('checkout', props.room)
}

const handleMarkCleaned = () => {
  emit('cleaned', props.room)
}



const store = useBookingStore()

const goToBooking = () => {
  store.setRoom(props.room)
  router.push('/add_booking')
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getNextDisplayDate(status, departDate) {
  if (!departDate) return null
  const date = new Date(departDate)
  if (status === 'booked') {
    date.setDate(date.getDate() + 1)
  }
  return formatDate(date.toISOString())
}
</script>

<template>
  <div
  class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100/70 hover:border-gray-200/90 relative overflow-hidden min-h-[80px] flex flex-col justify-between"
>


   <div class="flex items-center justify-between mb-4">
  <div>
    <div class="flex items-center space-x-2">
      <h3 class="text-xl font-semibold text-gray-900 tracking-tight">
        {{ props.room.productName || props.room.name }}
      </h3>
       <button
           @click="emit('request-status-change', room)"
          :class="[
            statusConfig.classes,
            'text-xs font-semibold px-2 py-1 rounded-full select-none shadow-sm whitespace-nowrap flex items-center space-x-1',
          ]"
        >
          <span>{{ statusConfig.text }}</span>
          <PlusCircle class="w-4 h-4" />
        </button>
    </div>


    <p class="text-sm text-gray-700 mt-1 whitespace-nowrap">
      {{ props.room.productTypeName }}
    </p>
  </div>

      <div class="flex items-center space-x-2 ml-4">

        <button
          @click="emit('change', { room: props.room, status: 'maintenance' })"
          class="p-2 rounded-lg border border-gray-200/80 shadow-sm hover:bg-amber-50 text-amber-600 transition-all"
          title="Mettre en maintenance"
        >
          <Wrench class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div v-if="props.room.guestName" class="mb-3 p-2 bg-blue-50 rounded-lg">
      <p class="text-sm font-medium text-blue-900 inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cc53e4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> : {{ props.room.guestName }}</p>
      <p v-if="props.room.checkInTime" class="text-xs text-blue-700">
        {{ $t('arrive') }} : {{ formatDate(props.room.checkInTime) }}
      </p>
    </div>


   <ul class="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700">

      <li v-for="option in displayedOptions" :key="option.key" class="flex items-center space-x-2">
        <component
          v-if="option.Icon"
          :is="option.Icon"
          class="w-5 h-5 text-gray-500 flex-shrink-0"
        />
        <span>{{ option.value }}</span>
      </li>

    </ul>


    <div v-if="props.room.equipment?.length" class="mb-4">
      <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{{ $t('amenities') }}</h4>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="item in props.room.equipment"
          :key="item"
          class="px-3 py-1.5 bg-gray-50/50 rounded-full text-sm text-gray-600 flex items-center space-x-2"
        >
          <component
            v-if="equipmentIcons[item]"
            :is="equipmentIcons[item]"
            class="w-4 h-4 text-gray-400"
          />
          <span>{{ item }}</span>
        </div>
      </div>
    </div>


    <div
      v-if="
        (props.room.status === 'booked' || props.room.status === 'occupied') &&
        props.room.nextAvailable
      "
      class="mt-2 flex items-center gap-2 text-sm font-medium rounded-lg p-1"
      :class="
        room.status === 'occupied' ? 'text-orange-800 bg-orange-100' : 'text-blue-800 bg-blue-100'
      "
    >


      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        {{ props.room.status === 'occupied' ? $t('planned') : $t('available') }} :
        {{ getNextDisplayDate(props.room.status, props.room.nextAvailable) }}
      </span>

    </div>


    <div class="pt-4 border-t border-gray-100/70">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-sm text-gray-500">{{ $t('from') }}</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ props.room.price }} FCFA</p>
        </div>
      </div>


      <div class="flex space-x-2">

        <button
          v-if="statusConfig.canBook"
          @click="goToBooking"
          class="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <span>{{ $t('book') }}</span>
        </button>


        <button
          :disabled="isCheckingIn"
          v-if="statusConfig.canCheckIn"
          @click="handleCheckIn"
          class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <svg
            v-if="isCheckingIn"
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>{{ isCheckingIn ? $t('loading') : $t('Check-In') }}</span>
          <LogIn class="w-4 h-4" />
        </button>


        <button
          v-if="statusConfig.canCheckOut"
          :disabled="isCheckingOut"
          @click="handleCheckOut"
          class="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <svg
            v-if="isCheckingOut"
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>{{ isCheckingOut ? $t('loading') : $t('Check-Out') }}</span>

          <LogOut class="w-4 h-4" />

        </button>
      </div>


      <div v-if="props.room.status === 'cleaning'" class="  ">

        <p class="text-sm text-purple-700 font-medium bg-purple-50 rounded-md text-center mt-3 p-2">
          🧹 {{ $t('cleaning...') }}
        </p>
        <div class="flex flex-col items-end">
        <button
          class="text-sm text-purple-700 font-medium bg-purple-50 rounded-full text-center mt-3 p-2"
          @click="handleMarkCleaned"
        >
        <span class="inline-flex gap-2">
        <CheckCircle class="w-4 h-4" />
          {{ $t('cleaning_completed') }}</span>
        </button>
        </div>
      </div>

      -- <div v-if="props.room.status === 'cleaning'" class="">
        <button
          @click="handleMarkCleaned"
          class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <CheckCircle class="w-4 h-4" />
          <span>{{ $t('cleaning_completed') }}</span>
        </button>
        <p class="text-sm text-purple-700 font-medium text-center flex items-center justify-center gap-2 mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <Settings class="w-4 h-4 animate-spin" />
          {{ $t('cleaning...') }}
        </p>
      </div> --

      <div
        v-else-if="props.room.status === 'checkout'"
        class="mt-3 p-2 bg-orange-50 rounded-md text-center"
      >
        <p class="text-sm text-orange-700 font-medium">📋 {{ $t('verification') }}</p>
      </div>

      <div
        v-else-if="props.room.status === 'maintenance'"
        class="mt-3 p-2 bg-amber-50 rounded-md text-center"
      >
        <p class="text-sm text-amber-700 font-medium">🔧 {{ $t('maintenance...') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 0 6px rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
  }
}
.ribbon-glow {
  animation: pulseGlow 2.5s infinite;
}
</style>

<!-- <script setup>
import { computed, ref } from 'vue'
import Spinner from '@/components/spinner/Spinner.vue'
import {
  ArrowRightLeft,
  Users,
  Home,
  Wifi,
  Utensils,
  Bed,
  Car,
  Sun,
  Coffee,
  Tv,
  LogIn,
  LogOut,
  Wrench,
  Calendar,
  Clock,
  User,
  Settings,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  Play
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  isCheckingIn: {
    type: Boolean,
    default: false
  },
  isCheckingOut: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['change', 'checkin', 'checkout', 'cleaned'])

// Configuration des options de chambre
const roomOptions = {
  option_2: { label: 'Type de lit', icon: Bed },
  option_3: { label: 'Vue', icon: Sun },
  option_4: { label: 'Petit-déjeuner inclus', icon: Coffee },
  option_5: { label: 'WiFi', icon: Wifi },
  option_6: { label: 'Climatisation', icon: Car },
  option_7: { label: 'Parking', icon: Car },
  option_8: { label: 'Service de chambre', icon: Utensils },
}

// Configuration des équipements
const equipmentConfig = {
  'TV écran plat': { icon: Tv, category: 'entertainment' },
  'Mini-bar': { icon: Utensils, category: 'refreshment' },
  'WiFi': { icon: Wifi, category: 'connectivity' },
  'Climatisation': { icon: Car, category: 'comfort' },
}

// Configuration des statuts avec design professionnel
const statusConfigurations = {
  available: {
    text: 'Disponible',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    iconColor: 'text-emerald-600',
    actions: ['book', 'maintenance']
  },
  booked: {
    text: 'Réservée',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Calendar,
    iconColor: 'text-blue-600',
    actions: ['checkin', 'maintenance']
  },
  occupied: {
    text: 'Occupée',
    classes: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: User,
    iconColor: 'text-rose-600',
    actions: ['checkout', 'maintenance']
  },
  checkout: {
    text: 'Libération',
    classes: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Clock,
    iconColor: 'text-orange-600',
    actions: ['maintenance']
  },
  cleaning: {
    text: 'Nettoyage',
    classes: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Settings,
    iconColor: 'text-purple-600',
    actions: ['cleaned']
  },
  maintenance: {
    text: 'Maintenance',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Wrench,
    iconColor: 'text-amber-600',
    actions: ['available']
  }
}

// Computed properties
const displayedOptions = computed(() => {
  return Object.entries(roomOptions)
    .filter(([key]) => props.room[key] !== undefined && props.room[key] !== null)
    .slice(0, 3)
    .map(([key, config]) => ({
      key,
      label: config.label,
      value: props.room[key],
      icon: config.icon,
    }))
})

const statusConfig = computed(() => {
  return statusConfigurations[props.room.status] || statusConfigurations.available
})

const store = useBookingStore()

// Méthodes
const goToBooking = () => {
  store.setRoom(props.room)
  router.push('/add_booking')
}

const handleCheckIn = () => {
  emit('checkin', props.room)
}

const handleCheckOut = () => {
  emit('checkout', props.room)
}

const handleMarkCleaned = () => {
  emit('cleaned', props.room)
}

const setMaintenance = () => {
  emit('change', { room: props.room, status: 'maintenance' })
}

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getNextDisplayDate = (status, departDate) => {
  if (!departDate) return null
  const date = new Date(departDate)
  if (status === 'booked') {
    date.setDate(date.getDate() + 1)
  }
  return formatDate(date.toISOString())
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}
</script>

<template>
  <div class="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden">


    <div class="p-6 pb-4">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-xl font-semibold text-gray-900 leading-tight">
              {{ props.room.productName || props.room.name }}
            </h3>
            <div :class="[statusConfig.classes, 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border']">
              <component :is="statusConfig.icon" class="w-4 h-4" />
              <span>{{ statusConfig.text }}</span>
            </div>
          </div>
          <p class="text-sm text-gray-600 font-medium">
            {{ props.room.productTypeName }}
          </p>
        </div>

        <button
          @click="setMaintenance"
          class="p-2.5 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-500 hover:text-amber-600 transition-all duration-200 group/btn"
          :title="$t('maintenance')"
        >
          <Wrench class="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
        </button>
      </div>

      <div v-if="props.room.guestName" class="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div class="flex items-center gap-2 mb-2">
          <User class="w-5 h-5 text-blue-600" />
          <span class="font-medium text-blue-900">{{ props.room.guestName }}</span>
        </div>
        <div v-if="props.room.checkInTime" class="flex items-center gap-2 text-sm text-blue-700">
          <Calendar class="w-4 h-4" />
          <span>{{ $t('arrive') }} : {{ formatDate(props.room.checkInTime) }}</span>
        </div>
      </div>
    </div>


    <div class="px-6 pb-4">
      <div v-if="displayedOptions.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div
          v-for="option in displayedOptions"
          :key="option.key"
          class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <component :is="option.icon" class="w-5 h-5 text-gray-500 flex-shrink-0" />
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ option.value }}</p>
            <p class="text-xs text-gray-500">{{ option.label }}</p>
          </div>
        </div>
      </div>

      <div v-if="props.room.equipment?.length" class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Settings class="w-4 h-4" />
          {{ $t('amenities') }}
        </h4>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in props.room.equipment"
            :key="item"
            class="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <component
              v-if="equipmentConfig[item]?.icon"
              :is="equipmentConfig[item].icon"
              class="w-4 h-4 text-gray-500"
            />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="(props.room.status === 'booked' || props.room.status === 'occupied') && props.room.nextAvailable"
        class="mb-4 p-3 rounded-lg border"
        :class="props.room.status === 'occupied' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'"
      >
        <div class="flex items-center gap-2 text-sm font-medium"
             :class="props.room.status === 'occupied' ? 'text-orange-800' : 'text-blue-800'">
          <Clock class="w-4 h-4" />
          <span>
            {{ props.room.status === 'occupied' ? $t('planned') : $t('available') }} :
            {{ getNextDisplayDate(props.room.status, props.room.nextAvailable) }}
          </span>
        </div>
      </div>
    </div>


    <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-gray-600">{{ $t('from') }}</span>
        <div class="text-right">
          <span class="text-2xl font-bold text-gray-900">{{ formatPrice(props.room.price) }}</span>
          <span class="text-sm text-gray-500 ml-1">FCFA</span>
        </div>
      </div>


      <div class="space-y-2">
        Réserver
        <button
          v-if="statusConfig.actions.includes('book')"
          @click="goToBooking"
          class="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Calendar class="w-4 h-4" />
          <span>{{ $t('book') }}</span>
        </button>

         Check-in
        <button
          v-if="statusConfig.actions.includes('checkin')"
          @click="handleCheckIn"
          :disabled="isCheckingIn"
          class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Spinner v-if="isCheckingIn" class="w-4 h-4" />
          <LogIn v-else class="w-4 h-4" />
          <span>{{ isCheckingIn ? $t('loading') : $t('Check-In') }}</span>
        </button>

         Check-out
        <button
          v-if="statusConfig.actions.includes('checkout')"
          @click="handleCheckOut"
          :disabled="isCheckingOut"
          class="w-full px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Spinner v-if="isCheckingOut" class="w-4 h-4" />
          <LogOut v-else class="w-4 h-4" />
          <span>{{ isCheckingOut ? $t('loading') : $t('Check-Out') }}</span>
        </button>

         Nettoyage terminé
        <button
          v-if="statusConfig.actions.includes('cleaned')"
          @click="handleMarkCleaned"
          class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <CheckCircle class="w-4 h-4" />
          <span>{{ $t('cleaning_completed') }}</span>
        </button>
      </div>

       Messages d'état
      <div v-if="props.room.status === 'cleaning'" class="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p class="text-sm text-purple-700 font-medium text-center flex items-center justify-center gap-2">
          <Settings class="w-4 h-4 animate-spin" />
          {{ $t('cleaning...') }}
        </p>
      </div>

      <div v-else-if="props.room.status === 'checkout'" class="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <p class="text-sm text-orange-700 font-medium text-center flex items-center justify-center gap-2">
          <Clock class="w-4 h-4" />
          {{ $t('verification') }}
        </p>
      </div>

      <div v-else-if="props.room.status === 'maintenance'" class="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <p class="text-sm text-amber-700 font-medium text-center flex items-center justify-center gap-2">
          <Wrench class="w-4 h-4" />
          {{ $t('maintenance...') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animations personnalisées */
@keyframes pulse-soft {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-soft {
  animation: pulse-soft 2s infinite;
}

/* Amélioration des transitions */
.group:hover .group-hover\:rotate-12 {
  transform: rotate(12deg);
}

/* Optimisation pour les écrans tactiles */
@media (hover: none) {
  .group:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
}
</style> -->
<template>
  <div class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100/70 hover:border-gray-200/90 relative overflow-hidden min-h-[80px] flex flex-col justify-between w-full">
    <!-- En-tête avec nom et statut -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <div class="flex items-center space-x-2">
          <h3 class="text-xl font-semibold text-gray-900 tracking-tight">
            {{ room.productName || room.name }}
          </h3>
          <button
            @click="$emit('request-status-change', room)"
            :class="[
              statusConfig.classes,
              'text-xs font-semibold px-3 py-1 rounded-full select-none shadow-sm whitespace-nowrap flex items-center space-x-1 border',
              statusConfig.pulse ? 'animate-pulse' : ''
            ]"
          >
            <component :is="statusConfig.icon" class="w-4 h-4" />
            <span>{{ statusConfig.text }}</span>
          </button>
        </div>
        <p class="text-sm text-gray-700 mt-1">
          {{ room.productTypeName }}
        </p>
      </div>

      <!-- Actions rapides -->
     <div class="flex items-center space-x-2 ml-2">
        <button
           @click="$emit('maintenance-set', room)"
          class="p-2 rounded-lg border border-gray-200/80 shadow-sm hover:bg-amber-50 text-amber-600 transition-all"
          :title="$t('maintenance')"
        >
          <Wrench class="w-5 h-5" />
        </button>

       <!--   <button
          @click="setOutOfOrder"
          class="p-2 rounded-lg border border-gray-200/80 shadow-sm hover:bg-red-50 text-red-600 transition-all"
          :title="$t('outOfOrder')"
        >
          <AlertTriangle class="w-5 h-5" />
        </button>-->
      </div>
    </div>

    <!-- Informations client -->
    <div v-if="room.guestName" class="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div class="flex items-center gap-2 mb-1">
        <User class="w-4 h-4 text-blue-600" />
        <p class="text-sm font-medium text-blue-900">{{ room.guestName }}</p>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs text-blue-700">
        <div v-if="room.checkInTime" class="flex items-center gap-1">
          <LogIn class="w-3 h-3" />
          <span>{{ $t('arrive') }}: {{ formatDate(room.checkInTime) }}</span>
        </div>
        <div v-if="room.checkOutTime" class="flex items-center gap-1 ">
          <LogOut class="w-3 h-3" />
          <span class="">{{ $t('checkoutScheduled') }}: {{ formatDate(room.checkOutTime) }}</span>
        </div>
      </div>
    </div>

    <!-- Alertes et informations importantes -->
    <div v-if="statusConfig.alert" class="mb-3 p-2 rounded-lg border" :class="statusConfig.alert.classes">
      <div class="flex items-center gap-2">
        <component :is="statusConfig.alert.icon" class="w-4 h-4" />
        <p class="text-sm font-medium">{{ statusConfig.alert.message }}</p>
      </div>
      <p v-if="statusConfig.alert.subtext" class="text-xs mt-1 opacity-75">
        {{ statusConfig.alert.subtext }}
      </p>
    </div>

    <!-- Informations de maintenance -->
    <div v-if="room.maintenanceInfo && (room.status === 'maintenance' || room.status === 'out-of-order')"
         class="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <div class="flex items-center gap-2 mb-2">
        <Wrench class="w-4 h-4 text-amber-600" />
        <span class="text-sm font-medium text-amber-900">{{ $t('maintenanceDetails') }}</span>
      </div>
      <div class="space-y-1 text-xs text-amber-800">
        <p><strong>{{ $t('reason') }}:</strong> {{ room.maintenanceInfo.reason }}</p>
        <p><strong>{{ $t('startDate') }}:</strong> {{ formatDateTime(room.maintenanceInfo.startDate) }}</p>
        <p v-if="room.maintenanceInfo.estimatedEndDate">
          <strong>{{ $t('estimatedEnd') }}:</strong> {{ formatDateTime(room.maintenanceInfo.estimatedEndDate) }}
        </p>
        <p v-if="room.maintenanceInfo.priority" class="flex items-center gap-1">
          <span class="font-medium">{{ $t('priority') }}:</span>
          <span :class="getPriorityColor(room.maintenanceInfo.priority)">
            {{ $t(`priority.${room.maintenanceInfo.priority}`) }}
          </span>
        </p>
      </div>
    </div>

    <!-- Options de la chambre -->
    <ul v-if="displayedOptions.length" class="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-700">
      <li v-for="option in displayedOptions" :key="option.key" class="flex items-center space-x-2">
        <component :is="option.Icon" class="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span>{{ option.value }}</span>
      </li>
    </ul>

    <!-- Équipements -->
    <div v-if="room.equipment?.length" class="mb-4">
      <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {{ $t('amenities') }}
      </h4>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="item in room.equipment"
          :key="item"
          class="px-2 py-1 bg-gray-50 rounded-full text-xs text-gray-600 flex items-center space-x-1"
        >
          <component
            v-if="equipmentIcons[item]"
            :is="equipmentIcons[item]"
            class="w-3 h-3 text-gray-400"
          />
          <span>{{ item }}</span>
        </div>
      </div>
    </div>

    <!-- Informations de disponibilité -->
    <div v-if="availabilityInfo" class="mb-3 p-2 rounded-lg border" :class="availabilityInfo.classes">
      <div class="flex items-center gap-2 text-sm font-medium">
        <Clock class="w-4 h-4" />
        <span>{{ availabilityInfo.message }}</span>
      </div>
    </div>

    <!-- Historique des nettoyages -->
    <div v-if="room.cleaningHistory?.length && showCleaningHistory" class="mb-3 p-2 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-600">{{ $t('cleaningHistory') }}</span>
        <button @click="showCleaningHistory = false" class="text-gray-400 hover:text-gray-600">
          <X class="w-3 h-3" />
        </button>
      </div>
      <div class="space-y-1">
        <div v-for="cleaning in room.cleaningHistory.slice(0, 3)" :key="cleaning.id"
             class="flex justify-between text-xs text-gray-600">
          <span>{{ cleaning.type }}</span>
          <span>{{ formatDate(cleaning.date) }}</span>
        </div>
      </div>
    </div>

    <!-- Section prix et actions -->
    <div class="pt-4 border-t border-gray-100/70">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-sm text-gray-500">{{ $t('from') }}</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ formatPrice(room.price) }} FCFA</p>
          <p v-if="room.discountedPrice" class="text-sm text-gray-500 line-through">
            {{ formatPrice(room.originalPrice) }} FCFA
          </p>
        </div>
      </div>

      <!-- Actions principales -->
      <div class="space-y-2">
        <!-- Réserver -->
        <!-- <button
          v-if="statusConfig.actions.includes('book')"
          @click="goToBooking"
          class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <Calendar class="w-4 h-4" />
          <span>{{ $t('book') }}</span>
        </button> -->

        <!-- Check-in -->
        <!-- <button
          v-if="statusConfig.actions.includes('checkin')"
          @click="handleCheckIn"
          :disabled="isCheckingIn"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <Loader2 v-if="isCheckingIn" class="w-4 h-4 animate-spin" />
          <LogIn v-else class="w-4 h-4" />
          <span>{{ isCheckingIn ? $t('loading') : $t('checkin') }}</span>
        </button> -->

        <!-- Check-out -->
        <!-- <button
          v-if="statusConfig.actions.includes('checkout')"
          @click="handleCheckOut"
          :disabled="isCheckingOut"
          class="w-full px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <Loader2 v-if="isCheckingOut" class="w-4 h-4 animate-spin" />
          <LogOut v-else class="w-4 h-4" />
          <span>{{ isCheckingOut ? $t('loading') : $t('checkout') }}</span>
        </button> -->

        <!-- Actions de nettoyage -->
        <div v-if="statusConfig.actions.includes('cleaning')" class="flex gap-2">
          <button
            @click="startCleaning"
            class="flex-1 px-2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <Sparkles class="w-4 h-4" />
            <span>{{ $t('startCleaning') }}</span>
          </button>
          <button
            @click="markAsClean"
            class="flex-1 px-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <CheckCircle class="w-4 h-4" />
            <span>{{ $t('markClean') }}</span>
          </button>
        </div>

        <!-- Terminer le nettoyage -->
        <button
          v-if="statusConfig.actions.includes('cleaned')"
          @click="handleMarkCleaned"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <CheckCircle class="w-4 h-4" />
          <span>{{ $t('cleaningCompleted') }}</span>
        </button>

        <!-- Inspection -->
        <button
          v-if="statusConfig.actions.includes('inspect')"
          @click="startInspection"
          class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <Search class="w-4 h-4" />
          <span>{{ $t('inspect') }}</span>
        </button>

        <!-- Remettre en service -->
        <button
          v-if="statusConfig.actions.includes('restore')"
          @click="restoreToService"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <RefreshCw class="w-4 h-4" />
          <span>{{ $t('restoreService') }}</span>
        </button>
      </div>

      <!-- Messages d'état -->
      <div v-if="statusConfig.statusMessage" class="mt-3 p-3 rounded-lg border" :class="statusConfig.statusMessage.classes">
        <p class="text-sm font-medium text-center flex items-center justify-center gap-2">
          <component :is="statusConfig.statusMessage.icon" class="w-4 h-4" :class="statusConfig.statusMessage.animate ? 'animate-spin' : ''" />
          {{ statusConfig.statusMessage.text }}
        </p>
        <p v-if="statusConfig.statusMessage.subtext" class="text-xs text-center mt-1 opacity-75">
          {{ statusConfig.statusMessage.subtext }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import {
  Wifi, Utensils, Bed, Car, Sun, Coffee, Tv, LogIn, LogOut, Wrench,
  PlusCircle, CheckCircle, Calendar, Clock, User, Settings, AlertTriangle,
  Sparkles, Search, RefreshCw, Loader2, X
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const store = useBookingStore()

const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  isCheckingIn: {
    type: Boolean,
    default: false
  },
  isCheckingOut: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits([
  'change', 'checkin', 'checkout', 'cleaned', 'request-status-change',
  'maintenance-set', 'out_of_order', 'restore-service'
])

// État local

const showCleaningHistory = ref(false)


// Configuration des statuts professionnels
const getStatusConfigurations = computed(() => ({
  available: {
    text: t('statut.available'),
    classes: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle,
    actions: ['book'],
    pulse: false
  },

  booked: {
    text: t('statut.booked'),
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Calendar,
    actions: ['checkin'],
    pulse: false,
    alert: {
      message: t('guestArriving'),
      classes: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: Clock
    }
  },

  occupied: {
    text: t('statut.occupied'),
    classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: User,
    actions: ['checkout'],
    pulse: false,
    statusMessage: {
      text: t('guestPresent'),
      classes: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      icon: User
    }
  },

  'pre-checkout': {
    text: t('statut.preCheckout'),
    classes: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Clock,
    actions: ['checkout'],
    pulse: true,
    alert: {
      message: t('checkoutTime'),
      classes: 'bg-orange-50 border-orange-200 text-orange-700',
      icon: Clock
    }
  },

  'checkout-pending': {
    text: t('statut.checkoutPending'),
    classes: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: LogOut,
    actions: ['inspect'],
    pulse: true,
    statusMessage: {
      text: t('awaitingInspection'),
      classes: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      icon: Search
    }
  },

  dirty: {
    text: t('statut.dirty'),
    classes: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertTriangle,
    actions: ['cleaning'],
    pulse: false,
    statusMessage: {
      text: t('needsCleaning'),
      classes: 'bg-red-50 border-red-200 text-red-700',
      icon: AlertTriangle
    }
  },

  cleaning: {
    text: t('statut.cleaning'),
    classes: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Sparkles,
    actions: ['cleaned'],
    pulse: false,
    statusMessage: {
      text: t('cleaningInProgress'),
      classes: 'bg-purple-50 border-purple-200 text-purple-700',
      icon: Sparkles,
      animate: true
    }
  },

  clean: {
    text: t('statut.clean'),
    classes: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle,
    actions: ['book'],
    pulse: false,
    statusMessage: {
      text: t('readyForGuest'),
      classes: 'bg-green-50 border-green-200 text-green-700',
      icon: CheckCircle
    }
  },

  maintenance: {
    text: t('statut.maintenance'),
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Wrench,
    actions: ['restore'],
    pulse: false,
    statusMessage: {
      text: t('underMaintenance'),
      classes: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: Wrench
    }
  },

  'out_of_order': {
    text: t('statut.outOfOrder'),
    classes: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertTriangle,
    actions: ['restore'],
    pulse: true,
    alert: {
      message: t('roomOutOfOrder'),
      classes: 'bg-red-50 border-red-200 text-red-700',
      icon: AlertTriangle
    }
  }
}))

// Configuration des options et équipements
const optionLabels = {
  option_2: 'Type de lit',
  option_3: 'Vue',
  option_4: 'Petit-déjeuner inclus',
  option_5: 'WiFi',
  option_6: 'Climatisation',
  option_7: 'Parking',
  option_8: 'Service de chambre',
}

const iconsMap = {
  option_2: Bed,
  option_3: Sun,
  option_4: Coffee,
  option_5: Wifi,
  option_6: Car,
  option_7: Utensils,
  option_8: Utensils,
}

const equipmentIcons = {
  'TV écran plat': Tv,
  'Mini-bar': Utensils,
  'WiFi': Wifi,
  'Climatisation': Car,
}

// Computed properties
const statusConfig = computed(() => {
  return getStatusConfigurations.value[props.room.status] || getStatusConfigurations.value.available;
});


const displayedOptions = computed(() => {
  return Object.entries(optionLabels)
    .filter(([key]) => props.room[key] !== undefined && props.room[key] !== null)
    .slice(0, 4)
    .map(([key, label]) => ({
      key,
      label,
      value: props.room[key],
      Icon: iconsMap[key],
    }))
})

const availabilityInfo = computed(() => {
  const { status, nextAvailable, checkOutTime } = props.room

  if (!nextAvailable) return null

  const configs = {
    booked: {
      message: `${t('availableAfter')} ${formatDate(nextAvailable)}`,
      classes: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    // occupied: {
    //   message: `${t('checkoutScheduled')} ${formatDate(checkOutTime)}`,
    //   classes: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    // },
    maintenance: {
      message: `${t('maintenanceUntil')} ${formatDate(nextAvailable)}`,
      classes: 'bg-amber-50 border-amber-200 text-amber-700'
    }
  }

  return configs[status] || null
})

// Méthodes
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    urgent: 'text-red-600'
  }
  return colors[priority] || 'text-gray-600'
}

// Actions
const goToBooking = () => {
  store.setRoom(props.room)
  router.push('/add_booking')
}

const handleCheckIn = () => {
  emit('checkin', props.room)
}

const handleCheckOut = () => {
  emit('checkout', props.room)
}

const handleMarkCleaned = () => {
  emit('cleaned', props.room)
}


const setOutOfOrder = () => {
  emit('out-of-order', props.room)
}

const restoreToService = () => {
  emit('restore-service', props.room)
}

const startCleaning = () => {
  emit('change', { room: props.room, status: 'cleaning' })
}

const markAsClean = () => {
  emit('change', { room: props.room, status: 'clean' })
}

const startInspection = () => {
  // Logique d'inspection - peut ouvrir un modal ou naviguer vers une page d'inspection
  emit('change', { room: props.room, status: 'dirty' }) // Exemple: marquer comme sale si inspection échoue
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

/* Transition pour les changements de statut */
.group {
  transition: all 0.3s ease;
}

.group:hover {
  transform: translateY(-2px);
}

/* Styles pour le modal */
.fixed {
  backdrop-filter: blur(4px);
}
</style>
