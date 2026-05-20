<template>
  <ReportsLayout>
    <div class="p-6"> 
   
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.satisfaction.title') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('reports.satisfaction.lastUpdate') }} : {{ lastUpdate }}
        </p>
      </div>
      <!-- FIX 1 : retiré 90 jours -->
      <div class="flex gap-2">
        <button
          v-for="p in periods"
          :key="p.value"
          @click="setPeriod(p.value)"
          :class="[
            'px-3 py-1.5 text-xs rounded-lg border transition-colors',
            activePeriod === p.value
              ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300'
              : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
          ]"
        >
          {{ $t(p.label) }}
        </button>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="loading">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-4 space-y-2">
          <div class="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div class="h-8 w-14 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div class="h-2.5 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 space-y-4">
          <div class="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div v-for="i in 3" :key="i" class="flex items-center gap-3">
            <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
            <div class="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div class="h-3 w-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 space-y-1">
          <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-4" />
          <div v-for="i in 3" :key="i" class="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div class="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div class="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
        <div class="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-4" />
        <div class="w-full h-48 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div class="flex gap-4 mt-3">
          <div class="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    </div>

    <div v-else-if="stats">

      <!-- FIX 2 : Metric Cards fond blanc -->
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                <Star class="w-3.5 h-3.5" />
                {{ $t('reports.satisfaction.nps') }}
            </p>
            <p class="text-2xl font-medium text-gray-900 dark:text-white">{{ stats.nps }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ $t('On') }} 100</p>
        </div>

        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-4">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
            <MessageCircle class="w-3.5 h-3.5" />
            {{ $t('reports.satisfaction.responseRate') }}
        </p>
        <p class="text-2xl font-medium text-gray-900 dark:text-white">{{ stats.responseRate }}%</p>
        <p class="text-xs text-gray-400 mt-1">{{ $t('reports.satisfaction.surveysSent') }} : {{ stats.sent }}</p>
        </div>

        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-4">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
            <MapPin class="w-3.5 h-3.5" />
            {{ $t('reports.satisfaction.googleRedirects') }}
        </p>
        <p class="text-2xl font-medium text-gray-900 dark:text-white">{{ stats.googleRedirects }}</p>
        <p class="text-xs text-gray-400 mt-1">redirections</p>
        </div>


      
      </div>

      <!-- Middle Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
          <p class="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('reports.satisfaction.ratingDistribution') }}
          </p>
          <div class="space-y-3">
            <div v-for="r in ratings" :key="r.key" class="flex items-center gap-3">
              <span class="text-xs text-gray-500 dark:text-gray-400 w-28 shrink-0">
                {{ $t(`reports.satisfaction.${r.key}`) }}
              </span>
              <div class="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: r.pct + '%', background: r.color }"
                />
              </div>
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                {{ r.pct }}%
              </span>
            </div>
          </div>
          <div class="flex gap-4 mt-4">
            <span v-for="r in ratings" :key="r.key" class="flex items-center gap-1.5 text-xs text-gray-400">
              <span class="w-2 h-2 rounded-sm inline-block" :style="{ background: r.color }" />
              {{ $t(`reports.satisfaction.${r.key}`) }}
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
          <p class="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('reports.satisfaction.funnel') }}
          </p>
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div class="flex justify-between items-center py-2.5">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('reports.satisfaction.sent') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.sent }}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('reports.satisfaction.responses') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.responses }}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('reports.satisfaction.positiveGoogle') }}</span>
              <span class="text-sm font-medium text-green-600">{{ stats.googleRedirects }}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('reports.satisfaction.negativeComment') }}</span>
              <span class="text-sm font-medium text-red-500">{{ stats.negativeComments }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
        <p class="text-sm font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('reports.satisfaction.trend') }}
        </p>
        <div ref="chartRef" class="w-full h-48" />
        <div class="flex gap-4 mt-3">
          <span class="flex items-center gap-1.5 text-xs text-gray-400">
            <span class="w-3 h-0.5 bg-purple-500 inline-block rounded" />
            {{ $t('reports.satisfaction.npsScore') }}
          </span>
          <span class="flex items-center gap-1.5 text-xs text-gray-400">
            <span class="w-3 h-0.5 inline-block rounded" style="background:#1D9E75" />
            {{ $t('reports.satisfaction.responseRatePct') }}
          </span>
        </div>
      </div>

    </div>

    <!-- Garde-fou -->
    <div v-else class="flex items-center justify-center h-64">
      <p class="text-sm text-gray-400">Aucune donnée disponible.</p>
    </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import { getSatisfactionStats } from '@/services/satisfactionService'
import { useServiceStore } from '@/composables/serviceStore'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { Star , MessageCircle , MapPin} from 'lucide-vue-next'

const { t }        = useI18n()
const serviceStore = useServiceStore()

const activePeriod = ref(30)
const loading      = ref(false)
const error        = ref<string | null>(null)
const stats        = ref<any>(null)
const chartRef     = ref<HTMLDivElement | null>(null)
const lastUpdate   = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

// FIX 1 : retiré 90 jours
const periods = [
  { value: 7,  label: 'reports.satisfaction.period7' },
  { value: 30, label: 'reports.satisfaction.period30' },
]

const ratings = computed(() => {
  if (!stats.value) return []
  const total = stats.value.excellent + stats.value.satisfaisant + stats.value.aAmeliorer
  if (total === 0) return []
  return [
    { key: 'excellent',    pct: Math.round((stats.value.excellent    / total) * 100), color: '#1D9E75' },
    { key: 'satisfaisant', pct: Math.round((stats.value.satisfaisant / total) * 100), color: '#EF9F27' },
    { key: 'aAmeliorer',   pct: Math.round((stats.value.aAmeliorer   / total) * 100), color: '#E24B4A' },
  ]
})

// ── ECharts ──────────────────────────────────────────────────────────────────
let chart: echarts.ECharts | null = null

function buildChart() {
  if (!chartRef.value || !stats.value?.weeks?.length) return

  if (chart) {
    chart.dispose()
    chart = null
  }

  chart = echarts.init(chartRef.value)

  const allValues = [...(stats.value.npsW ?? []), ...(stats.value.rateW ?? [])]
  const minVal    = Math.min(...allValues)
  const yMin      = minVal < 0 ? Math.floor(minVal / 10) * 10 - 10 : 0

  chart.setOption({
    grid: { top: 16, right: 16, bottom: 32, left: 40 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#6366f1' } },
    },
    xAxis: {
      type: 'category',
      data: stats.value.weeks,
      axisLine:  { lineStyle: { color: '#e5e7eb' } },
      axisTick:  { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: yMin,
      max: 100,
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
    },
    series: [
      {
        name: t('reports.satisfaction.npsScore'),
        type: 'line',
        data: stats.value.npsW,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#7C3AED', width: 2 },
        itemStyle: { color: '#7C3AED' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(124,58,237,0.15)' },
            { offset: 1, color: 'rgba(124,58,237,0)' },
          ]),
        },
      },
      {
        name: t('reports.satisfaction.responseRatePct'),
        type: 'line',
        data: stats.value.rateW,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#1D9E75', width: 2, type: 'dashed' },
        itemStyle: { color: '#1D9E75' },
      },
    ],
  })
}

function onResize() { chart?.resize() }

async function fetchStats() {
  const hotelId = serviceStore.serviceId
  if (!hotelId) {
    error.value = 'Aucun hôtel associé à ce compte.'
    return
  }

  if (chart) {
    chart.dispose()
    chart = null
  }

  loading.value = true
  error.value   = null

  try {
    const res   = await getSatisfactionStats(hotelId, activePeriod.value)
    stats.value = res.data
    await nextTick()
    waitForChartRef()
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Erreur lors du chargement des statistiques'
  } finally {
    loading.value = false
  }
}

function waitForChartRef() {
  if (!chartRef.value) {
    setTimeout(waitForChartRef, 50)
    return
  }
  if (chartRef.value.offsetWidth === 0) {
    const ro = new ResizeObserver((entries) => {
      if (entries[0].contentRect.width > 0) {
        ro.disconnect()
        buildChart()
      }
    })
    ro.observe(chartRef.value)
    return
  }
  buildChart()
}

function setPeriod(p: number) { activePeriod.value = p }

onMounted(() => {
  fetchStats()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  chart?.dispose()
  chart = null
  window.removeEventListener('resize', onResize)
})

watch(activePeriod, fetchStats)
watch(() => serviceStore.serviceId, (id) => { if (id) fetchStats() })
</script>