<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Units</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          Units here refer to the different areas in the hotel premises which need to be attended by the housekeepers. 
          It can be anything like – visitors lobby, Reception area, Recreation area, etc.
        </p>
        
        <ReusableTable
          title="Units"
          :columns="columns"
          :data="units"
          :actions="actions"
          :selectable="true"
          search-placeholder="Search units..."
          empty-state-title="No units found"
          empty-state-description="Get started by adding your first unit."
          :loading="loading"
          @action="onAction"
          @selection-change="onSelectionChange"
        >
          <template #header-actions>
            <BasicButton 
              variant="primary" 
              @click="openAddModal"
              :icon="Plus"
              label="Add Unit"
              :disabled="loading"
            />

            <!-- Bulk Delete Button -->
            <BasicButton 
              v-if="selectedUnits.length > 0" 
              @click="handleBulkDelete" 
              :label="t('deleteSelected')" 
              :icon="Trash2"
              variant="danger"
              :disabled="loading || isBulkDeletingLoading"
            />
          </template>

          <template #status="{ item }">
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
        </ReusableTable>
      </div>
    </div>

    <!-- Add/Edit Modal - EXACTEMENT le même style que Housekeepers -->
    <div 
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ showEditModal ? 'Edit Unit' : 'Add Unit' }}
        </h3>

        <form @submit.prevent="saveUnit">
          <!-- CONTENU SPÉCIFIQUE À UNITS -->
          <div class="mb-4">
            <Input
              v-model="formData.name"
              label="Unit Name"
              type="text"
              placeholder="Enter unit name"
              required
            />
          </div>
          <!-- FIN DU CONTENU SPÉCIFIQUE -->

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

    <!-- Single Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('delete Unit')"
      :message="getSingleDeleteMessage()"
      :loading="isDeletingLoading" 
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleUnit"
      @close="closeSingleDeleteModal"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('delete Selected Units')" 
      :message="getBulkDeleteMessage()"
      :loading="isBulkDeletingLoading" 
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteUnits"
      @close="closeBulkDeleteModal"
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
import { Plus, Trash2, Edit } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'

const { t } = useI18n()
const toast = useToast()

// Reactive data - MÊME STRUCTURE que Housekeepers
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedUnits = ref<any[]>([])
const editingUnit = ref<any>(null)
const loading = ref(false)
const isSaving = ref(false)

// Delete modals states - MÊME STRUCTURE que Housekeepers
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const unitToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data - CONTENU SPÉCIFIQUE À UNITS
const formData = reactive({
  name: ''
})

// Table configuration - COLONNE SELECTIONSTATUS SUPPRIMÉE
const columns = computed<Column[]>(() => [
  { key: 'name', label: 'Unit Name', type: 'text', sortable: true },
  { key: 'createdBy', label: 'Created By', type: 'text', sortable: true },
  { key: 'modifiedBy', label: 'Modified By', type: 'text', sortable: true },
  { key: 'status', label: 'Status', type: 'custom' }
])

const actions = computed<Action[]>(() => [
  {
    label: 'Edit',
    handler: (item: any) => editUnit(item),
    variant: 'primary',
    icon: Edit
  },
  {
    label: 'Delete',
    handler: (item: any) => handleDeleteUnit(item),
    variant: 'danger',
    icon: Trash2
  }
])

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

// --- Message methods - MÊME STRUCTURE que Housekeepers ---
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

// --- Bulk Operations ---
const handleBulkDelete = () => {
  if (selectedUnits.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDeleteUnits = async () => {
  if (selectedUnits.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const idsToDelete = selectedUnits.value.map(unit => unit.id)
    units.value = units.value.filter(unit => !idsToDelete.includes(unit.id))
    
    selectedUnits.value = []
    toast.success(t('bulkDeleteSuccess', { count: idsToDelete.length }))
  } catch (error) {
    console.error('Error deleting units:', error)
    toast.error(t('somethingWentWrong'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

// --- Modal Management - MÊME STRUCTURE que Housekeepers ---
const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// --- Single Delete Handlers - MÊME STRUCTURE que Housekeepers ---
const handleDeleteUnit = (unit: any) => {
  unitToDelete.value = unit
  showDeleteModal.value = true
}

const confirmDeleteSingleUnit = async () => {
  if (!unitToDelete.value) return

  isDeletingLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = units.value.findIndex(u => u.id === unitToDelete.value.id)
    if (index !== -1) {
      units.value.splice(index, 1)
      toast.success(t('deleteSuccess'))
    }
  } catch (error) {
    console.error('Error deleting unit:', error)
    toast.error(t('somethingWentWrong'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  unitToDelete.value = null
}

// --- Existing Methods avec structure cohérente ---
const openAddModal = () => {
  showAddModal.value = true
  showEditModal.value = false
  editingUnit.value = null
  formData.name = ''
}

const editUnit = (unit: any) => {
  editingUnit.value = unit
  formData.name = unit.name
  showEditModal.value = true
  showAddModal.value = false
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingUnit.value = null
  formData.name = ''
}

const saveUnit = async () => {
  try {
    isSaving.value = true
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Unit name is required')
      return
    }

    if (showEditModal.value && editingUnit.value) {
      // Update existing unit
      const index = units.value.findIndex(u => u.id === editingUnit.value.id)
      if (index !== -1) {
        units.value[index] = {
          ...units.value[index],
          name: formData.name,
          modifiedBy: 'admin',
          modifiedDate: new Date().toISOString().split('T')[0]
        }
      }
      toast.success(t('updateSuccess'))
    } else {
      // Add new unit
      const newUnit = {
        id: Math.max(...units.value.map(u => u.id)) + 1,
        name: formData.name,
        createdBy: 'admin',
        createdDate: new Date().toISOString().split('T')[0],
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      }
      units.value.push(newUnit)
      toast.success(t('createSuccess'))
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving unit:', error)
    toast.error(t('somethingWentWrong'))
  } finally {
    isSaving.value = false
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editUnit(item)
  } else if (action === 'delete') {
    handleDeleteUnit(item)
  }
}

const onSelectionChange = (selected: any[]) => {
  selectedUnits.value = selected
}
</script>