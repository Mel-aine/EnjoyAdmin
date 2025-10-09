<template>
  <ConfigurationLayout>
    <div class="p-6">

      <ReusableTable
        title="Housekeepers"
        :columns="columns"
        :data="housekeepers"
        :actions="actions"
        :searchable="false"
        search-placeholder="Search housekeepers..."
        empty-state-title="No housekeepers found"
        empty-state-description="Get started by adding your first housekeeper."
        @action="onAction"
      >
      <template #header-actions>
         <BasicButton
          variant="primary"
          @click="openAddModal"
          :icon="Plus"
          label="Add Housekeeper"
        />
      </template>
        <template #status="{ item }">
          <span
            :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              item.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ item.status }}
          </span>
        </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Housekeeper' : 'Add Housekeeper' }}
          </h3>

  <form @submit.prevent="saveHousekeeper">
            <div class="mb-4">
              <Input
                v-model="formData.name"
                :lb="$t('housekeeperName')"
                type="text"
                placeholder="Enter housekeeper name"
                isRequired
              />
            </div>

            <div class="mb-4">
              <InputPhone
                v-model="formData.mobile"
                label="Mobile Number"
                title="Mobile Number"
                placeholder="Enter mobile number"
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
    <!-- Spinner overlay -->
    <Spinner v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50">
      <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </Spinner>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { Edit, Plus, Save } from 'lucide-vue-next'
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

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const isLoading = ref(false)
const serviceStore = useServiceStore()
const isSaving = ref(false)
const toast = useToast()

const formData = reactive({
  name: '',
  mobile: ''
})

// Table configuration
const columns :Column[] = [
  { key: 'name', label: 'Housekeeper', type: 'text' },
  { key: 'mobile', label: 'Mobile', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'modifiedBy', label: 'Modified By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions:Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editHousekeeper(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteHousekeeper(item.id),
    variant: 'danger'
  }
]

const housekeepers = ref<any[]>([])

const fetchHousekeepers = async () => {
  try {
    isLoading.value = true
    const hotelId = serviceStore.serviceId
    const resp = await getHousekeepers({ hotel_id: hotelId as number })
    const data = resp?.data?.data?.data ?? resp?.data ?? []
    housekeepers.value = Array.isArray(data)
      ? data.map((h: any) => ({
          id: h.id,
          name: h.name,
          mobile: h.phone ?? h.mobile ?? '',
          createdBy: h.createdBy ?? h.createdByUserId ?? '',
          modifiedBy: h.modifiedBy ?? h.updatedByUserId ?? '',
          status: h.status ?? 'Active',
        }))
      : []
  } catch (e) {
    console.error('Failed to fetch housekeepers', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchHousekeepers()
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
      toast.success('Housekeeper updated successfully')
    } else {
      await postHousekeeper({
        hotel_id: hotelId,
        name: formData.name,
        phone: formData.mobile,
      })
      toast.success('Housekeeper created successfully')
    }
    closeModal()
    await fetchHousekeepers()
  } catch (e) {
    console.error('Failed to save housekeeper', e)
    toast.error('Failed to save housekeeper')
  } finally {
    isSaving.value = false
  }
}

const deleteHousekeeper = async (id: number) => {
  try {
    if (!confirm('Are you sure you want to delete this housekeeper?')) return
    isLoading.value = true
    await deleteHousekeeperById(id)
    toast.success('Housekeeper deleted successfully')
    await fetchHousekeepers()
  } catch (e) {
    console.error('Failed to delete housekeeper', e)
    toast.error('Failed to delete housekeeper')
  } finally {
    isLoading.value = false
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>