<template>
  <ConfigurationLayout>
    <div class="p-6">
 <ReusableTable :title="$t('Units')" :columns="columns" :data="units" :actions="actions"
         :loading="loading"
         :search-placeholder="$t('Search units...')" :empty-state-title="$t('No units found')"
         :empty-state-description="$t('Get started by adding your first unit.')" @action="onAction">
          <template #header-actions>
            <BasicButton variant="primary" @click="openAddModal" :icon="Plus" :disabled="loading" :label="$t('Add Unit')" />
          </template>
          <template #status="{ item }">
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              item.status === 'Active' || item.status === $t('Active')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            ]">
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
        </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ isEditing ? $t('Edit Unit') : $t('Add Unit') }}
          </h3>

          <form @submit.prevent="saveUnit">
            <div class="mb-4">
              <Input v-model="formData.name" :label="$t('Unit Name')" type="text" :placeholder="$t('Enter unit name')" required />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')" :disabled="saving" />
              <BasicButton type="submit" variant="primary" :label="isEditing ? $t('update') : $t('save')" :loading="saving" />
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
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { Plus } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import { getUnits, postUnit, updateUnitById, deleteUnitById } from '@/services/configrationApi'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

// Reactive data
const { t } = useI18n()
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const saving = ref(false)
const toast = useToast()
const serviceStore = useServiceStore()

const formData = reactive({
  name: ''
})

// Table configuration
const columns = computed<Column[]>(() => [
  { key: 'name', label: t('Unit Name'), type: 'text' },
  { key: 'createdInfo', label: t('Created By'), type: 'custom' },
  { key: 'modifiedInfo', label: t('Modified By'), type: 'custom' },
  { key: 'status', label: t('Status'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  {
    label: t('Edit'),
    handler: (item: any) => editUnit(item),
    variant: 'primary'
  },
  {
    label: t('Delete'),
    handler: (item: any) => deleteUnit(item.id),
    variant: 'danger'
  }
])

const units = ref<any[]>([])

const fetchUnits = async () => {
  try {
    loading.value = true
    const response = await getUnits()
    console.log('responser',response);
    const list = response?.data?.data?.data ?? []
    units.value = list.map((u: any) => ({
      ...u,
      id: u.id ,
      name: u.name ?? u.unitName ?? '',
      status: u.status ?? 'Active'
    }))
  } catch (error) {
    console.error('Error fetching units:', error)
    toast.error(t('Failed to load units'))
  } finally {
    loading.value = false
  }
}

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  showModal.value = true
}

const editUnit = (unit: any) => {
  isEditing.value = true
  editingId.value = unit.id
  formData.name = unit.name
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
}

const saveUnit = async () => {
  try {
    saving.value = true
    const payload = {
      name: formData.name,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && editingId.value) {
      await updateUnitById(editingId.value, payload)
      toast.success(t('Unit updated successfully'))
    } else {
      await postUnit(payload)
      toast.success(t('Unit created successfully'))
    }

    closeModal()
    await fetchUnits()
  } catch (error) {
    console.error('Error saving unit:', error)
    toast.error(t('Failed to save unit'))
  } finally {
    saving.value = false
  }
}

const deleteUnit = async (id: number) => {
  if (confirm(t('Are you sure you want to delete this unit?'))) {
    try {
      loading.value = true
      await deleteUnitById(id)
      toast.success(t('Unit deleted successfully'))
      await fetchUnits()
    } catch (error) {
      console.error('Error deleting unit:', error)
      toast.error(t('Failed to delete unit'))
    } finally {
      loading.value = false
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editUnit(item)
  } else if (action === 'delete') {
    deleteUnit(item.id)
  }
}

onMounted(() => {
  fetchUnits()
})
</script>
