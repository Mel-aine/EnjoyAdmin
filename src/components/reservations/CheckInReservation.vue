<template>
  <RightSideModal :is-open="isOpen" :title="$t('Check-in')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('Check-in') }}</h3>
    </template>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="px-2 space-y-4">
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
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div class="h-10 bg-gray-200 rounded mb-4"></div>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="px-2 space-y-4 ">
      <!-- Perform Check-in on -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('Perform Check-in on') }}
        </label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              v-model="formData.checkInType"
              type="radio"
              value="group"
              :disabled="reservationRooms.length === 1"
              class="w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span class="ml-2 text-sm" :class="reservationRooms.length === 1 ? 'text-gray-400' : 'text-gray-700'">{{ $t('Group') }}</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="formData.checkInType"
              type="radio"
              value="individual"
              :disabled="reservationRooms.length === 1"
              class="w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span class="ml-2 text-sm" :class="reservationRooms.length === 1 ? 'text-gray-400' : 'text-gray-700'">{{ $t('Individual Reservation') }}</span>
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
      <!-- Loading Skeleton for Footer -->
      <div v-if="isLoading" class="flex justify-end space-x-2">
        <div class="animate-pulse">
          <div class="h-10 bg-gray-200 rounded w-20"></div>
        </div>
        <div class="animate-pulse">
          <div class="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      <!-- Normal Footer -->
      <div v-else class="flex justify-end space-x-2">
        <BasicButton
          variant="secondary"
          @click="closeModal"
          :label="$t('Cancel')"
          :disabled="isLoading"
        />
        <BasicButton
          variant="primary"
          @click="performCheckIn"
          :label="formData.checkInType === 'group' ? $t('Group Check-in') : $t('Check-in')"
          :loading="isLoading"
          :disabled="isLoading || !canCheckIn"
        />
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
import { getReservationDetailsById } from '../../services/reservation'


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
const { performCheckIn: checkInReservation, isCheckingIn } = useReservation()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)
const loading = ref(false);
const reservation =ref<any>()

// Form data
const formData = reactive({
  checkInType: 'group',
  selectedRooms: [] as number[],
  checkInDate: new Date().toISOString().split('T')[0],
  checkInTime: new Date().toTimeString().slice(0, 5),
  keyCardsIssued: 2,
  depositAmount: 0,
  notes: ''
})

const reservationRooms = ref<any>([]);
// Computed properties
const canCheckIn = computed(() => {
  if (formData.checkInType === 'group') {
    return reservationRooms.value .length > 0
  } else {
    return formData.selectedRooms.length > 0
  }
})

// Watch for check-in type changes
watch(() => formData.checkInType, (newType) => {
  if (newType === 'group') {
    formData.selectedRooms = reservationRooms.value.map((room:any) => room.id)
  } else {
    formData.selectedRooms = []
  }
})

watch(()=>props.reservationId, (newVal) => {
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
  if (newRooms.length === 1) {
    // Auto-select the single room and set to group check-in
    formData.checkInType = 'group'
    formData.selectedRooms = [newRooms[0].id]
  } else if (newRooms.length > 1) {
    // Auto-select all rooms for group check-in
    if (formData.checkInType === 'group') {
      formData.selectedRooms = newRooms.map((room:any) => room.id)
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
    loading.value = true;
    const id = props.reservationId;
    const response = await getReservationDetailsById(Number(id));
    console.log(response)
    reservation.value = response
   reservationRooms.value = response.reservationRooms.map((e: any) => {
        return { ...e, guest: reservation.value.guest }
    })

    loading.value = false;
    console.log('Reservation data fetched:', reservation.value)
};
const closeModal = () => {
  resetForm()
  emit('close')
}

const performCheckIn = async () => {
  // Validate required fields
  if (!canCheckIn.value) {
    toast.error(t('Please select at least one room for check-in'))
    return
  }

  if (!formData.checkInDate || !formData.checkInTime) {
    toast.error(t('Please provide check-in date and time'))
    return
  }

  try {
    isLoading.value = true

    // Prepare check-in payload
    const checkInDateTime = `${formData.checkInDate}T${formData.checkInTime}:00`
    const payload: CheckInReservationPayload = {
      reservationRooms: formData.checkInType === 'group'
        ? reservationRooms.value.map((room:any) => room.id)
        : formData.selectedRooms,
      actualCheckInTime: checkInDateTime,
      notes: formData.notes,
      keyCardsIssued: formData.keyCardsIssued,
      depositAmount: formData.depositAmount
    }

    console.log('Check-in payload:', payload)

    // Perform check-in
    const response = await checkInReservation(props.reservationId, payload)

    // Emit success event
    emit('success', { ...payload, response })

    // Close modal
    closeModal()
  } catch (error) {
    console.error('Check-in error:', error)
    // Error handling is done in the composable
  } finally {
    isLoading.value = false
  }
}
onMounted(()=>{
  if(props.reservationId) {
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
