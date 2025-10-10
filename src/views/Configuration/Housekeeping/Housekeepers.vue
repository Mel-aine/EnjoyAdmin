<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('housekeepers') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('housekeepers Description') }}
        </p>
      </div>

      <!-- Housekeepers Table using ReusableTable -->
      <ReusableTable
        :title="t('housekeepers List')"
        :columns="columns"
        :data="housekeepers"
        :actions="actions"
        :search-placeholder="t('search Housekeepers')"
        :selectable="true"
        :empty-state-title="t('noHousekeepers Found')"
        :empty-state-message="t('add Housekeeper Message')"
        @action="onAction"
        @selection-change="onSelectionChange"
        :loading="loading"
      >
        <template #header-actions>
          <BasicButton
            @click="showAddModal = true"
            :label="t('add Housekeeper')"
            :icon="Plus"
          />

          <BasicButton 
            v-if="selectedHousekeepers.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')"
            :icon="Trash2"
          />
        </template>

        <!-- Custom column for status -->
        <template #column-status="{ item }">
          <span
            :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              item.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ item.status }}
          </span>
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
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('editHousekeeper') : t('addHousekeeper') }}
          </h3>

          <form @submit.prevent="saveHousekeeper">
            <div class="mb-4">
              <Input
                v-model="formData.name"
                :lb="t('housekeeperName')"
                type="text"
                :placeholder="t('enterHousekeeperName')"
                :is-required="true"
              />
            </div>

            <div class="mb-4">
              <InputPhone
                v-model="formData.mobile"
                :lb="t('mobileNumber')"
                :title="t('mobileNumber')"
                :placeholder="t('enterMobileNumber')"
                :is-required="true"
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
                :label="isSaving ? t('saving') + '...' : showEditModal ? t('update') : t('save')"
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
      :title="t('Delete Housekeeper')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleHousekeeper"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('Delete Selected Housekeepers')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteHousekeepers"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import InputPhone from '../../../components/forms/FormElements/InputPhone.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import { useServiceStore } from '@/composables/serviceStore'
import {
  getHousekeepers,
  postHousekeeper,
  updateHousekeeperById,
  deleteHousekeeperById
} from '@/services/configrationApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedHousekeepers = ref<any[]>([])
const editingHousekeeper = ref<any>(null)
const loading = ref(false)
const isSaving = ref(false)

// Delete modals states
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const housekeeperToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = reactive({
  name: '',
  mobile: ''
})

// Computed properties
const selectedCount = computed(() => selectedHousekeepers.value.length)

// Table configuration
const columns: Column[] = [
  { 
    key: 'name', 
    label: t('housekeeperName'), 
    type: 'text',
    searchable: true
  },
  { 
    key: 'mobile', 
    label: t('mobileNumber'), 
    type: 'text',
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
  },
  { 
    key: 'status', 
    label: t('status'), 
    type: 'custom' 
  }
]

const actions: Action[] = [
  {
    label: t('edit'),
    handler: (item: any) => onAction('edit', item),
    icon: Edit,
    variant: 'primary'
  },
  {
    label: t('delete'),
    handler: (item: any) => onAction('delete', item),
    icon: Trash2,
    variant: 'danger'
  }
]

const housekeepers = ref<any[]>([])

// Methods
const onSelectionChange = (selected: any[]) => {
  selectedHousekeepers.value = selected
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editHousekeeper(item)
  } else if (action === 'delete') {
    handleDeleteHousekeeper(item)
  }
}

const fetchHousekeepers = async () => {
  try {
    loading.value = true
    const hotelId = serviceStore.serviceId
    const resp = await getHousekeepers({ hotel_id: hotelId as number })
    const data = resp?.data?.data?.data ?? resp?.data ?? []
    housekeepers.value = Array.isArray(data)
      ? data.map((h: any) => ({
          id: h.id,
          name: h.name,
          mobile: h.phone ?? h.mobile ?? '',
          createdBy: h.createdBy ?? h.createdByUserId ?? 'admin',
          createdDate: h.createdAt ? new Date(h.createdAt).toISOString().split('T')[0] : 'N/A',
          modifiedBy: h.modifiedBy ?? h.updatedByUserId ?? 'admin',
          modifiedDate: h.updatedAt ? new Date(h.updatedAt).toISOString().split('T')[0] : 'N/A',
          status: h.status ?? 'Active',
        }))
      : []
  } catch (e) {
    console.error('Failed to fetch housekeepers', e)
    toast.error(t('errorLoadingHousekeepers'))
  } finally {
    loading.value = false
  }
}

const editHousekeeper = (housekeeper: any) => {
  editingHousekeeper.value = housekeeper
  formData.name = housekeeper.name
  formData.mobile = housekeeper.mobile
  showEditModal.value = true
}

// Single housekeeper deletion
const handleDeleteHousekeeper = (housekeeper: any) => {
  housekeeperToDelete.value = housekeeper
  showDeleteModal.value = true
}

const confirmDeleteSingleHousekeeper = async () => {
  if (!housekeeperToDelete.value) return

  isDeletingLoading.value = true
  try {
    await deleteHousekeeperById(housekeeperToDelete.value.id)
    
    // Update local list
    const index = housekeepers.value.findIndex(h => h.id === housekeeperToDelete.value.id)
    if (index > -1) {
      housekeepers.value.splice(index, 1)
    }
    
    toast.success(t('housekeeperDeletedSuccessfully'))
  } catch (e) {
    console.error('Failed to delete housekeeper', e)
    toast.error(t('errorDeletingHousekeeper'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  housekeeperToDelete.value = null
}

// Multiple housekeepers deletion
const confirmBulkDeleteHousekeepers = async () => {
  if (selectedHousekeepers.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedHousekeepers.value.map(housekeeper => 
      deleteHousekeeperById(housekeeper.id)
    )
    
    await Promise.all(deletePromises)
    
    // Update local list
    const selectedIds = selectedHousekeepers.value.map(h => h.id)
    housekeepers.value = housekeepers.value.filter(h => !selectedIds.includes(h.id))
    
    const count = selectedHousekeepers.value.length
    selectedHousekeepers.value = []
    toast.success(t('housekeepersDeletedSuccess', { count }))
  } catch (e) {
    console.error('Failed to delete housekeepers', e)
    toast.error(t('errorDeletingSelectedHousekeepers'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Message methods
const getSingleDeleteMessage = () => {
  if (!housekeeperToDelete.value) return ''
  const housekeeperName = housekeeperToDelete.value.name
  return `Are you sure you want to delete housekeeper "${housekeeperName}"? `
}

const getBulkDeleteMessage = () => {
  const count = selectedHousekeepers.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const housekeeperName = selectedHousekeepers.value[0].name
    return `Are you sure you want to delete the selected housekeeper "${housekeeperName}"? `
  } else {
    return `Are you sure you want to delete ${count} selected housekeepers? `
  }
}

const saveHousekeeper = async () => {
  try {
    isSaving.value = true
    
    // Validation
    if (!formData.name.trim()) {
      toast.error(t('housekeeperNameRequired'))
      return
    }
    
    if (!formData.mobile.trim()) {
      toast.error(t('mobileNumberRequired'))
      return
    }

    const hotelId = serviceStore.serviceId as number
    const housekeeperData = {
      hotel_id: hotelId,
      name: formData.name.trim(),
      phone: formData.mobile.trim(),
    }

    if (showEditModal.value && editingHousekeeper.value) {
      await updateHousekeeperById(editingHousekeeper.value.id, housekeeperData)
      toast.success(t('housekeeperUpdatedSuccessfully'))
    } else {
      await postHousekeeper(housekeeperData)
      toast.success(t('housekeeperCreatedSuccessfully'))
    }
    
    closeModal()
    await fetchHousekeepers()
  } catch (e) {
    console.error('Failed to save housekeeper', e)
    toast.error(t('errorSavingHousekeeper'))
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingHousekeeper.value = null
  formData.name = ''
  formData.mobile = ''
}

onMounted(() => {
  fetchHousekeepers()
})
</script>