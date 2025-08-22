<template>
  <RightSideModal :is-open="isOpen" :title="modalTitle" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ modalTitle }}</h3>
    </template>

    <!-- Loading indicator -->
    <!-- <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      <span class="ml-2 text-sm text-gray-600">{{ $t('Processing') }}...</span>
    </div> -->

    <!-- Error message -->
    <div v-if="errorMessage" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
      <p class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- Form -->
    <div  class="space-y-6">
      <!-- Room Type -->
      <div>
        <Select
          v-model="selectedRoomTypeId"
          :options="roomTypeOptions"
          :placeholder="$t('SelectRoomType')"
          :lb="$t('roomType')"
        />
      </div>

      <!-- Room Selection -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {{ $t('Room') }} <span class="text-red-500">*</span>
        </label>
        <MultipleSelect
        :key="`room-select-${selectedRoomTypeId}-${formData.selectedRooms.length}`"
          v-model="formData.selectedRooms"
          :options="filteredRooms"
          :placeholder="$t('SelectRooms')"

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
              :modelValue="range"
              @update:modelValue="updateDateRange(index, $event)"
              :title="$t('DateRange')"
              :allowPastDates="false"
              :is-required="true"
              @clear-error="clearDateRangeError(index)"
            />
          </div>
          <!-- Afficher Remove seulement si ce n'est pas le premier input -->
          <button
            v-if="formData.dateRanges.length > 1"
            type="button"
            class="text-red-500 hover:text-red-700 p-1 mt-6"
            @click="removeDateRange(index)"
            :title="$t('RemoveRange')"
          >
            <Trash2 :size="16" />
          </button>
        </div>

        <div class="w-30">
          <BasicButton
            variant="secondary"
            @click="addDateRange"
            :label="$t('addRange')"
            size="sm"
          />
        </div>

        <p v-if="validationErrors.dateRanges" class="mt-1 text-xs text-red-500">
          {{ validationErrors.dateRanges }}
        </p>
      </div>

      <!-- Status -->
      <div>
        <Select
          v-model="formData.status"
          :options="statusOptions"
          :placeholder="$t('SelectStatus')"
          :lb="$t('Status')"
        />
      </div>

      <!-- Reason -->
      <div>
        <AutoCompleteSelect
          v-model="formData.reason"
          :options="reasonOptions"
          :defaultValue="$t('SelectReason')"
          :lb="$t('Reason')"
          :is-required="true"
          :use-dropdown="useDropdownReason"
          @update:useDropdown="useDropdownReason = $event"
          @clear-error="emit('clear-error')"
        />
        <p v-if="validationErrors.reason" class="mt-1 text-xs text-red-500">
          {{ validationErrors.reason }}
        </p>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-end gap-4">
        <BasicButton
          variant="outline"
          @click="closeModal"
          :label="$t('Cancel')"
          :disabled="isLoading || isSaving"
        />
        <BasicButton
          variant="primary"
          @click="saveBlock"
          :label="isEditing ? $t('UpdateBlock') : $t('CreateBlock')"
          :disabled="!isFormValid || isSaving"
          :loading="isSaving"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted,nextTick } from 'vue'
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
import { createRoomBlock, updateRoomBlock } from '@/services/roomBlockApi'
import { useServiceStore } from '@/composables/serviceStore'

// Interfaces
interface MaintenanceBlock {
  id: string
  room: {
    id: string
    roomNumber: string
    roomType?: {
      id: string
      roomTypeName: string
    }
  }
  roomType: {
    id: string
    roomTypeName: string
  }
  blockFromDate: string
  blockToDate: string
  blockedBy: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  reason: string
  status: string
}

interface Props {
  isOpen: boolean
  blockData?: MaintenanceBlock | null
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
  value: string | number
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  blockData: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

// Composables
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// State
const isLoading = ref(false)
const isSaving = ref(false)
const useDropdownReason = ref(true)
const selectedRoomTypeId = ref<string | number | undefined>(undefined)

// Options
const roomTypeOptions = ref<{ value: number; label: string; [key: string]: any }[]>([])
const reasonOptions = ref<{ value: string; label: string }[]>([])
const errorMessage = ref<string>('')

const statusOptions = [
  { value: 'blocked', label: t('statuses.blocked') },
  { value: 'maintenance', label: t('statuses.maintenance') },
  { value: 'out_of_order', label: t('statuses.outOfOrder') },
  { value: 'available', label: t('statuses.available') },
  { value: 'occupied', label: t('statuses.occupied') },
  { value: 'dirty', label: t('statuses.dirty') }
]

// Form data
const formData = reactive({
  selectedRooms: [] as RoomOption[],
  reason: '',
  status: 'blocked',
  dateRanges: [{ start: null, end: null }] as DateRange[],
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
  return roomType?.rooms ? roomType.rooms.map((room: any) => ({
    value: room.id,
    label: room.roomNumber
  })) : []
})

const isFormValid = computed(() => {
  const hasServiceId = !!serviceStore.serviceId
  const hasRoomType = !!selectedRoomTypeId.value
  const hasSelectedRooms = formData.selectedRooms.length > 0
  const hasValidDateRanges = formData.dateRanges.some(range => range.start && range.end)
  const hasReason = formData.reason && formData.reason.trim() !== ''
  const noValidationErrors = Object.values(validationErrors).every(error => error === '')

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
    console.log('Populating form data for editing:', props.blockData)

    // Sélectionner le type de chambre - Correction
    const roomTypeId = props.blockData.roomType?.id || props.blockData.room?.roomType?.id
    if (roomTypeId) {
      selectedRoomTypeId.value = Number(roomTypeId)

      // Attendre que les options soient chargées et que Vue mette à jour le computed
      nextTick(() => {
        // Une fois que filteredRooms est mis à jour, sélectionner la chambre
        if (filteredRooms.value.length > 0) {
          const roomToSelect = filteredRooms.value.find(room =>
            room.value === props.blockData!.room.id
          )

          if (roomToSelect) {
            formData.selectedRooms = [roomToSelect]
            console.log('Room selected:', roomToSelect)
          }
        }
      })
    }

    // Définir les dates
    formData.dateRanges = [{
      start: props.blockData.blockFromDate || null,
      end: props.blockData.blockToDate || null
    }]

    formData.reason = props.blockData.reason || ''
    formData.status = props.blockData.status || 'blocked'
  } else {
    resetForm()
  }
}

const resetForm = () => {
  formData.selectedRooms = []
  formData.reason = ''
  formData.status = 'blocked'
  formData.dateRanges = [{ start: null, end: null }]
  selectedRoomTypeId.value = undefined

  // Reset validation
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key as keyof typeof validationErrors] = ''
  })

  // Reset state
  errorMessage.value = ''
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
    errorMessage.value = t('ServiceIdRequired')
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

  // Fonction de validation des dates (déclarée à l'intérieur)
  const validateDateRanges = (): boolean => {
    const validDateRanges = formData.dateRanges.filter(range => range.start && range.end)

    if (validDateRanges.length === 0) {
      validationErrors.dateRanges = t('PleaseSelectAtLeastOneDateRange')
      return false
    }

    // Vérifier la logique des dates
    for (let i = 0; i < validDateRanges.length; i++) {
      const range = validDateRanges[i]
      const startDate = new Date(range.start!)
      const endDate = new Date(range.end!)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Vérifier que les dates ne sont pas dans le passé
      if (startDate < today) {
        validationErrors.dateRanges = t('StartDateCannotBeInPast')
        return false
      }

      if (endDate < today) {
        validationErrors.dateRanges = t('EndDateCannotBeInPast')
        return false
      }

      // Vérifier que la date de fin est après la date de début
      if (startDate >= endDate) {
        validationErrors.dateRanges = t('EndDateMustBeAfterStartDate')
        return false
      }
    }

    return true
  }

  // Appeler la validation des dates
  if (!validateDateRanges()) {
    console.error(' Validation des dates échouée')
    isValid = false
  }

  // Validate reason
  if (!formData.reason || formData.reason.trim() === '') {
    console.error(' Raison manquante')
    validationErrors.reason = t('ReasonIsRequired')
    isValid = false
  }

  console.log(' Résultat de la validation:', isValid)
  return isValid
}

const saveBlock = async () => {
  console.log(' Début de saveBlock')

  if (!validateForm()) {
    console.error(' Validation échouée')
    toast.error(t('PleaseCorrectFormErrors'))
    return
  }

  isSaving.value = true
  errorMessage.value = ''

  try {
    const validDateRanges = formData.dateRanges.filter(range => range.start && range.end)

    if (props.isEditing && props.blockData) {

      console.log(' Mode édition')

      const updateData = {
        room_id: formData.selectedRooms[0]?.value,
        block_from_date: validDateRanges[0]?.start,
        block_to_date: validDateRanges[0]?.end,
        reason: formData.reason.trim(),
        status: formData.status
      }

      try {
        const response = await updateRoomBlock(props.blockData.id, updateData)
        console.log(' Block mis à jour:', response.data)

        toast.success(t('BlockUpdatedSuccessfully'))
        emit('save', {
          isEditing: true,
          updated: true,
          data: response.data
        })
        closeModal()
      } catch (err: any) {
        console.error(' Erreur update:', err)

        // Gestion spécifique de l'erreur 409
        if (err.response?.status === 409) {
          const conflictMsg = err.response?.data?.message || t('ConflictError') || 'Conflit détecté'
          toast.error(`Erreur 409: ${conflictMsg}`)
        } else {
          const errorMsg = err.response?.data?.message || err.message || t('ErrorUpdatingBlock')
          toast.error(errorMsg)
        }
      }
    } else {

      console.log(' Mode création')

      let successCount = 0
      let errorCount = 0
      const errors: string[] = []
      const conflictErrors: string[] = []

      for (const room of formData.selectedRooms) {
        const roomId = room.value

        for (const range of validDateRanges) {
          const payload = {
            hotel_id: serviceStore.serviceId,
            room_type_id: selectedRoomTypeId.value,
            room_id: roomId,
            block_from_date: range.start,
            block_to_date: range.end,
            reason: formData.reason.trim(),
            status: formData.status,
          }

          try {
            console.log(` Création bloc pour la chambre ${roomId}`, payload)
            const response = await createRoomBlock(payload)

            console.log(` Bloc créé pour la chambre ${roomId}:`, response.data)
            successCount++
          } catch (err: any) {
            console.error(` Erreur pour la chambre ${roomId}:`, err)

            if (err.response?.status === 409) {
              const errorCode = err.response?.data?.errorCode

              let translatedMsg = ''
              switch (errorCode) {
                case 'ROOM_ALREADY_BLOCKED':
                  translatedMsg = t('RoomAlreadyBlocked')
                  break
                case 'ROOM_HAS_RESERVATION':
                  translatedMsg = t('RoomHasReservation')
                  break
                default:
                  translatedMsg = t('ConflictError')
              }

              toast.error(translatedMsg)

            } else {
              const errorMsg = err.response?.data?.message || err.message || 'Erreur inconnue'
              errors.push(`Chambre ${room.label}: ${errorMsg}`)
            }
            errorCount++
          }
        }
      }

      // Afficher les résultats
      if (successCount > 0) {
        toast.success(`${successCount} ${t('BlocksCreatedSuccessfully')}`)
        emit('save', {
          isEditing: false,
          successCount,
          errorCount
        })
        closeModal()
      }

      if (errorCount > 0) {
        // Afficher d'abord les erreurs de conflit (409) séparément
        if (conflictErrors.length > 0) {
          conflictErrors.forEach(conflictError => {
            toast.error(conflictError, {
              timeout: 8000
            })
          })
        }

        // Puis les autres erreurs
        if (errors.length > 0) {
          if (successCount === 0 && conflictErrors.length === 0) {
            toast.error(t('ErrorCreatingBlocks'))
          } else if (successCount > 0) {
            toast.warning(`${errorCount - conflictErrors.length} ${t('ErrorsOccurred')}`)
          }
        }

        // Log toutes les erreurs pour debug
        [...conflictErrors, ...errors].forEach(error => {
          console.error(' Erreur détaillée:', error)
        })
      }
    }

  } catch (err: any) {
    console.error(' Erreur globale saveBlock:', err)

    // Gestion globale de l'erreur 409
    if (err.response?.status === 409) {
      const conflictMsg = err.response?.data?.message || 'Conflit détecté'
      toast.error(`Erreur 409: ${conflictMsg}`)
    } else {
      toast.error(err.message || t('ErrorSavingBlock'))
    }
  } finally {
    console.log(' Fin de saveBlock')
    isSaving.value = false
  }
}


const closeModal = () => {
  resetForm()
  emit('close')
}

const addDateRange = () => {
  formData.dateRanges.push({ start: null, end: null })
  console.log(' Added new date range. Total ranges:', formData.dateRanges.length)
}

const removeDateRange = (index: number) => {
  if (formData.dateRanges.length > 1 && index >= 0 && index < formData.dateRanges.length) {
    formData.dateRanges.splice(index, 1)
    console.log(` Removed date range ${index}. Remaining ranges:`, formData.dateRanges.length)
  }
}

// Watchers

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      populateFormData()
    })
  }
})

watch(() => props.blockData, () => {
  if (props.isOpen) {
    nextTick(() => {
      populateFormData()
    })
  }
}, { deep: true })

watch(selectedRoomTypeId, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    formData.selectedRooms = []
    validationErrors.selectedRooms = ''
  }
})

watch(() => formData.selectedRooms, () => {
  if (formData.selectedRooms.length > 0) {
    validationErrors.selectedRooms = ''
  }
})

watch(() => formData.reason, (newValue) => {
  if (newValue && newValue.trim() !== '') {
    validationErrors.reason = ''
  }
})

// Load data on mount
onMounted(async () => {
  isLoading.value = true

  try {
    const hotel_id = serviceStore.serviceId
    if (!hotel_id) {
      throw new Error(t('HotelIdNotSet'))
    }

    // Load room types
    console.log(' Loading room types for hotel:', hotel_id)
    const roomTypesResponse = await getRoomTypes(hotel_id)
    const roomTypesData = roomTypesResponse.data?.data?.data || roomTypesResponse.data?.data || roomTypesResponse.data

    if (Array.isArray(roomTypesData)) {
      roomTypeOptions.value = roomTypesData.map((type: any) => ({
        ...type,
        value: type.id,
        label: type.roomTypeName || type.name
      }))
      console.log(' Room types loaded:', roomTypeOptions.value.length)
    }

    // Load reasons
    console.log(' Loading maintenance block reasons')
    const reasonsResponse = await getByCategory(hotel_id, 'Maintenance Block')
    const reasonsData = reasonsResponse.data

    if (Array.isArray(reasonsData)) {
      reasonOptions.value = reasonsData.map((reason: any) => ({
        value: reason.reasonName || reason.name,
        label: reason.reasonName || reason.name
      }))
      console.log(' Reasons loaded:', reasonOptions.value.length)
    }

  } catch (err: any) {
    console.error(' Error loading data:', err)
    errorMessage.value = err.message || t('ErrorLoadingData')
    toast.error(t('ErrorLoadingData'))
  } finally {
    isLoading.value = false
  }
})

const clearDateRangeError = (index: number) => {
  // Clear l'erreur de validation pour les dates
  validationErrors.dateRanges = ''

  errorMessage.value = ''
}

// Améliorer la méthode updateDateRange :
const updateDateRange = (index: number, newRange: { start: string | null, end: string | null }) => {
  console.log(`📅 Updating date range ${index}:`, newRange)

  if (index >= 0 && index < formData.dateRanges.length) {
    formData.dateRanges[index] = { ...newRange }

    // Clear validation error if range is now valid
    if (newRange.start && newRange.end) {
      validationErrors.dateRanges = ''

      // Vérifier que la date de fin est après la date de début
      if (new Date(newRange.start) >= new Date(newRange.end)) {
        validationErrors.dateRanges = t('EndDateMustBeAfterStartDate')
      }
    }
  }
}


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

/* Loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Button states */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Form validation styles */
.error-border {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
}
</style>
