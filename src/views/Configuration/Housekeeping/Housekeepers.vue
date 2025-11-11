<template>
  <ConfigurationLayout>
    <div class="p-6 dark:text-gray-100">

      <ReusableTable
        :title="$t('housekeepers')"
        :columns="columns"
        :data="housekeepers"
        :actions="actions"
        :searchable="false"
        :loading="isLoading"
        :search-placeholder="$t('Search housekeepers...')"
        :empty-state-title="$t('No housekeepers found')"
        :meta="paginationMeta"
        @page-change="handlePageChange"
        :empty-state-description="$t('Get started by adding your first housekeeper.')"

        @action="onAction"
      >
      <template #header-actions>
         <BasicButton
          variant="primary"
          @click="openAddModal"
          :icon="Plus"
          :label="$t('Add Housekeeper')"
        />
      </template>
        <template #status="{ item }">
          <span
            :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              item.status === 'Active' || item.status === $t('Active')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            ]"
          >
            {{ item.status === 'Active' ? $t('Active') : item.status }}
          </span>
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

          <template #column-status="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ $t(`${item.status}`) }}</div>
            </div>
          </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 dark:bg-black/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ isEditing ? $t('Edit Housekeeper') : $t('Add Housekeeper') }}
          </h3>

  <form @submit.prevent="saveHousekeeper">
            <div class="mb-4">
              <Input
                v-model="formData.name"
                :lb="$t('housekeeperName')"
                type="text"
                :placeholder="$t('Enter housekeeper name')"
                isRequired
              />
            </div>

            <div class="mb-4">
              <InputPhone
                v-model="formData.mobile"
                :label="$t('Mobile Number')"
                :title="$t('Mobile Number')"
                :placeholder="$t('Enter mobile number')"
                isRequired
              />
            </div>

           <div class="flex justify-end space-x-3 mt-6">
              <BasicButton
                type="button"
                variant="outline"
                @click="closeModal"
                :label="$t('cancel')"
                :disabled="isSaving"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :label="isSaving ? $t('saving') + '...' : isEditing ? $t('update') : $t('save')"
                :loading="isSaving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
      <ConfirmationModal
        v-model:show="showDeleteModal"
        :title="t('confirmDelete')"
        :message="
          t('Are you sure you want to delete this housekeeper?')"
        :confirm-text="$t('Confirm')"
        :cancel-text="$t('Cancel')"
        variant="danger"
        :loading="isDeleting"
        @confirm="confirmDelete"
        @cancel="showDeleteModal=false"
      />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { Edit, Plus, Save, Trash2 } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import InputPhone from '../../../components/forms/FormElements/InputPhone.vue'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useToast } from 'vue-toastification'
import {
  getHousekeepers,
  postHousekeeper,
  updateHousekeeperById,
  deleteHousekeeperById
} from '@/services/configrationApi'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

// Reactive data
const { t } = useI18n()
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const isLoading = ref(false)
const serviceStore = useServiceStore()
const isSaving = ref(false)
const isDeleting = ref(false)
const showDeleteModal = ref(false)
const toast = useToast()
const paginationMeta = ref<any>(null)
const deleteItem = ref<any>(null)

const formData = reactive({
  name: '',
  mobile: ''
})

// Table configuration
const columns = computed<Column[]>(() => [
  { key: 'name', label: t('Housekeeper'), type: 'text' },
  { key: 'mobile', label: t('mobile'), type: 'text' },
  { key: 'createdInfo', label: t('Created By'), type: 'custom' },
  { key: 'modifiedInfo', label: t('Modified By'), type: 'custom' },
  { key: 'status', label: t('Status'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  {
    label: t('Edit'),
    handler: (item: any) => editHousekeeper(item),
    variant: 'primary',
    icon:Edit
  },
  {
    label: t('Delete'),
    handler: (item: any) => deleteHousekeeper(item),
    variant: 'danger',
    icon:Trash2
  }
])

const housekeepers = ref<any[]>([])

const fetchHousekeepers = async (pageNumber=1) => {
  try {
    isLoading.value = true

    const params = {
      hotelId : serviceStore.serviceId,
      page:pageNumber,
      limit:10
    }
    // const hotelId = serviceStore.serviceId
    const resp = await getHousekeepers(params)
    const data = resp?.data?.data?.data ?? resp?.data ?? []
    paginationMeta.value = resp?.data?.data?.meta
    console.log('data', resp)
    housekeepers.value = Array.isArray(data)
      ? data.map((h: any) => ({
      ...h,
          id: h.id,
          name: h.name,
          mobile: h.phone ?? h.mobile ?? '',
          status: h.status ?? 'Active',
        }))
      : []
  } catch (e) {
    console.error('Failed to fetch housekeepers', e)
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page:number) =>{
  fetchHousekeepers(page)
}

onMounted(() => {
  fetchHousekeepers(1)
})

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.mobile = ''
  showModal.value = true
}

const editHousekeeper = (housekeeper: any) => {
  isEditing.value = true
  editingId.value = housekeeper.id
  formData.name = housekeeper.name
  formData.mobile = housekeeper.mobile
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.mobile = ''
}

const saveHousekeeper = async () => {
  try {
    isSaving.value = true
    const hotelId = serviceStore.serviceId as number
    if (isEditing.value && editingId.value) {
      await updateHousekeeperById(editingId.value, {
        name: formData.name,
        phone: formData.mobile,
      })
      toast.success(t('Housekeeper updated successfully'))
    } else {
      await postHousekeeper({
        hotel_id: hotelId,
        name: formData.name,
        phone: formData.mobile,
      })
      toast.success(t('Housekeeper created successfully'))
    }
    closeModal()
    await fetchHousekeepers(1)
  } catch (e) {
    console.error('Failed to save housekeeper', e)
    toast.error(t('Failed to save housekeeper'))
  } finally {
    isSaving.value = false
  }
}

const deleteHousekeeper =  (item: any) => {
  deleteItem.value = item
  showDeleteModal.value = true
}
const confirmDelete = async() =>{
  try {
    isDeleting.value = true
    await deleteHousekeeperById(deleteItem.value.id)
     deleteItem.value = null
    showDeleteModal.value = false
    toast.success(t('Housekeeper deleted successfully'))
    await fetchHousekeepers(1)
  } catch (e) {
    console.error('Failed to delete housekeeper', e)
    toast.error(t('Failed to delete housekeeper'))
  } finally {
    isDeleting.value = false
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
