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
        :search-placeholder="$t('Search rooms...')"
        :selectable="false"
        :meta="metaData"
        @page-change="handlePageChange"
        :empty-state-title="$t('No rooms found')"
        :empty-state-message="$t('Click \'Add Room\' to create your first room.')"
        @action="onAction"
        @selection-change="onSelectionChange">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="$t('AddRoom')" :icon="Plus" />
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
            {{ !item.smokingAllowed ? $t('Non-Smoking') : $t('SmokingAllowed') }}
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
                  {{ t('roomImage') }} <span class="text-red-500">*</span>
                  <span class="text-xs text-gray-500">({{ t('maximumImage') }})</span>
                </label>

                <div class="grid grid-cols-2 gap-4">
                  <div
                    v-for="(_, index) in [0, 1]"
                    :key="index"
                    class="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">

                    <!-- Prévisualisation de l'image -->
                    <div v-if="imagePreviews[index]" class="relative">
                      <img
                        :src="imagePreviews[index]"
                        :alt="`Preview ${index + 1}`"
                        class="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        @click="removeImage(index)"
                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg">
                        <Trash2 class="w-4 h-4" />
                      </button>
                      <div class="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {{ t('Image') }} {{ index + 1 }}
                      </div>
                    </div>

                    <!-- Zone de sélection si pas d'image -->
                    <div v-else class="p-4 text-center">
                      <div class="text-gray-400 mb-2">
                        <Camera class="w-8 h-8 mx-auto" />
                      </div>
                      <p class="text-xs text-gray-500 mb-2">{{ t('Image') }} {{ index + 1 }}</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        @change="handleImageUpload($event, index)"
                        class="hidden"
                        :id="`image-${index}`"
                        :disabled="selectedFiles.filter(f => f).length >= 2 && !selectedFiles[index]">
                      <label
                        :for="`image-${index}`"
                        :class="[
                          'text-xs cursor-pointer inline-block px-4 py-2 rounded transition',
                          selectedFiles.filter(f => f).length >= 2 && !selectedFiles[index]
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        ]">
                        {{ t('choose') }}
                      </label>
                    </div>
                  </div>
                </div>

                <p class="text-xs text-gray-500 mt-2">
                  💡 {{ t('maxImage') }} • {{ t('format') }}
                </p>
              </div>
            <!-- <div>
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
            </div> -->

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
     <ConfirmationModal
      v-model:show="showConfirmModal"
      :is-open="showConfirmModal"
      :loading="isDeletingLoading"
      :title="t('confirmDelete')"
      :message="t('deleteRoomConfirmation' , {name: deleteItem?.roomNumber})"
      action="DANGER"
      :confirm-text="$t('Confirm')"
      :cancel-text="$t('Cancel')"
      @close="showConfirmModal=false;deleteItem=null"
      @confirm="confirmDelete"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { Plus, Trash2, Edit, Trash, Camera } from 'lucide-vue-next'
import { getRooms, getRoomTypes, getBedTypes, postRoom, updateRoomById, getTaxes,deleteRoomById } from '../../../services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { formatCurrency, formatDateT } from '../../../components/utilities/UtilitiesFunction'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

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
  images: string[]
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
const isDeletingLoading = ref(false)
const showConfirmModal = ref(false)
const currentPage = ref(1)
const metaData = ref<any>(null)
const deleteItem = ref<any>(null)
const imagePreviews = ref<string[]>([])
const selectedFiles = ref<File[]>([])



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
const columns = computed(() => [
  {
    key: 'sortKey',
    label: t('Sort Key'),
    sortable: true,
    searchable: true,
    type: 'custom' as const
  },
  {
    key: 'roomInfo',
    label: t('RoomName'),
    sortable: true,
    searchable: true,
    type: 'custom' as const
  },
  {
    key: 'roomType',
    label: t('roomType'),
    sortable: true,
    searchable: true,
    type: 'custom' as const
  },
  {
    key: 'bedType.bedTypeName',
    label: t('BedType'),
    sortable: true,
    searchable: true
  },
  {
    key: 'phoneExtension',
    label: t('Phone Extension'),
    sortable: true
  },
  {
    key: 'smokingAllowed',
    label: t('Smoking'),
    sortable: true,
    type: 'custom' as const
  },
  {
    key: 'status',
    label: t('Status'),
    sortable: true,
    component: 'badge',
    type: 'custom' as const,
    translatable: true
  },
  {
    key: 'createdInfo',
    label: t('Created By'),
    sortable: false,
    type: 'custom' as const
  },
  {
    key: 'modifiedInfo',
    label: t('Modified By'),
    sortable: false,
    type: 'custom' as const
  }
])

const actions = computed(() => [
  {
    label: t('Edit'),
    variant: 'primary',
    handler: (item: Room) => onAction('edit', item),
    icon:Edit
  },
  {
    label: t('Delete'),
    icon: Trash2,
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

  // Réinitialiser les previews et les fichiers
  imagePreviews.value = []
  selectedFiles.value = []

  // 🆕 Charger les images existantes dans les previews
  if (room.images && Array.isArray(room.images)) {
    room.images.slice(0, 2).forEach((imageUrl, index) => {
      if (imageUrl && typeof imageUrl === 'string') {
        imagePreviews.value[index] = imageUrl
        // On ne met pas de fichier car c'est une URL existante
        selectedFiles.value[index] = null as any
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
    roomImages: [null, null, null, null],
    connectedRooms: room.connectedRooms || [],
    taxRateIds: room.taxRates ? room.taxRates.map(e => e.taxRateId) : []
  }

  showEditModal.value = true
}


const deleteRoom = (room: Room) => {
 deleteItem.value = room
 showConfirmModal.value = true

}

const confirmDelete = async() =>{
  try {
    isDeletingLoading.value= true
    await deleteRoomById(deleteItem.value.id)
    deleteItem.value = null
    showConfirmModal.value = false
    toast.success(t('toast.roomDelete'))
    loadData(1)

  } catch (error) {
    console.error(error)
    toast.error(t('toast.deleteErrors'))

  }finally{
    isDeletingLoading.value = false
  }
}

const deleteSelected = () => {
  if (confirm(`${t('Are you sure you want to delete')} ${selectedRooms.value.length} ${t('selected room(s)?')}`)) {
    const selectedIds = selectedRooms.value.map(r => r.id)
    rooms.value = rooms.value.filter(r => !selectedIds.includes(r.id))
    selectedRooms.value = []
  }
}


const handleImageUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Vérifier la limite de 2 images
    const currentImagesCount = selectedFiles.value.filter(f => f !== null).length

    if (currentImagesCount >= 2 && !selectedFiles.value[index]) {
      toast.error(t('maxAuthorized'))
      return
    }

    // Valider le type et la taille
    if (!file.type.startsWith('image/')) {
      toast.error(t('pleaseValidation'))
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast.error(t('sizeImage'))
      return
    }

    // Stocker le fichier
    selectedFiles.value[index] = file

    // Créer une prévisualisation
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value[index] = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Fonction pour supprimer une image
const removeImage = (index: number) => {
  selectedFiles.value[index] = null as any
  imagePreviews.value[index] = ''

  const inputElement = document.getElementById(`image-${index}`) as HTMLInputElement
  if (inputElement) {
    inputElement.value = ''
  }
}

// const saveRoom = async () => {
//   // Validation
//   if (!formData.value.shortCode ||
//       !formData.value.roomNumber ||
//       !formData.value.roomTypeId ) {
//     toast.error(t('pleaseCompleteAllRequiredFields'))
//     return
//   }

//   saving.value = true

//   try {
//     const roomData = {
//       shortCode: formData.value.shortCode,
//       roomNumber: formData.value.roomNumber,
//       roomTypeId: formData.value.roomTypeId,
//       bedTypeId: formData.value.bedTypeId,
//       phoneExtension: formData.value.phoneExtension,
//       keyCardAlias: formData.value.keyCardAlias,
//       sortKey: formData.value.sortKey,
//       smokingAllowed: formData.value.smokingAllowed,
//       roomImages: formData.value.roomImages.filter(img => img !== null),
//       connectedRooms: formData.value.connectedRooms,
//       hotelId: serviceStore.serviceId,
//       taxRateIds: formData.value.taxRateIds,
//     }

//     if (showEditModal.value && editingRoom.value) {
//       // Update existing room
//       await updateRoomById(editingRoom.value.id, roomData)
//       toast.success(t('roomUpdatedSuccessfully'))
//     } else {
//       // Add new room
//       await postRoom(roomData)
//       toast.success(t('roomAddedSuccessfully'))
//     }
//     closeModal()
//     // Reload data to reflect changes
//     await loadData(1)

//   } catch (error) {
//     console.error('Error saving room:', error)
//     toast.error(showEditModal.value ? t('errorUpdatingRoom') : t('errorAddingRoom'))
//   } finally {
//     saving.value = false
//   }
// }

const saveRoom = async () => {
  // Validation
  if (!formData.value.shortCode ||
      !formData.value.roomNumber ||
      !formData.value.roomTypeId) {
    toast.error(t('pleaseCompleteAllRequiredFields'))
    return
  }

  saving.value = true

  try {
    const formDataToSend = new FormData()

    // Ajouter les données textuelles
    formDataToSend.append('shortCode', formData.value.shortCode)
    formDataToSend.append('roomNumber', formData.value.roomNumber)
    formDataToSend.append('roomTypeId', formData.value.roomTypeId.toString())
    formDataToSend.append('hotelId', serviceStore.serviceId!.toString())
    formDataToSend.append('sortKey', formData.value.sortKey.toString())
    formDataToSend.append('smokingAllowed', formData.value.smokingAllowed.toString())

    // Champs optionnels
    if (formData.value.bedTypeId) {
      formDataToSend.append('bedTypeId', formData.value.bedTypeId.toString())
    }
    if (formData.value.phoneExtension) {
      formDataToSend.append('phoneExtension', formData.value.phoneExtension)
    }
    if (formData.value.keyCardAlias) {
      formDataToSend.append('keyCardAlias', formData.value.keyCardAlias)
    }

    // Ajouter les tableaux
    formData.value.connectedRooms.forEach(roomId => {
      formDataToSend.append('connectedRooms[]', roomId.toString())
    })

    formData.value.taxRateIds.forEach(taxId => {
      formDataToSend.append('taxRateIds[]', taxId.toString())
    })

    // 🆕 Ajouter uniquement les NOUVEAUX fichiers uploadés
    // Si aucun nouveau fichier n'est uploadé en mode édition,
    // le backend conservera les anciennes images
    const hasNewImages = selectedFiles.value.some(file => file !== null)

    if (hasNewImages) {
      selectedFiles.value.forEach((file) => {
        if (file) {
          formDataToSend.append('roomImages', file)
        }
      })
    }

    if (showEditModal.value && editingRoom.value) {
      await updateRoomById(editingRoom.value.id, formDataToSend)
      toast.success(t('roomUpdatedSuccessfully'))
    } else {
      await postRoom(formDataToSend)
      toast.success(t('roomAddedSuccessfully'))
    }

    closeModal()
    await loadData(currentPage.value)

  } catch (error: any) {
    console.error('Error saving room:', error)
    if (error.response) {
      console.error('Réponse erreur:', error.response.data)
    }
    toast.error(showEditModal.value ? t('errorUpdatingRoom') : t('errorAddingRoom'))
  } finally {
    saving.value = false
  }
}




const loadData = async (pageNumber: number = 1) => {
  loading.value = true

  try {
    const params = {
      page: pageNumber,
      limit: 10,
    }

    const resp = await getRooms(params)

    // Traitement de la réponse
    const newRooms = resp.data.data?.data || resp.data.data || resp.data || []
    const meta = resp.data.data?.meta || resp.data.meta || { total: 0, perPage: params.limit, currentPage: pageNumber, lastPage: pageNumber }
    rooms.value = newRooms
    metaData.value = meta
    currentPage.value = pageNumber

  } catch (error) {
    console.error('Error loading rooms:', error)
    toast.error(t('errorLoadingRooms'))
    rooms.value = []
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
  selectedFiles.value = []
  imagePreviews.value = []
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
