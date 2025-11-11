<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable :title="t('configuration.transportation_mode.table_title')" :columns="columns"
        :data="transportationModes" :actions="actions"
        :search-placeholder="t('configuration.transportation_mode.search_placeholder')" :selectable="false"
        :empty-state-title="t('configuration.transportation_mode.empty_state_title')"
        :empty-state-message="t('configuration.transportation_mode.empty_state_message')" :loading="loading"
        :meta="paginationMeta" @page-change="handlePageChange"
        @action="onAction">
        <template #header-actions>
          <BasicButton variant="primary" :icon="PlusIcon"
            :label="t('configuration.transportation_mode.add_transportation_mode')" :disabled="loading"
            @click="openAddModal" />
        </template>
        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.creator?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.modifier?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? t('configuration.transportation_mode.edit_transportation_mode') :
              t('configuration.transportation_mode.add_new_transportation_mode') }}
          </h3>

          <form @submit.prevent="saveTransportationMode" class="space-y-4">
            <Input :lb="t('configuration.transportation_mode.transportation_mode_name')" :inputType="'text'"
              :isRequired="true" v-model="formData.name"
              :placeholder="t('configuration.transportation_mode.transportation_mode_placeholder')" />

            <Input :lb="t('configuration.transportation_mode.description')" :inputType="'text'"
              v-model="formData.description"
              :placeholder="t('configuration.transportation_mode.description_placeholder')" />
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton type="button" variant="outline" @click="closeModal"
                :label="t('configuration.transportation_mode.cancel')" :disabled="saving" />
              <BasicButton type="submit" variant="primary"
                :label="isEditing ? t('configuration.transportation_mode.update_transportation_mode') : t('configuration.transportation_mode.save_transportation_mode')"
                :loading="saving" />
            </div>
          </form>
        </div>
      </div>
    </div>
     <ConfirmationModal
        v-model:show="showDeleteModal"
        :title="t('configuration.transportation_mode.delete_title')"
        :message="t('configuration.transportation_mode.delete_confirm', { name : deleteItem?.name })"
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
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import type { Action, Column } from '../../../utils/models'
import PlusIcon from '../../../icons/Plus.vue'
import {
  getTransportationModes,
  postTransportationMode,
  updateTransportationModeById,
  deleteTransportationModeById
} from '@/services/configrationApi'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import { Edit, Trash2 } from 'lucide-vue-next'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

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
const showDeleteModal = ref(false)
const transportationModes = ref([])
const paginationMeta = ref<any>(null)
const deleteItem = ref<any>(null)
const isDeleting = ref(false)

const formData = ref({
  id: null,
  name: '',
  description: '',
})


const columns = computed((): Column[] => [
  { key: 'name', label: t('configuration.transportation_mode.transportation_mode_name'), type: 'text' },
  { key: 'description', label: t('configuration.transportation_mode.description'), type: 'text' },
  { key: 'createdInfo', label: t('configuration.transportation_mode.created_by'), type: 'custom', },
  { key: 'modifiedInfo', label: t('configuration.transportation_mode.modified_by'), type: 'custom' },
])

const actions = computed((): Action[] => [
  {
    label: t('configuration.transportation_mode.edit'),
    handler: (item: any) => editTransportationMode(item),
    variant: 'primary',
    icon:Edit
  },
  {
    label: t('configuration.transportation_mode.delete'),
    handler: (item: any) => deleteTransportationMode(item),
    variant: 'danger',
    icon:Trash2
  }
])

// API Functions
const fetchTransportationModes = async (pageNumber=1) => {
  try {
    const hotelId = serviceStore.serviceId
    loading.value = true
    const response = await getTransportationModes(hotelId!,{page:pageNumber,limit:10})
    transportationModes.value = response.data.data.data
    paginationMeta.value = response.data.data.meta
    console.log('data', transportationModes)
  } catch (error) {
    console.error('Error fetching transportation modes:', error)
    toast.error(t('configuration.transportation_mode.fetch_error'))
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
  }
}

const saveTransportationMode = async () => {
  try {
    saving.value = true
    const transportationModeData = {
      name: formData.value.name,
      description: formData.value.description,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && editingId.value) {
      await updateTransportationModeById(editingId.value, transportationModeData)
      toast.success(t('configuration.transportation_mode.update_success'))
    } else {
      await postTransportationMode(transportationModeData)
      toast.success(t('configuration.transportation_mode.create_success'))
    }

    await fetchTransportationModes(1)
    closeModal()
  } catch (error) {
    console.error('Error saving transportation mode:', error)
    toast.error(t('configuration.transportation_mode.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteTransportationMode =  (item:any) => {
  deleteItem.value = item
  showDeleteModal.value = true

}

const confirmDelete = async() =>{
  try {
    isDeleting.value = true
    await deleteTransportationModeById(Number(deleteItem.value.id))
    deleteItem.value = null
    showDeleteModal.value = false
    toast.success(t('configuration.transportation_mode.delete_success'))
    await fetchTransportationModes(1)

  } catch (error) {
    console.error('Error deleting transportation mode:', error)
    toast.error(t('configuration.transportation_mode.delete_error'))
  }finally{
    isDeleting.value = false
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}

const handlePageChange = (page:number) =>{
  fetchTransportationModes(page)
}

// Lifecycle
onMounted(() => {
  fetchTransportationModes(1)
})
</script>
