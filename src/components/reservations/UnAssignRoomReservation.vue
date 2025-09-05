<template>
  <RightSideModal
    :is-open="isOpen"
    @close="closeModal"
    :title="$t('Unassign Room Reservation')"
    size="lg"
  >
    <template #content>
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else class="space-y-6">
        <!-- Reservation Info -->
        <div v-if="reservation" class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">{{ $t('Reservation Details') }}</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">{{ $t('Guest') }}:</span>
              {{ reservation.guest?.firstName }} {{ reservation.guest?.lastName }}
            </div>
            <div>
              <span class="font-medium">{{ $t('Reservation ID') }}:</span>
              {{ reservation.id }}
            </div>
            <div>
              <span class="font-medium">{{ $t('Check-in Date') }}:</span>
              {{ reservation.checkInDate }}
            </div>
            <div>
              <span class="font-medium">{{ $t('Check-out Date') }}:</span>
              {{ reservation.checkOutDate }}
            </div>
          </div>
        </div>

        <!-- Unassign Type Selection -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('Unassign Type') }}
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="formData.avheType"
                  value="group"
                  class="mr-2"
                />
                {{ $t('Group Unassign') }}
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="formData.avheType"
                  value="individual"
                  class="mr-2"
                />
                {{ $t('Individual Unassign') }}
              </label>
            </div>
          </div>

          <!-- Room Selection for Individual -->
          <div v-if="formData.avheType === 'individual'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('Select Rooms to Unassign') }}
            </label>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <label
                v-for="room in reservationRooms"
                :key="room.id"
                class="flex items-center p-2 border rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  :value="room.id"
                  v-model="formData.selectedRooms"
                  class="mr-3"
                />
                <div class="flex-1">
                  <div class="font-medium">{{ room.roomNumber || room.roomType?.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ room.guest?.firstName }} {{ room.guest?.lastName }}
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Group Selection Info -->
          <div v-else-if="formData.avheType === 'group'" class="bg-blue-50 p-3 rounded">
            <p class="text-sm text-blue-700">
              {{ $t('All rooms will be unassigned') }} ({{ reservationRooms.length }} {{ $t('rooms') }})
            </p>
          </div>
        </div>

        <!-- Unassign Date and Time -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('Unassign Date') }}
            </label>
            <input
              type="date"
              v-model="formData.avheDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('Unassign Time') }}
            </label>
            <input
              type="time"
              v-model="formData.avheTime"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('Notes') }} ({{ $t('Optional') }})
          </label>
          <textarea
            v-model="formData.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            :placeholder="$t('Add any notes about the room unassignment...')"
          ></textarea>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BasicButton
          variant="secondary"
          @click="closeModal"
          :label="$t('Cancel')"
          :disabled="isLoading"
        />
        <BasicButton
          variant="primary"
          @click="performUnassign"
          :label="formData.avheType === 'group' ? $t('Group Unassign') : $t('Unassign')"
          :loading="isLoading"
          :disabled="isLoading || !canUnassign"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import { useReservation, type AvheReservationPayload } from '../../composables/useReservation'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { getReservationDetailsById } from '../../services/reservation'

interface Props {
  isOpen: boolean
  reservationId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'unassign-complete'): void
  (e: 'success', data: any): void
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<Emits>()
const { performAvhe: avheReservation, isAvhe } = useReservation()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)
const loading = ref(false)
const reservation = ref<any>()

// Form data
const formData = reactive({
  avheType: 'group',
  selectedRooms: [] as number[],
  avheDate: new Date().toISOString().split('T')[0],
  avheTime: new Date().toTimeString().slice(0, 5),
  notes: ''
})

const reservationRooms = ref<any>([])

// Computed properties
const canUnassign = computed(() => {
  if (formData.avheType === 'group') {
    return reservationRooms.value.length > 0
  } else {
    return formData.selectedRooms.length > 0
  }
})

// Watch for unassign type changes
watch(() => formData.avheType, (newType) => {
  if (newType === 'group') {
    formData.selectedRooms = reservationRooms.value.map((room: any) => room.id)
  } else {
    formData.selectedRooms = []
  }
})

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
  if (newRooms.length === 1) {
    // Auto-select the single room and set to group unassign
    formData.avheType = 'group'
    formData.selectedRooms = [newRooms[0].id]
  } else if (newRooms.length > 1) {
    // Auto-select all rooms for group unassign
    if (formData.avheType === 'group') {
      formData.selectedRooms = newRooms.map((room: any) => room.id)
    }
  }
}, { deep: true })

// Methods
const resetForm = () => {
  Object.assign(formData, {
    avheType: 'group',
    selectedRooms: []
  })
}

const getBookingDetailsById = async () => {
  loading.value = true
  const id = props.reservationId
  const response = await getReservationDetailsById(Number(id))
  console.log(response)
  reservation.value = response
  reservationRooms.value = response.reservationRooms.map((e: any) => {
    return { ...e, guest: reservation.value.guest }
  })

  loading.value = false
  console.log('Reservation data fetched:', reservation.value)
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const performUnassign = async () => {
  // Validate required fields
  if (!canUnassign.value) {
    toast.error(t('Please select at least one room for unassignment'))
    return
  }

  if (!formData.avheDate || !formData.avheTime) {
    toast.error(t('Please provide unassign date and time'))
    return
  }

  try {
    isLoading.value = true

    // Prepare unassign payload
    const avheDateTime = `${formData.avheDate}T${formData.avheTime}:00`
    const payload: AvheReservationPayload = {
      reservationRooms: formData.avheType === 'group'
        ? reservationRooms.value.map((room: any) => room.id)
        : formData.selectedRooms,
      actualCheckInTime: avheDateTime,
      notes: formData.notes
    }

    console.log('Unassign payload:', payload)

    // Perform unassign
    const response = await avheReservation(props.reservationId, payload)

    // Emit success event
    emit('success', { ...payload, response })
    emit('unassign-complete')

    // Close modal
    closeModal()
  } catch (error) {
    console.error('Unassign error:', error)
    // Error handling is done in the composable
  } finally {
    isLoading.value = false
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
</style>