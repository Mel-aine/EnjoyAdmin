<template>
    <!-- Void Invoice Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div
            class="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ $t('void_invoice') }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Modal Form -->
                <form @submit.prevent="handleSubmit">
                    <!-- Reason Selection -->
                    <div class="mb-4">
                        <Select 
                            :lb="$t('reason')" 
                            :is-loading="isLoadingReason" 
                            v-model="formData.reason" 
                            :options="reasonOptions"
                            :is-required="true" 
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
                            :label="$t('void_invoice')"
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
import BasicButton from '../buttons/BasicButton.vue'
import Select from '../forms/FormElements/Select.vue'
import { getReasons, voidIncidentalInvoices } from '../../services/configrationApi'

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
const isLoadingReason = ref(false)

const formData = ref({
    reason: ''
})

const reasonOptions = ref([{ label: "select", value: '' }])

// Reset form when modal opens
watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        resetForm()
        loadReasons()
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

const loadReasons = async () => {
    isLoadingReason.value = true
    try {
        const res = await getReasons()
        reasonOptions.value = res.data.data.map((item: any) => {
            return {
                label: item.reasonName,
                value: item.reasonName
            }
        })
        reasonOptions.value.unshift({ label: "select", value: '' })
    } catch (error) {
        console.error('Error loading reasons:', error)
        toast.error(t('error_loading_reasons'))
    } finally {
        isLoadingReason.value = false
    }
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