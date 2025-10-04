<template>
  <RightSideModal :is-open="isOpen" :title="'Room Move'" @close="$emit('close')">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">Room Move</h3>
    </template>
    <!-- Content -->
    <div class="space-y-6">
      <div v-if="loading">
        <!-- Skeleton for Room Type Dropdown -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
          </div>
        </div>

        <!-- Skeleton for Guest Card -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <div class="h-4 bg-gray-200 rounded w-6 animate-pulse"></div>
                  <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div class="mt-1">
                  <div class="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                </div>
              </div>
              <div class="ml-4">
                <div class="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div class="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-4 bg-gray-200 rounded w-6 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
            <div class="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        <!-- Skeleton for Room Type Selection -->
        <div class="mb-4">
          <div class="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
          <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <!-- Skeleton for Room Number Input -->
        <div class="mb-6">
          <div class="h-4 bg-gray-200 rounded w-12 animate-pulse mb-2"></div>
          <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <div v-else-if="reservation">
        <div v-for="(res, ind) in reservation.reservationRooms" :key="ind">

          <!-- Guest Card -->
          <div class="border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex  gap-3 justify-start align-top items-start">
                <div class="flex flex-col bg-gray-200 p-2">
                  <div class="gap-1 text-sm text-gray-600 flex flex-col align-middle items-center">
                    <span>{{ formatDateDisplay(new Date(res?.checkInDate)).day }}</span>
                    <span>{{ formatDateDisplay(new Date(res?.checkInDate)).month }}</span>
                  </div>
                  <div class="h-1 bg-gray-300 w-full my-1"></div>
                  <div class="flex items-center justify-between">
                    <div class="text-xs flex flex-col align-middle items-center">
                      <span class="text-gray-600">{{ formatDateDisplay(new Date(res?.checkOutDate)).day }}</span>
                      <span class="text-gray-500 ml-1">{{ formatDateDisplay(new Date(res?.checkOutDate)).month }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-md text-gray-500 flex flex-col justify-between h-full">
                  <span class="text-blue-600 font-medium">{{ res?.guest?.displayName || reservation.guest?.displayName
                  }}</span>
                  <div class="">
                    <div class="text-xs text-gray-500 mb-1 mt-8 ">Room Type</div>
                    <div class="text-sm font-medium">{{ res.roomType?.roomTypeName }}</div>
                  </div>
                </div>

              </div>
            </div>



            <!-- Room Type Selection -->
            <div class="mb-4 mt-4">
              <Select :lb="$t('Room Type')"
                :options="[{ label: res.roomType?.roomTypeName || '', value: res.roomType?.id || '' }]"
                :model-value="res.roomType?.id" :disabled="true" :placeholder="$t('Select Room Type')" />
            </div>
            <div class="mb-4 mt-4">
              <Input :lb="$t('From room')" :model-value="res.room.roomNumber" :disabled="true" />
            </div>
            <!-- Room Number Input -->
            <div class="mb-6">
              <Select :lb="$t('To room')" :options="[
                { label: $t('-- none --'), value: '' },
                ...(availableRoomsByReservation[ind] || []).map(rs => ({
                  label: rs.roomNumber,
                  value: rs.id
                }))
              ]" v-model="res.roomId" :placeholder="$t('Select Room')" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-3">
        <BasicButton :label="$t('Cancel')" variant="secondary" @click="$emit('close')" />
        <div class="flex gap-3">
          <BasicButton :label="$t('Move Room')" variant="primary" :disabled="!isAssignButtonEnabled"
            :loading="isLoading" @click="confirmRoomSelection" />
        </div>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import RightSideModal from './RightSideModal.vue'
import Select from '../forms/FormElements/Select.vue'
import BasicButton from '../buttons/BasicButton.vue'
import { getReservationDetailsById, assignRoomReservation, postRoomMoveReservation } from '../../services/reservation'
import { getAvailableRoomsByTypeId } from '../../services/configrationApi'
import { formatDateDisplay } from '@/utils/dateUtils'
import Input from '../forms/FormElements/Input.vue'

const props = defineProps<{
  isOpen: boolean
  reservationId: number
}>()

const emit = defineEmits(['close', 'refresh'])

const { t } = useI18n()
const toast = useToast()
const loading = ref(true)
const isLoading = ref(false)
const reservation = ref<any | null>(null)

// Store available rooms per reservation entry
const availableRoomsByReservation = ref<Record<number, Array<any>>>({})

const isAssignButtonEnabled = computed(() => {
  if (!reservation.value?.reservationRooms) return false
  return reservation.value.reservationRooms.some((res: any) => res.roomId && res.roomId !== '' && res.roomId !== 0)
})

const getBookingDetailsById = async () => {
  if (!props.reservationId) return
  loading.value = true
  try {
    const response: any = await getReservationDetailsById(props.reservationId)
    reservation.value = response

    // Fetch available rooms for each reservation room type
    if (reservation.value?.reservationRooms) {
      for (let i = 0; i < reservation.value.reservationRooms.length; i++) {
        await fetchAvailableRooms(i)
      }
    }
  } catch (error) {
    console.error('Error fetching reservation details:', error)
  } finally {
    loading.value = false
  }
}

const fetchAvailableRooms = async (index: number) => {
  try {
    const res = reservation.value!.reservationRooms[index]
    const roomTypeId = res?.roomType?.id || res?.roomTypeId

    if (!roomTypeId) {
      availableRoomsByReservation.value[index] = []
      return
    }

    const response: any = await getAvailableRoomsByTypeId(roomTypeId, new Date().toISOString().split('T')[0],
      res.checkOutDate)
    console.log(response)
    availableRoomsByReservation.value[index] = response.data.data.rooms || []
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    availableRoomsByReservation.value[index] = []
  }
}

const confirmRoomSelection = async () => {
  // Emit room selection for each reservation room that has a selected room
  const roomSelections: any[] = []

  if (reservation.value?.reservationRooms) {
    for (let i = 0; i < reservation.value.reservationRooms.length; i++) {
      const res = reservation.value.reservationRooms[i]
      if (res.roomId && res.roomId !== '' && res.roomId !== 0) {
        roomSelections.push({
          reservationRoomId: res.id,
          roomNumber: res.roomNumber,
          roomId: res.roomId,
          roomTypeId: res.roomTypeId,
          reservationId: props.reservationId
        })
      }
    }
  }

  // Call assignRoomReservation if roomSelections is not empty
  if (roomSelections.length > 0) {
    isLoading.value = true
    try {
      const data ={
        newRoomId: roomSelections[0].roomId,
      }
      await postRoomMoveReservation(props.reservationId, data)
      toast.success(t('Room exchange completed successfully'))
      emit('refresh')
    } catch (error) {
      console.error('Error exchanging rooms:', error)
      toast.error(t('Failed to exchange rooms. Please try again.'))
    } finally {
      isLoading.value = false
    }
  }
}

watch(() => props.isOpen, async (newValue) => {
  if (newValue && props.reservationId) {
    // Reset data
    reservation.value = null
    availableRoomsByReservation.value = {}
    // Load data
    await getBookingDetailsById()
  }
})

// Initialize when component mounts
onMounted(() => {
  if (props.reservationId) {
    getBookingDetailsById()
  }
})

</script>

<style scoped>
/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>