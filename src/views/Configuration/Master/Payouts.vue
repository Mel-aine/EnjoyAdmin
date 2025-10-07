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
        :selectable="false"
        :loading="loading"
        :empty-state-title="t('configuration.payout_reasons.no_data_title')"
        :empty-state-message="t('configuration.payout_reasons.no_data_message')"
        @action="handleAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            @click="openAddModal"
            :icon="Plus"
            :label="t('configuration.payout_reasons.add_payout_reason')"
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
    handler:(item)=> openEditModal(item),
    icon: Edit
  },
  {
    label: t('common.delete'),
    handler:(item)=> deletePayout(item),
    icon: Trash2,
    variant: 'danger'
  }
])

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
    loseModal()
    await fetchPayoutReasons()
  } catch (error) {
    console.error('Error saving payout reason:', error)
    toast.error(t('toast.saveError'))
  } finally {
    saving.value = false
  }
}

const deletePayout = async (item) => {
  if (confirm(t('common.deleteConfirmation', { name: item.name }))) {
    try {
      await deletePayoutReasonById(item.id)
      toast.success(t('toast.deleteSuccess'))
      await fetchPayoutReasons()
    } catch (error) {
      console.error('Error deleting payout reason:', error)
      toast.error(t('toast.deleteError'))
    }
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
      deletePayout(item)
      break
  }
}

// Initialize data
onMounted(() => {
  fetchPayoutReasons()
})
</script>
