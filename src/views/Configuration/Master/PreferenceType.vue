<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- ReusableTable with integrated header -->
      <ReusableTable :title="$t('configuration.preference_type.title')"
        :description="$t('configuration.preference_type.description')" :columns="columns" :data="preferenceTypes"
        :actions="actions" :loading="loading"
        :searchPlaceholder="$t('configuration.preference_type.search_placeholder')"
        :emptyStateTitle="$t('configuration.preference_type.empty_state_title')"
        :emptyStateMessage="$t('configuration.preference_type.empty_state_message')" :selectable="true"
        @action="onAction" @selection-change="onSelectionChange">
        <!-- Header Actions -->
        <template #header-actions>
          <BasicButton variant="primary" :icon="Plus"
            :label="$t('configuration.preference_type.add_preference_type')" @click="openAddModal" :disabled="loading" />
          <!-- Bulk Delete Button (Visible when items are selected) -->
          <BasicButton 
            v-if="selectedPreferences.length > 0" 
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
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ isEditing ? $t('configuration.preference_type.edit_preference_type') :
              $t('configuration.preference_type.add_preference_type') }}
          </h3>

          <form @submit.prevent="savePreferenceType">
            <!-- Name -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('configuration.preference_type.name') }} *
              </label>
              <Input v-model="formData.name" :placeholder="$t('configuration.preference_type.name_placeholder')"
                required />
            </div>

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
                :label="isEditing ? t('Update Type') : t('Add Type')"
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
        :title="t('Delete Preference Type')"
        :message="getSingleDeleteMessage()"
        :loading="isDeletingLoading"
        :confirm-text="t('delete')"
        :cancel-text="t('cancel')"
        @confirm="confirmDeleteSinglePreference"
        @close="closeSingleDeleteModal"
        action="DANGER"
      />

      <!-- Bulk Delete Confirmation Modal -->
      <ModalConfirmation
        v-if="showBulkDeleteModal"
        v-model="showBulkDeleteModal"
        :title="t('Delete Selected Preference Types')"
        :message="getBulkDeleteMessage()"
        :loading="isBulkDeletingLoading"
        :confirm-text="t('deleteSelected')"
        :cancel-text="t('cancel')"
        @confirm="confirmBulkDeletePreferences"
        @close="closeBulkDeleteModal"
        action="DANGER"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import ModalConfirmation from '../../../components/modal/ModalConfirmation.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import {
  getPreferenceTypes,
  postPreferenceType,
  updatePreferenceTypeById,
  deletePreferenceTypeById
} from '../../../services/configrationApi'
import { Plus, Trash2, Edit } from 'lucide-vue-next'

// Composables
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)
const saving = ref(false)
const preferenceTypes = ref([])

// Selection & Delete State
const selectedPreferences = ref([])
const preferenceToDelete = ref(null)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = ref({
  name: ''
})

// --- Message methods ---
const getSingleDeleteMessage = () => {
  if (!preferenceToDelete.value) return ''
  const preferenceName = preferenceToDelete.value.name
  return t('configuration.preference_type.delete_confirmation_message', { name: preferenceName })
}

const getBulkDeleteMessage = () => {
  const count = selectedPreferences.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const preferenceName = selectedPreferences.value[0].name
    return t('configuration.preference_type.delete_confirmation_message', { name: preferenceName })
  } else {
    return t('configuration.preference_type.bulk_delete_confirm', { count: count })
  }
}

// --- Handlers for Table and Modals ---
const onSelectionChange = (selected) => {
  selectedPreferences.value = selected
}

// Single Delete Handlers
const handleDeletePreference = (preference) => {
  preferenceToDelete.value = preference
  showDeleteModal.value = true
}

const confirmDeleteSinglePreference = async () => {
  if (!preferenceToDelete.value || !preferenceToDelete.value.id) return

  isDeletingLoading.value = true
  try {
    await deletePreferenceTypeById(preferenceToDelete.value.id)
    await fetchPreferenceTypes()
    toast.success(t('configuration.preference_type.delete_success'))
  } catch (error) {
    console.error('Error deleting preference type:', error)
    toast.error(t('configuration.preference_type.delete_error'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  preferenceToDelete.value = null
}

// Bulk Delete Handlers
const handleDeleteSelected = () => {
  if (selectedPreferences.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDeletePreferences = async () => {
  if (selectedPreferences.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedPreferences.value.map(preference =>
      deletePreferenceTypeById(preference.id)
    )
    await Promise.all(deletePromises)

    await fetchPreferenceTypes()
    selectedPreferences.value = []
    toast.success(t('configuration.preference_type.bulk_delete_success', { count: deletePromises.length }))
  } catch (error) {
    console.error('Error deleting preference type(s):', error)
    toast.error(t('configuration.preference_type.delete_error'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Table configuration
const columns = computed(() => [
  { key: 'name', label: t('configuration.preference_type.name'), type: 'text' },
  { key: 'createdInfo', label: t('configuration.preference_type.created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.preference_type.modified_by'), type: 'custom' }
])

const actions = computed(() => [
  {
    label: t('configuration.preference_type.edit'),
    icon: Edit,
    handler: (item) => onAction('edit', item),
    variant: 'primary'
  },
  {
    label: t('configuration.preference_type.delete'),
    icon: Trash2,
    handler: (item) => onAction('delete', item),
    variant: 'danger'
  }
])

// Functions
const fetchPreferenceTypes = async () => {
  try {
    loading.value = true
    const response = await getPreferenceTypes()
    preferenceTypes.value = response.data.data.data || []
  } catch (error) {
    console.error('Error fetching preference types:', error)
    toast.error(t('configuration.preference_type.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: ''
  }
  showModal.value = true
}

const editPreferenceType = (item) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    name: item.name
  }
  showModal.value = true
}

const savePreferenceType = async () => {
  try {
    saving.value = true

    if (isEditing.value) {
      // Update existing preference type
      await updatePreferenceTypeById(editingId.value, formData.value)
      toast.success(t('configuration.preference_type.update_success'))
    } else {
      // Create new preference type
      const payload = {
        ...formData.value,
        hotelId: serviceStore.serviceId
      }
      await postPreferenceType(payload)
      toast.success(t('configuration.preference_type.create_success'))
    }

    closeModal()
    await fetchPreferenceTypes()
  } catch (error) {
    console.error('Error saving preference type:', error)
    toast.error(t('configuration.preference_type.save_error'))
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: ''
  }
}

const onAction = (action, item) => {
  if (action === 'edit') {
    editPreferenceType(item)
  } else if (action === 'delete') {
    handleDeletePreference(item)
  }
}

// Lifecycle
onMounted(() => {
  fetchPreferenceTypes()
})
</script>