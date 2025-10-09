<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('bedType') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('bedTypeDescription') }}
        </p>
      </div>

      <!-- Bed Types Table using ReusableTable -->
      <ReusableTable 
        :title="t('bedTypes')" 
        :columns="columns" 
        :data="bedTypes" 
        :actions="actions"
        :search-placeholder="t('searchBedTypes')" 
        :selectable="true" 
        :empty-state-title="t('noBedTypesFound')"
        :empty-state-message="t('clickAddBedType')" 
        @action="onAction"
        @selection-change="onSelectionChange" 
        :loading="loading">
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true" 
            :label="t('addBedType')" 
            :icon="Plus">
          </BasicButton>

          <button 
            v-if="selectedBedTypes.length > 0" 
            @click="deleteSelected"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
            <Trash2 class="w-4 h-4" />
            <span>{{ t('deleteSelected') }} ({{ selectedBedTypes.length }})</span>
          </button>
        </template>

        <template #column-status="{ item }">
          <span :class="{
            'bg-green-100 text-green-800': item.status === 'Active',
            'bg-red-100 text-red-800': item.status === 'Inactive'
          }" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ item.status === 'Active' ? t('active') : t('inactive') }}
          </span>
        </template>

        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.createdAt }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Bed Type Modal -->
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('editBedType') : t('addBedType') }}
          </h3>

          <form @submit.prevent="saveBedType" class="space-y-4">
            <div>
              <Input
                :lb="t('shortCodeRequired')"
                v-model="formData.shortCode"
                :placeholder="t('shortCodePlaceholder')"
                input-type="text"
                :maxlength="10"
                :is-required="true"
                label-class="after:content-['*'] after:ml-0.5 after:text-red-500"
                class="w-full"
              />
              <p class="text-xs text-gray-500 mt-1">{{ t('shortCodeDescription') }}</p>
            </div>

            <div>
              <Input
                :lb="t('bedTypeNameRequired')"
                v-model="formData.bedTypeName"
                :placeholder="t('bedTypeNamePlaceholder')"
                input-type="text"
                :is-required="true"
                label-class="after:content-['*'] after:ml-0.5 after:text-red-500"
                class="w-full"
              />
              <p class="text-xs text-gray-500 mt-1">{{ t('bedTypeNameDescription') }}</p>
            </div>

            <div>
              <Select
                :lb="t('status')"
                v-model="formData.status"
                :options="[
                  { value: 'Active', label: t('active') },
                  { value: 'Inactive', label: t('inactive') }
                ]"
                :default-value="formData.status || 'Active'"
                class="w-full"
              />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal" 
                :label="t('cancel')" 
                :disabled="isLoading"
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :label="isLoading ? t('saving') + '...' : showEditModal ? t('update') : t('save')"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('confirmDeleteBedTypeTitle')" 
      :message="getDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteBedType"
      @close="() => { showDeleteModal = false; bedTypeToDelete = null; }"
      :loading="isDeletingLoading"
      action="INFO"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Trash2, Edit } from 'lucide-vue-next'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { Action, Column } from '../../../utils/models'
import { getBedTypes, postBedType, updateBedTypeById, deleteBedTypeById as deleteBedTypeAPI } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const serviceStore = useServiceStore()
const toast = useToast()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedBedTypes = ref<any[]>([])
const editingBedType = ref<any>(null)
const isLoading = ref(false)
const loading = ref(false)
const bedTypeToDelete = ref<any>(null)
const showDeleteModal = ref(false)
const isDeletingLoading = ref(false)

// Form data
const formData = ref({
  shortCode: '',
  bedTypeName: '',
  status: 'Active'
})

// Table configuration
const columns: Column[] = [
  {
    key: 'shortCode',
    label: t('shortCode'),
    type: 'text'
  },
  {
    key: 'bedTypeName',
    label: t('bedTypeName'),
    type: 'text'
  },
  {
    key: 'status',
    label: t('status'),
    type: 'custom'
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
  }
]

const actions: Action[] = [
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
]

// Sample data
const bedTypes = ref<any[]>([])

// Methods
const onSelectionChange = (selected: any) => {
  selectedBedTypes.value = selected
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editBedType(item)
  } else if (action === 'delete') {
    handleDeleteBedType(item)
  }
}

const editBedType = (bedType: any) => {
  editingBedType.value = bedType
  formData.value = {
    shortCode: bedType.shortCode,
    bedTypeName: bedType.bedTypeName,
    status: bedType.status
  }
  showEditModal.value = true
}

const handleDeleteBedType = (bedType: any) => {
  bedTypeToDelete.value = bedType
  showDeleteModal.value = true
}

const confirmDeleteBedType = async () => {
  if (!bedTypeToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteBedTypeAPI(bedTypeToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      // Mettre à jour la liste localement
      const index = bedTypes.value.findIndex(bt => bt.id === bedTypeToDelete.value.id)
      if (index !== -1) {
        bedTypes.value.splice(index, 1)
      }
      toast.success(t('bedTypeDeletedSuccess'))
    } else {
      throw new Error('Failed to delete bed type')
    }
  } catch (error) {
    console.error('Error deleting bed type:', error)
    toast.error(t('errorDeletingBedType'))
  } finally {
    isDeletingLoading.value = false
    showDeleteModal.value = false
    bedTypeToDelete.value = null
  }
}

const getDeleteMessage = () => {
  if (!bedTypeToDelete.value) return ''
  return t('confirmDeleteBedType', { name: bedTypeToDelete.value.bedTypeName })
}

const deleteSelected = async () => {
  const count = selectedBedTypes.value.length
  if (confirm(t('confirmDeleteSelectedBedTypes', { count }))) {
    try {
      const deletePromises = selectedBedTypes.value.map(bedType => deleteBedTypeAPI(bedType.id))
      await Promise.all(deletePromises)
      loadData()
      selectedBedTypes.value = []
      toast.success(t('bedTypesDeletedSuccess', { count }))
    } catch (error) {
      console.error('Error deleting bed types:', error)
      toast.error(t('errorDeletingSelectedBedTypes'))
    }
  }
}

const saveBedType = async () => {
  isLoading.value = true
  try {
    if (showEditModal.value && editingBedType.value) {
      // Update existing bed type
      const updatedBedType = {
        shortCode: formData.value.shortCode,
        bedTypeName: formData.value.bedTypeName,
        status: formData.value.status,
        hotelId: serviceStore.serviceId
      }
      
      const resp = await updateBedTypeById(editingBedType.value.id, updatedBedType)
      
      if (resp.status === 200 || resp.status === 201) {
        // Mettre à jour localement l'élément modifié
        const index = bedTypes.value.findIndex(bt => bt.id === editingBedType.value.id)
        if (index !== -1) {
          bedTypes.value[index] = {
            ...bedTypes.value[index],
            ...updatedBedType,
            shortCode: updatedBedType.shortCode,
            bedTypeName: updatedBedType.bedTypeName,
            status: updatedBedType.status
          }
        }
        toast.success(t('bedTypeUpdatedSuccess'))
      } else {
        throw new Error('Failed to update bed type')
      }
    } else {
      // Add new bed type
      const newBedType = {
        shortCode: formData.value.shortCode,
        bedTypeName: formData.value.bedTypeName,
        status: formData.value.status,
        hotelId: serviceStore.serviceId
      }
      
      const resp = await postBedType(newBedType)
      
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('bedTypeCreatedSuccess'))
        loadData()
      } else {
        throw new Error('Failed to create bed type')
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error saving bed type:', error)
    toast.error(t('errorSavingBedType'))
  } finally {
    isLoading.value = false
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const resp = await getBedTypes()
    console.log('this is the data', resp)
    bedTypes.value = resp.data.data.data
  } catch (error) {
    console.error('Error loading bed types:', error)
    toast.error(t('errorLoadingBedTypes'))
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingBedType.value = null
  formData.value = {
    shortCode: '',
    bedTypeName: '',
    status: 'Active'
  }
}

loadData()
</script>