<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('identityTypes') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('identityTypesDescription') }}
        </p>
      </div>

      <!-- Identity Types Table using ReusableTable -->
      <ReusableTable 
        :title="t('identityTypesList')" 
        :columns="columns" 
        :data="identityTypes"
        :actions="actions" 
        :loading="loading" 
        @action="onAction"
        @selection-change="onSelectionChange"
        :selectable="true"
        :search-placeholder="t('searchIdentityTypes')"
        :empty-state-title="t('noIdentityTypesFound')"
        :empty-state-message="t('addIdentityTypeMessage')"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            :label="t('addIdentityType')"
            :icon="Plus"
          />

          <BasicButton 
            v-if="selectedIdentityTypes.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')"
            :icon="Trash2"
          />
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName || 'System' }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName || 'System' }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(item.updatedAt) }}</div>
          </div>
        </template>

        <!-- Custom column for status -->
        <template #column-status="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ item.status }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('editIdentityType') : t('addIdentityType') }}
          </h3>

          <form @submit.prevent="saveIdentityType">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('shortCode') }}<span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.shortCode" 
                type="text" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="t('enterShortCode')"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('identityTypeName') }}<span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.name" 
                type="text" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="t('enterIdentityTypeName')"
              >
            </div>

            <div class="flex justify-end space-x-3 mt-6">
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
                :label="saving ? t('saving') + '...' : (showEditModal ? t('update') : t('save'))"
                :loading="saving"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Single Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('confirmDeleteTitle')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleIdentityType"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('confirmBulkDeleteTitle')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteIdentityTypes"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
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
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import {
  getIdentityTypes,
  postIdentityType,
  updateIdentityTypeById,
  deleteIdentityTypeById
} from '@/services/configrationApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedIdentityTypes = ref<any[]>([])
const editingIdentityType = ref<any>(null)
const loading = ref(false)
const saving = ref(false)

// Delete modals states
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const identityTypeToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Identity types data
const identityTypes = ref<any[]>([])

// Form data
const formData = ref({
  id: '',
  shortCode: '',
  name: ''
})

// Computed properties
const selectedCount = computed(() => selectedIdentityTypes.value.length)

// Table columns - Respectant les colonnes existantes
const columns = computed<Column[]>(() => [
  { 
    key: 'name', 
    label: t('identityTypeName'), 
    type: 'text',
    sortable: true,
    searchable: true
  },
  { 
    key: 'createdInfo', 
    label: t('createdBy'), 
    type: 'custom' 
  },
  { 
    key: 'modifiedInfo', 
    label: t('modifiedBy'), 
    type: 'custom' 
  },
  { 
    key: 'shortCode', 
    label: t('shortCode'), 
    type: 'text',
    sortable: true
  }
])

// Table actions
const actions = computed<Action[]>(() => [
  { 
    label: t('edit'), 
    icon: Edit,
    variant: 'primary',
    handler: (item: any) => onAction('edit', item)
  },
  { 
    label: t('delete'), 
    icon: Trash2,
    variant: 'danger',
    handler: (item: any) => onAction('delete', item)
  }
])

// Methods
const onSelectionChange = (selection: any[]) => {
  selectedIdentityTypes.value = selection
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editIdentityType(item)
  } else if (action === 'delete') {
    handleDeleteIdentityType(item)
  }
}

const editIdentityType = (identityType: any) => {
  editingIdentityType.value = identityType
  formData.value = {
    id: identityType.id,
    shortCode: identityType.shortCode || '',
    name: identityType.name || ''
  }
  showEditModal.value = true
}

const handleDeleteIdentityType = (identityType: any) => {
  identityTypeToDelete.value = identityType
  showDeleteModal.value = true
}

const confirmDeleteSingleIdentityType = async () => {
  if (!identityTypeToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteIdentityTypeById(identityTypeToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      const index = identityTypes.value.findIndex(it => it.id === identityTypeToDelete.value.id)
      if (index !== -1) {
        identityTypes.value.splice(index, 1)
      }
      toast.success(t('identityTypeDeletedSuccessfully'))
    } else {
      throw new Error('Failed to delete identity type')
    }
  } catch (error) {
    console.error('Error deleting identity type:', error)
    toast.error(t('errorDeletingIdentityType'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const confirmBulkDeleteIdentityTypes = async () => {
  if (selectedIdentityTypes.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedIdentityTypes.value.map(it => 
      deleteIdentityTypeById(it.id)
    )
    await Promise.all(deletePromises)
    
    const selectedIds = selectedIdentityTypes.value.map(it => it.id)
    identityTypes.value = identityTypes.value.filter(it => !selectedIds.includes(it.id))
    
    const count = selectedIdentityTypes.value.length
    selectedIdentityTypes.value = []
    toast.success(t('identityTypesDeletedSuccess', { count }))
  } catch (error) {
    console.error('Error deleting identity types:', error)
    toast.error(t('errorDeletingSelectedIdentityTypes'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  identityTypeToDelete.value = null
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

const getSingleDeleteMessage = () => {
  if (!identityTypeToDelete.value) return ''
  const identityTypeName = identityTypeToDelete.value.name
  return `Are you sure you want to delete identity type "${identityTypeName}"? This action cannot be undone.`
}

const getBulkDeleteMessage = () => {
  const count = selectedIdentityTypes.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const identityTypeName = selectedIdentityTypes.value[0].name
    return `Are you sure you want to delete the selected identity type "${identityTypeName}"? This action cannot be undone.`
  } else {
    return `Are you sure you want to delete ${count} selected identity types? This action cannot be undone.`
  }
}

const saveIdentityType = async () => {
  try {
    saving.value = true

    const identityTypeData = {
      reason: formData.value.name,
      shortCode: formData.value.shortCode,
      hotelId: serviceStore.serviceId
    }

    if (showEditModal.value && editingIdentityType.value) {
      const resp = await updateIdentityTypeById(parseInt(`${editingIdentityType.value.id}`), identityTypeData)
      if (resp.status === 200 || resp.status === 201) {
        const index = identityTypes.value.findIndex(it => it.id === editingIdentityType.value.id)
        if (index !== -1) {
          identityTypes.value[index] = {
            ...identityTypes.value[index],
            name: formData.value.name,
            shortCode: formData.value.shortCode
          }
        }
        toast.success(t('identityTypeUpdatedSuccess'))
        closeModal()
      } else {
        throw new Error(resp.data?.message || t('somethingWentWrong'))
      }
    } else {
      const resp = await postIdentityType(identityTypeData)
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('identityTypeAddedSuccess'))
        await loadData()
        closeModal()
      } else {
        throw new Error(resp.data?.message || t('somethingWentWrong'))
      }
    }
  } catch (error: any) {
    console.error('Error saving identity type:', error)
    const errorMessage = error.response?.data?.message || error.message || t('somethingWentWrong')
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingIdentityType.value = null
  formData.value = {
    id: '',
    shortCode: '',
    name: ''
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const response = await getIdentityTypes()
    identityTypes.value = response.data.data || []
  } catch (error) {
    console.error('Error loading identity types:', error)
    toast.error(t('errorLoadingIdentityTypes'))
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>