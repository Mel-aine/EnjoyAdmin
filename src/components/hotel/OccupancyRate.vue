<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">{{ $t('weekly_occupancy') }}</h2>
      <div class="flex space-x-2">
        <button
          class="text-gray-500 hover:text-gray-700"
          :class="getButtonClass('weekly')"
          @click="emit('changeView', 'weekly')"
        >
          <span class="text-sm">{{ $t('this_week') }}</span>
        </button>
        <button
          class="text-gray-400 hover:text-gray-700"
          :class="getButtonClass('monthly')"
          @click="emit('changeView', 'monthly')"
        >
          <span class="text-sm">{{ $t('month') }}</span>
        </button>
        <button
          class="text-gray-400 hover:text-gray-700"
          :class="getButtonClass('yearly')"
          @click="emit('changeView', 'yearly')"
        >
          <span class="text-sm">{{ $t('year') }}</span>
        </button>
      </div>
    </div>

    <div v-if="currentData.length && previousData.length" class="h-64">
      <div ref="echartRef" class="w-full h-full"></div>
    </div>
    <div v-else class="h-64 flex items-center justify-center text-gray-500">
      {{ $t('loading') }}
    </div>

    <div class="grid grid-cols-7 gap-2 mt-4">
      <div v-for="(day, index) in currentData" :key="index" class="text-center">
        <div class="text-sm font-medium">{{ day.label }}</div>
        <div class="text-lg font-semibold" :class="getOccupancyColor(day.occupancyRate)">
          {{ day.occupancyRate }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'

interface DayRate {
  label: string
  occupancyRate: number
}

const { t } = useI18n()

const props = defineProps<{
  data: {
    current: DayRate[]
    previous: DayRate[]
  }
  currentPeriod?: 'weekly' | 'monthly' | 'yearly'
}>()

const emit = defineEmits<{
  changeView: [view: 'weekly' | 'monthly' | 'yearly']
}>()

const echartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const currentData = computed(() => props.data?.current || [])
const previousData = computed(() => props.data?.previous || [])

const getOccupancyColor = (rate: number) => {
  if (rate < 60) return 'text-red-500'
  if (rate < 80) return 'text-yellow-500'
  return 'text-green-500'
}

const getButtonClass = (period: string) => {
  const base = 'hover:text-gray-700'
  return props.currentPeriod === period
    ? `${base} text-orange-600 font-medium`
    : `${base} text-gray-400`
}

const renderChart = () => {
  if (!echartRef.value || !currentData.value.length || !previousData.value.length) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(echartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      padding: 12,
      textStyle: {
        color: '#fff',
      },
      formatter: (params: any[]) => {
        return params.map((p) => `${p.marker} ${p.seriesName}: ${p.data}%`).join('<br/>')
      },
    },
    legend: {
      data: [t('occupancy_rate'), t('previous')],
      top: 10,
      right: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: currentData.value.map((day) => day.label),
      axisLine: { lineStyle: { color: '#4B5563' } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: '{value} %',
      },
      axisLine: { lineStyle: { color: '#4B5563' } },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
    },
    series: [
      {
        name: t('occupancy_rate'),
        type: 'line',
        data: currentData.value.map((day) => day.occupancyRate),
        areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
        lineStyle: { color: 'rgba(59, 130, 246, 1)' },
        symbolSize: 6,
        smooth: true,
      },
      {
        name: t('previous'),
        type: 'line',
        data: previousData.value.map((day) => day.occupancyRate),
        symbolSize: 6,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(209, 213, 219, 1)',
        },
        smooth: true,
      },
    ],
  }

  chartInstance.setOption(option)
  chartInstance.resize()
}

watch(
  () => props.data,
  async (newVal) => {
    if (newVal.current.length && newVal.previous.length) {
      await nextTick()
      renderChart()
    }
  },
  { immediate: true, deep: true },
)

onMounted(async () => {
  await nextTick()

  // Déclenche "weekly" par défaut si pas défini
  if (!props.currentPeriod) {
    emit('changeView', 'weekly')
  }

  if (currentData.value.length && previousData.value.length) {
    renderChart()
    window.addEventListener('resize', resizeChart)
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', resizeChart)
})

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}
</script>
