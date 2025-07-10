
<template>
  <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold dark:text-white">{{ $t('weekly_occupancy') }}</h2>
      <div class="flex space-x-2">
        <button
          class="text-gray-500 hover:text-gray-700 relative"
          :class="getButtonClass('weekly')"
          @click="handleViewChange('weekly')"
          :disabled="isViewLoading"
        >
          <span class="text-sm">{{ $t('this_week') }}</span>
          <div
            v-if="isViewLoading && pendingView === 'weekly'"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
        </button>
        <button
          class="text-gray-400 hover:text-gray-700 relative"
          :class="getButtonClass('monthly')"
          @click="handleViewChange('monthly')"
          :disabled="isViewLoading"
        >
          <span class="text-sm">{{ $t('month') }}</span>
          <div
            v-if="isViewLoading && pendingView === 'monthly'"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
        </button>
        <button
          class="text-gray-400 hover:text-gray-700 relative"
          :class="getButtonClass('yearly')"
          @click="handleViewChange('yearly')"
          :disabled="isViewLoading"
        >
          <span class="text-sm">{{ $t('year') }}</span>
          <div
            v-if="isViewLoading && pendingView === 'yearly'"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
        </button>
      </div>
    </div>

    <div v-if="currentData.length && previousData.length && !isViewLoading" class="h-64">
      <div ref="echartRef" class="w-full h-full"></div>
    </div>
    <div v-else class="h-64 flex items-center justify-center text-gray-500">
      <div v-if="isViewLoading" class="flex flex-col items-center space-y-3">
        <div
          class="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-sm">{{ $t('loading') }}...</span>
      </div>
      <div v-else>
        {{ $t('loading') }}
      </div>
    </div>

    <div v-if="!isViewLoading" class="grid grid-cols-7 gap-2 mt-4">
      <div v-for="(day, index) in currentDataWithoutMonthly" :key="index" class="text-center">
        <div class="text-sm font-medium">{{ $t(`Days.${day.label.toLowerCase()}`) }}</div>
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

const { t, locale } = useI18n()
const isViewLoading = ref(false)
const pendingView = ref<'weekly' | 'monthly' | 'yearly' | null>(null)

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
const currentDataWithoutMonthly = computed(() =>
  props.data?.current.filter((i: any) => !/^\d{2}$/.test(i.label))
)



const getOccupancyColor = (rate: number) => {
  if (rate < 60) return 'text-red-500'
  if (rate < 80) return 'text-yellow-500'
  return 'text-green-500'
}

const getButtonClass = (period: string) => {
  const base = 'hover:text-gray-700 transition-colors duration-200'
  const disabled = isViewLoading.value ? 'opacity-50 cursor-not-allowed' : ''
  const active =
    props.currentPeriod === period ? `${base} text-orange-600 font-medium` : `${base} text-gray-400`
  return `${active} ${disabled}`
}

const handleViewChange = (view: 'weekly' | 'monthly' | 'yearly') => {
  if (isViewLoading.value || props.currentPeriod === view) return
  isViewLoading.value = true
  pendingView.value = view

  setTimeout(() => {
    emit('changeView', view)
  }, 100)
}

const renderChart = () => {
  console.log('[renderChart] called')

  if (!echartRef.value) {
    console.warn('[renderChart] echartRef is null')
    return
  }

  const container = echartRef.value
  const width = container.offsetWidth
  const height = container.offsetHeight

  console.log(`[renderChart] container size: ${width}x${height}`)

  if (width === 0 || height === 0) {
    console.warn('[renderChart] container has zero size, chart will not render')
    return
  }

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(container)
  console.log('[renderChart] chart initialized')

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      padding: 12,
      textStyle: { color: '#fff' },
      formatter: (params: any[]) =>
        params.map((p) => `${p.marker} ${p.seriesName}: ${p.data}%`).join('<br/>'),
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
      data: currentData.value.map((d:any) => t(`Days.${d.label.toLowerCase()}`)),
      axisLine: { lineStyle: { color: '#4B5563' } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: { formatter: '{value} %' },
      axisLine: { lineStyle: { color: '#4B5563' } },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
    },
    series: [
      {
        name: t('occupancy_rate'),
        type: 'line',
        data: currentData.value.map((d:any) => d.occupancyRate),
        areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
        lineStyle: { color: 'rgba(59, 130, 246, 1)' },
        symbolSize: 6,
        smooth: true,
      },
      {
        name: t('previous'),
        type: 'line',
        data: previousData.value.map((d:any) => d.occupancyRate),
        symbolSize: 6,
        lineStyle: { type: 'dashed', color: 'rgba(209, 213, 219, 1)' },
        smooth: true,
      },
    ],
  }

  chartInstance.setOption(option)
  chartInstance.resize()
  console.log('[renderChart] chart options set and resized')
}

const tryRenderChart = async () => {
  await nextTick()
  requestAnimationFrame(() => {
    console.log('[tryRenderChart] DOM ready, calling renderChart')
    renderChart()
  })
}

watch(locale, tryRenderChart)
watch(
  () => props.data,
  async (newVal:any) => {
    if (newVal.current.length && newVal.previous.length) {
      console.log('[watch:data] data updated, will render chart')
      isViewLoading.value = false
      pendingView.value = null
      tryRenderChart()
    }
  },
  { immediate: true, deep: true },
)

onMounted(async () => {
  await nextTick()
  if (!props.currentPeriod) {
    emit('changeView', 'weekly')
  }

  if (currentData.value.length && previousData.value.length) {
    tryRenderChart()
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
