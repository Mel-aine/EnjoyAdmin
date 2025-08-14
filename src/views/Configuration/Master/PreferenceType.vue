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
        @action="onAction">
        <!-- Header Actions -->
        <template #header-actions>
          <BasicButton variant="primary" :icon="PlusIcon"
            :label="$t('configuration.preference_type.add_preference_type')" @click="openAddModal" />
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
              <BasicButton variant="secondary" @click="closeModal" type="button"
                :label="t('configuration.reservation_type.cancel')">
              </BasicButton>
              <BasicButton variant="primary" type="submit"
                :label="isEditing ? t('configuration.reservation_type.update') : t('configuration.reservation_type.save')"
                :icon="isEditing ? Edit : Save" :loading="saving" :disabled="saving">
              </BasicButton>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <ModalConfirmation v-if="showDeleteConfirmation"
        :title="$t('configuration.preference_type.delete_confirmation_title')"
        :message="$t('configuration.preference_type.delete_confirmation_message')" @confirm="confirmDelete"
        @close="cancelDelete" />
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
import PlusIcon from '../../../icons/PlusIcon.vue'

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
const showDeleteConfirmation = ref(false)
const preferenceTypeToDelete = ref(null)
const preferenceTypes = ref([])

// Form data
const formData = ref({
  name: ''
})

// Table configuration
const columns = computed(() => [
  { key: 'name', label: t('configuration.preference_type.name'), type: 'text' },
  { key: 'createdInfo', label: t('configuration.preference_type.created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.preference_type.modified_by'), type: 'custom' }
])

const actions = computed(() => [
  {
    label: t('configuration.preference_type.edit'),
    handler: (item) => editPreferenceType(item),
    variant: 'primary'
  },
  {
    label: t('configuration.preference_type.delete'),
    handler: (item) => confirmDeletePreferenceType(item),
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

const confirmDeletePreferenceType = (item) => {
  preferenceTypeToDelete.value = item
  showDeleteConfirmation.value = true
}

const confirmDelete = async () => {
  try {
    await deletePreferenceTypeById(preferenceTypeToDelete.value.id)
    toast.success(t('configuration.preference_type.delete_success'))
    showDeleteConfirmation.value = false
    preferenceTypeToDelete.value = null
    await fetchPreferenceTypes()
  } catch (error) {
    console.error('Error deleting preference type:', error)
    toast.error(t('configuration.preference_type.delete_error'))
  }
}

const cancelDelete = () => {
  showDeleteConfirmation.value = false
  preferenceTypeToDelete.value = null
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
  if (action.handler === 'edit') {
    editPreferenceType(item)
  } else if (action.handler === 'delete') {
    confirmDeletePreferenceType(item)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchPreferenceTypes()
})
</script>
