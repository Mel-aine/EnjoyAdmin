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
              <Select :options="RoomTypes" :placeholder="$t('RoomTypes')"/>
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
                      <Select :placeholder="'Select status'" :options="StatusOptions" v-model="selectedStatus"/>
                    </div>

                    <!-- Select pour le housekeeper si "Assign Housekeeper" est sélectionné -->
                    <div v-if="selectedOperation === 'assign_housekeeper'" class="w-48">
                      <Select :placeholder="'Select housekeeper'" :options="HousekeeperOptions" v-model="selectedHousekeeper"/>
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

        <tbody>
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
                  <BedIcon v-if="room.beds > 0" :size="16" class="ml-2" />
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
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Bed as BedIcon } from 'lucide-vue-next'
import StatusBadge from './StatusBadge.vue'
import { PersonStanding } from 'lucide-vue-next';
import Select from '@/components/forms/FormElements/Select.vue';

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

// Define emits
const emit = defineEmits<{
  'selection-change': [count: number]
}>()

// Reactive variables
const selectedRoomType = ref<string>('')
const selectedRoomTypeFilter = ref<string>('')
const selectedRoomsCount = ref<number>(0)
const selectedOperation = ref<string>('')
const selectedStatus = ref<string>('')
const selectedHousekeeper = ref<string>('')

const RoomTypes = ref([
  { value: 'suite', label: 'Suite' },
  { value: 'classic', label: 'Classic' }
])

const Operations = ref([
  { value: 'set_status', label: 'Set Status' },
  { value: 'assign_housekeeper', label: 'Assign Housekeeper' },
  { value: 'clear_status', label: 'Clear Status' },
  { value: 'unassign_housekeeper', label: 'Unassign Housekeeper' }
])

const StatusOptions = ref([
  { value: 'Clean', label: 'Clean' },
  { value: 'Dirty', label: 'Dirty' },
  { value: 'Out Of Order', label: 'Out Of Order' },
  { value: 'No Status', label: 'No Status' }
])

const HousekeeperOptions = ref([
  { value: 'hk1', label: 'Marie Dubois' },
  { value: 'hk2', label: 'Jean Martin' },
  { value: 'hk3', label: 'Sophie Laurent' },
  { value: 'hk4', label: 'Pierre Moreau' }
])

// Initialize rooms data (j'ai corrigé les doublons dans les données)
const rooms = ref<Room[]>([
  {
    id: '1',
    name: 'S 601',
    beds: 1,
    isChecked: false,
    section: 'S Room',
    roomType: 'suite',
    status: 'Arrival',
    housekeepingStatus: 'Dirty',
    tag: 'MO',
    statusType: 'red',
  },
  {
    id: '2',
    name: 'S 602',
    beds: 1,
    isChecked: false,
    section: 'S Room',
    roomType: 'suite',
    status: 'Stayover',
    housekeepingStatus: 'Dirty',
    tag: 'MO',
    statusType: 'red',
  },
  {
    id: '3',
    name: 'S 603',
    beds: 1,
    isChecked: false,
    section: 'S Room',
    roomType: 'suite',
    status: 'Available',
    housekeepingStatus: 'Clean',
    tag: '',
    statusType: 'green',
  },
  {
    id: '4',
    name: 'S 604',
    beds: 0,
    isChecked: false,
    section: 'S Room',
    roomType: 'suite',
    status: '',
    housekeepingStatus: 'Out Of Order',
    tag: 'JI',
    statusType: 'gray',
  },
  {
    id: '5',
    name: '501',
    beds: 0,
    isChecked: false,
    section: 'Classic',
    roomType: 'Classic',
    status: 'Occupied',
    housekeepingStatus: 'Dirty',
    tag: 'JI',
    statusType: 'red',
  },
  {
    id: '6',
    name: '502',
    beds: 0,
    isChecked: false,
    section: 'Classic',
    roomType: 'Classic',
    status: 'Stayover',
    housekeepingStatus: 'Dirty',
    tag: 'JI',
    statusType: 'red',
  },
  {
    id: '7',
    name: '503',
    beds: 1,
    isChecked: false,
    section: 'Classic',
    roomType: 'Classic',
    status: 'Stayover',
    housekeepingStatus: 'Dirty',
    tag: 'MO',
    statusType: 'red',
  },
  {
    id: '8',
    name: '504',
    beds: 1,
    isChecked: false,
    section: 'Classic',
    roomType: 'Classic',
    status: 'Stayover',
    housekeepingStatus: 'Dirty',
    tag: 'JI',
    statusType: 'red',
  },
  {
    id: '9',
    name: '505',
    beds: 1,
    isChecked: false,
    section: 'Classic',
    roomType: 'Classic',
    status: 'Available',
    housekeepingStatus: 'Clean',
    tag: '',
    statusType: 'green',
  },
  {
    id: '10',
    name: '506',
    beds: 2,
    isChecked: false,
    section: 'Classic',
    roomType: 'Classic',
    status: 'Available',
    housekeepingStatus: 'Clean',
    tag: '',
    statusType: 'green',
  }
])

// Computed property pour déterminer si on peut appliquer l'opération
const canApplyOperation = computed(() => {
  if (!selectedOperation.value) return false

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
  // Reset les autres sélections quand on change d'opération
  selectedStatus.value = ''
  selectedHousekeeper.value = ''
}
const filteredRooms = computed(() => {
  if (!selectedRoomTypeFilter.value) {
    return rooms.value
  }
  return rooms.value.filter(room => room.roomType === selectedRoomTypeFilter.value)
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
const applyBulkAction = () => {
  if (!canApplyOperation.value || selectedRoomsCount.value === 0) return

  const selectedRooms = rooms.value.filter(room => room.isChecked)

  switch (selectedOperation.value) {
    case 'set_status':
      selectedRooms.forEach(room => {
        room.housekeepingStatus = selectedStatus.value as Room['housekeepingStatus']
        // Mettre à jour le statusType selon le statut
        switch (selectedStatus.value) {
          case 'Clean':
            room.statusType = 'green'
            break
          case 'Dirty':
            room.statusType = 'red'
            break
          case 'Out Of Order':
            room.statusType = 'gray'
            break
          default:
            room.statusType = 'gray'
        }
      })
      console.log(`Status "${selectedStatus.value}" applied to ${selectedRoomsCount.value} rooms`)
      break

    case 'assign_housekeeper':
      // Ici vous pouvez ajouter une propriété housekeeper à vos rooms si nécessaire
      selectedRooms.forEach(room => {
        // room.housekeeper = selectedHousekeeper.value
        room.tag = selectedHousekeeper.value // Utiliser le tag pour simuler l'assignation
      })
      console.log(`Housekeeper "${selectedHousekeeper.value}" assigned to ${selectedRoomsCount.value} rooms`)
      break

    case 'clear_status':
      selectedRooms.forEach(room => {
        room.housekeepingStatus = 'No Status'
        room.statusType = 'gray'
      })
      console.log(`Status cleared for ${selectedRoomsCount.value} rooms`)
      break

    case 'unassign_housekeeper':
      selectedRooms.forEach(room => {
        // room.housekeeper = ''
        room.tag = '' // Vider le tag pour simuler la désassignation
      })
      console.log(`Housekeeper unassigned from ${selectedRoomsCount.value} rooms`)
      break
  }

  // Reset after applying
  unselectAll()
}
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
