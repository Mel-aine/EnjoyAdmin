<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('configuration.identity_type.title') }}</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          {{ $t('configuration.identity_type.description') }}
        </p>
        <ReusableTable :title="$t('configuration.identity_type.table_title')" :columns="columns" :data="identityTypes"
          :actions="actions" :loading="loading" @action="onAction"
          :selectable="true"
          :search-placeholder="$t('configuration.identity_type.search_placeholder')"
          :empty-title="$t('configuration.identity_type.empty_title')"
          :empty-description="$t('configuration.identity_type.empty_description')">
          <template v-slot:header-actions>
            <BasicButton variant="primary" @click="openAddModal" :icon="Plus"
              :label="$t('configuration.identity_type.add_identity_type')" :loading="loading" />
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
          <template #column-status="{ item }">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ $t('configuration.identity_type.status_' + item.status.toLowerCase()) }}
            </span>
          </template>
        </ReusableTable>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? $t('configuration.identity_type.edit_identity_type') :
              $t('configuration.identity_type.add_identity_type') }}
          </h3>

          <form @submit.prevent="saveIdentityType">
            <div class="mb-4">

              <div class="mb-2">
                <Input v-model="formData.shortCode" :lb="$t('shortCode')" inputType="text" :isRequired="true"
                  :placeholder="$t('shortCode')" />
              </div>

              <Input v-model="formData.name" :lb="$t('configuration.identity_type.identity_type_name')" inputType="text"
                :isRequired="true" :placeholder="$t('configuration.identity_type.name_placeholder')" />

            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                :disabled="saving" />
              <BasicButton type="submit" variant="primary" :icon="Save"
                :label="isEditing ? $t('configuration.identity_type.update_identity_type') : $t('configuration.identity_type.save_identity_type')"
                :loading="saving" />
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
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import type { Action, Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import {
  getIdentityTypes,
  postIdentityType,
  updateIdentityTypeById,
  deleteIdentityTypeById
} from '@/services/configrationApi'
import { Save } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)

const columns = computed<Column[]>(() => [
  { key: 'name', label: t('configuration.identity_type.identity_type_name'), type: 'text' },
  { key: 'createdInfo', label: t('configuration.identity_type.created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.identity_type.modified_by'), type: 'custom' },
  { key: 'shortCode', label: t('shortCode'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  { label: t('edit'), handler: (item: any) => editIdentityType(item), variant: 'primary' },
  { label: t('delete'), handler: (item: any) => deleteIdentityType(item), variant: 'danger' }
])

const formData = ref({
  id:'',
  shortCode: "",
  name: ''
})

const identityTypes = ref<any[]>([])

// Fetch identity types from API
const fetchIdentityTypes = async () => {
  try {
    loading.value = true
    const response = await getIdentityTypes()
    identityTypes.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching identity types:', error)
    toast.error(t('configuration.identity_type.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id:"",
    shortCode: "",
    name: ''
  }
  showModal.value = true
}

const editIdentityType = (identityType: any) => {
  isEditing.value = true
  formData.value = { ...identityType }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveIdentityType = async () => {
  try {
    saving.value = true

    const identityTypeData = {
      reason: formData.value.name,
      shortCode: formData.value.shortCode,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && formData.value.id) {
      // Update existing identity type
      await updateIdentityTypeById(parseInt(`${formData.value.id}`), identityTypeData)
      toast.success(t('configuration.identity_type.update_success'))
    } else {
      // Add new identity type
      await postIdentityType(identityTypeData)
      toast.success(t('configuration.identity_type.create_success'))
    }
    closeModal()

    await fetchIdentityTypes()
  } catch (error) {
    console.error('Error saving identity type:', error)
    toast.error(t('configuration.identity_type.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteIdentityType = async (identityType: any) => {
  if (confirm(t('configuration.identity_type.delete_confirm'))) {
    try {
      loading.value = true
      await deleteIdentityTypeById(identityType.id)
      toast.success(t('configuration.identity_type.delete_success'))
      await fetchIdentityTypes()
    } catch (error) {
      console.error('Error deleting identity type:', error)
      toast.error(t('configuration.identity_type.delete_error'))
    } finally {
      loading.value = false
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editIdentityType(item)
  } else if (action === 'delete') {
    deleteIdentityType(item)
  }
}

// Load identity types on component mount
onMounted(() => {
  fetchIdentityTypes()
})
</script>
