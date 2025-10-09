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
      <ReusableTable 
        :title="t('seasonsList')" 
        :columns="columns" 
        :data="seasons" 
        :actions="actions"
        :search-placeholder="t('searchSeasons')" 
        :selectable="true" 
        :empty-state-title="t('noSeasonsFound')"
        :empty-state-message="t('addSeasonMessage')" 
        @action="onAction" 
        @selection-change="onSelectionChange" 
        :loading="loading"
      >
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addSeason')" :icon="Plus">
          </BasicButton>

          <button 
            v-if="selectedSeasons.length > 0" 
            @click="deleteSelected"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <Trash2 class="w-4 h-4" />
            <span>{{ t('deleteSelected') }} ({{ selectedSeasons.length }})</span>
          </button>
        </template>

        <!-- Custom column for period info -->
        <template #column-periodInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">
              {{ item.fromDay }}-{{ monthOptions.find(month => month.value === item.fromMonth)?.label }} to 
              {{ item.toDay }}-{{ monthOptions.find(month => month.value === item.toMonth)?.label }}
            </div>
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
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
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
                :disabled="isLoading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Single Season Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('confirmDeleteTitle')" 
      :message="getDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSeason"
      @close="closeDeleteModal"
      :loading="isDeletingLoading"
      action="INFO"
    />

    <!-- Delete Multiple Seasons Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteMultipleModal" 
      v-model="showDeleteMultipleModal" 
      :title="t('confirmDeleteTitle')" 
      :message="getDeleteMultipleMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteMultipleSeasons"
      @close="closeDeleteMultipleModal"
      :loading="isDeletingMultipleLoading"
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
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { getSeasons, postSeason, updateSeasonById, deleteSeasonById } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingSeason = ref(null)
const selectedSeasons = ref([])
const isLoading = ref(false)
const loading = ref(false)

// Delete modals states
const showDeleteModal = ref(false)
const showDeleteMultipleModal = ref(false)
const seasonToDelete = ref(null)
const isDeletingLoading = ref(false)
const isDeletingMultipleLoading = ref(false)

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
const columns = ref([
  {
    key: 'shortCode',
    label: t('shortCode'),
    sortable: true,
    searchable: true
  },
  {
    key: 'seasonName',
    label: t('seasonName'),
    sortable: true
  },
  {
    key: 'periodInfo',
    label: t('periodInfo'),
    sortable: false,
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

const seasons = ref([])

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

const editSeason = (season) => {
  editingSeason.value = season
  console.log('data', season)
  formData.value = {
    shortCode: season.shortCode,
    seasonName: season.seasonName,
    fromDay: season.fromDay,
    fromMonth: season.fromMonth,
    toDay: season.toDay,
    toMonth: season.toMonth,
    startDate: season.startDate,
    expireDate: season.expireDate,
    status: season.status || 'active'
  }
  showEditModal.value = true
}

// Single season deletion
const handleDeleteSeason = (season) => {
  seasonToDelete.value = season
  showDeleteModal.value = true
}

const confirmDeleteSeason = async () => {
  if (!seasonToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteSeasonById(seasonToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      // Mettre à jour la liste localement
      const index = seasons.value.findIndex(s => s.id === seasonToDelete.value.id)
      if (index !== -1) {
        seasons.value.splice(index, 1)
      }
      toast.success(t('seasonDeletedSuccessfully'))
    } else {
      throw new Error('Failed to delete season')
    }
  } catch (error) {
    console.error('Error deleting season:', error)
    toast.error(t('errorDeletingSeason'))
  } finally {
    isDeletingLoading.value = false
    closeDeleteModal()
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  seasonToDelete.value = null
}

// Multiple seasons deletion
const deleteSelected = () => {
  if (selectedSeasons.value.length === 0) return
  showDeleteMultipleModal.value = true
}

const confirmDeleteMultipleSeasons = async () => {
  if (selectedSeasons.value.length === 0) return

  isDeletingMultipleLoading.value = true
  try {
    const deletePromises = selectedSeasons.value.map(season => deleteSeasonById(season.id))
    await Promise.all(deletePromises)
    
    // Mettre à jour la liste localement
    selectedSeasons.value.forEach(season => {
      const index = seasons.value.findIndex(s => s.id === season.id)
      if (index !== -1) {
        seasons.value.splice(index, 1)
      }
    })
    
    const count = selectedSeasons.value.length
    selectedSeasons.value = []
    toast.success(t('seasonsDeletedSuccess', { count }))
  } catch (error) {
    console.error('Error deleting seasons:', error)
    toast.error(t('errorDeletingSelectedSeasons'))
  } finally {
    isDeletingMultipleLoading.value = false
    closeDeleteMultipleModal()
  }
}

const closeDeleteMultipleModal = () => {
  showDeleteMultipleModal.value = false
}

// Messages for modals
const getDeleteMessage = () => {
  if (!seasonToDelete.value) return ''
  return t('confirmDeleteSeason', { name: seasonToDelete.value.seasonName || seasonToDelete.value.shortCode })
}

const getDeleteMultipleMessage = () => {
  const count = selectedSeasons.value.length
  return t('confirmDeleteSelectedSeasons', { count })
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
    editSeason(item)
  } else if (action === 'delete') {
    handleDeleteSeason(item)
  }
}

const onSelectionChange = (selection) => {
  selectedSeasons.value = selection
}

const saveSeason = async () => {
  try {
    isLoading.value = true
    
    if (showAddModal.value) {
      // Add new season
      const newSeason = {
        shortCode: formData.value.shortCode,
        seasonName: formData.value.seasonName,
        fromDay: formData.value.fromDay,
        fromMonth: formData.value.fromMonth,
        toDay: formData.value.toDay,
        toMonth: formData.value.toMonth,
        startDate: formData.value.startDate,
        expireDate: formData.value.expireDate,
        status: formData.value.status,
        hotelId: serviceStore.serviceId
      }
      const resp = await postSeason(newSeason)
      console.log(resp)
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('seasonAddedSuccessfully'))
        loadData()
      } else {
        toast.error(t('somethingWentWrong'))
      }
      seasons.value.push(newSeason)
    } else if (editingSeason.value) {
      // Update existing season
      const updatedSeason = {
        shortCode: formData.value.shortCode,
        seasonName: formData.value.seasonName,
        fromDay: formData.value.fromDay,
        fromMonth: formData.value.fromMonth,
        toDay: formData.value.toDay,
        toMonth: formData.value.toMonth,
        startDate: formData.value.startDate,
        expireDate: formData.value.expireDate,
        status: formData.value.status,
        hotelId: serviceStore.serviceId
      }
      
      const resp = await updateSeasonById(editingSeason.value.id, updatedSeason)
      
      if (resp.status === 200 || resp.status === 201) {
        // Mettre à jour localement l'élément modifié
        const index = seasons.value.findIndex(s => s.id === editingSeason.value.id)
        if (index !== -1) {
          seasons.value[index] = {
            ...seasons.value[index],
            ...updatedSeason,
            shortCode: updatedSeason.shortCode,
            seasonName: updatedSeason.seasonName
          }
        }
        toast.success(t('seasonUpdatedSuccessfully'))
      } else {
        throw new Error('Failed to update season')
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error saving season:', error)
    toast.error(t('errorSavingSeason'))
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
    console.log('response data', response)
    if (response.status === 200) {
      seasons.value = response.data.data.data.map((item) => {
        return {
          ...item,
        }
      })
    } else {
      toast.error(t('failedToLoadSeasons'))
    }
  } catch (error) {
    console.error('Error loading seasons:', error)
    toast.error(t('errorLoadingSeasons'))
  } finally {
    loading.value = false
  }
}

loadData()
</script>