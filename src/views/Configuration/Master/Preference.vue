<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Table -->
      <div class="bg-white rounded-lg shadow">
        <ReusableTable
                :title="$t('configuration.preference.title')"

          :columns="columns"
          :data="preferences"
          :actions="actions"
          :loading="loading"
          :searchPlaceholder="$t('configuration.preference.search_placeholder')"
          :selectable="true"
        >
        <template #header-actions>
          <BasicButton 
          variant="primary"
          :icon="Plus"
          :label="$t('configuration.preference.add_preference')"
          @click="openAddModal"
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
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ isEditing ? $t('configuration.preference.edit_preference') : $t('configuration.preference.add_preference') }}
          </h3>
          
          <form @submit.prevent="savePreference">
            <!-- Name -->
            <div class="mb-4">
              
              <Input 
                v-model="formData.name"
                :lb=" $t('configuration.preference.name')"
                :placeholder="$t('configuration.preference.name_placeholder')"
                :is-required="true"
                :disabled="saving"
              />
            </div>

            <!-- Preference Type ID -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('configuration.preference.preference_type') }} *
              </label>
              <Select 
                v-model="formData.preferenceTypeId"
                :options="preferenceTypeOptions"
                :placeholder="$t('configuration.preference.preference_type_placeholder')"
                required
                :disabled="saving || loadingPreferenceTypes"
              />
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
                :label="isEditing ? t('configuration.preference.update_preference') : t('configuration.preference.save_preference')"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Confirmation -->
      <ModalConfirmation
        v-if="showDeleteModal"
        :title="$t('configuration.preference.delete_confirmation_title')"
        :message="$t('configuration.preference.delete_confirmation_message')"
        :confirmText="$t('configuration.preference.delete')"
        :cancelText="$t('configuration.preference.cancel')"
        variant="danger"
        @confirm="confirmDelete"
        @close="cancelDelete"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { getPreferences, getPreferenceTypes, postPreference, updatePreferenceById } from '../../../services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import Plus from '../../../icons/Plus.vue'
// Edit and Save icons removed as they're no longer used in the template

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
// Reactive data
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)
const saving = ref(false)
const loadingPreferenceTypes = ref(false)
const deleteItemId = ref(null)

// Data
const preferences = ref([])
const preferenceTypes = ref([])

// Form data
const formData = ref({
  name: '',
  preferenceTypeId: null
})

// Computed
const preferenceTypeOptions = computed(() => {
  return preferenceTypes.value.map(type => ({
    label: type.name,
    value: type.id
  }))
})

// Table configuration
const columns = [
  { key: 'name', label: t('configuration.preference.name'), type: 'text' },
  { key: 'preferenceType.name', label: t('configuration.preference.preference_type'), type: 'text' },
  { key: 'createdInfo', label: t('created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('modified_by'), type: 'custom' }
]

const actions = [
  {
    label: t('configuration.preference.edit'),
    handler: (item) => editPreference(item),
    variant: 'primary'
  },
  {
    label: t('configuration.preference.delete'),
    handler: (item) => deletePreference(item.id),
    variant: 'danger'
  }
]

// Functions
const loadPreferences = async () => {
  try {
    loading.value = true
    const response = await getPreferences()
    preferences.value = response.data.data.data || []
  } catch (error) {
    console.error('Error loading preferences:', error)
    toast.error(t('preference.fetch_error'))
  } finally {
    loading.value = false
  }
}

const loadPreferenceTypes = async () => {
  try {
    loadingPreferenceTypes.value = true
    const response = await  getPreferenceTypes()
    preferenceTypes.value = response.data.data.data || []
  } catch (error) {
    console.error('Error loading preference types:', error)
    toast.error(t('preference_type.fetch_error'))
  } finally {
    loadingPreferenceTypes.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    preferenceTypeId: null
  }
  showModal.value = true
}

const editPreference = (item) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    name: item.name,
    preferenceTypeId: item.preferenceTypeId
  }
  showModal.value = true
}

const savePreference = async () => {
  try {
    saving.value = true
    
    const payload = {
      name: formData.value.name,
      preferenceTypeId: formData.value.preferenceTypeId,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value) {
      await updatePreferenceById(editingId.value, payload)
      toast.success(t('preference.update_success'))
    } else {
      await postPreference(payload)
      toast.success(t('preference.create_success'))
    }
    
    closeModal()
    await loadPreferences()
  } catch (error) {
    console.error('Error saving preference:', error)
    toast.error(t('preference.save_error'))
  } finally {
    saving.value = false
  }
}

const deletePreference = (id) => {
  deleteItemId.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await configrationApi.deletePreferenceById(deleteItemId.value)
    toast.success(t('preference.delete_success'))
    showDeleteModal.value = false
    deleteItemId.value = null
    await loadPreferences()
  } catch (error) {
    console.error('Error deleting preference:', error)
    toast.error(t('preference.delete_error'))
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  deleteItemId.value = null
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    preferenceTypeId: null
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadPreferences(),
    loadPreferenceTypes()
  ])
})
</script>
