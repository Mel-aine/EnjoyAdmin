
<template>
  <div class="group   bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100/70 hover:border-gray-200/90 relative overflow-hidden min-h-[80px] flex flex-col justify-between w-full">

    <!-- En-tête avec nom et statut -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <div class="flex items-center space-x-2">
          <h3 class="text-xl font-semibold text-gray-900 tracking-tight">
            {{ room.productName || room.name }} {{ room.roomNumber ? `${room.roomNumber}` : '' }}
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
            <span class="text-xs whitespace-normal">{{ statusConfig.text }}</span>
          </button>
        </div>
        <p class="text-sm text-gray-700 mt-1">
          {{ room.roomType.roomTypeName }}
        </p>
      </div>

      <!-- Actions rapides -->
     <div class="flex items-center ml-2">
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
    <div v-if="room.guestName && room.status === 'occupied'" class="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
      <div class="flex items-center gap-2 mb-1">
        <User class="w-4 h-4 text-red-600" />
        <p class="text-sm font-medium text-red-900">{{ room.guestName }}</p>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs text-red-700">
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
         class="mb-1 p-2 bg-amber-50 rounded-lg border border-amber-200">
      <div class="flex items-center gap-2 mb-1">
        <Wrench class="w-4 h-4 text-amber-600" />
        <span class="text-sm font-medium text-amber-900">{{ $t('maintenanceDetails') }}</span>
      </div>
      <div class="space-y-1 text-xs text-amber-800">
        <p><strong>{{ $t('reason') }}:</strong> {{ $t(`reasons.${room.maintenanceInfo.reason}`) }}</p>
        <p><strong>{{ $t('startDate') }}:</strong> {{ formatDateTime(room.maintenanceInfo.startDate) }}</p>
        <p v-if="room.maintenanceInfo.endDate">
          <strong>{{ $t('endDate') }}:</strong> {{ formatDateTime(room.maintenanceInfo.endDate) }}
        </p>
      </div>
    </div>

    <!-- Options de la chambre -->
    <ul v-if="displayedOptions.length" class="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-700">
      <li v-for="option in displayedOptions" :key="option.key" class="flex items-center space-x-2">
        <component :is="option.Icon" class="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span>{{  $t(`options.values.${option.value}`) }}</span>
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
          :disabled="isLoading"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <component :is="isLoading ? Loader2 : RefreshCw" class="w-4 h-4 animate-spin" />
          <span>{{ isLoading ? $t('restoring') : $t('restoreService') }}</span>
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
    classes: 'bg-red-50 text-red-700 border-red-200',
    icon: User,
    actions: ['checkout'],
    pulse: false,
    statusMessage: {
      text: t('guestPresent'),
      classes: 'bg-red-50 border-red-200 text-red-700',
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
    classes: 'bg-red-50 text-orange-700 border-orange-200',
    icon: AlertTriangle,
    actions: ['cleaning'],
    pulse: false,
    statusMessage: {
      text: t('needsCleaning'),
      classes: 'bg-orange-50 border-orange-200 text-orange-700',
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

  available: {
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
    classes: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: AlertTriangle,
    actions: ['restore'],
    pulse: true,
    alert: {
      message: t('roomOutOfOrder'),
      classes: 'bg-gray-50 border-gray-200 text-gray-700',
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
  // emit('cleaned', props.room)
  emit('change', { room: props.room, status: 'available' })
}


const setOutOfOrder = () => {
  emit('out-of-order', props.room)
}

const isLoading = ref(false)

const restoreToService = async () => {
  isLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('change', { room: props.room, status: 'available' })
  } finally {
    isLoading.value = false
  }
}

const startCleaning = () => {
  emit('change', { room: props.room, status: 'cleaning' })
}

const markAsClean = () => {
  emit('change', { room: props.room, status: 'available' })
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
