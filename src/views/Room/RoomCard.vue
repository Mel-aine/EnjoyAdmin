<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 group hover:border-gray-200 transform hover:-translate-y-1">

    <!-- Header avec gradient subtil -->
    <div class="relative px-6 pt-6 pb-4 bg-gradient-to-br from-white to-gray-50/50">
      <div class="flex items-start justify-between">
        <!-- Info principale -->
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900 mb-1 tracking-tight">
            {{ $t (room.productName || room.name) }}
            <span v-if="room.roomNumber" class="ml-2 text-lg font-medium text-gray-600">
              #{{ $t (room.roomNumber) }}
            </span>
          </h3>
          <p class="text-sm text-gray-600 font-medium">
            {{$t (room.roomType.roomTypeName) }}
          </p>
        </div>

        <!-- Badge de statut moderne -->
        <div
          :class="[
            statusConfig.classes,
            'px-3 py-2 rounded-xl text-xs font-semibold border backdrop-blur-sm',
            'flex items-center gap-2 shadow-sm min-w-0',
            statusConfig.pulse ? 'animate-pulse' : ''
          ]"
        >
          <component :is="statusConfig.icon" class="w-4 h-4 flex-shrink-0" />
          <span class="truncate">{{$t (statusConfig.text) }}</span>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="px-6 pb-6 space-y-4">

      <!-- Informations client (si occupée) -->
      <div v-if="room.guestName && room.status === 'occupied'"
           class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="font-semibold text-gray-900">{{ $t (room.guestName)}}</p>
            <p class="text-xs text-gray-600">{{ $t('currentGuest') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div v-if="room.checkInTime" class="flex items-center gap-2 text-sm text-gray-700">
            <LogIn class="w-4 h-4 text-green-600" />
            <div>
              <p class="text-xs text-gray-500 whitespace-nowrap">{{ $t('CheckIn') }}</p>
              <p class="font-medium">{{ formatDate(room.checkInTime) }}</p>
            </div>
          </div>
          <div v-if="room.checkOutTime" class="flex items-center gap-2 text-sm text-gray-700">
            <LogOut class="w-4 h-4 text-orange-600" />
            <div>
              <p class="text-xs text-gray-500 whitespace-nowrap">{{ $t('planned') }}</p>
              <p class="font-medium">{{ formatDate(room.checkOutTime) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertes importantes -->
      <div v-if="statusConfig.alert"
           class="p-4 rounded-xl border-l-4"
           :class="statusConfig.alert.classes">
        <div class="flex items-start gap-3">
          <component :is="statusConfig.alert.icon" class="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p class="font-semibold text-sm">{{ statusConfig.alert.message }}</p>
            <p v-if="statusConfig.alert.subtext" class="text-xs mt-1 opacity-80">
              {{ statusConfig.alert.subtext }}
            </p>
          </div>
        </div>
      </div>

      <!-- Maintenance -->
      <div v-if="room.maintenanceInfo && (room.status === 'maintenance' || room.status === 'out_of_order')"
           class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Wrench class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 class="font-semibold text-amber-900">Maintenance en cours</h4>
            <p class="text-xs text-amber-700">{{ $t(`reasons.${room.maintenanceInfo.reason}`) }}</p>
          </div>
        </div>

        <div class="space-y-1 text-sm text-amber-800">
          <div class="flex justify-between">
            <span class="text-amber-600">{{$t('Début')}}:</span>
            <span class="font-medium">{{ formatDateTime(room.maintenanceInfo.startDate) }}</span>
          </div>
          <div v-if="room.maintenanceInfo.endDate" class="flex justify-between">
            <span class="text-amber-600">{{$t('Fin prévue:')}}</span>
            <span class="font-medium">{{ formatDateTime(room.maintenanceInfo.endDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Commodités et équipements dans une grille moderne -->
      <div v-if="displayedOptions.length || room.equipment?.length" class="space-y-3">

        <!-- Options de chambre -->
        <div v-if="displayedOptions.length">
          <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Configuration
          </h4>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="option in displayedOptions" :key="option.key"
                 class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <component :is="option.Icon" class="w-4 h-4 text-gray-600" />
              <span class="text-sm text-gray-700 font-medium">{{ $t(`options.values.${option.value}`) }}</span>
            </div>
          </div>
        </div>

        <!-- Équipements -->
        <div v-if="room.equipment?.length">
          <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Équipements
          </h4>
          <div class="flex flex-wrap gap-2">
            <div v-for="item in room.equipment" :key="item"
                 class="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-sm text-gray-700 hover:from-gray-100 hover:to-gray-200 transition-all cursor-default">
              <component v-if="equipmentIcons[item]" :is="equipmentIcons[item]" class="w-4 h-4 text-gray-500" />
              <span class="font-medium">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Disponibilité -->
      <div v-if="availabilityInfo"
           class="p-3 rounded-xl border-l-4"
           :class="availabilityInfo.classes">
        <div class="flex items-center gap-3">
          <Clock class="w-5 h-5" />
          <span class="font-medium text-sm">{{ availabilityInfo.message }}</span>
        </div>
      </div>

      <!-- Historique de nettoyage (version compacte) -->
      <div v-if="room.cleaningHistory?.length && showCleaningHistory"
           class="p-3 bg-gray-50 rounded-xl border border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg class="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-700">Historique nettoyage</span>
          </div>
          <button @click="showCleaningHistory = false"
                  class="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X class="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div class="space-y-1">
          <div v-for="cleaning in room.cleaningHistory.slice(0, 2)" :key="cleaning.id"
               class="flex justify-between items-center py-1">
            <span class="text-sm text-gray-600">{{ cleaning.type }}</span>
            <span class="text-xs text-gray-500 font-medium">{{ formatDate(cleaning.date) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer avec actions -->
    <div v-if="statusConfig.statusMessage"
         class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100">
      <div class="p-3 rounded-xl" :class="statusConfig.statusMessage.classes">
        <div class="flex items-center justify-center gap-3">
          <component :is="statusConfig.statusMessage.icon"
                     class="w-5 h-5"
                     :class="statusConfig.statusMessage.animate ? 'animate-spin' : ''" />
          <div class="text-center">
            <p class="font-semibold text-sm">{{ statusConfig.statusMessage.text }}</p>
            <p v-if="statusConfig.statusMessage.subtext"
               class="text-xs mt-1 opacity-75">
              {{ statusConfig.statusMessage.subtext }}
            </p>
          </div>
        </div>
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
import { useI18n } from 'vue-i18n'


const { t,locale } = useI18n()


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


const formatDate = (dateStr, currentLocale = locale.value) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(currentLocale, {
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
