<template>
    <AdminLayout>
        <div v-if="dashboardData" class="space-y-6">
            <div>
                <h2 class="text-3xl font-bold text-gray-900">{{ $t('dashboard.title') }}</h2>
                <p class="text-gray-600 mt-1">{{ $t('dashboard.subtitle') }}</p>
            </div>
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users class="text-blue-600 w-5 h-5" />
                            </div>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.activeStaff') }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ dashboardData.active_staff }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Target class="text-green-600 w-5 h-5" />
                            </div>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.staffOnDuty') }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ dashboardData.staff_on_duty }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <ClipboardList class="text-yellow-600 w-5 h-5" />
                            </div>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.todaysTasks') }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ dashboardData.today_tasks?.total }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertTriangle class="text-red-600 w-5 h-5" />
                            </div>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.overdueTasks') }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ dashboardData.overdue_tasks }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Task Status Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('dashboard.taskStatusDistribution') }}</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-600">{{ $t('dashboard.todo') }}</span>
                            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                {{ dashboardData.today_tasks?.todo }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-600">{{ $t('dashboard.inProgress') }}</span>
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {{ dashboardData.today_tasks?.in_progress }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-600">{{ $t('dashboard.completed') }}</span>
                            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {{ dashboardData.today_tasks?.done }}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Recent Tasks -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('dashboard.recentTasks') }}</h3>
                    <div class="space-y-3">
                        <div v-for="task in dashboardData.recent_tasks" :key="task.id"
                            class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
                                <p class="text-xs text-gray-500">
                                    {{ staff.find(s => s.id === task.assigned_to)?.name }} •
                                    {{ task.room_number ? $t('dashboard.room', { room: task.room_number }) : $t('dashboard.general') }}
                                </p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-1 rounded-full text-xs font-medium"
                                    :class="getPriorityColor(task.priority)">
                                    {{ $t(`dashboard.priorities.${task.priority}`) }}
                                </span>
                                <span class="px-2 py-1 rounded-full text-xs font-medium"
                                    :class="getStatusColor(task.status)">
                                    {{ $t(`dashboard.statuses.${task.status}`) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>{{ $t('dashboard.loading') }}</div>
    </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted } from 'vue'
import { dashboard, schedulesM, staffData, tasks as tasksData } from '@/assets/data/StaffData'
import { useI18n } from 'vue-i18n'
import { Users, Target, ClipboardList, AlertTriangle } from 'lucide-vue-next'

const { t } = useI18n()

function getStatusColor(status: string) {
    switch (status) {
        case 'todo': return 'bg-yellow-100 text-yellow-800'
        case 'in_progress': return 'bg-blue-100 text-blue-800'
        case 'done': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}
function getPriorityColor(priority: string) {
    switch (priority) {
        case 'high': return 'bg-red-100 text-red-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'low': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const dashboardData = ref<Record<string,any>>({})
const staff = ref<Record<string,any>[]>([])
const tasks = ref<Record<string,any>[]>([])
const schedules = ref<Record<string,any>[]>([])
const loading = ref(true)

async function fetchData() {
    try {
        loading.value = true
        dashboardData.value = dashboard
        staff.value = staffData
        tasks.value = tasksData
        schedules.value = schedulesM
    } catch (error) {
        console.error('Error fetching data:', error)
    } finally {
        loading.value = false
    }
}

onMounted(fetchData)
</script>