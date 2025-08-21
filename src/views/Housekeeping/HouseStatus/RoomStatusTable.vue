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
                :checked="allFilteredRoomsSelected"
                @change="toggleAllFilteredRooms"
                class="form-checkbox"
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
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-gray-300 mr-1"></div>
                <span class="text-sm">No Status</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center bg-green-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-green-500 mr-1"></div>
                <span class="text-sm">Clean</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center bg-red-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-red-500 mr-1"></div>
                <span class="text-sm">Dirty</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-gray-200 text-center bg-gray-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                <span class="text-sm">Out Of Order</span>
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
                      <Select :placeholder="'Select operation'" :options="Operations" v-model="selectedOperation" @change="onOperationChange"/>
                    </div>

                    <!-- Select pour le statut si "Set Status" est sélectionné -->
                    <div v-if="selectedOperation === 'set_status'" class="w-48">
                      <Select :placeholder="'Select status'" :options="housekeepingStatusOptions" v-model="selectedStatus"/>
                    </div>

                    <!-- Select pour le housekeeper si "Assign Housekeeper" est sélectionné -->
                    <div v-if="selectedOperation === 'assign_housekeeper'" class="w-48">
                      <Select :placeholder="'Select housekeeper'" :options="housekeeperOptions" v-model="selectedHousekeeper"/>
                    </div>

                    <button
                      class="bg-purple-500 hover:bg-purple-600 text-white rounded px-4 py-2 text-sm transition-colors"
                      @click="applyBulkAction"
                      :disabled="!canApplyOperation"
                      :class="{ 'opacity-50 cursor-not-allowed': !canApplyOperation }"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <button
                  @click="unselectAll"
                  class="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Unselect All
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody v-if="!isLoading">
          <template v-for="section in Object.keys(filteredGroupedRooms)" :key="section">
            <!-- En-tête de section avec checkbox pour sélectionner toute la section -->
            <tr class="bg-gray-100">
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                <input
                  type="checkbox"
                  :checked="isSectionSelected(section)"
                  @change="toggleSection(section)"
                  class="form-checkbox"
                />
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 font-medium text-center">
                {{ section }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).total }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).noStatus }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).clean }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).dirty }}
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
                  room.statusType === 'red' ? 'border-l-4 border-l-red-500' :
                  room.statusType === 'green' ? 'border-l-4 border-l-green-500' :
                  'border-l-4 border-l-gray-500'
                ]"
              >
                <input
                  type="checkbox"
                  :checked="room.isChecked"
                  @change="handleCheckboxChange(room.id, room.name)"
                  class="form-checkbox"
                />
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                <div class="flex items-center justify-center">
                  <span>{{ room.name }}</span>
                  <BedIcon  :size="16" class="ml-2" />
                </div>
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ room.beds }}
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 3 ? 'bg-gray-50' : ''
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 3"
                  :room="room.name"
                  :status="room.status"
                  :tag="room.tag"
                  :type="room.statusType"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 4 ? 'bg-green-50' : ''
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 4"
                  :room="room.name"
                  :status="room.status"
                  :tag="room.tag"
                  type="green"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 5 ? 'bg-red-50' : ''
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 5"
                  :room="room.name"
                  :status="room.status"
                  :tag="room.tag"
                  type="red"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-gray-200 text-center',
                  getStatusColumn(room) === 6 ? 'bg-gray-100' : ''
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 6"
                  :room="room.name"
                  status="Out of Order"
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
              Total ({{ selectedCount }} selected)
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.length }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter(r => r.housekeepingStatus === 'No Status').length }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter(r => r.housekeepingStatus === 'Clean').length }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter(r => r.housekeepingStatus === 'Dirty').length }}
            </td>
            <td class="py-2 px-3 border-b border-gray-200 text-center">
              {{ filteredRooms.filter(r => r.housekeepingStatus === 'Out Of Order').length }}
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
              Aucune chambre trouvée
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

// Define room data type
interface Room {
  id: string
  name: string
  beds: number
  isChecked: boolean
  section: string
  roomType: string
  status: string
  housekeepingStatus: 'Clean' | 'Dirty' | 'Out Of Order' | 'No Status'
  tag: string
  statusType: 'red' | 'green' | 'gray' | 'yellow'
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
  'bulk-update-success': []
  'bulk-update-error': [error: string]
}>()

// Reactive variables
const selectedRoomType = ref<string>('')
const selectedRoomTypeFilter = ref<string>('')
const selectedRoomsCount = ref<number>(0)
const selectedOperation = ref<string>('')
const selectedStatus = ref<string>('')
const selectedHousekeeper = ref<string>('')
const serviceStore = useServiceStore()
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)
const isBulkUpdating = ref<boolean>(false)
const authStore = useAuthStore()

// Initialize empty arrays for API data
const rooms = ref<Room[]>([])
const roomTypesOptions = ref<Array<{value: number, label: string}>>([])
const housekeepingStatusOptions = ref<Array<{value: string, label: string}>>([])
const housekeeperOptions = ref<Array<{value: string, label: string}>>([])

const Operations = ref([
  { value: 'set_status', label: 'Set Status' },
  { value: 'assign_housekeeper', label: 'Assign Housekeeper' },
  { value: 'clear_status', label: 'Clear Status' },
  // { value: 'unassign_housekeeper', label: 'Unassign Housekeeper' }
])

// Computed property pour déterminer si on peut appliquer l'opération
const canApplyOperation = computed(() => {
  if (!selectedOperation.value || isBulkUpdating.value) return false

  switch (selectedOperation.value) {
    case 'set_status':
      return !!selectedStatus.value
    case 'assign_housekeeper':
      return !!selectedHousekeeper.value
    case 'clear_status':
    case 'unassign_housekeeper':
      return true
    default:
      return false
  }
})

// Fonction appelée quand l'opération change
const onOperationChange = () => {
  selectedStatus.value = ''
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

const allFilteredRoomsSelected = computed(() => {
  const filtered = filteredRooms.value
  return filtered.length > 0 && filtered.every(room => room.isChecked)
})

// Helper function to determine status type based on housekeeping status
const getStatusType = (housekeepingStatus: string): 'red' | 'green' | 'gray' | 'yellow' => {
  if (!housekeepingStatus) return 'gray'

  const status = housekeepingStatus.toLowerCase()
  switch (status) {
    case 'clean':
      return 'green'
    case 'dirty':
      return 'red'
    case 'out of order':
    case 'outoforder':
      return 'gray'
    default:
      return 'gray'
  }
}

// Helper function to transform API options to select format
const transformSelectOptions = (apiOptions: any[], valueKey: string = 'value', labelKey: string = 'label') => {
  return apiOptions.map(option => ({
    value: option[valueKey] || option.id?.toString() || option.value,
    label: option[labelKey] || option.name || option.label
  }))
}

// Methods
const handleCheckboxChange = (roomId: string, roomName: string) => {
  const roomIndex = rooms.value.findIndex(room => room.id === roomId && room.name === roomName)
  if (roomIndex !== -1) {
    rooms.value[roomIndex].isChecked = !rooms.value[roomIndex].isChecked
  }
}

const toggleAllFilteredRooms = () => {
  const allSelected = allFilteredRoomsSelected.value
  filteredRooms.value.forEach(room => {
    const roomIndex = rooms.value.findIndex(r => r.id === room.id && r.name === room.name)
    if (roomIndex !== -1) {
      rooms.value[roomIndex].isChecked = !allSelected
    }
  })
}

const selectAllRoomType = (roomType: string) => {
  rooms.value.forEach(room => {
    if (room.roomType === roomType) {
      room.isChecked = true
    }
  })
}

const unselectAll = () => {
  rooms.value.forEach(room => {
    room.isChecked = false
  })
  selectedOperation.value = ''
  selectedStatus.value = ''
  selectedHousekeeper.value = ''
}

const toggleSection = (section: string) => {
  const sectionRooms = filteredRooms.value.filter(room => room.section === section)
  const allSectionSelected = sectionRooms.every(room => room.isChecked)

  sectionRooms.forEach(room => {
    const roomIndex = rooms.value.findIndex(r => r.id === room.id && r.name === room.name)
    if (roomIndex !== -1) {
      rooms.value[roomIndex].isChecked = !allSectionSelected
    }
  })
}

const isSectionSelected = (section: string): boolean => {
  const sectionRooms = filteredRooms.value.filter(room => room.section === section)
  return sectionRooms.length > 0 && sectionRooms.every(room => room.isChecked)
}

// Calculate section totals (mise à jour pour les chambres filtrées)
const getSectionTotals = (section: string) => {
  const sectionRooms = filteredRooms.value.filter((room) => room.section === section)
  return {
    total: sectionRooms.length,
    clean: sectionRooms.filter((room) => room.housekeepingStatus === 'Clean').length,
    dirty: sectionRooms.filter((room) => room.housekeepingStatus === 'Dirty').length,
    outOfOrder: sectionRooms.filter((room) => room.housekeepingStatus === 'Out Of Order').length,
    noStatus: sectionRooms.filter((room) => room.housekeepingStatus === 'No Status').length,
  }
}

// Get status column for room
const getStatusColumn = (room: Room): number => {
  return room.housekeepingStatus === 'Clean' ? 4 :
         room.housekeepingStatus === 'Dirty' ? 5 :
         room.housekeepingStatus === 'Out Of Order' ? 6 : 3
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
      case 'set_status':
        bulkUpdateData.housekeeping_status = selectedStatus.value
        break
      case 'assign_housekeeper':
        bulkUpdateData.housekeeper_id = selectedHousekeeper.value
        break
    }

    //  bulk update
    const response = await bulkUpdateRooms(bulkUpdateData)

    if (response.data) {
      // Mettre à jour l'interface utilisateur localement
      selectedRooms.forEach(room => {
        const roomIndex = rooms.value.findIndex(r => r.id === room.id)
        if (roomIndex !== -1) {
          switch (selectedOperation.value) {
            case 'set_status':
              rooms.value[roomIndex].housekeepingStatus = selectedStatus.value as Room['housekeepingStatus']
              rooms.value[roomIndex].statusType = getStatusType(selectedStatus.value)
              break
            case 'assign_housekeeper':
              rooms.value[roomIndex].tag = selectedHousekeeper.value
              break
            case 'clear_status':
              rooms.value[roomIndex].housekeepingStatus = 'No Status'
              rooms.value[roomIndex].statusType = 'gray'
              break
            case 'unassign_housekeeper':
              rooms.value[roomIndex].tag = ''
              break
          }
        }
      })

      console.log(`Bulk update successful: ${selectedOperation.value} applied to ${selectedRoomsCount.value} rooms`)
      emit('bulk-update-success')
      unselectAll()
      fetchHousekeepingStatus()
    }

  } catch (error: any) {
    console.error('Bulk update error:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour en lot'
    emit('bulk-update-error', errorMessage)
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

    console.log("fetchHousekeepingStatus", response.data)

    const apiData = response.data


    if (apiData.rooms && Array.isArray(apiData.rooms)) {
      // Ajouter seulement les propriétés manquantes (isChecked et statusType)
      rooms.value = apiData.rooms.map((room: any) => ({
        ...room,
        isChecked: false,
        statusType: getStatusType(room.housekeepingStatus)
      }))
    }

    // Transform room types options
    if (apiData.roomTypes && Array.isArray(apiData.roomTypes)) {
      roomTypesOptions.value = transformSelectOptions(apiData.roomTypes, 'label', 'label')
    }

    // Transform housekeeping status options
    if (apiData.housekeepingStatusOptions && Array.isArray(apiData.housekeepingStatusOptions)) {
      housekeepingStatusOptions.value = transformSelectOptions(apiData.housekeepingStatusOptions, 'value', 'label')
    }

    // Transform housekeepers options
    if (apiData.housekeepers && Array.isArray(apiData.housekeepers)) {
      housekeeperOptions.value = transformSelectOptions(apiData.housekeepers, 'id', 'name')
    }

    console.log('Transformed data:', {
      rooms: rooms.value,
      roomTypes: roomTypesOptions.value,
      housekeepingStatus: housekeepingStatusOptions.value,
      housekeepers: housekeeperOptions.value
    })

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
</style>
