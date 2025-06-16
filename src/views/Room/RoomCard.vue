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
  option_1: 'Type de chambre',
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

const displayedOptions = computed(() => {
  return Object.entries(optionLabels)
    .filter(([key]) => props.room[key] !== undefined && props.room[key] !== null)
    .map(([key, label]) => ({
      key,
      label,
      value: props.room[key],
      Icon: iconsMap[key],
    }))
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

// const handleCheckOut = async () => {
//   try {
//     isCheckingOut.value = true
//     emit('checkout', props.room)
//   } finally {
//     isCheckingOut.value = false
//   }
// }
const handleCheckOut = async () => {
  emit('checkout', props.room)
}

const handleMarkCleaned = () => {
  emit('cleaned', props.room)
}

// function formatDate(dateStr) {
//   const d = new Date(dateStr)
//   return d.toLocaleDateString('fr-FR', {
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   })
// }

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
    class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100/70 hover:border-gray-200/90 relative overflow-hidden"
  >
    <!-- Status Ribbon -->
    <!-- <div class="absolute top-2 right-0 w-28 overflow-hidden">
        <div
          :class="[statusConfig.classes, 'text-sm font-semibold px-4 py-1 text-center transform rotate-45 translate-x-10 translate-y-3 shadow-md ribbon-glow']"
          style="backdrop-filter: blur(6px);"
        >
          {{ statusConfig.text }}
        </div>
      </div> -->

    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
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

      <div class="flex items-center space-x-2">
        <button
          @click="toggleStatus"
          class="p-2 rounded-lg border border-gray-200/80 shadow-sm hover:bg-gray-50/50 backdrop-blur-sm transition-all"
          title="Changer le statut"
        >
          <ArrowRightLeft class="w-5 h-5 text-gray-600" />
        </button>

        <button
          @click="emit('change', { room: props.room, status: 'maintenance' })"
          class="p-2 rounded-lg border border-gray-200/80 shadow-sm hover:bg-amber-50 text-amber-600 transition-all"
          title="Mettre en maintenance"
        >
          <Wrench class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Guest Info (if occupied) -->
    <div v-if="props.room.guestName" class="mb-3 p-2 bg-blue-50 rounded-lg">
      <p class="text-sm font-medium text-blue-900 inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cc53e4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> : {{ props.room.guestName }}</p>
      <p v-if="props.room.checkInTime" class="text-xs text-blue-700">
        {{ $t('arrive') }} : {{ formatDate(props.room.checkInTime) }}
      </p>
    </div>

    <!-- Room Options Grid -->
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

    <!-- Equipment -->
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

    <!-- Next Available Info -->
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

    <!-- Price & Action Buttons -->
    <div class="pt-4 border-t border-gray-100/70">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-sm text-gray-500">{{ $t('from') }}</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ props.room.price }} FCFA</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-2">
        <!-- Booking Button -->
        <button
          v-if="statusConfig.canBook"
          @click="goToBooking"
          class="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <span>{{ $t('book') }}</span>
        </button>

        <!-- Check-in Button -->
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

        <!-- Check-out Button -->
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
          <!-- <span>Check-out</span> -->
        </button>
      </div>

      <!-- Status-specific messages -->
      <div v-if="props.room.status === 'cleaning'" class="  ">
        <p class="text-sm text-purple-700 font-medium bg-purple-50 rounded-md text-center mt-3 p-2">
          🧹 {{ $t('cleaning...') }}
        </p>
        <div class="flex flex-col items-end">
        <button
          class="text-sm text-purple-700 font-medium bg-purple-50 rounded-full text-center mt-3 p-2"
          @click="handleMarkCleaned"
        >
          {{ $t('cleaning_completed') }}
        </button>
        </div>
      </div>

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
