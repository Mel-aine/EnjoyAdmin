<template>
  <div class="w-full">
    <!-- Tableau avec scrollbar invisible -->
    <div class="w-full overflow-auto border border-gray-200 rounded max-h-[600px] scrollbar-hide">
      <table class="w-full text-sm">
        <thead class="sticky top-0 bg-white z-10">
          <!-- En-tête normal quand aucune sélection -->
          <tr class="bg-gray-100" v-if="!selectedRoomsCount">
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center w-10">
              <input
                type="checkbox"
                :checked="allFilteredDirtyRoomsSelected"
                @change="toggleAllFilteredDirtyRooms"
                class="form-checkbox"
                :disabled="!hasDirtyRoomsInFiltered"
              />
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center w-50">
              <Select :options="roomTypesOptions" :placeholder="$t('RoomTypes')" v-model="selectedRoomTypeFilter"/>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center">
              <div class="flex items-center justify-center">
                <PersonStanding />
              </div>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center bg-red-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-red-500 mr-1"></div>
                <span class="text-sm">{{ $t('occupied') }}</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center bg-yellow-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4  bg-orange-500 mr-1"></div>
                <span class="text-sm">{{ $t('dirty') }}</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center bg-green-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-green-500 mr-1"></div>
                <span class="text-sm">{{ $t('clean') }}</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-gray-200 text-center bg-gray-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                <span class="text-sm">{{ $t('statut.outOfOrder') }}</span>
              </div>
            </th>
          </tr>

          <!-- En-tête avec contrôles de sélection quand des chambres sont sélectionnées -->
          <tr class="bg-gray-50" v-if="selectedRoomsCount > 0">
            <th colspan="7" class="py-3 px-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="text-sm font-medium">{{ selectedRoomsCount }} Records Selected</span>

                  <div class="flex items-center space-x-2">
                    <div class="w-48">
                      <Select :placeholder="'Select operation'" :options="availableOperations" v-model="selectedOperation" @change="onOperationChange"/>
                    </div>

                    <!-- Select pour le statut si "Set Status" est sélectionné -->
                    <div v-if="selectedOperation === 'set_clean_status'" class="w-48">
                      <Select :placeholder="$t('set_to_clean')" :options="[{value: 'clean', label: t('clean')}]" v-model="selectedStatus"/>
                    </div>

                    <!-- Select pour le housekeeper si "Assign Housekeeper" est sélectionné -->
                    <div v-if="selectedOperation === 'assign_housekeeper'" class="w-48">
                      <Select :placeholder="$t('select_housekeeper')" :options="housekeeperOptions" v-model="selectedHousekeeper"/>
                    </div>

                    <button
                      class="bg-purple-500 hover:bg-purple-600 text-white rounded px-4 py-2 text-sm transition-colors"
                      @click="applyBulkAction"
                      :disabled="!canApplyOperation || isBulkUpdating"
                      :class="{ 'opacity-50 cursor-not-allowed': !canApplyOperation || isBulkUpdating }"
                    >
                      <span v-if="isBulkUpdating">{{ $t('Applying...') }}</span>
                      <span v-else>{{ $t('commons.apply') }}</span>
                    </button>
                  </div>
                </div>

                <button
                  @click="unselectAll"
                  class="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  {{ $t('commons.unselectAll') }}
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody v-if="!isLoading">
          <template v-for="section in Object.keys(filteredGroupedRooms)" :key="section">
            <!-- En-tête de section avec checkbox pour sélectionner toute la section (seulement les dirty) -->
            <tr class="bg-gray-100">
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                <input
                  type="checkbox"
                  :checked="isSectionDirtyRoomsSelected(section)"
                  @change="toggleSectionDirtyRooms(section)"
                  class="form-checkbox"
                  :disabled="!sectionHasDirtyRooms(section)"
                />
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 font-medium text-center">
                {{ section }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).total }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).occupied }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).dirty }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).clean }}
              </td>
              <td class="py-2 px-3 border-b border-gray-200 text-center">
                {{ getSectionTotals(section).outOfOrder }}
              </td>
            </tr>

            <!-- Chambres de la section -->
            <tr
              v-for="room in filteredGroupedRooms[section]"
              :key="room.id + room.name"
              :class="room.isChecked ? 'bg-blue-100' : ''"
            >
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getRoomBorderColor(room)
                ]"
              >
                <input
                  type="checkbox"
                  :checked="room.isChecked"
                  @change="handleCheckboxChange(room.id, room.name)"
                  class="form-checkbox"
                  :disabled="!canSelectRoom(room)"
                />
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                <div class="flex items-center justify-center">
                  <span>{{ room.name }}</span>
                  <BedIcon :size="16" class="ml-2" />
                  <!-- Indicateur housekeeper assigné -->
                  <span v-if="room.assignedHousekeeper" class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {{ room.assignedHousekeeper }}
                  </span>
                </div>
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ room.beds }}
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 3 ? 'bg-red-50' : ''
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 3"
                  :room="room.name"
                  :status="$t('occupied')"
                  :tag="room.tag"
                  type="red"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 4 ? 'bg-orange-50' : ''
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 4"
                  :room="room.name"
                  :status="$t('dirty')"
                  :tag="room.tag"
                  type="yellow"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 5 ? 'bg-green-50' : ''
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 5"
                  :room="room.name"
                  :status="$t('available')"
                  :tag="room.tag"
                  type="green"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 6 ? 'bg-gray-100' : ''
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 6"
                  :room="room.name"
                  :status="$t('statut.outOfOrder')"
                  :tag="room.tag"
                  type="gray"
                />
              </td>
            </tr>
          </template>

          <!-- Ligne de total -->
          <tr class="bg-orange-50 sticky bottom-0">
            <td class="py-2 px-3 border-b border-r border-gray-200"></td>
            <td class="py-2 px-3 border-b border-r border-gray-200 font-medium text-center">
              {{ $t('total') }} ({{ selectedCount }} {{ $t('selected') }})
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.length }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter(r => r.status === 'occupied').length }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter(r => isDirtyRoom(r)).length }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter(r => isCleanRoom(r)).length }}
            </td>
            <td class="py-2 px-3 border-b border-gray-200 text-center">
              {{ filteredRooms.filter(r => r.status === 'out_of_order').length }}
            </td>
          </tr>
        </tbody>

        <!-- Loading state -->
        <tbody v-if="isLoading">
          <tr>
            <td colspan="7" class="py-8 text-center">
              <div class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                <span>{{ $t('loadingInProgress') }}</span>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Empty state -->
        <tbody v-if="!isLoading && rooms.length === 0">
          <tr>
            <td colspan="7" class="py-8 text-center text-gray-500">
              {{ $t('noRoomFound') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, toRefs } from 'vue'
import { Bed as BedIcon } from 'lucide-vue-next'
import StatusBadge from './StatusBadge.vue'
import { PersonStanding } from 'lucide-vue-next';
import Select from '@/components/forms/FormElements/Select.vue';
import {getHouseStatus, bulkUpdateRooms} from '@/services/configrationApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n'

// Define room data type
interface Room {
  id: string
  name: string
  beds: number
  isChecked: boolean
  section: string
  roomType: string
  status: 'available' | 'occupied' | 'out_of_order' | 'maintenance' | 'dirty'
  housekeepingStatus: 'clean' | 'dirty'
  tag: string
  statusType: 'red' | 'green' | 'gray' | 'yellow'
  assignedHousekeeper?: string
}

// Props pour recevoir la recherche du parent
interface Props {
  searchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: ''
})

const { searchQuery } = toRefs(props)

// Define emits
const emit = defineEmits<{
  'selection-change': [count: number]
}>()

// Reactive variables
const selectedRoomType = ref<string>('')
const selectedRoomTypeFilter = ref<string>('')
const selectedRoomsCount = ref<number>(0)
const selectedOperation = ref<string>('')
const selectedStatus = ref<string>('clean')
const selectedHousekeeper = ref<string>('')
const serviceStore = useServiceStore()
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)
const isBulkUpdating = ref<boolean>(false)
const authStore = useAuthStore()
const toast = useToast()
const { t } = useI18n()

// Initialize empty arrays for API data
const rooms = ref<Room[]>([])
const roomTypesOptions = ref<Array<{value: number, label: string}>>([])
const housekeepingStatusOptions = ref<Array<{value: string, label: string}>>([])
const housekeeperOptions = ref<Array<{value: string, label: string}>>([])

// Operations disponibles selon le contexte
const availableOperations = computed(() => {
  const selectedRooms = rooms.value.filter(room => room.isChecked)
  const operations :any[] = []

  // Si toutes les chambres sélectionnées sont dirty, on peut les nettoyer
  if (selectedRooms.length > 0 && selectedRooms.every(room => isDirtyRoom(room))) {
    operations.push({ value: 'set_clean_status', label: 'Mark as Clean' })
  }

  // Si toutes les chambres sélectionnées sont dirty, on peut assigner un housekeeper
  if (selectedRooms.length > 0 && selectedRooms.every(room => isDirtyRoom(room))) {
    operations.push({ value: 'assign_housekeeper', label: 'Assign Housekeeper' })
  }

  return operations
})

// Logique métier pour déterminer l'état des chambres
const isDirtyRoom = (room: Room): boolean => {
  return room.status === 'dirty' && room.housekeepingStatus === 'dirty'
}

const isCleanRoom = (room: Room): boolean => {
  return room.status === 'available' && room.housekeepingStatus === 'clean'
}

const isOccupiedRoom = (room: Room): boolean => {
  return room.status === 'occupied'
}

const canSelectRoom = (room: Room): boolean => {
  // Seules les chambres dirty peuvent être sélectionnées
  return isDirtyRoom(room)
}

// Computed property pour déterminer si on peut appliquer l'opération
const canApplyOperation = computed(() => {
  if (!selectedOperation.value || isBulkUpdating.value) return false
  if (selectedRoomsCount.value === 0) return false

  switch (selectedOperation.value) {
    case 'set_clean_status':
      return true
    case 'assign_housekeeper':
      return !!selectedHousekeeper.value
    default:
      return false
  }
})

// Computed properties pour la sélection
const hasDirtyRoomsInFiltered = computed(() => {
  return filteredRooms.value.some(room => isDirtyRoom(room))
})

const allFilteredDirtyRoomsSelected = computed(() => {
  const dirtyRooms = filteredRooms.value.filter(room => isDirtyRoom(room))
  return dirtyRooms.length > 0 && dirtyRooms.every(room => room.isChecked)
})

// Fonction appelée quand l'opération change
const onOperationChange = () => {
  selectedStatus.value = 'clean'
  selectedHousekeeper.value = ''
}

// Computed property pour filtrer les chambres avec recherche et type de chambre
const filteredRooms = computed(() => {
  let filtered = rooms.value

  // Filtrer par type de chambre
  if (selectedRoomTypeFilter.value) {
    filtered = filtered.filter(room => room.roomType === selectedRoomTypeFilter.value)
  }

  // Filtrer par recherche
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(room =>
      room.name.toLowerCase().includes(query) ||
      room.section.toLowerCase().includes(query) ||
      room.roomType.toLowerCase().includes(query) ||
      room.housekeepingStatus.toLowerCase().includes(query) ||
      room.tag.toLowerCase().includes(query)
    )
  }

  return filtered
})

const filteredGroupedRooms = computed(() => {
  const grouped: { [key: string]: Room[] } = {}
  filteredRooms.value.forEach((room) => {
    if (!grouped[room.section]) {
      grouped[room.section] = []
    }
    grouped[room.section].push(room)
  })
  return grouped
})

const selectedCount = computed(() => {
  return rooms.value.filter(room => room.isChecked).length
})

// Helper function to get room border color based on status
const getRoomBorderColor = (room: Room): string => {
  if (isDirtyRoom(room)) return 'border-l-4 border-l-orange-500'
  if (isCleanRoom(room)) return 'border-l-4 border-l-green-500'
  if (isOccupiedRoom(room)) return 'border-l-4 border-l-red-500'
  if (room.status === 'out_of_order') return 'border-l-4 border-l-gray-500'
  return 'border-l-4 border-l-gray-300'
}

// Helper function to determine status type based on room logic
const getStatusType = (room: Room): 'red' | 'green' | 'gray' | 'yellow' => {
  if (isDirtyRoom(room)) return 'yellow'
  if (isCleanRoom(room)) return 'green'
  if (isOccupiedRoom(room)) return 'red'
  return 'gray'
}

// Transform API data according to business logic
const transformRoomData = (apiRoom: any): Room => {
  let status = apiRoom.status || 'available'
  let housekeepingStatus = 'No Status'

  // Logique métier: si occupé, housekeeping = No Status
  if (status === 'occupied') {
    housekeepingStatus = 'No Status'
  }
  // Si disponible et que la chambre était occupée, elle devient dirty
  else if (status === 'dirty') {
    // Vous pourriez avoir une logique pour déterminer si la chambre est dirty
    // Par exemple, si elle vient d'être libérée
    housekeepingStatus = apiRoom.housekeepingStatus || 'dirty'
  }
  // Si disponible et propre
  else if (status === 'available') {
    housekeepingStatus = apiRoom.housekeepingStatus || 'clean'
  }
  // Si hors service
  else if (status === 'out_of_order') {
    housekeepingStatus = 'Out Of Order'
  }

  return {
    ...apiRoom,
    status,
    housekeepingStatus,
    isChecked: false,
    statusType: getStatusType({...apiRoom, status, housekeepingStatus} as Room),
    assignedHousekeeper: apiRoom.assignedHousekeeper || ''
  }
}

// Methods
const handleCheckboxChange = (roomId: string, roomName: string) => {
  const roomIndex = rooms.value.findIndex(room => room.id === roomId && room.name === roomName)
  if (roomIndex !== -1 && canSelectRoom(rooms.value[roomIndex])) {
    rooms.value[roomIndex].isChecked = !rooms.value[roomIndex].isChecked
  }
}

const toggleAllFilteredDirtyRooms = () => {
  const allSelected = allFilteredDirtyRoomsSelected.value
  filteredRooms.value.forEach(room => {
    if (isDirtyRoom(room)) {
      const roomIndex = rooms.value.findIndex(r => r.id === room.id && r.name === room.name)
      if (roomIndex !== -1) {
        rooms.value[roomIndex].isChecked = !allSelected
      }
    }
  })
}

const unselectAll = () => {
  rooms.value.forEach(room => {
    room.isChecked = false
  })
  selectedOperation.value = ''
  selectedStatus.value = 'clean'
  selectedHousekeeper.value = ''
}

const toggleSectionDirtyRooms = (section: string) => {
  const sectionDirtyRooms = filteredRooms.value.filter(room =>
    room.section === section && isDirtyRoom(room)
  )
  const allSectionDirtySelected = sectionDirtyRooms.every(room => room.isChecked)

  sectionDirtyRooms.forEach(room => {
    const roomIndex = rooms.value.findIndex(r => r.id === room.id && r.name === room.name)
    if (roomIndex !== -1) {
      rooms.value[roomIndex].isChecked = !allSectionDirtySelected
    }
  })
}

const isSectionDirtyRoomsSelected = (section: string): boolean => {
  const sectionDirtyRooms = filteredRooms.value.filter(room =>
    room.section === section && isDirtyRoom(room)
  )
  return sectionDirtyRooms.length > 0 && sectionDirtyRooms.every(room => room.isChecked)
}

const sectionHasDirtyRooms = (section: string): boolean => {
  return filteredRooms.value.some(room => room.section === section && isDirtyRoom(room))
}

// Calculate section totals
const getSectionTotals = (section: string) => {
  const sectionRooms = filteredRooms.value.filter((room) => room.section === section)
  return {
    total: sectionRooms.length,
    occupied: sectionRooms.filter((room) => room.status === 'occupied').length,
    dirty: sectionRooms.filter((room) => isDirtyRoom(room)).length,
    clean: sectionRooms.filter((room) => isCleanRoom(room)).length,
    outOfOrder: sectionRooms.filter((room) => room.status === 'out_of_order').length,
  }
}

// Get status column for room
const getStatusColumn = (room: Room): number => {
  if (room.status === 'occupied') return 3 // Occupied
  if (isDirtyRoom(room)) return 4 // Dirty
  if (isCleanRoom(room)) return 5 // Clean
  if (room.status === 'out_of_order') return 6 // Out of Order
  return -1
}

// Watch for changes and emit to parent
watch(
  () => rooms.value.map(room => room.isChecked),
  () => {
    selectedRoomsCount.value = selectedCount.value
    emit('selection-change', selectedCount.value)
  },
  { deep: true }
)

// Handle bulk action apply
const applyBulkAction = async () => {
  if (!canApplyOperation.value || selectedRoomsCount.value === 0) return

  isBulkUpdating.value = true

  try {
    const selectedRooms = rooms.value.filter(room => room.isChecked)
    const roomIds = selectedRooms.map(room => room.id)

    // Préparer les données pour l'API
    const bulkUpdateData: any = {
      room_ids: roomIds,
      operation: selectedOperation.value,
      user_id: authStore?.UserId
    }

    // Ajouter les paramètres spécifiques selon l'opération
    switch (selectedOperation.value) {
      case 'set_clean_status':
        bulkUpdateData.housekeeping_status = 'clean'
        bulkUpdateData.room_status = 'available'
        break
      case 'assign_housekeeper':
        bulkUpdateData.housekeeper_id = selectedHousekeeper.value
        break
    }

    const response = await bulkUpdateRooms(bulkUpdateData)

    if (response.data) {
      // Mettre à jour l'interface utilisateur localement
      selectedRooms.forEach(room => {
        const roomIndex = rooms.value.findIndex(r => r.id === room.id)
        if (roomIndex !== -1) {
          switch (selectedOperation.value) {
            case 'set_clean_status':
              rooms.value[roomIndex].housekeepingStatus = 'clean'
              rooms.value[roomIndex].status = 'available'
              rooms.value[roomIndex].statusType = 'green'
              break
            case 'assign_housekeeper':
              rooms.value[roomIndex].assignedHousekeeper = selectedHousekeeper.value
              break
          }
        }
      })

      console.log(`Bulk update successful: ${selectedOperation.value} applied to ${selectedRoomsCount.value} rooms`)
      toast.success(t('bulk_update'))
      unselectAll()
      // Recharger les données pour être sûr
      setTimeout(() => fetchHousekeepingStatus(), 1000)
    }

  } catch (error: any) {
    console.error('Bulk update error:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour en lot'
    toast.error(`${t('bulk_update_error')}: ${errorMessage}`)
  } finally {
    isBulkUpdating.value = false
  }
}

// Fetch housekeeping status
const fetchHousekeepingStatus = async () => {
  try {
    isLoading.value = true
    error.value = null

    const hotelId = serviceStore.serviceId;
    const response = await getHouseStatus(hotelId!);

    const apiData = response.data
    console.log("Housekeeping status fetched:", apiData);

    if (apiData.rooms && Array.isArray(apiData.rooms)) {
      // Transform rooms according to business logic
      rooms.value = apiData.rooms.map(transformRoomData)
    }

console.log("Housekeeping status fetched:", rooms.value);
    // Transform other options
    if (apiData.roomTypes && Array.isArray(apiData.roomTypes)) {
      roomTypesOptions.value = apiData.roomTypes.map((rt:any )=> ({
        value: rt.label,
        label: rt.label
      }))
    }

    if (apiData.housekeepingStatusOptions && Array.isArray(apiData.housekeepingStatusOptions)) {
      housekeepingStatusOptions.value = apiData.housekeepingStatusOptions.map((hs:any )=> ({
        value: hs.value,
        label: hs.label
      }))
    }

    if (apiData.housekeepers && Array.isArray(apiData.housekeepers)) {
      housekeeperOptions.value = apiData.housekeepers.map((hk:any )=> ({
        value: hk.value,
        label: hk.label
      }))
    }

  } catch (err) {
    console.error("Error fetching housekeeping status:", err);
    error.value = "Erreur lors du chargement des données"
  } finally {
    isLoading.value = false
  }
};

onMounted(() => {
  fetchHousekeepingStatus()
})
</script>

<style scoped>
/* Scrollbar invisible pour WebKit browsers */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Scrollbar invisible pour Firefox */
.scrollbar-hide {
  scrollbar-width: none;
}

/* Styles pour les checkboxes */
.form-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form-checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.form-checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
