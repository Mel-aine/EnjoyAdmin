<template>
  <RightSideModal :is-open="isOpen" :title="$t('void_invoice')" @close="closeModal">
    <template #default>
      <div class="p-3 space-y-6 dark:text-gray-100">
        <form @submit.prevent="handleSubmit">
          <!-- Reason Selection aligned with VoidTransaction -->
          <div class="mb-4">
            <ReasonSelector
              v-model="formData.reason"
              :category="'Void Reservation'"
              :label="$t('Reason')"
              :is-required="true"
              @reason-added="handleReasonAdded"
            />
          </div>
        </form>
      </div>
    </template>

    <template #footer>
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
          :label="$t('void_invoice')"
          :loading="loading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import BasicButton from '../buttons/BasicButton.vue'
import { voidIncidentalInvoices } from '../../services/configrationApi'
import RightSideModal from '../modal/RightSideModal.vue'
import ReasonSelector from '../common/ReasonSelector.vue'

interface Props {
    isOpen: boolean
    invoiceId?: string | number
    invoiceNumber?: string
}

interface Emits {
    (e: 'close'): void
    (e: 'void-confirmed'): void
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

        if (!props.invoiceId) {
            toast.error(t('invalid_invoice_id'))
            return
        }

        // Prepare data for API call
        const voidData = {
            reason: formData.value.reason
        }

        // Call void API
        await voidIncidentalInvoices(Number(props.invoiceId), voidData)

        // Show success message
        toast.success(t('invoice_voided_successfully'))

        // Emit void confirmation event
        emit('void-confirmed')

        // Close modal
        closeModal()
    } catch (error) {
        console.error('Error voiding invoice:', error)
        toast.error(t('error_voiding_invoice'))
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