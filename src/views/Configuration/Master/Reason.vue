<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable :title="$t('configuration.reason.title')" :columns="columns" :data="reasons" :actions="actions"
        :search-placeholder="$t('configuration.reason.search_placeholder')" :selectable="false"
        :empty-state-title="$t('configuration.reason.empty_state_title')"
        :empty-state-message="$t('configuration.reason.empty_state_message')" :loading="loading" @action="onAction">
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            :icon="PlusIcon" 
            :label="$t('configuration.reason.add_reason')"
            @click="openAddModal" 
            :disabled="loading" 
          />
        </template>

        <template #column-status="{ item }">
          <span
            :class="item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ item.status === 'active' ? $t('configuration.reason.status_active') :
              $t('configuration.reason.status_inactive') }}
          </span>
        </template>
        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
          </div>
        </template>
        <template #status="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ $t('configuration.identity_type.status_' + item.status.toLowerCase()) }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? $t('configuration.reason.edit_reason') : $t('configuration.reason.add_new_reason') }}
          </h3>

          <form @submit.prevent="saveReason" class="space-y-4">
            <Input :lb="$t('configuration.reason.reason_name')" :inputType="'text'" :isRequired="true"
              v-model="formData.reasonName" :placeholder="$t('configuration.reason.reason_name_placeholder')" />

            <div>
              <Select :lb="$t('configuration.reason.category')" :isRequired="true" v-model="formData.category"
                :options="categoryOptions" :defaultValue="$t('configuration.reason.select_category')" />
            </div>

            <div>
              <Select :lb="$t('configuration.reason.status')" :isRequired="true" v-model="formData.status"
                :options="statusOptions" :defaultValue="$t('configuration.reason.select_status')" />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton
                type="button"
                variant="outline"
                @click="closeModal"
                :label="$t('cancel')"
                :disabled="saving"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :label="isEditing ? $t('configuration.reason.update_reason') : $t('configuration.reason.save_reason')"
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import type { Action, Column } from '../../../utils/models'
import PlusIcon from '../../../icons/Plus.vue'
import {
  getReasons,
  postReason,
  updateReasonById,
  deleteReasonById
} from '@/services/configrationApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)

const formData = ref({
  id: null as number | null,
  reasonName: '',
  category: '',
  status: 'active'
})

const reasons = ref<any[]>([])

// Category options
const categoryOptions = [
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

// Status options with translations
const statusOptions = computed(() => [
  { label: t('configuration.reason.status_active'), value: 'active' },
  { label: t('configuration.reason.status_inactive'), value: 'inactive' }
])

// Table configuration with translations
const columns = computed<Column[]>(() => [
  { key: 'reasonName', label: t('configuration.reason.reason_name'), type: 'text' },
  { key: 'category', label: t('configuration.reason.category'), type: 'text' },
  { key: 'createdinfo', label: t('configuration.reason.created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.reason.modified_by'), type: 'custom' },
  { key: 'status', label: t('configuration.reason.status'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  { label: t('edit'), handler: (item: any) => editReason(item), variant: 'primary' },
  { label: t('delete'), handler: (item: any) => deleteReason(item), variant: 'danger' }
])

// Fetch reasons from API
const fetchReasons = async () => {
  try {
    loading.value = true
    const response = await getReasons()
    reasons.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching reasons:', error)
    toast.error(t('configuration.reason.fetch_error'))
  } finally {
    loading.value = false
  }
}

// Functions
const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id: null,
    reasonName: '',
    category: '',
    status: 'active'
  }
  showModal.value = true
}

const editReason = (reason: any) => {
  isEditing.value = true
  formData.value = { ...reason }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveReason = async () => {
  try {
    saving.value = true

    const reasonData = {
      reasonName: formData.value.reasonName,
      category: formData.value.category,
      status: formData.value.status,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && formData.value.id) {
      // Update existing reason
      await updateReasonById(formData.value.id, reasonData)
      toast.success(t('configuration.reason.update_success'))
    } else {
      // Add new reason
      await postReason(reasonData)
      toast.success(t('configuration.reason.create_success'))
    }
    closeModal()

    await fetchReasons()
  } catch (error) {
    console.error('Error saving reason:', error)
    toast.error(t('configuration.reason.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteReason = async (reason: any) => {
  if (confirm(t('configuration.reason.delete_confirm'))) {
    try {
      loading.value = true
      await deleteReasonById(reason.id)
      toast.success(t('configuration.reason.delete_success'))
      await fetchReasons()
    } catch (error) {
      console.error('Error deleting reason:', error)
      toast.error(t('configuration.reason.delete_error'))
    } finally {
      loading.value = false
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editReason(item)
  } else if (action === 'delete') {
    deleteReason(item)
  }
}

// Load reasons on component mount
onMounted(() => {
  fetchReasons()
})
</script>
