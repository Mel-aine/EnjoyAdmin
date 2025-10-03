<template>
  <!-- Void Reservation Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
      <div class="mt-3">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ $t('void_reservation') }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Form -->
        <form @submit.prevent="handleSubmit">
          <!-- Reason Selection -->
          <div class="mb-4">
            <ReasonSelector 
              v-model="formData.reason"
              :category="'Void Reservation'"
              :label="$t('reason')"
              :is-required="true"
              @reason-added="handleReasonAdded"
            />
          </div>

<!-- Action Buttons -->
          <div class="flex justify-end space-x-3">
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
              :label="$t('void_reservation')"
              :loading="loading" 
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReasonSelector from '@/components/common/ReasonSelector.vue'
import { voidReservation } from '../../../services/reservation'

interface Props {
  isOpen: boolean
  reservationId?: string | number
  reservationNumber?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'confirmed', data: VoidReservationData): void
  (e: 'void-confirmed', data: VoidReservationData): void
}

interface VoidReservationData {
  reason: string
  reservationId?: string | number
  reservationNumber?: string
  updatedStatus?: string
  updatedActions?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()
const loading = ref(false)

const formData = ref({
  reason: ''
})

// Reset form when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    reason: ''
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

    // Prepare data for emission
    const voidData: VoidReservationData = {
      reason: formData.value.reason,
      reservationId: props.reservationId,
      reservationNumber: props.reservationNumber
    }

    console.log('Void data:', voidData)
    const response = await voidReservation(voidData)
    console.log('Void response:', response)

    emit('void-confirmed', {
      ...voidData,
      updatedStatus: 'voided',
      updatedActions: []
    })

    // Show success message
    toast.success(t('reservation_void_successfully'))

    // Close modal
    closeModal()

  } catch (error) {
    console.error('Error voiding reservation:', error)
    toast.error(t('error_voiding_reservation'))
  } finally {
    loading.value = false
  }
}
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
