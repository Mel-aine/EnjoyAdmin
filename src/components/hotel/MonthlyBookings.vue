 <!-- <template>
    <div class="bg-white rounded-lg shadow p-6 h-full">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">{{ $t('monthly_reservation') }}</h2>
        <div class="relative">
          <select v-model="selectedMonth" @change="updateChartData"
            class="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm">
            <option>{{ $t('may') }} 2025</option>
            <option>{{ $t('april') }} 2025</option>
            <option>{{ $t('march') }} 2025</option>
            <option>{{ $t('february') }} 2025</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="relative h-64">
        <canvas ref="bookingsChart"></canvas>
      </div>

      <div class="mt-6 space-y-3">
        <div class="flex items-center justify-between border-b pb-3">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span class="text-sm font-medium">{{ $t('direct_booking') }}</span>
          </div>
          <div class="flex items-center">
            <span class="font-semibold mr-1">58</span>
            <span class="text-xs text-green-500">+12%</span>
          </div>
        </div>

        <div class="flex items-center justify-between border-b pb-3">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span class="text-sm font-medium">Via OTA (Booking, etc.)</span>
          </div>
          <div class="flex items-center">
            <span class="font-semibold mr-1">124</span>
            <span class="text-xs text-green-500">+5%</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span class="text-sm font-medium">{{ $t('groupe') }}</span>
          </div>
          <div class="flex items-center">
            <span class="font-semibold mr-1">32</span>
            <span class="text-xs text-red-500">-3%</span>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <div class="px-4 py-2 text-sm text-center">
          <div class="text-3xl font-bold text-blue-600">214</div>
          <div class="text-gray-500">{{ $t('total_reservation') }}</div>
        </div>
        <div class="border-l px-4 py-2 text-sm text-center">
          <div class="text-3xl font-bold text-green-600">25.8K FCFA</div>
          <div class="text-gray-500">{{ $t('earnings') }}</div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Chart, registerables } from 'chart.js'

  Chart.register(...registerables)

  const bookingsChart = ref<HTMLCanvasElement | null>(null)
  const chart = ref<Chart | null>(null)
  const selectedMonth = ref('Mai 2025')

  const bookingsData: Record<string, { direct: number[], ota: number[], group: number[] }> = {
    'Mai 2025': {
      direct: [12, 15, 18, 13],
      ota: [28, 32, 36, 28],
      group: [8, 4, 12, 8]
    },
    'Avril 2025': {
      direct: [10, 13, 16, 14],
      ota: [25, 30, 34, 26],
      group: [6, 5, 10, 9]
    },
    'Mars 2025': {
      direct: [9, 11, 14, 10],
      ota: [20, 22, 28, 25],
      group: [5, 6, 8, 7]
    },
    'Février 2025': {
      direct: [8, 10, 11, 9],
      ota: [18, 20, 23, 21],
      group: [4, 5, 6, 6]
    }
  }

  const initChart = () => {
    const ctx = bookingsChart.value?.getContext('2d')
    if (!ctx) return

    chart.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Réservations directes',
            data: bookingsData[selectedMonth.value].direct,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 4
          },
          {
            label: 'Via OTA',
            data: bookingsData[selectedMonth.value].ota,
            backgroundColor: 'rgba(245, 158, 11, 0.7)',
            borderRadius: 4
          },
          {
            label: 'Groupes & Entreprises',
            data: bookingsData[selectedMonth.value].group,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            padding: 12,
            titleFont: {
              weight: 'bold'
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              // borderDash: [2, 2]
            }
          }
        }
      }
    })
  }

  const updateChartData = () => {
    if (!chart.value) return

    const data = bookingsData[selectedMonth.value]
    chart.value.data.datasets[0].data = data.direct
    chart.value.data.datasets[1].data = data.ota
    chart.value.data.datasets[2].data = data.group
    chart.value.update()
  }

  onMounted(() => {
    initChart()
  })
  </script> -->
 <!-- <template>
  <div class="bg-white rounded-lg shadow p-6 h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold">{{ $t('monthly_reservation') }}</h2>
      <div class="relative">
        <select v-model="selectedMonth" @change="updateChartData"
          class="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm">
          <option v-for="month in months" :key="month">{{ month }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="relative h-64" ref="chartContainer"></div>

    <div class="mt-6 space-y-3">
      <div class="flex items-center justify-between border-b pb-3">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span class="text-sm font-medium">{{ $t('direct_booking') }}</span>
        </div>
        <div class="flex items-center">
          <span class="font-semibold mr-1">58</span>
          <span class="text-xs text-green-500">+12%</span>
        </div>
      </div>

      <div class="flex items-center justify-between border-b pb-3">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span class="text-sm font-medium">Via OTA (Booking, etc.)</span>
        </div>
        <div class="flex items-center">
          <span class="font-semibold mr-1">124</span>
          <span class="text-xs text-green-500">+5%</span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
          <span class="text-sm font-medium">{{ $t('groupe') }}</span>
        </div>
        <div class="flex items-center">
          <span class="font-semibold mr-1">32</span>
          <span class="text-xs text-red-500">-3%</span>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-6">
      <div class="px-4 py-2 text-sm text-center">
        <div class="text-3xl font-bold text-blue-600">214</div>
        <div class="text-gray-500">{{ $t('total_reservation') }}</div>
      </div>
      <div class="border-l px-4 py-2 text-sm text-center">
        <div class="text-3xl font-bold text-green-600">25.8K FCFA</div>
        <div class="text-gray-500">{{ $t('earnings') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const months = ['Mai 2025', 'Avril 2025', 'Mars 2025', 'Février 2025']
const selectedMonth = ref(months[0])

const bookingsData: Record<string, { direct: number[], ota: number[], group: number[] }> = {
  'Mai 2025': {
    direct: [12, 15, 18, 13],
    ota: [28, 32, 36, 28],
    group: [8, 4, 12, 8]
  },
  'Avril 2025': {
    direct: [10, 13, 16, 14],
    ota: [25, 30, 34, 26],
    group: [6, 5, 10, 9]
  },
  'Mars 2025': {
    direct: [9, 11, 14, 10],
    ota: [20, 22, 28, 25],
    group: [5, 6, 8, 7]
  },
  'Février 2025': {
    direct: [8, 10, 11, 9],
    ota: [18, 20, 23, 21],
    group: [4, 5, 6, 6]
  }
}

const initChart = () => {
  if (!chartContainer.value) return
  chartInstance = echarts.init(chartContainer.value)
  setChartOptions()
}

const setChartOptions = () => {
  if (!chartInstance) return

  const data = bookingsData[selectedMonth.value]

  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      padding: 12,
      textStyle: {
        fontWeight: 'bold'
      }
    },
    legend: {
      show: false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      axisLine: { lineStyle: { color: '#ccc' } },
      axisTick: { alignWithLabel: true },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#ccc' } },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      minInterval: 1
    },
    series: [
      {
        name: 'Réservations directes',
        type: 'bar',
        data: data.direct,
        itemStyle: {
          color: 'rgba(59, 130, 246, 0.7)',
          borderRadius: 4
        },
        barGap: 0
      },
      {
        name: 'Via OTA',
        type: 'bar',
        data: data.ota,
        itemStyle: {
          color: 'rgba(245, 158, 11, 0.7)',
          borderRadius: 4
        }
      },
      {
        name: 'Groupes & Entreprises',
        type: 'bar',
        data: data.group,
        itemStyle: {
          color: 'rgba(16, 185, 129, 0.7)',
          borderRadius: 4
        }
      }
    ]
  })
}

const updateChartData = () => {
  setChartOptions()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    chartInstance?.resize()
  })
  chartInstance?.dispose()
})

watch(selectedMonth, () => {
  updateChartData()
})
</script> -->


<template>
  <div class="bg-white rounded-lg shadow p-6 h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold">{{ t('monthly_reservation') }}</h2>
      <div class="relative">
        <select v-model="selectedMonth" @change="updateChartData"
          class="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm">
          <option v-for="month in months" :key="month.key" :value="month.key">
            {{ t(month.label) }} {{ month.year }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>

    <div ref="chartRef" class="relative h-64 w-full"></div>

    <div class="mt-6 space-y-3">
      <div v-for="(item, index) in legendItems" :key="index" class="flex items-center justify-between" :class="index < legendItems.length - 1 ? 'border-b pb-3' : ''">
        <div class="flex items-center">
          <div :class="['w-3', 'h-3', 'rounded-full', 'mr-2', item.color]"></div>
          <span class="text-sm font-medium">{{ t(item.label) }}</span>
        </div>
        <div class="flex items-center">
          <span class="font-semibold mr-1">{{ summary[item.key] }}</span>
          <span :class="summary[item.key + 'Change'] > 0 ? 'text-green-500' : 'text-red-500'" class="text-xs">
            {{ summary[item.key + 'Change'] > 0 ? '+' : ''}}{{ summary[item.key + 'Change'] }}%
          </span>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-6 space-x-6">
      <div class="px-4 py-2 text-sm text-center">
        <div class="text-3xl font-bold text-blue-600">{{ summary.total }}</div>
        <div class="text-gray-500">{{ t('total_reservation') }}</div>
      </div>
      <div class="border-l px-4 py-2 text-sm text-center">
        <div class="text-3xl font-bold text-green-600">{{ summary.earnings }} FCFA</div>
        <div class="text-gray-500">{{ t('earnings') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  months: {
    type: Array as () => { key: string, label: string, year: number }[],
    required: true
  },
  bookingsData: {
    type: Object as () => Record<string, { direct: number[], ota: number[], group: number[] }>,
    required: true
  },
  variations: {
    type: Object as () => Record<string, { direct: number, ota: number, group: number, total: number, earnings: string }>,
    required: true
  }
})

const { t } = useI18n()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const selectedMonth = ref(props.months[0]?.key ?? '')

const summary = ref({
  direct: 0,
  ota: 0,
  group: 0,
  directChange: 0,
  otaChange: 0,
  groupChange: 0,
  total: 0,
  earnings: '0'
})

const legendItems = [
  { key: 'direct', label: 'direct_booking', color: 'bg-blue-500' },
  { key: 'ota', label: 'ota', color: 'bg-amber-500' },
  { key: 'group', label: 'group', color: 'bg-emerald-500' }
]

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)
  updateChartData()
}

const updateChartData = () => {
  if (!chartInstance) return
  const data = props.bookingsData[selectedMonth.value]
  if (!data) return

  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      padding: 12,
      textStyle: { color: '#fff' },
      axisPointer: { type: 'shadow' }
    },
     legend: {
      data: legendItems.map(i => t(i.label)),
      top: 10,
      right: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      axisLine: { lineStyle: { color: '#4B5563' } },
      axisTick: { alignWithLabel: true },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4B5563' } },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      minInterval: 1
    },
    series: [
      {
        name: 'Réservations directes',
        type: 'bar',
        data: data.direct,
        itemStyle: {
          color: 'rgba(59, 130, 246, 0.7)',
          borderRadius: 1
        },
        barGap: 0
      },
      {
        name: 'Via OTA',
        type: 'bar',
        data: data.ota,
        itemStyle: {
          color: 'rgba(245, 158, 11, 0.7)',
          borderRadius: 0
        }
      },
      {
        name: 'Groupes & Entreprises',
        type: 'bar',
        data: data.group,
        itemStyle: {
          color: 'rgba(16, 185, 129, 0.7)',
          borderRadius: 1
        }
      }
    ]
  })

  // })

  const directSum = data.direct.reduce((a, b) => a + b, 0)
  const otaSum = data.ota.reduce((a, b) => a + b, 0)
  const groupSum = data.group.reduce((a, b) => a + b, 0)

  summary.value.direct = directSum
  summary.value.ota = otaSum
  summary.value.group = groupSum

  const v = props.variations[selectedMonth.value] || { direct: 0, ota: 0, group: 0, total: 0, earnings: '0' }
  summary.value.directChange = v.direct
  summary.value.otaChange = v.ota
  summary.value.groupChange = v.group
  summary.value.total = v.total
  summary.value.earnings = v.earnings
}

watch(selectedMonth, updateChartData)

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => chartInstance?.resize())
})
</script>

