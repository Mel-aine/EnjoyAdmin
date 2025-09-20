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
          <div class="flex items-center space-x-2">
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
  import { BarChart3, TrendingUp, Eye, EyeOff, Info } from 'lucide-vue-next'
  
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
  
  const barWidth = computed(() => 
    visibleRateTypesCount.value > 0 ? Math.max(8, 60 / visibleRateTypesCount.value) : 8
  )
  
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
  const baseData: ChartDataPoint[] = []
  
  // Exemple pour afficher les vraies données par type de tarif
  rateTypes.value.forEach((rateType, index) => {
    const dataPoint: ChartDataPoint = {
      label: rateType,
      fullLabel: `Revenus ${rateType}`,
      [rateType]: revenueData.value[rateType] || 0
    }
    baseData.push(dataPoint)
  })
  
  return baseData
})
// const chartData = computed<ChartDataPoint[]>(() => {
//   const baseData: ChartDataPoint[] = []
  
//   switch (props.selectedRange) {
//     case 'today':
//     case 'yesterday':
//       // Pour les vues journalières, afficher les revenus par type de tarif
//       rateTypes.value.forEach((rateType, index) => {
//         const dataPoint: ChartDataPoint = {
//           label: rateType,
//           fullLabel: `Revenus ${rateType} - ${props.selectedRange}`,
//           [rateType]: revenueData.value[rateType] || 0
//         }
//         baseData.push(dataPoint)
//       })
//       break
      
//     case 'thisWeek':
//     case 'lastWeek':
//       // Pour les vues hebdomadaires, vous pourriez vouloir des données par jour
//       // Mais comme le backend ne fournit qu'un total, on affiche par type de tarif
//       rateTypes.value.forEach((rateType, index) => {
//         // Répartir les revenus sur 7 jours (simulation simple)
//         const totalRevenue = revenueData.value[rateType] || 0
//         const dailyAverage = totalRevenue / 7
        
//         for (let day = 0; day < 7; day++) {
//           const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
//           const dataPoint: ChartDataPoint = {
//             label: `${dayNames[day]}`,
//             fullLabel: `${dayNames[day]} - Semaine ${props.selectedRange === 'thisWeek' ? 'courante' : 'dernière'}`,
//             [rateType]: Math.round(dailyAverage)
//           }
          
//           // Chercher si ce dataPoint existe déjà
//           const existingPoint = baseData.find(item => item.label === dataPoint.label)
//           if (existingPoint) {
//             existingPoint[rateType] = Math.round(dailyAverage)
//           } else {
//             // Initialiser tous les autres types de tarif à 0 pour ce jour
//             rateTypes.value.forEach(rt => {
//               if (rt !== rateType) {
//                 dataPoint[rt] = 0
//               }
//             })
//             baseData.push(dataPoint)
//           }
//         }
//       })
//       break
      
//     case 'thisMonth':
//     case 'lastMonth':
//       // Pour les vues mensuelles, afficher par semaine
//       rateTypes.value.forEach((rateType, index) => {
//         const totalRevenue = revenueData.value[rateType] || 0
//         const weeklyAverage = totalRevenue / 4 // 4 semaines approximatives
        
//         for (let week = 1; week <= 4; week++) {
//           const dataPoint: ChartDataPoint = {
//             label: `S${week}`,
//             fullLabel: `Semaine ${week} - ${props.selectedRange === 'thisMonth' ? 'Ce mois' : 'Mois dernier'}`,
//             [rateType]: Math.round(weeklyAverage)
//           }
          
//           // Chercher si ce dataPoint existe déjà
//           const existingPoint = baseData.find(item => item.label === dataPoint.label)
//           if (existingPoint) {
//             existingPoint[rateType] = Math.round(weeklyAverage)
//           } else {
//             // Initialiser tous les autres types de tarif à 0 pour cette semaine
//             rateTypes.value.forEach(rt => {
//               if (rt !== rateType) {
//                 dataPoint[rt] = 0
//               }
//             })
//             baseData.push(dataPoint)
//           }
//         }
//       })
//       break
      
//     default:
//       // Vue par défaut - afficher par type de tarif
//       rateTypes.value.forEach((rateType, index) => {
//         const dataPoint: ChartDataPoint = {
//           label: rateType,
//           fullLabel: `Revenus ${rateType}`,
//           [rateType]: revenueData.value[rateType] || 0
//         }
//         baseData.push(dataPoint)
//       })
//   }
  
//   return baseData
// })
  

  
  // Methods
  const getHourMultiplier = (hour: number): number => {
    if (hour >= 6 && hour <= 10) return 1.5 // Check-in matinal
    if (hour >= 14 && hour <= 18) return 2.0 // Pic d'activité
    if (hour >= 20 && hour <= 22) return 1.2 // Activité soirée
    return 0.3 // Heures creuses
  }
  
  const getDayMultiplier = (dayIndex: number): number => {
    const patterns = [0.8, 0.6, 0.7, 0.8, 1.0, 1.4, 1.3] // Dim, Lun, Mar, Mer, Jeu, Ven, Sam
    return patterns[dayIndex] || 1.0
  }
  
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
      }
    }
  
    if (rateTypeColors[rateType]) return rateTypeColors[rateType]
    
    const defaultColors: ColorConfig[] = [
      { primary: 'bg-gradient-to-t from-slate-500 to-slate-400', light: 'bg-slate-100 dark:bg-slate-900/40', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' },
      { primary: 'bg-gradient-to-t from-indigo-500 to-indigo-400', light: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-700' },
      { primary: 'bg-gradient-to-t from-pink-500 to-pink-400', light: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-700' },
      { primary: 'bg-gradient-to-t from-yellow-500 to-yellow-400', light: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-700' }
    ]
    
    return defaultColors[index % defaultColors.length]
  }
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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