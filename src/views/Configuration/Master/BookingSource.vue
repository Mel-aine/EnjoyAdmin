<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <ReusableTable
          :title="t('configuration.booking_source.title')"
          :columns="columns"
          :data="bookingsSources"
          :actions="actions"
          :loading="loading"
          :meta="paginationMeta"
          @page-change="handlePageChange"
          :searchPlaceholder="t('configuration.booking_source.search_placeholder')"
          :selectable="false"
        >
          <template #header-actions>
            <BasicButton
              variant="primary"
              :icon="Plus"
              :label="t('configuration.booking_source.add_button')"
              @click="openAddModal"
            />
          </template>
          <template #column-status="{ item }">
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'text-sm rounded-full px-2',
                  item.isActive ? 'bg-green-100 text-green-500' : 'text-red-500 bg-red-100',
                ]"
                >{{ item.isActive ? $t('active') : $t('inactive') }}</span
              >
            </div>
          </template>

          <template #column-sourceType="{ item }">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-950 dark:text-gray-800">{{
                $t(`common.${item.sourceType}`)
              }}</span>
            </div>
          </template>
          <!-- Custom column for created info -->
          <template #column-createdInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.creator?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-400">
                {{ formatDateT(item.createdAt) }}
              </div>
            </div>
          </template>

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.modified?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-400">
                {{ formatDateT(item.updatedAt) }}
              </div>
            </div>
          </template>
        </ReusableTable>
      </div>

      <!-- Add/Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{
              isEditing
                ? t('configuration.booking_source.edit_title')
                : t('configuration.booking_source.add_title')
            }}
          </h3>

          <form @submit.prevent="saveBookingSource">
            <!-- Short Code -->
            <div class="mb-4">
              <Input
                type="text"
                v-model="formData.sourceCode"
                :placeholder="t('configuration.booking_source.short_code_placeholder')"
                :lb="t('configuration.booking_source.short_code')"
                isRequired
                maxlength="10"
              />
            </div>

            <!-- Booking Source Name -->
            <div class="mb-4">
              <Input
                type="text"
                v-model="formData.sourceName"
                :placeholder="t('configuration.booking_source.name_placeholder')"
                :lb="t('configuration.booking_source.name')"
                isRequired
              />
            </div>

            <!-- Source type -->
            <div class="mb-4">
              <Select
                v-model="formData.sourceType"
                :placeholder="t('configuration.booking_source.source_type_placeholder')"
                :lb="t('configuration.booking_source.sourceType')"
                :options="SourceTypes"
                isRequired
              />
            </div>

            <div>
              <Input
                :lb="$t('configuration.booking_source.priority')"
                :inputType="'number'"
                min="1"
                v-model.number="formData.priority"
              />
            </div>

            <div>
              <label class="block text-sm font-medium dark:text-white text-gray-700 mb-1.5">{{
                $t('Description')
              }}</label>
              <textarea
                v-model="formData.description"
                rows="2"
                class="w-full px-3 py-2 border border-black/50 rounded-lg focus:border-purple-500 focus:outline-none focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 resize-none"
                :placeholder="$t('Description')"
              ></textarea>
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
                :label="
                  isEditing
                    ? t('configuration.booking_source.update_booking_source')
                    : t('configuration.booking_source.save_booking_source')
                "
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        v-model:show="showDeleteModal"
        :title="t('configuration.booking_source.delete_confirmation_title')"
        :message="
          t('configuration.booking_source.delete_confirmation_message', {
            name: deleteItemId?.sourceName,
          })
        "
        :confirm-text="$t('Confirm')"
        :cancel-text="$t('Cancel')"
        variant="danger"
        :loading="isDeleting"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import * as configrationApi from '../../../services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { Action, Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import Select from '../../../components/forms/FormElements/Select.vue'
import { Edit, Trash2 } from 'lucide-vue-next'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

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
const isDeleting = ref(false)
const deleteItemId = ref<any>(null)
const paginationMeta = ref<any>(null)

// Data
const bookingsSources = ref([])

// Form data
const formData = ref({
  sourceName: '',
  sourceCode: '',
  priority: 1,
  sourceType: 'walk_in',
  description: '',
})

// source types options
const SourceTypes = computed(() => [
  { value: 'direct', label: t('common.direct') },
  { value: 'ota', label: t('common.ota') },
  { value: 'gds', label: t('common.gds') },
  { value: 'travel_agent', label: t('common.travelAgent') },
  { value: 'corporate', label: t('common.corporate') },
  { value: 'phone', label: t('common.phone') },
  { value: 'walk_in', label: t('common.walk_in') },
  { value: 'email', label: t('common.email') },
  { value: 'website', label: t('common.website') },
])

// Table configuration
const columns: Column[] = [
  { key: 'sourceName', label: t('configuration.booking_source.bookingSourceName'), type: 'text' },
  { key: 'sourceCode', label: t('Short Code'), type: 'text' },
  { key: 'sourceType', label: t('configuration.booking_source.sourceType'), type: 'custom' },
  { key: 'priority', label: t('configuration.booking_source.priority'), type: 'text' },
  { key: 'status', label: t('status'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.booking_source.modifiedInfo'), type: 'custom' },
  { key: 'createdInfo', label: t('configuration.booking_source.createdInfo'), type: 'custom' },
]
const actions: Action[] = [
  {
    label: t('common.edit'),
    handler: (item) => editBookingSource(item),
    variant: 'primary',
    icon: Edit,
  },
  {
    label: t('common.delete'),
    handler: (item) => deleteBookingSource(item),
    variant: 'danger',
    icon: Trash2,
  },
]
// Load booking sources data
const loadbookingsSources = async (pageNumber = 1) => {
  loading.value = true
  try {
    const response = await configrationApi.getBookingSources({ page: pageNumber, limit: 10 })
    console.log('data', response)
    bookingsSources.value = response.data.data.data || []
    paginationMeta.value = response.data.data.meta || []
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
    sourceName: '',
    sourceCode: '',
    priority: 1,
    sourceType: '',
    description: '',
  }
  showModal.value = true
}

const editBookingSource = (item: any) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    sourceName: item.sourceName || '',
    sourceCode: item.sourceCode || '',
    priority: item.priority || 1,
    sourceType: item.sourceType || '',
    description: item.description || '',
  }
  showModal.value = true
}

const saveBookingSource = async () => {
  saving.value = true
  try {
    const payload = {
      ...formData.value,
      isActive: true,
      hotelId: serviceStore.serviceId,
    }
    console.log('payload', payload)

    if (isEditing.value) {
      await configrationApi.updateBookingSourceById(editingId.value!, payload)
      toast.success(t('configuration.booking_source.update_success'))
    } else {
      await configrationApi.postBookingSource(payload)
      toast.success(t('configuration.booking_source.create_success'))
    }

    closeModal()
    await loadbookingsSources(1)
  } catch (error) {
    console.error('Error saving booking source:', error)
    toast.error(t('configuration.booking_source.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteBookingSource = (item: string) => {
  deleteItemId.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    isDeleting.value = true
    await configrationApi.deleteBookingSourceById(Number(deleteItemId.value.id))
    toast.success(t('configuration.booking_source.delete_success'))
    showDeleteModal.value = false
    deleteItemId.value = null
    await loadbookingsSources(1)
  } catch (error) {
    console.error('Error deleting booking source:', error)
    toast.error(t('configuration.booking_source.delete_error'))
  } finally {
    isDeleting.value = false
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
    sourceName: '',
    sourceCode: '',
    priority: 1,
    sourceType: '',
    description: '',
  }
}

const handlePageChange = (page:number) => {
  loadbookingsSources(page)
}

// Load data on component mount
onMounted(() => {
  loadbookingsSources(1)
})
</script>
