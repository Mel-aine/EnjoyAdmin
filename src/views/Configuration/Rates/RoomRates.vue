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
        :selectable="false"
        :empty-state-title="t('noRoomRatesFound')"
        :empty-state-message="t('clickAddRoomRate')"
        :loading="isLoading"
        :meta="paginationMeta"
        @page-change="handlePageChange"
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
            @click="deleteSelected"
            :label="t('deleteSelected')"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <!-- Custom column for rate info -->
        <template #column-rateInfo="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.baseRate) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('baseRate') }}</div>
          </div>
        </template>

        <!-- Custom column for extra rates -->
        <template #column-extraRates="{ item }">
          <div>
            <div class="text-xs text-gray-600 dark:text-gray-300">{{ t('extraAdult') }}: {{ formatCurrency(item.extraAdultRate) }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-300">{{ t('extraChild') }}: {{ formatCurrency(item.extraChildRate) }}</div>
          </div>
        </template>
<!-- Custom column for created info -->
          <template #column-createdInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.creator?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-500">{{ formatDateT(item.createdAt) }}</div>
            </div>
          </template>

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.modifier?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-500">{{ formatDateT(item.updatedAt) }}</div>
            </div>
          </template>
          <template #column-season="{ item }">
            <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.season?.seasonName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-500">{{ item.season?.startDate}}- {{ item.season?.expireDate}}</div>
            </div>
          </template>
           <template #column-source="{ item }">
            <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.source?.name }}</div>
            </div>
          </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
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
                :placeholder="t('select') + ' ' + t('Meal Plan')"
                @update:modelValue="onMealPlanChange"
                :lb="t('Meal Plan')"
              />
            </div>

            <!-- Meal Plan Details -->
           <div v-if="selectedMealPlanDetails" class="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">

              <p class="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>{{ selectedMealPlanDetails.name }}</strong>
                <span v-if="selectedMealPlanDetails.isAllInclusive" class="ml-2 text-green-600 dark:text-green-400 text-xs font-medium">
                  ({{ t('allInclusive') }})
                </span>
              </p>

              <div v-if="selectedMealPlanDetails.components?.length">
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li v-for="component in selectedMealPlanDetails.components" :key="component.id">
                    {{ component.extraCharge?.name }}
                    <span class="text-gray-500 dark:text-gray-400 text-xs">
                      ({{ component.targetGuestType }} • x{{ component.quantityPerDay }}/{{ t('day') || 'day' }})
                    </span>
                    — <strong>{{ formatCurrency(component.extraCharge?.rate) }}</strong>
                  </li>
                </ul>

                <p class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {{ t('totalPerDay') || 'Total per day' }} :
                  <span class="font-bold">{{ formatCurrency(calculateMealPlanTotal()) }}</span>
                </p>
              </div>

              <p v-else class="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
                {{ t('noChargesIncluded') }}
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
                  :lb="$t('Tax Include')"
                />
              </div>
              <div class="flex items-center gap-2">
                <CheckboxInput
                  v-model="formData.meal_plan_rate_include"
                  :lb="t('Meal Plan Rate Include')"
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
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('effectiveFrom') }} <span class="text-red-500">*</span>
                  <span v-if="!formData.effectiveFrom && formSubmitted" class="text-red-500">
                    {{ t('fieldRequired') }}
                  </span>
                </label>
                <InputDatePicker
                  v-model="formData.effectiveFrom"
                  :placeholder="t('selectEffectiveFromDate')"
                  :class="{'border-red-500': !formData.effectiveFrom && formSubmitted}"
                  @update:modelValue="formData.effectiveFrom = $event"
                  class="dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('effectiveTo') }} <span class="text-red-500">*</span>
                  <span v-if="!formData.effectiveTo && formSubmitted" class="text-red-500">
                    {{ t('fieldRequired') }}
                  </span>
                </label>
                <InputDatePicker
                  v-model="formData.effectiveTo"
                  :placeholder="t('selectEffectiveToDate')"
                  :class="{'border-red-500': !formData.effectiveTo && formSubmitted}"
                  @update:modelValue="formData.effectiveTo = $event"
                  class="dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
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
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                :disabled="isSaving" />
              <BasicButton type="submit" variant="primary" :icon="Save"
                :label="isEditing ? $t('edit') : $t('save')"
                :loading="isSaving" />
            </div>
          </form>
        </div>
      </div>
    </div>

     <ConfirmationModal
        v-model:show="show"
        :title="$t('confirmDelete')"
        :message="$t('confirmDeleteRoomRate', { roomType: deleteItem?.roomType.roomTypeName, rateType: deleteItem?.rateType.rateTypeName })"
        :confirm-text="$t('delete')"
        :cancel-text="$t('cancel')"
        variant="danger"
        :loading="loadingDelete"
        @confirm="confirmDelete"
        @cancel="show = false ; deleteItem = null"
      />
  </ConfigurationLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import CheckboxInput from '@/components/forms/FormElements/InputCheckBox.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { getBusinessSources, getRateTypes, getRoomTypes, getSeasons, postRoomRate, updateRoomRateById, deleteRoomRateById, getRoomRates } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { format } from 'date-fns'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
// Load meal plans
import { getMealPlans } from '../../../services/configrationApi'
const { t } = useI18n()
const toast = useToast()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const show = ref(false)
const loadingDelete = ref(false)
const editingRoomRate = ref(null)
const selectedRoomRates = ref([])
const serviceStore = useServiceStore()
const paginationMeta = ref()
const deleteItem = ref()

// Loading states
const isLoading = ref(false)
const isSaving = ref(false)


// Filter controls
const selectedRoomType = ref('')
const selectedRateType = ref('')
const selectedSeason = ref('')
const selectedSource = ref('')

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

const formSubmitted = ref(false)

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
    key: 'season',
    label: t('season'),
    sortable: true,
    type:'custom'
  },
  {
    key: 'source',
    label: t('sourceName'),
    sortable: true,
    type:'custom'
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
    translatable:true
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

const deleteRoomRate =  (roomRate) => {
deleteItem.value = roomRate
show.value = true

}
  const confirmDelete = async() =>{

    try {
      loadingDelete.value = true
      await deleteRoomRateById(deleteItem.value.id)
      deleteItem.value = null
      show.value = false
      await fetchRoomRates(1)
      toast.success(t('roomRateDeletedSuccessfully'))
    } catch (error) {
      console.error('Error deleting room rate:', error)
      toast.error(t('errorDeletingRoomRate'))
    } finally {
      loadingDelete.value = false
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
    icon: Trash2,
    variant: 'danger'
  }
])

const onAction = (action, item) => {
  if (action === 'edit') {
    editRoomRate(item)
  } else if (action === 'delete') {
    deleteRoomRate(item)
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


const fetchRoomRates = async (pageNumber=1) => {
  try {
    isLoading.value = true
    const response = await getRoomRates({page:pageNumber,limit:10})
    roomRates.value = response.data.data.data || []
    paginationMeta.value = response.data.data.meta
    console.log('Room rates data:', response)
  } catch (error) {
    console.error('Error fetching room rates:', error)
    toast.error(t('errorLoadingRoomRates'))
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
     closeModal()
    // Refresh the room rates list after successful save/update
    await fetchRoomRates(1)

  } catch (error) {
    console.error('Error saving room rate:', error)
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
  if (!value) return '0.00'
  return parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}


const loadRoomTypes = async () => {
  try {
    const resp = await getRoomTypes();
    console.log('Room types data:', resp)
    roomTypeOptions.value = [{ value: "", label: t("All") }].concat((resp.data.data?.data || resp.data.data || resp.data || []).map((e) => {
      return {
        value: e.id,
        label: e.roomTypeName
      }
    }));
  } catch (error) {
    console.error('Error loading room types:', error);
    toast.error(t('errorLoadingRoomTypes'));
    // Keep mock data as fallback if API fails
  }
}
const loadRateTypes = async () => {
  try {
    const resp = await getRateTypes();
    console.log('rates types data:', resp)
    rateTypeOptions.value = [{ value: "", label: t("all") }].concat((resp.data.data?.data || resp.data.data || resp.data || []).map((e) => {
      return {
        value: e.id,
        label: e.rateTypeName || e.name
      }
    }));
  } catch (error) {
    console.error('Error loading rate types:', error);
    toast.error(t('errorLoadingRateTypes'));
    // Keep mock data as fallback if API fails
  }
}
const loadSeasons = async () => {
  try {
    const resp = await getSeasons();
    console.log('seasonOptions types data:', resp)
    seasonOptions.value = [{ value: "", label: t("none") }].concat((resp.data.data?.data || resp.data.data || resp.data || []).map((e) => {
      return {
        value: e.id,
        label: e.seasonName || e.name
      }
    }));
  } catch (error) {
    console.error('Error loading seasons:', error);
    toast.error(t('errorLoadingSeasons'));
    // Keep mock data as fallback if API fails
  }
}

const loadSources = async () => {
  try {
    const resp = await getBusinessSources();
    console.log('sourceOptions data:', resp)
    sourceOptions.value = [{ value: "", label: t("none") }].concat((resp.data.data?.data || resp.data.data || resp.data || []).map((e) => {
      return {
        value: e.id,
        label: e.sourceName || e.name
      }
    }));
  } catch (error) {
    console.error('Error loading sources:', error);
    toast.error(t('errorLoadingSources'));
    // Keep mock data as fallback if API fails
  }
}

const getRates = () => {
  // Filter room rates based on selected filters
  console.log('Getting rates with filters:', {
    roomType: selectedRoomType.value,
    rateType: selectedRateType.value,
    season: selectedSeason.value,
    source: selectedSource.value
  });
  // Here you would typically call an API to fetch filtered rates
  toast.success(t('ratesLoaded'));
}

// Load all data on component mount
onMounted(() => {
  fetchRoomRates(1)
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

const handlePageChange = (page) =>{
  fetchRoomRates(page)
}
</script>
