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
      >
        <template #header-actions>
          <BasicButton
            variant="primary"
            :icon="Plus"
            :label="t('configuration.blacklist_reason.add_blacklist_reason')"
            @click="openAddModal"
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
                variant="secondary"
                @click="closeModal"
                type="button"
                :label="t('configuration.blacklist_reason.cancel')"
              />
              <BasicButton
                variant="primary"
                type="submit"
                :icon="Save"
                :label="isEditing ? t('configuration.blacklist_reason.update_blacklist_reason') : t('configuration.blacklist_reason.save_blacklist_reason')"
                :loading="saving"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'

import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { useServiceStore } from '@/composables/serviceStore'
import {
  getBlackListReasonsByHotel,
  postBlackListReason,
  updateBlackListReasonById,
  deleteBlackListReasonById
} from '@/services/configrationApi'
import { Save } from 'lucide-vue-next'
import type { Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'

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

const actions = computed(() => [
  {
    label: t('configuration.blacklist_reason.edit'),
    variant: 'primary',
    handler:(item:any)=>editBlacklistReason(item)
  },
  {
    label: t('configuration.blacklist_reason.delete'),
    variant: 'danger',
    handler:(item:any)=>deleteBlacklistReason(item)
  }
])



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

const deleteBlacklistReason = async (id: number) => {
  try {
    await deleteBlackListReasonById(id)
    toast.success(t('configuration.blacklist_reason.delete_success'))
    await fetchBlacklistReasons()
  } catch (error) {
    console.error('Error deleting blacklist reason:', error)
    toast.error(t('configuration.blacklist_reason.delete_error'))
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editBlacklistReason(item)
  } else if (action === 'delete') {
    if (confirm(t('configuration.blacklist_reason.delete_confirmation'))) {
      deleteBlacklistReason(item.id)
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchBlacklistReasons()
})
</script>
