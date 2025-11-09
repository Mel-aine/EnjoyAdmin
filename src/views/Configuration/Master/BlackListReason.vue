<template>
  <ConfigurationLayout>
    <div class="p-6">

      <ReusableTable
        :title="t('configuration.blacklist_reason.table_title')"
        :columns="columns"
        :data="blacklistReasons"
        :actions="actions"
        :search-placeholder="t('configuration.blacklist_reason.search_placeholder')"
        :selectable="false"
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
              <div class="text-sm text-gray-900">{{ item.createdByUser?.fullName }}</div>
              <div class="text-xs text-gray-400">{{ formatDateT(item.createdAt) }}</div>
            </div>
          </template>

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900">{{ item.updatedByUser?.fullName }}</div>
              <div class="text-xs text-gray-400">{{formatDateT( item.updatedAt) }}</div>
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
            {{ $t(`${item.severity}`) }}
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
              :lb="$t('configuration.blacklist_reason.ReasonName')"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.reason"
              :placeholder="$t('Enter blacklist reason name')"
            />

            <Select
               :lb="$t('configuration.blacklist_reason.Category')"
               :isRequired="true"
               v-model="formData.category"
               :options="categoryOptions"
               :defaultValue="$t('Select category')"
             />

             <Select
               :lb="$t('configuration.blacklist_reason.Severity')"
               :isRequired="true"
               v-model="formData.severity"
               :options="severityOptions"
               :defaultValue="$t('Select severity level')"
             />

            <Input
              :lb="$t('Description')"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="$t('Enter description (optional)')"
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
                :label="isEditing ? t('update') : t('save')"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>
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
import { useServiceStore } from '@/composables/serviceStore'
import {
  getBlackListReasonsByHotel,
  postBlackListReason,
  updateBlackListReasonById,
  deleteBlackListReasonById
} from '@/services/configrationApi'
import type { Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

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
  { value: 'Behavior', label: t('Behavior' )},
  { value: 'Payment', label: t('Payment') },
  { value: 'Damage', label: t('Damage') },
  { value: 'Fraud', label: t('Fraud') },
  { value: 'Other', label: t('Other') }
])

const severityOptions = ref([
  { value: 'Low', label: t('Low') },
  { value: 'Medium', label: t('Medium') },
  { value: 'High', label: t('High') }
])

// Computed properties
const columns = computed<Column[]>(() => [
  {
    key: 'reason',
    label: t('configuration.blacklist_reason.ReasonName'),
    sortable: true
  },
  {
    key: 'category',
    label: t('configuration.blacklist_reason.Category'),
    sortable: true
  },
  {
    key: 'severity',
    label: t('configuration.blacklist_reason.Severity'),
    sortable: true,
    type : 'custom'
  },
  {
    key: 'description' ,
    label: t('Description'),
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
      toast.success(t('configuration.blacklist_reason.create_success'))
    }

    closeModal()
    await fetchBlacklistReasons()
  } catch (error) {
    console.error('Error saving blacklist reason:', error)
    const errorMessage = isEditing.value
      ? t('toast.updateError')
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
