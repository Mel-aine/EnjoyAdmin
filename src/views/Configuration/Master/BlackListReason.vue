<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('configuration.blacklist_reason.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('configuration.blacklist_reason.description') }}
        </p>
      </div>

      <ReusableTable
        :title="t('configuration.blacklist_reason.table_title')"
        :columns="columns"
        :data="blacklistReasons"
        :actions="actions"
        :search-placeholder="t('configuration.blacklist_reason.search_placeholder')"
        :selectable="true"
        :empty-state-title="t('configuration.blacklist_reason.empty_state_title')"
        :empty-state-message="t('configuration.blacklist_reason.empty_state_message')"
        :loading="loading"
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton
            variant="primary"
            :icon="Plus"
            :label="t('configuration.blacklist_reason.add_blacklist_reason')"
            @click="openAddModal"
            :disabled="loading"
          />
          <!-- Bulk Delete Button (Visible when items are selected) -->
          <BasicButton 
            v-if="selectedReasons.length > 0" 
            @click="handleDeleteSelected" 
            :label="$t('deleteSelected')" 
            :icon="Trash2"
            variant="danger"
            :disabled="loading"
          />
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

        <template #column-severity="{ item }">
          <span
            :class="{
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': item.severity === 'High',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': item.severity === 'Medium',
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': item.severity === 'Low'
            }"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.severity }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? t('configuration.blacklist_reason.edit_blacklist_reason') : t('configuration.blacklist_reason.add_new_blacklist_reason') }}
          </h3>

          <form @submit.prevent="saveBlacklistReason" class="space-y-4">
            <Input
              :lb="'Reason Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.reason"
              :placeholder="'Enter blacklist reason name'"
            />

            <Select
               :lb="'Category'"
               :isRequired="true"
               v-model="formData.category"
               :options="categoryOptions"
               :defaultValue="'Select category'"
             />

             <Select
               :lb="'Severity'"
               :isRequired="true"
               v-model="formData.severity"
               :options="severityOptions"
               :defaultValue="'Select severity level'"
             />

            <Input
              :lb="'Description'"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="'Enter description (optional)'"
            />

           <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal" 
                :label="t('cancel')" 
                :disabled="saving"
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :label="isEditing ? t('configuration.payment_method.update_payment_method') : t('configuration.payment_method.save_payment_method')"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Single Confirmation Modal -->
      <ModalConfirmation 
        v-if="showDeleteModal" 
        v-model="showDeleteModal" 
        :title="t('Delete Blacklist Reason')" 
        :message="getSingleDeleteMessage()"
        :loading="isDeletingLoading" 
        :confirm-text="t('delete')" 
        :cancel-text="t('cancel')" 
        @confirm="confirmDeleteSingleReason"
        @close="closeSingleDeleteModal"
        action="DANGER"
      />

      <!-- Bulk Delete Confirmation Modal -->
      <ModalConfirmation 
        v-if="showBulkDeleteModal" 
        v-model="showBulkDeleteModal" 
        :title="t('Delete Selected Blacklist Reasons')" 
        :message="getBulkDeleteMessage()"
        :loading="isBulkDeletingLoading" 
        :confirm-text="t('deleteSelected')" 
        :cancel-text="t('cancel')" 
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
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { useServiceStore } from '@/composables/serviceStore'
import {
  getBlackListReasonsByHotel,
  postBlackListReason,
  updateBlackListReasonById,
  deleteBlackListReasonById
} from '@/services/configrationApi'
import type { Column } from '../../../utils/models'
import { Plus, Trash2, Edit } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)
const saving = ref(false)
const blacklistReasons = ref([])

// Selection & Delete State
const selectedReasons = ref<any[]>([])
const reasonToDelete = ref<any | null>(null)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

const formData = ref({
  reason: '',
  category: '',
  severity: '',
  description: ''
})

// Options for select fields
const categoryOptions = ref([
  { value: 'Behavior', label: 'Behavior' },
  { value: 'Payment', label: 'Payment' },
  { value: 'Damage', label: 'Damage' },
  { value: 'Fraud', label: 'Fraud' },
  { value: 'Other', label: 'Other' }
])

const severityOptions = ref([
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' }
])

// Computed properties
const columns = computed<Column[]>(() => [
  {
    key: 'reason',
    label: 'Reason Name',
    sortable: true
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true
  },
  {
    key: 'severity',
    label: 'Severity',
    sortable: true
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true
  },
  {
    key: 'createdInfo',
    label: t('configuration.blacklist_reason.created_by'),
    sortable: false,
    type:"custom"
  },
  {
    key: 'modifiedInfo',
    label: t('configuration.blacklist_reason.modified_by'),
    sortable: false,
    type:"custom"
  },
])

// CORRECTION: Ajout des icônes dans les actions
const actions = computed(() => [
  {
    label: t('configuration.blacklist_reason.edit'),
    icon: Edit, // ✅ ICÔNE AJOUTÉE
    variant: 'primary',
    handler:(item:any)=>editBlacklistReason(item)
  },
  {
    label: t('configuration.blacklist_reason.delete'),
    icon: Trash2, // ✅ ICÔNE AJOUTÉE
    variant: 'danger',
    handler:(item:any)=>handleDeleteReason(item)
  }
])

// --- Logique de suppression avec modales ---
const getSingleDeleteMessage = () => {
  if (!reasonToDelete.value) return ''
  const reasonName = reasonToDelete.value.reason
  return t('configuration.blacklist_reason.delete_confirmation', { name: reasonName })
}

const getBulkDeleteMessage = () => {
  const count = selectedReasons.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const reasonName = selectedReasons.value[0].reason
    return t('configuration.blacklist_reason.delete_confirmation', { name: reasonName })
  } else {
    return t('configuration.blacklist_reason.bulk_delete_confirm', { count: count })
  }
}

const onSelectionChange = (selected: any[]) => {
  selectedReasons.value = selected
}

// Single Delete Handlers
const handleDeleteReason = (reason: any) => {
  reasonToDelete.value = reason
  showDeleteModal.value = true
}

const confirmDeleteSingleReason = async () => {
  if (!reasonToDelete.value || !reasonToDelete.value.id) return

  isDeletingLoading.value = true
  try {
    await deleteBlackListReasonById(reasonToDelete.value.id)
    await fetchBlacklistReasons()
    toast.success(t('configuration.blacklist_reason.delete_success'))
  } catch (error) {
    console.error('Error deleting blacklist reason:', error)
    toast.error(t('configuration.blacklist_reason.delete_error'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  reasonToDelete.value = null
}

// Bulk Delete Handlers
const handleDeleteSelected = () => {
  if (selectedReasons.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDeleteReasons = async () => {
  if (selectedReasons.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedReasons.value.map(reason =>
      deleteBlackListReasonById(reason.id)
    )
    await Promise.all(deletePromises)

    await fetchBlacklistReasons()
    selectedReasons.value = []
    toast.success(t('configuration.blacklist_reason.bulk_delete_success', { count: deletePromises.length }))
  } catch (error) {
    console.error('Error deleting blacklist reason(s):', error)
    toast.error(t('configuration.blacklist_reason.delete_error'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// API Functions
const fetchBlacklistReasons = async () => {
  try {
    loading.value = true
    const hotelId = serviceStore.serviceId
    const response = await getBlackListReasonsByHotel(hotelId!)
    blacklistReasons.value = response.data.data.data || []
  } catch (error) {
    console.error('Error fetching blacklist reasons:', error)
    toast.error(t('configuration.blacklist_reason.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  formData.value = {
    reason: '',
    category: '',
    severity: '',
    description: ''
  }
  isEditing.value = false
  editingId.value = null
  showModal.value = true
}

const editBlacklistReason = (reason: any) => {
  formData.value = {
    reason: reason.reason || '',
    category: reason.category || '',
    severity: reason.severity || '',
    description: reason.description || ''
  }
  isEditing.value = true
  editingId.value = reason.id
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    reason: '',
    category: '',
    severity: '',
    description: ''
  }
  isEditing.value = false
  editingId.value = null
  saving.value = false
}

const saveBlacklistReason = async () => {
  try {
    saving.value = true

    const payload = {
      reason: formData.value.reason,
      category: formData.value.category,
      severity: formData.value.severity,
      description: formData.value.description,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value) {
      await updateBlackListReasonById(editingId.value!, payload)
      toast.success(t('configuration.blacklist_reason.update_success'))
    } else {
      await postBlackListReason(payload)
      toast.success(t('configuration.blacklist_reason.save_success'))
    }

    closeModal()
    await fetchBlacklistReasons()
  } catch (error) {
    console.error('Error saving blacklist reason:', error)
    const errorMessage = isEditing.value
      ? t('configuration.blacklist_reason.update_error')
      : t('configuration.blacklist_reason.save_error')
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editBlacklistReason(item)
  } else if (action === 'delete') {
    handleDeleteReason(item)
  }
}

// Lifecycle
onMounted(() => {
  fetchBlacklistReasons()
})
</script>