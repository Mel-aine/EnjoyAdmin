<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ $t('schedule.title') }}</h2>
            <p class="text-gray-600 mt-1">{{ $t('schedule.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="openCreateModal()"
              class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2">
              <span>{{ $t('schedule.addSchedule') }}</span>
            </button>
            <div class="flex items-center space-x-4">
              <button @click="setCurrentWeek(-1)"
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">{{
                  $t('schedule.prevWeek') }}</button>
              <span class="font-medium text-gray-900">
                {{ weekDates[0].toLocaleDateString() }} - {{ weekDates[6].toLocaleDateString() }}
              </span>
              <button @click="setCurrentWeek(1)"
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">{{
                  $t('schedule.nextWeek') }}</button>
            </div>
          </div>
        </div>
        <!-- Schedule Grid -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" v-if="selectedType === 'em'">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <select v-model="selectedType"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                      <option v-for="option in types" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </th>
                  <th v-for="(date, index) in weekDates" :key="index"
                    class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div>
                      <div>{{ t(`schedule.days.${dayNames[index]}`) }}</div>
                      <div class="text-sm font-normal text-gray-400">
                        {{ date.getDate() }}/{{ date.getMonth() + 1 }}
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="staffMember in staff" :key="staffMember.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-blue-600">
                            {{staffMember.user_name.split(' ').map(n => n[0]).join('')}}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ staffMember.user_name }}</div>
                        <div class="text-sm text-gray-500 capitalize">{{ staffMember.role }}</div>
                      </div>
                    </div>
                  </td>
                  <td v-for="(date, index) in weekDates" :key="index" class="px-6 py-4 whitespace-nowrap text-center">
                    <template v-if="getScheduleForStaffAndDate(staffMember.userId, date)">
                      <div class="space-y-1">
                        <button @click="handleEditSchedule(getScheduleForStaffAndDate(staffMember.userId, date))"
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 transition-opacity"
                          :class="getStatusColor(getScheduleForStaffAndDate(staffMember.userId, date).status)">
                          {{ t(`schedule.statuses.${getScheduleForStaffAndDate(staffMember.userId, date).status}`) }}
                        </button>
                        <div v-if="getScheduleForStaffAndDate(staffMember.userId, date).status === 'working'"
                          class="text-xs text-gray-500">
                          {{ formatTime(getScheduleForStaffAndDate(staffMember.userId, date).startTime) }} -
                          {{ formatTime(getScheduleForStaffAndDate(staffMember.userId, date).endTime) }}
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <button @click="openCreateModal(staffMember.userId, date.toISOString().split('T')[0])"
                        class="text-gray-400 hover:text-blue-600 text-sm border border-dashed border-gray-300 hover:border-blue-300 rounded px-2 py-1 transition-colors">{{
                          $t('schedule.add') }}</button>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" v-if="selectedType === 'dp'">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <select v-model="selectedType"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                      <option v-for="option in types" :key="option.id" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </th>
                  <th v-for="(date, index) in weekDates" :key="index"
                    class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div>
                      <div>{{ t(`schedule.days.${dayNames[index]}`) }}</div>
                      <div class="text-sm font-normal text-gray-400">
                        {{ date.getDate() }}/{{ date.getMonth() + 1 }}
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <template v-for="department in departmentsData" :key="department.id">
                  <tr>
                    <div class="px-8 py-2 text-lg font-semibold text-gray-900">{{ department.name }}</div>
                  </tr>
                  <tr v-for="staffMember in staff" :key="staffMember.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span class="text-sm font-medium text-blue-600">
                              {{staffMember.user_name.split(' ').map(n => n[0]).join('')}}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ staffMember.user_name }}</div>
                          <div class="text-sm text-gray-500 capitalize">{{ staffMember.role }}</div>
                        </div>
                      </div>
                    </td>
                    <td v-for="(date, index) in weekDates" :key="index" class="px-6 py-4 whitespace-nowrap text-center">
                      <template v-if="getScheduleForStaffAndDate(staffMember.userId, date)">
                        <div class="space-y-1">
                          <button @click="handleEditSchedule(getScheduleForStaffAndDate(staffMember.userId, date))"
                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 transition-opacity"
                            :class="getStatusColor(getScheduleForStaffAndDate(staffMember.userId, date).status)">
                            {{ t(`schedule.statuses.${getScheduleForStaffAndDate(staffMember.userId, date).status}`) }}
                          </button>
                          <div v-if="getScheduleForStaffAndDate(staffMember.userId, date).status === 'working'"
                            class="text-xs text-gray-500">
                            {{ formatTime(getScheduleForStaffAndDate(staffMember.userId, date).startTime) }} -
                            {{ formatTime(getScheduleForStaffAndDate(staffMember.userId, date).endTime) }}
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <button @click="openCreateModal(staffMember.userId, date.toISOString().split('T')[0])"
                          class="text-gray-400 hover:text-blue-600 text-sm border border-dashed border-gray-300 hover:border-blue-300 rounded px-2 py-1 transition-colors">{{
                            $t('schedule.add') }}</button>
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Schedule Modal -->
        <div v-if="showScheduleModal"
          class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center h-full justify-center z-99999">
          <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ editingSchedule ? $t('schedule.editSchedule') : $t('schedule.addSchedule') }}
              </h3>
              <button @click="showScheduleModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('schedule.staffMember') }}</label>
                <select v-model="newSchedule.staff_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="editingSchedule">
                  <option value="">{{ $t('schedule.selectStaff') }}</option>
                  <option v-for="staffMember in staff" :key="staffMember.id" :value="staffMember.userId">
                    {{ staffMember.user_name }} ({{ staffMember.role }})
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('schedule.date') }}</label>
                <input type="date" v-model="newSchedule.date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="editingSchedule" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('schedule.status') }}</label>
                <select v-model="newSchedule.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="working">{{ $t('schedule.statuses.working') }}</option>
                  <option value="rest">{{ $t('schedule.statuses.rest') }}</option>
                  <option value="sick">{{ $t('schedule.statuses.sick') }}</option>
                  <option value="vacation">{{ $t('schedule.statuses.vacation') }}</option>
                </select>
              </div>
              <div v-if="newSchedule.status === 'working'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('schedule.shiftStart') }}</label>
                  <input type="time" v-model="newSchedule.shift_start"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('schedule.shiftEnd') }}</label>
                  <input type="time" v-model="newSchedule.shift_end"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('schedule.notes') }}</label>
                <textarea v-model="newSchedule.notes"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2" :placeholder="$t('schedule.notesPlaceholder')"></textarea>
              </div>
              <div class="flex space-x-3 pt-4">
                <button @click="handleCreateOrUpdateSchedule" :disabled="!newSchedule.staff_id || !newSchedule.date"
                  class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  <span v-if="!isLoading"> {{ editingSchedule ? $t('schedule.updateSchedule') :
                    $t('schedule.addSchedule')
                  }}</span>
                  <span v-else class="flex items-center gap-2">
                    <Spinner class="w-4 h-4" />
                    {{ $t('Processing') }}...
                  </span>

                </button>
                <button @click="showScheduleModal = false"
                  class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  {{ $t('common.cancel') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Schedule Legend -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('schedule.legendTitle') }}</h3>
          <div class="flex flex-wrap gap-4">
            <div v-for="item in legend" :key="item.status" class="flex items-center space-x-2">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusColor(item.status)">{{
                  t(`schedule.statuses.${item.status}`) }}</span>
            </div>
          </div>
        </div>
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useToast } from 'vue-toastification'
import { getUserAssignmentById, getUserId, getSchedules, getDepartment } from '@/services/api'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import Spinner from '@/components/spinner/Spinner.vue'

const { t } = useI18n()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const currentWeek = ref(new Date())
const showScheduleModal = ref(false)
const editingSchedule = ref(null)
const toast = useToast()
const isLoading = ref(false)
const newSchedule = ref({
  staff_id: '',
  date: '',
  shift_start: '09:00',
  shift_end: '17:00',
  status: 'working',
  notes: ''
})
const selectedType = ref('em')
const types = ref([{ value: "em", label: "Employees" }, { value: "dp", label: "Departments" }])
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const schedules = ref([])
const staff = ref([])
const departmentsData = ref([])

// const staff = ref([])
function getWeekDates(startDate) {
  const week = []
  const start = new Date(startDate)
  start.setDate(start.getDate() - start.getDay())
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    week.push(date)
  }
  return week
}
const weekDates = computed(() => getWeekDates(currentWeek.value))

function setCurrentWeek(offset) {
  currentWeek.value = new Date(currentWeek.value.getTime() + offset * 7 * 24 * 60 * 60 * 1000)
}

function getScheduleForStaffAndDate(staffId, date) {
  const dateStr = date.toISOString().split('T')[0]
  return schedules.value.find(s => s.userId === Number(staffId) && s.scheduleDate === dateStr)
}


function getStatusColor(status) {
  switch (status) {
    case 'working': return 'bg-green-100 text-green-800'
    case 'rest': return 'bg-gray-100 text-gray-800'
    case 'sick': return 'bg-red-100 text-red-800'
    case 'vacation': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const legend = [
  { status: 'working' },
  { status: 'rest' },
  { status: 'sick' },
  { status: 'vacation' }
]

function openCreateModal(staffId = '', date = '') {
  editingSchedule.value = null
  newSchedule.value = {
    staff_id: staffId,
    date: date,
    shift_start: '09:00',
    shift_end: '17:00',
    status: 'working',
    notes: ''
  }
  showScheduleModal.value = true
}

function handleEditSchedule(schedule) {
  editingSchedule.value = schedule
  console.log("editingSchedule.value ", schedule)
  newSchedule.value = {
    staff_id: schedule.UserId,
    date: schedule.date,
    shift_start: schedule.shift_start,
    shift_end: schedule.shift_end,
    status: schedule.status,
    notes: schedule.notes || ''
  }
  showScheduleModal.value = true
}
function extractTimeOnly(time) {
  const [hour, minute] = time.split(':')
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`
}


async function handleCreateOrUpdateSchedule() {
  isLoading.value = true
  try {

    const scheduleData = {
      user_id: newSchedule.value.staff_id ?? null,
      status: newSchedule.value.status,
      schedule_date: newSchedule.value.date,
      start_time: extractTimeOnly(newSchedule.value.shift_start),
      end_time: extractTimeOnly(newSchedule.value.shift_end),
      notes: newSchedule.value.notes || null,
      service_id: serviceStore.serviceId,
      created_by: authStore.UserId
    }
    console.log("scheduleData ready to send:", scheduleData)

    const API = import.meta.env.VITE_API_URL
    let response
    if (editingSchedule.value) {
      response = await axios.put(`${API}/schedules/${editingSchedule.value.id}`, scheduleData)
    } else {
      response = await axios.post(`${API}/schedules`, scheduleData)
    }

    console.log("API response:", response)

    if (response.status === 201) {
      showScheduleModal.value = false
      editingSchedule.value = null
      toast.success(t('toast.Sucess'))
      newSchedule.value = {
        staff_id: '',
        date: '',
        shift_start: '09:00',
        shift_end: '17:00',
        status: 'working',
        notes: ''
      }
      fetchSchedules()
      // window.location.reload()
    }
  } catch (error) {
    alert(t('schedule.saveError'))
    console.error('Erreur lors de la creation:', error)
  } finally {
    isLoading.value = false
  }
}



const fetchSchedules = async () => {
  try {
    const response = await getSchedules(serviceStore.serviceId)
    schedules.value = response.data.data
    console.log('Schedules:', schedules.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires :', error)
  }
}


onMounted(async () => {
  await fetchSchedules()
  await fetchStaff()
  await fetchDepartment()
})

const fetchStaff = async () => {
  try {
    const serviceId = serviceStore.serviceId

    const response = await getUserAssignmentById(serviceId)

    const assignmentsWithNames = await Promise.all(
      response.data.map(async (assignment) => {
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

function formatTime(datetimeStr) {
  const date = new Date(datetimeStr)
  return date.toISOString().substring(11, 16)
}




const fetchDepartment = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    console.log('Service ID:', serviceId);

    const departmentsResponse = await getDepartment(serviceId);
    const departments = departmentsResponse.data;
    departmentsData.value = departments.map((d) => {
      const statusClasses = getStatusColor(d.status).split(' ')
      return {
        ...d,
        statusColor: {
          label: t(d.status),
          bg: statusClasses[0],
          text: statusClasses[1],
        },
      }
    })
    console.log('Final departments data:', departmentsData.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  } finally {
  }
};


</script>
