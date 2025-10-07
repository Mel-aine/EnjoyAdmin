<template>
  <div class="w-full">
    <!-- Tableau avec scrollbar invisible -->
    <div class="w-full overflow-auto border border-gray-200 rounded max-h-[600px] scrollbar-hide">
      <table class="w-full text-sm">
        <thead class="sticky top-0 bg-white z-12">
          <!-- En-tête normal quand aucune sélection -->
          <tr class="bg-gray-100 border-l-4 border-l-gray-200" v-if="!selectedRoomsCount">
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center w-10">
              <input
                type="checkbox"
                :checked="allFilteredSelectableRoomsSelected"
                @change="toggleAllFilteredSelectableRooms"
                class="form-checkbox"
                :disabled="!hasSelectableRoomsInFiltered"
              />
            </th>

            <th class="py-2 px-3 border-b border-r border-gray-200 text-center w-50">
              <Select
                :options="roomTypesOptionsWithAll"
                :placeholder="$t('RoomTypes')"
                v-model="selectedRoomTypeFilter"
              />
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center">
              <div class="flex items-center justify-center">
                <PersonStanding />
              </div>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center bg-gray-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-gray-300 mr-1"></div>
                <span class="text-sm">{{ $t('noStatus') }}</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-100 text-center bg-orange-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-orange-700 mr-1"></div>
                <span class="text-sm">{{ $t('dirty') }}</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-r border-gray-200 text-center bg-green-50">
              <div class="flex items-center justify-center">
                <div class="w-4 h-4 bg-green-500 mr-1"></div>
                <span class="text-sm">{{ $t('Clean') }}</span>
              </div>
            </th>
            <th class="py-2 px-3 border-b border-gray-200 text-center bg-gray-100">
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
                  <span class="text-sm font-medium"
                    >{{ selectedRoomsCount }} {{ $t('RecordsSelected') }}</span
                  >

                  <div class="flex items-center space-x-2 text-gray-750 font-normal">
                    <div class="w-48">
                      <Select
                        :placeholder="$t('Selectoperation')"
                        :options="availableOperations"
                        v-model="selectedOperation"
                        @change="onOperationChange"
                      />
                    </div>

                    <!-- Select pour le statut si "Set Status" est sélectionné -->
                    <div v-if="selectedOperation === 'set_status'" class="w-48">
                      <Select
                        :placeholder="$t('select_status')"
                        :options="[
                          { value: 'clean', label: t('Clean') },
                          { value: 'dirty', label: t('dirty') },
                        ]"
                        v-model="selectedStatus"
                      />
                    </div>

                    <!-- Select pour le housekeeper si "Assign Housekeeper" est sélectionné -->
                    <div
                      v-if="selectedOperation === 'assign_housekeeper'"
                      class="w-48 text-gray-750"
                    >
                      <Select
                        :placeholder="$t('select_housekeeper')"
                        :options="housekeeperOptions"
                        v-model="selectedHousekeeper"
                      />
                    </div>

                    <button
                      class="bg-purple-500 hover:bg-purple-600 text-white rounded px-4 py-2 text-sm transition-colors"
                      @click="confirmBulkAction"
                      :disabled="!canApplyOperation || isBulkUpdating"
                      :class="{
                        'opacity-50 cursor-not-allowed': !canApplyOperation || isBulkUpdating,
                      }"
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
            <tr class="bg-gray-100 border-l-4 border-l-gray-200">
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                <input
                  type="checkbox"
                  :checked="isSectionSelectableRoomsSelected(section)"
                  @change="toggleSectionSelectableRooms(section)"
                  class="form-checkbox"
                  :disabled="!sectionHasSelectableRooms(section)"
                />
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 font-medium text-center">
                {{ section }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).totalOccupants }}
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ getSectionTotals(section).noStatus }}
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
                  getRoomBorderColor(room),
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
                <div class="flex items-center justify-between w-full">
                  <!-- Partie gauche : nom + bed icon + housekeeper -->
                  <div class="flex items-center">
                    <span>{{ room.name }}</span>
                    <BedIcon :size="16" class="ml-2" />

                    <!-- Indicateur housekeeper assigné -->
                    <span
                      v-if="room.assignedHousekeeper"
                      class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {{ room.assignedHousekeeper }}
                    </span>
                  </div>

                  <!-- Partie droite : work order + cleaning -->
                  <div class="flex items-center space-x-2">
                    <!-- Indicateur de work order -->
                    <!-- Partie droite : work order + cleaning -->
                    <div class="flex items-center space-x-2">
                      <!-- Indicateur de work order actif -->
                      <ClipboardCheck
                        v-if="hasActiveWorkOrder(room)"
                        :size="16"
                        class="text-gray-600"
                        title="Work Order actif"
                      />
                    </div>
                    <!-- Indicateur de nettoyage -->
                    <i v-if="room.assignedHousekeeper" class="fa-solid fa-broom"></i>
                  </div>
                </div>
              </td>
              <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
                {{ room.occupants || 0 }}
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 3 ? 'bg-gray-50' : '',
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 3"
                  :room="room.name"
                  :room-id="room.id"
                  :status="$t(`roomStatus.${room.status}`)"
                  :tag="room.tag"
                  :HousekeeperOptions="housekeeperOptions"
                  :existingRemarkData="room.housekeepersRemarks"
                  :room-data="{
                    id: room.id,
                    roomNumber: room.name,
                    assignedHousekeeper : room.assignedHousekeeperId,
                    roomType: {
                      id: getRoomTypeId(room.roomType),
                      roomTypeName: room.roomType,
                    },
                  }"
                  @remark-updated="fetchHousekeepingStatus"
                  type="red"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 4 ? 'bg-orange-50' : '',
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 4"
                  :room="room.name"
                  :room-id="room.id"
                  :status="$t(`roomStatus.${room.status}`)"
                  :HousekeeperOptions="housekeeperOptions"
                  :existingRemarkData="room.housekeepersRemarks"
                  :room-data="{
                    id: room.id,
                    roomNumber: room.name,
                    assignedHousekeeper : room.assignedHousekeeperId,
                    roomType: {
                      id: getRoomTypeId(room.roomType),
                      roomTypeName: room.roomType,
                    },
                  }"
                  :tag="room.tag"
                  @remark-updated="fetchHousekeepingStatus"
                  type="orange"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 5 ? 'bg-green-50' : '',
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 5"
                  :room="room.name"
                  :room-id="room.id"
                  :status="$t(`roomStatus.${room.status}`)"
                  :tag="room.tag"
                  :HousekeeperOptions="housekeeperOptions"
                  :existingRemarkData="room.housekeepersRemarks"
                  :room-data="{
                    id: room.id,
                    roomNumber: room.name,
                    assignedHousekeeper : room.assignedHousekeeperId,
                    roomType: {
                      id: getRoomTypeId(room.roomType),
                      roomTypeName: room.roomType,
                    },
                  }"
                  @remark-updated="fetchHousekeepingStatus"
                  type="green"
                />
              </td>
              <td
                :class="[
                  'py-2 px-3 border-b border-r border-gray-200 text-center',
                  getStatusColumn(room) === 6 ? 'bg-gray-100' : '',
                ]"
              >
                <StatusBadge
                  v-if="getStatusColumn(room) === 6"
                  :room="room.name"
                  :room-id="room.id"
                  :status="$t(`roomStatus.${room.status}`)"
                  :tag="room.tag"
                  :HousekeeperOptions="housekeeperOptions"
                  :existingRemarkData="room.housekeepersRemarks"
                  :room-data="{
                    id: room.id,
                    roomNumber: room.name,
                    assignedHousekeeper : room.assignedHousekeeperId,
                    roomType: {
                      id: getRoomTypeId(room.roomType),
                      roomTypeName: room.roomType,
                    },
                  }"
                  @remark-updated="fetchHousekeepingStatus"
                  type="gray"
                />
              </td>
            </tr>
          </template>

          <!-- Ligne de total -->
          <tr class="bg-orange-50 sticky bottom-0 z-10 border-l-4 border-l-orange-50">
            <td class="py-2 px-3 border-b border-r border-gray-200"></td>
            <td class="py-2 px-3 border-b border-r border-gray-200 font-medium text-center">
              {{ $t('total') }} ({{ selectedCount }} {{ $t('selected') }})
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ totalOccupants }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter((r) => r.housekeepingStatus === 'No Status').length }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter((r) => r.housekeepingStatus === 'dirty').length }}
            </td>
            <td class="py-2 px-3 border-b border-r border-gray-200 text-center">
              {{ filteredRooms.filter((r) => r.housekeepingStatus === 'clean').length }}
            </td>
            <td class="py-2 px-3 border-b border-gray-200 text-center">
              {{ filteredRooms.filter((r) => r.status === 'out_of_order').length }}
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
    <PopupModal
    v-if="showConfirmDialog"
      :title="operationConfig[selectedOperation]?.title || t('Confirm Action')"
      :message="operationConfig[selectedOperation]?.message || t('Are you sure?')"
      @close="showConfirmDialog = false"

    >
      <template #footer>
         <div class="flex justify-end space-x-4">
              <BasicButton
                :label="$t('Cancel')"
                variant="light"
                @click="onCancel"
                type="button"

              />
               <BasicButton
                :label="$t('Confirm')"
                variant="secondary"
                 @click="onConfirm"
                 type="button"
              />
            </div>

      </template>
  </PopupModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, toRefs } from 'vue'
import { Bed as BedIcon } from 'lucide-vue-next'
import { Accessibility } from 'lucide-vue-next'
import StatusBadge from './StatusBadge.vue'
import { PersonStanding } from 'lucide-vue-next'
import Select from '@/components/forms/FormElements/Select.vue'
import { getHouseStatus, bulkUpdateRooms } from '@/services/configrationApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { ClipboardCheck } from 'lucide-vue-next'
import PopupModal from '@/components/modal/PopupModal.vue'

// Define room data type
interface Room {
  id: string
  name: string
  occupants: number
  isChecked: boolean
  section: string
  roomType: string
  status: 'available' | 'noStatus' | 'out_of_order' | 'maintenance' | 'dirty' | 'occupied'
  housekeepingStatus: string
  tag: string
  statusType: 'red' | 'green' | 'gray' | 'yellow'
  assignedHousekeeper?: string
  assignedHousekeeperId?:any
  housekeepersRemarks?: any
  workOrders?: Array<{ status: string }>
}

// Props pour recevoir la recherche du parent
interface Props {
  searchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
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
const roomTypesOptions = ref<Array<{ value: number; label: string; roomTypeId: number }>>([])
const housekeepingStatusOptions = ref<Array<{ value: string; label: string }>>([])
const housekeeperOptions = ref<Array<{ value: string; label: string }>>([])

// Operations disponibles selon le contexte

const roomTypesOptionsWithAll = computed(() => [
  { value: 'all', label: t('All') },
  ...roomTypesOptions.value,
])

const availableOperations = computed(() => {
  const operations: any[] = [
    { value: 'set_status', label: t('Set Status') },
    { value: 'assign_housekeeper', label: t('Assign Housekeeper') },
    { value: 'clear_status', label: t('Clear Status') },
    { value: 'clear_remark', label: t('Clear Remark') },
    { value: 'unassign_housekeeper', label: t('Unassign Housekeeper') },
  ]

  return operations
})
// Logique métier pour déterminer l'état des chambres
const isDirtyRoom = (room: Room): boolean => {
  return (room.status === 'available' || room.status === 'occupied') && room.housekeepingStatus === 'dirty'
}

const isCleanRoom = (room: Room): boolean => {
  return (room.status === 'available' || room.status === 'occupied')  && room.housekeepingStatus === 'clean'
}

const isnoStatusRoom = (room: Room): boolean => {
  return (room.status === 'available' || room.status === 'occupied' ) && room.housekeepingStatus === null
}

const canSelectRoom = (room: Room): boolean => {
  if (room.status === 'out_of_order') return false

  return true
}

const getRoomTypeId = (roomTypeName: string): number => {
  const roomType = roomTypesOptions.value.find((rt) => rt.label === roomTypeName)
  return roomType ? roomType.roomTypeId : 0
}
// Computed property pour déterminer si on peut appliquer l'opération
const canApplyOperation = computed(() => {
  if (!selectedOperation.value || isBulkUpdating.value) return false
  if (selectedRoomsCount.value === 0) return false

  switch (selectedOperation.value) {
    case 'set_status':
      return !!selectedStatus.value
    case 'assign_housekeeper':
      return !!selectedHousekeeper.value
    case 'clear_status':
    case 'clear_remark':
    case 'unassign_housekeeper':
      return true
    default:
      return false
  }
})

// Computed properties pour la sélection

const hasSelectableRoomsInFiltered = computed(() => {
  return filteredRooms.value.some((room) => room.status !== 'out_of_order')

})

const allFilteredSelectableRoomsSelected = computed(() => {
  const selectableRooms = filteredRooms.value.filter(
    (room) => isDirtyRoom(room) || isCleanRoom(room),
  )
  return selectableRooms.length > 0 && selectableRooms.every((room) => room.isChecked)
})

// Fonction appelée quand l'opération change
const onOperationChange = () => {
  selectedStatus.value = ''
  selectedHousekeeper.value = ''
}

// Computed property pour filtrer les chambres avec recherche et type de chambre
const filteredRooms = computed(() => {
  let filtered = rooms.value

  // Filtrer par type de chambre, sauf si "all" est sélectionné
  if (selectedRoomTypeFilter.value && selectedRoomTypeFilter.value !== 'all') {
    filtered = filtered.filter((room) => room.roomType === selectedRoomTypeFilter.value)
  }

  // Filtrer par recherche
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (room) =>
        room.name.toLowerCase().includes(query) ||
        room.section.toLowerCase().includes(query) ||
        room.roomType.toLowerCase().includes(query) ||
        room.housekeepingStatus.toLowerCase().includes(query) ||
        room.tag.toLowerCase().includes(query),
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
  return rooms.value.filter((room) => room.isChecked).length
})

// Total occupants de toutes les chambres filtrées
const totalOccupants = computed(() => {
  return filteredRooms.value.reduce((sum, room) => sum + (room.occupants || 0), 0)
})

// Helper function to get room border color based on status
const getRoomBorderColor = (room: Room): string => {
  if (isDirtyRoom(room)) return 'border-l-4 border-l-orange-500'
  if (isCleanRoom(room)) return 'border-l-4 border-l-green-500'
  if (isnoStatusRoom(room)) return 'border-l-4 border-l-gray-100'
  if (room.status === 'out_of_order') return 'border-l-4 border-l-gray-500'
  return 'border-l-4 border-l-gray-300'
}

// Helper function to determine status type based on room logic
const getStatusType = (room: Room): 'white' | 'green' | 'gray' | 'orange' => {
  if (isDirtyRoom(room)) return 'orange'
  if (isCleanRoom(room)) return 'green'
  if (isnoStatusRoom(room)) return 'white'
  return 'gray'
}

// Transform API data according to business logic
const transformRoomData = (apiRoom: any): Room => {
  let status = apiRoom.status || 'available'
  let housekeepingStatus = apiRoom.housekeepingStatus || ''

  // Vérifie si la chambre a un bloc actif
  const hasActiveBlock =
    apiRoom.blocks && apiRoom.blocks.some((block: any) => block.status !== 'completed')

  if (hasActiveBlock) {
    status = 'out_of_order'
    housekeepingStatus = 'Out Of Order'
  }
  //  chambre occupée
  else if (status === 'occupied') {
    // On garde le statut ménage si défini, sinon "Dirty" par défaut
    housekeepingStatus = housekeepingStatus || 'dirty'
  }
  // chambre disponible
  else if (status === 'available') {
    // Si ménage défini, on garde, sinon "Dirty" (car une dispo est souvent sale après check-out)
    housekeepingStatus = housekeepingStatus || 'dirty'
  }
  // chambre marquée explicitement dirty
  else if (status === 'dirty') {
    housekeepingStatus = housekeepingStatus || 'dirty'
  }
  //  hors service / maintenance
  else if (status === 'out_of_order' || status === 'maintenance') {
    housekeepingStatus = 'Out Of Order'
  }
  // Cas par défaut
  else {
    housekeepingStatus = housekeepingStatus || ''
  }

  return {
    ...apiRoom,
    status,
    housekeepingStatus,
    isChecked: false,
    statusType: getStatusType({ ...apiRoom, status, housekeepingStatus } as Room),
    assignedHousekeeper: apiRoom.assignedHousekeeper || '',
  }
}


// Methods

const handleCheckboxChange = (roomId: string, roomName: string) => {
  const roomIndex = rooms.value.findIndex((room) => room.id === roomId && room.name === roomName)
  if (roomIndex === -1) return

  const room = rooms.value[roomIndex]

  if (!canSelectRoom(room)) return

  // Toggle la sélection
  rooms.value[roomIndex].isChecked = !rooms.value[roomIndex].isChecked
}

const toggleAllFilteredSelectableRooms = () => {
  const selectableRooms = filteredRooms.value.filter((r) => r.status !== 'out_of_order')
  const allSelected = selectableRooms.every((r) => r.isChecked)

  filteredRooms.value.forEach((room) => {
    if (room.status !== 'out_of_order') {
      const roomIndex = rooms.value.findIndex((r) => r.id === room.id && r.name === room.name)
      if (roomIndex !== -1) {
        rooms.value[roomIndex].isChecked = !allSelected
      }
    }
  })
}


const unselectAll = () => {
  rooms.value.forEach((room) => {
    room.isChecked = false
  })
  selectedOperation.value = ''
  selectedStatus.value = ''
  selectedHousekeeper.value = ''
}

const toggleSectionSelectableRooms = (section: string) => {
  const sectionSelectableRooms = filteredRooms.value.filter(
    (room) => room.section === section && room.status !== 'out_of_order',
  )

  const allSectionSelected = sectionSelectableRooms.every((room) => room.isChecked)

  sectionSelectableRooms.forEach((room) => {
    const roomIndex = rooms.value.findIndex((r) => r.id === room.id && r.name === room.name)
    if (roomIndex !== -1) {
      rooms.value[roomIndex].isChecked = !allSectionSelected
    }
  })
}

const isSectionSelectableRoomsSelected = (section: string): boolean => {
  const sectionSelectableRooms = filteredRooms.value.filter(
    (room) => room.section === section && room.status !== 'out_of_order',
  )

  return sectionSelectableRooms.length > 0 && sectionSelectableRooms.every((room) => room.isChecked)
}

const sectionHasSelectableRooms = (section: string): boolean => {
  return filteredRooms.value.some(
    (room) => room.section === section && room.status !== 'out_of_order',
  )
}


// Calculate section totals
const getSectionTotals = (section: string) => {
  const sectionRooms = filteredRooms.value.filter((room) => room.section === section)


  return {
    total: sectionRooms.length,
    totalOccupants: sectionRooms.reduce((sum, room) => sum + (room.occupants || 0), 0),
    noStatus: sectionRooms.filter(
    (room) => !room.housekeepingStatus || room.housekeepingStatus === 'No Status').length,
    dirty: sectionRooms.filter((room) => room.housekeepingStatus === 'dirty').length,
    clean: sectionRooms.filter((room) => room.housekeepingStatus === 'clean').length,
    outOfOrder: sectionRooms.filter((room) => room.status === 'out_of_order').length,
  }
}

// Get status column for room
// const getStatusColumn = (room: Room): number => {
//   if (room.status === 'noStatus') return 3 // no status
//   if (isDirtyRoom(room)) return 4 // Dirty
//   if (isCleanRoom(room)) return 5 // Clean
//   if (room.status === 'out_of_order') return 6 // Out of Order
//   return -1
// }
// Get status column for room
const getStatusColumn = (room: Room): number => {
  // Out of Order a la priorité
  if (room.status === 'out_of_order') return 6 // Out of Order

  // Si housekeeping status est "No Status"
  if (room.housekeepingStatus === 'No Status' || room.housekeepingStatus === 'noStatus' || room.housekeepingStatus === null ) return 3 // no status

  // Combinaison: occupied + dirty OU available + dirty
  if ((room.status === 'occupied' || room.status === 'available') && room.housekeepingStatus === 'dirty') {
    return 4 // Dirty
  }

  // Combinaison: occupied + clean OU available + clean
  if ((room.status === 'occupied' || room.status === 'available') && room.housekeepingStatus === 'clean') {
    return 5 // Clean
  }

  // Par défaut
  return 3 // no status
}

// Watch for changes and emit to parent
watch(
  () => rooms.value.map((room) => room.isChecked),
  () => {
    selectedRoomsCount.value = selectedCount.value
    emit('selection-change', selectedCount.value)
  },
  { deep: true },
)

// Vérifier si la chambre a un work order actif
const hasActiveWorkOrder = (room: Room): boolean => {
  if (!room.workOrders || !Array.isArray(room.workOrders)) {
    return false
  }
  return room.workOrders.some((wo: any) => wo.status !== 'completed')
}

// Handle bulk action apply
const applyBulkAction = async () => {
  if (!canApplyOperation.value || selectedRoomsCount.value === 0) return

  isBulkUpdating.value = true

  try {
    const selectedRooms = rooms.value.filter((room) => room.isChecked)
    const roomIds = selectedRooms.map((room) => room.id)

    // Préparer les données pour l'API
    const bulkUpdateData: any = {
      room_ids: roomIds,
      operation: selectedOperation.value,
      user_id: authStore?.UserId,
    }

    // Ajouter les paramètres spécifiques selon l'opération
    switch (selectedOperation.value) {
      case 'set_status':
        bulkUpdateData.housekeeping_status = selectedStatus.value
        bulkUpdateData.room_status = selectedStatus.value === 'clean' ? 'available' : 'dirty'
        break
      case 'assign_housekeeper':
        bulkUpdateData.housekeeper_id = selectedHousekeeper.value
        break
      case 'clear_status':
        bulkUpdateData.housekeeping_status = null
        break
      case 'clear_remark':
        bulkUpdateData.clear_remarks = true
        break
      case 'unassign_housekeeper':
        bulkUpdateData.housekeeper_id = null
        break
    }

    console.log('Bulk update data:', bulkUpdateData)
    const response = await bulkUpdateRooms(bulkUpdateData)

    if (response.data) {
      // Mettre à jour l'interface utilisateur localement
      // selectedRooms.forEach((room) => {
      //   const roomIndex = rooms.value.findIndex((r) => r.id === room.id)
      //   if (roomIndex !== -1) {
      //     // Dans le switch de mise à jour locale :
      //     switch (selectedOperation.value) {
      //       case 'set_status':
      //         rooms.value[roomIndex].housekeepingStatus = selectedStatus.value
      //         rooms.value[roomIndex].status =
      //           selectedStatus.value === 'clean' ? 'available' : 'dirty'
      //         break
      //       case 'assign_housekeeper':
      //         rooms.value[roomIndex].assignedHousekeeper = selectedHousekeeper.value
      //         break
      //       case 'clear_status':
      //         rooms.value[roomIndex].housekeepingStatus = 'No Status'
      //         break
      //       case 'clear_remark':
      //         rooms.value[roomIndex].housekeepersRemarks = null
      //         break
      //       case 'unassign_housekeeper':
      //         rooms.value[roomIndex].assignedHousekeeper = ''
      //         break
      //     }
      //   }
      // })

      console.log(
        `Bulk update successful: ${selectedOperation.value} applied to ${selectedRoomsCount.value} rooms`,
      )
      toast.success(t('bulk_update'))
      unselectAll()
      fetchHousekeepingStatus()
    }
  } catch (error: any) {
    console.error('Bulk update error:', error)
    // const errorMessage =
    //   error.response?.data?.message || error.message || 'Erreur lors de la mise à jour en lot'
    toast.error(`${t('bulk_update_error')}`)
  } finally {
    isBulkUpdating.value = false
  }
}

// Fetch housekeeping status
const fetchHousekeepingStatus = async () => {
  try {
    isLoading.value = true
    error.value = null

    const hotelId = serviceStore.serviceId
    const response = await getHouseStatus(hotelId!)

    const apiData = response.data
    console.log('apiData:', apiData)

    if (apiData.rooms && Array.isArray(apiData.rooms)) {
      // Transform rooms according to business logic
       rooms.value = apiData.rooms.map(transformRoomData)

    }

    console.log('Housekeeping status fetched:', rooms.value)
    // Transform other options
    if (apiData.roomTypes && Array.isArray(apiData.roomTypes)) {
      roomTypesOptions.value = apiData.roomTypes.map((rt: any) => ({
        roomTypeId: rt.value,
        value: rt.label,
        label: rt.label,
      }))
    }
    console.log('roomTypesOptions', roomTypesOptions.value)

    if (apiData.housekeepingStatusOptions && Array.isArray(apiData.housekeepingStatusOptions)) {
      housekeepingStatusOptions.value = apiData.housekeepingStatusOptions.map((hs: any) => ({
        value: hs.value,
        label: hs.label,
      }))
    }

    if (apiData.housekeepers && Array.isArray(apiData.housekeepers)) {
      housekeeperOptions.value = apiData.housekeepers.map((hk: any) => ({
        value: hk.value,
        label: hk.label,
      }))
    }
  } catch (err) {
    console.error('Error fetching housekeeping status:', err)
    error.value = 'Erreur lors du chargement des données'
  } finally {
    isLoading.value = false
  }
}
const showConfirmDialog = ref(false);
const pendingAction = ref<() => void>(() => {});

const confirmBulkAction = () => {
  showConfirmDialog.value = true;
  // On stocke l’action réelle pour l’exécuter après confirmation
  pendingAction.value = async () => {
    await applyBulkAction();
  };
};



const operationConfig: Record<
  string,
  { title: string; message: string; action: () => Promise<void> }
> = {
  set_status: {
    title: t('Confirm Status Change'),
    message: t('Are you sure you want to change the status of the selected rooms?'),
    action: async () => {
      await applyBulkAction()
    },
  },
  assign_housekeeper: {
    title: t('Confirm Assignment'),
    message: t('Are you sure you want to assign the selected housekeeper to these rooms?'),
    action: async () => {
      await applyBulkAction()
    },
  },
  clear_status: {
    title: t('Confirm Clear Status'),
    message: t('Are you sure you want to clear the status of these rooms?'),
    action: async () => {
      await applyBulkAction()
    },
  },
  clear_remark: {
    title: t('Confirm Clear Remarks'),
    message: t('Are you sure you want to remove all remarks from these rooms?'),
    action: async () => {
      await applyBulkAction()
    },
  },
  unassign_housekeeper: {
    title: t('Confirm Unassignment'),
    message: t('Are you sure you want to unassign the housekeeper from these rooms?'),
    action: async () => {
      await applyBulkAction()
    },
  },
}


const onConfirm = async () => {
  showConfirmDialog.value = false
  const operation = selectedOperation.value
  const config = operationConfig[operation]

  if (config) {
    await config.action()
  }
}


const onCancel = () => {
  showConfirmDialog.value = false
}



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
