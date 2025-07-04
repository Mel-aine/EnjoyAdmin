<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ $t('taskManagement.title') }}</h2>
            <p class="text-gray-600 mt-1">{{ $t('taskManagement.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showCreateModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>{{ $t('taskManagement.createTask') }}</span>
            </button>
            <div class="flex space-x-2">
              <button
                v-for="btn in filterButtons"
                :key="btn.value"
                @click="filter = btn.value"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === btn.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
                ]"
              >
                {{ $t(`taskManagement.filters.${btn.value}`) }} ({{ btn.count }})
              </button>
            </div>
          </div>
        </div>
        <!-- Create Task Modal -->
        <div
          v-if="showCreateModal"
          class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-99999 h-full"
        >
          <div
            class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ $t('taskManagement.createNewTask') }}
              </h3>
              <button
                @click="showCreateModal = false"
                class="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{
                  $t('taskManagement.titleLabel')
                }}</label>
                <input
                  type="text"
                  v-model="newTask.title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="$t('taskManagement.titlePlaceholder')"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{
                  $t('taskManagement.descriptionLabel')
                }}</label>
                <textarea
                  v-model="newTask.description"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  :placeholder="$t('taskManagement.descriptionPlaceholder')"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{
                    $t('taskManagement.taskType')
                  }}</label>
                  <select
                    v-model="newTask.task_type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cleaning">{{ $t('taskManagement.types.cleaning') }}</option>
                    <option value="maintenance">
                      {{ $t('taskManagement.types.maintenance') }}
                    </option>
                    <option value="front_desk">{{ $t('taskManagement.types.frontDesk') }}</option>
                    <option value="security">{{ $t('taskManagement.types.security') }}</option>
                    <option value="other">{{ $t('taskManagement.types.other') }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{
                    $t('taskManagement.priority')
                  }}</label>
                  <select
                    v-model="newTask.priority"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">{{ $t('taskManagement.priorities.low') }}</option>
                    <option value="medium">{{ $t('taskManagement.priorities.medium') }}</option>
                    <option value="high">{{ $t('taskManagement.priorities.high') }}</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{
                  $t('taskManagement.assignTo')
                }}</label>
                <select
                  v-model.number="newTask.assigned_to"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{{ $t('taskManagement.selectStaff') }}</option>
                  <option
                    v-for="staffMember in staff"
                    :key="staffMember.id"
                    :value="staffMember.userId"
                  >
                    {{ staffMember.user_name }} ({{ staffMember.role }})
                  </option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{
                    $t('taskManagement.dueDate')
                  }}</label>
                  <input
                    type="datetime-local"
                    v-model="newTask.due_date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{
                    $t('taskManagement.estimatedHours')
                  }}</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    v-model="newTask.estimated_hours"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{
                  $t('taskManagement.roomNumber')
                }}</label>
                <select
                  type="text"
                  v-model="newTask.room_number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{{ $t('taskManagement.selectRoom') }}</option>
                  <option v-for="room in rooms" :key="room.id" :value="room.id">
                    {{ room.productName }}
                  </option>
                </select>
              </div>
              <div class="flex space-x-3 pt-4">
                <button
                  @click="handleCreateTask"
                  :disabled="!newTask.title || !newTask.assigned_to || !newTask.due_date"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <span v-if="!isLoading">{{ $t('taskManagement.createTask') }}</span>
                  <span v-else class="flex items-center gap-2">
                    <Spinner class="w-4 h-4" />
                    {{ $t('Processing') }}...
                  </span>
                </button>
                <button
                  @click="showCreateModal = false"
                  class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {{ $t('common.cancel') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Tasks Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-2">
                <component :is="getTaskTypeIcon(task.task_type)" class="w-6 h-6 text-gray-700" />
                <div>
                  <h3 class="font-semibold text-gray-900">{{ task.title }}</h3>
                  <p v-if="task.serviceProductId" class="text-sm text-gray-500">
                    {{ task.roomName }}
                  </p>
                </div>
              </div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getPriorityColor(task.priority)"
              >
                {{ $t(`taskManagement.priorities.${task.priority}`) }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4">{{ task.description }}</p>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">{{ $t('taskManagement.assignedTo') }}</span>
                <span class="font-medium text-gray-900">{{
                  staff.find((s) => s.userId === task.assignedTo)?.user_name
                }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">{{ $t('taskManagement.due') }}</span>
                <span class="font-medium text-gray-900">{{
                  new Date(task.dueDate).toLocaleString()
                }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">{{ $t('taskManagement.estimatedHours') }}</span>
                <span class="font-medium text-gray-900">{{ task.estimatedHours }}h</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ $t('taskManagement.status') }}</span>
                <select
                  v-model="task.status"
                  @change="handleStatusUpdate(task.id, task.status)"
                  class="px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500"
                  :class="getStatusColor(task.status)"
                >
                  <option value="todo">{{ $t('taskManagement.filters.todo') }}</option>
                  <option value="in_progress">
                    {{ $t('taskManagement.filters.in_progress') }}
                  </option>
                  <option value="done">{{ $t('taskManagement.filters.done') }}</option>
                </select>
              </div>
              <div v-if="task.completed_at" class="text-xs text-gray-500 pt-2 border-t">
                {{ $t('taskManagement.completed') }}:
                {{ new Date(task.completed_at).toLocaleString() }}
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
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { tasks, staffData } from '@/assets/data/StaffData'
import axios from 'axios'
import { Wrench, Building2, Shield, ClipboardList } from 'lucide-vue-next'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'
import {
  getServiceProduct,
  getTasks,
  getUserAssignmentById,
  getUserId,
  updateTaskStatus,
} from '@/services/api'
import { useToast } from 'vue-toastification'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import Spinner from '@/components/spinner/Spinner.vue'

const { t } = useI18n()
const emit = defineEmits(['update-status'])
const toast = useToast()
const filter = ref('all')
const showCreateModal = ref(false)
const tasksk = ref(tasks)
const staff = ref<any[]>([])
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const rooms = ref<any[]>([])
const Tasks = ref<any[]>([])
const isLoading = ref(false)
const newTask = ref({
  title: '',
  description: '',
  task_type: 'cleaning',
  assigned_to: '',
  // assigned_by: staff.value.find(s => s.role === 'manager')?.id || (staff.value[0]?.id || ''),
  priority: 'medium',
  due_date: '',
  estimated_hours: 1.0,
  room_number: '',
})

const filterButtons = computed(() => [
  { value: 'all', label: t('taskManagement.filters.all'), count: Tasks.value.length },
  {
    value: 'todo',
    label: t('taskManagement.filters.todo'),
    count: Tasks.value.filter((t) => t.status === 'todo').length,
  },
  {
    value: 'in_progress',
    label: t('taskManagement.filters.in_progress'),
    count: Tasks.value.filter((t) => t.status === 'in_progress').length,
  },
  {
    value: 'done',
    label: t('taskManagement.filters.done'),
    count: Tasks.value.filter((t) => t.status === 'done').length,
  },
])
// const filteredTasks = computed(() => {
//     if (filter.value === 'all') return tasksk.value
//     return tasksk.value.filter(task => task.status === filter.value)
// })
const filteredTasks = computed(() => {
  if (filter.value === 'all') return Tasks.value
  return Tasks.value.filter((task) => task.status === filter.value)
})
function getStatusColor(status: string) {
  switch (status) {
    case 'todo':
      return 'bg-yellow-100 text-yellow-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'done':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
function getTaskTypeIcon(type: string) {
  switch (type) {
    case 'cleaning':
      return Building2
    case 'maintenance':
      return Wrench
    case 'front_desk':
      return Building2
    case 'security':
      return Shield
    default:
      return ClipboardList
  }
}
async function handleCreateTask() {
  isLoading.value = true
  try {
    const dueDateTime = new Date(newTask.value.due_date).toISOString()
    const taskData = {
      title: newTask.value.title,
      description: newTask.value.description,
      task_type: newTask.value.task_type,
      assigned_to: Number(newTask.value.assigned_to),
      priority: newTask.value.priority,
      due_date: dueDateTime,
      estimated_hours: parseFloat(`${newTask.value.estimated_hours}`),
      service_product_id: newTask.value.room_number || null,
      service_id: serviceStore.serviceId,
      created_by: authStore.UserId,
      status: 'todo',
    }

    console.log('taskData ready to send:', taskData)
    const API = import.meta.env.VITE_API_URL
    const response = await axios.post(`${API}/tasks`, taskData)
    console.log('API response:', response)
    if (response.status === 201) {
      showCreateModal.value = false
      toast.success(t('toast.Sucess'))
      Object.assign(newTask.value, {
        title: '',
        description: '',
        task_type: 'cleaning',
        assigned_to: '',
        // assigned_by: staff.value.find(s => s.role === 'manager')?.id || (staff.value[0]?.id || ''),
        priority: 'medium',
        due_date: '',
        estimated_hours: 1.0,
        room_number: '',
      })
      fetchTasks()
      // window.location.reload()
    }
  } catch (error) {
    alert(t('taskManagement.createTaskError'))
    console.error('Erreur lors de la creation:', error)
  } finally {
    isLoading.value = false
  }
}

const getRoom = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getServiceProduct(serviceId)
    rooms.value = response.data
    console.log('response getRoom', rooms.value)
  } catch (error) {
    console.error('Erreur lors de la recuperation:', error)
  }
}

const fetchStaff = async () => {
  try {
    const serviceId = serviceStore.serviceId

    const response = await getUserAssignmentById(serviceId)

    const assignmentsWithNames = await Promise.all(
      response.data.map(async (assignment: any) => {
        const user = await getUserId(assignment.userId)
        return {
          ...assignment,
          user_name: user.data.firstName + ' ' + user.data.lastName,
        }
      }),
    )

    staff.value = assignmentsWithNames

    console.log('fetchStaff', staff.value)
  } catch (error) {
    console.error('Erreur lors de la récupération:', error)
  }
}

const fetchTasks = async () => {
  try {
    const serviceId = serviceStore.serviceId

    const taskRes = await getTasks(serviceId)
    const taskList = taskRes.data

    if (!rooms.value || rooms.value.length === 0) {
      console.warn('rooms.value est vide ou non chargé')
      return
    }

    const roomMap = Object.fromEntries(rooms.value.map((room) => [room.id, room.productName]))

    Tasks.value = taskList.map((task) => ({
      ...task,
      roomName: roomMap[task.serviceProductId] || '—',
    }))

    console.log('Tâches  avec roomName:', Tasks.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error)
  }
}

onMounted(async () => {
  await getRoom()
  await fetchTasks()
  await fetchStaff()
})

const handleStatusUpdate = async (taskId: number, newStatus: string) => {
  try {
    await updateTaskStatus(taskId, newStatus)
    console.log(`Tâche ${taskId} mise à jour avec succès`)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
  }
}
</script>
