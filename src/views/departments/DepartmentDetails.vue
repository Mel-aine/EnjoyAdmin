<template>
    <AdminLayout>
      <FullScreenLayout>
        <div class="container mx-auto px-4 py-8">
            
            <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
            <Modal v-if="isEditModalOpen" @close="isEditModalOpen = false">
                <template #body>
                <div
                    class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <button @click="isEditModalOpen = false"
                    class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
                    <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                        fill="" />
                    </svg>
                    </button>
                    <h2 class="text-lg font-semibold mb-4">{{ $t('edit') }}</h2>
                    <form @submit.prevent="editDepartement">
                        <div class="mb-4">
                            <Input :lb="$t('Name')" v-model="department.name" />
                        </div>
                        <div class="mb-4">
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('Description')
                            }}</label>
                            <textarea v-model="department.description"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-900 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            rows="3"></textarea>
                        </div>
                        <div class="mb-4">
                            <Select :lb="$t('manager')" v-model="department.manager" :options="users" />
                        </div>
                        <div class="mb-4">
                            <Input :lb="$t('numberEmployee')" :inputType="'number'" v-model="department.employeeCount" min="0" />
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button @click="isEditModalOpen = false"
                            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            {{ $t('Cancel') }}
                            </button>
                            <button type="submit" class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
                            <span v-if="!isLoading"> {{ $t('update') }}</span>
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
            <!-- Header -->
            <div class="mb-8 slide-in">
                <div class="flex items-center gap-4 mb-4">
                    <button @click="goBack"
                        class="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-lg transition-all duration-200 shadow">
                        ← {{ $t('Back') }}
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden"
                v-if="department && department">
                <!-- Header -->
                <div class="text-white p-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div
                                class="w-16 h-16 bg-blue-100 bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Users class="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-gray-800">
                                    {{ department.name }}
                                </h1>
                                <p class="text-black font-medium">{{ $t('numberEmployees') }} {{
                                    department.employeeCount }}
                                    <span :class="[
                                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ms-5',
                                        getStatusColor(department.status),
                                    ]">{{ $t(department.status) }}</span>
                                </p>
                                <div class="flex items-center space-x-4 mt-2">
                                    <button @click="handleOpenEditModal"
                                        class=" bg-primary text-white px-4 py-1 rounded-lg shadow hover:bg-primary/80 transition ">{{
                                            $t('edit') }}</button>
                                    <button @click="show = true"
                                        class="bg-red-500 text-white px-4 py-1 rounded-lg shadow hover:bg-orange-700 transition">{{
                                            $t('delete') }}</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Navigation Tabs -->
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
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                            <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                                <InfoIcon class="w-5 h-5 mr-2 text-blue-600" />
                                {{ $t('Basic_Information') }}
                            </h3>
                            <div class="space-y-1">
                                <DetailRow :label="$t('Name')" :value="department.name || 'N/A'" />

                                <div>
                                    <label class="mt-2 block text-md font-medium text-gray-700 dark:text-gray-400">{{
                                        $t('Description') }}:</label>
                                    <div class="flex items-center space-x-2">
                                        {{ department.description }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Équipements -->
                        <div
                            class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                            <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                                <User class="w-5 h-5 mr-2 text-purple-600" />
                                {{ $t('Owner') }}
                            </h3>
                            <div class="space-y-1"
                                v-if="departmentRaw.departmentDetails?.responsibleUser && departmentRaw.departmentDetails?.responsibleUserId">
                                <DetailRow :label="$t('Name')"
                                    :value="departmentRaw.departmentDetails.responsibleUser.firstName" />
                                <DetailRow :label="$t('email')"
                                    :value="departmentRaw.departmentDetails.responsibleUser.email" />
                                <DetailRow :label="$t('phone')"
                                    :value="departmentRaw.departmentDetails.responsibleUser.phoneNumber" />
                                <DetailRow :label="$t('Address')"
                                    :value="departmentRaw.departmentDetails.responsibleUser.address" />
                            </div>
                            <div class="space-y-1" v-else>
                                <div class="">
                                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">{{
                                        $t('assignOwnerTitle') }}</h2>

                                    <div class="text-center mb-6">
                                        <p class="text-gray-600 text-sm leading-relaxed">{{ $t('issueDescription') }}
                                        </p>
                                    </div>

                                    <button @click="emitAssignOwner"
                                        class="w-full bg-primary hover:bg-primary/85 text-white font-bold py-3 px-4 rounded-lg
               transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                        {{ $t('assignOwnerButton') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!--staff member-->
                        <div
                            class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                            <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                                <User class="w-5 h-5 mr-2 text-purple-600" />
                                {{ $t('activeMemberTodays')
                                }}
                            </h3>
                            <div class="flex items-center flex-col justify-start ">

                                <div class="text-center mb-6">
                                    <div v-if="departmentRaw.currentMembers?.length > 0">
                                        <p class="text-gray-600 text-sm leading-relaxed mb-2">{{
                                            $t('currentMembersLabel') }}:</p>
                                        <ul class="list-disc list-inside text-left mx-auto max-w-fit text-gray-800">
                                            <li v-for="(member, index) in departmentRaw.currentMembers" :key="index"
                                                class="mb-1">
                                                {{ member }}</li>
                                        </ul>
                                    </div>
                                    <div v-else>
                                        <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">{{
                                            $t('cardTitle') }}</h2>
                                        <p class="text-gray-600 text-sm leading-relaxed">{{ $t('noMembersMessage')
                                            }}</p>
                                    </div>
                                </div>

                                <button @click="emitAddSchedule"
                                    class="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 px-4 rounded-lg
               transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                                    {{ $t('addScheduleButton') }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="activeTab === 'planning'" class="bg-white rounded-xl  border-gray-200">
                        <!-- <CustomCalendar :calendar-title="$t('Calendar')" /> -->
                        <BaseCalendar :title="$t('Calendar')" :currentMonth="currentMonth" :days="calendarDays"
                            @previous-month="previousMonth" @next-month="nextMonth">
                            <template #day-content="{ day }">
                                <div v-if="day.isReserved" class=" bg-red-50 border-red-300">
                                    <div class="h-1 bg-red-500 rounded-full mb-1"></div>
                                    <div class="text-blue-600 truncate">
                                        {{ day.reservation?.reservationNumber }}
                                    </div>
                                    <div class="text-red-600 truncate">
                                        {{ day.reservation?.roomNumber }}
                                    </div>
                                </div>
                            </template>



                            <template #legend>
                                <div class="flex items-center justify-center space-x-6">
                                    <LegendItem color="blue" :label="$t('now')" />
                                    <LegendItem color="red" label="roomStatus.booked" />
                                </div>
                            </template>
                        </BaseCalendar>
                    </div>
                    <div v-if="activeTab === 'staff'" class="bg-white rounded-xl border-gray-200">
                        <UsersTable :datas="departmentRaw.staff" :department-id="parseInt(departmentId)" />
                    </div>
                    <!-- Calendar Tab -->
                    <div v-if="activeTab === 'tasks'" class="bg-white rounded-xl  border-gray-200">
                        <DepartmentTaskStaff />
                    </div>
                    <!-- History Tab -->
                    <div v-if="activeTab === 'history'" class="bg-white rounded-xl border border-gray-200">
                        <template v-if="departmentRaw.
                            activityHistory && departmentRaw.activityHistory.length > 0">
                            <ActivitiesLogs :activity-logs="departmentRaw.activityHistory" />
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center justify-center text-gray-500 py-10">
                                <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
                                <p class="text-sm">{{ $t('no_recente_activity') }}</p>
                            </div>
                        </template>
                    </div>


                </div>


            </div>
            <OverLoading v-if="isLoading" />
        </div>
        
        </FullScreenLayout>
    </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { ClockIcon, User } from 'lucide-vue-next';
import { CreditCard } from 'lucide-vue-next';
import { Bookmark } from 'lucide-vue-next';
import { Users } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n'
import InfoIcon from '@/icons/InfoIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import { isLoading } from '@/composables/spinner';
import DetailRow from '../Room/DetailRow.vue';
import router from '@/router';
import ActivitiesLogs from '../Setting/ActivitiesLogs.vue';
import { deleteDpt, getServiceDepartmentDetails, getUserByServiceId, updateDpt } from '@/services/api';
import { useServiceStore } from '@/composables/serviceStore';
import UsersTable from '@/components/tables/UsersTable.vue';
import DepartmentTaskStaff from '../StaffManagement/DepartmentTaskStaff.vue';
import BaseCalendar from '@/components/calendars/BaseCalendar.vue';
import LegendItem from '@/components/calendars/LegendItem.vue';
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
const ModalDelete = defineAsyncComponent(() => import('@/components/modal/ModalDelete.vue'))
import { useToast } from 'vue-toastification';
import type { IDepartement } from '@/types/type';
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'));
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'));


const toast = useToast()
const show = ref(false)
const users = ref<{label: string, value: number}[]>([])
const isEditModalOpen = ref(false);
const loadingDelete = ref(false)
interface CalendarDay {
    date: Date
    day: number
    isCurrentMonth: boolean
    isToday: boolean
    isReserved: boolean
    reservation?: {
        checkInDate: string
        checkOutDate: string
        roomNumber: string
        reservationNumber: string
        [key: string]: any
    }
}
const { t, locale } = useI18n()
const emitAssignOwner = () => {

}
const emitAddSchedule = () => {

}

const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const departmentId = router.currentRoute.value.params.id as string;
const currentDate = ref<Date>(new Date())
const serviceStore = useServiceStore();
const departmentRaw = ref<any>({})
const department = ref<IDepartement>({
    name: '',
    description: '',
    manager: 0,
    employeeCount: 0,
    status: 'active'
  })
const activeTab = ref<string>('details')
const tabs = computed(() => [
    { id: 'details', label: t('tab.details'), icon: InfoIcon },
    { id: 'planning', label: t('tab.planning'), icon: CalendarIcon },
    { id: 'staff', label: t('tab.staff'), icon: Bookmark },
    { id: 'tasks', label: t('tab.tasks'), icon: CreditCard },
    { id: 'history', label: t('tab.history'), icon: ClockIcon },
])





const currentMonth = computed(() => {
    return currentDate.value.toLocaleDateString(locale.value, {
        month: 'long',
        year: 'numeric',
    })
})
const previousMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
const handleOpenEditModal = () => {
    console.log("openModal")
    isEditModalOpen.value = true;
}

const confirmDelete = async () => {
  if (departmentRaw.value !== null) {
    console.log('-->departmentRaw.value', departmentRaw.value.departmentDetails.id);
    loadingDelete.value = true
    try {
      await deleteDpt(departmentRaw.value.departmentDetails.id);
      toast.success(t('toast.DeletedSuccess'))
      router.push('/department');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(t('toast.userDeleteError'))
    } finally {
      loadingDelete.value = false
      show.value = false
    }
  }
}

const editDepartement = async () => {
  isLoading.value = true;

  try {
    const serviceId = serviceStore.serviceId;
    const id = departmentRaw.value?.departmentDetails.id;

    if (!id) {
      toast.error(t('toast.selectError'));
      return;
    }

    const Payload = {
      service_id: serviceId,
      name: department.value.name,
      description: department.value.description,
      responsible_user_id: department.value.manager,
      number_employees: department.value.employeeCount

    };
    console.log('-->Payload', Payload);
    const result = await updateDpt(id, Payload);
    console.log('-->result', result);
    
   
    isEditModalOpen.value = false;
    toast.success(t('toast.SucessUpdate'));
  } catch (error) {
    toast.error(t('error'));
    console.error('Erreur lors de la mise à jour:', error);

  } finally {
    isLoading.value = false;
  }
}

const calendarDays = computed<CalendarDay[]>(() => {

    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const firstDay = new Date(year, month, 1)

    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)) // lundi = début
    const date = new Date(startDate)
    date.setDate(startDate.getDate())
    const days: CalendarDay[] = []

    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        let isReserved = false

        days.push({
            date,
            day: date.getDate(),
            isCurrentMonth: date.getMonth() === month,
            isToday: false,
            isReserved,
            reservation: {
                checkInDate: '',
                checkOutDate: '',
                roomNumber: '',
                reservationNumber: '',
            },

        })
    }
    return days
})
const goBack = (): void => {
    window.history.back()
}
// Méthodes utilitaires
const getStatusColor = (status: any) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800'
        case 'booked':
            return 'bg-blue-100 text-blue-800'
        case 'maintenance':
            return 'bg-yellow-100 text-yellow-800'
        case 'occupied':
            return 'bg-red-100 text-red-800'
        case 'dirty':
            return 'bg-red-50 text-orange-700'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}
onMounted(() => {
    getDepartmentDetails()
    fetchUser()
})

const getDepartmentDetails = async () => {
    isLoading.value = true;
    const response = await getServiceDepartmentDetails(serviceStore.serviceId!, parseInt(departmentId))
    console.log('this is the getDepartmentDetails', response.data)
    if (response.status === 200) {
        departmentRaw.value = response.data;
        department.value = {
            description: response.data.departmentDetails.description,
            employeeCount: response.data.departmentDetails.numberEmployees,
            manager: response.data.departmentDetails.responsibleUser.id,
            name: response.data.departmentDetails.name,
            status: response.data.departmentDetails.status,
            id: response.data.departmentDetails.id,
        }
    }
    isLoading.value = false;
}
const fetchUser = async () => {
  try {
    const serviceId = serviceStore.serviceId;

    if (!serviceId) {
      throw new Error('Service ID is not defined');
    }

    const response = await getUserByServiceId(serviceId);
    const _users = JSON.parse(response.data.data);
    console.log("-->_users", _users);
    users.value = _users.map((item: any) => ({
      label: item.user.firstName + ' ' + item.user.lastName,
      value: item.user.id
    }));


    console.log("Filtered users:", users.value);
  } catch (error) {
    console.error('fetch failed:', error);
  }
};

</script>

<style scoped>
.glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(245, 245, 245, 1);
    border: 1px solid rgba(75, 85, 99, 0.3);
}

.status-badge {
    animation: pulse 2s infinite;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-in {
    animation: slideIn 0.6s ease-out;
}
</style>
