<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Room Rates Table using ReusableTable -->
      <ReusableTable
        :title="t('roomRatesList')"
        :columns="columns"
        :data="roomRates"
        :actions="actions"
        :search-placeholder="t('searchRoomRates')"
        :selectable="true"
        :empty-state-title="t('noRoomRatesFound')"
        :empty-state-message="t('clickAddRoomRate')"
        :loading="isLoading"
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            :label="t('addRoomRate')"
            :icon="Plus"
          > 
          </BasicButton>
          
          <BasicButton 
            v-if="selectedRoomRates.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')"
            :icon="Trash2"
          />
        </template>

        <!-- Custom column for rate info -->
        <template #column-rateInfo="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900">{{ formatCurrency(item.baseRate) }}</div>
            <div class="text-xs text-gray-500">{{ t('baseRate') }}</div>
          </div>
        </template>

        <!-- Custom column for extra rates -->
        <template #column-extraRates="{ item }">
          <div>
            <div class="text-xs text-gray-600">{{ t('extraAdult') }}: {{ formatCurrency(item.extraAdultRate) }}</div>
            <div class="text-xs text-gray-600">{{ t('extraChild') }}: {{ formatCurrency(item.extraChildRate) }}</div>
          </div>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? t('addRoomRate') : t('editRoomRate') }}
          </h3>
          
          <form @submit.prevent="saveRoomRate" class="space-y-4">
            <!-- Room Type and Rate Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select 
                  v-model="formData.roomTypeId"
                  :options="roomTypeOptions"
                  :placeholder="t('selectRoomType')"
                  :lb="t('roomType')"
                  :is-required="true"
                />
              </div>
              <div>
                <Select 
                  v-model="formData.rateTypeId"
                  :options="rateTypeOptions"
                  :placeholder="t('selectRateType')"
                  :lb="t('rateType')"
                  :is-required="true"
                />
              </div>
            </div>

            <!-- Season and Source Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select 
                  v-model="formData.seasonId"
                  :options="seasonOptions"
                  :placeholder="t('selectSeason')"
                  :lb="t('season')"
                  :is-required="true"
                />
              </div>
              <div>
                <Select 
                  v-model="formData.sourceId"
                  :options="sourceOptions"
                  :placeholder="t('selectSource')"
                  :lb="t('sourceName')"
                />
              </div>
            </div>

            <!-- Base Rate -->
            <div>
              <Input 
                v-model="formData.baseRate"
                type="number"
                step="0.01"
                :placeholder="t('enterBaseRate')"
                :lb="t('baseRate')"
                :is-required="true"
              />
            </div>

            <!-- Extra Adult and Child Rates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input 
                  v-model="formData.extraAdultRate"
                  type="number"
                  step="0.01"
                  :placeholder="t('enterRateForExtraAdult')"
                  :lb="t('rateForExtraAdult')"
                />
              </div>
              <div>
                <Input 
                  v-model="formData.extraChildRate"
                  type="number"
                  step="0.01"
                  :placeholder="t('enterRateForExtraChild')"
                  :lb="t('rateForExtraChild')"
                />
              </div>
            </div>

            <!-- Effective Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputDatePicker 
                  v-model="formData.effectiveFrom"
                  :placeholder="t('selectEffectiveFromDate')"
                  :title="t('effectiveFrom')"
                  :is-required="true"
                />
              </div>
              <div>
                <InputDatePicker 
                  v-model="formData.effectiveTo"
                  :placeholder="t('selectEffectiveToDate')"
                  :title="t('effectiveTo')"
                  :is-required="true"
                />
              </div>
            </div>

            <!-- Status -->
            <div>
              <Select 
                v-model="formData.status"
                :options="statusOptions"
                :placeholder="t('selectStatus')"
                :lb="t('status')"
              />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal" 
                :label="t('cancel')"
                :disabled="isSaving" 
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :icon="Save"
                :label="isSaving ? t('saving') + '...' : (showEditModal ? t('update') : t('save'))"
                :loading="isSaving" 
                :disabled="isSaving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Single Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('Delete Room Rate')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleRoomRate"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('Delete Selected Room Rates')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteRoomRates"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash, Trash2, Save } from 'lucide-vue-next'
import { getBusinessSources, getRateTypes, getRoomTypes, getSeasons, postRoomRate, updateRoomRateById, deleteRoomRateById, getRoomRates } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRoomRate = ref(null)
const selectedRoomRates = ref([])

// Loading states
const isLoading = ref(false)
const isSaving = ref(false)

// Delete modals states - MODIFIÉ
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false) // NOUVEAU - nom cohérent
const roomRateToDelete = ref(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false) // NOUVEAU - nom cohérent

// Form data
const formData = ref({
  roomTypeId: '',
  rateTypeId: '',
  seasonId: '',
  sourceId: '',
  baseRate: '',
  extraAdultRate: '',
  extraChildRate: '',
  effectiveFrom: '',
  effectiveTo: '',
  status: 'active'
})

// Computed
const isEditing = computed(() => showEditModal.value && editingRoomRate.value)
const selectedCount = computed(() => selectedRoomRates.value.length)

// Table columns
const columns = ref([
  {
    key: 'roomType.roomTypeName',
    label: t('roomType'),
    sortable: true
  },
  {
    key: 'rateType.rateTypeName',
    label: t('rateType'),
    sortable: true
  },
  {
    key: 'season.seasonName',
    label: t('season'),
    sortable: true
  },
  {
    key: 'source.sourceName',
    label: t('sourceName'),
    sortable: true
  },
  {
    key: 'rateInfo',
    label: t('rate'),
    sortable: false,
    type: 'custom',
  },
  {
    key: 'extraRates',
    label: t('extraRates'),
    sortable: false,
    type: 'custom',
  },
  {
    key: 'status',
    label: t('status'),
    sortable: true,
    type: 'badge',
    translatable: true
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    sortable: false,
    type: 'custom',
  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    sortable: false,
    type: 'custom',
  }
])

// Data
const roomRates = ref([])
const roomTypeOptions = ref([])
const rateTypeOptions = ref([])
const seasonOptions = ref([])
const sourceOptions = ref([])

const statusOptions = ref([
  { value: 'active', label: t('active') },
  { value: 'inactive', label: t('inactive') }
])

// Methods
const editRoomRate = (roomRate) => {
  editingRoomRate.value = roomRate
  console.log('Editing room rate:', roomRate)
  
  // Map the data correctly for editing
  formData.value = {
    roomTypeId: roomRate.roomType?.id || roomRate.roomTypeId || '',
    rateTypeId: roomRate.rateType?.id || roomRate.rateTypeId || '',
    seasonId: roomRate.season?.id || roomRate.seasonId || '',
    sourceId: roomRate.source?.id || roomRate.sourceId || '',
    baseRate: roomRate.baseRate || '',
    extraAdultRate: roomRate.extraAdultRate || '',
    extraChildRate: roomRate.extraChildRate || '',
    effectiveFrom: roomRate.effectiveFrom || '',
    effectiveTo: roomRate.effectiveTo || '',
    status: roomRate.status || 'active'
  }
  showEditModal.value = true
}

// Single room rate deletion - MODIFIÉ
const handleDeleteRoomRate = (roomRate) => {
  roomRateToDelete.value = roomRate
  showDeleteModal.value = true
}

const confirmDeleteSingleRoomRate = async () => {
  if (!roomRateToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteRoomRateById(roomRateToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      // Update local list
      const index = roomRates.value.findIndex(r => r.id === roomRateToDelete.value.id)
      if (index > -1) {
        roomRates.value.splice(index, 1)
      }
      toast.success(t('roomRateDeletedSuccessfully'))
    } else {
      throw new Error('Failed to delete room rate')
    }
  } catch (error) {
    console.error('Error deleting room rate:', error)
    toast.error(t('errorDeletingRoomRate'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  roomRateToDelete.value = null
}

// Multiple room rates deletion - MODIFIÉ
const confirmBulkDeleteRoomRates = async () => {
  if (selectedRoomRates.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedRoomRates.value.map(roomRate => 
      deleteRoomRateById(roomRate.id)
    )
    
    const results = await Promise.allSettled(deletePromises)
    
    // Check for failures
    const failedDeletes = results.filter(result => result.status === 'rejected')
    if (failedDeletes.length > 0) {
      console.error('Some deletions failed:', failedDeletes)
      throw new Error(`${failedDeletes.length} deletions failed`)
    }
    
    // Update local list for successful deletions
    const selectedIds = selectedRoomRates.value.map(r => r.id)
    roomRates.value = roomRates.value.filter(r => !selectedIds.includes(r.id))
    
    const count = selectedRoomRates.value.length
    selectedRoomRates.value = []
    toast.success(t('selectedRoomRatesDeleted', { count }))
  } catch (error) {
    console.error('Error deleting selected room rates:', error)
    toast.error(t('errorDeletingSelectedRoomRates'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Messages for modals - MODIFIÉ
const getSingleDeleteMessage = () => {
  if (!roomRateToDelete.value) return ''
  const roomType = roomRateToDelete.value.roomType?.roomTypeName || 'Room Rate'
  const rateType = roomRateToDelete.value.rateType?.rateTypeName || ''
  return `Are you sure you want to delete for "${roomType}"?`
}

const getBulkDeleteMessage = () => {
  const count = selectedRoomRates.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const roomRate = selectedRoomRates.value[0]
    const roomType = roomRate.roomType?.roomTypeName || 'Room Rate'
    const rateType = roomRate.rateType?.rateTypeName || ''
    return `Are you sure you want to delete the selected room rate for "${roomType}" (${rateType})?`
  } else {
    return `Are you sure you want to delete ${count} selected room rates?`
  }
}

// Actions configuration
const actions = ref([
  {
    label: t('edit'),
    handler: (item) => onAction('edit', item),
    icon: Edit,
    variant: 'primary'
  },
  {
    label: t('delete'),
    handler: (item) => onAction('delete', item),
    icon: Trash2,
    variant: 'danger'
  }
])

const onAction = (action, item) => {
  if (action === 'edit') {
    editRoomRate(item)
  } else if (action === 'delete') {
    handleDeleteRoomRate(item)
  }
}

const onSelectionChange = (selected) => {
  selectedRoomRates.value = selected
}

const fetchRoomRates = async () => {
  try {
    isLoading.value = true
    const response = await getRoomRates()
    console.log('Room rates API response:', response)
    
    if (response.data && response.data.data) {
      roomRates.value = response.data.data.data || response.data.data || []
    } else {
      roomRates.value = []
    }
  } catch (error) {
    console.error('Error fetching room rates:', error)
    toast.error(t('errorLoadingRoomRates'))
    roomRates.value = []
  } finally {
    isLoading.value = false
  }
}

const saveRoomRate = async () => {
  try {
    isSaving.value = true
    
    // Validation basique
    if (!formData.value.roomTypeId || !formData.value.rateTypeId || !formData.value.seasonId || !formData.value.baseRate) {
      toast.error(t('pleaseCompleteAllRequiredFields'))
      return
    }

    const roomRateData = {
      roomTypeId: formData.value.roomTypeId,
      rateTypeId: formData.value.rateTypeId,
      seasonId: formData.value.seasonId,
      sourceId: formData.value.sourceId || null,
      baseRate: parseFloat(formData.value.baseRate),
      extraAdultRate: parseFloat(formData.value.extraAdultRate) || 0,
      extraChildRate: parseFloat(formData.value.extraChildRate) || 0,
      effectiveFrom: formData.value.effectiveFrom || null,
      effectiveTo: formData.value.effectiveTo || null,
      status: formData.value.status || 'active',
      hotelId: serviceStore.serviceId
    }

    console.log('Saving room rate data:', roomRateData)

    if (showAddModal.value) {
      // Add new room rate
      const response = await postRoomRate(roomRateData)
      console.log('Room rate created response:', response)
      
      if (response.status === 200 || response.status === 201) {
        toast.success(t('roomRateCreated'))
        await fetchRoomRates() // Refresh the list
      } else {
        throw new Error('Failed to create room rate')
      }
      
    } else if (showEditModal.value && editingRoomRate.value) {
      // Update existing room rate
      const response = await updateRoomRateById(editingRoomRate.value.id, roomRateData)
      console.log('Room rate updated response:', response)
      
      if (response.status === 200 || response.status === 201) {
        toast.success(t('roomRateUpdated'))
        await fetchRoomRates() // Refresh the list
      } else {
        throw new Error('Failed to update room rate')
      }
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving room rate:', error)
    console.error('Error details:', error.response?.data || error.message)
    toast.error(t('errorSavingRoomRate'))
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoomRate.value = null
  formData.value = {
    roomTypeId: '',
    rateTypeId: '',
    seasonId: '',
    sourceId: '',
    baseRate: '',
    extraAdultRate: '',
    extraChildRate: '',
    effectiveFrom: '',
    effectiveTo: '',
    status: 'active'
  }
}

// Format currency method
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0.00'
  return parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const loadRoomTypes = async () => {
  try {
    const resp = await getRoomTypes();
    console.log('Room types data:', resp)
    roomTypeOptions.value = (resp.data.data?.data || resp.data.data || resp.data || []).map((e) => ({
      value: e.id,
      label: e.roomTypeName
    }));
  } catch (error) {
    console.error('Error loading room types:', error);
    toast.error(t('errorLoadingRoomTypes'));
  }
}

const loadRateTypes = async () => {
  try {
    const resp = await getRateTypes();
    console.log('Rate types data:', resp)
    rateTypeOptions.value = (resp.data.data?.data || resp.data.data || resp.data || []).map((e) => ({
      value: e.id,
      label: e.rateTypeName || e.name
    }));
  } catch (error) {
    console.error('Error loading rate types:', error);
    toast.error(t('errorLoadingRateTypes'));
  }
}

const loadSeasons = async () => {
  try {
    const resp = await getSeasons();
    console.log('Seasons data:', resp)
    seasonOptions.value = (resp.data.data?.data || resp.data.data || resp.data || []).map((e) => ({
      value: e.id,
      label: e.seasonName || e.name
    }));
  } catch (error) {
    console.error('Error loading seasons:', error);
    toast.error(t('errorLoadingSeasons'));
  }
}

const loadSources = async () => {
  try {
    const resp = await getBusinessSources();
    console.log('Sources data:', resp)
    sourceOptions.value = (resp.data.data?.data || resp.data.data || resp.data || []).map((e) => ({
      value: e.id,
      label: e.sourceName || e.name
    }));
  } catch (error) {
    console.error('Error loading sources:', error);
    toast.error(t('errorLoadingSources'));
  }
}

// Load all data on component mount
onMounted(() => {
  fetchRoomRates()
  loadRoomTypes();
  loadRateTypes();
  loadSeasons();
  loadSources();
});
</script>