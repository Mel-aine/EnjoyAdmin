<template>
  <RightSideModal :is-open="isOpen" :title="$t('void_reservation')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('void_reservation') }}</h3>
    </template>

    <div>
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div class="flex space-x-4 mb-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
      </div>

      <!-- Modal Form -->
      <form v-else @submit.prevent="handleSubmit">
        <!-- Warning Banner -->
        <div class="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div>
              <h4 class="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                {{ $t('Warning') }}
              </h4>
              <p class="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                {{ formData.voidType === 'group'
                  ? $t('All rooms will be voided. This action cannot be undone.')
                  : $t('Selected rooms will be voided. This action cannot be undone.')
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Apply For Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('Apply For') }}
          </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="formData.voidType"
                type="radio"
                value="group"
                :disabled="reservationRooms.length === 1"
                class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span
                class="ml-2 text-sm"
                :class="reservationRooms.length === 1 ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'"
              >
                {{ $t('Group') }}
              </span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.voidType"
                type="radio"
                value="individual"
                class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('Individual Reservation') }}
              </span>
            </label>
          </div>
        </div>

        <!-- Room Selection -->
        <div v-if="formData.voidType === 'individual' && reservationRooms.length > 0" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('Select Rooms') }}
          </label>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <label
              v-for="room in reservationRooms"
              :key="room.id"
              class="flex items-center p-2 border rounded"
              :class="{
                'hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700': room.status !== 'voided',
                'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60': room.status === 'voided'
              }"
            >
              <input
                v-model="formData.selectedRooms"
                type="checkbox"
                :value="room.id"
                :disabled="room.status === 'voided'"
                class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div class="ml-2 flex-1">
                <span
                  class="text-sm"
                  :class="room.status === 'voided' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'"
                >
                  {{ room.room?.roomNumber || room.roomType?.roomTypeName }} - {{ room.guest?.displayName || room.guestName }}
                </span>
                <span v-if="room.status === 'voided'" class="ml-2 text-xs text-red-600 dark:text-red-400 font-medium">
                  ({{ $t('Already voided') }})
                </span>
              </div>
            </label>
          </div>
        </div>

        <!-- Reason Selection -->
        <div class="mb-4 relative">
          <ReasonSelector
            v-model="formData.reason"
            :category="'Void Reservation'"
            :label="$t('reason')"
            :is-required="true"
            @reason-added="handleReasonAdded"
          />
        </div>
      </form>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800">
        <BasicButton
          type="button"
          variant="outline"
          @click="closeModal"
          :label="$t('cancel')"
          :disabled="loading"
        />
        <BasicButton
          type="submit"
          variant="danger"
          @click="handleSubmit"
          :label="$t('void_reservation')"
          :loading="loading"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import BasicButton from '../../buttons/BasicButton.vue'
import { voidReservation, getReservationDetailsById } from '../../../services/reservation'
import RightSideModal from '../../modal/RightSideModal.vue'
import ReasonSelector from '../../common/ReasonSelector.vue'

interface Props {
  isOpen: boolean
  reservationId?: string | number
  reservationNumber?: string
  reservationData?: any
}

interface Emits {
  (e: 'close'): void
  (e: 'void-confirmed', data: VoidReservationData): void
}

interface VoidReservationData {
  reason: string
  reservationId?: string | number
  reservationNumber?: string
  voidType?: string
  selectedRooms?: number[]
  updatedStatus?: any
  updatedActions?: any[]
}

const isLoading = ref(false)
const props = withDefaults(defineProps<Props>(), {
  isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const reservation = ref<any>()
const reservationRooms = ref<any>([])

const formData = ref({
  reason: '',
  voidType: 'individual',
  selectedRooms: [] as number[]
})

// Computed: Available rooms (non voided)
const availableRooms = computed(() => {
  return reservationRooms.value.filter((room: any) => room.status !== 'voided')
})

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.reservationId) {
    resetForm()
    getBookingDetailsById()
  }
})

// Watch for reservationId changes
watch(() => props.reservationId, (newVal) => {
  if (newVal) {
    getBookingDetailsById()
  }
})

// Watch for voidType changes
watch(() => formData.value.voidType, (newType) => {
  if (newType === 'group') {
    formData.value.selectedRooms = availableRooms.value.map((room: any) => room.id)
  } else {
    formData.value.selectedRooms = []
  }
})

// Watch for reservationRooms changes
watch(() => reservationRooms.value, (newRooms) => {
  const available = newRooms.filter((room: any) => room.status !== 'voided')

  if (available.length === 0) {
    formData.value.selectedRooms = []
    return
  }

  if (available.length === 1) {
    formData.value.voidType = 'individual'
    formData.value.selectedRooms = [available[0].id]
  } else if (newRooms.length > 1 && formData.value.voidType === 'group') {
    formData.value.selectedRooms = available.map((room: any) => room.id)
  }
}, { deep: true })

const getBookingDetailsById = async () => {
  if (!props.reservationId) return

  isLoading.value = true
  try {
    const response = await getReservationDetailsById(Number(props.reservationId))
    console.log(' Reservation response:', response)

    reservation.value = response
    reservationRooms.value = response.reservationRooms.map((e: any) => {
      return { ...e, guest: reservation.value.guest }
    })

    console.log(' Reservation rooms:', reservationRooms.value)
  } catch (error) {
    console.error(' Error fetching reservation details:', error)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    reason: '',
    voidType: 'individual',
    selectedRooms: []
  }
}

const closeModal = () => {
  emit('close')
}

const handleReasonAdded = (newReason: { value: string; label: string }) => {
  formData.value.reason = newReason.value
}

const handleSubmit = async () => {
  try {
    loading.value = true

    // Validate form
    if (!formData.value.reason) {
      toast.error(t('please_select_reason'))
      return
    }

    // Validate room selection for individual void
    if (formData.value.voidType === 'individual' && formData.value.selectedRooms.length === 0) {
      toast.error(t('please_select_at_least_one_room'))
      return
    }

    // Prepare payload
    const payload: any = {
      reason: formData.value.reason
    }

    // Add selectedReservations based on void type
    if (formData.value.voidType === 'group') {
      // Group void - envoyer tous les IDs de chambres disponibles
      payload.selectedReservations = availableRooms.value.map((room: any) => room.id)
    } else {
      // Individual void - envoyer seulement les chambres sélectionnées
      payload.selectedReservations = formData.value.selectedRooms
    }

    // Call API
    const response = await voidReservation(props.reservationId!, payload)
    console.log(' Void response:', response)

    // Prepare data for emission
    const voidData: VoidReservationData = {
      reason: formData.value.reason,
      reservationId: props.reservationId,
      reservationNumber: props.reservationNumber,
      voidType: formData.value.voidType,
      selectedRooms: payload.selectedReservations,
      updatedStatus: 'voided',
      updatedActions: []
    }

    // Emit the void confirmation event
    emit('void-confirmed', voidData)

    // Show success message
    toast.success(t('reservation_void_successfully'))

    // Close modal
    closeModal()
  } catch (error: any) {
    console.error(' Error voiding reservation:', error)
    console.error('Error details:', error.response?.data)

    const errorMessage = error.response?.data?.message
      || error.response?.data?.error
      || t('error_voiding_reservation')

    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.reservationId && props.isOpen) {
    getBookingDetailsById()
  }
})
</script>

<style scoped>
/* Custom styles for the modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Focus styles for better accessibility */
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error state styles */
.error {
  border-color: #ef4444;
}

.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
