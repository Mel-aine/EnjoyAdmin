<template>
  <RightSideModal :is-open="isOpen" :title="$t('Check-in')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('Check-in') }}</h3>
    </template>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="px-2 space-y-4">
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
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="px-2 space-y-4 ">
      <!-- Perform Check-in on -->
      <div class="mb-4" v-if="reservation && reservation.isGroup">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          {{ $t('PerformCheck-inon') }}
        </label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input v-model="formData.checkInType" type="radio" value="group"
              :disabled="reservationRooms.length === 1 || availableRooms.length === 0"
              class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" />
            <span class="ml-2 text-sm"
              :class="(reservationRooms.length === 1 || availableRooms.length === 0) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'">
              {{ $t('Group') }}
            </span>
          </label>
          <label class="flex items-center">
            <input v-model="formData.checkInType" type="radio" value="individual"
              :disabled="reservationRooms.length === 1 || availableRooms.length === 0"
              class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" />
            <span class="ml-2 text-sm"
              :class="(reservationRooms.length === 1 || availableRooms.length === 0) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'">
              {{ $t('IndividualReservation') }}
            </span>
          </label>
        </div>
      </div>

      <!-- Room Selection -->
      <div v-if="reservationRooms.length > 0">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          {{ $t('SelectRooms') }}
        </label>
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <label v-for="room in reservationRooms" :key="room.id"
            class="flex items-center p-2 border rounded transition-colors dark:border-gray-700" :class="{
              'bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed': isRoomCheckedIn(room),
              'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer': !isRoomCheckedIn(room)
            }">
            <input v-model="formData.selectedRooms" type="checkbox" :value="room.id"
              :disabled="isRoomCheckedIn(room) || reservation?.isGroup"
              class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-primary disabled:opacity-50" />
            <div class="ml-2 flex-1">
              <div class="flex items-center justify-between">
                <span class="text-sm" :class="{
                  'text-gray-500 dark:text-gray-400': isRoomCheckedIn(room),
                  'text-gray-700 dark:text-gray-300': !isRoomCheckedIn(room)
                }">
                  {{ room.room?.roomNumber }} - {{ room.guest?.displayName || room.guestName }}
                </span>
                <span v-if="isRoomCheckedIn(room)"
                  class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                  {{ $t('reservationStatus.Checked-in') }}
                </span>
              </div>
              <div v-if="isRoomCheckedIn(room) && room.actualCheckInTime"
                class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('Check-in') }}: {{ formatCheckInDateTime(room.actualCheckInTime) }}
              </div>
            </div>
          </label>
        </div>

        <!-- Info message if all rooms are checked in -->
        <div v-if="allRoomsCheckedIn"
          class="mt-3 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-400 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-blue-800 dark:text-blue-200">
              {{ $t('Allroomsinthisreservationhavealreadybeencheckedin') }}
            </span>
          </div>
        </div>

        <!-- Warning if some rooms are checked in -->
        <div v-else-if="hasCheckedInRooms && !allRoomsCheckedIn"
          class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-400 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-yellow-800 dark:text-yellow-200">
              {{ $t('Someroomshavealreadybeencheckedinandcannotbeselected') }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <template #footer>
      <!-- Loading Skeleton for Footer -->
      <div v-if="isLoading" class="flex justify-end space-x-2">
        <div class="animate-pulse">
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div class="animate-pulse">
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>

      <!-- Normal Footer -->
      <div v-else class="flex justify-end space-x-2 dark:bg-gray-800">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')" :disabled="isCheckedIn" />
        <BasicButton variant="primary" @click="performCheckIn"
          :label="(formData.checkInType === 'group' && reservation.value?.isGroup) ? $t('GroupCheck-in') : $t('Check-in')"
          :loading="isLoading" :disabled="isCheckedIn || !canCheckIn" />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import { useReservation, type CheckInReservationPayload } from '../../composables/useReservation'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { getReservationBasicDetailsById } from '../../services/reservation'


interface Props {
  isOpen: boolean
  reservationId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'check-in-complete'): void
  (e: 'success', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
})

const emit = defineEmits<Emits>()
const { performCheckIn: checkInReservation, isCheckingIn } = useReservation()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)
const loading = ref(false)
const reservation = ref<any>()
const isCheckedIn = ref(false);
// Form data
const formData = reactive({
  checkInType: '',
  selectedRooms: [] as number[],
  checkInDate: new Date().toISOString().split('T')[0],
  checkInTime: new Date().toTimeString().slice(0, 5),
  keyCardsIssued: 2,
  depositAmount: 0,
  notes: ''
})

const reservationRooms = ref<any>([])

// Check if room is already checked in
const isRoomCheckedIn = (room: any) => {
  // You can customize this logic based on your data structure
  // Common indicators: actualCheckInTime exists, status is 'checked_in', etc.
  return room.actualCheckInTime ||
    room.status === 'checked_in' ||
    room.status === 'occupied' ||
    room.checkedIn === true
}

// Get available rooms (not checked in)
const availableRooms = computed(() => {
  return reservationRooms.value.filter((room: any) => !isRoomCheckedIn(room))
})

// Check if any rooms are checked in
const hasCheckedInRooms = computed(() => {
  return reservationRooms.value.some((room: any) => isRoomCheckedIn(room))
})

// Check if all rooms are checked in
const allRoomsCheckedIn = computed(() => {
  return reservationRooms.value.length > 0 &&
    reservationRooms.value.every((room: any) => isRoomCheckedIn(room))
})

// Computed properties
const canCheckIn = computed(() => {
  if (allRoomsCheckedIn.value) {
    return false
  }

  if (formData.checkInType === 'group') {
    return availableRooms.value.length > 0
  } else {
    console.log('here bro')
    return formData.selectedRooms.length > 0
  }
})

// Format check-in date time for display
const formatCheckInDateTime = (dateTime: string) => {
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

// Watch for check-in type changes
watch(() => formData.checkInType, (newType) => {
  if (newType === 'group') {
    formData.selectedRooms = availableRooms.value.map((room: any) => room.id)
  } else {
    formData.selectedRooms = []
  }
})

// Remove checked in rooms from selected rooms automatically
watch(() => reservationRooms.value, () => {
  const availableRoomIds = availableRooms.value.map((room: any) => room.id)
  formData.selectedRooms = formData.selectedRooms.filter(roomId =>
    availableRoomIds.includes(roomId)
  )
}, { deep: true })

watch(() => props.reservationId, (newVal) => {
  if (newVal) {
    getBookingDetailsById()
  }
})

// Watch for modal open/close
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.reservationId) {
    // Reset form when modal opens
    resetForm()
    // Fetch booking details
    getBookingDetailsById()
  }
})

// Watch for reservationRooms changes to handle single room auto-selection
watch(() => reservationRooms.value, (newRooms) => {
  const availableRoomsList = availableRooms.value

  if (availableRoomsList.length === 1) {
    // Auto-select the single available room and set to group check-in
    formData.checkInType = 'group'
    formData.selectedRooms = [availableRoomsList[0].id]
  } else if (availableRoomsList.length > 1) {
    // Auto-select all available rooms for group check-in
    if (formData.checkInType === 'group') {
      formData.selectedRooms = availableRoomsList.map((room: any) => room.id)
    }
  }
}, { deep: true })

// Methods
const resetForm = () => {
  Object.assign(formData, {
    checkInType: 'group',
    selectedRooms: [],
  })
}

const getBookingDetailsById = async () => {
  try {
    loading.value = true
    const id = props.reservationId
    const response = await getReservationBasicDetailsById(Number(id))
    console.log('Check-in reservation details:', response)
    reservation.value = response
    reservationRooms.value = response.reservationRooms.map((e: any) => {
      return { ...e, guest: reservation.value.guest }
    })
  } catch (error) {
    console.error('Error fetching reservation details:', error)
    toast.error(t('Failed to load reservation details'))
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const performCheckIn = async () => {

  // Validate required fields
  if (!canCheckIn.value) {
    toast.error(t('Please select at least one available room for check-in'))
    return
  }

  try {
    isCheckedIn.value = true

    // Prepare check-in payload - only include available rooms
    const checkInDateTime = `${formData.checkInDate}T${formData.checkInTime}:00`
    const selectedAvailableRooms = formData.checkInType === 'group'
      ? availableRooms.value.map((room: any) => room.id)
      : formData.selectedRooms.filter(roomId =>
        availableRooms.value.some((room: any) => room.id === roomId)
      )

    const payload: CheckInReservationPayload = {
      reservationRooms: selectedAvailableRooms,
      actualCheckInTime: checkInDateTime,
      notes: formData.notes,
      keyCardsIssued: formData.keyCardsIssued,
      depositAmount: formData.depositAmount
    }
    // Perform check-in
    const response = await checkInReservation(props.reservationId, payload)
    // Émettez avec les données nécessaires pour la mise à jour locale
    emit('success', {
      ...payload,
      response,
      updatedRooms: selectedAvailableRooms,
      checkInDateTime: checkInDateTime,
      action: 'check_in'
    })
    emit('check-in-complete')

    // Close modal
    closeModal()
  } catch (error: any) {
    console.error('Check-in error:', error)
    const errorMessage =
      error.response?.data?.message ||
      (error.response?.data?.errors?.join(', ') || '') ||
      error.message ||
      t('Failed to perform check-in')

    toast.error(errorMessage)
  } finally {
    isCheckedIn.value = false
  }
}

onMounted(() => {
  if (props.reservationId) {
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
