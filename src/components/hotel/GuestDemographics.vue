<template>
  <div class="bg-white rounded-lg shadow p-6 h-full dark:bg-gray-700">
    <h2 class="text-xl font-semibold mb-6 dark:text-white">{{ $t('customer_demographic') }}</h2>

    <div class="grid grid-cols-1 gap-6">
      <!-- Type de clients -->
      <div>
        <h3 class="text-sm font-medium text-gray-600 mb-3 dark:text-white">{{ $t('type_of') }}</h3>
        <div class="flex items-center mb-4">
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div class="flex h-4 rounded-full overflow-hidden">
              <div
                v-for="(type, index) in customerTypes"
                :key="type.type"
                class="h-full"
                :class="getBarColor(index)"
                :style="{ width: type.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div
          class="grid gap-2 text-sm"
          :class="customerTypes.length <= 6 ? 'grid-cols-4' : 'grid-cols-2'"
        >
          <div v-for="(type, index) in customerTypes" :key="type.type" class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-2" :class="getDotColor(index)"></div>
            <span class="text-gray-600 dark:text-white">
              {{ getCustomerTypeLabel(type.type) }} ({{ type.percentage }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- Origine des clients -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-medium text-gray-600 dark:text-white">
            {{ $t('origin_customer') }}
          </h3>
        </div>

        <div ref="originChart" style="width: 100%; height: 250px"></div>
      </div>

      <!-- Durée de séjour -->
      <div>
        <h3 class="text-sm font-medium text-gray-600 mb-3 dark:text-white">{{ $t('duration') }}</h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(value, key) in stayDuration"
            :key="key"
            class="bg-gray-50 rounded-lg p-3 dark:bg-gray-300"
          >
            <div class="text-sm text-gray-500">
              {{ $t(key.includes('nuits') ? key : key + ' nights') }}
            </div>
            <div class="text-lg font-semibold">{{ value.toFixed(2) }}%</div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div class="bg-purple-500 h-1.5 rounded-full" :style="{ width: value + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'

import { defineProps } from 'vue'

const props = defineProps<{
  stayDuration: Record<string, number>
  originData: Array<{
    nationality: string
    count: number
  }>
  customerTypeData: Array<{
    type: string
    count: number
  }>
}>()
const isLoading = ref(true)
const { t } = useI18n()

// Référence DOM
const originChart = ref<HTMLDivElement | null>(null)

let chartInstance: any = null

const initChart = async () => {
  await nextTick()

  if (!originChart.value) {
    console.warn('Élément DOM du graphique non trouvé')
    return
  }

  destroyChart()

  try {
    // Créer une nouvelle instance du graphique
    chartInstance = echarts.init(originChart.value)

    chartInstance.setOption({
      tooltip: {
        trigger: 'item',
        textStyle: { fontWeight: 'bold', color: '#fff' },
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        padding: 12,
        formatter: (params: any) => {
          return `${params.name}: ${params.value}%`
        },
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 0,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 11,
          padding: [0, 0, 15, 0],
        },
      },
      series: [
        {
          name: 'Origine',
          type: 'pie',
          radius: ['50%', '80%'],
          bottom: 50,
          top: 10,
          right: 50,
          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data: props.originData.map((entry, index) => {
            const countryKey = entry.nationality.toLowerCase()
            const translatedName = t(`countries_lists.${countryKey}`)
            const displayName =
              translatedName && translatedName !== `countries_lists.${countryKey}`
                ? translatedName
                : entry.nationality
            return {
              name: displayName,
              value: entry.count,
              itemStyle: {
                color: [
                  'rgba(59, 130, 246, 0.7)',
                  'rgba(245, 158, 11, 0.7)',
                  'rgba(16, 185, 129, 0.7)',
                  'rgba(139, 92, 246, 0.7)',
                  'rgba(239, 68, 68, 0.7)',
                  'rgba(236, 72, 153, 0.7)',
                  'rgba(209, 213, 219, 0.7)',
                ][index % 7],
              },
            }
          }),
        },
      ],
    })

    window.addEventListener('resize', () => {
      chartInstance?.resize()
    })
  } catch (error) {
    console.error("Erreur lors de l'initialisation du graphique:", error)
  }
}

onMounted(() => {
  // Si les données sont déjà prêtes au montage
  if (props.originData && props.originData.length > 0) {
    initChart()
  }
})

watch(
  () => props.originData,
  async (newData: any) => {
    if (newData && newData.length > 0) {
      isLoading.value = true
      await initChart()
      isLoading.value = false
    }
  },
  { immediate: true },
)

// Détruire l'instance précédente si besoin
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}
const getBarColor = (index: number) => {
  const colors = [
    'bg-pink-500',
    'bg-amber-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500'
  ]
  return colors[index % colors.length]
}

const getDotColor = (index: number) => {
  const colors = [
    'bg-pink-500',
    'bg-amber-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500'
  ]
  return colors[index % colors.length]
}

// Calculer les pourcentages pour les types de clients
const customerTypes = computed(() => {
  if (!props.customerTypeData || props.customerTypeData.length === 0) {
    return []
  }

  const total = props.customerTypeData.reduce((sum, type) => sum + type.count, 0)

  return props.customerTypeData
    .map((type) => ({
      type: type.type,
      count: type.count,
      percentage: total > 0 ? Math.round((type.count / total) * 100) : 0,
    }))
    .filter((type) => type.count > 0) // Ne garder que les types avec des réservations
    .sort((a, b) => b.count - a.count)
})

// Obtenir le label traduit selon le type de client
const getCustomerTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    individual: t('Individual'),
    group: t('Group'),
    company: t('Company'),
    inconnu: t('unknown'),
    family: t('family'),
  }

  return labels[type?.toLowerCase()] || type || t('other')
}
</script>
