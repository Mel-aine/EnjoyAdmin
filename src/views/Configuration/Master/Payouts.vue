<template>
  <ConfigurationLayout>
    <div class="space-y-6">
      <!-- Table -->
      <ReusableTable
        :title="t('configuration.payout_reasons.table_title')"
        :columns="columns"
        :data="payoutReasons"
        :actions="actions"
        :search-placeholder="t('configuration.payout_reasons.search_placeholder')"
        :selectable="true"
        :loading="loading"
        :empty-state-title="t('configuration.payout_reasons.no_data_title')"
        :empty-state-message="t('configuration.payout_reasons.no_data_message')"
        @action="handleAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            @click="openAddModal"
            :icon="Plus"
            :label="t('configuration.payout_reasons.add_payout_reason')"
            :disabled="loading"
          />
          <!-- Bulk Delete Button (Visible when items are selected) -->
          <BasicButton 
            v-if="selectedReasons.length > 0" 
            @click="handleDeleteSelected" 
            :label="t('deleteSelected')" 
            :icon="Trash2"
            variant="danger"
            :disabled="loading"
          />
        </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {{ isEditing ? t('configuration.payout_reasons.edit_payout_reason') : t('configuration.payout_reasons.add_payout_reason') }}
        </h2>
        
        <form @submit.prevent="savePayout">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('configuration.payout_reasons.payout_reason_name') }}
              </label>
              <Input
                v-model="formData.reason"
                :placeholder="t('configuration.payout_reasons.payout_reason_placeholder')"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('configuration.payout_reasons.description') }}
              </label>
              <Input
                v-model="formData.description"
                :placeholder="t('configuration.payout_reasons.description_placeholder')"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('configuration.payout_reasons.category') }}
              </label>
              <Select
                v-model="formData.category"
                :options="categoryOptions"
                :placeholder="t('configuration.payout_reasons.category_placeholder')"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('configuration.payout_reasons.status') }}
              </label>
              <Select
                v-model="formData.status"
                :options="statusOptions"
                :placeholder="t('configuration.payout_reasons.select_status')"
                required
              />
            </div>
          </div>
          
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
              :label="isEditing ? t('configuration.payout_reasons.update_payout_reason') : t('configuration.payout_reasons.save_payout_reason')"
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
      :title="t('Delete Payout Reason')" 
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
      :title="t('Delete Selected Payout Reasons')" 
      :message="getBulkDeleteMessage()"
      :loading="isBulkDeletingLoading" 
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteReasons"
      @close="closeBulkDeleteModal"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import {
  getPayoutReasons,
  postPayoutReason,
  updatePayoutReasonById,
  deletePayoutReasonById
} from '@/services/configrationApi'

// Composables
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)
const saving = ref(false)
const payoutReasons = ref([])

// Selection & Delete State
const selectedReasons = ref([])
const reasonToDelete = ref(null)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = reactive({
  reason: '',
  description: '',
  category: '',
  status: 'active'
})

// Category options
const categoryOptions = computed(() => [
  { value: 'refund', label: t('configuration.payout_reasons.category_refund') },
  { value: 'compensation', label: t('configuration.payout_reasons.category_compensation') },
  { value: 'discount', label: t('configuration.payout_reasons.category_discount') },
  { value: 'adjustment', label: t('configuration.payout_reasons.category_adjustment') },
  { value: 'other', label: t('configuration.payout_reasons.category_other') }
])

// Status options
const statusOptions = computed(() => [
  { value: 'active', label: t('configuration.payout_reasons.status_active') },
  { value: 'inactive', label: t('configuration.payout_reasons.status_inactive') }
])

// Table columns
const columns = computed(() => [
  {
    key: 'reason',
    label: t('configuration.payout_reasons.payout_reason_name'),
    sortable: true,
    searchable: true,
    type: 'text'
  },
  {
    key: 'description',
    label: t('configuration.payout_reasons.description'),
    sortable: false,
    searchable: true,
    type: 'text'
  },
  {
    key: 'category',
    label: t('configuration.payout_reasons.category'),
    sortable: true,
    searchable: true,
    type: 'text'
  },
  {
    key: 'status',
    label: t('configuration.payout_reasons.status'),
    sortable: true,
    type: 'badge',
    badgeColors: {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'inactive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
  },
  {
    key: 'createdAt',
    label: t('common.created'),
    sortable: true,
    type: 'date'
  }
])

// Table actions
const actions = computed(() => [
  {
    label: t('common.edit'),
    handler: (item) => handleAction('edit', item),
    icon: Edit,
    variant: 'primary'
  },
  {
    label: t('common.delete'),
    handler: (item) => handleAction('delete', item),
    icon: Trash2,
    variant: 'danger'
  }
])

// --- Message methods (CORRIGÉ avec les bonnes propriétés) ---
const getSingleDeleteMessage = () => {
  if (!reasonToDelete.value) return ''
  const reasonName = reasonToDelete.value.reason // ✅ Utilise "reason" au lieu de "name"
  return t('configuration.payout_reasons.delete_confirm', { name: reasonName })
}

const getBulkDeleteMessage = () => {
  const count = selectedReasons.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const reasonName = selectedReasons.value[0].reason // ✅ Utilise "reason" au lieu de "name"
    return t('configuration.payout_reasons.delete_confirm', { name: reasonName })
  } else {
    return t('configuration.payout_reasons.bulk_delete_confirm', { count: count })
  }
}

// --- Handlers for Table and Modals ---
const onSelectionChange = (selected) => {
  selectedReasons.value = selected
}

// Single Delete Handlers
const handleDeleteReason = (reason) => {
  reasonToDelete.value = reason
  showDeleteModal.value = true
}

const confirmDeleteSingleReason = async () => {
  if (!reasonToDelete.value || !reasonToDelete.value.id) return

  isDeletingLoading.value = true
  try {
    await deletePayoutReasonById(reasonToDelete.value.id)
    await fetchPayoutReasons()
    toast.success(t('toast.deleteSuccess'))
  } catch (error) {
    console.error('Error deleting payout reason:', error)
    toast.error(t('toast.deleteError'))
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
      deletePayoutReasonById(reason.id)
    )
    await Promise.all(deletePromises)

    await fetchPayoutReasons()
    selectedReasons.value = []
    toast.success(t('configuration.payout_reasons.bulk_delete_success', { count: deletePromises.length }))
  } catch (error) {
    console.error('Error deleting payout reason(s):', error)
    toast.error(t('toast.deleteError'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// API Functions
const fetchPayoutReasons = async () => {
  loading.value = true
  try {
    const response = await getPayoutReasons(serviceStore.serviceId)
    payoutReasons.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching payout reasons:', error)
    toast.error(t('toast.fetchError'))
  } finally {
    loading.value = false
  }
}

const savePayout = async () => {
  saving.value = true
  try {
    const payload = {
      ...formData,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value) {
      await updatePayoutReasonById(editingId.value, payload)
      toast.success(t('toast.updateSuccess'))
    } else {
      await postPayoutReason(payload)
      toast.success(t('toast.createSuccess'))
    }
    closeModal() // ✅ Corrigé: "closeModal" au lieu de "loseModal"
    await fetchPayoutReasons()
  } catch (error) {
    console.error('Error saving payout reason:', error)
    toast.error(t('toast.saveError'))
  } finally {
    saving.value = false
  }
}

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  editingId.value = item.id
  formData.reason = item.reason
  formData.description = item.description
  formData.category = item.category
  formData.status = item.status
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.reason = ''
  formData.description = ''
  formData.category = ''
  formData.status = 'active'
}

// Handle table actions
const handleAction = (action, item) => {
  switch (action) {
    case 'edit':
      openEditModal(item)
      break
    case 'delete':
      handleDeleteReason(item) // ✅ Utilise la nouvelle méthode avec modale
      break
  }
}

// Initialize data
onMounted(() => {
  fetchPayoutReasons()
})
</script>