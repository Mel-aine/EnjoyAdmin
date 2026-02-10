<template>
  <RightSideModal :is-open="isOpen" :title="$t('AssignRoom')" @close="$emit('close')">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('AssignRoom') }}</h3>
    </template>

    <!-- Content -->
    <div class="space-y-6">
      <div v-if="loading">
        <!-- Skeleton loaders -->
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
              <div class="flex gap-3 justify-start align-top items-start">
                <div class="flex flex-col bg-gray-200 p-2 rounded">
                  <div class="gap-1 text-sm text-gray-600 flex flex-col align-middle items-center">
                    <span class="font-semibold">{{ formatDateDisplay(new Date(res?.checkInDate)).day }}</span>
                    <span class="text-xs">{{ formatDateDisplay(new Date(res?.checkInDate)).month }}</span>
                  </div>
                  <div class="h-1 bg-gray-300 w-full my-1"></div>
                  <div class="flex items-center justify-between">
                    <div class="text-xs flex flex-col align-middle items-center">
                      <span class="text-gray-600 font-semibold">{{ formatDateDisplay(new Date(res?.checkOutDate)).day }}</span>
                      <span class="text-gray-500">{{ formatDateDisplay(new Date(res?.checkOutDate)).month }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-md text-gray-500 flex flex-col justify-between h-full">
                  <span class="text-blue-600 font-medium">
                    {{ res?.guest?.displayName || reservation.guest?.displayName }}
                  </span>
                  <div class="mt-2">
                    <div class="text-xs text-gray-500 mb-1">{{ $t('Original Room Type') }}</div>
                    <div class="text-sm font-medium text-gray-400">{{ res.roomType?.roomTypeName }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Room Type Selection - MAINTENANT MODIFIABLE -->
            <div class="mb-4 mt-4">
              <Select
                :lb="$t('Room Type')"
                :options="roomTypeOptions"
                v-model="selectedRoomTypes[ind]"
                :placeholder="$t('Select Room Type')"
                :isLoading="loadingRoomTypes"
                @update:model-value="() => handleRoomTypeChange(ind)"
              />
            </div>

            <!-- Room Number Input -->
            <div class="mb-6">
              <Select
                :lb="$t('Room')"
                :options="getRoomOptionsForReservation(ind)"
                v-model="res.roomId"
                :placeholder="$t('Select Room')"
                :isLoading="loadingRoomsByReservation[ind]"
                :disabled="!selectedRoomTypes[ind]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-3">
        <BasicButton
          :label="$t('Cancel')"
          variant="secondary"
          @click="$emit('close')"
        />
        <div class="flex gap-3">
          <BasicButton
            :label="$t('AssignRoom')"
            variant="primary"
            :disabled="!isAssignButtonEnabled"
            :loading="isLoading"
            @click="confirmRoomSelection"
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
import RightSideModal from './RightSideModal.vue'
import Select from '../forms/FormElements/Select.vue'
import BasicButton from '../buttons/BasicButton.vue'
import { getReservationDetailsById, assignRoomReservation } from '../../services/reservation'
import { getAvailableRoomsByTypeId} from '../../services/configrationApi'
import { formatDateDisplay } from '@/utils/dateUtils'
import { getRoomTypes } from '@/services/roomTypeApi'
import { useServiceStore } from '@/composables/serviceStore'

interface Props {
  isOpen: boolean
  reservationId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const isLoading = ref(false)
const loadingRoomTypes = ref(false)
const reservation = ref<any>(null)
const roomTypeOptions = ref<any[]>([])
const selectedRoomTypes = ref<{ [key: number]: string }>({})
const availableRoomsByReservation = ref<{ [key: number]: any[] }>({})
const loadingRoomsByReservation = ref<{ [key: number]: boolean }>({})
const serviceStore = useServiceStore()


// Computed: Vérifier si au moins une chambre est sélectionnée
const isAssignButtonEnabled = computed(() => {
  if (!reservation.value?.reservationRooms) return false
  return reservation.value.reservationRooms.some((res: any) => res.roomId && res.roomId !== '')
})

// Fonction pour obtenir les options de chambres pour une réservation
const getRoomOptionsForReservation = (index: number) => {
  const rooms = availableRoomsByReservation.value[index] || []

  return [
    { label: t('-- none --'), value: '' },
    ...rooms.map((room: any) => ({
      label: `${room.roomNumber}${room.floorNumber ? ` (${t('Floor')} ${room.floorNumber})` : ''}`,
      value: room.id
    }))
  ]
}

// Récupérer les types de chambres disponibles
const fetchRoomTypes = async () => {
  if (!serviceStore.serviceId) return

  loadingRoomTypes.value = true
  try {
    const response = await getRoomTypes(serviceStore.serviceId)
    console.log('Room types response:', response)

    if (response.data && response.data.data && response.data.data.data) {
      roomTypeOptions.value = response.data.data.data.map((roomType: any) => ({
        value: roomType.id.toString(),
        label: roomType.roomTypeName
      }))
    }
  } catch (error) {
    console.error('Error fetching room types:', error)
    toast.error(t('Error loading room types'))
  } finally {
    loadingRoomTypes.value = false
  }
}

// Gérer le changement de type de chambre
const handleRoomTypeChange = async (reservationRoomIndex: number) => {
  const roomTypeId = selectedRoomTypes.value[reservationRoomIndex]

  if (!roomTypeId || !reservation.value) return

  // Réinitialiser la sélection de chambre
  reservation.value.reservationRooms[reservationRoomIndex].roomId = ''

  // Récupérer les chambres disponibles pour ce type
  await fetchAvailableRooms(reservationRoomIndex, roomTypeId)
}

// Récupérer les chambres disponibles pour un type de chambre spécifique
const fetchAvailableRooms = async (reservationRoomIndex: number, roomTypeId: string) => {
  if (!reservation.value || !reservation.value.reservationRooms[reservationRoomIndex]) return

  const reservationRoom = reservation.value.reservationRooms[reservationRoomIndex]

  try {
    loadingRoomsByReservation.value[reservationRoomIndex] = true
    const response = await getAvailableRoomsByTypeId(
      Number(roomTypeId),
      reservationRoom.checkInDate,
      reservationRoom.checkOutDate
    )
    console.log('Available rooms response:', response)
    availableRoomsByReservation.value[reservationRoomIndex] = response.data.data.rooms || []
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    availableRoomsByReservation.value[reservationRoomIndex] = []
    toast.error(t('Error loading available rooms'))
  } finally {
    loadingRoomsByReservation.value[reservationRoomIndex] = false
  }
}

// Charger les détails de la réservation
const getBookingDetailsById = async () => {
  loading.value = true
  try {
    const id = props.reservationId
    const response = await getReservationDetailsById(Number(id))
    console.log('Reservation details:', response)

    // Filtrer seulement les chambres sans room assignée
    const baseResponse = response.reservationRooms.filter((res: any) => res.roomTypeId && !res.roomId)
    response.reservationRooms = baseResponse
    reservation.value = response

    // Initialiser les types de chambre sélectionnés avec les types originaux
    if (response.reservationRooms?.length > 0) {
      for (let i = 0; i < response.reservationRooms.length; i++) {
        const res = response.reservationRooms[i]
        if (res.roomType?.id) {
          selectedRoomTypes.value[i] = res.roomType.id.toString()
          // Charger les chambres disponibles pour le type initial
          await fetchAvailableRooms(i, res.roomType.id.toString())
        }
      }
    }
  } catch (error) {
    console.error('Error fetching reservation details:', error)
    toast.error(t('Error loading reservation details'))
  } finally {
    loading.value = false
  }
}

// Confirmer la sélection de chambres
const confirmRoomSelection = async () => {
  const roomSelections: any[] = []

  if (reservation.value?.reservationRooms) {
    for (let i = 0; i < reservation.value.reservationRooms.length; i++) {
      const res = reservation.value.reservationRooms[i]
      if (res.roomId && res.roomId !== '' && res.roomId !== 0) {
        const selectedRoom = availableRoomsByReservation.value[i]?.find((r: any) => r.id === res.roomId)
        roomSelections.push({
          reservationRoomId: res.id,
          roomNumber: selectedRoom?.roomNumber,
          roomId: res.roomId,
          roomTypeId: Number(selectedRoomTypes.value[i]),
          reservationId: props.reservationId
        })
      }
    }
  }

  if (roomSelections.length === 0) {
    toast.warning(t('Please select at least one room'))
    return
  }

  isLoading.value = true
  try {
    await assignRoomReservation(props.reservationId, { reservationRooms: roomSelections })
    toast.success(t('Room assignment completed successfully'))
    emit('refresh')
    emit('close')
  } catch (error) {
    console.error('Error assigning rooms:', error)
    toast.error(t('Failed to assign rooms. Please try again.'))
  } finally {
    isLoading.value = false
  }
}

// Watcher pour l'ouverture du modal
watch(() => props.isOpen, async (newValue) => {
  if (newValue && props.reservationId) {

    reservation.value = null
    availableRoomsByReservation.value = {}
    loadingRoomsByReservation.value = {}
    selectedRoomTypes.value = {}

    await fetchRoomTypes()

    await getBookingDetailsById()
  }
})

// Initialisation au montage
onMounted(() => {
  if (props.reservationId && props.isOpen) {
    fetchRoomTypes()
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
