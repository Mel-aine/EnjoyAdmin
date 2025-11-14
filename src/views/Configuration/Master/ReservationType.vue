<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable :title="t('configuration.reservation_type.title')"
        :description="t('configuration.reservation_type.description')" :columns="columns" :data="reservationTypes"
        :actions="actions" :search-placeholder="t('configuration.reservation_type.search_placeholder')"
        :selectable="false" :empty-state-title="t('configuration.reservation_type.empty_state_title')"
        :empty-state-message="t('configuration.reservation_type.empty_state_message')" :loading="loading"
        @action="onAction" :meta="paginationMeta" @page-change="handlePageChange">
        <template #header-actions>
          <BasicButton variant="primary" :icon="PlusIcon"
            :label="t('configuration.reservation_type.add_reservation_type')" @click="openAddModal" />
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

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? t('configuration.reservation_type.edit_reservation_type') :
              t('configuration.reservation_type.add_reservation_type') }}
          </h3>

          <form @submit.prevent="saveReservationType" class="space-y-4">
            <Input :lb="t('configuration.reservation_type.name')" :inputType="'text'" :isRequired="true"
              v-model="formData.name" :placeholder="t('configuration.reservation_type.name_placeholder')" />

            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="t('cancel')"
                :disabled="saving" />
              <BasicButton type="submit" variant="primary"
                :label="isEditing ? t('configuration.reservation_type.update') : t('configuration.reservation_type.save')"
                :loading="saving" />
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->


        <ConfirmationModal
        v-model:show="showDeleteConfirmation"
        :title="t('configuration.reservation_type.delete_confirmation_title')"
        :message="t('configuration.reservation_type.delete_confirmation_message')"
        :confirm-text="$t('Confirm')"
        :cancel-text="$t('Cancel')"
        variant="danger"
        :loading="isDeleting"
        @confirm="deleteReservationType"
        @cancel="showDeleteConfirmation = false"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import { useServiceStore } from '@/composables/serviceStore'
import type { Action, Column } from '../../../utils/models'
// Icons removed as they're no longer used in the template
import {
  getReservationTypes,
  postReservationType,
  updateReservationTypeById,
  deleteReservationTypeById
} from '@/services/configrationApi'
import PlusIcon from '../../../icons/Plus.vue'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import { Edit, Trash2 } from 'lucide-vue-next'

// Initialize composables
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
const isDeleting = ref(false)
const reservationTypeToDelete = ref<any>(null)
const paginationMeta = ref<any>(null)

const reservationTypes = ref<any[]>([])

const formData = ref({
  name: '',
})




// Table configuration
const columns = computed((): Column[] => [
  { key: 'name', label: t('configuration.reservation_type.name'), type: 'text' },
  { key: 'createdInfo', label: t('created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('modified_by'), type: 'custom' },
])

const actions = computed((): Action[] => [
  {
    label: t('configuration.reservation_type.edit'),
    handler: (item: any) => editReservationType(item),
    variant: 'primary',
    icon:Edit
  },
  {
    label: t('configuration.reservation_type.delete'),
    handler: (item: any) => confirmDeleteReservationType(item),
    variant: 'danger',
    icon:Trash2
  }
])

// API Functions
const fetchReservationTypes = async (pageNumber=1) => {
  try {
    loading.value = true
    const response = await getReservationTypes({page:pageNumber,limit:10})
    reservationTypes.value = response.data.data.data
    paginationMeta.value = response.data.data.meta
  } catch (error) {
    console.error('Error fetching reservation types:', error)
    toast.error(t('configuration.reservation_type.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
  }
  showModal.value = true
}

const editReservationType = (reservationType: any) => {
  isEditing.value = true
  editingId.value = reservationType.id
  formData.value = {
    name: reservationType.name,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
  }
}

const saveReservationType = async () => {
  if (!formData.value.name.trim()) {
    toast.error(t('configuration.reservation_type.name_required'))
    return
  }

  try {
    saving.value = true
    const payload = {
      ...formData.value,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && editingId.value) {
      await updateReservationTypeById(editingId.value, payload)
      toast.success(t('configuration.reservation_type.update_success'))
    } else {
      await postReservationType(payload)
      toast.success(t('configuration.reservation_type.create_success'))
    }

    closeModal()
    await fetchReservationTypes(1)
  } catch (error) {
    console.error('Error saving reservation type:', error)
    toast.error(t('configuration.reservation_type.save_error'))
  } finally {
    saving.value = false
  }
}

const confirmDeleteReservationType = (reservationType: any) => {
  reservationTypeToDelete.value = reservationType
  showDeleteConfirmation.value = true
}

const deleteReservationType = async () => {
  if (!reservationTypeToDelete.value) return

  try {
    isDeleting.value = true
    await deleteReservationTypeById(reservationTypeToDelete.value.id)
    toast.success(t('configuration.reservation_type.delete_success'))
    showDeleteConfirmation.value = false
    reservationTypeToDelete.value = null
    await fetchReservationTypes(1)
  } catch (error) {
    console.error('Error deleting reservation type:', error)
    toast.error(t('configuration.reservation_type.delete_error'))
  }finally{
    isDeleting.value = false
    reservationTypeToDelete.value = null
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editReservationType(item)
  } else if (action === 'delete') {
    confirmDeleteReservationType(item)
  }
}

const handlePageChange = (page:any) =>{
  fetchReservationTypes(page)
}

// Mount hook
onMounted(() => {
  fetchReservationTypes(1)
})
</script>
