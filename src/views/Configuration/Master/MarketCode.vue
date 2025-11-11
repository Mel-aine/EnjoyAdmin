<template>
  <ConfigurationLayout>
    <div class="p-6">


      <ReusableTable
        :title="t('configuration.market_code.table_title')"
        :columns="columns"
        :data="marketCodes"
        :actions="actions"
        :search-placeholder="t('configuration.market_code.search_placeholder')"
        :selectable="false"
        :empty-state-title="t('configuration.market_code.empty_state_title')"
        :empty-state-message="t('configuration.market_code.empty_state_message')"
        :loading="loading"
        @action="onAction"
        :meta="paginationMeta"
        @page-change="handlePageChange"
      >
        <template #header-actions>
          <BasicButton
            variant="primary"
            :icon="PlusIcon"
            :label="t('configuration.market_code.add_market_code')"
            @click="openAddModal"
          />
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.createdByUser?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{formatDateT( item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.updatedByUser?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{formatDateT( item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? t('configuration.market_code.edit_market_code') : t('configuration.market_code.add_new_market_code') }}
          </h3>

          <form @submit.prevent="saveMarketCode" class="space-y-4">
            <Input
              :lb="t('configuration.market_code.market_name')"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="t('configuration.market_code.market_name_placeholder')"
            />

            <Input
              :lb="t('configuration.market_code.market_code')"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.code"
              :placeholder="t('configuration.market_code.market_code_placeholder')"
            />

            <Select
              :lb="t('configuration.market_code.market_segment')"
              v-model="formData.segment"
              :options="segmentOptions"
              :defaultValue="t('configuration.market_code.market_segment_placeholder')"
            />

            <Input
              :lb="t('configuration.market_code.description')"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="t('configuration.market_code.description_placeholder')"
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
                :label="isEditing ? t('configuration.market_code.update_market_code') : t('configuration.market_code.save_market_code')"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
       <ConfirmationModal
        v-model:show="showDeleteConfirmation"
        :title="t('configuration.market_code.delete_confirmation_title')"
        :message="t('configuration.market_code.delete_confirmation_message', { name: marketCodeToDelete?.name || '' })"
        :confirm-text="$t('Confirm')"
        :cancel-text="$t('Cancel')"
        variant="danger"
        :loading="isDeleting"
        @confirm="deleteMarketCode"
        @cancel="showDeleteConfirmation = false"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import { useServiceStore } from '@/composables/serviceStore'
import {
  getMarketCodes,
  postMarketCode,
  updateMarketCodeById,
  deleteMarketCodeById
} from '@/services/configrationApi'
// Save icon removed as it's no longer used in the template
import type { Action, Column } from '../../../utils/models'
import PlusIcon from '../../../icons/PlusIcon.vue'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import { Edit, Trash2 } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const saving = ref(false)
const showDeleteConfirmation = ref(false)
const marketCodeToDelete = ref<any>(null)
const paginationMeta = ref<any>(null)
const marketCodes = ref([])
const isDeleting = ref(false)


const formData = ref({
  name: '',
  code: '',
  segment: '',
  description: ''
})

// Segment options
const segmentOptions = [
  { label: t('Business'), value: 'Business' },
  { label: t('Leisure'), value: 'Leisure' },
  { label: t('Group'), value: 'Group' },
  { label: t('OTA'), value: 'OTA' },
  { label: t('Government'), value: 'Government' },
  { label: t('Events'), value: 'Events' },
  { label: t('Other'), value: 'Other' }
]

// Computed properties
const columns = computed<Column[]>(() => [
  {
    key: 'name',
    label: t('Name'),
    sortable: true
  },
  {
    key: 'code',
    label: t('configuration.market_code.market_code'),
    sortable: true
  },
  {
    key: 'segment',
    label: t('segment'),
    sortable: true
  },
  {
    key: 'description',
    label: t('configuration.market_code.description'),
    sortable: true
  },
  {
    key: 'createdInfo',
    label: t('configuration.market_code.created_by'),
    sortable: false,
    type: 'custom'
  },
  {
    key: 'modifiedInfo',
    label: t('configuration.market_code.modified_by'),
    sortable: false,
    type: 'custom'
  }
])

const actions = computed(() => [
  {
    label: t('configuration.market_code.edit'),
    variant: 'primary',
    handler: (item: any) => editMarketCode(item),
    icon:Edit
  },
  {
    label: t('configuration.market_code.delete'),
    variant: 'danger',
    handler: (item: any) => confirmDeleteMarketCode(item),
    icon:Trash2
  }
])

// API Functions
const fetchMarketCodes = async (pageNumber=1) => {
  try {
    loading.value = true
    const response = await getMarketCodes({page:pageNumber,limit:10})
    marketCodes.value = response.data.data.data || []
    paginationMeta.value = response.data.data.meta || []
  } catch (error) {
    console.error('Error fetching market codes:', error)
    toast.error(t('configuration.market_code.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  formData.value = {
    name: '',
    code: '',
    segment: '',
    description: ''
  }
  isEditing.value = false
  editingId.value = null
  showModal.value = true
}

const editMarketCode = (marketCode: any) => {
  formData.value = {
    name: marketCode.name || '',
    code: marketCode.code || '',
    segment: marketCode.segment || '',
    description: marketCode.description || ''
  }
  isEditing.value = true
  editingId.value = marketCode.id
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    name: '',
    code: '',
    segment: '',
    description: ''
  }
  isEditing.value = false
  editingId.value = null
  saving.value = false
}

const saveMarketCode = async () => {
  try {
    saving.value = true

    const payload = {
      name: formData.value.name,
      code: formData.value.code,
      segment: formData.value.segment,
      description: formData.value.description,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value) {
      await updateMarketCodeById(editingId.value!, payload)
      toast.success(t('configuration.market_code.update_success'))
    } else {
      await postMarketCode(payload)
      toast.success(t('configuration.market_code.create_success'))
    }

    closeModal()
    await fetchMarketCodes(1)
  } catch (error) {
    console.error('Error saving market code:', error)
    const errorMessage = isEditing.value
      ? t('toast.updateError')
      : t('configuration.market_code.save_error')
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

const confirmDeleteMarketCode = (marketCode: any) => {
  marketCodeToDelete.value = marketCode
  showDeleteConfirmation.value = true
}

const deleteMarketCode = async () => {
  try {
    isDeleting.value = true
    await deleteMarketCodeById(marketCodeToDelete.value.id)
    toast.success(t('configuration.market_code.delete_success'))
    showDeleteConfirmation.value = false
    marketCodeToDelete.value = null
    await fetchMarketCodes(1)
  } catch (error) {
    console.error('Error deleting market code:', error)
    toast.error(t('configuration.market_code.delete_error'))
  }finally{
    isDeleting.value = false
    marketCodeToDelete.value = null
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editMarketCode(item)
  } else if (action === 'delete') {
    confirmDeleteMarketCode(item)
  }
}

const handlePageChange = (page:number) =>{
  fetchMarketCodes(page)
}

// Lifecycle
onMounted(() => {
  fetchMarketCodes(1)
})
</script>
