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
            @click="openModalRoomRate"
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
                  v-model="formData.roomType"
                  :options="roomTypeOptions"
                  :placeholder="t('selectRoomType')"
                  :lb="t('roomType')"
                  :is-required="true"
                />
              </div>
              <div>
                <Select
                  v-model="formData.rateType"
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
                  v-model="formData.season"
                  :options="seasonOptions"
                  :placeholder="t('selectSeason')"
                  :lb="t('season')"
                  :is-required="true"
                />
              </div>
              <div>
                <Select
                  v-model="formData.sourceName"
                  :options="sourceOptions"
                  :placeholder="t('selectSource')"
                  :lb="t('sourceName')"
                />
              </div>
            </div>

            <!-- Meal Plan selection -->
            <div>
              <Select
                v-model="formData.mealPlanId"
                :options="mealPlanOptions"
                :placeholder="t('select') + ' ' + 'Meal Plan'"
                @update:modelValue="onMealPlanChange"
                :lb="'Meal Plan'"
              />
            </div>

            <!-- Meal Plan Details -->
           <div v-if="selectedMealPlanDetails" class="border rounded-lg p-3 bg-gray-50">

              <p class="text-sm text-gray-700 mb-1">
                <strong>{{ selectedMealPlanDetails.name }}</strong>
                <span v-if="selectedMealPlanDetails.isAllInclusive" class="ml-2 text-green-600 text-xs font-medium">
                  ({{ t('allInclusive') || 'All Inclusive' }})
                </span>
              </p>

              <div v-if="selectedMealPlanDetails.components?.length">
                <ul class="text-sm text-gray-700 space-y-1">
                  <li v-for="component in selectedMealPlanDetails.components" :key="component.id">
                    {{ component.extraCharge?.name }}
                    <span class="text-gray-500 text-xs">
                      ({{ component.targetGuestType }} • x{{ component.quantityPerDay }}/{{ t('day') || 'day' }})
                    </span>
                    — <strong>{{ formatCurrency(component.extraCharge?.rate) }}</strong>
                  </li>
                </ul>

                <p class="mt-2 text-sm font-semibold text-gray-900">
                  {{ t('totalPerDay') || 'Total per day' }} :
                  <span class="font-bold">{{ formatCurrency(calculateMealPlanTotal()) }}</span>
                </p>
              </div>

              <p v-else class="text-sm text-gray-500 italic mt-2">
                {{ t('noChargesIncluded') || 'No extra charges included' }}
              </p>
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

            <!-- Tax and Meal Plan Rate Include Flags -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-2">
                <CheckboxInput
                  v-model="formData.tax_include"
                  :lb="'Tax Include'"
                />
              </div>
              <div class="flex items-center gap-2">
                <CheckboxInput
                  v-model="formData.meal_plan_rate_include"
                  :lb="'Meal Plan Rate Include'"
                />
              </div>
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
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('effectiveFrom') }} <span class="text-red-500">*</span>
                  <span v-if="!formData.effectiveFrom && formSubmitted" class="text-red-500">
                    {{ t('fieldRequired') }}
                  </span>
                </label>
                <InputDatePicker
                  v-model="formData.effectiveFrom"
                  :placeholder="t('selectEffectiveFromDate')"
                  :title="t('effectiveFrom')"
                  :is-required="true"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('effectiveTo') }} <span class="text-red-500">*</span>
                  <span v-if="!formData.effectiveTo && formSubmitted" class="text-red-500">
                    {{ t('fieldRequired') }}
                  </span>
                </label>
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
import CheckboxInput from '@/components/forms/FormElements/InputCheckBox.vue'
import { Plus, Edit, Trash, Trash2 } from 'lucide-vue-next'
import { getBusinessSources, getRateTypes, getRoomTypes, getSeasons, postRoomRate, updateRoomRateById, deleteRoomRateById, getRoomRates } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
// Load meal plans
import { getMealPlans } from '../../../services/configrationApi'
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
  roomType: '',
  rateType: '',
  season: '',
  sourceName: '',
  mealPlanId: '',
  baseRate: '',
  extraAdultRate: '',
  extraChildRate: '',
  effectiveFrom: '',
  effectiveTo: '',
  status: 'active',
  tax_include: false,
  meal_plan_rate_include: false
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

// Sample data
const roomRates = ref([
  ])

// Options for dropdowns
const roomTypeOptions = ref([
])

const rateTypeOptions = ref([
])

const seasonOptions = ref([
])

const sourceOptions = ref([
])

const mealPlanOptions = ref([
])
const mealPlansData = ref([])
const selectedMealPlanDetails = ref(null)

const statusOptions = ref([
  { value: 'active', label: t('active') },
  { value: 'inactive', label: t('inactive') }
])

// Methods
const editRoomRate = (roomRate) => {
  console.log("roomRate",roomRate)
  editingRoomRate.value = roomRate

  formData.value.roomType = roomRate.roomTypeId
  formData.value.rateType = roomRate.rateTypeId
  formData.value.season = roomRate.seasonId
  formData.value.sourceName = roomRate.sourceId
  formData.value.mealPlanId = roomRate.mealPlanId || ''
  formData.value.baseRate = roomRate.baseRate
  formData.value.extraAdultRate = roomRate.extraAdultRate
  formData.value.extraChildRate = roomRate.extraChildRate
  formData.value.effectiveFrom = roomRate.effectiveFrom
  formData.value.effectiveTo = roomRate.effectiveTo
  formData.value.status = roomRate.status
  formData.value.tax_include = roomRate.taxInclude
  formData.value.meal_plan_rate_include = roomRate.mealPlanRateInclude

  if (roomRate.mealPlanId) {
    onMealPlanChange(roomRate.mealPlanId)
  } else {
    selectedMealPlanDetails.value = null
  }

  showEditModal.value = true
}

const deleteRoomRate = async (roomRate) => {
  if (confirm(t('confirmDeleteRoomRate', { roomType: roomRate.roomType.roomTypeName, rateType: roomRate.rateType.rateTypeName }))) {
    try {
      isLoading.value = true
      await deleteRoomRateById(roomRate.id)
      const index = roomRates.value.findIndex(r => r.id === roomRate.id)
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
    icon: Edit
  },
  {
    label: t('delete'),
    handler: (item) => onAction('delete', item),
    icon: Trash,
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

const openModalRoomRate = () =>{
    showAddModal.value = true
   selectedMealPlanDetails.value = null
}

const deleteSelected = async () => {
  if (confirm(t('confirmDeleteSelectedRoomRates', { count: selectedRoomRates.value.length }))) {
    try {
      isLoading.value = true

      // Delete each selected room rate
      for (const roomRate of selectedRoomRates.value) {
        await deleteRoomRateById(roomRate.id)
        const index = roomRates.value.findIndex(r => r.id === roomRate.id)
        if (index > -1) {
          roomRates.value.splice(index, 1)
        }
      }

      selectedRoomRates.value = []
      toast.success(t('selectedRoomRatesDeleted'))
    } catch (error) {
      console.error('Error deleting selected room rates:', error)
      toast.error(t('errorDeletingSelectedRoomRates'))
    } finally {
      isLoading.value = false
    }
  }
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
  formSubmitted.value = true

  // Vérification des champs requis
  if (!formData.value.effectiveFrom || !formData.value.effectiveTo) {
    isSaving.value = false
    return
  }

  try {
    isSaving.value = true

    if (showAddModal.value) {
      // Add new room rate
      const roomRateData = {
        roomTypeId: formData.value.roomType,
        rateTypeId: formData.value.rateType,
        seasonId: formData.value.season,
        sourceId: formData.value.sourceName,
        mealPlanId: formData.value.mealPlanId || null,
        baseRate: parseFloat(formData.value.baseRate),
        extraAdultRate: parseFloat(formData.value.extraAdultRate) || 0,
        extraChildRate: parseFloat(formData.value.extraChildRate) || 0,
        effectiveFrom: formData.value.effectiveFrom??null,
        effectiveTo: formData.value.effectiveTo??null,
        status: formData.value.status || 'active',
        taxInclude: !!formData.value.tax_include,
        mealPlanRateInclude: !!formData.value.meal_plan_rate_include,
        hotelId:serviceStore.serviceId
      }

      const response = await postRoomRate(roomRateData)
      console.log('Room rate created:', response)
      toast.success(t('roomRateCreated'))

    } else if (showEditModal.value && editingRoomRate.value) {
      // Update existing room rate
      const roomRateData = {
        roomTypeId: formData.value.roomType,
        rateTypeId: formData.value.rateType,
        seasonId: formData.value.season,
        sourceId: formData.value.sourceName,
        mealPlanId: formData.value.mealPlanId || null,
        baseRate: parseFloat(formData.value.baseRate),
        extraAdultRate: parseFloat(formData.value.extraAdultRate) || 0,
        extraChildRate: parseFloat(formData.value.extraChildRate) || 0,
        effectiveFrom: formData.value.effectiveFrom,
        effectiveTo: formData.value.effectiveTo,
        status: formData.value.status || 'active',
        taxInclude: !!formData.value.tax_include,
        mealPlanRateInclude: !!formData.value.meal_plan_rate_include
      }
       console.log('roomRateData:', roomRateData)
      const response = await updateRoomRateById(editingRoomRate.value.id, roomRateData)
      console.log('Room rate updated:', response)

      toast.success(t('roomRateUpdated'))
    }

    // Refresh the room rates list after successful save/update
    await fetchRoomRates()
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
  formSubmitted.value = false
  formData.value = {
    roomType: '',
    rateType: '',
    season: '',
    sourceName: '',
    mealPlanId: '',
    extraAdultRate: '',
    extraChildRate: '',
    effectiveFrom: '',
    effectiveTo: '',
    status: 'active',
    tax_include: false,
    meal_plan_rate_include: false
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
  loadMealPlans();
});


const loadMealPlans = async () => {
  try {
    const resp = await getMealPlans();
    const plans = resp.data.data?.data
    mealPlansData.value = plans
    mealPlanOptions.value = [{ value: '', label: t('none') }].concat((resp.data.data?.data || resp.data.data || resp.data || []).map((e) => {
      return {
        value: e.id,
        label: e.name
      }
    }));
  } catch (error) {
    console.error('Error loading meal plans:', error);
    // silently fail, keep empty
  }
}

const onMealPlanChange = (mealPlanId) => {
  if (mealPlanId) {
    selectedMealPlanDetails.value = mealPlansData.value.find(plan => plan.id === mealPlanId)
  } else {
    selectedMealPlanDetails.value = null
  }
}

// Calculer le total du meal plan
const calculateMealPlanTotal = () => {
  if (!selectedMealPlanDetails.value || !selectedMealPlanDetails.value.components) {
    return 0
  }

  return selectedMealPlanDetails.value.components.reduce((total, component) => {
    const rate = parseFloat(component.extraCharge?.rate || 0)
    const quantity = component.quantityPerDay || 1
    return total + (rate * quantity)
  }, 0)
}
</script>