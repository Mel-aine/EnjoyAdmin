<template>
    <AdminLayout>
        <div class="container mx-auto px-4 py-8">
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
                v-if="department && department.departmentDetails">
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
                                    {{ department.departmentDetails.name }}
                                </h1>
                                <p class="text-black font-medium">{{ $t('numberEmployees') }} {{
                                    department.departmentDetails.numberEmployees }}
                                    <span :class="[
                                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ms-5',
                                        getStatusColor(department.departmentDetails.status),
                                    ]">{{ $t(department.departmentDetails.status) }}</span>
                                </p>
                                <div class="flex items-center space-x-4 mt-2">
                                    <button
                                        class=" bg-primary text-white px-4 py-1 rounded-lg shadow hover:bg-primary/80 transition ">{{
                                            $t('edit') }}</button>
                                    <button
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
                                <DetailRow :label="$t('Name')" :value="department.departmentDetails.name || 'N/A'" />

                                <div>
                                    <label class="mt-2 block text-md font-medium text-gray-700 dark:text-gray-400">{{
                                        $t('Description') }}:</label>
                                    <div class="flex items-center space-x-2">
                                        {{ department.departmentDetails.description }}
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
                                v-if="department.departmentDetails.responsibleUser && department.departmentDetails.responsibleUserId">
                                <DetailRow :label="$t('Name')"
                                    :value="department.departmentDetails.responsibleUser.firstName" />
                                <DetailRow :label="$t('email')"
                                    :value="department.departmentDetails.responsibleUser.email" />
                                <DetailRow :label="$t('phone')"
                                    :value="department.departmentDetails.responsibleUser.phoneNumber" />
                                <DetailRow :label="$t('Address')"
                                    :value="department.departmentDetails.responsibleUser.address" />
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
                                    <div v-if="department.currentMembers?.length > 0">
                                        <p class="text-gray-600 text-sm leading-relaxed mb-2">{{
                                            $t('currentMembersLabel') }}:</p>
                                        <ul class="list-disc list-inside text-left mx-auto max-w-fit text-gray-800">
                                            <li v-for="(member, index) in department.currentMembers" :key="index"
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
                        <UsersTable :datas="department.staff" :department-id="parseInt(departmentId)" />
                    </div>
                    <!-- Calendar Tab -->
                    <div v-if="activeTab === 'tasks'" class="bg-white rounded-xl  border-gray-200">
                        <DepartmentTaskStaff />
                    </div>
                    <!-- History Tab -->
                    <div v-if="activeTab === 'history'" class="bg-white rounded-xl border border-gray-200">
                        <template v-if="department.
                            activityHistory && department.activityHistory.length > 0">
                            <ActivitiesLogs :activity-logs="department.activityHistory" />
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
    </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { BuildingIcon, ClockIcon, DollarSignIcon, MapPin, User, UserRound } from 'lucide-vue-next';
import { Mail } from 'lucide-vue-next';
import { Phone } from 'lucide-vue-next';
import { Calendar } from 'lucide-vue-next';
import { CreditCard } from 'lucide-vue-next';
import { Info } from 'lucide-vue-next';
import { Bookmark } from 'lucide-vue-next';
import { Users } from 'lucide-vue-next';
import CustomCalendar from '@/components/calendars/CustomCalendar.vue';
import { useI18n } from 'vue-i18n'
import InfoIcon from '@/icons/InfoIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import { isLoading } from '@/composables/spinner';
import DetailRow from '../Room/DetailRow.vue';
import router from '@/router';
import ActivitiesLogs from '../Setting/ActivitiesLogs.vue';
import BookingTable from '@/components/tables/booking-tables/BookingTable.vue';
import PaymentTable from '@/components/tables/PaymentTable.vue';
import { getServiceDepartmentDetails } from '@/services/api';
import { useServiceStore } from '@/composables/serviceStore';
import UsersTable from '@/components/tables/UsersTable.vue';
import DepartmentTaskStaff from '../StaffManagement/DepartmentTaskStaff.vue';
import BaseCalendar from '@/components/calendars/BaseCalendar.vue';
import LegendItem from '@/components/calendars/LegendItem.vue';
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
const { t ,locale} = useI18n()
const openPayment = ref(false);
const emitAssignOwner = () => {

}
const emitAddSchedule = () => {

}
const departmentId = router.currentRoute.value.params.id as string;
const currentDate = ref<Date>(new Date())
const serviceStore = useServiceStore();
const department = ref<any>({})
const activeTab = ref<string>('details')
const tabs = computed(() => [
    { id: 'details', label: t('tab.details'), icon: InfoIcon },
    { id: 'planning', label: t('tab.planning'), icon: CalendarIcon },
    { id: 'staff', label: t('tab.staff'), icon: Bookmark },
    { id: 'tasks', label: t('tab.tasks'), icon: CreditCard },
    { id: 'history', label: t('tab.history'), icon: ClockIcon },
])

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}




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
const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)

  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)) // lundi = début

  return []
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
})
const getDepartmentDetails = async () => {
    isLoading.value = true;
    const response = await getServiceDepartmentDetails(serviceStore.serviceId!, parseInt(departmentId))
    console.log('this is the getDepartmentDetails', response)
    if (response.status === 200) {
        department.value = response.data;


    }
    isLoading.value = false;
}

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
