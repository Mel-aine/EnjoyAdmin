<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { Building2, Wrench, UserCog, User } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import {
  deleteUser,
  getEmployeesForService,
} from '@/services/api'
import { useI18n } from 'vue-i18n'
import type { userDataType } from '@/types/option'
import TableComponent from '@/components/tables/TableComponent.vue'
import router from '@/router'
import UserUpsertModal from '@/components/modal/UserUpsertModal.vue'
import UserFilters from '@/components/filters/UserFilters.vue'
import { defaultData, type FitlterItem, type Form } from '@/utils/models'
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

const refresh = () => {
  modalOpen.value = false;
  isEditMode.value = false;
  fetchUser();
}
const fetchUser = async () => {
  loading.value = true
  try {
    const serviceId = serviceStore.serviceId
    if (!serviceId) throw new Error('Service ID is not defined')
    const response = await getEmployeesForService(serviceId, filter.value)
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
const titles = computed(() => [
  {
    name: 'id',
    label: t('ID'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'first_name',
    label: t('FirstName'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'last_name',
    label: t('LastName'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'email',
    label: t('Email'),
    type: 'url',
    event: 'view',
    filterable: true,
  },
  {
    name: 'phone_number',
    label: t('Phone'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'departmentName',
    label: t('department'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'roleBadge',
    label: t('Role'),
    type: 'badge',
    filterable: false,
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'View',
        event: 'view',
        icone: ` <svg class="h-6 w-6 text-primary"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>`,
      },
      {
        name: 'Edit',
        event: 'edit',
        icone: ` <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>`,
      },
      {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
      },
    ],
  },
])

const getRoleBadge = (roleName: string) => {
  const roleMap: Record<string, { bg: string; text: string; label: string }> = {
    admin: {
      label: 'Administrator',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
    editor: {
      label: 'Editor',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    },
    viewer: {
      label: 'Viewer',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    unknown: {
      label: 'Unknown',
      bg: 'bg-gray-100',
      text: 'text-gray-800',
    },
  }

  return (
    roleMap[roleName] || {
      label: roleName,
      bg: 'bg-purple-100',
      text: 'text-purple-800',
    }
  )
}

const usersWithRoleLabels = computed(() =>
  users.value.map((user: any) => {
    return {
      ...user,
      roleLabel: user.role,
      roleBadge: getRoleBadge(user.role),
    }
  }),
)

const onEditUser = (user: any) => handleUserAction('edit', user)
const onDeleteUser = (user: any) => handleUserAction('delete', user)
const onView = (user: any) => handleUserAction('view', user)

const handleUserAction = (action: string, user: any) => {
  console.log('user Edit', user)
  if (action === 'edit') {
    selectedUser.value = user
    form.value.firstName = user.first_name
    form.value.lastName = user.last_name
    form.value.phoneNumber = user.phone_number;
    form.value.email = user.email
    form.value.roleId = user.role_id
    form.value.department = user.department?.id;

    if (user.hire_date) {
      const hireDate = new Date(user.hire_date)
      form.value.hire_date = hireDate.toISOString().split('T')[0]
    }
    isEditMode.value = true
    modalOpen.value = true
  } else if (action === 'delete') {
    selectedUserId.value = user.id
    show.value = true
  } else if (action === 'view') {
    selectedUser.value = user;
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
      console.log(`Suppression du user ID: ${selectedUserId.value}`)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(t('toast.userDeleteError'))
    } finally {
      loadingDelete.value = false
      show.value = false
      selectedUserId.value = null
    }
  }
}

const closeModal = () => {
  modalOpen.value = false
  isEditMode.value = false

  form.value = defaultData()
}

const OpenModal = () => {
  modalOpen.value = true
  isEditMode.value = false
}
const applyFilters = (filterOp: FitlterItem) => {
  filter.value = filterOp;
  fetchUser()
}

</script>

<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="space-y-6">
        <div class="flex items-center justify-between mb-5 space-x-4">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ $t('staffManager.title') }}</h2>
            <p class="text-gray-600 mt-1">{{ $t('staffManager.subtitle') }}</p>
          </div>
        </div>
        <UserFilters @filter="applyFilters" />


        <div class="space-y-4">
          <TableComponent :items="titles" :datas="usersWithRoleLabels" :filterable="true" :pagination="true"
            :loading="loading" :showHeader="true" :searchable="false" :title="$t('UsersLists')" :pageSize="15"
            :showButtonAllElement="true" @edit="onEditUser" @delete="onDeleteUser" @view="onView" class="modern-table">

            <template v-slot:headerActions>
              <!-- Add User Button -->
              <button @click="OpenModal"
                class="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {{ t('AddUser') }}
              </button>
            </template>
          </TableComponent>
        </div>
        <template v-if="modalOpen">
          <UserUpsertModal @close="closeModal()" @refresh="refresh()" :modal-open="modalOpen" :is-edit-mode="isEditMode"
            :selected-user="selectedUser" />
        </template>
        <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>
