<template>
  <RightSideModal :is-open="isOpen" :title="$t('VoidReservation')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('VoidReservation') }}</h3>
    </template>

    <!-- Form -->
    <div class="px-4 py-6 space-y-6">
      <!-- Apply Charges On Section -->
      <div class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700 pb-2">
          {{ $t('ApplyChargesOn') }}:
        </h4>

        <!-- Radio Button Options -->
        <div class="space-y-3 flex justify-between">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              v-model="formData.applyChargesOn"
              value="group"
              class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">{{ $t('OnGroup') }}</span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              v-model="formData.applyChargesOn"
              value="selected"
              class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">{{ $t('SelectedReservations') }}</span>
          </label>
        </div>

        <!-- Reservations List -->
        <div class="mt-4 space-y-2">


          <div class="border rounded-lg p-3 max-h-80 overflow-y-auto bg-gray-50">
            <!-- Previously selected items (highlighted) -->
            <div v-if="previouslySelectedReservations.length > 0" class="">
              <div v-for="reservation in previouslySelectedReservations" :key="`prev-${reservation.roomId}`"
                   class="flex items-center space-x-2 py-2 hover:bg-gray-100   rounded mb-1 px-2">
                <input
                  type="checkbox"
                  :id="`prev-reservation-${reservation.roomId}`"
                  v-model="reservation.selected"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded "
                />
                <label :for="`prev-reservation-${reservation.roomId}`"
                       class="text-sm flex-1"
                     >
                  <div class="font-medium ">{{ reservation.name }}</div>
                  <div class="text-xs ">
                    {{ reservation.room }}
                  </div>

                </label>
              </div>
            </div>

            <!-- Other reservations -->
            <div v-if="otherReservations.length > 0" class="">
              <div v-for="reservation in otherReservations" :key="`other-${reservation.roomId}`"
                   class="flex items-center space-x-2 py-1 hover:bg-gray-100 rounded px-2">
                <input
                  type="checkbox"
                  :id="`other-reservation-${reservation.roomId}`"
                  v-model="reservation.selected"

                  class="w-4 h-4 text-blue-600 border-gray-300 rounded "

                />
                <label :for="`other-reservation-${reservation.roomId}`"
                       class="text-sm flex-1"
                     >
                  <div class="font-medium">{{ reservation.name }}</div>
                  <div class="text-xs text-gray-500">
                    {{ reservation.room }}
                  </div>

                </label>
              </div>
            </div>

            <!-- No reservations message -->
            <!-- <div v-if="allReservations.length === 0"
                 class="text-sm text-gray-500 italic p-3 bg-yellow-50 border border-yellow-200 rounded">
              {{ $t('NoReservationsAvailable') }}
            </div> -->
          </div>
        </div>
      </div>

      <!-- Change Owner Section -->
      <div class="space-y-3">
        <Select
          :lb="$t('ChangeOwner')"
          v-model="formData.changeOwner"
          :placeholder="$t('SelectOwner')"
          :options="owners"
        />
      </div>

      <!-- Reason Section -->
      <div>
        <AutoCompleteSelect
          v-model="formData.reason"
          :options="voidReasons"
          :defaultValue="$t('SelectReason')"
          :lb="$t('Reason')"
          :is-required="true"
          :use-dropdown="useDropdownReason"
          @update:useDropdown="useDropdownReason = $event"
          @clear-error="emit('clear-error')"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3 bg-gray-50">
        <BasicButton
          variant="secondary"
          @click="closeModal"
          :label="$t('Cancel')"
        />
        <BasicButton
          variant="danger"
          @click="handleVoidReservation"
          :label="$t('Void')"
          :loading="isVoiding"
          :disabled="isVoiding || !isFormValid"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import RightSideModal from '@/components/modal/RightSideModal.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useI18n } from 'vue-i18n'
import { getByCategory } from '@/services/configrationApi'
import { useToast } from 'vue-toastification'
import { voidReservation } from '@/services/reservation'

interface Reservation {
  roomId: number
  name: string
  room: string
  netAmount: number
  description: string
  selected: boolean
  wasPreSelected: boolean
  originalItem?: any
}

interface Owner {
  value: number
  label: string
}

interface VoidReason {
  value: number
  label: string
}

interface Props {
  isOpen: boolean
  reservationId: number
  selectedItems?: any[]
  allRoomCharges?: any[] // Toutes les données du tableau
}

interface VoidReservationData {
  reservationId: number
  selectedReservations: number[]
  reason: string
}


interface VoidReservationResponse {
  message: string
  reservationId: string
  isPartialVoid: boolean
  allRoomsVoided: boolean
  roomsVoided: string[]
  voidDetails: {
    originalStatus: string
    currentStatus: string
    voidedDate: string
    reason: string
    roomsVoidedCount: number
    totalRoomsInReservation: number
    foliosVoided: number
    voidedRoomIds: string[]
  }
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
  (e: 'clear-error'): void
  (e: 'void-success',data:any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Loading states
const isVoiding = ref(false)
const useDropdownReason = ref(true)
const { t } = useI18n()
const serviceStore = useServiceStore()
const toast = useToast()

// Form data
const formData = reactive({
  applyChargesOn: 'selected',
  changeOwner: '',
  reason: ''
})

// Reservations data
const allReservations = ref<Reservation[]>([])

const owners = ref<Owner[]>([
  { value: 1, label: 'John Doe' },
  { value: 2, label: 'Jane Smith' },
  { value: 3, label: 'Mike Johnson' }
])

const voidReasons = ref<VoidReason[]>([])

// Computed properties
const previouslySelectedReservations = computed(() => {
  return allReservations.value.filter(r => r.wasPreSelected)
})

const otherReservations = computed(() => {
  return allReservations.value.filter(r => !r.wasPreSelected)
})

const selectedCount = computed(() => {
  return allReservations.value.filter(r => r.selected).length
})

const totalCount = computed(() => {
  return allReservations.value.length
})

const isFormValid = computed(() => {
  return formData.reason !== '' && selectedCount.value > 0
})

const getSelectedReservationIds = computed(() => {
  return allReservations.value
    .filter(r => r.selected)
    .map(r => r.roomId)
})

// Utility functions
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount || 0).replace('XAF', 'XAF ')
}

// Methods
const selectAllReservations = () => {
  allReservations.value.forEach(reservation => {
    reservation.selected = true
  })
}

const deselectAllReservations = () => {
  allReservations.value.forEach(reservation => {
    reservation.selected = false
  })
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  Object.assign(formData, {
    applyChargesOn: 'selected',
    changeOwner: '',
    reason: ''
  })

  // Reset selected reservations to initial state
  allReservations.value.forEach(reservation => {
    reservation.selected = reservation.wasPreSelected
  })

  useDropdownReason.value = true
}




const handleVoidReservation = async () => {
  if (!isFormValid.value) {
    toast.error(t('Void reason is required'))
    return
  }

  isVoiding.value = true

  try {
    const voidData: VoidReservationData = {
      reservationId: props.reservationId,
      selectedReservations: getSelectedReservationIds.value,
      reason: formData.reason,
    }

    console.log('Voiding reservation with data:', voidData)

    const response: VoidReservationResponse = await voidReservation(voidData)

    if (response && response.message) {
      const successMessage = response.message.includes('successfully')
        ? response.message
        : t('reservation_void_successfully')

      toast.success(successMessage)
      
      if (response.voidDetails.foliosVoided > 0) {
        console.log(`- Folios voided: ${response.voidDetails.foliosVoided}`)
      }

      emit('void-success', {
        isPartialVoid: response.isPartialVoid,
        allRoomsVoided: response.allRoomsVoided,
        roomsVoided: response.roomsVoided,
        roomsCount: response.voidDetails.roomsVoidedCount
      })
      closeModal()
    } else {
      toast.error(t('error_voiding_reservation'))
    }

  } catch (error: any) {
    console.error('Error voiding reservation:', error)

    if (error.response) {
      const errorMessage = error.response.data?.message ||
                          error.response.data?.error ||
                          `${t('error_voiding_reservation')} (${error.response.status})`
      toast.error(errorMessage)
    } else if (error.request) {
      toast.error(t('network_error') || 'Erreur réseau')
    } else {
      toast.error(error.message || t('error_voiding_reservation'))
    }
  } finally {
    isVoiding.value = false
  }
}

// Load initial data
const loadInitialData = async () => {
  try {
    const hotel_id = serviceStore.serviceId
    if (!hotel_id) {
      throw new Error(t('HotelIdNotSet'))
    }

    // Load void reasons
    const reasonsResponse = await getByCategory(hotel_id, 'Void Reservation')
    const reasonsData = reasonsResponse.data

    if (Array.isArray(reasonsData)) {
      voidReasons.value = reasonsData.map((reason: any) => ({
        value: reason.reasonName || reason.name,
        label: reason.reasonName || reason.name
      }))
    }

    // Créer un Set des IDs des éléments sélectionnés pour comparaison rapide
    const selectedItemIds = new Set(
      (props.selectedItems || []).map(item => item.room?.roomId).filter(id => id)
    )

    // Utiliser allRoomCharges s'il est fourni, sinon utiliser selectedItems
    const sourceData = props.allRoomCharges || props.selectedItems || []

    // Mapper toutes les réservations disponibles
    allReservations.value = sourceData.map((item) => {
      const roomId = item.room?.roomId
      const wasPreSelected = selectedItemIds.has(roomId)

      return {
        roomId,
        name: `${item.room?.roomNumber || 'Room'} - ${item.room?.roomType || 'RoomType'}`,
        room: item.room?.roomNumber || '---',
        netAmount: item.netAmount || 0,
        description: item.description || item.rateType?.ratePlanName || '',
        selected: wasPreSelected, // Sélectionné par défaut si était dans la sélection initiale
        wasPreSelected, // Pour le groupage visuel
        originalItem: item
      }
    }).filter(reservation => reservation.roomId) // Filtrer ceux sans roomId valide

    console.log('All reservations loaded:', allReservations.value.length)
    console.log('Previously selected:', previouslySelectedReservations.value.length)

  } catch (error) {
    console.error('Error loading initial data:', error)
    toast.error(t('error_loading_data'))
  }
}

// Watch for changes in the applyChargesOn radio buttons
watch(() => formData.applyChargesOn, (newValue) => {
  if (newValue === 'group') {
    // Select all reservations
    selectAllReservations()
  }
  // Pour 'selected', on garde la sélection actuelle
})

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadInitialData()

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})

// Reset form when modal closes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadInitialData()
  }
})
</script>

<style scoped>
/* Custom styles for radio buttons */
input[type="radio"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

input[type="radio"]:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Custom styles for checkboxes */
input[type="checkbox"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

input[type="checkbox"]:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Scrollbar styling for reservation list */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Modal transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
