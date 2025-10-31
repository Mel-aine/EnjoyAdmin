<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Rooms Table using ReusableTable -->
      <ReusableTable
        :title="$t('Rooms')"
        :columns="columns"
        :data="rooms"
        :actions="actions"
        :loading="loading"
        search-placeholder="Search rooms..."
        :selectable="false"
        :meta="metaData"
        :is-infinite-scroll="true"
        @page-change="handlePageChange"
        empty-state-title="No rooms found"
        empty-state-message="Click 'Add Room' to create your first room."
        @action="onAction"
        @selection-change="onSelectionChange">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" label="Add Room" :icon="Plus" />
          <BasicButton
            v-if="selectedRooms.length > 0"
            @click="deleteSelected"
            label="Delete Selected"
            :icon="Trash2"
          />
        </template>

        <template #column-roomInfo="{ item }">
          <div class="flex items-center space-x-3">
            <div class="text-sm font-medium text-gray-900">{{ item.roomNumber }}</div>
            <div class="text-xs text-gray-500">({{ item.shortCode }})</div>
          </div>
        </template>

        <template #column-roomType="{ item }">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.roomTypeColor }"></div>
            <span class="text-sm">{{ item.roomType.roomTypeName }}</span>
          </div>
        </template>

        <template #column-smokingAllowed="{ item }">
          <span
            :class="{
              'bg-green-100 text-green-800': item.smokingAllowed,
              'bg-gray-100 text-gray-800': !item.smokingAllowed
            }"
            class="px-2 py-1 text-xs font-medium rounded-full">
            {{ !item.smokingAllowed ? 'Non-Smoking' : 'Smoking Allowed' }}
          </span>
        </template>

        <template #column-status="{ item }">
          <span
            :class="{
              'bg-green-100 text-green-800': item.status === 'available',
              'bg-red-100 text-red-800': item.status === 'maintenance',
              'bg-yellow-100 text-yellow-800': item.status === 'occupied'
            }"
            class="px-2 py-1 text-xs font-medium rounded-full">
            {{ $t(item.status) }}
          </span>
        </template>

        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.creator?.fullName }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifier?.fullName }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Room Modal -->
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('EditRoom') : t('AddRoom') }}
          </h3>

          <form @submit.prevent="saveRoom" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  :lb="t('shortCode')"
                  v-model="formData.shortCode"
                  :placeholder="t('enterShortCode')"
                  :max="10"
                  :is-required="true"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('shortCodeDescription') }}</p>
              </div>

              <div>
                <Input
                  :lb="t('RoomName')"
                  v-model="formData.roomNumber"
                  :placeholder="t('enterRoomName')"
                  :is-required="true"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('roomNameDescription') }}</p>
              </div>
            </div>

            <!-- Room Type and Bed Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  :lb="t('roomType')"
                  :modelValue="formData.roomTypeId"
                  @update:modelValue="handleRoomTypeChange"
                  :options="roomTypeOptions"
                  :placeholder="t('selectRoomType')"
                  :is-required="true"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('roomTypeDescription') }}</p>
              </div>

              <div>
                <Select
                  :lb="t('bedType')"
                  :modelValue="formData.bedTypeId"
                  @update:modelValue="handleBedTypeChange"
                  :options="bedTypeOptions"
                  :placeholder="t('selectBedType')"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('bedTypeDescription') }}</p>
              </div>
            </div>

            <!-- Phone Extension and Key Card -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  :lb="t('phoneExtension')"
                  v-model="formData.phoneExtension"
                  :placeholder="t('enterPhoneExtension')"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('phoneExtensionDescription') }}</p>
              </div>

              <div>
                <Input
                  :lb="t('keyCardAlias')"
                  v-model="formData.keyCardAlias"
                  :placeholder="t('enterKeyCardAlias')"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('keyCardAliasDescription') }}</p>
              </div>
            </div>

            <!-- Sort Key and Non-Smoking -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  :lb="t('sortKey')"
                  v-model.number="formData.sortKey"
                  type="number"
                  :placeholder="t('enterSortKey')"
                  :min="0"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('sortKeyDescription') }}</p>
              </div>

              <div class="pt-6">
                <label
                  class="flex items-start text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
                  <div class="relative mr-3 mt-0.5">
                    <input type="checkbox" v-model="formData.smokingAllowed" class="sr-only" />
                    <div
                      :class="formData.smokingAllowed
                        ? 'border-brand-500 bg-brand-500'
                        : 'bg-transparent border-gray-300 dark:border-gray-700'
                      "
                      class="flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500">
                      <span :class="formData.smokingAllowed ? '' : 'opacity-0'">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437"
                            stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <div>{{ t('nonSmoking') }}</div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('nonSmokingDescription') }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Room Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('roomImage') }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in formData.roomImages"
                  :key="index"
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div class="text-gray-400 mb-2">
                    <Camera class="w-8 h-8 mx-auto" />
                  </div>
                  <p class="text-xs text-gray-500 mb-2">{{ t('image') }} {{ index + 1 }}</p>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload($event, index)"
                    class="hidden"
                    :id="`image-${index}`">
                  <label :for="`image-${index}`" class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                    {{ t('chooseFile') }}
                  </label>
                  <div v-if="image" class="mt-2 text-xs text-green-600">{{ t('imageUploaded') }}</div>
                  <div v-else class="mt-2 text-xs text-gray-400">{{ t('noImageAvailable') }}</div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ t('roomImageDescription') }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Connect Rooms -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('connectRooms') }}
                </label>
                <div class="border border-gray-300 rounded-md p-4 max-h-40 overflow-y-auto">
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="room in availableConnectRooms" :key="room.id" class="flex items-center space-x-2">
                      <input
                        v-model="formData.connectedRooms"
                        :value="room.id"
                        type="checkbox"
                        :id="`connect-${room.id}`"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                      <label :for="`connect-${room.id}`" class="text-sm text-gray-700">
                        {{ room.roomNumber }} ({{ room.roomType.roomTypeName }})
                      </label>
                    </div>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ t('connectRoomsDescription') }}</p>
              </div>

              <!-- Taxes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('taxes') }}
                </label>
                <div class="border border-gray-300 rounded-md p-4 max-h-40 overflow-y-auto">
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="taxe in availableTaxes" :key="taxe.id" class="flex items-center space-x-2">
                      <input
                        v-model="formData.taxRateIds"
                        :value="taxe.taxRateId"
                        type="checkbox"
                        :id="`taxes-${taxe.taxRateId}`"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                      <label :for="`taxes-${taxe.taxRateId}`" class="text-sm text-gray-700">
                        {{ taxe.taxName }} ({{ formatTaxAmount(taxe) }})
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton
                type="button"
                variant="outline"
                :label="$t('cancel')"
                @click="closeModal"
                :disabled="saving"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :icon="showEditModal ? Edit : Plus"
                :label="saving ? t('saving') + '...' : showEditModal ? $t('update') : $t('AddRoom')"
                :loading="saving"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { Plus, Trash2, Edit, Trash, Camera } from 'lucide-vue-next'
import { getRooms, getRoomTypes, getBedTypes, postRoom, updateRoomById, getTaxes } from '../../../services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { formatCurrency, formatDateT } from '../../../components/utilities/UtilitiesFunction'

// Types
interface Room {
  id: number
  shortCode: string
  roomNumber: string
  roomTypeId: number
  bedTypeId: number
  phoneExtension: string
  keyCardAlias: string
  sortKey: number
  smokingAllowed: boolean
  roomImages: (File | null)[]
  connectedRooms: number[]
  taxRates?: Array<{ taxRateId: number }>
  roomType: {
    roomTypeName: string
  }
  bedType: {
    bedTypeName: string
  }
  roomTypeColor?: string
  status: string
  creator?: { firstName: string }
  modifier?: { firstName: string }
  createdAt: string
  updatedAt: string
}

interface RoomFormData {
  shortCode: string
  roomNumber: string
  roomTypeId: number | null
  bedTypeId: number | null
  phoneExtension: string
  keyCardAlias: string
  sortKey: number
  smokingAllowed: boolean
  roomImages: (File | null)[]
  connectedRooms: number[]
  taxRateIds: number[]
}

interface RoomType {
  id: number
  roomTypeName?: string
  name?: string
}

interface BedType {
  id: number
  bedTypeName?: string
  name?: string
}

interface Tax {
  id: number
  taxRateId: number
  taxName: string
  postingType: string
  percentage?: number
  amount?: number
}

interface Option {
  value: string | number
  label: string
}

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedRooms = ref<Room[]>([])
const editingRoom = ref<Room | null>(null)
const loading = ref(false)
const saving = ref(false)
const currentPage = ref(1)
const metaData = ref<any>(null)


// Form data with proper typing
const formData = ref<RoomFormData>({
  shortCode: '',
  roomNumber: '',
  roomTypeId: null,
  bedTypeId: null,
  phoneExtension: '',
  keyCardAlias: '',
  sortKey: 0,
  smokingAllowed: false,
  roomImages: [null, null, null, null],
  connectedRooms: [],
  taxRateIds: []
})

// Available options
const availableRoomTypes = ref<RoomType[]>([])
const availableTaxes = ref<Tax[]>([])
const availableBedTypes = ref<BedType[]>([])
const availableConnectRooms = ref<Room[]>([])
const rooms = ref<Room[]>([])

// Computed options with proper typing - ensuring no undefined labels
const roomTypeOptions = computed<Option[]>(() => {
  return availableRoomTypes.value.map(rt => ({
    value: rt.id,
    label: (rt.roomTypeName || rt.name || `Room Type ${rt.id}`)
  }))
})

const bedTypeOptions = computed<Option[]>(() => {
  return availableBedTypes.value.map(bt => ({
    value: bt.id,
    label: (bt.bedTypeName || bt.name || `Bed Type ${bt.id}`)
  }))
})

// Handler functions for Select components
const handleRoomTypeChange = (value: string | number | undefined) => {
  if (value === undefined || value === '') {
    formData.value.roomTypeId = null
  } else {
    formData.value.roomTypeId = typeof value === 'string' ? Number(value) : value
  }
}

const handleBedTypeChange = (value: string | number | undefined) => {
  if (value === undefined || value === '') {
    formData.value.bedTypeId = null
  } else {
    formData.value.bedTypeId = typeof value === 'string' ? Number(value) : value
  }
}

// Table configuration with proper Column typing - using const assertion
const columns = ref([
  {
    key: 'sortKey',
    label: 'Sort Key',
    sortable: true,
    searchable: true,
    type: 'custom' as const
  },
  {
    key: 'roomInfo',
    label: 'Room Name',
    sortable: true,
    searchable: true,
    type: 'custom' as const
  },
  {
    key: 'roomType',
    label: 'Room Type',
    sortable: true,
    searchable: true,
    type: 'custom' as const
  },
  {
    key: 'bedType.bedTypeName',
    label: 'Bed Type',
    sortable: true,
    searchable: true
  },
  {
    key: 'phoneExtension',
    label: 'Phone Extension',
    sortable: true
  },
  {
    key: 'smokingAllowed',
    label: 'Smoking',
    sortable: true,
    type: 'custom' as const
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    component: 'badge',
    type: 'custom' as const,
    translatable: true
  },
  {
    key: 'createdInfo',
    label: 'Created By',
    sortable: false,
    type: 'custom' as const
  },
  {
    key: 'modifiedInfo',
    label: 'Modified By',
    sortable: false,
    type: 'custom' as const
  }
])

const actions = ref([
  {
    label: 'Edit',
    icon: 'edit',
    variant: 'primary',
    handler: (item: Room) => onAction('edit', item)
  },
  {
    label: 'Delete',
    icon: 'trash',
    variant: 'danger',
    handler: (item: Room) => onAction('delete', item)
  }
])

// Helper function for formatting tax amount - with proper undefined checks
const formatTaxAmount = (taxe: Tax): string => {
  if (taxe.postingType === "flat_percentage") {
    if (taxe.percentage !== undefined) {
      return `${taxe.percentage}%`
    }
    return 'N/A'
  }

  if (taxe.amount !== undefined) {
    return formatCurrency(taxe.amount)
  }

  return 'N/A'
}

// Methods
const onSelectionChange = (selected: Room[]) => {
  selectedRooms.value = selected
}

const onAction = (action: string, item: Room) => {
  if (action === 'edit') {
    editRoom(item)
  } else if (action === 'delete') {
    deleteRoom(item)
  }
}

const editRoom = (room: Room) => {
  editingRoom.value = room

  // Properly fill roomImages array
  const roomImages: (File | null)[] = [null, null, null, null]
  if (room.roomImages && Array.isArray(room.roomImages)) {
    room.roomImages.forEach((img, index) => {
      if (index < 4) {
        roomImages[index] = img
      }
    })
  }

  formData.value = {
    shortCode: room.shortCode,
    roomNumber: room.roomNumber,
    roomTypeId: room.roomTypeId,
    bedTypeId: room.bedTypeId,
    phoneExtension: room.phoneExtension,
    keyCardAlias: room.keyCardAlias,
    sortKey: room.sortKey,
    smokingAllowed: room.smokingAllowed,
    roomImages: roomImages,
    connectedRooms: room.connectedRooms || [],
    taxRateIds: room.taxRates ? room.taxRates.map(e => e.taxRateId) : []
  }
  showEditModal.value = true
}

const deleteRoom = (room: Room) => {
  if (confirm(`Are you sure you want to delete room "${room.roomNumber}"?`)) {
    rooms.value = rooms.value.filter(r => r.id !== room.id)
  }
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedRooms.value.length} selected room(s)?`)) {
    const selectedIds = selectedRooms.value.map(r => r.id)
    rooms.value = rooms.value.filter(r => !selectedIds.includes(r.id))
    selectedRooms.value = []
  }
}

const handleImageUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    formData.value.roomImages[index] = file
  }
}

const saveRoom = async () => {
  // Validation
  if (!formData.value.shortCode ||
      !formData.value.roomNumber ||
      !formData.value.roomTypeId ) {
    toast.error(t('pleaseCompleteAllRequiredFields'))
    return
  }

  saving.value = true

  try {
    const roomData = {
      shortCode: formData.value.shortCode,
      roomNumber: formData.value.roomNumber,
      roomTypeId: formData.value.roomTypeId,
      bedTypeId: formData.value.bedTypeId,
      phoneExtension: formData.value.phoneExtension,
      keyCardAlias: formData.value.keyCardAlias,
      sortKey: formData.value.sortKey,
      smokingAllowed: formData.value.smokingAllowed,
      roomImages: formData.value.roomImages.filter(img => img !== null),
      connectedRooms: formData.value.connectedRooms,
      hotelId: serviceStore.serviceId,
      taxRateIds: formData.value.taxRateIds,
    }

    if (showEditModal.value && editingRoom.value) {
      // Update existing room
      await updateRoomById(editingRoom.value.id, roomData)
      toast.success(t('roomUpdatedSuccessfully'))
    } else {
      // Add new room
      await postRoom(roomData)
      toast.success(t('roomAddedSuccessfully'))
    }

    // Reload data to reflect changes
    await loadData(1)
    closeModal()
  } catch (error) {
    console.error('Error saving room:', error)
    toast.error(showEditModal.value ? t('errorUpdatingRoom') : t('errorAddingRoom'))
  } finally {
    saving.value = false
  }
}

// const loadData = async (pageNumber: number = 1) => {

//   loading.value = true
//   try {
//     const resp = await getRooms()
//     console.log('Rooms data:', resp)
//     rooms.value = resp.data.data?.data || resp.data.data || resp.data || []

//   } catch (error) {
//     console.error('Error loading rooms:', error)
//     toast.error(t('errorLoadingRooms'))
//     rooms.value = []
//   } finally {
//     loading.value = false
//   }
// }

const loadData = async (pageNumber: number = 1) => {
  // Si on est déjà en cours de chargement et que ce n'est pas la première page, on arrête
  if (loading.value && pageNumber !== 1) return

  // Vérifiez si on essaie de charger une page qui n'existe pas
  if (metaData.value && pageNumber > metaData.value.lastPage && pageNumber !== 1) return

  loading.value = true

  try {
    const params = {
      page: pageNumber,
      limit: 8,
    }

    const resp = await getRooms(params)

    // Traitement de la réponse
    const newRooms = resp.data.data?.data || resp.data.data || resp.data || []
    const meta = resp.data.data?.meta || resp.data.meta || { total: 0, perPage: params.limit, currentPage: pageNumber, lastPage: pageNumber }

    if (pageNumber === 1) {
      // Nouvelle recherche ou première page: Remplacer les données
      rooms.value = newRooms
    } else {
      // Défilement infini: Ajouter les nouvelles données
      rooms.value.push(...newRooms)
    }

    metaData.value = meta
    currentPage.value = pageNumber

    toast.info(t('loadedRooms', { count: newRooms.length }))

  } catch (error) {
    console.error('Error loading rooms:', error)
    toast.error(t('errorLoadingRooms'))
    if (pageNumber === 1) rooms.value = []
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadData(page)
}

const loadRoomTypes = async () => {
  try {
    const resp = await getRoomTypes()
    console.log('Room types data:', resp)
    availableRoomTypes.value = resp.data.data?.data || resp.data.data || resp.data || []
  } catch (error) {
    console.error('Error loading room types:', error)
    toast.error(t('errorLoadingRoomTypes'))
  }
}

const loadBedTypes = async () => {
  try {
    const resp = await getBedTypes()
    console.log('Bed types data:', resp)
    availableBedTypes.value = resp.data.data?.data || resp.data.data || resp.data || []
  } catch (error) {
    console.error('Error loading bed types:', error)
    toast.error(t('errorLoadingBedTypes'))
  }
}

const loadConnectingRooms = async () => {
  try {
    const resp = await getRooms()
    console.log('Available connecting rooms data:', resp)
    availableConnectRooms.value = resp.data.data?.data || resp.data.data || resp.data || []
  } catch (error) {
    console.error('Error loading connecting rooms:', error)
    toast.error(t('errorLoadingConnectingRooms'))
  }
}

const loadTaxes = async () => {
  try {
    const resp = await getTaxes()
    console.log('Available taxes data:', resp)
    availableTaxes.value = resp.data.data?.data || resp.data.data || resp.data || []
  } catch (error) {
    console.error('Error loading taxes:', error)
    toast.error(t('errorLoadingTaxes'))
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoom.value = null
  formData.value = {
    shortCode: '',
    roomNumber: '',
    roomTypeId: null,
    bedTypeId: null,
    phoneExtension: '',
    keyCardAlias: '',
    sortKey: 0,
    smokingAllowed: false,
    roomImages: [null, null, null, null],
    connectedRooms: [],
    taxRateIds: []
  }
}

// Initialize data
loadData(1)
loadRoomTypes()
loadBedTypes()
loadConnectingRooms()
loadTaxes()
</script>
