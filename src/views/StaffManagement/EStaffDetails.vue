<template>
    <admin-layout>
        <PageBreadcrumb :pageTitle="$t('userProfile')" />
        <div class="h-screen" v-if="user && user.id">
            <div
                class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    {{ $t('profile') }}
                </h3>
                <profile-card :full-name="fullName" :email="email">
                    <template v-slot:Setting>
                        <div class="flex items-center gap-2">
                            <span>{{ $t('status') }}: <span
                                    :class="`${getStatusColor(user.status)} px-1 rounded-2xl text-sm py-1`">{{
                                    $t(user.status??'') }}</span></span>
                            <span>{{ $t('roles') }}: <span
                                    :class="`${getRoleBadge(user.role).bg} ${getRoleBadge(user.role).text} px-1 text-sm rounded-2xl py-1`">{{
                                    $t(user.role) }}</span></span>
                            <span>{{ $t('department') }}: <span
                                    :class="`${getRoleBadge(user.department?.name??'').bg} ${getRoleBadge(user.department?.name??'').text} px-1 text-sm rounded-2xl py-1`">{{
                                    $t(user.department?.name??'') }}</span></span>

                        </div>
                    </template>
                </profile-card>

                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        ]">
                            <div class="flex items-center space-x-2">
                                <component :is="tab.icon" class="w-5 h-5" />
                                <span>{{ tab.label }}</span>
                            </div>
                        </button>
                    </nav>
                </div>
                <!-- Content -->
                <div class="p-6">
                    <!-- Details Tab -->
                    <div v-if="activeTab === 'details'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <!-- Informations de base -->
                        <personal-info-card :email="email" :firstname="firstname" :lastname="lastname" :phone="phone"
                            @update-profile="editUser" />

                        <!-- contack info -->
                        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                        {{ $t('customerDetails.contactInfo.title') }}
                                    </h4>

                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('customerDetails.contactInfo.email') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.email
                                            }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('customerDetails.contactInfo.phone') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ user.
                                                phoneNumber
                                            }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('customerDetails.contactInfo.address') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.address ?? 'N/A'
                                            }}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- permission-->
                        <!-- contack info -->
                        <div class="p-5 mb-6 border w border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div class="flex  gap-6 justify-between">
                                <div class="w-full">
                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                        {{ $t('user_permissions') }}
                                    </h4>
                                    <template v-if="user.
                                        permissions && user.permissions.length > 0">
                                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="flex flex-col w-full items-center justify-center text-gray-500">
                                            <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
                                            <p class="text-sm">{{ $t('no_permissions') }}</p>
                                        </div>
                                    </template>

                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- History Tab -->
                    <div v-if="activeTab === 'history'" class="bg-white rounded-xl border border-gray-200">
                        <template v-if="user.
                            activityLogs && user.activityLogs.length > 0">
                            <ActivitiesLogs :activity-logs="user.activityLogs" />
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center justify-center text-gray-500 py-10">
                                <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
                                <p class="text-sm">{{ $t('no_recente_activity') }}</p>
                            </div>
                        </template>
                    </div>

                    <!-- Calendar Tab -->
                    <div v-if="activeTab === 'calendar'" class="bg-white rounded-xl border border-gray-200">

                    </div>
                </div>
                <!-- <address-card /> -->
            </div>
        </div>
    </admin-layout>
    <template v-if="modalOpen">
        <UserUpsertModal :is-edit-mode="true" :selected-user="selectedUser" :modal-open="modalOpen" @close="closeModal"
            @refresh="refresh()" />
    </template>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { getEmployeesDetails } from '@/services/api'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import InfoIcon from '@/icons/InfoIcon.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import { Bookmark, ClockIcon, CreditCard, FileSearch } from 'lucide-vue-next'
import { isLoading } from '@/composables/spinner'
import UserUpsertModal from '@/components/modal/UserUpsertModal.vue'
import ActivitiesLogs from '../Setting/ActivitiesLogs.vue'

const AdminLayout = defineAsyncComponent(() => import('../../components/layout/AdminLayout.vue'))
const PageBreadcrumb = defineAsyncComponent(() => import('@/components/common/PageBreadcrumb.vue'))
const ProfileCard = defineAsyncComponent(() => import('../../components/profile/ProfileCard.vue'))
const PersonalInfoCard = defineAsyncComponent(() => import('../../components/profile/PersonalInfoCard.vue'))
const user_id = router.currentRoute.value.params.id as string;
const tabs = computed(() => [
    { id: 'details', label: t('tab.details'), icon: InfoIcon },
    { id: 'calendar', label: t('tab.calendar'), icon: CalendarIcon },
    { id: 'history', label: t('tab.history'), icon: ClockIcon },
])
const activeTab = ref<string>('details')
const modalOpen = ref(false);
const selectedUser = ref<any>(null)

const { t } = useI18n()
const user = ref<any>({})
const editUser = () => {
    selectedUser.value = {}
    selectedUser.value.first_name = user.value.firstName
    selectedUser.value.last_name = user.value.lastName
    selectedUser.value.phone_number = user.value.phoneNumber;
    selectedUser.value.email = user.value.email
    selectedUser.value.role_id = user.value.roleId
    selectedUser.value.department = user.value.department
    if (user.value.hireDate) {
        const hireDate = new Date(user.value.hireDate)
        selectedUser.value.hire_date = hireDate.toISOString().split('T')[0]
    }
    modalOpen.value = true
}
const closeModal = () => {
    modalOpen.value = false
}
const fullName = computed(() =>
    `${user.value?.firstName ?? ''} ${user.value?.lastName ?? ''}`.trim()
)
const email = computed(() => user.value.email ?? '')
const firstname = computed(() => user.value.firstName ?? '')
const lastname = computed(() => user.value.lastName ?? '')
const phone = computed(() => user.value.phoneNumber ?? '')

const getUserLocal = async () => {
    isLoading.value = true
    const response = await getEmployeesDetails(parseInt(user_id))
    console.log('this is the user_id', response)
    user.value = response.data;
    isLoading.value = false;
}



// On mount: fetch and update store + profile
onMounted(async () => {
    getUserLocal()
})

const refresh = () => {
    modalOpen.value = false;
    getUserLocal();
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
const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700'
        default:
            return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500'
    }
}

</script>
