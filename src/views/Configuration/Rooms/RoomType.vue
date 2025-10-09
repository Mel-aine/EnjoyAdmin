<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ t('roomType') }}</h1>
        <p class="text-gray-600">
          {{ t('roomTypeDescription') }}
        </p>
      </div>

      <!-- Room Types Table using ReusableTable -->
      <ReusableTable 
        :title="t('roomTypeList')" 
        :columns="columns" 
        :data="roomTypes" 
        :actions="actions"
        :search-placeholder="t('searchRoomTypes')" 
        :empty-state-title="t('noRoomTypesFound')"
        :empty-state-message="t('getStartedByAddingRoomType')" 
        @action="onAction"
        :loading="loading"
      >
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addRoomType')" :icon="Plus">
          </BasicButton>
        </template>

        <!-- Custom column for capacity info -->
        <template #column-capacityInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.baseAdult }}/{{ item.baseChild }}</div>
            <div class="text-xs text-gray-400">Base A/C</div>
          </div>
        </template>

        <template #column-maxCapacityInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.maxAdult }}/{{ item.maxChild }}</div>
            <div class="text-xs text-gray-400">Max A/C</div>
          </div>
        </template>

        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.createdAt }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Delete Confirmation Modal -->
      <ModalConfirmation 
        v-if="showDeleteConfirmation" 
        v-model="showDeleteConfirmation"
        :title="t('confirmDeleteTitle')"
        :message="t('confirmDeleteRoomType', { name: roomTypeToDelete?.roomTypeName || roomTypeToDelete?.shortCode })"
        :loading="isDeletingLoading"
        :confirm-text="t('delete')"
        :cancel-text="t('cancel')"
        @confirm="confirmDeleteRoomType"
        @close="() => { showDeleteConfirmation = false; roomTypeToDelete = null }"
        action="INFO"
      />

      <!-- Add/Edit Modal -->
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? t('addRoomType') : t('editRoomType') }}
          </h3>

          <form @submit.prevent="saveRoomType" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('shortCodeRequired') }}
                </label>
                <input 
                  v-model="formData.shortCode" 
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('shortCodePlaceholder')"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('roomTypeNameRequired') }}<span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.roomTypeName" 
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('roomTypeNamePlaceholder')"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('baseAdultRequired') }}<span class="text-red-500">*</span>
                </label>
                <input 
                  v-model.number="formData.baseAdult" 
                  type="number" 
                  min="1" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('baseChild') }}
                </label>
                <input 
                  v-model.number="formData.baseChild" 
                  type="number" 
                  min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('maxAdultRequired') }}<span class="text-red-500">*</span>
                </label>
                <input 
                  v-model.number="formData.maxAdult" 
                  type="number" 
                  min="1" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('maxChild') }}
                </label>
                <input 
                  v-model.number="formData.maxChild" 
                  type="number" 
                  min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="flex items-center space-x-2">
                  <input 
                    v-model="formData.publishToWebsite" 
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="text-sm font-medium text-gray-700">{{ t('publishToWebsite') }}</span>
                </label>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('defaultWebInventory') }}
                </label>
                <input 
                  v-model.number="formData.defaultWebInventory" 
                  type="number" 
                  min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('numberOfRooms')"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('color') }}
              </label>
              <input 
                v-model="formData.color" 
                type="color"
                class="w-20 h-10 border border-gray-300 rounded-md cursor-pointer"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('selectRoomAmenities') }}
              </label>
              <div class="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label 
                    v-for="amenity in availableAmenities" 
                    :key="amenity.id" 
                    class="flex items-center space-x-2"
                  >
                    <input 
                      v-model="formData.roomAmenities" 
                      :value="amenity.id" 
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm text-gray-700">{{ amenity.amenityName }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal" 
                :label="t('cancel')" 
                :disabled="isLoading"
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :label="isLoading ? t('saving') + '...' : showAddModal ? t('save') : t('update')"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { getAmenities, getRoomTypes, postRoomType, updateRoomTypeById, deleteRoomType as deleteRoomTypeApi } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

const { t } = useI18n()
const serviceStore = useServiceStore()
const toast = useToast()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRoomType = ref(null)
const loading = ref(false)
const isLoading = ref(false)
const showDeleteConfirmation = ref(false)
const roomTypeToDelete = ref(null)
const isDeletingLoading = ref(false)

// Form data
const formData = ref({
  shortCode: '',
  roomTypeName: '',
  baseAdult: 2,
  baseChild: 0,
  maxAdult: 2,
  maxChild: 0,
  publishToWebsite: true,
  roomAmenities: [],
  color: '#3B82F6',
  defaultWebInventory: 0
})

// Available amenities
const availableAmenities = ref([])

// Table configuration
const columns = ref([
  {
    key: 'shortCode',
    label: t('shortCode'),
    sortable: true,
    searchable: true
  },
  {
    key: 'roomTypeName',
    label: t('roomTypeName'),
    sortable: true,
    searchable: true
  },
  {
    key: 'capacityInfo',
    label: t('baseCapacity'),
    sortable: false,
    type: 'custom'
  },
  {
    key: 'maxCapacityInfo',
    label: t('maxCapacity'),
    sortable: false,
    type: 'custom'
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    sortable: false,
    type: 'custom'
  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    sortable: false,
    type: 'custom'
  },
  {
    key: 'status',
    label: t('status'),
    sortable: true,
    component: 'badge'
  }
])

const actions = ref([
  {
    label: t('edit'),
    icon: Edit,
    variant: 'primary',
    handler: (item) => onAction('edit', item)
  },
  {
    label: t('delete'),
    icon: Trash2,
    variant: 'danger',
    handler: (item) => onAction('delete', item)
  }
])

const roomTypes = ref([])

// Methods
const onAction = (action, item) => {
  if (action === 'edit') {
    editRoomType(item)
  } else if (action === 'delete') {
    deleteRoomType(item)
  }
}

const editRoomType = (roomType) => {
  editingRoomType.value = roomType
  console.log('data', roomType)
  
  // Extraire les IDs des amenities
  let amenityIds = []
  if (roomType.roomAmenities && Array.isArray(roomType.roomAmenities)) {
    amenityIds = roomType.roomAmenities.map(amenity => {
      // Si c'est un objet avec un id
      if (typeof amenity === 'object' && amenity.id) {
        return amenity.id
      }
      // Si c'est déjà un ID
      return amenity
    })
  }
  
  formData.value = {
    shortCode: roomType.shortCode || '',
    roomTypeName: roomType.roomTypeName || '',
    baseAdult: roomType.baseAdult || 2,
    baseChild: roomType.baseChild || 0,
    maxAdult: roomType.maxAdult || 2,
    maxChild: roomType.maxChild || 0,
    publishToWebsite: roomType.publishToWebsite !== undefined ? roomType.publishToWebsite : true,
    roomAmenities: amenityIds,
    color: roomType.color || '#3B82F6',
    defaultWebInventory: roomType.defaultWebInventory || 0
  }
  
  console.log('Form data après mapping:', formData.value)
  showEditModal.value = true
}

const deleteRoomType = (roomType) => {
  roomTypeToDelete.value = roomType
  showDeleteConfirmation.value = true
}

const confirmDeleteRoomType = async () => {
  if (!roomTypeToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteRoomTypeApi(roomTypeToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      const index = roomTypes.value.findIndex(rt => rt.id === roomTypeToDelete.value.id)
      if (index !== -1) {
        roomTypes.value.splice(index, 1)
      }
      toast.success(t('roomTypeDeletedSuccessfully'))
    } else {
      throw new Error('Failed to delete room type')
    }
  } catch (error) {
    console.error('Error deleting room type:', error)
    toast.error(t('errorDeletingRoomType'))
  } finally {
    isDeletingLoading.value = false
    showDeleteConfirmation.value = false
    roomTypeToDelete.value = null
  }
}

const saveRoomType = async () => {
  try {
    isLoading.value = true
    
    // Validation des données
    if (!formData.value.shortCode?.trim()) {
      toast.error(t('shortCodeRequired'))
      return
    }
    
    if (!formData.value.roomTypeName?.trim()) {
      toast.error(t('roomTypeNameRequired'))
      return
    }
    
    // Préparer les données
    const roomTypeData = {
      shortCode: formData.value.shortCode.trim(),
      roomTypeName: formData.value.roomTypeName.trim(),
      baseAdult: parseInt(formData.value.baseAdult) || 1,
      baseChild: parseInt(formData.value.baseChild) || 0,
      maxAdult: parseInt(formData.value.maxAdult) || 1,
      maxChild: parseInt(formData.value.maxChild) || 0,
      publishToWebsite: Boolean(formData.value.publishToWebsite),
      roomAmenities: Array.isArray(formData.value.roomAmenities) 
        ? formData.value.roomAmenities.filter(id => id !== null && id !== undefined)
        : [],
      color: (formData.value.color || '#3B82F6').trim(),
      defaultWebInventory: parseInt(formData.value.defaultWebInventory) || 0,
      hotelId: serviceStore.serviceId
    }

    console.log('Données à envoyer:', JSON.stringify(roomTypeData, null, 2))

    if (showAddModal.value) {
      // Ajout d'un nouveau type de chambre
      console.log('Tentative d\'ajout d\'un nouveau type de chambre')
      const resp = await postRoomType(roomTypeData)
      console.log('Réponse de l\'API (ajout):', resp)
      
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('roomTypeAddedSuccess'))
        await loadData()
        closeModal()
      } else {
        throw new Error(resp.data?.message || t('somethingWentWrong'))
      }
    } else if (editingRoomType.value) {
      // Mise à jour d'un type de chambre existant
      console.log('Tentative de mise à jour du type de chambre ID:', editingRoomType.value.id)
      
      const resp = await updateRoomTypeById(editingRoomType.value.id, roomTypeData)
      console.log('Réponse de l\'API (mise à jour):', resp)
      
      if (resp.status === 200 || resp.status === 201) {
        // Mettre à jour localement l'élément modifié
        const index = roomTypes.value.findIndex(rt => rt.id === editingRoomType.value.id)
        if (index !== -1) {
          roomTypes.value[index] = {
            ...roomTypes.value[index],
            ...roomTypeData,
            id: editingRoomType.value.id
          }
        }
        toast.success(t('roomTypeUpdatedSuccess'))
        closeModal()
      } else {
        throw new Error(resp.data?.message || t('somethingWentWrong'))
      }
    }
  } catch (error) {
    console.error('Error saving room type:', error)
    
    if (error.response) {
      console.error('Error response data:', error.response.data)
      console.error('Error status:', error.response.status)
      console.error('Error headers:', error.response.headers)
      
      if (error.response.data.errors) {
        console.error('Validation errors:', error.response.data.errors)
      }
    }
    
    const errorMessage = error.response?.data?.message || error.message || t('somethingWentWrong')
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoomType.value = null
  formData.value = {
    shortCode: '',
    roomTypeName: '',
    baseAdult: 2,
    baseChild: 0,
    maxAdult: 2,
    maxChild: 0,
    publishToWebsite: true,
    roomAmenities: [],
    color: '#3B82F6',
    defaultWebInventory: 0
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const resp = await getRoomTypes()
    console.log('API Response (Room Types):', resp.data.data.data)
    
    if (resp.data.data.data && resp.data.data.data.length > 0) {
      console.log('First room type structure:', resp.data.data.data[0])
      console.log('First room type amenities:', resp.data.data.data[0].roomAmenities)
    }
    
    roomTypes.value = resp.data.data.data.map((item) => {
      return {
        ...item,
      }
    })
  } catch (error) {
    console.error('Error loading room types:', error)
    toast.error(t('errorLoadingRoomTypes'))
  } finally {
    loading.value = false
  }
}

const loadAmenities = async () => {
  try {
    const resp = await getAmenities()
    console.log('Amenities loaded:', resp.data.data.data)
    availableAmenities.value = resp.data.data.data
  } catch (error) {
    console.error('Error loading amenities:', error)
    toast.error(t('errorLoadingAmenities'))
  }
}

loadData()
loadAmenities()
</script>