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
      <ReusableTable :title="t('bedTypes')" :columns="columns" :data="bedTypes" :actions="actions"
        :search-placeholder="t('searchBedTypes')" :selectable="true" :empty-state-title="t('noBedTypesFound')"
        :empty-state-message="t('clickAddBedType')" @action="onAction"
        @selection-change="onSelectionChange" :loading="loading">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addBedType')" :icon="Plus">
          </BasicButton>

          <BasicButton v-if="selectedBedTypes.length > 0" @click="deleteSelected" :label="t('deleteSelected')"
            :icon="Trash2">
          </BasicButton>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('shortCodeRequired') }}
              </label>
              <input v-model="formData.shortCode" type="text" required maxlength="10"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="t('shortCodePlaceholder')">
              <p class="text-xs text-gray-500 mt-1">{{ t('shortCodeDescription') }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('bedTypeNameRequired') }}
              </label>
              <input v-model="formData.bedTypeName" type="text" required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="t('bedTypeNamePlaceholder')">
              <p class="text-xs text-gray-500 mt-1">{{ t('bedTypeNameDescription') }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('status') }}
              </label>
              <select v-model="formData.status"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="Active">{{ t('active') }}</option>
                <option value="Inactive">{{ t('inactive') }}</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                {{ t('cancel') }}
              </button>
              <button type="submit" :disabled="isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ showEditModal ? t('update') : t('save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Trash2, Edit, Trash } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import { getBedTypes, postBedType, updateBedTypeById } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const serviceStore = useServiceStore()
const toast = useToast();
// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedBedTypes = ref<any[]>([])
const editingBedType = ref<any>(null)
const isLoading = ref(false)

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
    label: 'Edit',
    handler: (item: any) => editBedType(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteBedType(item.id),
    variant: 'danger'
  }
]

// Sample data
const bedTypes = ref<any[]>([])
const loading = ref(false);
// Methods
const onSelectionChange = (selected: any) => {
  selectedBedTypes.value = selected
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editBedType(item)
  } else if (action === 'delete') {
    deleteBedType(item)
  } else if (action === 'deleteSelected') {
    deleteSelected()
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

const deleteBedType = (bedType: any) => {
  if (confirm(t('confirmDeleteBedType', { name: bedType.bedTypeName }))) {
    bedTypes.value = bedTypes.value.filter(bt => bt.id !== bedType.id)
    toast.success(t('bedTypeDeletedSuccess'))
  }
}

const deleteSelected = () => {
  if (confirm(t('confirmDeleteSelectedBedTypes', { count: selectedBedTypes.value.length }))) {
    const selectedIds = selectedBedTypes.value.map(bt => bt.id)
    bedTypes.value = bedTypes.value.filter(bt => !selectedIds.includes(bt.id))
    selectedBedTypes.value = []
    toast.success(t('bedTypesDeletedSuccess'))
  }
}

const saveBedType = async () => {
  isLoading.value = true
  try {
    if (showEditModal.value && editingBedType.value) {
      // Update existing bed type
      const index = bedTypes.value.findIndex(bt => bt.id === editingBedType.value.id)
      if (index !== -1) {
        const bedtype = {
          ...bedTypes.value[index],
          shortCode: formData.value.shortCode,
          bedTypeName: formData.value.bedTypeName,
          status: formData.value.status
        }
        const resp = await updateBedTypeById(editingBedType.value.id, bedtype);
        if (resp.status === 200 || resp.status === 201) {
          toast.success(t('bedTypeUpdatedSuccess'))
          loadData();
          closeModal()
        } else {
          toast.error(t('somethingWentWrong'))
          console.error('Error updating bed type:', resp);
          return;
        }
      }
    } else {
      // Add new bed type
      const newBedType = {
        shortCode: formData.value.shortCode,
        bedTypeName: formData.value.bedTypeName,
        status: formData.value.status,
        hotelId: serviceStore.serviceId,
      }
      const resp = await postBedType(newBedType);
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('bedTypeCreatedSuccess'))
        loadData();
        closeModal()
      } else {
        toast.error(t('somethingWentWrong'))
        console.error('Error adding bed type:', resp);
        return;
      }
    }
  } finally {
    isLoading.value = false
  }
}
const loadData = async () => {
  loading.value = true;
  try {
    const resp = await getBedTypes();
    console.log('this is the data', resp)
    bedTypes.value = resp.data.data.data;
  } catch (error) {
    console.error('Error loading bed types:', error);
    toast.error(t('errorLoadingBedTypes'));
  }finally{
     loading.value = false;
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