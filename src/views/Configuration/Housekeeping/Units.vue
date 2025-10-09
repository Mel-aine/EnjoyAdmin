<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('units') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('unitsDescription') }}
        </p>
      </div>

      <!-- Units Table using ReusableTable -->
      <ReusableTable
        :title="t('unitsList')"
        :columns="columns"
        :data="units"
        :actions="actions"
        :search-placeholder="t('searchUnits')"
        :selectable="true"
        :empty-state-title="t('noUnitsFound')"
        :empty-state-message="t('addUnitMessage')"
        @action="onAction"
        @selection-change="onSelectionChange"
        :loading="loading"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            :label="t('addUnit')"
            :icon="Plus"
          />

          <BasicButton 
            v-if="selectedUnits.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')"
            :icon="Trash2"
          />
        </template>

        <!-- Custom column for status -->
        <template #column-status="{ item }">
          <span 
            :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              item.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ item.status }}
          </span>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdBy }}</div>
            <div class="text-xs text-gray-400">{{ item.createdDate }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifiedBy }}</div>
            <div class="text-xs text-gray-400">{{ item.modifiedDate }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('editUnit') : t('addUnit') }}
          </h3>
          
          <form @submit.prevent="saveUnit">
            <div class="mb-4">
              <Input
                v-model="formData.name"
                :lb="t('unitName')"
                type="text"
                :placeholder="t('enterUnitName')"
                :is-required="true"
              />
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal"
                :label="t('cancel')"
                :disabled="isSaving"
              />
              <BasicButton 
                type="submit" 
                variant="primary"
                :label="isSaving ? t('saving') + '...' : (showEditModal ? t('update') : t('save'))"
                :loading="isSaving"
                :disabled="isSaving"
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
      :title="t('Delete Unit')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleUnit"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('Delete Selected Units')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteUnits"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedUnits = ref<any[]>([])
const editingUnit = ref<any>(null)
const loading = ref(false)
const isSaving = ref(false)

// Delete modals states
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const unitToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = reactive({
  name: ''
})

// Computed properties
const selectedCount = computed(() => selectedUnits.value.length)

// Table configuration
const columns: Column[] = [
  { 
    key: 'name', 
    label: t('unitName'), 
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
    key: 'status', 
    label: t('status'), 
    type: 'custom' 
  }
]

const actions: Action[] = [
  {
    label: t('edit'),
    handler: (item: any) => onAction('edit', item),
    icon: Edit,
    variant: 'primary'
  },
  {
    label: t('delete'),
    handler: (item: any) => onAction('delete', item),
    icon: Trash2,
    variant: 'danger'
  }
]

const units = ref([
  { 
    id: 1, 
    name: 'Visitors Lobby', 
    createdBy: 'admin', 
    createdDate: '2013-05-13', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Reception Area', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 3, 
    name: 'Recreation Area', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  }
])

// Methods
const onSelectionChange = (selected: any[]) => {
  selectedUnits.value = selected
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editUnit(item)
  } else if (action === 'delete') {
    handleDeleteUnit(item)
  }
}

const editUnit = (unit: any) => {
  editingUnit.value = unit
  formData.name = unit.name
  showEditModal.value = true
}

// Single unit deletion
const handleDeleteUnit = (unit: any) => {
  unitToDelete.value = unit
  showDeleteModal.value = true
}

const confirmDeleteSingleUnit = async () => {
  if (!unitToDelete.value) return

  isDeletingLoading.value = true
  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = units.value.findIndex(u => u.id === unitToDelete.value.id)
    if (index !== -1) {
      units.value.splice(index, 1)
    }
    toast.success(t('unitDeletedSuccessfully'))
  } catch (error) {
    console.error('Error deleting unit:', error)
    toast.error(t('errorDeletingUnit'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  unitToDelete.value = null
}

// Multiple units deletion
const confirmBulkDeleteUnits = async () => {
  if (selectedUnits.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    // Simuler des appels API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mettre à jour la liste localement
    const selectedIds = selectedUnits.value.map(u => u.id)
    units.value = units.value.filter(u => !selectedIds.includes(u.id))
    
    const count = selectedUnits.value.length
    selectedUnits.value = []
    toast.success(t('unitsDeletedSuccess', { count }))
  } catch (error) {
    console.error('Error deleting units:', error)
    toast.error(t('errorDeletingSelectedUnits'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Message methods
const getSingleDeleteMessage = () => {
  if (!unitToDelete.value) return ''
  const unitName = unitToDelete.value.name
  return `Are you sure you want to delete unit "${unitName}"?`
}

const getBulkDeleteMessage = () => {
  const count = selectedUnits.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const unitName = selectedUnits.value[0].name
    return `Are you sure you want to delete the selected unit "${unitName}"?`
  } else {
    return `Are you sure you want to delete ${count} selected units?`
  }
}

const saveUnit = async () => {
  try {
    isSaving.value = true
    
    // Validation
    if (!formData.name.trim()) {
      toast.error(t('unitNameRequired'))
      return
    }

    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (showEditModal.value && editingUnit.value) {
      // Update existing unit
      const index = units.value.findIndex(u => u.id === editingUnit.value.id)
      if (index !== -1) {
        units.value[index] = {
          ...units.value[index],
          name: formData.name.trim(),
          modifiedBy: 'admin',
          modifiedDate: new Date().toISOString().split('T')[0]
        }
      }
      toast.success(t('unitUpdatedSuccessfully'))
    } else {
      // Add new unit
      const newUnit = {
        id: Math.max(...units.value.map(u => u.id)) + 1,
        name: formData.name.trim(),
        createdBy: 'admin',
        createdDate: new Date().toISOString().split('T')[0],
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      }
      units.value.push(newUnit)
      toast.success(t('unitAddedSuccessfully'))
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving unit:', error)
    toast.error(t('errorSavingUnit'))
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingUnit.value = null
  formData.name = ''
}
</script>