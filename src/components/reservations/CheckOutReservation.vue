<template>
  <RightSideModal :is-open="isOpen" :title="$t('Check-out')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('Check-out') }}</h3>
    </template>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="px-2 space-y-4">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div class="flex space-x-4 mb-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="px-2 space-y-4 ">
      <!-- Perform Check-out on -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          {{ $t('PerformCheck-outon') }}
        </label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              v-model="formData.checkOutType"
              type="radio"
              value="group"
              class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Group') }}</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="formData.checkOutType"
              type="radio"
              value="individual"
              class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('IndividualReservation') }}</span>
          </label>
        </div>
      </div>

      <!-- Room Selection -->
      <div v-if="reservationRooms.length > 0">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          {{ $t('Select Rooms') }}
        </label>
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <label
            v-for="room in reservationRooms"
            :key="room.id"
            class="flex items-center p-2 border rounded transition-colors dark:border-gray-700"
            :class="{
              'bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed': isRoomCheckedOut(room),
              'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer': !isRoomCheckedOut(room)
            }"
          >
            <input
              v-model="formData.selectedRooms"
              type="checkbox"
              :value="room.id"
              :disabled="
                isRoomCheckedOut(room) ||
                (reservationRooms.length === 1 && formData.checkOutType === 'group')
              "
              class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-primary disabled:opacity-50"
            />
            <div class="ml-2 flex-1">
              <div class="flex items-center justify-between">
                <span
                  class="text-sm"
                  :class="{
                    'text-gray-500 dark:text-gray-400': isRoomCheckedOut(room),
                    'text-gray-700 dark:text-gray-300': !isRoomCheckedOut(room)
                  }"
                >
                  {{ room.room?.roomNumber }} - {{ room.guest?.displayName || room.guestName }}
                </span>
                <span
                  v-if="isRoomCheckedOut(room)"
                  class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium"
                >
                  {{ $t('reservationStatus.Checked-out') }}
                </span>
              </div>
              <div
                v-if="isRoomCheckedOut(room) && room.actualCheckOutTime"
                class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              >
                {{ $t('Check-out') }}: {{ formatCheckOutDateTime(room.actualCheckOutTime) }}
              </div>
            </div>
          </label>
        </div>

        <!-- Info message if all rooms are checked out -->
        <div
          v-if="allRoomsCheckedOut"
          class="mt-3 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-400 rounded-md"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-blue-800 dark:text-blue-200">
              {{ $t('Allroomsinthisreservationhavealreadybeencheckedout') }}
            </span>
          </div>
        </div>

        <!-- Warning if some rooms are checked out -->
        <div
          v-else-if="hasCheckedOutRooms && !allRoomsCheckedOut"
          class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-400 rounded-md"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-yellow-800 dark:text-yellow-200">
              {{ $t('Someroomshavealreadybeencheckedoutandcannotbeselected') }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-end space-x-2 dark:bg-gray-800">
        <BasicButton
          variant="secondary"
          @click="closeModal"
          :label="$t('Cancel')"
          :disabled="isLoading"
        />
        <BasicButton
          variant="primary"
          @click="performCheckOut"
          :label="formData.checkOutType === 'group' ? $t('GroupCheck-out') : $t('Check-out')"
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
import { useReservation, type CheckOutReservationPayload } from '../../composables/useReservation'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { getReservationDetailsById } from '../../services/reservation'

interface ReservationRoom {
  id: number
  roomNumber: string
  guestName: string
  folioBalance?: number
  actualCheckOutTime?: string
  status?: string
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
    ? availableRooms.value.length > 0
    : formData.selectedRooms.length > 0

  // Can check out if rooms are selected and no outstanding balance
  return hasRoomsSelected && formData.outstandingBalance <= 0 && !allRoomsCheckedOut.value
})

// Check if room is already checked out
const isRoomCheckedOut = (room: any) => {
  // You can customize this logic based on your data structure
  // Common indicators: actualCheckOutTime exists, status is 'checked_out', etc.
  return room.actualCheckOutTime ||
         room.status === 'checked_out' ||
         room.status === 'departed' ||
         room.checkedOut === true
}

// Get available rooms (not checked out)
const availableRooms = computed(() => {
  return reservationRooms.value.filter((room: any) => !isRoomCheckedOut(room))
})

// Check if any rooms are checked out
const hasCheckedOutRooms = computed(() => {
  return reservationRooms.value.some((room: any) => isRoomCheckedOut(room))
})

// Check if all rooms are checked out
const allRoomsCheckedOut = computed(() => {
  return reservationRooms.value.length > 0 &&
         reservationRooms.value.every((room: any) => isRoomCheckedOut(room))
})

// Format check-out date time for display
const formatCheckOutDateTime = (dateTime: string) => {
  if (!dateTime) return ''

  const date = new Date(dateTime)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch for check-out type changes
watch(() => formData.checkOutType, (newType) => {
  if (newType === 'group') {
    formData.selectedRooms = availableRooms.value.map((room:any) => room.id)
  } else {
    formData.selectedRooms = []
  }
})

// Remove checked out rooms from selected rooms automatically
watch(() => reservationRooms.value, () => {
  const availableRoomIds = availableRooms.value.map((room: any) => room.id)
  formData.selectedRooms = formData.selectedRooms.filter(roomId =>
    availableRoomIds.includes(roomId)
  )
}, { deep: true })

// Watch for modal open/close
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    resetForm()
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

    // Auto-select available rooms based on type and count
    const availableRoomsList = availableRooms.value

    if (availableRoomsList.length === 1) {
      // If only one available room, auto-select it
      formData.selectedRooms = [availableRoomsList[0].id]
    } else if (formData.checkOutType === 'group' && availableRoomsList.length > 0) {
      // For group checkout with multiple available rooms, select all available
      formData.selectedRooms = availableRoomsList.map((room:any) => room.id)
    }

    // Calculate initial bill for available rooms
    calculateFinalBill()
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

    // Only calculate for available rooms
    const totalBalance = availableRooms.value.reduce((sum:number, room:any) => {
      return sum + (room.folioBalance || 0)
    }, 0)

    formData.finalBillAmount = totalBalance
    formData.outstandingBalance = Math.max(0, totalBalance) // Only positive balances are outstanding

  } catch (error) {
    console.error('Error calculating final bill:', error)
    toast.error(t('Failed to calculate final bill'))
  } finally {
    isCalculating.value = false
  }
}

const performCheckOut = async () => {
  // Validate if all rooms are already checked out
  if (allRoomsCheckedOut.value) {
    toast.info(t('All rooms have already been checked out'))
    return
  }

  // Validate required fields
  if (!canCheckOut.value) {
    if (formData.outstandingBalance > 0) {
      toast.error(t('Please settle the outstanding balance before check-out'))
    } else {
      toast.error(t('Please select at least one available room for check-out'))
    }
    return
  }

  if (!formData.checkOutDate || !formData.checkOutTime) {
    toast.error(t('Please provide check-out date and time'))
    return
  }

  try {
    isLoading.value = true

    // Prepare check-out payload - only include available rooms
    const checkOutDateTime = `${formData.checkOutDate}T${formData.checkOutTime}:00`
    const selectedAvailableRooms = formData.checkOutType === 'group'
      ? availableRooms.value.map((room:any) => room.id)
      : formData.selectedRooms.filter(roomId =>
          availableRooms.value.some((room: any) => room.id === roomId)
        )

    const payload: CheckOutReservationPayload = {
      reservationRooms: selectedAvailableRooms,
      actualCheckOutTime: checkOutDateTime
    }

    console.log('Check-out payload:', payload)

    // Perform check-out
    const response = await checkOutReservation(props.reservationId, payload)

    // Show success message
    // const checkedOutCount = selectedAvailableRooms.length
    // toast.success(t('Successfully checked out {count} room(s)', { count: checkedOutCount }))

    // Emit success event
    emit('success', {
      ...payload,
      response,
      updatedRooms: selectedAvailableRooms,
      checkOutDateTime: checkOutDateTime,
      action: 'check_out'
    })

    // Close modal
    closeModal()

  } catch (error:any) {
    console.error('Check-out error:', error)
     const errorMessage =
      error.response?.data?.message ||
      (error.response?.data?.errors?.join(', ') || '') ||
      error.message ||
      t('Failed to perform check-out')

      toast.error(errorMessage)
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

/* Custom styles for disabled rooms */
.cursor-not-allowed {
  cursor: not-allowed !important;
}
</style>
