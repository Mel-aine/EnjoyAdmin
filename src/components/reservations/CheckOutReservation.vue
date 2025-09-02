<template>
  <RightSideModal :is-open="isOpen" :title="$t('Check-out')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('Check-out') }}</h3>
    </template>
    
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="px-2 space-y-4">
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
      </div>
    </div>
    
    <!-- Form -->
    <div v-else class="px-2 space-y-4">
      <!-- Perform Check-out on -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('Perform Check-out on') }}
        </label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input 
              v-model="formData.checkOutType" 
              type="radio" 
              value="group" 
              class="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span class="ml-2 text-sm text-gray-700">{{ $t('Group') }}</span>
          </label>
          <label class="flex items-center">
            <input 
              v-model="formData.checkOutType" 
              type="radio" 
              value="individual" 
              class="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span class="ml-2 text-sm text-gray-700">{{ $t('Individual Reservation') }}</span>
          </label>
        </div>
      </div>

      <!-- Room Selection -->
      <div v-if="reservationRooms.length > 0">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('Select Rooms') }}
        </label>
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <label 
            v-for="room in reservationRooms" 
            :key="room.id" 
            class="flex items-center p-2 border rounded hover:bg-gray-50"
          >
            <input 
              v-model="formData.selectedRooms" 
              type="checkbox" 
              :value="room.id" 
              :disabled="reservationRooms.length === 1 && formData.checkOutType === 'group'"
              class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span class="ml-2 text-sm text-gray-700">
              {{ room.room?.roomNumber }} - {{ room.guest?.displayName || room.guestName }}
            </span>
          </label>
        </div>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <BasicButton 
          variant="secondary" 
          @click="closeModal" 
          :label="$t('Cancel')"
          :disabled="isLoading"
        />
        <BasicButton 
          variant="primary" 
          @click="performCheckOut" 
          :label="formData.checkOutType === 'group' ? $t('Group Check-out') : $t('Check-out')" 
          :loading="isLoading"
          :disabled="isLoading || !canCheckOut"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue'
import InputCurrency from '../forms/FormElements/InputCurrency.vue'
import { useReservation, type CheckOutReservationPayload } from '../../composables/useReservation'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { formatCurrency } from '../utilities/UtilitiesFunction'
import { getReservationDetailsById } from '../../services/reservation'

interface ReservationRoom {
  id: number
  roomNumber: string
  guestName: string
  folioBalance?: number
}

interface Props {
  isOpen: boolean
  reservationId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'success', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
})

const emit = defineEmits<Emits>()
const { performCheckOut: checkOutReservation, isCheckingOut } = useReservation()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)
const isCalculating = ref(false)
const reservation = ref<any>()

// Form data
const formData = reactive({
  checkOutType: 'group',
  selectedRooms: [] as number[],
  checkOutDate: new Date().toISOString().split('T')[0],
  checkOutTime: '12:00', // Default checkout time
  finalBillAmount: 0,
  outstandingBalance: 0,
  depositRefund: 0,
  notes: ''
})

const reservationRooms = ref<any>([])

// Computed properties
const canCheckOut = computed(() => {
  const hasRoomsSelected = formData.checkOutType === 'group' 
    ? reservationRooms.value.length > 0
    : formData.selectedRooms.length > 0
  
  // Can check out if rooms are selected and no outstanding balance
  return hasRoomsSelected && formData.outstandingBalance <= 0
})

// Watch for check-out type changes
watch(() => formData.checkOutType, (newType) => {
  if (newType === 'group') {
    formData.selectedRooms = reservationRooms.value.map((room:any) => room.id)
  } else {
    formData.selectedRooms = []
  }
})

// Watch for modal open/close
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    resetForm()
    // Auto-select all rooms for group check-out
    if (formData.checkOutType === 'group') {
      formData.selectedRooms = reservationRooms.value.map((room:any) => room.id)
    }
    // Calculate initial bill
    calculateFinalBill()
    // Load booking details if needed
    getBookingDetailsById()
  }
})

// Methods
const resetForm = () => {
  Object.assign(formData, {
    checkOutType: 'group',
    selectedRooms: [],
    checkOutDate: new Date().toISOString().split('T')[0],
    checkOutTime: '12:00',
    finalBillAmount: 0,
    outstandingBalance: 0,
    depositRefund: 0,
    notes: ''
  })
}

const getBookingDetailsById = async () => {
  if (!props.reservationId) return
  
  try {
    isLoading.value = true
    const response = await getReservationDetailsById(props.reservationId)
    console.log('Checkout reservation details:', response)
    reservation.value = response
    reservationRooms.value = response.reservationRooms.map((e: any) => {
        return { ...e, guest: reservation.value.guest }
    })
    // Auto-select rooms based on type and count
    if (reservationRooms.value.length === 1) {
      // If only one room, auto-select it and disable checkbox for group checkout
      formData.selectedRooms = [reservationRooms.value[0].id]
    } else if (formData.checkOutType === 'group') {
      // For group checkout with multiple rooms, select all
      formData.selectedRooms = reservationRooms.value.map((room:any) => room.id)
    }
     
    
    console.log('Reservation rooms loaded:', reservationRooms.value)
  } catch (error) {
    console.error('Error fetching reservation details:', error)
    toast.error(t('Failed to load reservation details'))
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const calculateFinalBill = async () => {
  try {
    isCalculating.value = true
    
    // TODO: Implement API call to calculate final bill
    // This would typically call a folio API to get the current balance
    // For now, we'll simulate with room folio balances
    const totalBalance = reservationRooms.value.reduce((sum:number, room:any) => {
      return sum + (room.folioBalance || 0)
    }, 0)
    
    formData.finalBillAmount = totalBalance
    formData.outstandingBalance = Math.max(0, totalBalance) // Only positive balances are outstanding
    
    console.log('Calculated final bill:', {
      finalBillAmount: formData.finalBillAmount,
      outstandingBalance: formData.outstandingBalance
    })
    
  } catch (error) {
    console.error('Error calculating final bill:', error)
    toast.error(t('Failed to calculate final bill'))
  } finally {
    isCalculating.value = false
  }
}

const performCheckOut = async () => {
  // Validate required fields
  if (!canCheckOut.value) {
    if (formData.outstandingBalance > 0) {
      toast.error(t('Please settle the outstanding balance before check-out'))
    } else {
      toast.error(t('Please select at least one room for check-out'))
    }
    return
  }

  if (!formData.checkOutDate || !formData.checkOutTime) {
    toast.error(t('Please provide check-out date and time'))
    return
  }

  try {
    isLoading.value = true

    // Prepare check-out payload
    const checkOutDateTime = `${formData.checkOutDate}T${formData.checkOutTime}:00`
    const payload: CheckOutReservationPayload = {
      reservationRooms: formData.checkOutType === 'group' 
        ? reservationRooms.value.map((room:any) => room.id)
        : formData.selectedRooms,
      actualCheckOutTime: checkOutDateTime
    }

    console.log('Check-out payload:', payload)

    // Perform check-out
    const response = await checkOutReservation(props.reservationId, payload)

    // Emit success event
    emit('success', { ...payload, response })
    
    // Close modal
    closeModal()
  } catch (error) {
    console.error('Check-out error:', error)
    // Error handling is done in the composable
  } finally {
    isLoading.value = false
  }
}

// Fetch data on mount if modal is already open
onMounted(() => {
  if (props.isOpen) {
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
</style>