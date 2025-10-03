<template>
  <!-- Cancel Reservation Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-visible h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-visible">
      <div class="mt-3">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ $t('cancel_reservation') }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="space-y-4">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div class="flex space-x-4 mb-4">
              <div class="h-4 bg-gray-200 rounded w-16"></div>
              <div class="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div class="h-10 bg-gray-200 rounded mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div class="h-10 bg-gray-200 rounded mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div class="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>

        <!-- Modal Form -->
        <form v-else @submit.prevent="handleSubmit">
          <!-- Apply For Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('Apply For') }}
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="formData.cancelType"
                  type="radio"
                  value="group"
                  :disabled="reservationRooms.length === 1"
                  class="w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span class="ml-2 text-sm" :class="reservationRooms.length === 1 ? 'text-gray-400' : 'text-gray-700'">
                  {{ $t('Group') }}
                </span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.cancelType"
                  type="radio"
                  value="single"
                  class="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span class="ml-2 text-sm text-gray-700">
                  {{ $t('Single') }}
                </span>
              </label>
            </div>
          </div>

          <!-- Room Selection -->
          <div v-if="reservationRooms.length > 1 && formData.cancelType === 'single'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('Select Room') }}
            </label>
            <select
              v-model="formData.roomId"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option v-for="room in reservationRooms" :key="room.id" :value="room.id">
                {{ room.name }} ({{ room.number }})
              </option>
            </select>
          </div>

          <!-- Cancellation Fee -->
          <div class="mb-4">
            <InputCurrency 
              v-model="formData.cancellationFee" 
              :label="$t('cancellation_fee')"
              :placeholder="$t('enter_cancellation_fee')" 
            />
          </div>

          <!-- Reason Selection -->
          <div class="mb-4 relative">
            <ReasonSelector
              v-model="formData.reason"
              :category="'Cancel Reservation'"
              :label="$t('reason')"
              :is-required="true"
              @reason-added="handleReasonAdded"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3">
            <BasicButton 
              type="button" 
              variant="secondary" 
              :label="$t('cancel')" 
              @click="closeModal"
              :disabled="loading" 
            />
            <BasicButton 
              type="submit" 
              variant="danger" 
              :label="$t('cancel_reservation')"
              :loading="loading" 
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import ReasonSelector from '@/components/common/ReasonSelector.vue'

// Interfaces
interface ReservationRoom {
  id: number
  name: string
  number: string
}

interface FormData {
  cancelType: 'group' | 'single'
  roomId: number | null
  reason: string
  cancellationFee: string
}

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  reservationId: {
    type: [String, Number],
    required: false
  },
  reservationRooms: {
    type: Array as () => ReservationRoom[],
    default: () => []
  }
})

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'cancel-confirmed', data: any): void
}>()

// Composables
const { t } = useI18n()
const toast = useToast()

// State
const isLoading = ref(false)
const loading = ref(false)
const formData = ref<FormData>({
  cancelType: 'group',
  roomId: null,
  reason: '',
  cancellationFee: '0'
})

// Computed
const isFormValid = computed(() => {
  return formData.value.reason.trim() !== ''
})

// Methods
const closeModal = () => {
  emit('close')
}

const handleReasonAdded = (newReason: { value: string; label: string }) => {
  formData.value.reason = newReason.value
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error(t('Please provide a reason for cancellation'))
    return
  }

  loading.value = true

  try {
    // Prepare data for API call
    const data = {
      reservationId: props.reservationId,
      reason: formData.value.reason,
      cancelType: formData.value.cancelType,
      roomId: formData.value.cancelType === 'single' ? formData.value.roomId : null,
      cancellationFee: formData.value.cancellationFee
    }

    // Call API
    const response = await cancelReservation(data)
    
    // Emit success event
    emit('cancel-confirmed', response.data)
    toast.success(t('Reservation cancelled successfully'))
    closeModal()
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    toast.error(t('Failed to cancel reservation'))
  } finally {
    loading.value = false
  }
}

// Simuler les appels API
const getByCategory = async () => ({ data: [] })
const cancelReservation = async (data: any) => ({ data: {} })
const getReservationDetailsById = async () => ({ data: {} })

// Watchers
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Reset form when modal opens
    formData.value = {
      cancelType: 'group',
      roomId: null,
      reason: '',
      cancellationFee: '0'
    }
    
    // Set default room if only one exists
    if (props.reservationRooms.length === 1) {
      formData.value.roomId = props.reservationRooms[0].id
    }
  }
})

// Lifecycle hooks
onMounted(() => {
  if (props.reservationId) {
    getReservationDetailsById()
  }
})
</script>
