<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { Building2, Wrench, UserCog, User,CalendarIcon } from 'lucide-vue-next'
import { ref, watch, computed, defineAsyncComponent, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
import {
    createUser,
    getUserAssignmentById,
    deleteUser,
    updateUser,
    getRole,
    getUserId,
    getDepartment
} from '@/services/api'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/composables/user'
import type { userDataType } from '@/types/option'
import TableComponent from '@/components/tables/TableComponent.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const ComponentCard = defineAsyncComponent(() => import('@/components/common/ComponentCard.vue'))
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const ModalDelete = defineAsyncComponent(() => import('@/components/modal/ModalDelete.vue'))
const isLoading = ref(false)
const loadingDelete = ref(false)
const loading = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const userStore = useAuthStore()
const selectedUserId = ref<number | null>(null)
const show = ref(false)
const showPassword = ref(false)
const modalOpen = ref(false)
const users = ref<userDataType[]>([])
const selectedUser = ref<any>(null)
const isEditMode = ref(false)
const role = ref<any[]>([])
const departments = ref<any[]>([])
const { t } = useI18n()
const viewMode = ref<'grid' | 'list'>('list')
const roles = ref<{ value: string; label: string }[]>([])
const props = defineProps({
    datas: {
        type: Array,
        default: () => [],
    },
    departmentId: {
        type: Number,
        default: 0,
    },
})
interface Form {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    password: string
    roleId: string | number | undefined
    hire_date: string,
    department: number
}

const form = ref<Form>({
    firstName: '',
    lastName: '',
    roleId: 0,
    phoneNumber: '',
    email: '',
    password: '',
    department: props.departmentId,
    hire_date: ''
})

const flatpickrConfig = {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    wrap: true,
}
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const saveUser = async () => {
    isLoading.value = true
    try {
        const serviceId = serviceStore.serviceId

        const selectedRole = roles.value.find((r) => r.value === form.value.roleId)
        const roleLabel = selectedRole ? selectedRole.label : ''
        const userPayload = {
            service_id: serviceId,
            first_name: form.value.firstName,
            last_name: form.value.lastName,
            email: form.value.email,
            phone_number: form.value.phoneNumber,
            role_id: form.value.roleId,
            password: form.value.password,
            department_id: form.value.department,
            hire_date: form.value.hire_date,
            created_by: userStore.UserId,
            last_modified_by: userStore.UserId,
            role: roleLabel,
        }

        const response = await createUser(userPayload)
        fetchUser()
        modalOpen.value = false


        form.value = {
            firstName: '',
            lastName: '',
            roleId: 0,
            phoneNumber: '',
            email: '',
            password: '',
            department: 0,
            hire_date: ''
        }

        if (response.status === 201) {
            toast.success(t('toast.userCreated'))
        } else {
            toast.error(t('toast.userErrorCreated'))
        }
    } catch (error: any) {
        console.error('❌ Error while saving:', error.response?.data || error.message)
    } finally {
        isLoading.value = false
    }
}

const fetchUser = async () => {
    try {


        users.value = props.datas.map((user: any) => {
            return {
                ...user,
                user_name: user.firstName + ' ' + user.lastName,
            } as userDataType
        })

        console.log('Filtered users with user info:', users.value)
    } catch (error) {
        console.error('fetch failed:', error)
    }
}

onMounted( () => {
     fetchDepartment();
     fetchRole()
    form.value.department = props.departmentId
})

onMounted( () => {
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
        name: 'firstName',
        label: t('FirstName'),
        type: 'text',
        filterable: true,
    },
    {
        name: 'lastName',
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
        name: 'phoneNumber',
        label: t('Phone'),
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

const fetchRole = async () => {
    try {
        const serviceId = serviceStore.serviceId
        const response = await getRole(serviceId)
        console.log('role', response.data)
        role.value = response.data
        roles.value = response.data.map((r: any) => {
            return {
                label: r.roleName,
                value: r.id,
            }
        })
        console.log('roles.value', roles.value)
    } catch (error) {
        console.error('fetch failed:', error)
    }
}

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
        const Role = role.value.find((r: any) => r.id === user.roleId) || 'Unknown'
        console.log('userrole', Role)

        return {
            ...user,
            roleLabel: Role.roleName,
            roleBadge: getRoleBadge(Role.roleName),
        }
    }),
)

const onEditUser = (user: any) => handleUserAction('edit', user)
const onDeleteUser = (user: any) => handleUserAction('delete', user)

const handleUserAction = (action: string, user: any) => {
    console.log('user Edit', user)
    if (action === 'edit') {
        selectedUser.value = user
        form.value.firstName = user.firstName
        form.value.lastName = user.lastName
        form.value.phoneNumber = user.phoneNumber
        form.value.email = user.email
        form.value.roleId = user.roleId
        form.value.department = user.departmentId
        const hireDate = new Date(user.hireDate)
        form.value.hire_date = hireDate.toISOString().split('T')[0]
        isEditMode.value = true
        modalOpen.value = true
    } else if (action === 'delete') {
        selectedUserId.value = user.id
        show.value = true
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

const updateFormData = async () => {
    isLoading.value = true

    try {
        const serviceId = serviceStore.serviceId
        const userId = selectedUser.value?.id
        const selectedRole = roles.value.find((r: any) => r.value === form.value.roleId)
        const roleLabel = selectedRole ? selectedRole.label : ''

        if (!userId) {
            toast.error('Aucun utilisateur sélectionné pour la mise à jour.')
            return
        }

        const userPayload = {
            service_id: serviceId,
            first_name: form.value.firstName,
            last_name: form.value.lastName,
            email: form.value.email,
            phone_number: form.value.phoneNumber,
            role_id: form.value.roleId,
            password: form.value.password,
            created_by: userStore.UserId,
            last_modified_by: userStore.UserId,
            role: roleLabel,
        }

        console.log('Payload envoyé :', userPayload)
        await updateUser(userId, userPayload)

        toast.success(t('toast.userUpdatedSuccess'))

        // Réinitialisation du formulaire
        form.value = {
            firstName: '',
            lastName: '',
            roleId: 0,
            phoneNumber: '',
            email: '',
            password: '',
            department: props.departmentId,
            hire_date: ''
        }
        selectedUser.value = null
        isEditMode.value = false
        modalOpen.value = false
        fetchUser()
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
        toast.error(t('toast.updateError'))
    } finally {
        isLoading.value = false
    }
}

const handleSubmit = async () => {
    isLoading.value = true
    try {
        if (isEditMode.value) {
            await updateFormData()
        } else {
            await saveUser()
        }
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    modalOpen.value = false
    isEditMode.value = false

    form.value = {
        firstName: '',
        lastName: '',
        roleId: 0,
        phoneNumber: '',
        email: '',
        password: '',
        department: 0,
        hire_date: ''
    }
}

const OpenModal = () => {
    modalOpen.value = true
    isEditMode.value = false
}

function getRoleIcon(role: string) {
    switch (role) {
        case 'receptionist':
            return Building2
        case 'housekeeper':
            return Building2
        case 'maintenance':
            return Wrench
        case 'manager':
            return UserCog
        default:
            return User
    }
}
function getRoleColor(role: string) {
    switch (role) {
        case 'receptionist':
            return 'bg-blue-100 text-blue-800'
        case 'housekeeper':
            return 'bg-green-100 text-green-800'
        case 'maintenance':
            return 'bg-yellow-100 text-yellow-800'
        case 'manager':
            return 'bg-purple-100 text-purple-800'
        case 'admin':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const fetchDepartment = async () => {
    try {
        const serviceId = serviceStore.serviceId;
        console.log('Service ID:', serviceId);

        const departmentsResponse = await getDepartment(serviceId);
        departments.value = departmentsResponse.data.map((d: any) => {
            return {
                ...d,
                label: d.name,
                value: d.id
            }
        });
        console.log('Departments:', departments.value);


    } catch (error) {
        console.error('Erreur lors de la récupération :', error);
    }
};

</script>

<template>



    <div class="space-y-4">
        <TableComponent :items="titles" :datas="usersWithRoleLabels" :filterable="true" :pagination="true"
            :loading="loading" :showHeader="true" :title="$t('user')" :pageSize="15" :showButtonAllElement="true"
            @edit="onEditUser" @delete="onDeleteUser" class="modern-table">
            <template v-slot:headerActions>
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

    <Modal v-if="modalOpen" @close="closeModal()">
        <template #body>
            <div
                class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <button @click="closeModal()"
                    class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
                    <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                            fill="" />
                    </svg>
                </button>
                <div class="px-2 pr-14">
                    <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        {{ isEditMode ? $t('EditUser') : $t('NewUser') }}
                    </h4>
                </div>
                <form @submit.prevent="handleSubmit" class="flex flex-col">
                    <div class="h-[420px] p-2">
                        <div class="space-y-8">
                            <div>
                                <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                                    <Input :lb="$t('FirstName')" :id="'name'" :forLabel="'name'"
                                        v-model="form.firstName" />

                                    <Input :lb="$t('LastName')" :id="'last'" :forLabel="'last'"
                                        v-model="form.lastName" />
                                    <Input :lb="$t('Phone')" :id="'phone'" :forLabel="'phone'" :inputType="'phone'"
                                        v-model="form.phoneNumber" />

                                    <div>
                                        <label
                                            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            {{ $t('Email') }}
                                        </label>
                                        <div class="relative">
                                            <span
                                                class="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M3.04175 7.06206V14.375C3.04175 14.6511 3.26561 14.875 3.54175 14.875H16.4584C16.7346 14.875 16.9584 14.6511 16.9584 14.375V7.06245L11.1443 11.1168C10.457 11.5961 9.54373 11.5961 8.85638 11.1168L3.04175 7.06206ZM16.9584 5.19262C16.9584 5.19341 16.9584 5.1942 16.9584 5.19498V5.20026C16.9572 5.22216 16.946 5.24239 16.9279 5.25501L10.2864 9.88638C10.1145 10.0062 9.8862 10.0062 9.71437 9.88638L3.07255 5.25485C3.05342 5.24151 3.04202 5.21967 3.04202 5.19636C3.042 5.15695 3.07394 5.125 3.11335 5.125H16.8871C16.9253 5.125 16.9564 5.15494 16.9584 5.19262ZM18.4584 5.21428V14.375C18.4584 15.4796 17.563 16.375 16.4584 16.375H3.54175C2.43718 16.375 1.54175 15.4796 1.54175 14.375V5.19498C1.54175 5.1852 1.54194 5.17546 1.54231 5.16577C1.55858 4.31209 2.25571 3.625 3.11335 3.625H16.8871C17.7549 3.625 18.4584 4.32843 18.4585 5.19622C18.4585 5.20225 18.4585 5.20826 18.4584 5.21428Z"
                                                        fill="#667085" />
                                                </svg>
                                            </span>
                                            <input type="email" v-model="form.email" placeholder="info@gmail.com"
                                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="password"
                                            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            {{ $t('Password') }}
                                        </label>
                                        <div class="relative">
                                            <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                                id="password" autocomplete="current-password"
                                                :placeholder="$t('Enteryourpassword')"
                                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                                            <span @click="togglePasswordVisibility"
                                                class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400">
                                                <svg v-if="!showPassword" class="fill-current" width="20" height="20"
                                                    viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                                                        fill="#98A2B3" />
                                                </svg>
                                                <svg v-else class="fill-current" width="20" height="20"
                                                    viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                                                        fill="#98A2B3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <Select :lb="$t('staffManager.department')" v-model="form.department" :disabled="true"
                                        :options="departments" />
                                    <Select :lb="$t('Role')" v-model="form.roleId" :options="roles" />
                                    <div>
                                    <label for="hireDate" class="block text-gray-700 text-sm font-bold mb-2">{{
                                        $t('staffManager.hireDate') }}:</label>
                                    <div class="relative">
                                        <flat-pickr v-model="form.hire_date" :config="flatpickrConfig"
                                            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                                            :placeholder="$t('Selectdate')" />
                                        <span
                                            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                            <CalendarIcon />
                                        </span>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <button @click="closeModal()" type="button"
                            class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                            :disabled="isLoading">
                            {{ $t('Cancel') }}
                        </button>
                        <button type="submit" :disabled="isLoading"
                            class="relative flex w-full justify-center items-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 sm:w-auto">
                            <span v-if="!isLoading"> {{ isEditMode ? $t('EditUser') : $t('Save') }}</span>
                            <span v-else class="flex items-center gap-2">
                                <Spinner class="w-4 h-4" />
                                {{ $t('Processing') }}...
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </template>
    </Modal>
    <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
</template>
