<template>
  <div class="bg-white dark:bg-gray-800 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
    </div>

    <div class="flex items-center justify-center mb-4">
      <div class="relative w-28 h-28">
        <!-- Loading Spinner -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>

        <!-- Circular Progress -->
        <svg v-else class="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="#e5e7eb" stroke-width="8" fill="none" />

          <circle
            v-for="segment in segments"
            :key="segment.label"
            cx="50"
            cy="50"
            r="40"
            :stroke="segment.color"
            stroke-width="8"
            fill="none"
            stroke-linecap="butt"
            :stroke-dasharray="`${segment.value} ${CIRCUMFERENCE - segment.value}`"
            :stroke-dashoffset="segment.offset"
          />
        </svg>

        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ total }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-1">
      <div v-for="segment in legend" :key="segment.label" class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: segment.color }"></div>
        <span class="text-xs text-gray-600 dark:text-gray-400">
          {{ segment.label }} ({{ segment.count }})
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Segment {
  label: string
  count: number
  color: string
  value: number
  offset: number
}

const props = defineProps<{
  title: string
  isLoading: boolean
  data: Record<string, number>
  colors?: string[]
}>()

const { t } = useI18n()

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Total count
const total = computed(() => Object.values(props.data).reduce((a:any, b:any) => a + b, 0))

// Legend with translation
const legend = computed(() => {
  return Object.keys(props.data).map((key, i) => ({
    label: t(`frontOffice.dashboard.${key}`),
    count: props.data[key],
    color: props.colors?.[i] || '#3b82f6',
  }))
})

// Segments for SVG
const segments = computed<Segment[]>(() => {
  let cumulativeOffset = 0
  return legend.value.map((v) => {
    const percent = total.value > 0 ? v.count / total.value : 0
    const value = percent * CIRCUMFERENCE
    const segment: Segment = {
      label: v.label,
      count: v.count,
      color: v.color,
      value,
      offset: -cumulativeOffset,
    }
    cumulativeOffset += value
    return segment
  })
})
</script>
