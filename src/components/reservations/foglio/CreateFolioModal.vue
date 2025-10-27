<template>
    <RightSideModal :is-open="isOpen" :title="$t('New Folio')" @close="closeModal">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('New Folio') }}</h3>
        </template>

        <!-- Form -->
        <div class="px-2 space-y-4 dark:text-gray-100">
            <!-- Guest Selection -->
            <div>
                <Select v-model="formData.guestId" :options="guestOptions" :lb="$t('Guest') + ' *'"
                    :placeholder="$t('Select Guest')" />
            </div>

            <!-- GSTIN No -->
            <div>
                <Input v-model="formData.gstinNo" type="text" :lb="$t('GSTIN No')" placeholder="Enter GSTIN Number" />
            </div>

            <!-- Show Tariff on Print Folio -->
            <div class="flex items-center">
                <input v-model="formData.showTariffOnPrint" type="checkbox" id="showTariffOnPrint"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label for="showTariffOnPrint" class="ml-2 text-sm text-gray-700">
                    {{ $t('Show Tariff on Print Folio') }}
                </label>
            </div>

            <!-- Post Commission to TA on Guest Checkout 
      <div class="flex items-center">
        <input 
          v-model="formData.postCommissionToTA" 
          type="checkbox" 
          id="postCommissionToTA"
          class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label for="postCommissionToTA" class="ml-2 text-sm text-gray-700">
          {{ $t('Post Commission to TA on Guest Checkout') }}
        </label>
      </div>
-->
            <!-- Generate Invoice Number On Post Checkout 
      <div class="flex items-center">
        <input 
          v-model="formData.generateInvoiceNumber" 
          type="checkbox" 
          id="generateInvoiceNumber"
          class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label for="generateInvoiceNumber" class="ml-2 text-sm text-gray-700">
          {{ $t('Generate Invoice Number On Post Checkout') }}
        </label>
      </div>-->
            <!-- Credit Limit -->
            <div>
                <Input v-model="formData.creditLimit" input-type="number" min="0" step="0.01" :lb="$t('Credit Limit')"
                    placeholder="0.00" />
            </div>

            <!-- Notes -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{{ $t('Notes') }}</label>
                <textarea v-model="formData.notes" rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    :placeholder="$t('Enter any additional notes...')"></textarea>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end space-x-2">
                <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')" :disabled="isLoading">
                </BasicButton>
                <BasicButton variant="primary" @click="saveFolio"
                    :label="isLoading ? $t('Creating...') : $t('Create Folio')" :disabled="isLoading"
                    :loading="isLoading"></BasicButton>
            </div>
        </template>
    </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import Select from '../../forms/FormElements/Select.vue'
import Input from '../../forms/FormElements/Input.vue'
import { createFoglio, createFolioForReservation } from '../../../services/foglioApi'

interface Props {
    isOpen: boolean
    reservationId?: number
    reservation?: any

}

const props = defineProps<Props>()
const emits = defineEmits(['close', 'save'])
const { t } = useI18n()
const toast = useToast()
const isLoading = ref(false)

// Form data
const formData = reactive({
    guestId: '',
    gstinNo: '',
    showTariffOnPrint: false,
    postCommissionToTA: false,
    generateInvoiceNumber: true, // Default checked as shown in image
    folioType: '',
    creditLimit: '',
    notes: ''
})

// Options for dropdowns
const guestOptions = computed(() => {
    return props.reservation?.guests.map((guest: any) => ({
        value: guest.id,
        label: guest.displayName
    }))

})


// Reset form when modal opens/closes
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        resetForm()
    }
})

const resetForm = () => {
    formData.guestId = ''
    formData.gstinNo = ''
    formData.showTariffOnPrint = false
    formData.postCommissionToTA = false
    formData.generateInvoiceNumber = true
    formData.folioType = ''
    formData.creditLimit = ''
    formData.notes = ''
}

const closeModal = () => {
    emits('close')
}

const saveFolio = async () => {
    try {
        // Validate required fields
        if (!formData.guestId) {
            toast.error(t('Please fill in all required fields'))
            return
        }

        isLoading.value = true
        // Prepare data for API
        const folioData = {
            guestId: parseInt(formData.guestId),
            hotelId: props.reservation.hotelId,
            reservationId: props.reservationId,
            folioType: "guest",
            gstinNo: formData.gstinNo ?? 0,
            creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : null,
            notes: formData.notes,
            /*  settings: {
                show_tariff_on_print: formData.showTariffOnPrint,
                post_commission_to_ta: formData.postCommissionToTA,
                generate_invoice_number: formData.generateInvoiceNumber
              }*/
        }
        // Call API to create folio
        const response = await createFoglio(folioData)
        console.log('response', response)
        toast.success(t('Folio created successfully!'))
        emits('save', response)
        closeModal()
    } catch (error) {
        console.error('Error creating folio:', error)
        toast.error(t('Error creating folio. Please try again.'))
    } finally {
        isLoading.value = false
    }
}

// Load initial data
onMounted(() => {
    // You can load guests, folio types, etc. from API here
})
</script>

<style scoped>
/* Additional styles if needed */
</style>