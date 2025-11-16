<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        :title="$t('configuration.ip_configuration.table_title')"
        :columns="columns"
        :data="ipConfigs"
        :actions="actions"
        :loading="loading"
        @action="onAction"
        :selectable="false"
        :search-placeholder="$t('configuration.ip_configuration.search_placeholder')"
        :empty-title="$t('configuration.ip_configuration.empty_title')"
        :empty-description="$t('configuration.ip_configuration.empty_description')"
        :meta="paginationMeta"
        @page-change="handlePageChange"
      >
        <template v-slot:header-actions>
          <BasicButton
            variant="primary"
            @click="openAddModal"
            :icon="Plus"
            :label="$t('configuration.ip_configuration.add_ip_configuration')"
          />
        </template>

        <!-- Created Info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.createdBy?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Modified Info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.updatedBy?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ isEditing ? $t('configuration.ip_configuration.edit_ip_configuration') :
            $t('configuration.ip_configuration.add_ip_configuration') }}
          </h3>

          <form @submit.prevent="saveIpConfiguration">
            <div class="mb-4">
              <div class="mb-2">
                <Input
                  v-model="formData.ipAddress"
                  :lb="$t('configuration.ip_configuration.ip_address')"
                  inputType="text"
                  :isRequired="true"
                  :placeholder="$t('configuration.ip_configuration.ip_placeholder')"
                />
              </div>

              <!-- IP Request From (disabled, auto-filled with current browser IP) -->
              <div class="mb-2">
                <Input
                  v-model="formData.requestFrom"
                  :lb="$t('configuration.ip_configuration.ip_request_from')"
                  inputType="text"
                  :isRequired="true"
                  :placeholder="$t('configuration.ip_configuration.ip_request_from_placeholder')"
                  :disabled="true"
                />
              </div>

              <Input
                v-model="formData.description"
                :lb="$t('configuration.ip_configuration.description')"
                inputType="text"
                :isRequired="true"
                :placeholder="$t('configuration.ip_configuration.description_placeholder')"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')" :disabled="saving" />
              <BasicButton
                type="submit"
                variant="primary"
                :label="isEditing ? $t('configuration.ip_configuration.update_ip_configuration') : $t('configuration.ip_configuration.save_ip_configuration')"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <ConfirmationModal
      v-model:show="showDeleteModal"
      :title="t('configuration.ip_configuration.delete_title')"
      :message="t('configuration.ip_configuration.delete_confirm', { name: deleteItem?.description || deleteItem?.ipAddress })"
      :confirm-text="$t('Confirm')"
      :cancel-text="$t('Cancel')"
      variant="danger"
      :loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="showDeleteModal=false"
    />
  </ConfigurationLayout>
  </template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import type { Action, Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import { Edit, Trash2 } from 'lucide-vue-next'
import {
  getIpConfigurations,
  postIpConfiguration,
  updateIpConfigurationById,
  deleteIpConfigurationById
} from '@/services/configrationApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)
const isDeleting = ref(false)
const showDeleteModal = ref(false)
const deleteItem = ref<any>(null)
const paginationMeta = ref<any>(null)

const columns = computed<Column[]>(() => [
  { key: 'ipAddress', label: t('configuration.ip_configuration.ip_address'), type: 'text' },
  { key: 'description', label: t('configuration.ip_configuration.description'), type: 'text' },
  { key: 'createdInfo', label: t('configuration.ip_configuration.created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.ip_configuration.modified_by'), type: 'custom' },
])

const actions = computed<Action[]>(() => [
  { label: t('edit'), handler: (item: any) => editIpConfiguration(item), variant: 'primary', icon: Edit },
  { label: t('delete'), handler: (item: any) => deleteIpConfiguration(item), variant: 'danger', icon: Trash2 }
])

const formData = ref({
  id: '',
  ipAddress: '',
  requestFrom: '',
  description: ''
})

const ipConfigs = ref<any[]>([])

const fetchIpConfigurations = async (pageNumber = 1) => {
  try {
    loading.value = true
    const response = await getIpConfigurations({ page: pageNumber, limit: 10 })
    const raw = response.data?.data?.data || response.data?.data || []
    // Normalize data to use `description` even if API still returns `label`
    ipConfigs.value = (raw || []).map((item: any) => ({
      ...item,
      description: item?.description ?? item?.label ?? '',
    }))
    paginationMeta.value = response.data?.data?.meta || null
  } catch (error) {
    console.error('Error fetching IP configurations:', error)
    toast.error(t('configuration.ip_configuration.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = async () => {
  isEditing.value = false
  formData.value = { id: '', ipAddress: '', requestFrom: '', description: '' }
  await resolveClientIp()
  showModal.value = true
}

const editIpConfiguration = async (item: any) => {
  isEditing.value = true
  formData.value = {
    id: `${item.id}` || '',
    ipAddress: item.ipAddress || '',
    requestFrom: item.requestFrom || '',
    description: item.description || item.label || ''
  }
  if (!formData.value.requestFrom) {
    await resolveClientIp()
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveIpConfiguration = async () => {
  try {
    saving.value = true
    const payload = {
      hotelId: serviceStore.serviceId,
      ipAddress: formData.value.ipAddress,
      ipRequestFrom: formData.value.requestFrom,
      description: formData.value.description
    }

    if (isEditing.value && formData.value.id) {
      await updateIpConfigurationById(parseInt(`${formData.value.id}`), payload)
      toast.success(t('configuration.ip_configuration.update_success'))
    } else {
      await postIpConfiguration(payload)
      toast.success(t('configuration.ip_configuration.create_success'))
    }
    closeModal()
    await fetchIpConfigurations(1)
  } catch (error) {
    console.error('Error saving IP configuration:', error)
    toast.error(t('configuration.ip_configuration.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteIpConfiguration = async (item: any) => {
  deleteItem.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    isDeleting.value = true
    await deleteIpConfigurationById(Number(deleteItem.value.id))
    deleteItem.value = null
    showDeleteModal.value = false
    toast.success(t('configuration.ip_configuration.delete_success'))
    await fetchIpConfigurations(1)
  } catch (error) {
    console.error('Error deleting IP configuration:', error)
    toast.error(t('configuration.ip_configuration.delete_error'))
  } finally {
    isDeleting.value = false
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editIpConfiguration(item)
  } else if (action === 'delete') {
    deleteIpConfiguration(item)
  }
}

const handlePageChange = (page: number) => {
  fetchIpConfigurations(page)
}

onMounted(() => {
  fetchIpConfigurations(1)
})

// Resolve current client IP (public) via ipify and set requestFrom
const resolveClientIp = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    formData.value.requestFrom = data?.ip || ''
  } catch (e) {
    formData.value.requestFrom = ''
  }
}
</script>