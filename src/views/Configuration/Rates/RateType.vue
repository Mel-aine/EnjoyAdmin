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
      <ReusableTable :title="t('rateTypesList')" :columns="columns" :data="rateTypes" :actions="actions"
        :search-placeholder="t('searchRateTypes')" :selectable="true" :empty-state-title="t('noRateTypesFound')"
        :empty-state-message="t('addRateTypeMessage')" @action="onAction" @selection-change="onSelectionChange">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addRateType')" :icon="Plus">
          </BasicButton>

          <BasicButton v-if="selectedRateTypes.length > 0" @click="deleteSelected" :label="t('deleteSelected')"
            :icon="Trash2">
          </BasicButton>
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
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? t('addRateType') : t('editRateType') }}
          </h3>

          <form @submit.prevent="saveRateType" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

              <!-- Short Code -->
              <div>
                <Input v-model="formData.shortCode" :placeholder="t('enterShortCodePlaceholder')" :is-required="true"
                  :lb="t('shortCode')" />
              </div>

              <!-- Rate Type -->
              <div>
                <Input v-model="formData.rateTypeName" :placeholder="t('enterRateTypeNamePlaceholder')" required
                  :is-required="true" :lb="t('rateTypeName')" />
              </div>

              <!-- Nights 
              <div>
                <Input v-model="formData.nights" type="number" min="1" :placeholder="t('enterNightsPlaceholder')"
                  :is-required="true" :lb="t('nights')" />
              </div>-->

              <!-- Max Adults
              <div>
                <Input v-model="formData.maxAdult" type="number" min="1"
                  :placeholder="t('enterMaxAdultsPlaceholder')" :is-required="true" :lb="t('maxAdult')" />
              </div> -->

              <!-- Min Nights -->
              <!-- <div>
                <Input v-model="formData.minNight" type="number" min="1"
                  :placeholder="t('enterMinNightsPlaceholder')" :is-required="true" :lb="t('minNight')" />
              </div> -->

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('status') }}
                </label>
                <Select v-model="formData.status" :options="statusOptions"
                  :placeholder="t('selectStatusPlaceholder')" />
              </div>
            </div>

            <!-- Room Types Selection Section -->
            <div class="mt-6">
              <h4 class="text-md font-semibold mb-3 text-gray-900">{{ t('selectRoomTypes') }}</h4>
              <div class="border rounded-lg p-4">
                <ReusableTable :title="t('availableRoomTypes')" :columns="roomTypeColumns" :data="roomTypeOptions"
                  :selectable="true" :search-placeholder="t('searchRoomTypes')"
                  :empty-state-title="t('noRoomTypesFound')" :empty-state-message="t('noRoomTypesMessage')"
                  @selection-change="onRoomTypeSelectionChange" :selected-items="selectedRoomTypes">
                  <!-- Custom column for room type info -->
                  <template #column-roomTypeInfo="{ item }">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ item.label }}({{ item.baseAdult }}/{{ item.baseChild }})</div>
                    </div>
                  </template>

                  <!-- Custom column for rate inputs -->
                  <template #column-rateInputs="{ item }">
                    <div class="grid grid-cols-3 gap-2">
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('rackRate') }}</label>
                        <input type="number" step="0.01" min="0" :value="getRoomRate(item.value, 'rackRate')"
                          @input="updateRoomRate(item.value, 'rackRate', $event.target.value)"
                          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          :placeholder="t('enterRate')" />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('extraAdult') }}</label>
                        <input type="number" step="0.01" min="0" :value="getRoomRate(item.value, 'extraAdult')"
                          @input="updateRoomRate(item.value, 'extraAdult', $event.target.value)"
                          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          :placeholder="t('enterRate')" />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('extraChild') }}</label>
                        <input type="number" step="0.01" min="0" :value="getRoomRate(item.value, 'extraChild')"
                          @input="updateRoomRate(item.value, 'extraChild', $event.target.value)"
                          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          :placeholder="t('enterRate')" />
                      </div>
                    </div>
                  </template>
                </ReusableTable>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                {{ t('cancel') }}
              </button>
              <button type="submit" :disabled="isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isLoading ? t('saving') : (showAddModal ? t('addRateType') : t('updateRateType')) }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ModalConfirmation v-if="showDeleteConfirmation" action="DANGER" :title="t('confirmDeleteTitle')"
      :message="t('confirmDeleteRateType', { name: rateTypeToDelete?.rateTypeName || rateTypeToDelete?.rateType })"
      :isLoading="isDeletingLoading" @close="showDeleteConfirmation = false; rateTypeToDelete = null"
      @confirm="confirmDeleteRateType" />

    <!-- Delete Selected Confirmation Modal -->
    <ModalConfirmation v-if="showDeleteSelectedConfirmation" action="DANGER" :title="t('confirmDeleteTitle')"
      :message="t('confirmDeleteSelectedRateTypes', { count: selectedRateTypes.length })" :isLoading="isDeletingLoading"
      @close="showDeleteSelectedConfirmation = false" @confirm="confirmDeleteSelected" />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash, Trash2 } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import { getRateTypes, postRateType, updateRateTypeById, getRoomTypes } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRateType = ref<any>(null)
const selectedRateTypes = ref([])
const isLoading = ref(false)
const showDeleteConfirmation = ref(false)
const showDeleteSelectedConfirmation = ref(false)
const rateTypeToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const { t } = useI18n()
const toast = useToast()

// Room types selection data
const selectedRoomTypes = ref<any[]>([])
const roomRates = ref<any[]>([])

// Form data
const formData = ref({
  shortCode: '',
  rateTypeName: '',
  roomTypes: [],
  status: 'active'
})

// Table columns
const columns: Column[] = [
  {
    key: 'shortCode',
    label: t('shortCode'),
    type: 'text'
  },
  {
    key: 'rateTypeName',
    label: t('rateType'),
    type: 'text'
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
    type: 'badge',
    translatable: true
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    type: 'custom'
  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    type: 'custom'
  }
]

// Room type table columns
const roomTypeColumns: Column[] = [
  {
    key: 'roomTypeInfo',
    label: t('roomType'),
    type: 'custom'
  },
  {
    key: 'maxAdult',
    label: t('maxAdult'),
    type: 'text'
  },
  {
    key: 'rateInputs',
    label: t('rates'),
    type: 'custom'
  }
]

const serviceStore = useServiceStore()

// Sample data
const rateTypes = ref([

])

// Options for dropdowns
const roomTypeOptions = ref([
])

const statusOptions = ref([
  { value: 'active', label: t('active') },
  { value: 'inactive', label: t('inactive') }
])

// Methods
const editRateType = (rateType: any) => {
  editingRateType.value = rateType
  formData.value = { ...rateType }
  showEditModal.value = true
}

const deleteRateType = (rateType: any) => {
  rateTypeToDelete.value = rateType
  showDeleteConfirmation.value = true
}

const confirmDeleteRateType = async () => {
  if (!rateTypeToDelete.value) return

  isDeletingLoading.value = true
  try {
    const index = rateTypes.value.findIndex(rt => rt.id === rateTypeToDelete.value.id)
    if (index > -1) {
      rateTypes.value.splice(index, 1)
      toast.success(t('rateTypeDeletedSuccessfully'))
    }
  } catch (error) {
    console.error('Error deleting rate type:', error)
    toast.error(t('errorDeletingRateType'))
  } finally {
    isDeletingLoading.value = false
    showDeleteConfirmation.value = false
    rateTypeToDelete.value = null
  }
}

// Actions configuration
const actions: Action[] = [
  {
    label: t('edit'),
    handler: editRateType,
    variant: 'primary'
  },
  {
    label: t('delete'),
    handler: deleteRateType,
    variant: 'danger'
  }
]

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editRateType(item)
  } else if (action === 'delete') {
    deleteRateType(item)
  }
}

const onSelectionChange = (selected: any) => {
  selectedRateTypes.value = selected
}

const deleteSelected = () => {
  if (selectedRateTypes.value.length === 0) return
  showDeleteSelectedConfirmation.value = true
}

const confirmDeleteSelected = async () => {
  if (selectedRateTypes.value.length === 0) return

  isDeletingLoading.value = true
  try {
    selectedRateTypes.value.forEach((rateType: any) => {
      const index = rateTypes.value.findIndex(rt => rt.id === rateType?.id)
      if (index > -1) {
        rateTypes.value.splice(index, 1)
      }
    })
    toast.success(t('selectedRateTypesDeletedSuccessfully'))
    selectedRateTypes.value = []
  } catch (error) {
    console.error('Error deleting selected rate types:', error)
    toast.error(t('errorDeletingSelectedRateTypes'))
  } finally {
    isDeletingLoading.value = false
    showDeleteSelectedConfirmation.value = false
  }
}

const saveRateType = async () => {
  // Validation
  if (!formData.value.shortCode || !formData.value.rateTypeName || !formData.value.roomTypes) {
    toast.error(t('pleaseCompleteAllRequiredFields'))
    return
  }

  isLoading.value = true

  try {
    if (showAddModal.value) {
      // Add new rate type
      const newRateType = {
        ...formData.value,
        hotelId: serviceStore.serviceId,
      }
      await postRateType(newRateType)
      toast.success(t('rateTypeAddedSuccessfully'))
      await loadData()
    } else {
      // Update existing rate type
      const updateData = {
        ...formData.value,
      }
      await updateRateTypeById(editingRateType.value.id, updateData)
      toast.success(t('rateTypeUpdatedSuccessfully'))
      await loadData()
    }
    closeModal()
  } catch (error) {
    console.error('Error saving rate type:', error)
    if (showAddModal.value) {
      toast.error(t('errorAddingRateType'))
    } else {
      toast.error(t('errorUpdatingRateType'))
    }
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
const onRoomTypeSelectionChange = (selected: any[]) => {
  selectedRoomTypes.value = selected
  // Update roomRates array when selection changes
  updateRoomRatesArray()
}

const updateRoomRatesArray = () => {
  roomRates.value = selectedRoomTypes.value.map((roomType: any) => {
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

const getRoomRate = (roomTypeId: string, rateType: string) => {
  const roomRate = roomRates.value.find(rate => rate.roomTypeId === roomTypeId)
  return roomRate ? roomRate[rateType] : 0
}

const updateRoomRate = (roomTypeId: string, rateType: string, value: string) => {
  const roomRateIndex = roomRates.value.findIndex(rate => rate.roomTypeId === roomTypeId)
  if (roomRateIndex !== -1) {
    roomRates.value[roomRateIndex][rateType] = parseFloat(value) || 0
  }
}

// Load data from API
const loadData = async () => {
  try {
    const response = await getRateTypes()
    rateTypes.value = response.data.data.data || []
  } catch (error) {
    console.error('Error loading rate types:', error)
    toast.error(t('errorLoadingRateTypes'))
    // Keep existing mock data as fallback
  }
}

// Load room types for dropdown
const loadRoomTypes = async () => {
  try {
    const response = await getRoomTypes()
    console.log('Room types API response:', response)
    const apiRoomTypes = response.data.data.data || []
    roomTypeOptions.value = apiRoomTypes.map((roomType: any) => ({
      ...roomType,
      value: roomType.id,
      label: roomType.roomTypeName || roomType.name
    }))
  } catch (error) {
    console.error('Error loading room types:', error)
    // Keep existing mock data as fallback
  }
}

// Initialize data on component mount
onMounted(() => {
  loadData()
  loadRoomTypes()
})
</script>