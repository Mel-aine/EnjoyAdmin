<template>
  <ConfigurationLayout>
    <div class="p-6">

      <!-- Bed Types Table using ReusableTable -->
      <ReusableTable :title="t('bedTypes')" :columns="columns" :data="bedTypes" :actions="actions"
        :search-placeholder="t('searchBedTypes')" :selectable="false" :empty-state-title="t('noBedTypesFound')"
        :empty-state-message="t('clickAddBedType')" @action="onAction" @page-change="handlePageChange"   :meta="paginationMeta"
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
            <div class="text-sm text-gray-900 dark:text-white">{{ item.createdBy?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.updatedBy?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Bed Type Modal -->
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 dark:border-gray-700 border rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('shortCodeDescription') }}</p>
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
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('bedTypeNameDescription') }}</p>
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
              />
            </div>
          </form>
        </div>
      </div>
    </div>
      <ConfirmationModal
        v-model:show="showDeleteConfirmation"
        :title="$t('confirmDelete')"
        :message="t('confirmDeleteBedType', { name: deleteItem?.bedTypeName })"
        :confirm-text="$t('delete')"
        :cancel-text="$t('cancel')"
        variant="danger"
        :loading="isDeletingLoading"
        @confirm="confirmDelete"
        @cancel="showDeleteConfirmation = false; deleteItem = null"
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
import type { Action, Column } from '../../../utils/models'
import { getBedTypes, postBedType, updateBedTypeById,deleteBedTypeById } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

const { t } = useI18n()
const serviceStore = useServiceStore()
const toast = useToast();
// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedBedTypes = ref<any[]>([])
const editingBedType = ref<any>(null)
const isLoading = ref(false)
const isDeletingLoading = ref(false)
const showDeleteConfirmation = ref(false)
const paginationMeta = ref<any>(null)
const deleteItem = ref<any>(null)

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
    handler: (item: any) => editBedType(item),
    variant: 'primary',
    icon:Edit
  },
  {
    label: t('delete'),
    handler: (item: any) => deleteBedType(item),
    variant: 'danger',
    icon:Trash2
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
 deleteItem.value = bedType
 showDeleteConfirmation.value = true
 console.log('bedType',bedType)
}

const confirmDelete = async() =>{
  try {
    isDeletingLoading.value = true
    await deleteBedTypeById(deleteItem.value.id)
    deleteItem.value = null
    showDeleteConfirmation.value = false
    toast.success(t('bedTypeDeletedSuccess'))
    loadData(1)

  } catch (error) {
    console.error(error)
    toast.error(t('toast.deleteErrors'))
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
          closeModal()
          loadData(1);

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
        closeModal()
        loadData(1);

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
const loadData = async (pageNumber=1) => {
  loading.value = true;
  try {
    const resp = await getBedTypes({page:pageNumber,limit:10});
    console.log('this is the data', resp)
    bedTypes.value = resp.data.data.data;
    paginationMeta.value = resp.data.data.meta
  } catch (error) {
    console.error('Error loading bed types:', error);
    toast.error(t('errorLoadingBedTypes'));
  }finally{
     loading.value = false;
  }
}

const handlePageChange = (newPage:number)=>{
  loadData(newPage)
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
loadData(1)
</script>
