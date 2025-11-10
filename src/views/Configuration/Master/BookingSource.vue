<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <ReusableTable :title="t('configuration.booking_source.title')" :columns="columns" :data="bookingsSources"
          :actions="actions" :loading="loading"
          :searchPlaceholder="t('configuration.booking_source.search_placeholder')" :selectable="false">

          <template #header-actions>
            <BasicButton variant="primary" :icon="Plus" :label="t('configuration.booking_source.add_button')"
              @click="openAddModal" />
          </template>
          <template #column-color="{ item }">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded border border-gray-300 dark:border-gray-700" :style="{ backgroundColor: item.color }"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ item.color }}</span>
            </div>
          </template>
          <!-- Custom column for created info -->
          <template #column-createdInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.createdByUser?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.createdAt) }}</div>
            </div>
          </template>

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.updatedByUser?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
            </div>
          </template>
        </ReusableTable>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ isEditing ? t('configuration.booking_source.edit_title') : t('configuration.booking_source.add_title')
            }}
          </h3>

          <form @submit.prevent="saveBookingSource">
            <!-- Short Code -->
            <div class="mb-4">
              <Input type="text" v-model="formData.shortCode"
                :placeholder="t('configuration.booking_source.short_code_placeholder')"
                :lb="t('configuration.booking_source.short_code')" isRequired maxlength="10" />
            </div>

            <!-- Booking Source Name -->
            <div class="mb-4">
              <Input type="text" v-model="formData.name"
                :placeholder="t('configuration.booking_source.name_placeholder')"
                :lb="t('configuration.booking_source.name')" isRequired />
            </div>

            <!-- Color -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('configuration.booking_source.color') }}
              </label>
              <input type="color" v-model="formData.color"
                class="w-16 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <!-- Registration Number -->
            <div class="mb-4">
              <Input type="text" v-model="formData.registrationNumber"
                :placeholder="t('configuration.booking_source.registration_number_placeholder')"
                :lb="t('configuration.booking_source.registration_number')" isRequired />
            </div>

            <!-- Market Code -->
            <div class="mb-6">
              <Select v-model="formData.marketCodeId" :options="marketCodeOptions"
                :placeholder="t('configuration.booking_source.market_code_placeholder')"
                :lb="t('configuration.booking_source.market_code')" isRequired />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="t('cancel')"
                :disabled="saving" />
              <BasicButton type="submit" variant="primary"
                :label="isEditing ? t('configuration.payment_method.update_payment_method') : t('configuration.payment_method.save_payment_method')"
                :loading="saving" />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <ModalConfirmation v-if="showDeleteModal" :title="t('configuration.booking_source.delete_confirmation_title')"
        :message="t('configuration.booking_source.delete_confirmation_message')" :confirmText="t('common.delete')"
        :cancelText="t('common.cancel')" action="DANGER" @confirm="confirmDelete" @close="cancelDelete" />
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
import Plus from '../../../icons/Plus.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import Select from '../../../components/forms/FormElements/Select.vue'

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
const deleteItemId = ref<any>(null)

// Data
const bookingsSources = ref([])

// Form data
const formData = ref({
  name: '',
  shortCode: '',
  color: '#000000',
  registrationNumber: '',
  marketCodeId: ''
})

// Market code options
const marketCodeOptions = ref<any>([
])

// Table configuration
const columns: Column[] = [
  { key: 'sourceName', label: 'Booking Source Name', type: 'text' },
  { key: 'sourceCode', label: 'Short Code', type: 'text' },
  { key: 'sourceType', label: 'sourceType', type: 'custom' },
  { key: 'priority', label: 'priority', type: 'text' },
  { key: 'isActive', label: 'status', type: 'text' },
  { key: 'modifiedInfo', label: 'Modified Info', type: 'custom' },
  { key: 'createdInfo', label: 'Created Info', type: 'custom' }
]
const actions: Action[] = [
  {
    label: t('common.edit'),
    handler: (item) => editBookingSource(item),
    variant: 'primary'
  },
  {
    label: t('common.delete'),
    handler: (item) => deleteBookingSource(item.id),
    variant: 'danger'
  }
]
// Load booking sources data
const loadbookingsSources = async () => {
  loading.value = true
  try {
    const response = await configrationApi.getBookingSources()
    console.log('data', response)
    bookingsSources.value = response.data.data.data || []
  } catch (error) {
    console.error('Error loading booking sources:', error)
    toast.error(t('configuration.booking_source.fetch_error'))
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

const editBookingSource = (item: any) => {
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

const saveBookingSource = async () => {
  saving.value = true
  try {
    const payload = {
      ...formData.value,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value) {
      await configrationApi.updateBookingSourceById(editingId.value!, payload)
      toast.success(t('configuration.booking_source.update_success'))
    } else {
      await configrationApi.postBookingSource(payload)
      toast.success(t('configuration.booking_source.create_success'))
    }

    closeModal()
    await loadbookingsSources()
  } catch (error) {
    console.error('Error saving booking source:', error)
    toast.error(t('configuration.booking_source.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteBookingSource = (id: string) => {
  deleteItemId.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await configrationApi.deleteBookingSourceById(deleteItemId.value)
    toast.success(t('configuration.booking_source.delete_success'))
    showDeleteModal.value = false
    deleteItemId.value = null
    await loadbookingsSources()
  } catch (error) {
    console.error('Error deleting booking source:', error)
    toast.error(t('configuration.booking_source.delete_error'))
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
    marketCodeOptions.value = (response.data.data.data || []).map((e: any) => {
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
  loadbookingsSources();
  fetchMarketCode();
})
</script>
