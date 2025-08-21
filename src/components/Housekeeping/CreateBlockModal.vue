<template>
  <RightSideModal :is-open="isOpen" :title="modalTitle" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ modalTitle }}</h3>
    </template>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      <span class="ml-2 text-sm text-gray-600">{{ $t('Processing') }}...</span>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
      <p class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- Form -->
    <div v-if="!isLoading" class="space-y-6">
      <!-- Room Type -->
      <div>
        <Select
          v-model="selectedRoomTypeId"
          :options="roomTypeOptions"
          :placeholder="$t('SelectRoomType')"
          :lb="$t('RoomType')"
        />
      </div>

      <!-- Room Selection -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {{ $t('RoomSelection') }} <span class="text-red-500">*</span>
        </label>
        <MultipleSelect
          v-model="formData.selectedRooms"
          :options="filteredRooms"
          :placeholder="$t('SelectRooms')"
          :label="$t('RoomSelection')"
        />
        <p v-if="validationErrors.selectedRooms" class="mt-1 text-xs text-red-500">
          {{ validationErrors.selectedRooms }}
        </p>
      </div>

      <!-- Date Range Blocks -->
      <div>
        <div
          v-for="(range, index) in formData.dateRanges"
          :key="`date-range-${index}`"
          class="mb-4 flex items-center justify-between space-x-4"
        >
          <div class="flex-1">
            <InputDoubleDatePicker
              :modelValue="formData.dateRanges[index]"
              @update:modelValue="updateDateRange(index, $event)"
              :title="$t('DateRange')"
            />
          </div>
          <!-- Afficher Remove seulement si ce n'est pas le premier input -->
          <button
            v-if="index > 0"
            type="button"
            class="text-red-500 hover:text-red-700"
            @click="removeDateRange(index)"
            title="Supprimer cette plage"
          >
            <Trash2 />
          </button>
        </div>

        <div class="w-25">
          <BasicButton
            variant="primary"
            @click="addDateRange"
            :label="$t('addRange')"
          />
        </div>
      </div>

      <!-- Status -->
      <div>
        <Select
          v-model="formData.status"
          :options="statusOptions"
          :placeholder="$t('status')"
          :lb="$t('Status')"
        />
      </div>

      <!-- Reason -->
      <div>
        <AutoCompleteSelect
          v-model="formData.reason"
          :options="reasonOptions"
          :placeholder="$t('SelectReason')"
          :lb="$t('Reason')"
          :is-required="true"
          :use-dropdown="useDropdownReason"
          @update:useDropdown="useDropdownReason = $event"
          @clear-error="emit('clear-error')"
        />
      </div>

      <!-- Conflict Warning -->
      <div v-if="conflictWarning" class="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">{{ $t('ConflictDetected') }}</h3>
            <p class="mt-1 text-sm text-yellow-700">{{ conflictWarning }}</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-4">
        <BasicButton
          variant="outline"
          @click="closeModal"
          :label="$t('Cancel')"
          :disabled="isLoading"
        />
        <BasicButton
          variant="primary"
          @click="saveBlock"
          :label="isEditing ? $t('UpdateBlock') : $t('CreateBlock')"
          :disabled="isLoading || !isFormValid"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification';
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import Select from '../forms/FormElements/Select.vue'
import MultipleSelect from '../forms/FormElements/MultipleSelect.vue'
import InputDoubleDatePicker from '../forms/FormElements/InputDoubleDatePicker.vue'
import AutoCompleteSelect from '../forms/FormElements/AutoCompleteSelect.vue'
import { Trash2 } from 'lucide-vue-next'
import { getRoomTypes } from '@/services/roomTypeApi'
import { getByCategory } from '@/services/configrationApi'
import { createRoomBlock } from '@/services/roomBlockApi'
import { useServiceStore } from '@/composables/serviceStore'

// Interfaces
interface MaintenanceBlock {
  id: string
  room: {
    id: string
    room_number: string
    room_type: {
      id: string
      name: string
    }
  }
  block_from_date: string
  block_to_date: string
  blocked_by_user: {
    id: string
    username: string
  }
  created_at: string
  reason: string
}

interface Props {
  isOpen: boolean
  blockData?: any | null
  isEditing?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
  (e: 'clear-error'): void
}

interface DateRange {
  start: string | null
  end: string | null
}

interface RoomOption {
  value: string | number;
  label: string;

}




const props = withDefaults(defineProps<Props>(), {
  blockData: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

// Composables
const { t } = useI18n()
const { success, error, warning } = useToast()
const serviceStore = useServiceStore()

// State
const isLoading = ref(false)
const conflictWarning = ref('')
const useDropdownReason = ref(true)
const selectedRoomTypeId = ref<number | null>(null)
const toast = useToast()

// Options
const roomTypeOptions = ref<{ value: number; label: string; [key: string]: any }[]>([])
const reasonOptions = ref([])
const errorMessage = ref<string>('')

const statusOptions = [
  { value: 'blocked', label: 'Bloqué' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'out_of_order', label: 'Hors service' },
  { value: 'available', label: 'Disponible' },
  { value: 'occupied', label: 'Occupé' },
  { value: 'dirty', label: 'Sale' }
]

// Form data
const formData = reactive({
  selectedRooms:  [] as RoomOption[],
  reason: '',
  status: 'blocked',
  dateRanges: [] as DateRange[],
})

// Validation
const validationErrors = reactive({
  selectedRooms: '',
  dateRanges: '',
  reason: ''
})

// Computed
const modalTitle = computed(() => {
  return props.isEditing ? t('UpdateBlock') : t('CreateBlock')
})

const filteredRooms = computed(() => {
  if (!selectedRoomTypeId.value) return []
  const roomType = roomTypeOptions.value.find(rt => rt.id === selectedRoomTypeId.value)
  return roomType
    ? roomType.rooms.map((room: any) => ({ value: room.id, label: room.roomNumber }))
    : []
})
const isFormValid = computed(() => {
  const hasServiceId = !!serviceStore.serviceId
  const hasRoomType = !!selectedRoomTypeId.value
  const hasSelectedRooms = formData.selectedRooms.length > 0
  const hasValidDateRanges = formData.dateRanges.some(range => range.start && range.end)
  const hasReason = formData.reason && formData.reason !== ''
  const noValidationErrors = Object.values(validationErrors).every(error => error === '')

  console.log('🔍 Form validity check:', {
    hasServiceId,
    hasRoomType,
    hasSelectedRooms,
    hasValidDateRanges,
    hasReason,
    noValidationErrors
  })

  return hasServiceId &&
         hasRoomType &&
         hasSelectedRooms &&
         hasValidDateRanges &&
         hasReason &&
         noValidationErrors
})

// Methods
const populateFormData = () => {
  if (props.blockData && props.isEditing) {
    formData.selectedRooms = [props.blockData.room.id]

    // S'assurer que les dates sont des strings
    formData.dateRanges = [{
      start: props.blockData?.block_from_date || null,
      end: props.blockData?.block_to_date || null
    }]

    formData.reason = props.blockData.reason

    // Définir le type de chambre
    if (props.blockData) {
      selectedRoomTypeId.value = Number(props.blockData.room.room_type.id)
    }
  } else {
    // Mode création - initialiser avec une plage vide
    if (formData.dateRanges.length === 0) {
      formData.dateRanges = [{ start: null, end: null }]
    }
  }
}

const resetForm = () => {
  formData.selectedRooms = []
  formData.reason = ''
  formData.status = 'blocked'
  formData.dateRanges = [{ start: null, end: null }] // Initialiser avec une plage vide
  selectedRoomTypeId.value = ''

  // Reset validation
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key as keyof typeof validationErrors] = ''
  })

  // Reset state
  errorMessage.value = ''
  conflictWarning.value = ''
  useDropdownReason.value = true
}


const validateForm = (): boolean => {
  console.log(' Début de la validation')

  // Reset errors
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key as keyof typeof validationErrors] = ''
  })

  let isValid = true

  // Validate hotel ID
  if (!serviceStore.serviceId) {
    console.error(' Service ID manquant')
    errorMessage.value = 'Service ID is required'
    isValid = false
  }

  // Validate room type selection
  if (!selectedRoomTypeId.value) {
    console.error(' Type de chambre non sélectionné')
    errorMessage.value = t('PleaseSelectRoomType')
    isValid = false
  }

  // Validate room selection
  if (formData.selectedRooms.length === 0) {
    console.error(' Aucune chambre sélectionnée')
    validationErrors.selectedRooms = t('PleaseSelectAtLeastOneRoom')
    isValid = false
  }

  // Validate date ranges
  const validDateRanges = formData.dateRanges.filter(range => range.start && range.end)
  if (validDateRanges.length === 0) {
    console.error('Aucune plage de dates valide')
    validationErrors.dateRanges = t('PleaseSelectAtLeastOneDateRange')
    isValid = false
  }

  // Validate reason
  if (!formData.reason || formData.reason === '') {
    console.error(' Raison manquante')
    validationErrors.reason = t('ReasonIsRequired')
    isValid = false
  }

  // Validate date logic
  for (let i = 0; i < validDateRanges.length; i++) {
    const range = validDateRanges[i]
    if (new Date(range.start!) >= new Date(range.end!)) {
      console.error(' Date de fin antérieure à la date de début')
      validationErrors.dateRanges = t('EndDateMustBeAfterStartDate')
      isValid = false
      break
    }
  }

  console.log(' Résultat de la validation:', isValid)
  console.log('📋Données du formulaire:', {
    serviceId: serviceStore.serviceId,
    roomTypeId: selectedRoomTypeId.value,
    selectedRooms: formData.selectedRooms,
    dateRanges: formData.dateRanges,
    reason: formData.reason,
    status: formData.status
  })

  return isValid
}


// const saveBlock = async () => {
//   console.log('🔧 Début de saveBlock')
//   console.log('📝 Form data:', formData)
//   console.log('🏠 Selected rooms:', formData.selectedRooms)
//   console.log('📅 Date ranges:', formData.dateRanges)
//   console.log('🎯 Selected room type ID:', selectedRoomTypeId.value)

//   if (!validateForm()) {
//     console.error('❌ Validation échouée')
//     error(t('PleaseCorrectFormErrors'))
//     return
//   }

//   console.log('✅ Validation réussie, début du processus de sauvegarde')
//   isLoading.value = true
//   errorMessage.value = ''

//   try {
//     const validDateRanges = formData.dateRanges.filter(range => range.start && range.end)
//     console.log(' Valid date ranges:', validDateRanges)

//     if (validDateRanges.length === 0) {
//       error(t('PleaseSelectAtLeastOneDateRange'))
//       return
//     }

//     if (formData.selectedRooms.length === 0) {
//       error(t('PleaseSelectAtLeastOneRoom'))
//       return
//     }

//     if (props.isEditing && props.blockData) {
//       console.log('🔄 Mode édition')
//       try {
//         // Logique d'édition à implémenter
//         emit('save', { updated: true })
//         success(t('BlockUpdatedSuccessfully'))
//       } catch (err: any) {
//         console.error('❌ Erreur update:', err)
//         error(err.message || t('ErrorUpdatingBlock'))
//       }
//     } else {
//       console.log('➕ Mode création')
//       console.log(`🏨 Service ID: ${serviceStore.serviceId}`)

//       for (const room of formData.selectedRooms) {
//         const roomId = room.value

//         for (const range of validDateRanges) {
//           const payload = {
//             hotel_id: serviceStore.serviceId,
//             room_type_id: selectedRoomTypeId.value,
//             status: formData.status,
//             room_id: roomId,
//             block_from_date: range.start,
//             block_to_date: range.end,
//             reason: formData.reason,
//           }

//           // Vérifications des valeurs requises
//           if (!payload.hotel_id) {
//             error(`Hotel ID manquant`)
//             continue
//           }
//           if (!payload.room_type_id) {
//             error(`Room type ID manquant pour la chambre ${roomId}`)
//             continue
//           }

//           try {
//             console.log(`🛏️ Création bloc pour la chambre ${roomId}`)
//             const response = await createRoomBlock(payload)

//             if (response?.data?.success) {
//               success(`Bloc créé pour la chambre ${roomId}`)
//             } else {
//               const msg = response?.data?.message || 'Erreur inconnue'
//               error(`Chambre ${roomId}: ${msg}`)
//             }
//           } catch (err: any) {
//             const errorMsg = err.response?.data?.message || err.message || 'Erreur inconnue'
//             error(`Chambre ${roomId}: ${errorMsg}`)
//           }
//         }
//       }

//       resetForm()
//       emit('save', { updated: false })
//       closeModal()
//     }

//   } catch (err: any) {
//     console.error(' Erreur globale saveBlock:', err)
//     error(err.message || t('ErrorSavingBlock'))
//   } finally {
//     console.log('🏁 Fin de saveBlock')
//     isLoading.value = false
//   }
// }

const saveBlock = async () => {
  isLoading.value = true
  errorMessage.value = ''

  if (!validateForm()) {
    error(t('PleaseCorrectFormErrors'))
    isLoading.value = false
    return
  }

  const validDateRanges = formData.dateRanges.filter(r => r.start && r.end)
  if (validDateRanges.length === 0) {
    error(t('PleaseSelectAtLeastOneDateRange'))
    isLoading.value = false
    return
  }

  if (formData.selectedRooms.length === 0) {
    error(t('PleaseSelectAtLeastOneRoom'))
    isLoading.value = false
    return
  }

  try {
    let successCount = 0
    let errorCount = 0

    for (const room of formData.selectedRooms) {
      const roomId = room.value
      for (const range of validDateRanges) {
        const payload = {
          hotel_id: serviceStore.serviceId,
          room_type_id: selectedRoomTypeId.value,
          status: formData.status,
          room_id: roomId,
          block_from_date: range.start,
          block_to_date: range.end,
          reason: formData.reason,
        }

        try {
          const response = await createRoomBlock(payload)

          // Vérifier différentes structures de réponse possibles
          const isSuccess =
            (response?.data?.success) ||
            (response?.status === 201) ||
            (response?.status === 200) ||
            (response?.data?.id)

          if (isSuccess) {
            console.log(`Bloc créé pour la chambre ${roomId}`, payload)
            successCount++
          } else {
            const msg = response?.data?.message || response?.data?.error || 'Erreur inconnue'
            error(`Erreur pour la chambre ${roomId}: ${msg}`)
            errorCount++
            console.error(`Erreur pour la chambre ${roomId}:`, response?.data)
          }
        } catch (err: any) {
          // Gestion plus détaillée des erreurs
          const apiMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Erreur inconnue'

          error(`Erreur pour la chambre ${roomId}: ${apiMessage}`)
          errorCount++
          console.error(`Erreur API pour la chambre ${roomId}:`, err.response?.data || err)
        }
      }
    }

    // Afficher un résumé
    if (successCount > 0) {
      success(`${successCount} bloc(s) créé(s) avec succès`)
    }

    if (errorCount > 0) {
      error(`${errorCount} erreur(s) lors de la création des blocs`)
    }

    // Réinitialiser seulement si au moins un bloc a été créé
    if (successCount > 0) {
      resetForm()
      emit('save', { updated: true, successCount, errorCount })
      closeModal()
    }
  } catch (err: any) {
    error(err.message || t('ErrorSavingBlock'))
  } finally {
    isLoading.value = false
  }
}





const updateDateRange = (index: number, newRange: { start: string|null, end: string|null }) => {
  console.log(` Updating date range ${index}:`, newRange)

  // Créer une nouvelle copie de l'array pour éviter la mutation directe
  const newDateRanges = [...formData.dateRanges]
  newDateRanges[index] = { ...newRange }
  formData.dateRanges = newDateRanges
}






const closeModal = () => {
  resetForm()
  emit('close')
}

const addDateRange = () => {
  formData.dateRanges.push({ start: null, end: null })
}

const removeDateRange = (index: number) => {
  if (formData.dateRanges.length > 1) {
    formData.dateRanges.splice(index, 1)
  }
}

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    populateFormData()
  }
})

watch(() => props.blockData, () => {
  if (props.isOpen) {
    populateFormData()
  }
}, { deep: true })

watch(selectedRoomTypeId, () => {
  formData.selectedRooms = []
})

// Load data on mount
onMounted(async () => {
  try {
    const hotel_id = serviceStore.serviceId
    if (!hotel_id) throw new Error('Hotel ID is not set')

    // Load room types
    const roomTypesResponse = await getRoomTypes(hotel_id)
    const roomTypesData = roomTypesResponse.data.data.data

    roomTypeOptions.value = roomTypesData.map((type: any) => ({
      ...type,
      value: type.id,
      label: type.roomTypeName
    }))

    // Load reasons
    const reasonsResponse = await getByCategory(hotel_id, 'Maintenance Block')
    reasonOptions.value = reasonsResponse.data.map((reason: any) => ({
      value: reason.reasonName,
      label: reason.reasonName
    }))

  } catch (err: any) {
    console.error('Error loading data:', err)
    error(t('ErrorLoadingData'))
  }
})

// Initialize form data if editing
onMounted(() => {
  if (props.isOpen && props.blockData) {
    populateFormData()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
