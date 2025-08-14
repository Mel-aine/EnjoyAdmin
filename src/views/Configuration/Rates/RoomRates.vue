<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('roomRatesList') }}</h1>
      </div>

      <!-- Filter Controls -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('roomType') }}
            </label>
            <Select 
              v-model="selectedRoomType"
              :options="roomTypeOptions"
              :placeholder="t('selectRoomType')"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('rateType') }}
            </label>
            <Select 
              v-model="selectedRateType"
              :options="rateTypeOptions"
              :placeholder="t('selectRateType')"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('seasonName') }}
            </label>
            <Select 
              v-model="selectedSeason"
              :options="seasonOptions"
              :placeholder="t('selectSeason')"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('sourceName') }}
            </label>
            <Select 
              v-model="selectedSource"
              :options="sourceOptions"
              :placeholder="t('selectSource')"
            />
          </div>
          <div>
            <BasicButton 
              @click="getRates"
              :label="t('getRates')"
              class="w-full"
            />
          </div>
        </div>
      </div>

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
            @click="deleteSelected"
            :label="t('deleteSelected')"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <!-- Custom column for rate info -->
        <template #column-rateInfo="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900">${{ formatCurrency(item.baseRate) }}</div>
            <div class="text-xs text-gray-500">{{ t('baseRate') }}</div>
          </div>
        </template>

        <!-- Custom column for extra rates -->
        <template #column-extraRates="{ item }">
          <div>
            <div class="text-xs text-gray-600">{{ t('extraAdult') }}: ${{ formatCurrency(item.extraAdultRate) }}</div>
            <div class="text-xs text-gray-600">{{ t('extraChild') }}: ${{ formatCurrency(item.extraChildRate) }}</div>
          </div>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdBy }}</div>
            <div class="text-xs text-gray-400">{{ item.createdDate }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifiedBy }}</div>
            <div class="text-xs text-gray-400">{{ item.modifiedDate }}</div>
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
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('roomType') }} *
                </label>
                <Select 
                  v-model="formData.roomType"
                  :options="roomTypeOptions"
                  :placeholder="t('selectRoomType')"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('rateType') }} *
                </label>
                <Select 
                  v-model="formData.rateType"
                  :options="rateTypeOptions"
                  :placeholder="t('selectRateType')"
                  required
                />
              </div>
            </div>

            <!-- Season and Source Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('season') }} *
                </label>
                <Select 
                  v-model="formData.season"
                  :options="seasonOptions"
                  :placeholder="t('selectSeason')"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('sourceName') }}
                </label>
                <Select 
                  v-model="formData.sourceName"
                  :options="sourceOptions"
                  :placeholder="t('selectSource')"
                />
              </div>
            </div>

            <!-- Base Rate -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('baseRate') }} *
              </label>
              <Input 
                v-model="formData.baseRate"
                type="number"
                step="0.01"
                :placeholder="t('enterBaseRate')"
                required
              />
            </div>

            <!-- Extra Adult and Child Rates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rate for Extra Adult
                </label>
                <Input 
                  v-model="formData.extraAdultRate"
                  type="number"
                  step="0.01"
                  placeholder="Enter rate for extra adult"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rate for Extra Child
                </label>
                <Input 
                  v-model="formData.extraChildRate"
                  type="number"
                  step="0.01"
                  placeholder="Enter rate for extra child"
                />
              </div>
            </div>

            <!-- Effective Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Effective From *
                </label>
                <InputDatePicker 
                  v-model="formData.effectiveFrom"
                  placeholder="Select effective from date"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Effective To *
                </label>
                <InputDatePicker 
                  v-model="formData.effectiveTo"
                  placeholder="Select effective to date"
                  required
                />
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select 
                v-model="formData.status"
                :options="statusOptions"
                placeholder="Select status"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                {{ t('cancel') }}
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ showAddModal ? t('addRoomRate') : t('updateRoomRate') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
import { Plus, Edit, Trash, Trash2 } from 'lucide-vue-next'
import { getBusinessSources, getRateTypes, getRoomTypes, getSeasons, postRoomRate, updateRoomRateById, deleteRoomRateById } from '../../../services/configrationApi'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRoomRate = ref(null)
const selectedRoomRates = ref([])

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
  baseRate: '',
  extraAdultRate: '',
  extraChildRate: '',
  effectiveFrom: '',
  effectiveTo: '',
  status: 'Active'
})

// Table columns
const columns = ref([
  {
    key: 'roomType',
    label: t('roomType'),
    sortable: true
  },
  {
    key: 'rateType',
    label: t('rateType'),
    sortable: true
  },
  {
    key: 'season',
    label: t('season'),
    sortable: true
  },
  {
    key: 'sourceName',
    label: t('sourceName'),
    sortable: true
  },
  {
    key: 'rateInfo',
    label: t('rate'),
    sortable: false
  },
  {
    key: 'extraRates',
    label: t('extraRates'),
    sortable: false
  },
  {
    key: 'status',
    label: t('status'),
    sortable: true
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    sortable: false
  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    sortable: false
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

const statusOptions = ref([
  { value: 'Active', label: t('active') },
  { value: 'Inactive', label: t('inactive') }
])

// Methods
const editRoomRate = (roomRate) => {
  editingRoomRate.value = roomRate
  formData.value = { ...roomRate }
  showEditModal.value = true
}

const deleteRoomRate = async (roomRate) => {
  if (confirm(`Are you sure you want to delete room rate for "${roomRate.roomType} - ${roomRate.rateType}"?`)) {
    try {
      await deleteRoomRateById(roomRate.id)
      const index = roomRates.value.findIndex(r => r.id === roomRate.id)
      if (index > -1) {
        roomRates.value.splice(index, 1)
      }
      toast.success(t('roomRateDeletedSuccessfully'))
    } catch (error) {
      console.error('Error deleting room rate:', error)
      toast.error(t('errorDeletingRoomRate'))
    }
  }
}

// Actions configuration
const actions = ref([
  {
    label: t('edit'),
    handler: editRoomRate,
    icon: Edit
  },
  {
    label: t('delete'),
    handler: deleteRoomRate,
    icon: Trash,
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

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedRoomRates.value.length} selected room rate(s)?`)) {
    selectedRoomRates.value.forEach(roomRate => {
      const index = roomRates.value.findIndex(r => r.id === roomRate.id)
      if (index > -1) {
        roomRates.value.splice(index, 1)
      }
    })
    selectedRoomRates.value = []
  }
}

const saveRoomRate = async () => {
  try {
    if (showAddModal.value) {
      // Add new room rate
      const roomRateData = {
        roomTypeId: formData.value.roomType,
        rateTypeId: formData.value.rateType,
        seasonId: formData.value.season,
        sourceId: formData.value.sourceName,
        baseRate: parseFloat(formData.value.baseRate),
        extraAdultRate: parseFloat(formData.value.extraAdultRate) || 0,
        extraChildRate: parseFloat(formData.value.extraChildRate) || 0,
        effectiveFrom: formData.value.effectiveFrom,
        effectiveTo: formData.value.effectiveTo,
        status: formData.value.status || 'Active'
      }
      
      const response = await postRoomRate(roomRateData)
      console.log('Room rate created:', response)
      
      // Add to local data for immediate UI update
      const newRoomRate = {
        id: response.data.id || Date.now(),
        ...formData.value,
        status: formData.value.status || 'Active',
        createdBy: 'Admin',
        createdDate: new Date().toLocaleString(),
        modifiedBy: 'Admin',
        modifiedDate: new Date().toLocaleString()
      }
      roomRates.value.push(newRoomRate)
      toast.success(t('roomRateCreated'))
      
    } else if (showEditModal.value && editingRoomRate.value) {
      // Update existing room rate
      const roomRateData = {
        roomTypeId: formData.value.roomType,
        rateTypeId: formData.value.rateType,
        seasonId: formData.value.season,
        sourceId: formData.value.sourceName,
        baseRate: parseFloat(formData.value.baseRate),
        extraAdultRate: parseFloat(formData.value.extraAdultRate) || 0,
        extraChildRate: parseFloat(formData.value.extraChildRate) || 0,
        effectiveFrom: formData.value.effectiveFrom,
        effectiveTo: formData.value.effectiveTo,
        status: formData.value.status || 'Active'
      }
      
      const response = await updateRoomRateById(editingRoomRate.value.id, roomRateData)
      console.log('Room rate updated:', response)
      
      // Update local data for immediate UI update
      const index = roomRates.value.findIndex(r => r.id === editingRoomRate.value.id)
      if (index > -1) {
        roomRates.value[index] = {
          ...roomRates.value[index],
          ...formData.value,
          modifiedBy: 'Admin',
          modifiedDate: new Date().toLocaleString()
        }
      }
      toast.success(t('roomRateUpdated'))
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving room rate:', error)
    toast.error(t('errorSavingRoomRate'))
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoomRate.value = null
  formData.value = {
    roomType: '',
    rateType: '',
    season: '',
    sourceName: '',
    baseRate: '',
    extraAdultRate: '',
    extraChildRate: '',
    effectiveFrom: '',
    effectiveTo: '',
    status: 'Active'
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
  loadRoomTypes();
  loadRateTypes();
  loadSeasons();
  loadSources();
});
</script>
