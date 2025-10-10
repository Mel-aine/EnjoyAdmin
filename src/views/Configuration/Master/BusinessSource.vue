<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Table -->
      <div class="bg-white rounded-lg shadow">
        <ReusableTable
          :title="t('configuration.business_source.title')"
          :columns="columns"
          :data="businessSources"
          :actions="actions"
          :loading="loading"
          :searchPlaceholder="t('configuration.business_source.search_placeholder')"
          :selectable="true"
          @action="onAction"
          @selection-change="onSelectionChange"
        >
          <template #header-actions> 
            <BasicButton 
              variant="primary"
              :icon="Plus"
              :label="t('configuration.business_source.add_button')"
              @click="openAddModal"
              :disabled="loading"
            />
            <!-- Bulk Delete Button (Visible when items are selected) -->
            <BasicButton 
              v-if="selectedSources.length > 0" 
              @click="handleDeleteSelected" 
              :label="$t('deleteSelected')" 
              :icon="Trash2"
              variant="danger"
              :disabled="loading"
            />
          </template>
          
          <template #column-color="{ item }">
            <div class="flex items-center space-x-2">
              <div 
                class="w-6 h-6 rounded border border-gray-300" 
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="text-sm text-gray-600">{{ item.color }}</span>
            </div>
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
            {{ isEditing ? t('configuration.business_source.edit_title') : t('configuration.business_source.add_title') }}
          </h3>
          
          <form @submit.prevent="saveBusinessSource">
            <!-- Short Code -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('configuration.business_source.short_code') }} *
              </label>
              <input 
                type="text"
                v-model="formData.shortCode"
                :placeholder="t('configuration.business_source.short_code_placeholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                maxlength="10"
                required
              />
            </div>

            <!-- Business Source Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('configuration.business_source.name') }} *
              </label>
              <input 
                type="text"
                v-model="formData.name"
                :placeholder="t('configuration.business_source.name_placeholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <!-- Color -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('configuration.business_source.color') }}
              </label>
              <input 
                type="color"
                v-model="formData.color"
                class="w-16 h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Registration Number -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('configuration.business_source.registration_number') }}
              </label>
              <input 
                type="text"
                v-model="formData.registrationNumber"
                :placeholder="t('configuration.business_source.registration_number_placeholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Market Code -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('configuration.business_source.market_code') }}
              </label>
              <select 
                v-model="formData.marketCodeId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{{ t('configuration.business_source.market_code_placeholder') }}</option>
                <option v-for="option in marketCodeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
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
                :label="isEditing ? t('configuration.business_source.update_business_source') : t('configuration.business_source.save_business_source')"
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
        :title="t('Delete Business Source')"
        :message="getSingleDeleteMessage()"
        :loading="isDeletingLoading"
        :confirm-text="t('delete')"
        :cancel-text="t('cancel')"
        @confirm="confirmDeleteSingleSource"
        @close="closeSingleDeleteModal"
        action="DANGER"
      />

      <!-- Bulk Delete Confirmation Modal -->
      <ModalConfirmation
        v-if="showBulkDeleteModal"
        v-model="showBulkDeleteModal"
        :title="t('Delete Selected Business Sources')"
        :message="getBulkDeleteMessage()"
        :loading="isBulkDeletingLoading"
        :confirm-text="t('deleteSelected')"
        :cancel-text="t('cancel')"
        @confirm="confirmBulkDeleteSources"
        @close="closeBulkDeleteModal"
        action="DANGER"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import ModalConfirmation from '../../../components/modal/ModalConfirmation.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import * as configrationApi from '../../../services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { Action, Column } from '../../../utils/models'
import { Plus, Trash2, Edit } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)
const saving = ref(false)
const businessSources = ref([])

// Selection & Delete State
const selectedSources = ref<any[]>([])
const sourceToDelete = ref<any | null>(null)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = ref({
  name: '',
  shortCode: '',
  color: '#000000',
  registrationNumber: '',
  marketCodeId: ''
})

// Market code options
const marketCodeOptions = ref<any>([])

// --- Message methods ---
const getSingleDeleteMessage = () => {
  if (!sourceToDelete.value) return ''
  const sourceName = sourceToDelete.value.name
  return t('configuration.business_source.delete_message', { name: sourceName })
}

const getBulkDeleteMessage = () => {
  const count = selectedSources.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const sourceName = selectedSources.value[0].name
    return t('configuration.business_source.delete_message', { name: sourceName })
  } else {
    return t('configuration.business_source.bulk_delete_confirm', { count: count })
  }
}

// --- Handlers for Table and Modals ---
const onSelectionChange = (selected: any[]) => {
  selectedSources.value = selected
}

// Single Delete Handlers
const handleDeleteSource = (source: any) => {
  sourceToDelete.value = source
  showDeleteModal.value = true
}

const confirmDeleteSingleSource = async () => {
  if (!sourceToDelete.value || !sourceToDelete.value.id) return

  isDeletingLoading.value = true
  try {
    await configrationApi.deleteBusinessSourceById(sourceToDelete.value.id)
    await loadBusinessSources()
    toast.success(t('configuration.business_source.delete_success'))
  } catch (error) {
    console.error('Error deleting business source:', error)
    toast.error(t('configuration.business_source.delete_error'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  sourceToDelete.value = null
}

// Bulk Delete Handlers
const handleDeleteSelected = () => {
  if (selectedSources.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDeleteSources = async () => {
  if (selectedSources.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedSources.value.map(source =>
      configrationApi.deleteBusinessSourceById(source.id)
    )
    await Promise.all(deletePromises)

    await loadBusinessSources()
    selectedSources.value = []
    toast.success(t('configuration.business_source.bulk_delete_success', { count: deletePromises.length }))
  } catch (error) {
    console.error('Error deleting business source(s):', error)
    toast.error(t('configuration.business_source.delete_error'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Table configuration
const columns: Column[] = [
  { key: 'name', label: 'Business Source Name', type: 'text' },
  { key: 'shortCode', label: 'Short Code', type: 'text' },
  { key: 'color', label: 'Color', type: 'custom' },
  { key: 'registrationNumber', label: 'Registration Number', type: 'text' },
  { key: 'marketCode.name', label: 'Market Code', type: 'text' },
  { key: 'modifiedInfo', label: 'Modified Info', type: 'custom' },
  { key: 'createdInfo', label: 'Created Info', type: 'custom' }
]

const actions: Action[] = [
  {
    label: t('common.edit'),
    icon: Edit,
    handler: (item) => onAction('edit', item),
    variant: 'primary'
  },
  {
    label: t('common.delete'),
    icon: Trash2,
    handler: (item) => onAction('delete', item),
    variant: 'danger'
  }
]

// Load business sources data
const loadBusinessSources = async () => {
  loading.value = true
  try {
    const response = await configrationApi.getBusinessSources()
    console.log('data',response)
    businessSources.value = response.data.data.data || []
  } catch (error) {
    console.error('Error loading business sources:', error)
    toast.error(t('configuration.business_source.fetch_error'))
  } finally {
    loading.value = false
  }
}

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    shortCode: '',
    color: '#000000',
    registrationNumber: '',
    marketCodeId: ''
  }
  showModal.value = true
}

const editBusinessSource = (item:any) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    name: item.name || '',
    shortCode: item.shortCode || '',
    color: item.color || '#000000',
    registrationNumber: item.registrationNumber || '',
    marketCodeId: item.marketCodeId || ''
  }
  showModal.value = true
}

const saveBusinessSource = async () => {
  saving.value = true
  try {
    const payload = {
      ...formData.value,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value) {
      await configrationApi.updateBusinessSourceById(editingId.value!, payload)
      toast.success(t('configuration.business_source.update_success'))
    } else {
      await configrationApi.postBusinessSource(payload)
      toast.success(t('configuration.business_source.create_success'))
    }
    
    closeModal()
    await loadBusinessSources()
  } catch (error) {
    console.error('Error saving business source:', error)
    toast.error(t('configuration.business_source.save_error'))
  } finally {
    saving.value = false
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editBusinessSource(item)
  } else if (action === 'delete') {
    handleDeleteSource(item)
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    shortCode: '',
    color: '#000000',
    registrationNumber: '',
    marketCodeId: ''
  }
}

const fetchMarketCode = async () => {
  try {
    loading.value = true
    const response = await configrationApi.getMarketCodes();
    marketCodeOptions.value = (response.data.data.data || []).map((e:any)=>{
      return {
        label: e.name,
        value: e.id
      }
    })
  } catch (error) {
    console.error('Error fetching market codes:', error)
    toast.error(t('configuration.market_code.fetch_error'))
  } finally {
    loading.value = false
  }
}

// Load data on component mount
onMounted(() => {
  loadBusinessSources();
  fetchMarketCode();
})
</script>