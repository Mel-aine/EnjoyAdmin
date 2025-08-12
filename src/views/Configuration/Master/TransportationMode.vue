<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        :title="t('transportation_mode.table_title')"
        :columns="columns"
        :data="transportationModes"
        :actions="actions"
        :search-placeholder="t('transportation_mode.search_placeholder')"
        :selectable="false"
        :empty-state-title="t('transportation_mode.empty_state_title')"
        :empty-state-message="t('transportation_mode.empty_state_message')"
        :loading="loading"
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            :icon="Plus"
            :label="t('transportation_mode.add_transportation_mode')"
            :disabled="loading"
            @click="openAddModal"
          />
        </template>

        <template #column-status="{ item }">
          <span 
            :class="item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.status === 'active' ? t('transportation_mode.status_active') : t('transportation_mode.status_inactive') }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? t('transportation_mode.edit_transportation_mode') : t('transportation_mode.add_new_transportation_mode') }}
          </h3>
          
          <form @submit.prevent="saveTransportationMode" class="space-y-4">
            <Input 
              :lb="t('transportation_mode.transportation_mode_name')"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="t('transportation_mode.transportation_mode_placeholder')"
            />
            
            <Input 
              :lb="t('transportation_mode.description')"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="t('transportation_mode.description_placeholder')"
            />
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('transportation_mode.status') }}
              </label>
              <select 
                v-model="formData.status"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="" disabled>{{ t('transportation_mode.select_status') }}</option>
                <option 
                  v-for="option in statusOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                variant="secondary" 
                :label="t('transportation_mode.cancel')"
                @click="closeModal"
                type="button"
                :disabled="saving"
              />
              <BasicButton 
                variant="primary" 
                :label="saving ? t('transportation_mode.saving') : (isEditing ? t('transportation_mode.update_transportation_mode') : t('transportation_mode.save_transportation_mode'))"
                type="submit"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import type { Action, Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import {
  getTransportationModes,
  postTransportationMode,
  updateTransportationModeById,
  deleteTransportationModeById
} from '@/services/configrationApi'

// Composables
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const saving = ref(false)
const transportationModes = ref([])

const formData = ref({
  id: null,
  name: '',
  description: '',
  status: 'active'
})

// Computed properties
const statusOptions = computed(() => [
  { value: 'active', label: t('transportation_mode.status_active') },
  { value: 'inactive', label: t('transportation_mode.status_inactive') }
])

const columns = computed((): Column[] => [
  { key: 'name', label: t('transportation_mode.transportation_mode_name'), type: 'text' },
  { key: 'description', label: t('transportation_mode.description'), type: 'text' },
  { key: 'createdBy', label: t('transportation_mode.created_by'), type: 'text' },
  { key: 'modifiedBy', label: t('transportation_mode.modified_by'), type: 'text' },
  { key: 'status', label: t('transportation_mode.status'), type: 'custom' }
])

const actions = computed((): Action[] => [
  {
    label: t('transportation_mode.edit'),
    handler: (item: any) => editTransportationMode(item),
    variant: 'primary'
  },
  {
    label: t('transportation_mode.delete'),
    handler: (item: any) => deleteTransportationMode(item.id),
    variant: 'danger'
  }
])

// API Functions
const fetchTransportationModes = async () => {
  try {
    loading.value = true
    const response = await getTransportationModes()
    transportationModes.value = response.data
  } catch (error) {
    console.error('Error fetching transportation modes:', error)
    toast.error(t('transportation_mode.fetch_error'))
  } finally {
    loading.value = false
  }
}

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    id: null,
    name: '',
    description: '',
    status: 'active'
  }
  showModal.value = true
}

const editTransportationMode = (mode: any) => {
  isEditing.value = true
  editingId.value = mode.id
  formData.value = {
    id: mode.id,
    name: mode.name,
    description: mode.description,
    status: mode.status
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    id: null,
    name: '',
    description: '',
    status: 'active'
  }
}

const saveTransportationMode = async () => {
  try {
    saving.value = true
    const transportationModeData = {
      name: formData.value.name,
      description: formData.value.description,
      status: formData.value.status,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && editingId.value) {
      await updateTransportationModeById(editingId.value, transportationModeData)
      toast.success(t('transportation_mode.update_success'))
    } else {
      await postTransportationMode(transportationModeData)
      toast.success(t('transportation_mode.create_success'))
    }
    
    await fetchTransportationModes()
    closeModal()
  } catch (error) {
    console.error('Error saving transportation mode:', error)
    toast.error(t('transportation_mode.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteTransportationMode = async (id: number) => {
  if (confirm(t('transportation_mode.delete_confirm'))) {
    try {
      await deleteTransportationModeById(id)
      toast.success(t('transportation_mode.delete_success'))
      await fetchTransportationModes()
    } catch (error) {
      console.error('Error deleting transportation mode:', error)
      toast.error(t('transportation_mode.delete_error'))
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}

// Lifecycle
onMounted(() => {
  fetchTransportationModes()
})
</script>