<template>
  <ConfigurationLayout>
    <div class="p-6">


      <!-- Seasons Table using ReusableTable -->
      <ReusableTable :title="t('seasonsList')" :columns="columns" :data="seasons" :actions="actions"
        :search-placeholder="t('searchSeasons')" :selectable="false" :empty-state-title="t('noSeasonsFound')"
        :empty-state-message="t('addSeasonMessage')" @action="onAction" @selection-change="onSelectionChange" :loading="loading" @page-change="handlePageChange" :meta="paginationMeta">
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
            <div class="text-sm text-gray-900 dark:text-white">{{ item.fromDay }}-{{ monthOptions.find(month => month.value === item.fromMonth)?.label }} to {{ item.toDay }}-{{
              monthOptions.find(month => month.value === item.toMonth)?.label }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.startDate }} - {{ item.expireDate }}</div>
          </div>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.createdByUser?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ item.createdAt }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.updatedByUser?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ item.updatedAt }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 dark:border-gray-700 border rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ showAddModal ? t('addSeason') : t('editSeason') }}
          </h3>

          <form @submit.prevent="saveSeason" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Short Code -->
              <div>
                <Input
                  v-model="formData.shortCode"
                  :placeholder="t('shortCodePlaceholder')"
                  :lb="t('shortCode')"
                  :is-required="true"
                />
              </div>

              <!-- Season Name -->
              <div>
                <Input
                  v-model="formData.seasonName"
                  :placeholder="t('seasonNamePlaceholder')"
                  :lb="t('seasonName')"
                  :is-required="true"
                />
              </div>
            </div>
            <!-- From Day/Date and From Month -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  v-model="formData.fromDay"
                  :options="dayOptions"
                  :placeholder="t('selectDay')"
                  :lb="t('fromDay')"
                  :is-required="true"
                />
              </div>
              <div>
                <Select
                  v-model="formData.fromMonth"
                  :options="monthOptions"
                  :placeholder="t('selectMonth')"
                  :lb="t('fromMonth')"
                  :is-required="true"
                />
              </div>
            </div>

            <!-- To Day/Date and To Month -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  v-model="formData.toDay"
                  :options="dayOptions"
                  :placeholder="t('selectDay')"
                  :lb="t('toDay')"
                  :is-required="true"
                />
              </div>
              <div>
                <Select
                  v-model="formData.toMonth"
                  :options="monthOptions"
                  :placeholder="t('selectMonth')"
                  :lb="t('toMonth')"
                  :is-required="true"
                />
              </div>
            </div>

            <!-- Start Date and Expire Date -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputDatePicker
                  v-model="formData.startDate"
                  :placeholder="t('startDatePlaceholder')"
                  :title="t('startDate')"
                  :is-required="true"
                />
              </div>
              <div>
                <InputDatePicker
                  v-model="formData.expireDate"
                  :placeholder="t('expireDatePlaceholder')"
                  :title="t('expireDate')"
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
                :disabled="isLoading"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :label="isLoading ? t('saving') + '...' : showAddModal ? t('addSeason') : t('updateSeason')"
                :loading="isLoading"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Season Confirmation Modal -->

       <ConfirmationModal
        v-model:show="showDeleteConfirmation"
        :title="$t('confirmDelete')"
        :message="t('confirmDeleteSeason', { seasonName: seasonToDelete?.seasonName || '' })"
        :confirm-text="$t('delete')"
        :cancel-text="$t('cancel')"
        variant="danger"
        :loading="isDeletingLoading"
        @confirm="confirmDeleteSeason"
        @cancel="showDeleteConfirmation = false; seasonToDelete = null"
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
import { ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { getSeasons, postSeason, updateSeasonById ,deleteSeasonById } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

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
const paginationMeta = ref({})
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

const monthOptions = computed(()=>[
  { value: 1, label: t('common.months.january') },
  { value: 2, label: t('common.months.february') },
  { value: 3, label: t('common.months.march') },
  { value: 4, label: t('common.months.april') },
  { value: 5, label: t('common.months.may') },
  { value: 6, label: t('common.months.june') },
  { value: 7, label: t('common.months.july') },
  { value: 8, label: t('common.months.august') },
  { value: 9, label: t('common.months.september') },
  { value: 10, label: t('common.months.october') },
  { value: 11, label: t('common.months.november') },
  { value: 12, label: t('common.months.december') }
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

  try {
      isDeletingLoading.value = true
      await deleteSeasonById(seasonToDelete.value.id)
       showDeleteConfirmation.value = false
      seasonToDelete.value = null
      toast.success(t('seasonDeletedSuccessfully'))
      loadData(1)
  } catch (error) {
    console.error('Error deleting season:', error)
    toast.error(t('errorDeletingSeason'))
  } finally {
    isDeletingLoading.value = false

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
    icon: Trash2,
    variant: 'danger'
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
       closeModal()
      await loadData(1)
    } else {
      // Update existing season
      await updateSeasonById(editingSeason.value.id, formData.value)
      toast.success(t('seasonUpdatedSuccessfully'))
       closeModal()
      await loadData(1)
    }

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
const loadData = async (pageNumber=1) => {
  loading.value = true
  try {
    const response = await getSeasons({page:pageNumber,limit:10})
    console.log('response data',response)
    seasons.value = response.data.data.data || []
    paginationMeta.value = response.data.data.meta
  } catch (error) {
    console.error('Error loading seasons:', error)
    toast.error(t('errorLoadingSeasons'))
    // Keep existing mock data as fallback
  } finally {
    loading.value = false
  }
}

const handlePageChange =(newPage) =>{
  loadData(newPage)
}

// Initialize data on component mount
  loadData(1)
</script>
