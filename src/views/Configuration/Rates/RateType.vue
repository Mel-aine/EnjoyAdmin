<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('rateType') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('rateTypeDescription') }}
        </p>
      </div>

      <!-- Rate Types Table using ReusableTable -->
      <ReusableTable 
        :title="t('rateTypesList')" 
        :columns="columns" 
        :data="rateTypes" 
        :actions="actions"
        :search-placeholder="t('searchRateTypes')" 
        :selectable="true" 
        :empty-state-title="t('noRateTypesFound')"
        :empty-state-message="t('addRateTypeMessage')" 
        @action="onAction" 
        @selection-change="onSelectionChange"
        :loading="loading"
      >
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addRateType')" :icon="Plus">
          </BasicButton>

          <button 
            v-if="selectedRateTypes.length > 0" 
            @click="deleteSelected"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <Trash2 class="w-4 h-4" />
            <span>{{ t('deleteSelected') }} ({{ selectedRateTypes.length }})</span>
          </button>
        </template>

        <!-- Custom column for nights info -->
        <template #column-nightsInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.nights }} {{ t('night', item.nights) }}</div>
            <div class="text-xs text-gray-500">{{ t('min') }}: {{ item.minNight }} {{ t('nights') }}</div>
          </div>
        </template>

        <!-- Custom column for capacity info -->
        <template #column-capacityInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ t('max') }} {{ item.maxAdult }} {{ t('adult', item.maxAdult) }}</div>
            <div class="text-xs text-gray-500">{{ item.roomType?.roomTypeName }}</div>
          </div>
        </template>

        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.createdAt }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? t('addRateType') : t('editRateType') }}
          </h3>

          <form @submit.prevent="saveRateType" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Short Code -->
              <div>
                <Input 
                  v-model="formData.shortCode" 
                  :placeholder="t('enterShortCodePlaceholder')" 
                  :is-required="true"
                  :lb="t('shortCode')" 
                />
              </div>

              <!-- Rate Type -->
              <div>
                <Input 
                  v-model="formData.rateTypeName" 
                  :placeholder="t('enterRateTypeNamePlaceholder')" 
                  required
                  :is-required="true" 
                  :lb="t('rateTypeName')" 
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('status') }}
                </label>
                <Select 
                  v-model="formData.status" 
                  :options="statusOptions"
                  :placeholder="t('selectStatusPlaceholder')" 
                />
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
                :label="isLoading ? t('saving') + '...' : showAddModal ? t('addRateType') : t('updateRateType')"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('confirmDeleteTitle')" 
      :message="getDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteRateType"
      @close="() => { showDeleteModal = false; rateTypeToDelete = null; }"
      :loading="isDeletingLoading"
      action="INFO"
    />
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { getRateTypes, postRateType, updateRateTypeById, getRoomTypes, deleteRateTypeById } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRateType = ref(null)
const selectedRateTypes = ref([])
const isLoading = ref(false)
const loading = ref(false)

// Form data
const formData = ref({
  shortCode: '',
  rateTypeName: '',
  roomTypes: [],
  status: 'active'
})

// Room types selection data
const selectedRoomTypes = ref([])
const roomRates = ref([])

// Table columns
const columns = ref([
  {
    key: 'shortCode',
    label: t('shortCode'),
    sortable: true,
    searchable: true
  },
  {
    key: 'rateTypeName',
    label: t('rateType'),
    sortable: true
  },
  {
    key: 'nightsInfo',
    label: t('nightsInfo'),
    type: 'custom'
  },
  {
    key: 'capacityInfo',
    label: t('capacityAndRoomType'),
    type: 'custom'
  },
  {
    key: 'status',
    label: t('status'),
    sortable: true,
    component: 'badge',
    translatable: true
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
  }
])

// Options for dropdowns
const roomTypeOptions = ref([])

const statusOptions = ref([
  { value: 'active', label: t('active') },
  { value: 'inactive', label: t('inactive') }
])

const rateTypes = ref([])

const editRateType = (rateType) => {
  editingRateType.value = rateType
  console.log('data', rateType)
  formData.value = {
    shortCode: rateType.shortCode,
    rateTypeName: rateType.rateTypeName,
    roomTypes: rateType.roomTypes || [],
    status: rateType.status || 'active'
  }
  showEditModal.value = true
}

const rateTypeToDelete = ref(null)
const showDeleteModal = ref(false)
const isDeletingLoading = ref(false)

const handleDeleteRateType = (rateType) => {
  rateTypeToDelete.value = rateType
  showDeleteModal.value = true
}

const confirmDeleteRateType = async () => {
  if (!rateTypeToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteRateTypeById(rateTypeToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      // Mettre à jour la liste localement
      const index = rateTypes.value.findIndex(rt => rt.id === rateTypeToDelete.value.id)
      if (index !== -1) {
        rateTypes.value.splice(index, 1)
      }
      toast.success(t('rateTypeDeletedSuccessfully'))
    } else {
      throw new Error('Failed to delete rate type')
    }
  } catch (error) {
    console.error('Error deleting rate type:', error)
    toast.error(t('errorDeletingRateType'))
  } finally {
    isDeletingLoading.value = false
    showDeleteModal.value = false
    rateTypeToDelete.value = null
  }
}

const getDeleteMessage = () => {
  if (!rateTypeToDelete.value) return ''
  return t('confirmDeleteRateType', { name: rateTypeToDelete.value.rateTypeName || rateTypeToDelete.value.shortCode })
}

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

// Methods
const onAction = (action, item) => {
  if (action === 'edit') {
    editRateType(item)
  } else if (action === 'delete') {
    handleDeleteRateType(item)
  }
}

const onSelectionChange = (selection) => {
  selectedRateTypes.value = selection
}

const deleteSelected = async () => {
  const count = selectedRateTypes.value.length
  if (confirm(t('confirmDeleteSelected', { count }))) {
    try {
      const deletePromises = selectedRateTypes.value.map(rateType => deleteRateTypeById(rateType.id))
      await Promise.all(deletePromises)
      loadData()
      selectedRateTypes.value = []
      toast.success(t('rateTypesDeletedSuccess', { count }))
    } catch (error) {
      console.error('Error deleting rate types:', error)
      toast.error(t('errorDeletingSelectedRateTypes'))
    }
  }
}

const saveRateType = async () => {
  try {
    isLoading.value = true
    
    if (showAddModal.value) {
      // Add new rate type
      const newRateType = {
        shortCode: formData.value.shortCode,
        rateTypeName: formData.value.rateTypeName,
        roomTypes: formData.value.roomTypes,
        status: formData.value.status,
        hotelId: serviceStore.serviceId
      }
      const resp = await postRateType(newRateType)
      console.log(resp)
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('rateTypeAddedSuccessfully'))
        loadData()
      } else {
        toast.error(t('somethingWentWrong'))
      }
      rateTypes.value.push(newRateType)
    } else if (editingRateType.value) {
      // Update existing rate type
      const updatedRateType = {
        shortCode: formData.value.shortCode,
        rateTypeName: formData.value.rateTypeName,
        status: formData.value.status,
        hotelId: serviceStore.serviceId
      }
      
      const resp = await updateRateTypeById(editingRateType.value.id, updatedRateType)
      
      if (resp.status === 200 || resp.status === 201) {
        // Mettre à jour localement l'élément modifié
        const index = rateTypes.value.findIndex(rt => rt.id === editingRateType.value.id)
        if (index !== -1) {
          rateTypes.value[index] = {
            ...rateTypes.value[index],
            ...updatedRateType,
            shortCode: updatedRateType.shortCode,
            rateTypeName: updatedRateType.rateTypeName
          }
        }
        toast.success(t('rateTypeUpdatedSuccessfully'))
      } else {
        throw new Error('Failed to update rate type')
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error saving rate type:', error)
    toast.error(t('errorSavingRateType'))
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRateType.value = null
  selectedRoomTypes.value = []
  roomRates.value = []
  formData.value = {
    shortCode: '',
    rateTypeName: '',
    roomTypes: [],
    status: 'active'
  }
}

// Room type selection methods
const onRoomTypeSelectionChange = (selected) => {
  selectedRoomTypes.value = selected
  updateRoomRatesArray()
}

const updateRoomRatesArray = () => {
  roomRates.value = selectedRoomTypes.value.map((roomType) => {
    const existingRate = roomRates.value.find(rate => rate.roomTypeId === roomType.value)
    return {
      roomTypeId: roomType.value,
      roomTypeName: roomType.label,
      rackRate: existingRate?.rackRate || 0,
      extraAdult: existingRate?.extraAdult || 0,
      extraChild: existingRate?.extraChild || 0
    }
  })
}

// Load data from API
const loadData = async () => {
  loading.value = true
  try {
    const response = await getRateTypes()
    console.log(response)
    if (response.status === 200) {
      rateTypes.value = response.data.data.data.map((item) => {
        return {
          ...item,
        }
      })
    } else {
      toast.error(t('failedToLoadRateTypes'))
    }
  } catch (error) {
    console.error('Error loading rate types:', error)
    toast.error(t('errorLoadingRateTypes'))
  } finally {
    loading.value = false
  }
}

// Load room types for dropdown
const loadRoomTypes = async () => {
  try {
    const response = await getRoomTypes()
    console.log('Room types API response:', response)
    const apiRoomTypes = response.data.data.data || []
    roomTypeOptions.value = apiRoomTypes.map((roomType) => ({
      ...roomType,
      value: roomType.id,
      label: roomType.roomTypeName || roomType.name
    }))
  } catch (error) {
    console.error('Error loading room types:', error)
    toast.error(t('errorLoadingRoomTypes'))
  }
}

loadData()
loadRoomTypes()
</script>