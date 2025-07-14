<script setup>
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
  Settings,
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

const emit = defineEmits(['change', 'checkin', 'checkout', 'cleaned'])

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

const remainingCount = computed(() => {
  const total = allOptions.value.length
  return total > maxOptions ? total - maxOptions : 0
})

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
      <span
        :class="[
          statusConfig.classes,
          'text-xs font-semibold px-2 py-1 rounded-full select-none shadow-sm',
        ]"
      >
        {{ statusConfig.text }}
      </span>
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

      <!-- <div v-if="props.room.status === 'cleaning'" class="">
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
      </div> -->

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
