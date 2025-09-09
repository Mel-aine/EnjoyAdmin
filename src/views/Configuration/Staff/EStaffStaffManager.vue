<script setup lang="ts">

import { Building2, Wrench, UserCog, User, Edit, Trash2, Eye } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import { getEmployeesForService } from '@/services/userApi'
import { useI18n } from 'vue-i18n'
import type { userDataType } from '@/types/option'
import router from '@/router'

import UserFilters from '@/components/filters/UserFilters.vue'
import { defaultData, type FitlterItem, type Form } from '@/utils/models'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import PlusIcon from '../../../icons/PlusIcon.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import type { Column } from '@/utils/models'
import {deleteUser} from '@/services/userApi'

// Types
interface Department {
  id: number
  name: string
  description?: string
}

// Reactive data
const isLoading = ref(false)
const loadingDelete = ref(false)
const loading = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const selectedUserId = ref<number | null>(null)
const show = ref(false)
const modalOpen = ref(false)
const users = ref<userDataType[]>([])
const selectedUser = ref<any>(null)
const isEditMode = ref(false)
const { t } = useI18n()

const filter = ref<FitlterItem>({
  checkInDate: "",
  checkOutDate: "",
  roomType: "",
  searchText: "",
  status: "",
  department: "",
  roleId: ""
})

const form = ref<Form>(defaultData())

// Methods
const refresh = () => {
  modalOpen.value = false
  isEditMode.value = false
  fetchUser()
}

const fetchUser = async () => {
  loading.value = true
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) throw new Error('hotelId is not defined')
    const response = await getEmployeesForService(hotelId,filter.value)
    console.log('response', response)

    const assignmentsWithNames = await Promise.all(
      response.data.data.map(async (user: any) => {
        return {
          ...user,
          departmentName: user.department?.name,
          user_name: user.first_name + ' ' + user.last_name,
        }
      }),
    )

    users.value = assignmentsWithNames
    console.log('Filtered users with user info:', users.value)
  } catch (error) {
    console.error('fetch failed:', error)

  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchUser()
})

// Computed properties
const columns = computed<Column[]>(() => [
  {
    key: 'id',
    label: t('ID'),
    type: 'text',
    sortable: true,
  },
  {
    key: 'firstName',
    label: t('FirstName'),
    type: 'text',
    sortable: true,
  },
  {
    key: 'lastName',
    label: t('LastName'),
    type: 'text',
    sortable: true,
  },
  {
    key: 'email',
    label: t('Email'),
    type: 'email',
    sortable: true,
  },
  {
    key: 'phoneNumber',
    label: t('Phone'),
    type: 'text',
    sortable: true,
  },
  {
    key: 'department',
    label: t('department'),
    type: 'custom',
    sortable: true,
  },
  {
    key: 'role',
    label: t('Role'),
    type: 'custom',
    sortable: false,
  },
])



const usersWithRoleLabels = computed(() =>
  users.value.map((user: any) => {
    return {
      ...user,
    }
  }),
)

// Event handlers
const onEditUser = (user: any) => handleUserAction('edit', user)
const onDeleteUser = (user: any) => handleUserAction('delete', user)
const onView = (user: any) => handleUserAction('view', user)

const handleUserAction = (action: string, user: any) => {
  console.log('user action:', action, user)
  if (action === 'edit') {
    selectedUser.value = user
    isEditMode.value = true
    router.push({ name: "editUser", params: { id: user.id } })
  } else if (action === 'delete') {
    selectedUserId.value = user.id
    show.value = true
  } else if (action === 'view') {
    selectedUser.value = user
    router.push({ name: "usersDetails", params: { id: user.id } })
  }
}


const confirmDelete = async () => {
  if (selectedUserId.value !== null) {
    loadingDelete.value = true
    try {

       await deleteUser(selectedUserId.value)

      toast.success(t('toast.userDeleted'))
        users.value = users.value.filter((r: any) => r.id !== selectedUserId.value)


      console.log(`User deleted with ID: ${selectedUserId.value}`)
    } catch (error:any) {
      console.error('Delete error:', error)

      // Gestion des différents types d'erreurs
      if (error.response?.status === 409) {
        toast.error(t('toast.userDeleteConstraintError'))
      } else {
        toast.error(t('toast.userDeleteError'))
      }
    } finally {
      loadingDelete.value = false
      show.value = false
      selectedUserId.value = null
    }
  }
}


const actions = computed(() => [
  {
    label: t('common.view'),
    action: 'view',
    icon: Eye,
    variant: 'secondary',
    handler: (item: any) => onView(item),
  },
  {
    label: t('common.edit'),
    action: 'edit',
    icon: Edit,
    variant: 'primary',
    handler: (item: any) => onEditUser(item),
  },
  {
    label: t('common.delete'),
    action: 'delete',
    icon: Trash2,
    variant: 'danger',
    handler: (item: any) => onDeleteUser(item),
  },
])

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    onEditUser(item)
  } else if (action === 'delete') {
    onDeleteUser(item)
  } else if (action === 'view') {
    onView(item)
  }
}

const closeModal = () => {
  modalOpen.value = false
  isEditMode.value = false
  selectedUser.value = null
  form.value = defaultData()
}

// const OpenModal = () => {
//   modalOpen.value = true
//   isEditMode.value = false
//   selectedUser.value = null
//   form.value = defaultData()
// }
const goToUserForm = () =>{
  router.push('/users/new')
}

const applyFilters = (filterOp: FitlterItem) => {
  filter.value = filterOp
  fetchUser()
}
</script>

<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('staffManager.title') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ $t('staffManager.subtitle') }}
        </p>
      </div>

      <div class="space-y-5 sm:space-y-6 min-h-screen">
        <ReusableTable
          :title="$t('UsersLists')"
          :description="$t('configuration.staffManager.description')"
          :columns="columns"
          :data="usersWithRoleLabels"
          :actions="actions"
          :loading="loading"
          :searchPlaceholder="$t('configuration.staffManager.search_placeholder')"
          :emptyStateTitle="$t('configuration.staffManager.empty_state_title')"
          :emptyStateMessage="$t('configuration.staffManager.empty_state_message')"
          :selectable="false"
          @action="onAction"
        >

          <template #header-actions>
            <BasicButton
              variant="primary"
              :icon="PlusIcon"
              :label="$t('AddUser')"
              @click="goToUserForm()"
            />
            <UserFilters @filter="applyFilters" />
          </template>
              <!--custom column for responsible-->
            <template #column-department="{ item }">
            <span
              class=" capitalize font-medium"
            >
               {{ item.department?.name }}
            </span>
          </template>

            <!--custom column for responsible-->
            <template #column-role="{ item }">
            <span
              class=" capitalize font-normal text-orange-600 "
            >
               {{ item.role?.roleName }}
            </span>
          </template>

        </ReusableTable>
      </div>


    </div>
   <ConfirmationModal
    v-model:show="show"
    :title="$t('confirmDelete')"
    :message="$t('deleteUserConfirmMessage')"
    :confirm-text="$t('delete')"
    :cancel-text="$t('cancel')"
    variant="danger"
    :loading="loadingDelete"
    @confirm="confirmDelete"
    @cancel="show = false"
  />

  </ConfigurationLayout>


</template>

