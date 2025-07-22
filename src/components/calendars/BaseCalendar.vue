
<template>
  <div>
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <slot name="icon">
              <CalendarIcon class="w-5 h-5 mr-2 text-purple-600" />
            </slot>
            {{ title }}
          </h3>
          <p class="text-sm text-gray-600 mt-1 capitalize">{{ currentMonthDisplay }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRightIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Days of week -->
    <div class="p-6">
      <div class="grid grid-cols-7 gap-1 mb-4">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="p-3 text-center text-sm font-medium text-gray-500"
        >
          {{ $t ? $t(day) : day }}
        </div>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'aspect-square p-2 text-sm border rounded-lg relative cursor-pointer transition-all',
            day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
            day.isToday ? 'bg-blue-100 border-blue-300 font-bold' : 'border-gray-200',
            getDayModifiers(day)
          ]"
          @click="onDayClick(day)"
        >
          <div class="font-medium">{{ day.date.getDate() }}</div>

          <!-- Slot pour contenu custom -->
          <div class="absolute bottom-1 left-1 right-1">
            <slot name="day-content" :day="day" />
          </div>
        </div>
      </div>

      <!-- Legend Slot -->
      <div class="mt-6">
        <slot name="legend" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'


const { t ,locale } = useI18n()

interface BaseCalendarDay {
  date: Date
  isToday: boolean
  isCurrentMonth: boolean
  [key: string]: any
}

interface Props {
  title: string
  initialDate?: Date
  events?: any[]
  dayModifiers?: (day: BaseCalendarDay) => string
}

const props = withDefaults(defineProps<Props>(), {
  initialDate: () => new Date(),
  events: () => [],
  dayModifiers: () => () => ''
})

const emit = defineEmits<{
  (e: 'month-changed', date: Date): void
  (e: 'day-click', day: BaseCalendarDay): void
}>()

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentDate = ref(new Date(props.initialDate))



const currentMonthDisplay = computed(() => {
  return currentDate.value.toLocaleDateString(locale.value, {
    month: 'long',
    year: 'numeric',
  })
})

// Construction du calendrier
const calendarDays = computed(() => {
  const days: BaseCalendarDay[] = []
  const firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const lastDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  const today = new Date()

  // Jours du mois précédent pour compléter la première semaine
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  // Générer 42 jours (6 semaines)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const day: BaseCalendarDay = {
      date,
      isToday: date.toDateString() === today.toDateString(),
      isCurrentMonth: date.getMonth() === currentDate.value.getMonth(),
      // Ajouter les événements du parent pour ce jour
      events: props.events?.filter(event =>
        event.date && new Date(event.date).toDateString() === date.toDateString()
      ) || []
    }

    days.push(day)
  }

  return days
})

// Méthodes de navigation
const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  emit('month-changed', newDate)
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  emit('month-changed', newDate)
}

const onDayClick = (day: BaseCalendarDay) => {
  emit('day-click', day)
}

const getDayModifiers = (day: BaseCalendarDay) => {
  return props.dayModifiers ? props.dayModifiers(day) : ''
}

// Watch pour réagir aux changements de date initiale
watch(() => props.initialDate, (newDate) => {
  if (newDate) {
    currentDate.value = new Date(newDate)
  }
})
</script>
