<template>
    <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-8 hover:shadow-2xl transition-all duration-300">
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-full -mr-16 -mt-16"></div>
      
      <div class="relative">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mr-3">
              <BarChart3 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Revenus par Type de Tarif
            <div class="ml-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <Info class="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
          </h3>
  
          <!-- Legend avec contrôles de visibilité -->
          <!-- <div class="flex items-center space-x-2">
            <button
              v-for="(rateType, index) in rateTypes"
              :key="rateType"
              @click="toggleRateTypeVisibility(rateType)"
              :class="[
                'group/legend flex items-center px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105',
                visibleRateTypes[rateType] 
                  ? `${getColorConfig(rateType, index).light} ${getColorConfig(rateType, index).border} ${getColorConfig(rateType, index).text}` 
                  : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
              ]"
            >
              <div :class="[
                'w-3 h-3 rounded mr-2 transition-all duration-200',
                visibleRateTypes[rateType] ? getColorConfig(rateType, index).primary : 'bg-slate-300 dark:bg-slate-600'
              ]"></div>
              <span class="text-xs font-bold">{{ rateType }}</span>
              <Eye v-if="visibleRateTypes[rateType]" class="w-3 h-3 ml-2 opacity-60 group-hover/legend:opacity-100" />
              <EyeOff v-else class="w-3 h-3 ml-2 opacity-60 group-hover/legend:opacity-100" />
            </button>
          </div> -->
          <!-- Legend avec contrôles de visibilité multi-lignes -->
<div class="flex flex-col space-y-2">
  <div 
    v-for="(row, rowIndex) in legendRows"
    :key="rowIndex"
    class="flex items-center justify-center flex-wrap gap-2"
  >
    <button
      v-for="(rateType, index) in row"
      :key="rateType"
      @click="toggleRateTypeVisibility(rateType)"
      :class="[
        'group/legend flex items-center px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105',
        visibleRateTypes[rateType] 
          ? `${getColorConfig(rateType, rateTypes.indexOf(rateType)).light} ${getColorConfig(rateType, rateTypes.indexOf(rateType)).border} ${getColorConfig(rateType, rateTypes.indexOf(rateType)).text}` 
          : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
      ]"
    >
      <div :class="[
        'w-3 h-3 rounded mr-2 transition-all duration-200',
        visibleRateTypes[rateType] ? getColorConfig(rateType, rateTypes.indexOf(rateType)).primary : 'bg-slate-300 dark:bg-slate-600'
      ]"></div>
      <span class="text-xs font-bold">{{ rateType }}</span>
      <Eye v-if="visibleRateTypes[rateType]" class="w-3 h-3 ml-2 opacity-60 group-hover/legend:opacity-100" />
      <EyeOff v-else class="w-3 h-3 ml-2 opacity-60 group-hover/legend:opacity-100" />
    </button>
  </div>
</div>
        </div>
  
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <div
            v-for="(rateType, index) in rateTypes"
            :key="rateType"
            :class="[
              'p-4 rounded-xl border transition-all duration-300 hover:scale-102 cursor-pointer',
              visibleRateTypes[rateType] 
                ? `${getColorConfig(rateType, index).light} ${getColorConfig(rateType, index).border}` 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50'
            ]"
            @click="toggleRateTypeVisibility(rateType)"
          >
            <div class="flex items-center justify-between mb-2">
              <span :class="[
                'text-sm font-bold',
                visibleRateTypes[rateType] ? getColorConfig(rateType, index).text : 'text-slate-400 dark:text-slate-500'
              ]">
                {{ rateType }}
              </span>
              <div :class="[
                'w-2 h-2 rounded-full',
                visibleRateTypes[rateType] ? getColorConfig(rateType, index).primary : 'bg-slate-300 dark:bg-slate-600'
              ]"></div>
            </div>
            <div :class="[
              'text-lg font-black',
              visibleRateTypes[rateType] ? getColorConfig(rateType, index).text : 'text-slate-400 dark:text-slate-500'
            ]">
              {{ formatCurrency(revenueData[rateType] || 0) }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {{ getPercentage(revenueData[rateType] || 0) }}% du total
            </div>
          </div>
          
          <!-- Total Card -->
          <div class="p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <TrendingUp class="w-4 h-4 mr-1" />
                TOTAL
              </span>
              <div class="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
            </div>
            <div class="text-xl font-black text-slate-800 dark:text-slate-200">
              {{ formatCurrency(revenueData.total || 0) }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              RevPAR: {{ formatCurrency(revenueData.revpar || 0) }}
            </div>
          </div>
        </div>
  
        <!-- Chart -->
        <div class="relative" ref="chartRef">
          <div class="flex items-end justify-center space-x-2 h-64 mb-4">
            <div
              v-for="(data, index) in chartData"
              :key="index"
              class="flex flex-col items-center space-y-1"
              @mouseenter="(e) => showTooltip(index, e)"
              @mouseleave="hideTooltip"
            >
              <!-- Barres empilées ou groupées -->
              <div class="flex items-end space-x-1" style="height: 220px;">
                <div
                  v-for="(rateType, rateIndex) in rateTypes"
                  :key="rateType"
                  v-show="visibleRateTypes[rateType]"
                  :class="[
                    getColorConfig(rateType, rateIndex).primary,
                    'rounded-t-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer'
                  ]"
                  :style="{ 
                    width: `${barWidth}px`,
                    height: `${getBarHeight(data[rateType] || 0)}px`,
                    minHeight: (data[rateType] || 0) > 0 ? '4px' : '0px'
                  }"
                />
              </div>
              
              <!-- Labels -->
              <span class="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">
                {{ data.label }}
              </span>
            </div>
          </div>
  
          <!-- Y-axis labels -->
          <div class="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400 ">
            <span>{{ formatCurrency(maxValue) }}</span>
            <span>{{ formatCurrency(Math.round(maxValue * 0.75)) }}</span>
            <span>{{ formatCurrency(Math.round(maxValue * 0.5)) }}</span>
            <span>{{ formatCurrency(Math.round(maxValue * 0.25)) }}</span>
            <span>0</span>
          </div>
        </div>
      </div>
  
      <!-- Tooltip -->
      <div
        v-if="tooltip.show && tooltip.data"
        class="fixed z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-4 animate-slide-in-up"
        :style="{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          transform: 'translateX(-50%) translateY(-100%)'
        }"
      >
        <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
          {{ tooltip.data.fullLabel }}
        </div>
        <div class="space-y-2">
          <div
            v-for="(rateType, index) in rateTypes"
            :key="rateType"
            v-show="visibleRateTypes[rateType]"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div :class="[
                'w-2 h-2 rounded-full mr-2',
                getColorConfig(rateType, index).primary
              ]"></div>
              <span class="text-xs font-medium text-slate-600 dark:text-slate-400">{{ rateType }}:</span>
            </div>
            <span :class="[
              'text-sm font-bold',
              getColorConfig(rateType, index).text
            ]">
              {{ formatCurrency(tooltip.data[rateType] || 0) }}
            </span>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Total:</span>
              <span class="text-sm font-black text-slate-800 dark:text-slate-200">
                {{ formatCurrency(getTooltipTotal(tooltip.data)) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { DateTime } from 'luxon'
  import { BarChart3, TrendingUp, Eye, EyeOff, Info } from 'lucide-vue-next'
  import { formatCurrency } from '../utilities/UtilitiesFunction'
  
  // Types
  interface RevenueData {
    [key: string]: number
    total?: number
    averageRoomRate?: number
    revpar?: number
  }
  
  interface ChartDataPoint {
    label: string
    fullLabel: string
    [key: string]: string | number
  }
  
  interface TooltipState {
    show: boolean
    x: number
    y: number
    data: ChartDataPoint | null
  }
  
  interface ColorConfig {
    primary: string
    light: string
    text: string
    border: string
  }
  
  // Props
  interface Props {
    dashboardData?: {
      revenue?: RevenueData
      revenueChartData?: any[]
    } | null
    selectedRange?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    dashboardData: null,
    selectedRange: 'today'
  })
  
  // Refs
  const chartRef = ref<HTMLElement | null>(null)
  const tooltip = ref<TooltipState>({ show: false, x: 0, y: 0, data: null })
  const visibleRateTypes = ref<Record<string, boolean>>({})
  
  // Computed
  const revenueData = computed<RevenueData>(() => props.dashboardData?.revenue || {})
  
  const rateTypes = computed<string[]>(() => {
    const excludedKeys = ['total', 'averageRoomRate', 'revpar']
    return Object.keys(revenueData.value).filter(key => !excludedKeys.includes(key))
  })
  
  const visibleRateTypesCount = computed(() => 
    Object.values(visibleRateTypes.value).filter(Boolean).length
  )
  
  // const barWidth = computed(() => 
  //   visibleRateTypesCount.value > 0 ? Math.max(8, 60 / visibleRateTypesCount.value) : 8
  // )
  
  const maxValue = computed(() => {
    let globalMax = 0
    
    rateTypes.value.forEach(rateType => {
      if (visibleRateTypes.value[rateType]) {
        const maxForType = Math.max(...chartData.value.map(d => (d[rateType] as number) || 0))
        globalMax = Math.max(globalMax, maxForType)
      }
    })
    
    return Math.ceil(globalMax * 1.1) || 1000
  })

  const chartData = computed<ChartDataPoint[]>(() => {
    if (!props.dashboardData?.revenueChartData) {
      return []
    }

    return props.dashboardData.revenueChartData.map((dailyData: any) => {
      const dataPoint: ChartDataPoint = {
        label: DateTime.fromISO(dailyData.date).toFormat('dd/MM'),
        fullLabel: DateTime.fromISO(dailyData.date).toFormat('cccc dd MMMM yyyy'),
        ...dailyData.revenues,
      }
      return dataPoint
    })
  })
  

  
  // Methods

  const getColorConfig = (rateType: string, index: number): ColorConfig => {
  const rateTypeColors: Record<string, ColorConfig> = {
    'B&B': {
      primary: 'bg-gradient-to-t from-blue-500 to-blue-400',
      light: 'bg-blue-100 dark:bg-blue-900/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-700'
    },
    'B&O': {
      primary: 'bg-gradient-to-t from-emerald-500 to-emerald-400',
      light: 'bg-emerald-100 dark:bg-emerald-900/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-700'
    },
    'HB': {
      primary: 'bg-gradient-to-t from-purple-500 to-purple-400',
      light: 'bg-purple-100 dark:bg-purple-900/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-700'
    },
    'FB': {
      primary: 'bg-gradient-to-t from-orange-500 to-orange-400',
      light: 'bg-orange-100 dark:bg-orange-900/40',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-700'
    },
    // Ajout de nouveaux types courants
    'AI': {
      primary: 'bg-gradient-to-t from-red-500 to-red-400',
      light: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-700'
    },
    'MAP': {
      primary: 'bg-gradient-to-t from-teal-500 to-teal-400',
      light: 'bg-teal-100 dark:bg-teal-900/40',
      text: 'text-teal-600 dark:text-teal-400',
      border: 'border-teal-200 dark:border-teal-700'
    },
    'EP': {
      primary: 'bg-gradient-to-t from-gray-500 to-gray-400',
      light: 'bg-gray-100 dark:bg-gray-900/40',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700'
    }
  }

  if (rateTypeColors[rateType]) return rateTypeColors[rateType]
  
  // Palette étendue de couleurs par défaut pour les nouveaux rate types
  const defaultColors: ColorConfig[] = [
    { primary: 'bg-gradient-to-t from-cyan-500 to-cyan-400', light: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-700' },
    { primary: 'bg-gradient-to-t from-pink-500 to-pink-400', light: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-700' },
    { primary: 'bg-gradient-to-t from-indigo-500 to-indigo-400', light: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-700' },
    { primary: 'bg-gradient-to-t from-yellow-500 to-yellow-400', light: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-700' },
    { primary: 'bg-gradient-to-t from-lime-500 to-lime-400', light: 'bg-lime-100 dark:bg-lime-900/40', text: 'text-lime-600 dark:text-lime-400', border: 'border-lime-200 dark:border-lime-700' },
    { primary: 'bg-gradient-to-t from-rose-500 to-rose-400', light: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-700' },
    { primary: 'bg-gradient-to-t from-violet-500 to-violet-400', light: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-700' },
    { primary: 'bg-gradient-to-t from-amber-500 to-amber-400', light: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-700' },
    { primary: 'bg-gradient-to-t from-emerald-600 to-emerald-500', light: 'bg-emerald-200 dark:bg-emerald-800/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-600' },
    { primary: 'bg-gradient-to-t from-blue-600 to-blue-500', light: 'bg-blue-200 dark:bg-blue-800/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-600' }
  ]
  
  return defaultColors[index % defaultColors.length]
}

  

  const getPercentage = (value: number): string => {
    const total = revenueData.value.total || 1
    return ((value / total) * 100).toFixed(1)
  }
  
  const getBarHeight = (value: number): number => {
    if (maxValue.value === 0) return 0
    return Math.max((value / maxValue.value) * 200, 2)
  }
  
  const showTooltip = (index: number, event: MouseEvent): void => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const data = chartData.value[index]
    
    tooltip.value = {
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      data: data
    }
  }
  
  const hideTooltip = (): void => {
    tooltip.value.show = false
  }
  
  const toggleRateTypeVisibility = (rateType: string): void => {
    visibleRateTypes.value[rateType] = !visibleRateTypes.value[rateType]
  }
  
  const getTooltipTotal = (data: ChartDataPoint): number => {
    return rateTypes.value.reduce((sum, rateType) => {
      if (visibleRateTypes.value[rateType]) {
        return sum + ((data[rateType] as number) || 0)
      }
      return sum
    }, 0)
  }
  

  const barWidth = computed(() => {
  const visibleCount = visibleRateTypesCount.value
  if (visibleCount === 0) return 8
  
  // Ajustement dynamique selon le nombre de rate types
  if (visibleCount <= 4) return Math.max(12, 80 / visibleCount)
  if (visibleCount <= 6) return Math.max(8, 60 / visibleCount)
  if (visibleCount <= 8) return Math.max(6, 50 / visibleCount)
  return Math.max(4, 40 / visibleCount) // Pour plus de 8 rate types
})

// 3. Gestion des légendes avec pagination si trop de rate types
const itemsPerLegendRow = computed(() => {
  const totalTypes = rateTypes.value.length
  if (totalTypes <= 4) return totalTypes
  if (totalTypes <= 8) return 4
  return 5 // Maximum 5 par ligne
})

const legendRows = computed(() => {
  const types = rateTypes.value
  const rows = []
  const itemsPerRow = itemsPerLegendRow.value
  
  for (let i = 0; i < types.length; i += itemsPerRow) {
    rows.push(types.slice(i, i + itemsPerRow))
  }
  
  return rows
})

// 4. Fonction pour obtenir des labels courts automatiquement
const getRateTypeDisplayName = (rateType: string): string => {
  const commonAbbreviations: Record<string, string> = {
    'Bed & Breakfast': 'B&B',
    'Bed & Breakfast Only': 'B&O',
    'Half Board': 'HB',
    'Full Board': 'FB',
    'All Inclusive': 'AI',
    'Modified American Plan': 'MAP',
    'European Plan': 'EP',
    'Continental Plan': 'CP',
    'Bermuda Plan': 'BP'
  }
  
  return commonAbbreviations[rateType] || rateType
}

// 5. Template amélioré pour la légende avec gestion de plusieurs lignes
const legendTemplate = `
<!-- Legend avec gestion multi-lignes -->
<div class="flex flex-col space-y-2">
  <div 
    v-for="(row, rowIndex) in legendRows"
    :key="rowIndex"
    class="flex items-center justify-center flex-wrap gap-2"
  >
    <button
      v-for="(rateType, index) in row"
      :key="rateType"
      @click="toggleRateTypeVisibility(rateType)"
      :class="[
        'group/legend flex items-center px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 text-xs',
        visibleRateTypes[rateType] 
          ? \`\${getColorConfig(rateType, rateTypes.indexOf(rateType)).light} \${getColorConfig(rateType, rateTypes.indexOf(rateType)).border} \${getColorConfig(rateType, rateTypes.indexOf(rateType)).text}\` 
          : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
      ]"
    >
      <div :class="[
        'w-3 h-3 rounded mr-2 transition-all duration-200',
        visibleRateTypes[rateType] ? getColorConfig(rateType, rateTypes.indexOf(rateType)).primary : 'bg-slate-300 dark:bg-slate-600'
      ]"></div>
      <span class="font-bold">{{ getRateTypeDisplayName(rateType) }}</span>
      <Eye v-if="visibleRateTypes[rateType]" class="w-3 h-3 ml-2 opacity-60 group-hover/legend:opacity-100" />
      <EyeOff v-else class="w-3 h-3 ml-2 opacity-60 group-hover/legend:opacity-100" />
    </button>
  </div>
</div>
`

// 6. Gestion des tooltips pour de nombreux rate types
const getTooltipContent = (data: ChartDataPoint) => {
  const visibleTypes = rateTypes.value.filter(type => visibleRateTypes.value[type])
  
  // Si trop de types visibles, grouper par importance ou montrer les plus importants
  if (visibleTypes.length > 6) {
    // Trier par montant décroissant
    const sortedTypes = visibleTypes.sort((a, b) => 
      ((data[b] as number) || 0) - ((data[a] as number) || 0)
    )
    
    // Montrer les 4 premiers + "X autres"
    const topTypes = sortedTypes.slice(0, 4)
    const othersCount = sortedTypes.length - 4
    const othersTotal = sortedTypes.slice(4).reduce((sum, type) => 
      sum + ((data[type] as number) || 0), 0
    )
    
    return {
      topTypes,
      others: othersCount > 0 ? { count: othersCount, total: othersTotal } : null
    }
  }
  
  return { topTypes: visibleTypes, others: null }
}

// 7. Ajustement automatique de la hauteur du graphique selon le nombre de rate types
const chartHeight = computed(() => {
  const typeCount = visibleRateTypesCount.value
  if (typeCount <= 4) return 'h-64'
  if (typeCount <= 6) return 'h-72'
  if (typeCount <= 8) return 'h-80'
  return 'h-96' // Plus haut pour plus de 8 types
})
  // Watchers
  watch(
    rateTypes,
    (newRateTypes) => {
      const newVisibility: Record<string, boolean> = {}
      newRateTypes.forEach(rateType => {
        newVisibility[rateType] = visibleRateTypes.value[rateType] !== false // true par défaut
      })
      visibleRateTypes.value = newVisibility
    },
    { immediate: true }
  )
  
  // Lifecycle
  onMounted(() => {
    // Initialisation si nécessaire
  })
  </script>
  
  <style scoped>
  .hover\:scale-102:hover {
    transform: scale(1.02);
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.3s ease-out;
  }
  
  .backdrop-blur-xl {
    backdrop-filter: blur(24px);
  }
  </style>