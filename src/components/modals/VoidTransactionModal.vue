<template>
  <RightSideModal 
    :is-open="isOpen" 
    :title="$t('voidTransaction')"
    @close="closeModal"
  >
    <template #default>
      <div class="p- space-y-6">
        

        <!-- Void Reason Form -->
      <div>
        <AutoCompleteSelect
          v-model="voidForm.reason"
          :options="voidReasons"
          :defaultValue="$t('SelectReason')"
          :lb="$t('Reason')"
          :is-required="true"
          :use-dropdown="useDropdownReason"
          @update:useDropdown="useDropdownReason = $event"
        />
      </div>

      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="isLoading"
        >
          {{ $t('cancel') }}
        </button>
        <button
          type="button"
          @click="handleVoidTransaction"
          :disabled="isLoading || !voidForm.reason.trim()"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ $t('voidTransaction') }}
        </button>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { voidFolioTransaction } from '@/services/foglioApi'
import RightSideModal from '../modal/RightSideModal.vue'
import AutoCompleteSelect from '../forms/FormElements/AutoCompleteSelect.vue'
import { getByCategory } from '../../services/configrationApi'
import { useServiceStore } from '../../composables/serviceStore'

const { t } = useI18n()

// Props
interface Props {
  isOpen: boolean
  transactionDetails?: {
    id: number
    date: string
    reference: string
    description: string
    amount: number
  } | null
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  transactionDetails: null
})

// Emits
const emit = defineEmits<{
  close: []
  success: [data: any]
  error: [error: any]
}>()

// Reactive data
const isLoading = ref(false)
const voidForm = reactive({
  reason: '',
  notes: ''
})

const errors = reactive({
  reason: ''
})
const voidReasons = ref<any>([])
// Methods
const closeModal = () => {
  resetForm()
  emit('close')
}
const useDropdownReason = ref(true);
const resetForm = () => {
  voidForm.reason = ''
  voidForm.notes = ''
  errors.reason = ''
  isLoading.value = false
}

const validateForm = () => {
  errors.reason = ''
  
  if (!voidForm.reason.trim()) {
    errors.reason = t('voidReasonRequired')
    return false
  }  
  return true
}
// Load initial data
const loadInitialData = async () => {
  try {
    const hotel_id = useServiceStore().serviceId
    // Load void reasons
    const reasonsResponse = await getByCategory(hotel_id!, 'Void Reservation')
    const reasonsData = reasonsResponse.data

    if (Array.isArray(reasonsData)) {
      voidReasons.value = reasonsData.map((reason: any) => ({
        value: reason.reasonName || reason.name,
        label: reason.reasonName || reason.name
      }))
    }

  } catch (error) {
    console.error('Error loading initial data:', error)
  }
}
const handleVoidTransaction = async () => {
    alert('viod')
    console.log('voidform', voidForm)
  if (!validateForm()) {
    return
  }

  if (!props.transactionDetails?.id) {
    emit('error', { message: t('noTransactionSelected') })
    return
  }

  isLoading.value = true

  try {
    const voidData = {
      reason: voidForm.reason.trim(),
      notes: voidForm.notes.trim() || undefined
    }

    const response = await voidFolioTransaction(props.transactionDetails.id, voidData)
    
    emit('success', {
      message: t('transactionVoidedSuccessfully'),
      data: response.data
    })
    
    closeModal()
  } catch (error: any) {
    console.error('Error voiding transaction:', error)
    emit('error', {
      message: error.response?.data?.message || t('errorVoidingTransaction'),
      error
    })
  } finally {
    isLoading.value = false
  }
}


// Watch for modal open/close to reset form
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

onMounted(()=>{
  loadInitialData()
})
</script>

<style scoped>
/* Custom scrollbar for textareas */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark mode scrollbar */
.dark textarea::-webkit-scrollbar-track {
  background: #374151;
}

.dark textarea::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>