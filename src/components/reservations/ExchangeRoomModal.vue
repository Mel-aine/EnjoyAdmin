<template>
  <RightSideModal :is-open="isOpen" :title="$t('Exchange Room')" @close="$emit('close')">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('ExchangeRoom') }}</h3>
    </template>
    <!-- Content -->
    <div class="space-y-6">
      <div v-if="loading">
        <!-- Skeleton loader -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
          </div>
        </div>
        <div class="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3 animate-pulse">
          <div class="flex items-center justify-between">
            <div class="flex gap-3 justify-start items-start w-full">

              <!-- Bloc gauche -->
              <div class="flex flex-col bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm w-32">
                <div class="flex flex-col items-center gap-1">
                  <div class="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div class="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div class="h-1 bg-gray-300 dark:bg-gray-600 w-full my-2 rounded"></div>
                <div class="flex items-center justify-between w-full">
                  <div class="flex flex-col items-center w-full">
                    <div class="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                    <div class="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>

              <!-- Bloc droit -->
              <div class="flex flex-col justify-between flex-1 h-full">
                <div class="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div class="flex gap-10">
                  <div>
                    <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 mt-4"></div>
                    <div class="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div>
                    <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 mt-4"></div>
                    <div class="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div v-else-if="reservation">
        <!-- Room Type Selection -->
        <div class="flex justify-between gap-2">
          <div class="mb-4 mt-4 w-6/12">
            <Select
              :lb="$t('Room Type')"
              :options="roomTypesOptions"
              :placeholder="$t('--Select--')"
              v-model="selectedRoomTypeId"
              @update:modelValue="onRoomTypeChange"
            />
          </div>
          <div class="mb-4 mt-4 w-6/12">
            <Select
              :lb="$t('Room')"
              :options="filteredRoomsOptions"
              v-model="selectedRoomId"
              :placeholder="$t('SelectRoom')"
              :disabled="!selectedRoomTypeId"
              @update:modelValue="onRoomChange"
            />
          </div>
        </div>

        <!-- Spinner during filtering -->
        <div v-if="isFiltering" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>

        <!-- Content shown when not filtering -->
        <template v-else>
          <!-- Current Reservation Rooms (Source) -->
          <div
            v-if="reservation.reservationRooms && reservation.reservationRooms.length > 0"
            class="mb-6"
          >
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-400 mb-3">{{ $t('Current Rooms') }}</h4>
            <div v-for="(resRoom, idx) in filteredReservationRooms" :key="idx">
              <div class="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                <div class="flex items-center justify-between">
                  <div class="flex gap-3 justify-start align-top items-start">
                    <div class="flex flex-col bg-white dark:bg-gray-700 p-2 rounded">
                      <div
                        class="gap-1 text-sm text-gray-600 dark:text-gray-300 flex flex-col align-middle items-center"
                      >
                        <span>{{ formatDateDisplay(new Date(resRoom.checkInDate)).day }}</span>
                        <span>{{ formatDateDisplay(new Date(resRoom.checkInDate)).month }}</span>
                      </div>
                      <div class="h-1 bg-gray-300 dark:bg-gray-600 w-full my-1"></div>
                      <div class="flex items-center justify-between">
                        <div class="text-xs flex flex-col align-middle items-center">
                          <span class="text-gray-600 dark:text-gray-300">{{
                            formatDateDisplay(new Date(resRoom.checkOutDate)).day
                          }}</span>
                          <span class="text-gray-500 dark:text-gray-400 ml-1">{{
                            formatDateDisplay(new Date(resRoom.checkOutDate)).month
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-md text-gray-500 dark:text-gray-400 flex flex-col justify-between h-full">
                      <div>
                        <span class="text-gray-700 dark:text-gray-300 font-medium">{{
                          resRoom.guest?.displayName || reservation.guest?.displayName
                        }}</span>
                      </div>
                      <div class="flex gap-7">
                        <div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 mt-8">{{ $t('roomType') }}</div>
                          <div class="text-sm font-medium">
                            {{ resRoom.roomType?.roomTypeName || resRoom.roomTypeName || 'N/A' }}
                          </div>
                        </div>
                        <div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 mt-8">
                            {{ $t('Current Room') }}
                          </div>
                          <div class="text-sm font-medium">
                            {{ resRoom.room?.roomNumber || resRoom.roomNumber || 'N/A' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Exchange Indicator (only show after filtering) -->
                <div
                  v-if="hasFilterApplied && roomExchangeMap[resRoom.id]"
                  class="mt-3 pt-3 border-t border-gray-200"
                >
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-600 dark:text-gray-300">{{ $t('Exchange with') }}:</span>
                    <span class="font-medium text-purple-600">
                      {{ getRoomExchangeLabel(resRoom.id) }}
                    </span>
                    <button
                      @click="clearExchange(resRoom.id)"
                      class="ml-auto text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs"
                    >
                      {{ $t('Clear') }}
                    </button>
                  </div>
                </div>

                <!-- Select Exchange Button (only show after filtering) -->
                <div
                  v-else-if="hasFilterApplied && !roomExchangeMap[resRoom.id]"
                  class="mt-3 pt-3 border-t border-gray-200"
                >
                  <button
                    @click="startExchangeSelection(resRoom.id)"
                    :class="[
                      'w-full py-2 px-4 rounded text-sm font-medium',
                      activeExchangeSourceId === resRoom.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800',
                    ]"
                  >
                    {{
                      activeExchangeSourceId === resRoom.id
                        ? $t('Select destination...')
                        : $t('Exchange this room')
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Info message when no filter applied -->

          <!-- <p v-if="!hasFilterApplied" class="font-medium">{{ $t('Select a room type to see available rooms for exchange') }}</p> -->

          <!-- No results message (only after filtering) -->
          <div
            v-if="hasFilterApplied && inHouseReservations.length === 0"
            class="text-center py-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div class="text-gray-600 dark:text-gray-300">
              <svg
                class="w-12 h-12 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <p class="font-medium mb-1">{{ $t('No available rooms found') }}</p>
              <p class="text-sm">
                {{ $t('There are no in-house reservations matching the selected criteria') }}
              </p>
            </div>
          </div>

          <!-- In-House Reservations List (Destination) -->
          <div
            v-if="hasFilterApplied && inHouseReservations.length > 0"
            class="mb-4 custom-scrollbar overflow-y-auto h-[350px]"
          >
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-400 mb-3">
              {{
                activeExchangeSourceId
                  ? $t('Select destination room')
                  : $t('Available In-House Reservations')
              }}
            </h4>
            <div v-for="(inHouse, idx) in inHouseReservations" :key="idx">
              <div
                class="border rounded-lg p-4 mb-3 cursor-pointer transition-all"
                :class="getInHouseCardClass(inHouse)"
                @click="selectInHouseReservation(inHouse)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex gap-3 justify-start align-top items-start">
                    <div class="flex flex-col bg-white dark:bg-gray-700 p-2 rounded">
                      <div
                        class="gap-1 text-sm text-gray-600 dark:text-gray-300 flex flex-col align-middle items-center"
                      >
                        <span>{{ formatDateDisplay(new Date(inHouse.checkInDate)).day }}</span>
                        <span>{{ formatDateDisplay(new Date(inHouse.checkInDate)).month }}</span>
                      </div>
                      <div class="h-1 bg-gray-300 dark:bg-gray-600 w-full my-1"></div>
                      <div class="flex items-center justify-between">
                        <div class="text-xs flex flex-col align-middle items-center">
                          <span class="text-gray-600 dark:text-gray-300">{{
                            formatDateDisplay(new Date(inHouse.checkOutDate)).day
                          }}</span>
                          <span class="text-gray-500 dark:text-gray-400 ml-1">{{
                            formatDateDisplay(new Date(inHouse.checkOutDate)).month
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-md text-gray-500 flex flex-col justify-between h-full">
                      <div>
                        <span class="text-purple-600 font-medium">{{ inHouse.guestName }}</span>
                        <span
                          class="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-1 rounded"
                          >{{ $t('Checked In') }}</span
                        >
                      </div>
                      <div class="flex gap-7">
                        <div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 mt-8">{{ $t('roomType') }}</div>
                          <div class="text-sm font-medium">{{ inHouse.roomTypeName }}</div>
                        </div>
                        <div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 mt-8">{{ $t('Room') }}</div>
                          <div class="text-sm font-medium">{{ inHouse.roomNumber }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="isRoomSelected(inHouse)" class="flex items-center">
                    <CheckIcon class="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-3">
        <BasicButton :label="$t('Cancel')" variant="secondary" @click="$emit('close')" />
        <div class="flex gap-3">
          <BasicButton
            :label="$t('ExchangeRoom')"
            variant="primary"
            :disabled="!isExchangeButtonEnabled"
            :loading="isLoading"
            @click="confirmRoomExchange"
          />
        </div>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import Select from '../forms/FormElements/Select.vue'
import BasicButton from '../buttons/BasicButton.vue'
import { getReservationDetailsById, postExchangeRoomReservation } from '../../services/reservation'
import {
  getAvailableRoomsByTypeId,
  getInHouseReservations,
  getRoomsByTypeId,
} from '../../services/configrationApi'
import { getRoomTypes } from '@/services/roomTypeApi'
import { formatDateDisplay } from '@/utils/dateUtils'
import RightSideModal from '../modal/RightSideModal.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
import { useServiceStore } from '@/composables/serviceStore'

const props = defineProps<{
  isOpen: boolean
  reservationId: number
}>()

const emit = defineEmits(['close', 'refresh', 'success'])

const { t } = useI18n()
const toast = useToast()
const loading = ref(true)
const isLoading = ref(false)
const isFiltering = ref(false)
const reservation = ref<any | null>(null)

// Nouveau système pour gérer les échanges multiples
const roomExchangeMap = ref<Record<number, any>>({}) // { reservationRoomId: inHouseReservation }
const activeExchangeSourceId = ref<number | null>(null) // La chambre source en cours de sélection

const roomTypesOptions = ref<any[]>([])
const selectedRoomTypeId = ref<any | null>(null)
const selectedRoomId = ref<any | null>(null)
const inHouseReservations = ref<any[]>([])
const allAvailableRooms = ref<any[]>([])

// Track if user has applied any filter
const hasFilterApplied = computed(() => {
  return selectedRoomTypeId.value !== null || selectedRoomId.value !== null
})

// Computed property for filtered rooms based on selected room type
const filteredRoomsOptions = computed(() => {
  if (!selectedRoomTypeId.value) return []

  const filtered = allAvailableRooms.value
    .filter((room) => room.roomTypeId === selectedRoomTypeId.value)
    .map((room) => ({
      label: room.roomNumber || room.name,
      value: room.id,
    }))

  return filtered
})

// Computed property - Always show ALL reservation rooms
const filteredReservationRooms = computed(() => {
  if (!reservation.value?.reservationRooms) return []
  return reservation.value.reservationRooms
})

const isExchangeButtonEnabled = computed(() => {
  return Object.keys(roomExchangeMap.value).length > 0
})

const startExchangeSelection = (reservationRoomId: number) => {
  activeExchangeSourceId.value = reservationRoomId
}

const selectInHouseReservation = (inHouse: any) => {
  if (!activeExchangeSourceId.value) {
    activeExchangeSourceId.value = filteredReservationRooms.value[0]?.id
    if (!activeExchangeSourceId.value) return
  }

  // Vérifier si cette chambre n'est pas déjà utilisée
  const alreadyUsed = Object.values(roomExchangeMap.value).some(
    (r: any) => r.roomId === inHouse.roomId,
  )

  if (alreadyUsed) {
    toast.warning(t('This room is already selected for another exchange'))
    return
  }

  roomExchangeMap.value[activeExchangeSourceId.value] = inHouse
  activeExchangeSourceId.value = null
}

const clearExchange = (reservationRoomId: number) => {
  delete roomExchangeMap.value[reservationRoomId]
}

const getRoomExchangeLabel = (reservationRoomId: number) => {
  const exchange = roomExchangeMap.value[reservationRoomId]
  if (!exchange) return ''
  return `${exchange.roomNumber} (${exchange.guestName})`
}

const isRoomSelected = (inHouse: any) => {
  return Object.values(roomExchangeMap.value).some((r: any) => r.roomId === inHouse.roomId)
}

const getInHouseCardClass = (inHouse: any) => {
  const isSelected = isRoomSelected(inHouse)
  const isDisabled = isSelected && !activeExchangeSourceId.value

  if (isSelected) {
    return 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900 ring-2 ring-purple-500'
  }
  if (activeExchangeSourceId.value) {
    return 'border-purple-200 dark:border-purple-400 bg-purple-50 dark:bg-purple-900 hover:border-purple-400 dark:hover:border-purple-300'
  }
  return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50'
}

const onRoomTypeChange = async (roomTypeId: number) => {
  selectedRoomId.value = null
  activeExchangeSourceId.value = null
  isFiltering.value = true

  if (roomTypeId) {
    await fetchRoomsByType(roomTypeId)
    await fetchInHouseReservations(roomTypeId, null)
  } else {
    inHouseReservations.value = []
  }

  isFiltering.value = false
}

const onRoomChange = async (roomId: number) => {
  activeExchangeSourceId.value = null
  isFiltering.value = true

  if (roomId && selectedRoomTypeId.value) {
    await fetchInHouseReservations(selectedRoomTypeId.value, roomId)
  }

  isFiltering.value = false
}

const fetchInHouseReservations = async (roomTypeId: number | null, roomId: number | null) => {
  const serviceStore = useServiceStore()
  const hotelId = serviceStore.serviceId

  if (!hotelId) {
    console.error('❌ No hotelId available in store!')
    toast.error(t('Hotel ID is missing. Please refresh the page.'))
    return
  }

  try {
    const params: any = {
      hotelId: Number(hotelId),
    }

    if (roomTypeId) {
      params.roomTypeId = Number(roomTypeId)
    }

    if (roomId) {
      params.roomId = Number(roomId)
    }

    const response: any = await getInHouseReservations(params)

    if (response.data?.success) {
      // Filtrer les chambres déjà dans la réservation actuelle
      const currentRoomIds = reservation.value?.reservationRooms?.map((r: any) => r.roomId) || []
      inHouseReservations.value = (response.data.data || []).filter(
        (r: any) => !currentRoomIds.includes(r.roomId),
      )
    } else {
      inHouseReservations.value = []
    }
  } catch (error: any) {
    console.error('❌ Error fetching in-house reservations:', error)
    toast.error(t('Failed to fetch in-house reservations'))
    inHouseReservations.value = []
  }
}

const fetchRoomsByType = async (roomTypeId: number) => {
  try {
    const response: any = await getRoomsByTypeId(roomTypeId)

    const rooms = response.data.data.rooms || []
    allAvailableRooms.value = rooms.map((room: any) => ({
      ...room,
      roomTypeId: roomTypeId,
    }))
    console.log('allAvailableRooms.value', response)
  } catch (error) {
    console.error('Error fetching rooms by type:', error)
    allAvailableRooms.value = []
  }
}

const getBookingDetailsById = async () => {
  if (!props.reservationId) return
  loading.value = true
  try {
    const response: any = await getReservationDetailsById(props.reservationId)
    console.log('response', response)
    reservation.value = response
  } catch (error) {
    console.error('Error fetching reservation details:', error)
  } finally {
    loading.value = false
  }
}

const fetchRoomTypes = async () => {
  const hotelId = useServiceStore().serviceId
  try {
    const rep = await getRoomTypes(hotelId!)
    roomTypesOptions.value = rep.data.data.data.map((r: any) => ({
      label: r.roomTypeName,
      value: r.id,
    }))
  } catch (error) {
    console.error(error)
  }
}

const confirmRoomExchange = async () => {
  const exchanges = Object.entries(roomExchangeMap.value).map(
    ([resRoomId, inHouse]: [string, any]) => {
      return {
        reservationRoomId: Number(resRoomId),
        roomNumber: inHouse.roomNumber,
        roomId: inHouse.roomId,
        roomTypeId: inHouse.roomTypeId,
        reservationId: props.reservationId,
        exchangeType: 'reservation_swap',
        targetReservationId: inHouse.reservationId,
      }
    },
  )

  if (exchanges.length === 0) {
    toast.warning(t('Please select at least one room exchange'))
    return
  }

  isLoading.value = true
  try {
    console.log('exchanges', exchanges)
    await postExchangeRoomReservation(props.reservationId, { reservationRooms: exchanges })
    toast.success(t('room(s) exchanged successfully'))
    emit('success')
    emit('close')
  } catch (error) {
    console.error('Error exchanging rooms:', error)
    toast.error(t('Failed to exchange rooms. Please try again.'))
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue && props.reservationId) {
      reservation.value = null
      allAvailableRooms.value = []
      selectedRoomTypeId.value = null
      selectedRoomId.value = null
      roomExchangeMap.value = {}
      activeExchangeSourceId.value = null
      inHouseReservations.value = []
      await getBookingDetailsById()
      await fetchRoomTypes()
    }
  },
)

onMounted(() => {
  if (props.reservationId) {
    getBookingDetailsById()
    fetchRoomTypes()
  }
})
</script>

<style scoped>
/* Scrollbar invisible mais toujours scrollable */
.custom-scrollbar {
  scrollbar-width: none; /* Firefox */
}
.custom-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
</style>
