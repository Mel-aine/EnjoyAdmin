<template>
  <ConfigurationLayout>
    <div class="p-6">

      <ReusableTable :title="$t('configuration.identity_type.table_title')" :columns="columns" :data="identityTypes"
        :actions="actions" :loading="loading" @action="onAction" :selectable="false"
        :search-placeholder="$t('configuration.identity_type.search_placeholder')"
        :empty-title="$t('configuration.identity_type.empty_title')" :meta="paginationMeta" @page-change="handlePageChange"
        :empty-description="$t('configuration.identity_type.empty_description')">
        <template v-slot:header-actions>
          <BasicButton variant="primary" @click="openAddModal" :icon="Plus"
            :label="$t('configuration.identity_type.add_identity_type')" />
        </template>
        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.createdBy?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.updatedBy?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
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

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
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

            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                :disabled="saving" />
              <BasicButton type="submit" variant="primary"
                :label="isEditing ? $t('configuration.identity_type.update_identity_type') : $t('configuration.identity_type.save_identity_type')"
                :loading="saving" />
            </div>
          </form>
        </div>
      </div>
    </div>
     <ConfirmationModal
        v-model:show="showDeleteModal"
        :title="t('configuration.identity_type.delete_title')"
        :message="t('configuration.identity_type.delete_confirm',{ name : deleteItem?.name})"
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
import {
  getIdentityTypes,
  postIdentityType,
  updateIdentityTypeById,
  deleteIdentityTypeById
} from '@/services/configrationApi'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import { Edit, Trash2 } from 'lucide-vue-next'
// Save icon removed as it's no longer used in the template

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

const columns = computed<Column[]>(() => [{ key: 'shortCode', label: t('shortCode'), type: 'custom' }
  ,
{ key: 'name', label: t('configuration.identity_type.identity_type_name'), type: 'text' },
{ key: 'createdInfo', label: t('configuration.identity_type.created_by'), type: 'custom' },
{ key: 'modifiedInfo', label: t('configuration.identity_type.modified_by'), type: 'custom' },
])

const actions = computed<Action[]>(() => [
  { label: t('edit'), handler: (item: any) => editIdentityType(item), variant: 'primary',icon:Edit },
  { label: t('delete'), handler: (item: any) => deleteIdentityType(item), variant: 'danger',icon:Trash2 }
])

const formData = ref({
  id: '',
  shortCode: "",
  name: ''
})

const identityTypes = ref<any[]>([])

// Fetch identity types from API
const fetchIdentityTypes = async (pageNumber=1) => {
  try {
    loading.value = true
    const response = await getIdentityTypes({page:pageNumber,limit:10})
    identityTypes.value = response.data.data.data || []
    paginationMeta.value = response.data.data.meta || []
    console.log('response',response)
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
    id: "",
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
      name: formData.value.name,
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

    await fetchIdentityTypes(1)
  } catch (error) {
    console.error('Error saving identity type:', error)
    toast.error(t('configuration.identity_type.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteIdentityType = async (identityType: any) => {
  deleteItem.value = identityType
  showDeleteModal.value = true
}


const confirmDelete = async() =>{
  try {
    isDeleting.value = true
    await deleteIdentityTypeById(Number(deleteItem.value.id))
    deleteItem.value = null
    showDeleteModal.value = false
    toast.success(t('configuration.identity_type.delete_success'))
    await fetchIdentityTypes(1)
  } catch (error) {
    console.error('Error deleting identity type:', error)
    toast.error(t('configuration.identity_type.delete_error'))
  }finally{
    isDeleting.value = false
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editIdentityType(item)
  } else if (action === 'delete') {
    deleteIdentityType(item)
  }
}

const handlePageChange = (page:number) =>{
  fetchIdentityTypes(page)
}

// Load identity types on component mount
onMounted(() => {
  fetchIdentityTypes(1)
})
</script>
