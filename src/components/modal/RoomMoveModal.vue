<template>
  <RightSideModal :is-open="isOpen" :title="$t('Room Move')" @close="$emit('close')">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('Room Move') }}</h3>
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
                    <div class="text-xs text-gray-500 mb-1 mt-8 ">{{ $t('roomType') }}</div>
                    <div class="text-sm font-medium">{{ res.roomType?.roomTypeName }}</div>
                  </div>
                </div>

              </div>
            </div>



            <!-- Room Type Selection -->
            <div class="mb-4 mt-4">
              <AutoCompleteSelect
                :lb="$t('Room Type')"
                :options="getRoomTypeOptionsFor(res)"
                v-model="res.selectedRoomTypeId"
                :defaultValue="$t('Select Room Type')"
                @change="onRoomTypeChanged(ind)"
              />
            </div>
            <!-- <div v-if="isRoomTypeDifferent(res)" class="mb-4">
              <Toggle :title="$t('Overwrite room rate')" v-model="res.overwriteRoomRate" />
            </div> -->
            <div class="mb-4 mt-4">
              <Input :lb="$t('From room')" :model-value="res.room.roomNumber" :disabled="true" />
            </div>
            <!-- Room Number Input -->
            <div class="mb-6">
              <AutoCompleteSelect
                :lb="$t('To room')"
                :options="[
                  { label: $t('-- none --'), value: '' },
                  ...(availableRoomsByReservation[ind] || []).map(rs => ({
                    label: rs.roomNumber,
                    value: rs.id,
                    status: String(rs.status ?? '').toLowerCase(),
                    disabled: String(rs.status ?? '').toLowerCase() === 'occupied',
                  }))
                ]"
                v-model="res.roomId"
                :defaultValue="$t('Select Room')"
                :disabled="!res.selectedRoomTypeId"
              />
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
import AutoCompleteSelect from '../forms/FormElements/AutoCompleteSelect.vue'
import BasicButton from '../buttons/BasicButton.vue'
import { getReservationDetailsById, postRoomMoveReservation } from '../../services/reservation'
import { getFrontofficeBookingDataId } from '../../services/configrationApi'
import { formatDateDisplay } from '@/utils/dateUtils'
import Input from '../forms/FormElements/Input.vue'
import Toggle from '../forms/FormElements/Toggle.vue'

const props = defineProps<{
  isOpen: boolean
  reservationId: number
}>()

const emit = defineEmits(['close', 'success'])

const { t } = useI18n()
const toast = useToast()
const loading = ref(true)
const isLoading = ref(false)
const reservation = ref<any | null>(null)

// Store available rooms per reservation entry
const availableRoomsByReservation = ref<Record<number, Array<any>>>({})
const frontofficeRoomTypes = ref<any[]>([])

const baseRoomTypeOptions = computed(() => {
      console.log('frontofficeRoomTypes',frontofficeRoomTypes)
  return (frontofficeRoomTypes.value || []).map((rt: any) => {
    const rooms = Array.isArray(rt?.rooms) ? rt.rooms : []
    const availableCount = rooms.length
    const roomRates = Array.isArray(rt?.roomRates) ? rt.roomRates : []
    const rateTypeIds = roomRates
      .map((rm: any) => Number(rm?.rateType?.id ?? rm?.rateTypeId ?? rm?.rateType?.rateTypeId ?? rm?.rateType))
      .filter((n: number) => Number.isFinite(n) && n > 0)
      console.log('rateTypeIds',rateTypeIds)
    const rateTypeNames = roomRates
      .map((rm: any) => String(rm?.rateType?.rateTypeName ?? rm?.rateTypeName ?? ''))
      .map((s: string) => s.trim())
      .filter(Boolean)
    return {
      label: rt.roomTypeName,
      value: rt.id,
      count: availableCount,
      rateTypeIds,
      rateTypeNames,
    }
  })
})

const getRoomTypeOptionsFor = (resRoom: any) => {
  const originalRoomTypeId = getOriginalRoomTypeId(resRoom)
  const originalRateTypeId = getOriginalRateTypeId(resRoom)
  const originalRateTypeName = getOriginalRateTypeName(resRoom)
  console.log('originalRateTypeName',originalRateTypeName,originalRateTypeId,originalRoomTypeId)
  return baseRoomTypeOptions.value.filter((opt: any) => {
    const count = Number(opt?.count ?? 0)
    const matchesAvailability = count > 0 || (originalRoomTypeId !== null && Number(opt?.value) === originalRoomTypeId)
    if (!matchesAvailability) return false
      console.log('opt',opt,originalRateTypeId)

    if (originalRoomTypeId !== null && Number(opt?.value) === originalRoomTypeId) return true
          console.log('opt 2',opt,originalRateTypeId)

    if (originalRateTypeId !== null) {
      const ids = Array.isArray(opt?.rateTypeIds) ? opt.rateTypeIds : []
      return ids.some((id: any) => Number(id) === originalRateTypeId)
    }

    if (originalRateTypeName) {
      const names = Array.isArray(opt?.rateTypeNames) ? opt.rateTypeNames : []
      return names.some((name: any) => String(name).toLowerCase() === originalRateTypeName.toLowerCase())
    }

    return true
  })
}

const isAssignButtonEnabled = computed(() => {
  if (!reservation.value?.reservationRooms) return false
  return reservation.value.reservationRooms.some((res: any) => res.roomId && res.roomId !== '' && res.roomId !== 0)
})

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord => typeof value === 'object' && value !== null

const normalizeStatus = (status: unknown): string =>
  String(status ?? '')
    .toLowerCase()
    .replace(/[_\s-]/g, '')

const toDateOnly = (value: unknown): string => {
  const s = String(value ?? '')
  return s.length >= 10 ? s.slice(0, 10) : s
}

const maxDateString = (a?: string, b?: string): string => {
  if (a && b) return a > b ? a : b
  return a || b || ''
}

const isRoomCheckedInNow = (room: unknown): boolean => {
  const status = normalizeStatus(isRecord(room) ? room['status'] : undefined)
  const actualCheckInTime = isRecord(room) ? room['actualCheckInTime'] : undefined
  const checkedIn = isRecord(room) ? room['checkedIn'] : undefined
  return Boolean(actualCheckInTime || checkedIn === true || status === 'checkedin' || status === 'occupied')
}

const isReservationCheckedInNow = (res: unknown): boolean => {
  const status = normalizeStatus(isRecord(res) ? res['status'] : undefined)
  if (status === 'checkedin' || status === 'occupied') return true
  const rooms = isRecord(res) ? res['reservationRooms'] : undefined
  return Array.isArray(rooms) ? rooms.some((r: unknown) => isRoomCheckedInNow(r)) : false
}

const getAvailabilityRangeForRoomMove = (rooms: unknown[]): { startDate?: string; endDate?: string } => {
  const today = new Date().toISOString().split('T')[0]
  const startDates = rooms
    .map((r: unknown) => toDateOnly(isRecord(r) ? r['checkInDate'] : undefined))
    .filter(Boolean)
  const endDates = rooms
    .map((r: unknown) => toDateOnly(isRecord(r) ? r['checkOutDate'] : undefined))
    .filter(Boolean)
  let startDate = startDates.sort()[0]
  const endDate = endDates.sort().slice(-1)[0]
  if (isReservationCheckedInNow(reservation.value)) {
    startDate = maxDateString(startDate, today)
  }
  if (startDate && endDate && startDate > endDate) {
    startDate = endDate
  }
  return {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  }
}

const getAvailabilityRangeForRoom = (room: unknown): { startDate?: string; endDate?: string } => {
  const today = new Date().toISOString().split('T')[0]
  let startDate = toDateOnly(isRecord(room) ? room['checkInDate'] : undefined)
  const endDate = toDateOnly(isRecord(room) ? room['checkOutDate'] : undefined)
  if (isRoomCheckedInNow(room) || isReservationCheckedInNow(reservation.value)) {
    startDate = maxDateString(startDate, today)
  }
  if (startDate && endDate && startDate > endDate) {
    startDate = endDate
  }
  return {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  }
}

const getOriginalRoomTypeId = (resRoom: any): number | null => {
  const id = resRoom?.originalRoomTypeId ?? resRoom?.roomType?.id ?? resRoom?.roomTypeId
  const n = Number(id)
  return Number.isFinite(n) && n > 0 ? n : null
}

const getOriginalRateTypeId = (resRoom: any): number | null => {
  const id =
    resRoom?.originalRateTypeId ??
    resRoom?.roomRates?.rateType?.id ??
    resRoom?.roomRates?.rateTypeId ??
    resRoom?.roomRate?.rateType?.id ??
    resRoom?.roomRate?.rateTypeId ??
    resRoom?.rateType?.id ??
    resRoom?.rateTypeId ??
    resRoom?.rateType
  const n = Number(id)
  return Number.isFinite(n) && n > 0 ? n : null
}

const getOriginalRateTypeName = (resRoom: any): string | null => {
  const name =
    resRoom?.roomRates?.rateType?.rateTypeName ??
    resRoom?.roomRates?.rateTypeName ??
    resRoom?.roomRate?.rateType?.rateTypeName ??
    resRoom?.roomRate?.rateTypeName ??
    resRoom?.rateType?.rateTypeName ??
    resRoom?.rateTypeName
  const s = String(name ?? '').trim()
  return s ? s : null
}

const isRoomTypeDifferent = (resRoom: any): boolean => {
  const original = getOriginalRoomTypeId(resRoom)
  const selected = Number(resRoom?.selectedRoomTypeId ?? original)
  return Boolean(original && Number.isFinite(selected) && selected > 0 && selected !== original)
}

const fetchFrontofficeRoomTypes = async (startDate?: string, endDate?: string) => {
  const response: any = await getFrontofficeBookingDataId(startDate, endDate)
  const data = response?.data?.data
  console.log('frontofficeRoomTypes',data)
  frontofficeRoomTypes.value = Array.isArray(data) ? data : []
}

const getBookingDetailsById = async () => {
  if (!props.reservationId) return
  loading.value = true
  try {
    const response: any = await getReservationDetailsById(props.reservationId)
    reservation.value = response

    const rooms = reservation.value?.reservationRooms || []
    if (rooms.length > 0) {
      const range = getAvailabilityRangeForRoomMove(rooms)
      await fetchFrontofficeRoomTypes(range.startDate, range.endDate)
    }

    if (reservation.value?.reservationRooms) {
      for (const resRoom of reservation.value.reservationRooms) {
        const originalRoomTypeId = getOriginalRoomTypeId(resRoom)
        resRoom.originalRoomTypeId = originalRoomTypeId
        resRoom.originalRateTypeId = getOriginalRateTypeId(resRoom)
        resRoom.selectedRoomTypeId = originalRoomTypeId
        resRoom.overwriteRoomRate = false
      }
    }

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
    const roomTypeId = Number(res?.selectedRoomTypeId ?? res?.roomType?.id ?? res?.roomTypeId)

    if (!roomTypeId) {
      availableRoomsByReservation.value[index] = []
      return
    }

    if (!frontofficeRoomTypes.value.length) {
      const range = getAvailabilityRangeForRoom(res)
      await fetchFrontofficeRoomTypes(range.startDate, range.endDate)
    }
    const roomType = (frontofficeRoomTypes.value || []).find((rt: any) => Number(rt.id) === roomTypeId)
    const rooms = Array.isArray(roomType?.rooms) ? roomType.rooms : []
    availableRoomsByReservation.value[index] = rooms
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    availableRoomsByReservation.value[index] = []
  }
}

const onRoomTypeChanged = async (index: number) => {
  const res = reservation.value?.reservationRooms?.[index]
  if (!res) return
  if (!isRoomTypeDifferent(res)) {
    res.overwriteRoomRate = false
  }
  res.roomId = ''
  await fetchAvailableRooms(index)
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
          // roomNumber: res.roomNumber,
          newRoomId: res.roomId,
          roomTypeId: Number(res.selectedRoomTypeId ?? res?.roomType?.id ?? res?.roomTypeId),
          newroomTypeId: Number(res.selectedRoomTypeId ?? res?.roomType?.id ?? res?.roomTypeId),
          rateTypeId: getOriginalRateTypeId(res),
          overwrite_room_rate: isRoomTypeDifferent(res) ? Boolean(res.overwriteRoomRate) : false,
          // reservationId: props.reservationId
        })
      }
    }
  }

  // Call assignRoomReservation if roomSelections is not empty
  if (roomSelections.length > 0) {
    isLoading.value = true
    try {
      const data = {
        reservationId: props.reservationId,
        moves: roomSelections,
      }
      await postRoomMoveReservation(props.reservationId, data)
      toast.success(t('Room move completed successfully'))
      emit('success')
    } catch (error) {
      console.error('Error exchanging rooms:', error)
      toast.error(t('Failed to move rooms. Please try again.'))
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
