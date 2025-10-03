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
        <ReasonSelector
          v-model="formData.reason"
          :category="'Void Reservation'"
          :label="$t('Reason')"
          :is-required="true"
          @reason-added="handleReasonAdded"
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
import ReasonSelector from '@/components/common/ReasonSelector.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

// Interface pour les réservations
interface Reservation {
  roomId: number
  name: string
  room: string
  netAmount: number
  description: string
  selected: boolean
  wasPreSelected: boolean
  originalItem?: Record<string, unknown>
}

interface Props {
  isOpen: boolean
  reservationId: number
  selectedItems?: Array<{
    id: number
    [key: string]: unknown
  }>
  allRoomCharges?: Array<{
    id: number
    [key: string]: unknown
  }>
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: Record<string, unknown>): void
  (e: 'clear-error'): void
  (e: 'void-success', data: {
    reservationIds: number[]
    reason: string
    changeOwner: string
  }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Initialisation des états
const { t } = useI18n()
const toast = useToast()
const isVoiding = ref(false)

// Données du formulaire
const formData = reactive({
  applyChargesOn: 'selected',
  changeOwner: '',
  reason: ''
})

// Données des réservations
const allReservations = ref<Reservation[]>([])

// Liste des propriétaires (exemple)
const owners = ref([
  { value: 1, label: 'Propriétaire 1' },
  { value: 2, label: 'Propriétaire 2' },
  { value: 3, label: 'Propriétaire 3' }
])

// Propriétés calculées
const previouslySelectedReservations = computed(() => {
  return allReservations.value.filter(r => r.wasPreSelected)
})

const otherReservations = computed(() => {
  return allReservations.value.filter(r => !r.wasPreSelected)
})

const selectedCount = computed(() => {
  return allReservations.value.filter(r => r.selected).length
})

const isFormValid = computed(() => {
  return formData.reason !== '' && selectedCount.value > 0
})

// Gestion de l'ajout d'une raison personnalisée
const handleReasonAdded = (newReason: { value: string; label: string }) => {
  console.log('New reason added:', newReason)
  formData.reason = newReason.value
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
}

// Load initial data
const loadInitialData = async () => {
  try {
    // Charger les réservations
    allReservations.value = [
      // Exemple de données
      { roomId: 1, name: 'John Doe', room: '101', netAmount: 150, description: 'Standard Room', selected: true, wasPreSelected: true },
      { roomId: 2, name: 'Jane Smith', room: '102', netAmount: 200, description: 'Deluxe Room', selected: false, wasPreSelected: false },
    ]
  } catch (error) {
    console.error('Error loading initial data:', error)
    toast.error(t('error_loading_data'))
  }
}

// Watch for changes in the applyChargesOn radio buttons
watch(() => formData.applyChargesOn, (newValue) => {
  if (newValue === 'group') {
    // Select all reservations
    allReservations.value.forEach(reservation => {
      reservation.selected = true
    })
  }
  // Pour 'selected', on garde la sélection actuelle
}, { immediate: true })

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
  }
}

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadInitialData()
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('keydown', handleEscape)
  }

  // Cleanup function
  return () => {
    document.removeEventListener('keydown', handleEscape)
  }
})

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadInitialData()
  }
})

// Handle void reservation
const handleVoidReservation = async () => {
  if (!isFormValid.value) {
    toast.error(t('Please fill in all required fields'))
    return
  }

  try {
    isVoiding.value = true
    
    // Logique de traitement de l'annulation ici
    const selectedIds = allReservations.value
      .filter(r => r.selected)
      .map(r => r.roomId)

    // Émettre l'événement avec les données de l'annulation
    emit('void-success', {
      reservationIds: selectedIds,
      reason: formData.reason,
      changeOwner: formData.changeOwner
    })

    // Fermer la modale après un court délai
    setTimeout(() => {
      closeModal()
    }, 1000)
    
  } catch (error) {
    console.error('Error voiding reservation:', error)
    toast.error(t('error_voiding_reservation'))
  } finally {
    isVoiding.value = false
  }
}
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
