<template>
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ $t('horaireManage') }}</h2>
        <p class="text-gray-600">{{ $t('config') }}</p>
      </div>


      <!-- Configuration globale -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-3">{{ $t('fastConfig') }}</h3>
        <div class="flex flex-wrap gap-2">
          <button
            @click="setSchedule('24h')"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            24h/24 - 7j/7
          </button>

          <button
            @click="resetSchedule()"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            {{ $t('reset') }}
          </button>
        </div>
      </div>

      <!-- Horaires par jour -->
      <div class="space-y-4">
        <div
          v-for="day in weekDays"
          :key="day.key"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <input
                type="checkbox"
                :id="day.key"
                v-model="schedule[day.key].isOpen"
                class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              >
              <label :for="day.key" class="font-medium text-gray-700">
                {{ day.name }}
              </label>
            </div>

            <div v-if="schedule[day.key].isOpen" class="flex items-center space-x-2">
              <button
                @click="addTimeSlot(day.key)"
                class="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                + {{ $t('addCreneau') }}
              </button>
            </div>
          </div>

          <div v-if="schedule[day.key].isOpen" class="space-y-2">
            <div
              v-for="(slot, index) in schedule[day.key].timeSlots"
              :key="index"
              class="flex items-center space-x-3 bg-gray-50 p-3 rounded-md"
            >
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">{{ $t('opening') }}:</label>
                <input
                  type="time"
                  v-model="slot.open"
                  class="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
              </div>

              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">{{ $t('closing') }}:</label>
                <input
                  type="time"
                  v-model="slot.close"
                  class="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
              </div>

              <button
                v-if="schedule[day.key].timeSlots.length > 1"
                @click="removeTimeSlot(day.key, index)"
                class="p-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div v-else class="text-sm text-gray-500 italic">
            {{ $t('close') }}
          </div>
        </div>
      </div>

      <!-- Notes et exceptions -->
      <div class="mt-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('specialNote') }}</label>
          <textarea
            v-model="specialNotes"
            :placeholder="$t('exple')"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="3"
          ></textarea>
        </div>

        <!-- Exceptions de dates -->
        <div>
          <h3 class="font-semibold text-gray-800 mb-3">{{ $t('exception') }}</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <div
              v-for="(exception, index) in dateExceptions"
              :key="index"
              class="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-md"
            >
              <span class="text-sm">{{ formatDate(exception.date) }}</span>
              <span class="text-sm text-gray-600">{{ exception.note }}</span>
              <button
                @click="removeDateException(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex space-x-2">
            <input
              type="date"
              v-model="newException.date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
            <input
              type="text"
              v-model="newException.note"
              :placeholder="$t('expleNote')"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
            <button
              @click="addDateException()"
              class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              {{ $t('add') }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </template>

  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'


  // Types
  interface TimeSlot {
    open: string
    close: string
  }
const { t } = useI18n()
  interface DaySchedule {
    isOpen: boolean
    timeSlots: TimeSlot[]
  }

  interface Schedule {
    [key: string]: DaySchedule
  }

  interface DateException {
    date: string
    note: string
  }

  interface WeekDay {
    key: string
    name: string
  }

  // Données réactives
  const serviceType = ref<string>('restaurant')
  const specialNotes = ref<string>('')

  const weekDays: WeekDay[] = [
    { key: 'monday', name: t('Lundi') },
    { key: 'tuesday', name: 'Mardi' },
    { key: 'wednesday', name: 'Mercredi' },
    { key: 'thursday', name: 'Jeudi' },
    { key: 'friday', name: 'Vendredi' },
    { key: 'saturday', name: 'Samedi' },
    { key: 'sunday', name: 'Dimanche' }
  ]

  const schedule = reactive<Schedule>({
    monday: { isOpen: true, timeSlots: [{ open: '09:00', close: '17:00' }] },
    tuesday: { isOpen: true, timeSlots: [{ open: '09:00', close: '17:00' }] },
    wednesday: { isOpen: true, timeSlots: [{ open: '09:00', close: '17:00' }] },
    thursday: { isOpen: true, timeSlots: [{ open: '09:00', close: '17:00' }] },
    friday: { isOpen: true, timeSlots: [{ open: '09:00', close: '17:00' }] },
    saturday: { isOpen: false, timeSlots: [{ open: '09:00', close: '17:00' }] },
    sunday: { isOpen: false, timeSlots: [{ open: '09:00', close: '17:00' }] }
  })

  const dateExceptions = ref<DateException[]>([])
  const newException = reactive<DateException>({
    date: '',
    note: ''
  })

  // Méthodes
  const addTimeSlot = (day: string): void => {
    schedule[day].timeSlots.push({ open: '09:00', close: '17:00' })
  }

  const removeTimeSlot = (day: string, index: number): void => {
    schedule[day].timeSlots.splice(index, 1)
  }

  const setSchedule = (type: string): void => {
    const templates = {
      '24h': { open: '00:00', close: '23:59', allDays: true },
      'business': { open: '09:00', close: '17:00', weekdaysOnly: true },
      'restaurant': {
        slots: [
          { open: '12:00', close: '14:00' },
          { open: '19:00', close: '22:00' }
        ],
        allDays: true
      }
    }

    weekDays.forEach(day => {
      if (type === '24h') {
        schedule[day.key].isOpen = true
        schedule[day.key].timeSlots = [{ open: '00:00', close: '23:59' }]
      } else if (type === 'business') {
        schedule[day.key].isOpen = !['saturday', 'sunday'].includes(day.key)
        schedule[day.key].timeSlots = [{ open: '09:00', close: '17:00' }]
      } else if (type === 'restaurant') {
        schedule[day.key].isOpen = true
        schedule[day.key].timeSlots = [
          { open: '12:00', close: '14:00' },
          { open: '19:00', close: '22:00' }
        ]
      }
    })
  }

  const resetSchedule = (): void => {
    weekDays.forEach(day => {
      schedule[day.key].isOpen = false
      schedule[day.key].timeSlots = [{ open: '09:00', close: '17:00' }]
    })
  }

  const addDateException = (): void => {
    if (newException.date && newException.note) {
      dateExceptions.value.push({ ...newException })
      newException.date = ''
      newException.note = ''
    }
  }

  const removeDateException = (index: number): void => {
    dateExceptions.value.splice(index, 1)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getScheduleData = () => {
    return {
      serviceType: serviceType.value,
      schedule: schedule,
      specialNotes: specialNotes.value,
      dateExceptions: dateExceptions.value,
      lastUpdated: new Date().toISOString()
    }
  }

  const saveSchedule = (): void => {
    const data = getScheduleData()
    console.log('Horaires sauvegardés:', data)

  }


  </script>
