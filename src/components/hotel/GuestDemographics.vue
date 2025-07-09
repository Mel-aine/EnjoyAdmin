<template>
  <div class="bg-white rounded-lg shadow p-6 h-full">
    <h2 class="text-xl font-semibold mb-6">{{ $t('customer_demographic') }}</h2>

    <div class="grid grid-cols-1 gap-6">
      <!-- Type de clients -->
      <div>
        <h3 class="text-sm font-medium text-gray-600 mb-3">{{ $t('type_of') }}</h3>
        <div class="flex items-center mb-4">
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div class="flex h-4 rounded-full overflow-hidden">
              <div class="bg-blue-500 h-full" style="width: 45%"></div>
              <div class="bg-amber-500 h-full" style="width: 30%"></div>
              <div class="bg-green-500 h-full" style="width: 25%"></div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-sm">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span class="text-gray-600">{{ $t('hobbies') }} (45%)</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span class="text-gray-600">{{ $t('business') }} (30%)</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span class="text-gray-600">{{ $t('groups') }} (25%)</span>
          </div>
        </div>
      </div>

      <!-- Origine des clients -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-medium text-gray-600">{{ $t('origin_customer') }}</h3>
          <!-- <button class="text-xs text-blue-600 hover:text-blue-700">{{ $t('see_details') }}</button> -->
        </div>

        <div  ref="originChart" style="width: 100%; height: 400px"></div>


      </div>

      <!-- Durée de séjour -->
      <div>
        <h3 class="text-sm font-medium text-gray-600 mb-3">{{ $t('duration') }}</h3>
        <div class="grid grid-cols-2 gap-2">
          <div v-for="(value, key) in stayDuration" :key="key" class="bg-gray-50 rounded-lg p-3">
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
import { ref, onMounted,nextTick,watch } from 'vue'
import * as echarts from 'echarts'
import Spinner from '../spinner/Spinner.vue';

import { defineProps } from 'vue'

const props = defineProps<{
  stayDuration: Record<string, number>
  originData: Array<{
    nationality: string
    count: number
  }>
}>()
const isLoading = ref(true)



// Référence DOM
const originChart = ref<HTMLDivElement | null>(null)

// const originData = {
//   labels: ['France', 'Royaume-Uni', 'Allemagne', 'États-Unis', 'Italie', 'Espagne', 'Autres'],
//   data: [35, 18, 15, 12, 8, 7, 5],
// }



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
          data: props.originData.map((entry, index) => ({
            name: entry.nationality,
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
          })),
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
  async (newData:any) => {
    if (newData && newData.length > 0) {
      isLoading.value = true
      await initChart()
      isLoading.value = false
    }
  },
  { immediate: true }
)


// Détruire l'instance précédente si besoin
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

</script>
