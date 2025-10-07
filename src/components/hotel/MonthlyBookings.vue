<template>
  <div class="bg-white rounded-lg shadow p-6 h-full dark:bg-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold dark:text-white">{{ t('monthly_reservation') }}</h2>
      <div class="relative">
        <select
          v-model="selectedMonth"
          class="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm dark:text-white dark:bg-gray-700 "
        >
          <option v-for="month in processedMonths" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>

    <div ref="chartRef" class="relative h-64 w-full"></div>

    <div class="mt-6 space-y-3">
      <div
        v-for="(item, index) in legendItems"
        :key="index"
        class="flex items-center justify-between"
        :class="index < legendItems.length - 1 ? 'border-b pb-3' : ''"
      >
        <div class="flex items-center">
          <div :class="['w-3', 'h-3', 'rounded-full', 'mr-2', item.color]"></div>
          <span class="text-sm font-medium dark:text-white">{{ t(`${item.label}`) }}</span>
        </div>
        <div class="flex items-center">
          <span class="font-semibold mr-1 dark:text-white">{{ item.count }}</span>
          <span :class="item.progression >= 0 ? 'text-green-500' : 'text-red-500'" class="text-xs">
            {{ item.progression >= 0 ? '+' : '' }}{{ item.progression }}%
          </span>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-6 space-x-6">
      <div class="px-4 py-2 text-sm text-center">
        <div class="text-3xl font-bold text-blue-600">{{ totalReservations }}</div>
        <div class="text-gray-500 dark:text-white">{{ t('total_reservation') }}</div>
      </div>
      <div class="border-l px-4 py-2 text-sm text-center">
        <div class="text-3xl font-bold text-green-600">{{ totalEarnings }} XAF</div>
        <div class="text-gray-500 dark:text-white">{{ t('earnings') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'


interface WeekData {
  label: string
  data: Array<{ type: string; count: number }>
}

interface MonthData {
  month: string
  weeks: WeekData[]
  summary: Array<{ type: string; count: number; progression: number }>
}

interface Props {
  reservations: MonthData[] | null | undefined
  earningsData?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  reservations: () => []

})

const { t } = useI18n()
const { locale } = useI18n()
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// Transformation des données pour le select
const processedMonths = computed(() => {
  if (!props.reservations || !Array.isArray(props.reservations)) {
    return []
  }
  return props.reservations.map((reservation:any) => ({
    value: reservation.month,
    label: t(reservation.month.toLowerCase()) + ' 2025',
  }))
})

const selectedMonth = ref('')



watch(locale, () => {
  updateChartData()
})

watch(
  () => props.reservations,
  (newReservations:any) => {
    if (
      newReservations &&
      Array.isArray(newReservations) &&
      newReservations.length > 0 &&
      !selectedMonth.value
    ) {
      const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' }) // ex: 'July'

      const found = newReservations.find(
        (r) => r.month.toLowerCase() === currentMonthName.toLowerCase(),
      )
      selectedMonth.value = found?.month ?? newReservations[0].month
    }
  },
  { immediate: true },
)

// Mapping des types de réservation


const typeMapping = {
  'Direct Booking': {
    key: 'direct',
    label: t('reservation_types.direct_booking'),
    color: 'bg-blue-500',
  },
  'Booking via Enjoy': {
    key: 'ota',
    label: t('reservation_types.ota'),
    color: 'bg-amber-500',
  },
  Group: {
    key: 'group',
    label: t('reservation_types.group'),
    color: 'bg-emerald-500',
  },
}

// Données calculées pour la légende
const legendItems = computed(() => {
  if (!props.reservations || !Array.isArray(props.reservations)) {
    return []
  }

  const currentMonth = props.reservations.find((r:any) => r.month === selectedMonth.value)
  if (!currentMonth || !currentMonth.summary) return []

  return currentMonth.summary.map((item:any) => {
    const mapping = typeMapping[item.type as keyof typeof typeMapping]
    return {
      label: mapping?.label || item.type,
      color: mapping?.color || 'bg-gray-500',
      count: item.count,
      progression: item.progression,
    }
  })
})

// Total des réservations
const totalReservations = computed(() => {
  if (!props.reservations || !Array.isArray(props.reservations)) {
    return 0
  }

  const currentMonth = props.reservations.find((r:any) => r.month === selectedMonth.value)
  if (!currentMonth || !currentMonth.summary) return 0

  return currentMonth.summary.reduce((total:any, item:any) => total + item.count, 0)
})

// Total des revenus (exemple - vous pouvez adapter selon vos données)
const totalEarnings = computed(() => {
  if (props.earningsData && props.earningsData[selectedMonth.value]) {
    return props.earningsData[selectedMonth.value]
  }
  // Calcul approximatif basé sur les réservations
  // return Math.round(totalReservations.value * 120.5) + 'K'
})

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)
  updateChartData()
}


const updateChartData = () => {
  if (!chartInstance) return

  if (!props.reservations || !Array.isArray(props.reservations)) {
    return
  }

  const currentMonth = props.reservations.find((r:any) => r.month === selectedMonth.value)
  if (!currentMonth || !currentMonth.weeks) return

  // Transformation des données pour ECharts
  const weeks = currentMonth.weeks.map((week:any) => t(`weeks.${week.label}`))
  const series: any[] = []

  // Grouper les données par type
  const dataByType: Record<string, number[]> = {}

  // Collecter tous les types disponibles dans toutes les semaines
  currentMonth.weeks.forEach((week:any) => {
    if (week.data && Array.isArray(week.data)) {
      week.data.forEach((item:any) => {
        if (!dataByType[item.type]) {
          dataByType[item.type] = []
        }
      })
    }
  })

  // Remplir les données pour chaque semaine
  Object.keys(dataByType).forEach((type) => {
    const weeklyData: number[] = []
    currentMonth.weeks.forEach((week:any) => {
      if (week.data && Array.isArray(week.data)) {
        const typeData = week.data.find((d:any) => d.type === type)
        weeklyData.push(typeData ? typeData.count : 0)
      } else {
        weeklyData.push(0)
      }
    })
    dataByType[type] = weeklyData
  })

  // Créer les séries pour le graphique
  Object.keys(dataByType).forEach((type) => {
    const mapping = typeMapping[type as keyof typeof typeMapping]
    let color = 'rgba(156, 163, 175, 0.7)'

    if (mapping) {
      switch (mapping.key) {
        case 'direct':
          color = 'rgba(59, 130, 246, 0.7)'
          break
        case 'ota':
          color = 'rgba(245, 158, 11, 0.7)'
          break
        case 'group':
          color = 'rgba(16, 185, 129, 0.7)'
          break
      }
    }

    series.push({
      name: mapping?.label || type,
      type: 'bar',
      data: dataByType[type],
      itemStyle: {
        color: color,
        borderRadius: 1,
      },
      barGap: 0,
    })
  })

  if (series.length === 0) {
    series.push({
      name: 'Aucune donnée',
      type: 'bar',
      data: new Array(weeks.length).fill(0),
      itemStyle: {
        color: 'rgba(156, 163, 175, 0.1)',
        borderRadius: 1,
      },
      barGap: 0,
    })
  }


  chartInstance.setOption(
    {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        padding: 12,
        textStyle: { color: '#fff' },
        axisPointer: { type: 'shadow' },
      },
      legend: {
        show: false,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: weeks,
        axisLine: { lineStyle: { color: '#4B5563' } },
        axisTick: { alignWithLabel: true },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#4B5563' } },
        splitLine: { show: true, lineStyle: { type: 'dashed' } },
        minInterval: 1,
      },
      series: series,
    },
    true,
  )
}

watch(selectedMonth, () => {
  if (selectedMonth.value) {
    updateChartData()
  }
})

watch(
  () => props.reservations,
  (newReservations:any) => {
    if (newReservations && Array.isArray(newReservations) && newReservations.length > 0) {
      if (chartInstance) {
        updateChartData()
      }
    }
  },
  { immediate: true },
)

watch(selectedMonth, () => {
  updateChartData()
})

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => chartInstance?.resize())
})
</script>
