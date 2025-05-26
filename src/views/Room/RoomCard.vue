<!-- <template>
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">

      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">{{ room.name }}</h3>
        <div class="flex items-center space-x-2">
          <span
            :class="statusClasses"
            class="px-3 py-1 rounded-full text-xs font-medium"
          >
            {{ statusText }}
          </span>
          <button
            @click="toggleStatus"
            :class="toggleButtonClasses"
            class="p-2 rounded-full transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="room.status === 'available' ? 'M6 18L18 6M6 6l12 12' : 'M5 13l4 4L19 7'">
              </path>
            </svg>
          </button>
        </div>
      </div>


      <div class="space-y-3 mb-4">
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
          </svg>
          Capacité: {{ room.capacity }} personnes
        </div>

        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
            </path>
          </svg>
          Type: {{ room.type }}
        </div>

        <div v-if="room.equipment && room.equipment.length > 0" class="flex items-start text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
            </path>
          </svg>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="item in room.equipment"
              :key="item"
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>


      <div v-if="room.price" class="flex items-center justify-between pt-4 border-t border-gray-200">
        <span class="text-sm text-gray-500">Prix par nuit</span>
        <span class="text-lg font-bold text-green-600">{{ room.price }}FCFA</span>
      </div>


      <div v-if="room.status === 'booked' && room.nextAvailable" class="mt-3 p-3 bg-yellow-50 rounded-md">
        <p class="text-sm text-yellow-800">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
          Disponible à {{ room.nextAvailable }}
        </p>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { computed } from 'vue'

  // Types
  interface Room {
    id: string | number
    name: string
    status: 'available' | 'booked' | 'maintenance'
    capacity: number
    type: string
    equipment?: string[]
    price?: number
    nextAvailable?: string
  }

  // Props
  interface Props {
    room: Room
  }

  const props = defineProps<Props>()

  // Emits
  const emit = defineEmits<{
    'status-change': [room: Room, newStatus: Room['status']]
  }>()

  // Computed properties
  const statusText = computed(() => {
    switch (props.room.status) {
      case 'available':
        return 'available'
      case 'booked':
        return 'Booked'
      case 'maintenance':
        return 'Maintenance'
      default:
        return 'Inconnu'
    }
  })

  const statusClasses = computed(() => {
    switch (props.room.status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'booked':
        return 'bg-red-100 text-red-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  })

  const toggleButtonClasses = computed(() => {
    switch (props.room.status) {
      case 'available':
        return 'bg-red-100 text-red-600 hover:bg-red-200'
      case 'booked':
        return 'bg-green-100 text-green-600 hover:bg-green-200'
      case 'maintenance':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
  })

  // Methods
  const toggleStatus = () => {
    let newStatus: Room['status']

    switch (props.room.status) {
      case 'available':
        newStatus = 'booked'
        break
      case 'booked':
        newStatus = 'available'
        break
      case 'maintenance':
        newStatus = 'available'
        break
      default:
        newStatus = 'available'
    }

    emit('status-change', props.room, newStatus)
  }
  </script> -->
<!--
  <script setup lang="ts">
  import { computed } from 'vue'
  import { ArrowRightLeft, Users, Home, Wifi, Utensils, Bed, Car, Sun, Coffee, Tv, LogIn, LogOut, Wrench } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  import { useBookingStore } from '@/composables/booking'

  const router = useRouter()

  interface Room {
    id: string | number
    name?: string
    productName?: string
    status: 'available' | 'occupied' | 'booked' | 'maintenance' | 'cleaning' | 'checkout'
    capacity?: number
    type?: string
    equipment?: string[]
    price?: number
    nextAvailable?: string
    checkInTime?: string
    checkOutTime?: string
    guestName?: string
    [key: string]: any
  }

  const props = defineProps<{ room: Room }>()

  // const emit = defineEmits<{
  //   'change': (room: Room, newStatus: Room['status']) => void
  //   'checkin': (room: Room) => void
  //   'checkout': (room: Room) => void
  // }>()

  const emit = defineEmits<{
  change: (payload: { room: Room; status: Room['status'] }) => void
  checkin: (room: Room) => void
  checkout: (room: Room) => void
}>()


  const optionLabels: Record<string, string> = {
    option_1: "Type de chambre",
    option_2: "Type de lit",
    option_3: "Vue",
    option_4: "Petit-déjeuner inclus",
    option_5: "WiFi",
    option_6: "Climatisation",
    option_7: "Parking",
    option_8: "Service de chambre",
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
      .filter(([key]) => props.room[key as keyof Room] !== undefined && props.room[key as keyof Room] !== null)
      .map(([key, label]) => ({
        key,
        label,
        value: props.room[key as keyof Room],
        Icon: iconsMap[key as keyof typeof iconsMap],
      }))
  })

  const equipmentIcons: Record<string, any> = {
    'TV écran plat': Tv,
    'Mini-bar': Utensils,
    'WiFi': Wifi,
    'Climatisation': Car,
  }

  const statusConfig = computed(() => {
    switch (props.room.status) {
      case 'available':
        return {
          text: 'Disponible',
          classes: 'bg-emerald-600 text-white',
          canBook: true,
          canCheckIn: false,
          canCheckOut: false
        }
      case 'booked':
        return {
          text: 'Réservé',
          classes: 'bg-blue-600 text-white',
          canBook: false,
          canCheckIn: true,
          canCheckOut: false
        }
      case 'occupied':
        return {
          text: 'Occupé',
          classes: 'bg-rose-600 text-white',
          canBook: false,
          canCheckIn: false,
          canCheckOut: true
        }
      case 'checkout':
        return {
          text: 'Libération',
          classes: 'bg-orange-500 text-white',
          canBook: false,
          canCheckIn: false,
          canCheckOut: false
        }
      case 'cleaning':
        return {
          text: 'Nettoyage',
          classes: 'bg-purple-500 text-white',
          canBook: false,
          canCheckIn: false,
          canCheckOut: false
        }
      case 'maintenance':
        return {
          text: 'Entretien',
          classes: 'bg-amber-500 text-black',
          canBook: false,
          canCheckIn: false,
          canCheckOut: false
        }
      default:
        return {
          text: 'Inconnu',
          classes: 'bg-gray-500 text-white',
          canBook: false,
          canCheckIn: false,
          canCheckOut: false
        }
    }
  })

  // const toggleStatus = () => {
  //   let newStatus: Room['status']
  //   switch (props.room.status) {
  //     case 'available': newStatus = 'booked'; break
  //     case 'booked': newStatus = 'occupied'; break
  //     case 'occupied': newStatus = 'checkout'; break
  //     case 'checkout': newStatus = 'cleaning'; break
  //     case 'cleaning': newStatus = 'available'; break
  //     case 'maintenance': newStatus = 'available'; break
  //     default: newStatus = 'available'
  //   }
  //   emit('change', props.room, newStatus)
  // }

  const toggleStatus = () => {
  let newStatus: Room['status']
  switch (props.room.status) {
    case 'available': newStatus = 'booked'; break
    case 'booked': newStatus = 'occupied'; break
    case 'occupied': newStatus = 'checkout'; break
    case 'checkout': newStatus = 'cleaning'; break
    case 'cleaning': newStatus = 'available'; break
    case 'maintenance': newStatus = 'available'; break
    default: newStatus = 'available'
  }

  emit('change', {
    room: props.room,
    status: newStatus,
  })
}


  const handleCheckIn = () => {
    emit('checkin', props.room)
  }

  const handleCheckOut = () => {
    emit('checkout', props.room)
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const store = useBookingStore()

  const goToBooking = () => {
    store.setRoom(props.room)
    router.push('/add_booking')
  }
  </script> -->

  <script setup>
import { computed } from 'vue'
import { ArrowRightLeft, Users, Home, Wifi, Utensils, Bed, Car, Sun, Coffee, Tv, LogIn, LogOut, Wrench } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const props = defineProps({
  room: Object
})

const emit = defineEmits(['change', 'checkin', 'checkout','cleaned'])

const optionLabels = {
  option_1: "Type de chambre",
  option_2: "Type de lit",
  option_3: "Vue",
  option_4: "Petit-déjeuner inclus",
  option_5: "WiFi",
  option_6: "Climatisation",
  option_7: "Parking",
  option_8: "Service de chambre",
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
      Icon: iconsMap[key]
    }))
})

const equipmentIcons = {
  'TV écran plat': Tv,
  'Mini-bar': Utensils,
  'WiFi': Wifi,
  'Climatisation': Car,
}
// Fonction pure avec statut et t()
const getRoomStatusUI = (status, t) => {
  switch (status) {
    case 'available':
      return {
        text: t('roomStatus.available'),
        classes: 'bg-emerald-600 text-white',
        canBook: true,
        canCheckIn: true,
        canCheckOut: false
      }
    case 'booked':
      return {
        text: t('roomStatus.booked'),
        classes: 'bg-blue-600 text-white',
        canBook: false,
        canCheckIn: true,
        canCheckOut: false
      }
    case 'occupied':
      return {
        text: t('roomStatus.occupied'),
        classes: 'bg-rose-600 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: true
      }
    case 'checked-in':
      return {
        text: t('roomStatus.checked-in'),
        classes: 'bg-rose-800 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: true
      }
    case 'checkout':
      return {
        text: t('roomStatus.checkout'),
        classes: 'bg-orange-500 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false
      }
    case 'cleaning':
      return {
        text: t('roomStatus.cleaning'),
        classes: 'bg-purple-500 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false
      }
    case 'maintenance':
      return {
        text: t('roomStatus.maintenance'),
        classes: 'bg-amber-500 text-black',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false
      }
    default:
      return {
        text: t('roomStatus.unknown'),
        classes: 'bg-gray-500 text-white',
        canBook: false,
        canCheckIn: false,
        canCheckOut: false
      }
  }
}
const statusConfig = computed(() => getRoomStatusUI(props.room.status, t))

const toggleStatus = () => {
  let newStatus
  switch (props.room.status) {
    case 'available': newStatus = 'booked'; break
    case 'booked': newStatus = 'occupied'; break
    case 'occupied': newStatus = 'checkout'; break
    case 'checkout': newStatus = 'cleaning'; break
    case 'cleaning': newStatus = 'available'; break
    case 'maintenance': newStatus = 'available'; break
    default: newStatus = 'available'
  }

  emit('change', { room: props.room, status: newStatus })
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

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const store = useBookingStore()

const goToBooking = () => {
  store.setRoom(props.room)
  router.push('/add_booking')
}
</script>

  <template>
    <div class="group bg-white rounded-xl  shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100/70 hover:border-gray-200/90 relative overflow-hidden">

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
            :class="[statusConfig.classes, 'text-xs font-semibold px-2 py-1 rounded-full select-none shadow-sm']"
          >
            {{ statusConfig.text }}
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Status Toggle Button -->
          <button
            @click="toggleStatus"
            class="p-2 rounded-lg border border-gray-200/80 shadow-sm hover:bg-gray-50/50 backdrop-blur-sm transition-all"
            title="Changer le statut"
          >
            <ArrowRightLeft class="w-5 h-5 text-gray-600" />
          </button>

          <!-- Maintenance Button -->
          <button
            @click="emit('change', props.room, 'maintenance')"
            class="p-2 rounded-lg border border-gray-200/80 shadow-sm hover:bg-amber-50 text-amber-600 transition-all"
            title="Mettre en maintenance"
          >
            <Wrench class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Guest Info (if occupied) -->
      <div v-if="props.room.status === 'occupied' && props.room.guestName" class="mb-3 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm font-medium text-blue-900">
          Client : {{ props.room.guestName }}
        </p>
        <p v-if="props.room.checkInTime" class="text-xs text-blue-700">
          Arrivée : {{ formatDate(props.room.checkInTime) }}
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
        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Équipements</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="item in props.room.equipment" :key="item"
               class="px-3 py-1.5 bg-gray-50/50 rounded-full text-sm text-gray-600 flex items-center space-x-2">
            <component v-if="equipmentIcons[item]" :is="equipmentIcons[item]" class="w-4 h-4 text-gray-400" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- Next Available Info -->
      <div v-if="(props.room.status === 'booked' || props.room.status === 'occupied') && props.room.nextAvailable"
           class="mb-3 p-3 bg-yellow-50 rounded-md text-yellow-800 text-sm flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          {{ props.room.status === 'occupied' ? 'Départ prévu' : 'Disponible' }} :
          {{ formatDate(props.room.nextAvailable) }}
        </span>
      </div>

      <!-- Price & Action Buttons -->
      <div class="pt-4 border-t border-gray-100/70">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-500">À partir de</p>
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
            <span>Réserver</span>
          </button>

          <!-- Check-in Button -->
          <button
            v-if="statusConfig.canCheckIn"
            @click="handleCheckIn"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <LogIn class="w-4 h-4" />
            <span>Check-in</span>
          </button>

          <!-- Check-out Button -->
          <button
            v-if="statusConfig.canCheckOut"
            @click="handleCheckOut"
            class="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <LogOut class="w-4 h-4" />
            <span>Check-out</span>
          </button>
        </div>

        <!-- Status-specific messages -->
        <div v-if="props.room.status === 'cleaning'" class="  ">
          <p class="text-sm text-purple-700 font-medium bg-purple-50 rounded-md text-center mt-3 p-2">🧹 Nettoyage en cours...</p>
          <button class="text-sm text-purple-700 font-medium bg-purple-50 rounded-md text-center mt-3 p-2" @click="handleMarkCleaned">Nettoyage terminé</button>
        </div>



        <div v-else-if="props.room.status === 'checkout'" class="mt-3 p-2 bg-orange-50 rounded-md text-center">
          <p class="text-sm text-orange-700 font-medium">📋 Vérification en cours...</p>
        </div>

        <div v-else-if="props.room.status === 'maintenance'" class="mt-3 p-2 bg-amber-50 rounded-md text-center">
          <p class="text-sm text-amber-700 font-medium">🔧 Maintenance en cours</p>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 6px rgba(255,255,255,0); }
    50% { box-shadow: 0 0 12px rgba(255,255,255,0.6); }
  }
  .ribbon-glow {
    animation: pulseGlow 2.5s infinite;
  }
  </style>
