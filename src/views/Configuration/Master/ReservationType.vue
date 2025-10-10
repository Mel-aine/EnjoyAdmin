<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        :title="t('configuration.reservation_type.title')"
        :description="t('configuration.reservation_type.description')"
        :columns="columns"
        :data="reservationTypes"
        :actions="actions"
        :search-placeholder="t('configuration.reservation_type.search_placeholder')"
        :selectable="true"
        :empty-state-title="t('configuration.reservation_type.empty_state_title')"
        :empty-state-message="t('configuration.reservation_type.empty_state_message')"
        :loading="loading"
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            :icon="Plus"
            :label="t('configuration.reservation_type.add_reservation_type')"
            @click="openAddModal"
            :disabled="loading"
          />
          <!-- Bulk Delete Button (Visible when items are selected) -->
          <BasicButton 
            v-if="selectedTypes.length > 0" 
            @click="handleDeleteSelected" 
            :label="$t('deleteSelected')" 
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

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? t('configuration.reservation_type.edit_reservation_type') : t('configuration.reservation_type.add_reservation_type') }}
          </h3>
          
          <form @submit.prevent="saveReservationType" class="space-y-4">
            <Input 
              :lb="t('configuration.reservation_type.name')"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="t('configuration.reservation_type.name_placeholder')"
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
                :label="isEditing ? t('configuration.reservation_type.update') : t('configuration.reservation_type.save')"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Single Confirmation Modal -->
      <ModalConfirmation
        v-if="showDeleteModal"
        v-model="showDeleteModal"
        :title="t('Delete Reservation Type')"
        :message="getSingleDeleteMessage()"
        :loading="isDeletingLoading"
        :confirm-text="t('delete')"
        :cancel-text="t('cancel')"
        @confirm="confirmDeleteSingleType"
        @close="closeSingleDeleteModal"
        action="DANGER"
      />

      <!-- Bulk Delete Confirmation Modal -->
      <ModalConfirmation
        v-if="showBulkDeleteModal"
        v-model="showBulkDeleteModal"
        :title="t('Delete Selected Reservation Types')"
        :message="getBulkDeleteMessage()"
        :loading="isBulkDeletingLoading"
        :confirm-text="t('deleteSelected')"
        :cancel-text="t('cancel')"
        @confirm="confirmBulkDeleteTypes"
        @close="closeBulkDeleteModal"
        action="DANGER"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { useServiceStore } from '@/composables/serviceStore'
import type { Action, Column } from '../../../utils/models'
import { Plus, Trash2, Edit } from 'lucide-vue-next'
import {
  getReservationTypes,
  postReservationType,
  updateReservationTypeById,
  deleteReservationTypeById
} from '@/services/configrationApi'

// Initialize composables
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const saving = ref(false)
const reservationTypes = ref<any[]>([])

// Selection & Delete State
const selectedTypes = ref<any[]>([])
const typeToDelete = ref<any | null>(null)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

const formData = ref({
  name: '',
})

// --- Message methods ---
const getSingleDeleteMessage = () => {
  if (!typeToDelete.value) return ''
  const typeName = typeToDelete.value.name
  return t('configuration.reservation_type.delete_confirmation_message', { name: typeName })
}

const getBulkDeleteMessage = () => {
  const count = selectedTypes.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const typeName = selectedTypes.value[0].name
    return t('configuration.reservation_type.delete_confirmation_message', { name: typeName })
  } else {
    return t('configuration.reservation_type.bulk_delete_confirm', { count: count })
  }
}

// --- Handlers for Table and Modals ---
const onSelectionChange = (selected: any[]) => {
  selectedTypes.value = selected
}

// Single Delete Handlers
const handleDeleteType = (type: any) => {
  typeToDelete.value = type
  showDeleteModal.value = true
}

const confirmDeleteSingleType = async () => {
  if (!typeToDelete.value || !typeToDelete.value.id) return

  isDeletingLoading.value = true
  try {
    await deleteReservationTypeById(typeToDelete.value.id)
    await fetchReservationTypes()
    toast.success(t('configuration.reservation_type.delete_success'))
  } catch (error) {
    console.error('Error deleting reservation type:', error)
    toast.error(t('configuration.reservation_type.delete_error'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  typeToDelete.value = null
}

// Bulk Delete Handlers
const handleDeleteSelected = () => {
  if (selectedTypes.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDeleteTypes = async () => {
  if (selectedTypes.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedTypes.value.map(type =>
      deleteReservationTypeById(type.id)
    )
    await Promise.all(deletePromises)

    await fetchReservationTypes()
    selectedTypes.value = []
    toast.success(t('configuration.reservation_type.bulk_delete_success', { count: deletePromises.length }))
  } catch (error) {
    console.error('Error deleting reservation type(s):', error)
    toast.error(t('configuration.reservation_type.delete_error'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Table configuration
const columns = computed((): Column[] => [
  { key: 'name', label: t('configuration.reservation_type.name'), type: 'text' },
  { key: 'createdInfo', label: t('created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('modified_by'), type: 'custom' },
])

const actions = computed((): Action[] => [
  {
    label: t('configuration.reservation_type.edit'),
    icon: Edit,
    handler: (item: any) => onAction('edit', item),
    variant: 'primary'
  },
  {
    label: t('configuration.reservation_type.delete'),
    icon: Trash2,
    handler: (item: any) => onAction('delete', item),
    variant: 'danger'
  }
])

// API Functions
const fetchReservationTypes = async () => {
  try {
    loading.value = true
    const response = await getReservationTypes()
    reservationTypes.value = response.data.data.data
  } catch (error) {
    console.error('Error fetching reservation types:', error)
    toast.error(t('configuration.reservation_type.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
  }
  showModal.value = true
}

const editReservationType = (reservationType: any) => {
  isEditing.value = true
  editingId.value = reservationType.id
  formData.value = {
    name: reservationType.name,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
  }
}

const saveReservationType = async () => {
  if (!formData.value.name.trim()) {
    toast.error(t('configuration.reservation_type.name_required'))
    return
  }

  try {
    saving.value = true
    const payload = {
      ...formData.value,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && editingId.value) {
      await updateReservationTypeById(editingId.value, payload)
      toast.success(t('configuration.reservation_type.update_success'))
    } else {
      await postReservationType(payload)
      toast.success(t('configuration.reservation_type.create_success'))
    }
    
    closeModal()
    await fetchReservationTypes()
  } catch (error) {
    console.error('Error saving reservation type:', error)
    toast.error(t('configuration.reservation_type.save_error'))
  } finally {
    saving.value = false
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editReservationType(item)
  } else if (action === 'delete') {
    handleDeleteType(item)
  }
}

// Mount hook
onMounted(() => {
  fetchReservationTypes()
})
</script>