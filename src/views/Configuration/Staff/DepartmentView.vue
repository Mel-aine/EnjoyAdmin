<template>
  <ConfigurationLayout>
    <div class="p-6">

      <Modal v-if="isAddModalOpen" @close="isAddModalOpen = false">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-lg bg-white p-4 dark:bg-gray-900 lg:p-11"
          >
            <button
              @click="closeAddDepartmentModal"
              class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
            >
              <svg
                class="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                  fill=""
                />
              </svg>
            </button>
            <h2 class="text-lg font-semibold mb-4">
              {{ isEditing ? $t('departments.edit') : $t('departments.add') }}
            </h2>
            <form @submit.prevent="addDepartment">
              <div class="mb-4">
                <Input :lb="$t('Name')" v-model="newDepartment.name" />
              </div>
              <div class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{
                  $t('Description')
                }}</label>
                <textarea
                  v-model="newDepartment.description"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-900 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  rows="3"
                ></textarea>
              </div>
              <div class="mb-4">
                <Select :lb="$t('manager')" v-model="newDepartment.manager" :options="Users" />
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <BasicButton
                  type="button"
                  variant="outline"
                  @click="closeAddDepartmentModal"
                  :label="$t('cancel')"
                  :disabled="isLoading"
                />
                <BasicButton
                  type="submit"
                  variant="primary"
                  :label="isLoading ? $t('processing') + '...' : isEditing ? $t('update') : $t('save')"
                  :loading="isLoading"
                />
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <div class="space-y-5 sm:space-y-6 min-h-screen">
        <ReusableTable
          :title="$t('Department')"
          :description="$t('configuration.departments.description')"
          :columns="columns"
          :data="departmentsData"
          :actions="actions"
          :loading="loading"
          :searchPlaceholder="$t('configuration.departments.search_placeholder')"
          :emptyStateTitle="$t('configuration.departments.empty_state_title')"
          :emptyStateMessage="$t('configuration.departments.empty_state_message')"
          :selectable="false"
          @action="onAction"
        >
          <!-- Header Actions -->
          <template #header-actions>
            <BasicButton
              variant="primary"
              :icon="PlusIcon"
              :label="$t('departments.add')"
              @click="openAddDepartmentModal()"
            />
          </template>

          <!-- Custom column for status -->
          <template #column-status="{ item }">
            <span
              class="px-2 py-1 text-xs rounded-full font-medium"
              :class="
                item.statusColor
                  ? `${item.statusColor.bg} ${item.statusColor.text}`
                  : 'bg-gray-100 text-gray-700'
              "
            >
              {{ item.statusColor?.label || item.status }}
            </span>
          </template>
          <!--custom column for responsible-->
          <template #column-responsibleUser="{ item }">
            <span class="capitalize font-medium">
              {{ item.responsibleUser?.firstName }} {{ item.responsibleUser?.lastName }}
            </span>
          </template>
        </ReusableTable>
      </div>
    </div>
  </ConfigurationLayout>
  <ConfirmationModal
    v-model:show="show"
    :title="$t('confirmDelete')"
    :message="$t('deleteDepartmentConfirmMessage')"
    :confirm-text="$t('delete')"
    :cancel-text="$t('cancel')"
    variant="danger"
    :loading="loadingDelete"
    @confirm="confirmDelete"
    @cancel="show = false"
  />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, watch, computed } from 'vue'
import { createDepartment, getDepartment, updateDpt, deleteDpt } from '@/services/departmentApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import router from '@/router'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import PlusIcon from '../../../icons/PlusIcon.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { Edit, Trash2 } from 'lucide-vue-next'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import { getEmployeesForService } from '@/services/userApi'
import type { Column } from '@/utils/models'

// Types
interface Department {
  id: number
  name: string
  description: string
  responsibleUserId?: number
  responsibleUserName?: string
  numberEmployees?: number
  status: string
  createdAt?: string
  updatedAt?: string
  createdByUser?: { firstName: string }
  updatedByUser?: { firstName: string }
  manager: number | null
  statusColor?: {
    label: string
    bg: string
    text: string
  }
}

interface department {
 name: string
  description: string
  manager: number | null  // peut être null si pas de responsable
  employeeCount: number
  status: 'active' | 'inactive' | 'archived'
}

// Async Components
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Spinner = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'))

// Reactive data
const isAddModalOpen = ref(false)
const isLoading = ref(false)
const loading = ref(false)
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const serviceStore = useServiceStore()
const isEditing = ref(false)
const departmentsData = ref<Department[]>([])
const Users = ref<any[]>([])
const show = ref(false)
const loadingDelete = ref(false)
const selectedId = ref<number | null>(null)
const showModal = ref(false)
const selectedDepartment = ref<Department | null>(null)
const selected = ref<Department | null>(null)


const newDepartment =  ref<any>({
  name: '',
  description: '',
  manager: null,
  status: 'active',
})

// Computed
const columns = computed<Column[]>(() => [
  { key: 'id', label: t('common.id'), type: 'text', sortable: true },
  { key: 'name', label: t('departments.name'), type: 'text', sortable: true },
  { key: 'description', label: t('departments.description'), type: 'text', sortable: true },
  { key: 'responsibleUser', label: t('departments.manager'), type: 'custom', sortable: true },
  { key: 'status', label: t('common.status'), type: 'custom', sortable: true },
])

const actions = computed(() => [
  {
    label: t('common.edit'),
    action: 'edit',
    icon: Edit,
    variant: 'primary',
    handler: (item: Department) => editDepartment(item),
  },
  {
    label: t('common.delete'),
    action: 'delete',
    icon: Trash2,
    variant: 'danger',
    handler: (item: Department) => deleteDepartmentAction(item),
  },
])

// Methods

const openAddDepartmentModal = () => {
  isAddModalOpen.value = true
}

const closeAddDepartmentModal = () => {
  isAddModalOpen.value = false
  isEditing.value = false
  selected.value = null
  newDepartment.value = {
    name: '',
    description: '',
    manager: null,
    employeeCount: 0,
    status: 'active',
  }
}

const updateData = async () => {
  if (!selected.value?.id) {
    toast.error(t('departments.errors.select_error'))
    return
  }

  isLoading.value = true

  try {
    const hotelId = serviceStore.serviceId
    const payload = {
      hotel_id: hotelId,
      name: newDepartment.value.name,
      description: newDepartment.value.description,
      responsible_user_id: newDepartment.value.manager || null,
    }

    await updateDpt(selected.value.id, payload)

    await fetchDepartment()
    closeAddDepartmentModal()
    toast.success(t('toast.SucessUpdate'))
  } catch (error: any) {
    console.error('Save error:', error)

    if (error.response) {
      const code = error.response.data?.code
      if (code === 'DEPARTMENT_ALREADY_EXISTS') {
        toast.error(t('departments.errors.already_exists'))
      } else {
        const message = error.response.data?.message || t('toast.updateError')
        toast.error(message)
      }
    } else {
      toast.error(t('toast.updateError'))
    }
  } finally {
    isLoading.value = false
  }
}

const addDepartment = async () => {
  if (!newDepartment.value.name.trim()) {
    toast.error(t('departments.errors.name_required'))
    return
  }

  isLoading.value = true

  try {
    if (isEditing.value) {
      await updateData()
    } else {
      const hotelId = serviceStore.serviceId
      const payload = {
        name: newDepartment.value.name,
        description: newDepartment.value.description,
        responsible_user_id: newDepartment.value.manager || null,
        status: 'active',
        hotel_id: hotelId,
      }

      await createDepartment(payload)
      await fetchDepartment()
      toast.success(t('toast.Sucess'))
      closeAddDepartmentModal()
    }
  } catch (error: any) {
    console.error('Save error:', error)

    if (error.response) {
      const code = error.response.data?.code
      if (code === 'DEPARTMENT_ALREADY_EXISTS_NAME') {
        toast.error(t('departments.errors.already_exists_name'))
      } else {
        const message = error.response.data?.message || t('toast.error')
        toast.error(message)
      }
    } else {
      toast.error(t('toast.error'))
    }
  } finally {
    isLoading.value = false
  }
}
const fetchDepartment = async () => {
  loading.value = true

  try {
    const hotelId = serviceStore.serviceId

    if (!hotelId) {
      throw new Error('Service ID is not defined')
    }

    const departmentsResponse = await getDepartment(hotelId)

    // accès au tableau de départements
    const departments = departmentsResponse.data?.data.data || []
    console.log('departments', departments)

    departments.sort((a: any, b: any) => a.name.localeCompare(b.name))

    departmentsData.value = departments.map((d: any) => {
      const statusClasses = getStatusColor(d.status).split(' ')
      return {
        ...d,
        statusColor: {
          label: t(`departments.status.${d.status}`),
          bg: statusClasses[0],
          text: statusClasses[1],
        },
      }
    })
  } catch (error) {
    console.error('Fetch departments error:', error)
  } finally {
    loading.value = false
  }
}

const fetchUser = async () => {
  loading.value = true
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) throw new Error('hotelId is not defined')
    const response = await getEmployeesForService(hotelId)
    console.log('response', response)
    ;(Users.value = response.data.data.map((user: any) => {
      return {
        value: user.id,
        label: user.lastName,
      }
    })),
      console.log('Filtered users with user info:', Users.value)
  } catch (error) {
    console.error('fetch failed:', error)
  } finally {
    loading.value = false
  }
}

const editDepartment = (dept: Department) => {
  selected.value = dept
  newDepartment.value = {
    name: dept.name,
    description: dept.description,
    manager: dept.responsibleUserId ?? null,
    employeeCount: dept.numberEmployees,
    status: dept.status,
  }
  isEditing.value = true
  isAddModalOpen.value = true
}

const deleteDepartmentAction = (dept: Department) => {
  selectedId.value = dept.id
  show.value = true
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'inactive':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const confirmDelete = async () => {
  if (selectedId.value === null) return

  loadingDelete.value = true

  try {
    await deleteDpt(selectedId.value)
    departmentsData.value = departmentsData.value.filter(
      (d: Department) => d.id !== selectedId.value,
    )
    toast.success(t('toast.DeletedSuccess'))
  } catch (error) {
    console.error('Delete error:', error)
    toast.error(t('toast.deleteErrors'))
  } finally {
    loadingDelete.value = false
    show.value = false
    selectedId.value = null
  }
}

const onAction = (action: string, item: Department) => {
  if (action === 'edit') {
    editDepartment(item)
  } else if (action === 'delete') {
    deleteDepartmentAction(item)
  }
}

// // Watchers
// watch(locale, fetchDepartment);

// // Lifecycle
onMounted(async () => {
  await fetchUser()
  await fetchDepartment()
})
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
