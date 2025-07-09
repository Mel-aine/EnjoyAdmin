<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold">{{ $t('earning_statistic') }}</h2>
      <div class="flex space-x-2">
        <button
          :class="getButtonClass('yearly')"
          @click="handleViewChange('yearly')"
          class="px-3 py-1 text-sm rounded-full"
        >
          {{ $t('year') }}
        </button>
        <button
          :class="getButtonClass('semester')"
          @click="handleViewChange('semester')"
          class="px-3 py-1 text-sm rounded-full"
        >
          {{ $t('half') }}
        </button>
        <button
          :class="getButtonClass('quarterly')"
          @click="handleViewChange('quarterly')"
          class="px-3 py-1 text-sm rounded-full"
        >
          {{ $t('quarter') }}
        </button>
        <button
          :class="getButtonClass('monthly')"
          @click="handleViewChange('monthly')"
          class="px-3 py-1 text-sm rounded-full"
        >
          {{ $t('month') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Revenu total -->
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="text-blue-600 text-sm font-medium mb-1">{{ $t('total_earning') }}</div>
        <div class="text-2xl font-bold">{{ revenuTotal?.currentRevenue || 0 }} XAF</div>
        <div class="flex items-center mt-2">
          <span
            :class="[
              'text-xs font-medium flex items-center',
              variation > 0 ? 'text-green-500' : variation < 0 ? 'text-red-500' : 'text-gray-400',
            ]"
          >
            <svg
              v-if="variation !== 0"
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="variation > 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'"
              />
            </svg>
            {{ variation }} %
          </span>
          <span class="text-xs text-gray-500 ml-2">vs {{ $t('previous') }} {{ viewLabel }}</span>
        </div>
      </div>

      <!-- Taux d'occupation moyen -->
      <div class="bg-green-50 rounded-lg p-4">
        <div class="text-green-600 text-sm font-medium mb-1">{{ $t('average_occupancy') }}</div>
        <div class="text-2xl font-bold">{{ totalOccupancyRate?.currentRate || 0 }}%</div>
        <div class="flex items-center mt-2">
          <span
            :class="[
              'text-xs font-medium flex items-center',
              variationOccupancy > 0
                ? 'text-green-500'
                : variationOccupancy < 0
                  ? 'text-red-500'
                  : 'text-gray-400',
            ]"
          >
            <svg
              v-if="variationOccupancy !== 0"
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="
                  variationOccupancy > 0
                    ? 'M5 10l7-7m0 0l7 7m-7-7v18'
                    : 'M19 14l-7 7m0 0l-7-7m7 7V3'
                "
              />
            </svg>
            {{ variationOccupancy }} %
          </span>
          <span class="text-xs text-gray-500 ml-2">vs {{ $t('previous') }} {{ viewLabel }}</span>
        </div>
      </div>

      <!-- ADR -->
      <div class="bg-purple-50 rounded-lg p-4">
        <div class="text-purple-600 text-sm font-medium mb-1">{{ $t('average_price') }} (ADR)</div>
        <div class="text-2xl font-bold">{{ Adr?.currentADR || 0 }} XAF</div>
        <div class="flex items-center mt-2">
          <span
            :class="[
              'text-xs font-medium flex items-center',
              variationADR > 0
                ? 'text-green-500'
                : variationADR < 0
                  ? 'text-red-500'
                  : 'text-gray-400',
            ]"
          >
            <svg
              v-if="variationADR !== 0"
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="variationADR > 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'"
              />
            </svg>
            {{ variationADR }} %
          </span>
          <span class="text-xs text-gray-500 ml-2">vs {{ $t('previous') }} {{ viewLabel }}</span>
        </div>
      </div>
    </div>

    <div class="h-72 relative">
      <!-- Loading spinner -->
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-white/70 z-10"
      >
        <span class="flex items-center gap-2">
          <Spinner class="w-4 h-4" />
          {{ $t('Processing') }}...
        </span>
      </div>

      <!-- Chart container -->
      <div ref="revenueChart" class="w-full h-full" v-show="!isLoading"></div>
    </div>

    <div class="flex justify-center mt-4 space-x-8">
      <div class="flex items-center">
        <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        <span class="text-sm text-gray-600">{{ $t('earnings') }} 2025</span>
      </div>
      <div class="flex items-center">
        <div class="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
        <span class="text-sm text-gray-600">{{ $t('earnings') }} 2024</span>
      </div>
      <div class="flex items-center">
        <div class="w-1 h-4 bg-green-500 rounded-full mr-2"></div>
        <span class="text-sm text-gray-600">{{ $t('occupancy_rate') }} 2025</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'
import Spinner from '../spinner/Spinner.vue'

const { t, locale } = useI18n()

const revenueChart = ref<HTMLDivElement | null>(null)
const isLoading = ref(true)
const activeView = computed(() => props.currentView || 'monthly')

const emit = defineEmits<{
  changeViews: [view: 'yearly' | 'semester' | 'quarterly' | 'monthly']
}>()

const variation = computed(() => props.revenuTotal?.growthRate ?? 0)
const variationOccupancy = computed(() => props.totalOccupancyRate?.variationPercentage ?? 0)
const variationADR = computed(() => props.Adr?.variationPercentage ?? 0)

const props = defineProps<{
  monthlyData: any[]
  totalOccupancyRate?: {
    currentRate: number
    variationPercentage: number
  } | null
  Adr?: {
    currentADR: number
    variationPercentage: number
  } | null
  revenuTotal?: {
    currentRevenue: number
    growthRate: number
  } | null
  currentView?: 'yearly' | 'semester' | 'quarterly' | 'monthly'
}>()

const getButtonClass = (view: string) => {
  const baseClasses = 'px-3 py-1 text-sm rounded-full font-medium transition-colors'
  return activeView.value === view
    ? `${baseClasses} bg-blue-100 text-blue-600`
    : `${baseClasses} text-gray-500 hover:bg-gray-100`
}

const handleViewChange = (view: 'yearly' | 'semester' | 'quarterly' | 'monthly') => {
  emit('changeViews', view)
}

let chartInstance: echarts.ECharts | null = null

// Fonction pour détruire l'instance précédente
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

const currentYear = new Date().getFullYear()
    const previousYear = currentYear - 1

const initChart = async () => {
  await nextTick()

  if (!revenueChart.value) {
    console.warn('Élément DOM du graphique non trouvé')
    return
  }

  // Détruire l'instance précédente si elle existe
  destroyChart()

  try {

    chartInstance = echarts.init(revenueChart.value)


    if (!props.monthlyData || props.monthlyData.length === 0) {
      console.warn('Aucune donnée mensuelle disponible')
      return
    }

    const months = props.monthlyData.map((item:any) => item.month)
    const currentRevenue = props.monthlyData.map((item:any) => item.totalRevenue)
    const previousRevenue = props.monthlyData.map((item:any) => item.previousRevenue)
    const occupancyRates = props.monthlyData.map((item:any) => item.occupancyRate)

    console.log('Données du graphique:', {
      months,
      currentRevenue,
      previousRevenue,
      occupancyRates,
    })

    // Calculer les valeurs min/max pour un meilleur affichage
    const maxRevenue = Math.max(...currentRevenue, ...previousRevenue)
    const maxOccupancy = Math.max(...occupancyRates)


    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        textStyle: { fontWeight: 'bold', color: '#fff' },
        padding: 12,
        formatter: (params:any) => {
          let result = `<div style="margin-bottom: 8px; font-weight: bold;">${params[0].axisValueLabel}</div>`
          params.forEach((param:any) => {
            const value = param.data
            if (param.seriesName === "Taux d'occupation 2025") {
              result += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 8px;"></span>
                ${param.seriesName}: ${value !== null && value !== undefined ? value.toFixed(2) : 'N/A'}%
              </div>`
            } else {
              result += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 8px;"></span>
                ${param.seriesName}: ${value !== null && value !== undefined ? value.toLocaleString() : 'N/A'} XAF
              </div>`
            }
          })
          return result
        },
      },
      legend: {
        data: [t('Earning_2025', { year: currentYear }), t('Earning_previous', { year: previousYear }), t("occupancy_rate_2025", { year: currentYear })],
        show: true,
        top: 10,
        textStyle: {
          color: '#374151',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: {
          show: true,
          lineStyle: { color: '#e5e7eb' },
        },
        axisTick: { show: false },
        axisLabel: {
          color: '#6b7280',
        },
        splitLine: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: t('EarningXAF'),
          nameTextStyle: {
            color: '#6b7280',
          },
          min: 0,
          max: maxRevenue > 0 ? undefined : 1000000,
          axisLabel: {
            formatter: (value:any) => {
              if (value === 0) return '0'
              return value >= 1000000
                ? `${(value / 1000000).toFixed(1)}M`
                : value >= 1000
                  ? `${(value / 1000).toFixed(0)}K`
                  : value.toLocaleString()
            },
            color: '#6b7280',
          },
          splitLine: {
            show: true,
            lineStyle: { color: '#f3f4f6' },
          },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        {
          type: 'value',
          name:  t("occupancy_rate%"),
          nameTextStyle: {
            color: '#6b7280',
          },
          min: 0,
          max: Math.max(100, maxOccupancy),
          axisLabel: {
            formatter: (value:any) => `${value}%`,
            color: '#6b7280',
          },
          position: 'right',
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
        },
      ],
      series: [
        {
          name: t('Earning_2025', { year: currentYear }),
          type: 'bar',
          data: currentRevenue,
          itemStyle: {
            color: 'rgba(59, 130, 246, 0.8)',
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: 'rgba(59, 130, 246, 1)',
            },
          },
          yAxisIndex: 0,
          barWidth: '30%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.1)',
          },
        },
        {
          name: t('Earning_previous', { year: previousYear }),
          type: 'bar',
          data: previousRevenue,
          itemStyle: {
            color: 'rgba(209, 213, 219, 0.8)',
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: 'rgba(209, 213, 219, 1)',
            },
          },
          yAxisIndex: 0,
          barWidth: '30%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.1)',
          },
        },
        {
          name: t("occupancy_rate_2025", { year: currentYear }),
          type: 'line',
          data: occupancyRates,
          lineStyle: {
            color: 'rgba(16, 185, 129, 1)',
            width: 3,
            type: 'solid',
          },
          itemStyle: {
            color: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            borderColor: '#fff',
          },
          symbol: 'circle',
          symbolSize: 6,
          yAxisIndex: 1,
          connectNulls: false,
          showSymbol: true,
        },
        (isLoading.value = false),
      ],
    }

    chartInstance.setOption(option, true) // true pour effacer les options précédentes

    // Forcer le redimensionnement
    setTimeout(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }, 100)

    console.log('Graphique initialisé avec succès')
  } catch (error) {
    console.error("Erreur lors de l'initialisation du graphique:", error)
  }
}

watch(locale, initChart)
const updateChart = async () => {
  console.log('Mise à jour du graphique...')
  await initChart()
}

// Fonction de redimensionnement
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}
onUnmounted(() => {
  console.log('Nettoyage du composant')
  destroyChart()
  window.removeEventListener('resize', handleResize)
})

// Watcher pour surveiller les changements de données
watch(
  () => props.monthlyData,
  async (newData:any) => {
    console.log('Données mises à jour:', newData)
    if (newData && newData.length > 0) {
      await updateChart()
    }
  },
  { deep: true },
)

const viewLabel = computed(() => {
  switch (activeView.value) {
    case 'yearly':
      return t('year')
    case 'semester':
      return t('half')
    case 'quarterly':
      return t('quarter')
    case 'monthly':
      return t('month')
    default:
      return ''
  }
})
</script>
