<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Reasons Table using ReusableTable -->
      <ReusableTable 
        :title="$t('configuration.reason.title')" 
        :columns="columns" 
        :data="reasons" 
        :actions="actions"
        :loading="loading"
        search-placeholder="Search reasons..." 
        :selectable="true"
        empty-state-title="No reasons found"
        empty-state-message="Click 'Add Reason' to create your first reason." 
        @action="onAction"
        @selection-change="onSelectionChange">
        
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            :icon="PlusIcon" 
            :label="$t('configuration.reason.add_reason')"
            @click="openAddModal" 
            :disabled="loading" 
          />

          <!-- Bouton de suppression multiple - aligné avec la première vue -->
          <BasicButton 
            v-if="selectedReasons.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="$t('deleteSelected')"
            :icon="Trash2"
            :disabled="loading"
          />
        </template>

        <template #column-status="{ item }">
          <span 
            :class="{
              'bg-green-100 text-green-800': item.status === 'active',
              'bg-red-100 text-red-800': item.status === 'inactive'
            }" 
            class="px-2 py-1 text-xs font-medium rounded-full">
            {{ item.status === 'active' ? $t('configuration.reason.status_active') : $t('configuration.reason.status_inactive') }}
          </span>
        </template>

        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.creator?.firstName || 'N/A' }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifier?.firstName || 'N/A' }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Reason Modal -->
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? $t('configuration.reason.edit_reason') : $t('configuration.reason.add_new_reason') }}
          </h3>

          <form @submit.prevent="saveReason" class="space-y-4">
            <!-- Reason Name -->
            <div>
              <Input
                :lb="$t('configuration.reason.reason_name')"
                v-model="formData.reasonName"
                :placeholder="$t('configuration.reason.reason_name_placeholder')"
                :is-required="true"
                customClass="w-full"
              />
            </div>

            <!-- Category -->
            <div>
              <Select
                :lb="$t('configuration.reason.category')"
                :modelValue="formData.category"
                @update:modelValue="handleCategoryChange"
                :options="categoryOptions"
                :placeholder="$t('configuration.reason.select_category')"
                :is-required="true"
                customClass="w-full"
              />
            </div>

            <!-- Status -->
            <div>
              <Select
                :lb="$t('configuration.reason.status')"
                :modelValue="formData.status"
                @update:modelValue="handleStatusChange"
                :options="statusOptions"
                :placeholder="$t('configuration.reason.select_status')"
                :is-required="true"
                customClass="w-full"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                type="button" 
                variant="outline" 
                :label="$t('cancel')" 
                @click="closeModal" 
                :disabled="saving" 
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :icon="showEditModal ? Edit : Plus"
                :label="saving ? t('saving') + '...' : showEditModal ? $t('update') : $t('configuration.reason.save_reason')" 
                :loading="saving"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Single Confirmation Modal -->
      <ModalConfirmation 
        v-if="showDeleteModal" 
        v-model="showDeleteModal" 
        :title="$t('Delete Reason')" 
        :message="getSingleDeleteMessage()"
        :loading="isDeletingLoading" 
        :confirm-text="$t('delete')" 
        :cancel-text="$t('cancel')" 
        @confirm="confirmDeleteSingleReason"
        @close="closeSingleDeleteModal"
        action="DANGER"
      />

      <!-- Bulk Delete Confirmation Modal -->
      <ModalConfirmation 
        v-if="showBulkDeleteModal" 
        v-model="showBulkDeleteModal" 
        :title="$t('Delete Selected Reasons')" 
        :message="getBulkDeleteMessage()"
        :loading="isBulkDeletingLoading" 
        :confirm-text="$t('deleteSelected')" 
        :cancel-text="$t('cancel')" 
        @confirm="confirmBulkDeleteReasons"
        @close="closeBulkDeleteModal"
        action="DANGER"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { Plus, Trash2, Edit } from 'lucide-vue-next'
import {
  getReasons,
  postReason,
  updateReasonById,
  deleteReasonById
} from '@/services/configrationApi'

// Types
interface Reason {
  id: string | number
  reasonName: string
  category: string
  status: string
  creator?: { firstName: string }
  modifier?: { firstName: string }
  createdAt: string
  updatedAt: string
}

interface ReasonFormData {
  reasonName: string
  category: string
  status: string
}

interface Option {
  value: string
  label: string
}

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data - aligné avec la première vue
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedReasons = ref<Reason[]>([])
const editingReason = ref<Reason | null>(null)
const loading = ref(false)
const saving = ref(false)

// Delete related reactive data - aligné avec la première vue
const reasonToDelete = ref<Reason | null>(null)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = ref<ReasonFormData>({
  reasonName: '',
  category: '',
  status: 'active'
})

const reasons = ref<Reason[]>([])

// Category options
const categoryOptions: Option[] = [
  { label: 'Block Room', value: 'Block Room' },
  { label: 'Cancel Reservation', value: 'Cancel Reservation' },
  { label: 'Check In', value: 'Check In' },
  { label: 'Check Out', value: 'Check Out' },
  { label: 'Folio Transaction', value: 'Folio Transaction' },
  { label: 'Guest Folio', value: 'Guest Folio' },
  { label: 'House Keeping', value: 'House Keeping' },
  { label: 'No Show Reservation', value: 'No Show Reservation' },
  { label: 'Package', value: 'Package' },
  { label: 'Promotion', value: 'Promotion' },
  { label: 'Reservation', value: 'Reservation' },
  { label: 'Stop Room Move', value: 'Stop Room Move' },
  { label: 'Void Checkin', value: 'Void Checkin' },
  { label: 'Void Reservation', value: 'Void Reservation' }
]

// Status options
const statusOptions: Option[] = [
  { label: t('configuration.reason.status_active'), value: 'active' },
  { label: t('configuration.reason.status_inactive'), value: 'inactive' }
]

// Computed properties - aligné avec la première vue
const selectedCount = computed(() => selectedReasons.value.length)

// Table configuration - aligné avec la première vue
const columns = ref([
  {
    key: 'reasonName',
    label: 'configuration.reason.reason_name',
    sortable: true,
    searchable: true
  },
  {
    key: 'category',
    label: 'configuration.reason.category',
    sortable: true,
    searchable: true
  },
  {
    key: 'createdInfo',
    label: 'configuration.reason.created_by',
    sortable: false,
    type: 'custom' as const
  },
  {
    key: 'modifiedInfo',
    label: 'configuration.reason.modified_by',
    sortable: false,
    type: 'custom' as const
  },
  {
    key: 'status',
    label: 'configuration.reason.status',
    sortable: true,
    type: 'custom' as const
  }
])

const actions = ref([
  {
    label: t('edit'),
    icon: Edit,
    variant: 'primary',
    handler: (item: Reason) => onAction('edit', item)
  },
  {
    label: t('delete'),
    icon: Trash2,
    variant: 'danger',
    handler: (item: Reason) => onAction('delete', item)
  }
])

// Handler functions for Select components - aligné avec la première vue
const handleCategoryChange = (value: string | undefined) => {
  formData.value.category = value || ''
}

const handleStatusChange = (value: string | undefined) => {
  formData.value.status = value || 'active'
}

// Selection and actions - aligné avec la première vue
const onSelectionChange = (selected: Reason[]) => {
  selectedReasons.value = selected
}

const onAction = (action: string, item: Reason) => {
  if (action === 'edit') {
    editReason(item)
  } else if (action === 'delete') {
    handleDeleteReason(item)
  }
}

const editReason = (reason: Reason) => {
  editingReason.value = reason
  formData.value = {
    reasonName: reason.reasonName,
    category: reason.category,
    status: reason.status
  }
  showEditModal.value = true
}

const openAddModal = () => {
  showAddModal.value = true
}

// Single item delete - aligné avec la première vue
const handleDeleteReason = (reason: Reason) => {
  reasonToDelete.value = reason
  showDeleteModal.value = true
}

// Bulk delete methods - COMPLÈTEMENT ALIGNÉ avec la première vue
const confirmDeleteSingleReason = async () => {
  if (!reasonToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteReasonById(reasonToDelete.value.id as number)
    if (response.status === 200 || response.status === 204) {
      const index = reasons.value.findIndex(r => r.id === reasonToDelete.value?.id)
      if (index !== -1) {
        reasons.value.splice(index, 1)
      }
      toast.success(t('configuration.reason.delete_success'))
    } else {
      throw new Error('Failed to delete reason')
    }
  } catch (error) {
    console.error('Error deleting reason:', error)
    toast.error(t('configuration.reason.delete_error'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const confirmBulkDeleteReasons = async () => {
  if (selectedReasons.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedReasons.value.map(reason => 
      deleteReasonById(reason.id as number)
    )
    await Promise.all(deletePromises)
    
    const selectedIds = selectedReasons.value.map(r => r.id)
    reasons.value = reasons.value.filter(r => !selectedIds.includes(r.id))
    
    const count = selectedReasons.value.length
    selectedReasons.value = []
    toast.success(t('configuration.reason.bulk_delete_success', { count }))
  } catch (error) {
    console.error('Error deleting reasons:', error)
    toast.error(t('configuration.reason.bulk_delete_error'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

// Close methods - aligné avec la première vue
const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  reasonToDelete.value = null
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Message methods - aligné avec la première vue
const getSingleDeleteMessage = () => {
  if (!reasonToDelete.value) return ''
  const reasonName = reasonToDelete.value.reasonName
  return `Are you sure you want to delete reason "${reasonName}"? This action cannot be undone.`
}

const getBulkDeleteMessage = () => {
  const count = selectedReasons.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const reasonName = selectedReasons.value[0].reasonName
    return `Are you sure you want to delete the selected reason "${reasonName}"? This action cannot be undone.`
  } else {
    return `Are you sure you want to delete ${count} selected reasons? This action cannot be undone.`
  }
}

// Date formatting utility
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const saveReason = async () => {
  // Validation
  if (!formData.value.reasonName || !formData.value.category || !formData.value.status) {
    toast.error(t('pleaseCompleteAllRequiredFields'))
    return
  }

  saving.value = true

  try {
    const reasonData = {
      reasonName: formData.value.reasonName,
      category: formData.value.category,
      status: formData.value.status,
      hotelId: serviceStore.serviceId
    }

    if (showEditModal.value && editingReason.value) {
      const resp = await updateReasonById(Number(editingReason.value.id), reasonData)
      if (resp.status === 200 || resp.status === 201) {
        const index = reasons.value.findIndex(r => r.id === editingReason.value?.id)
        if (index !== -1) {
          reasons.value[index] = {
            ...reasons.value[index],
            reasonName: formData.value.reasonName,
            category: formData.value.category,
            status: formData.value.status
          }
        }
        toast.success(t('configuration.reason.update_success'))
        closeModal()
      } else {
        throw new Error(resp.data?.message || t('somethingWentWrong'))
      }
    } else {
      const resp = await postReason(reasonData)
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('configuration.reason.create_success'))
        await fetchReasons()
        closeModal()
      } else {
        throw new Error(resp.data?.message || t('somethingWentWrong'))
      }
    }
  } catch (error: any) {
    console.error('Error saving reason:', error)
    const errorMessage = error.response?.data?.message || error.message || t('configuration.reason.save_error')
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

const fetchReasons = async () => {
  loading.value = true
  try {
    const response = await getReasons()
    reasons.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching reasons:', error)
    toast.error(t('configuration.reason.fetch_error'))
    reasons.value = []
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingReason.value = null
  formData.value = {
    reasonName: '',
    category: '',
    status: 'active'
  }
}

// Initialize data
onMounted(() => {
  fetchReasons()
})
</script>