<template>
    <AdminLayout>
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900">{{ $t('taskManagement.title') }}</h2>
                    <p class="text-gray-600 mt-1">{{ $t('taskManagement.subtitle') }}</p>
                </div>
                <div class="flex items-center space-x-4">
                    <button @click="showCreateModal = true"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                        <span>{{ $t('taskManagement.createTask') }}</span>
                    </button>
                    <div class="flex space-x-2">
                        <button v-for="btn in filterButtons" :key="btn.value" @click="filter = btn.value" :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            filter === btn.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        ]">
                            {{ $t(`taskManagement.filters.${btn.value}`) }} ({{ btn.count }})
                        </button>
                    </div>
                </div>
            </div>
            <!-- Create Task Modal -->
            <div v-if="showCreateModal"
                class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-99999">
                <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold text-gray-900">{{ $t('taskManagement.createNewTask') }}</h3>
                        <button @click="showCreateModal = false"
                            class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('taskManagement.titleLabel') }}</label>
                            <input type="text" v-model="newTask.title"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                :placeholder="$t('taskManagement.titlePlaceholder')" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('taskManagement.descriptionLabel') }}</label>
                            <textarea v-model="newTask.description"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3" :placeholder="$t('taskManagement.descriptionPlaceholder')" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('taskManagement.taskType') }}</label>
                                <select v-model="newTask.task_type"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="cleaning">{{ $t('taskManagement.types.cleaning') }}</option>
                                    <option value="maintenance">{{ $t('taskManagement.types.maintenance') }}</option>
                                    <option value="front_desk">{{ $t('taskManagement.types.frontDesk') }}</option>
                                    <option value="security">{{ $t('taskManagement.types.security') }}</option>
                                    <option value="other">{{ $t('taskManagement.types.other') }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('taskManagement.priority') }}</label>
                                <select v-model="newTask.priority"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="low">{{ $t('taskManagement.priorities.low') }}</option>
                                    <option value="medium">{{ $t('taskManagement.priorities.medium') }}</option>
                                    <option value="high">{{ $t('taskManagement.priorities.high') }}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('taskManagement.assignTo') }}</label>
                            <select v-model="newTask.assigned_to"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">{{ $t('taskManagement.selectStaff') }}</option>
                                <option v-for="staffMember in staff" :key="staffMember.id" :value="staffMember.id">
                                    {{ staffMember.name }} ({{ staffMember.role }})
                                </option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('taskManagement.dueDate') }}</label>
                                <input type="datetime-local" v-model="newTask.due_date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('taskManagement.estimatedHours') }}</label>
                                <input type="number" min="0.5" step="0.5" v-model="newTask.estimated_hours"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('taskManagement.roomNumber') }}</label>
                            <input type="text" v-model="newTask.room_number"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                :placeholder="$t('taskManagement.roomNumberPlaceholder')" />
                        </div>
                        <div class="flex space-x-3 pt-4">
                            <button @click="handleCreateTask"
                                :disabled="!newTask.title || !newTask.assigned_to || !newTask.due_date"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                                {{ $t('taskManagement.createTask') }}
                            </button>
                            <button @click="showCreateModal = false"
                                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                                {{ $t('common.cancel') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Tasks Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="task in filteredTasks" :key="task.id"
                    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <component :is="getTaskTypeIcon(task.task_type)" class="w-6 h-6 text-gray-700" />
                            <div>
                                <h3 class="font-semibold text-gray-900">{{ task.title }}</h3>
                                <p v-if="task.room_number" class="text-sm text-gray-500">{{ $t('taskManagement.room') }} {{ task.room_number }}</p>
                            </div>
                        </div>
                        <span class="px-2 py-1 rounded-full text-xs font-medium"
                            :class="getPriorityColor(task.priority)">
                            {{ $t(`taskManagement.priorities.${task.priority}`) }}
                        </span>
                    </div>
                    <p class="text-gray-600 text-sm mb-4">{{ task.description }}</p>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-500">{{ $t('taskManagement.assignedTo') }}</span>
                            <span class="font-medium text-gray-900">{{staff.find(s => s.id === task.assigned_to)?.name }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-500">{{ $t('taskManagement.due') }}</span>
                            <span class="font-medium text-gray-900">{{ new Date(task.due_date).toLocaleString() }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-500">{{ $t('taskManagement.estimatedHours') }}</span>
                            <span class="font-medium text-gray-900">{{ task.estimated_hours }}h</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">{{ $t('taskManagement.status') }}</span>
                            <select v-model="task.status" @change="$emit('update-status', task.id, task.status)"
                                class="px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500"
                                :class="getStatusColor(task.status)">
                                <option value="todo">{{ $t('taskManagement.filters.todo') }}</option>
                                <option value="in_progress">{{ $t('taskManagement.filters.in_progress') }}</option>
                                <option value="done">{{ $t('taskManagement.filters.done') }}</option>
                            </select>
                        </div>
                        <div v-if="task.completed_at" class="text-xs text-gray-500 pt-2 border-t">
                            {{ $t('taskManagement.completed') }}: {{ new Date(task.completed_at).toLocaleString() }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="filteredTasks.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('taskManagement.noTasks') }}</h3>
                <p class="text-gray-500">{{ $t('taskManagement.noTasksMsg') }}</p>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { tasks, staffData } from '@/assets/data/StaffData'
import axios from 'axios'
import {  Wrench, Building2, Shield, ClipboardList } from 'lucide-vue-next'

const { t } = useI18n()
const emit = defineEmits(['update-status'])

const filter = ref('all')
const showCreateModal = ref(false)
const tasksk = ref(tasks)
const staff = ref(staffData)
const newTask = ref({
    title: '',
    description: '',
    task_type: 'cleaning',
    assigned_to: '',
    assigned_by: staff.value.find(s => s.role === 'manager')?.id || (staff.value[0]?.id || ''),
    priority: 'medium',
    due_date: '',
    estimated_hours: 1.0,
    room_number: ''
})

const filterButtons = computed(() => [
    { value: 'all', label: t('taskManagement.filters.all'), count: tasksk.value.length },
    { value: 'todo', label: t('taskManagement.filters.todo'), count: tasksk.value.filter(t => t.status === 'todo').length },
    { value: 'in_progress', label: t('taskManagement.filters.in_progress'), count: tasksk.value.filter(t => t.status === 'in_progress').length },
    { value: 'done', label: t('taskManagement.filters.done'), count: tasksk.value.filter(t => t.status === 'done').length }
])
const filteredTasks = computed(() => {
    if (filter.value === 'all') return tasksk.value
    return tasksk.value.filter(task => task.status === filter.value)
})
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
function getTaskTypeIcon(type: string) {
    switch (type) {
         case 'cleaning': return Building2
        case 'maintenance': return Wrench
        case 'front_desk': return Building2
        case 'security': return Shield
        default: return ClipboardList
    }
}
async function handleCreateTask() {
    try {
        const dueDateTime = new Date(newTask.value.due_date).toISOString()
        const taskData = {
            ...newTask.value,
            due_date: dueDateTime,
            estimated_hours: parseFloat(newTask.value.estimated_hours),
            room_number: newTask.value.room_number || null
        }
        const API = import.meta.env.VITE_BACKEND_URL + '/api'
        const response = await axios.post(`${API}/tasks`, taskData)
        if (response.status === 200) {
            showCreateModal.value = false
            Object.assign(newTask.value, {
                title: '',
                description: '',
                task_type: 'cleaning',
                assigned_to: '',
                assigned_by: staff.value.find(s => s.role === 'manager')?.id || (staff.value[0]?.id || ''),
                priority: 'medium',
                due_date: '',
                estimated_hours: 1.0,
                room_number: ''
            })
            window.location.reload()
        }
    } catch (error) {
        alert(t('taskManagement.createTaskError'))
    }
}
</script>