<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('season') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('seasonDescription') }}
        </p>
      </div>

      <!-- Seasons Table using ReusableTable -->
      <ReusableTable :title="t('seasonsList')" :columns="columns" :data="seasons" :actions="actions"
        :search-placeholder="t('searchSeasons')" :selectable="true" :empty-state-title="t('noSeasonsFound')"
        :empty-state-message="t('addSeasonMessage')" @action="onAction" @selection-change="onSelectionChange" :loading="loading">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addSeason')" :icon="Plus">
          </BasicButton>

          <BasicButton v-if="selectedSeasons.length > 0" @click="deleteSelected" :label="t('deleteSelected')"
            :icon="Trash2">
          </BasicButton>
        </template>

        <!-- Custom column for period info -->
        <template #column-periodInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.fromDay }}-{{ monthOptions.find(month => month.value === item.fromMonth)?.label }} to {{ item.toDay }}-{{
              monthOptions.find(month => month.value === item.toMonth)?.label }}</div>
            <div class="text-xs text-gray-500">{{ item.startDate }} - {{ item.expireDate }}</div>
          </div>
        </template>

        <!-- Custom column for created info -->
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
        <div class="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? t('addSeason') : t('editSeason') }}
          </h3>

          <form @submit.prevent="saveSeason" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Short Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('shortCode') }} *
                </label>
                <Input v-model="formData.shortCode" :placeholder="t('shortCodePlaceholder')" required />
              </div>

              <!-- Season Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('seasonName') }} *
                </label>
                <Input v-model="formData.seasonName" :placeholder="t('seasonNamePlaceholder')" required />
              </div>
            </div>
            <!-- From Day/Date and From Month -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('fromDay') }} *
                </label>
                <Select v-model="formData.fromDay" :options="dayOptions" :placeholder="t('selectDay')" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('fromMonth') }} *
                </label>
                <Select v-model="formData.fromMonth" :options="monthOptions" :placeholder="t('selectMonth')" required />
              </div>
            </div>

            <!-- To Day/Date and To Month -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('toDay') }} *
                </label>
                <Select v-model="formData.toDay" :options="dayOptions" placeholder="Select day" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('toMonth') }} *
                </label>
                <Select v-model="formData.toMonth" :options="monthOptions" placeholder="Select month" required />
              </div>
            </div>

            <!-- Start Date and Expire Date -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('startDate') }} *
                </label>
                <InputDatePicker v-model="formData.startDate" :placeholder="t('startDatePlaceholder')" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('expireDate') }} *
                </label>
                <InputDatePicker v-model="formData.expireDate" :placeholder="t('expireDatePlaceholder')" required />
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('status') }}
              </label>
              <Select v-model="formData.status" :options="statusOptions" :placeholder="t('selectStatus')" />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                {{ t('cancel') }}
              </button>
              <button type="submit" :disabled="isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isLoading ? t('saving') : (showAddModal ? t('addSeason') : t('updateSeason')) }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Season Confirmation Modal -->
      <ModalConfirmation
        v-if="showDeleteConfirmation"
        @close="showDeleteConfirmation = false; seasonToDelete = null"
        @confirm="confirmDeleteSeason"
        :isLoading="isDeletingLoading"
        :action="'DANGER'"
        :title="t('confirmDeleteTitle')"
        :message="t('confirmDeleteSeason', { seasonName: seasonToDelete?.seasonName || '' })"
      />

      <!-- Delete Selected Seasons Confirmation Modal -->
      <ModalConfirmation
        v-if="showDeleteSelectedConfirmation"
        @close="showDeleteSelectedConfirmation = false"
        @confirm="confirmDeleteSelected"
        :isLoading="isDeletingLoading"
        :action="'DANGER'"
        :title="t('confirmDeleteTitle')"
        :message="t('confirmDeleteSelectedSeasons', { count: selectedSeasons.length })"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash, Trash2 } from 'lucide-vue-next'
import { getSeasons, postSeason, updateSeasonById } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingSeason = ref(null)
const selectedSeasons = ref([])
const isLoading = ref(false)
const loading  =ref(false)

// Confirmation modal states
const showDeleteConfirmation = ref(false)
const showDeleteSelectedConfirmation = ref(false)
const seasonToDelete = ref(null)
const isDeletingLoading = ref(false)
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
// Form data
const formData = ref({
  shortCode: '',
  seasonName: '',
  fromDay: '',
  fromMonth: '',
  toDay: '',
  toMonth: '',
  startDate: '',
  expireDate: '',
  status: 'active'
})

// Table columns
const columns = computed(() => [
  {
    key: 'shortCode',
    label: t('shortCode'),
    sortable: true
  },
  {
    key: 'seasonName',
    label: t('seasonName'),
    sortable: true,
    
  },
  {
    key: 'periodInfo',
    label: t('periodInfo'),
    sortable: false,
    type:'custom'
  },
  {
    key: 'status',
    label: t('status'),
    sortable: true,
    type:'badge',
    translatable:true
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    sortable: false,
    type:'custom'
  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    sortable: false,
    type:'custom'
  }
])

// Sample data
const seasons = ref([
])

// Options for dropdowns
const dayOptions = ref(
  Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1)
  }))
)

const monthOptions = ref([
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
])

const statusOptions = ref([
  { value: 'active', label: t('active') },
  { value: 'inactive', label: t('inactive') }
])

// Methods
const editSeason = (season) => {
  editingSeason.value = season
  formData.value = { ...season }
  showEditModal.value = true
}

const deleteSeason = (season) => {
  seasonToDelete.value = season
  showDeleteConfirmation.value = true
}

const confirmDeleteSeason = async () => {
  if (!seasonToDelete.value) return
  
  isDeletingLoading.value = true
  try {
    const index = seasons.value.findIndex(s => s.id === seasonToDelete.value.id)
    if (index > -1) {
      seasons.value.splice(index, 1)
      toast.success(t('seasonDeletedSuccessfully'))
    }
  } catch (error) {
    console.error('Error deleting season:', error)
    toast.error(t('errorDeletingSeason'))
  } finally {
    isDeletingLoading.value = false
    showDeleteConfirmation.value = false
    seasonToDelete.value = null
  }
}

// Actions configuration
const actions = computed(() => [
  {
    label: t('edit'),
    handler: editSeason,
    icon: Edit
  },
  {
    label: t('delete'),
    handler: deleteSeason,
    icon: Trash,
    class: 'text-red-600 hover:text-red-800'
  }
])

const onAction = (action, item) => {
  if (action === 'edit') {
    editSeason(item)
  } else if (action === 'delete') {
    deleteSeason(item)
  }
}

const onSelectionChange = (selected) => {
  selectedSeasons.value = selected
}

const deleteSelected = () => {
  if (selectedSeasons.value.length === 0) return
  showDeleteSelectedConfirmation.value = true
}

const confirmDeleteSelected = async () => {
  if (selectedSeasons.value.length === 0) return
  
  isDeletingLoading.value = true
  try {
    const deletedCount = selectedSeasons.value.length
    selectedSeasons.value.forEach(season => {
      const index = seasons.value.findIndex(s => s.id === season.id)
      if (index > -1) {
        seasons.value.splice(index, 1)
      }
    })
    selectedSeasons.value = []
    toast.success(t('seasonsDeletedSuccessfully', { count: deletedCount }))
  } catch (error) {
    console.error('Error deleting seasons:', error)
    toast.error(t('errorDeletingSelectedSeasons'))
  } finally {
    isDeletingLoading.value = false
    showDeleteSelectedConfirmation.value = false
  }
}

const saveSeason = async () => {
  // Validation
  if (!formData.value.shortCode || !formData.value.seasonName || !formData.value.fromDay || !formData.value.fromMonth || !formData.value.toDay || !formData.value.toMonth) {
    alert(t('pleaseCompleteAllRequiredFields'))
    return
  }

  isLoading.value = true

  try {
    if (showAddModal.value) {
      // Add new season
      const newSeason = {
        ...formData.value, hotelId: serviceStore.serviceId,
      }
      await postSeason(newSeason)
      toast.success(t('seasonAddedSuccessfully'))
      await loadData()
    } else {
      // Update existing season
      await updateSeasonById(editingSeason.value.id, formData.value)
      toast.success(t('seasonUpdatedSuccessfully'))
      await loadData()
    }
    closeModal()
  } catch (error) {
    console.error('Error saving season:', error)
    if (showAddModal.value) {
      toast.error(t('errorAddingSeason'))
    } else {
      toast.error(t('errorUpdatingSeason'))
    }
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingSeason.value = null
  formData.value = {
    shortCode: '',
    seasonName: '',
    fromDay: '',
    fromMonth: '',
    toDay: '',
    toMonth: '',
    startDate: '',
    expireDate: '',
    status: 'active'
  }
}

// Load data from API
const loadData = async () => {
  loading.value = true
  try {
    const response = await getSeasons()
    console.log('response data',response)
    seasons.value = response.data.data.data || []
  } catch (error) {
    console.error('Error loading seasons:', error)
    toast.error(t('errorLoadingSeasons'))
    // Keep existing mock data as fallback
  } finally {
    loading.value = false
  }
}

// Initialize data on component mount
  loadData()
</script>
