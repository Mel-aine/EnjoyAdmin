<template>
  <div>
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <slot name="icon">
              <CalendarIcon class="w-5 h-5 mr-2 text-blue-600" />
            </slot>
            {{ title }}
          </h3>
          <p class="text-sm text-gray-600 mt-1 capitalize">{{ currentMonth }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="$emit('previous-month')" class="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <button @click="$emit('next-month')" class="p-2 hover:bg-gray-100 rounded-lg">
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
          {{ $t(day) }}
        </div>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in days"
          :key="index"
          :class="[
            'aspect-square p-2 text-sm border rounded-lg relative cursor-pointer transition-all',
            day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
            day.isToday ? 'bg-blue-100 border-blue-300 font-bold' : 'border-gray-200',
            dayModifiers?.(day) || ''
          ]"
          @click="$emit('day-click', day)"
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
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

interface BaseCalendarDay {
  date: Date
  isToday: boolean
  isCurrentMonth: boolean
  [key: string]: any
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

defineProps<{
  title: string
  currentMonth: string
  days: BaseCalendarDay[]
  dayModifiers?: (day: BaseCalendarDay) => string
}>()

defineEmits<{
  (e: 'previous-month'): void
  (e: 'next-month'): void
  (e: 'day-click', day: BaseCalendarDay): void
}>()
</script>
