<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Transportation Modes Table using ReusableTable -->
      <ReusableTable 
        :title="t('configuration.transportation_mode.table_title')" 
        :columns="columns"
        :data="transportationModes" 
        :actions="actions"
        :search-placeholder="t('configuration.transportation_mode.search_placeholder')" 
        :selectable="true"
        :empty-state-title="t('configuration.transportation_mode.empty_state_title')"
        :empty-state-message="t('configuration.transportation_mode.empty_state_message')" 
        :loading="loading"
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <!-- Add Button -->
          <BasicButton 
            variant="primary" 
            :icon="Plus"
            :label="t('configuration.transportation_mode.add_transportation_mode')" 
            :disabled="loading"
            @click="openAddModal" 
          />
          <!-- Bulk Delete Button (Visible when items are selected) -->
          <BasicButton 
            v-if="selectedModes.length > 0" 
            @click="handleDeleteSelected" 
            :label="t('deleteSelected')" 
            :icon="Trash2"
            variant="danger"
            :disabled="loading"
          />
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
      </ReusableTable>

      <!-- Add/Edit Modal (Structure inchangée) -->
      <div 
        v-if="showModal" 
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? t('configuration.transportation_mode.edit_transportation_mode') :
              t('configuration.transportation_mode.add_new_transportation_mode') }}
          </h3>

          <form @submit.prevent="saveTransportationMode" class="space-y-4">
            <!-- Name Input -->
            <Input 
              :lb="t('configuration.transportation_mode.transportation_mode_name')" 
              inputType="text"
              :isRequired="true" 
              v-model="formData.name"
              :placeholder="t('configuration.transportation_mode.transportation_mode_placeholder')" 
              customClass="w-full"
            />
            
            <!-- Description Input -->
            <Input 
              :lb="t('configuration.transportation_mode.description')" 
              inputType="text"
              v-model="formData.description"
              :placeholder="t('configuration.transportation_mode.description_placeholder')" 
              customClass="w-full"
            />
            
            <div class="flex justify-end space-x-3 pt-4">
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
                :icon="isEditing ? Edit : Plus"
                :label="saving ? t('saving') + '...' : isEditing ? t('update') : t('add')"
                :loading="saving"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Single Confirmation Modal (Utilise getSingleDeleteMessage) -->
      <ModalConfirmation 
        v-if="showDeleteModal" 
        v-model="showDeleteModal" 
        :title="t('Delete Transportation Mode')" 
        :message="getSingleDeleteMessage()"
        :loading="isDeletingLoading" 
        :confirm-text="t('delete')" 
        :cancel-text="t('cancel')" 
        @confirm="confirmDeleteSingleMode"
        @close="closeSingleDeleteModal"
        action="DANGER"
      />

      <!-- Bulk Delete Confirmation Modal (Utilise getBulkDeleteMessage) -->
      <ModalConfirmation 
        v-if="showBulkDeleteModal" 
        v-model="showBulkDeleteModal" 
        :title="t('Delete Selected Transportation Modes')" 
        :message="getBulkDeleteMessage()"
        :loading="isBulkDeletingLoading" 
        :confirm-text="t('deleteSelected')" 
        :cancel-text="t('cancel')" 
        @confirm="confirmBulkDeleteModes"
        @close="closeBulkDeleteModal"
        action="DANGER"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue' 
import type { Action, Column } from '../../../utils/models'
import { Plus, Trash2, Edit } from 'lucide-vue-next'
import {
  getTransportationModes,
  postTransportationMode,
  updateTransportationModeById,
  deleteTransportationModeById
} from '@/services/configrationApi'

// Types
interface TransportationMode {
  id: number
  name: string // Propriété clé utilisée pour l'affichage dans la modale
  description: string
  createdByUser?: { firstName: string }
  updatedByUser?: { firstName: string }
  createdAt: string
  updatedAt: string
}

interface TransportationModeFormData {
  id: number | null
  name: string
  description: string
}

// Composables
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// State Data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const saving = ref(false)
const transportationModes = ref<TransportationMode[]>([])

// Selection & Delete State
const selectedModes = ref<TransportationMode[]>([])
const modeToDelete = ref<TransportationMode | null>(null) // Correspond à reasonToDelete
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form Data
const formData = ref<TransportationModeFormData>({
  id: null,
  name: '',
  description: '',
})

// Computed Properties
const columns = computed((): Column[] => [
  { key: 'name', label: t('configuration.transportation_mode.transportation_mode_name'), type: 'text' },
  { key: 'description', label: t('configuration.transportation_mode.description'), type: 'text' },
  { key: 'createdInfo', label: t('configuration.transportation_mode.created_by'), type: 'custom' as const },
  { key: 'modifiedInfo', label: t('configuration.transportation_mode.modified_by'), type: 'custom' as const },
])

const actions = computed((): Action[] => [
  {
    label: t('edit'),
    icon: Edit,
    variant: 'primary',
    handler: (item: TransportationMode) => onAction('edit', item)
  },
  {
    label: t('delete'),
    icon: Trash2,
    variant: 'danger',
    handler: (item: TransportationMode) => onAction('delete', item)
  }
])

// --- Message methods (Aligné sur la structure demandée) ---
const getSingleDeleteMessage = () => {
  if (!modeToDelete.value) return ''
  // Utilise la propriété 'name' (analogue à 'reasonName')
  const name = modeToDelete.value.name 
  // Utilise une clé i18n générique de confirmation
  return t('configuration.transportation_mode.delete_confirm', { name: name }) 
}

const getBulkDeleteMessage = () => {
  const count = selectedModes.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    // Si un seul élément est sélectionné, affiche son nom
    const name = selectedModes.value[0].name
    return t('configuration.transportation_mode.delete_confirm', { name: name })
  } else {
    // Si plusieurs éléments sont sélectionnés, affiche le compte
    return t('configuration.transportation_mode.bulk_delete_confirm', { count: count })
  }
}
// --- Fin des Message methods ---

// --- Handlers for Table and Modals ---

const onSelectionChange = (selected: TransportationMode[]) => {
  selectedModes.value = selected
}

const onAction = (action: string, item: TransportationMode) => {
  if (action === 'edit') {
    editTransportationMode(item)
  } else if (action === 'delete') {
    handleDeleteMode(item)
  }
}

// Single Delete Handlers
const handleDeleteMode = (mode: TransportationMode) => {
  modeToDelete.value = mode
  showDeleteModal.value = true
}

const confirmDeleteSingleMode = async () => {
  if (!modeToDelete.value || !modeToDelete.value.id) return

  isDeletingLoading.value = true
  try {
    await deleteTransportationModeById(modeToDelete.value.id)
    await fetchTransportationModes() 
    toast.success(t('configuration.transportation_mode.delete_success'))
  } catch (error) {
    console.error('Error deleting transportation mode:', error)
    toast.error(t('configuration.transportation_mode.delete_error'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  modeToDelete.value = null
}

// Bulk Delete Handlers
const handleDeleteSelected = () => {
  if (selectedModes.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDeleteModes = async () => {
  if (selectedModes.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedModes.value.map(mode =>
      deleteTransportationModeById(mode.id)
    )
    await Promise.all(deletePromises)

    // Reload data and clear selection
    await fetchTransportationModes()
    selectedModes.value = []
    toast.success(t('configuration.transportation_mode.bulk_delete_success', { count: deletePromises.length }))
  } catch (error) {
    console.error('Error deleting transportation mode(s):', error)
    toast.error(t('configuration.transportation_mode.delete_error'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// --- CRUD Operations (Inchagées) ---

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = { id: null, name: '', description: '' }
  showModal.value = true
}

const editTransportationMode = (mode: TransportationMode) => {
  isEditing.value = true
  editingId.value = mode.id
  formData.value = {
    id: mode.id,
    name: mode.name,
    description: mode.description,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = { id: null, name: '', description: '' }
}

const saveTransportationMode = async () => {
  if (!formData.value.name) {
     toast.error(t('pleaseCompleteAllRequiredFields'))
     return
  }
  
  saving.value = true
  try {
    const transportationModeData = {
      name: formData.value.name,
      description: formData.value.description,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && editingId.value) {
      await updateTransportationModeById(editingId.value, transportationModeData)
      toast.success(t('configuration.transportation_mode.update_success'))
    } else {
      await postTransportationMode(transportationModeData)
      toast.success(t('configuration.transportation_mode.create_success'))
    }

    await fetchTransportationModes()
    closeModal()
  } catch (error) {
    console.error('Error saving transportation mode:', error)
    toast.error(t('configuration.transportation_mode.save_error'))
  } finally {
    saving.value = false
  }
}

const fetchTransportationModes = async () => {
  try {
    const hotelId = serviceStore.serviceId
    loading.value = true
    const response = await getTransportationModes(hotelId!)
    transportationModes.value = response.data.data.data || response.data.data || response.data || []
  } catch (error) {
    console.error('Error fetching transportation modes:', error)
    toast.error(t('configuration.transportation_mode.fetch_error'))
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchTransportationModes()
})
</script>
