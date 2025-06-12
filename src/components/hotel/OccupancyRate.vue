<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">{{ $t('weekly_occupancy') }}</h2>
        <div class="flex space-x-2">
          <button class="text-gray-500 hover:text-gray-700">
            <span class="text-sm">{{ $t('this_week') }}</span>
          </button>
          <button class="text-gray-400 hover:text-gray-700">
            <span class="text-sm">{{ $t('month') }}</span>
          </button>
          <button class="text-gray-400 hover:text-gray-700">
            <span class="text-sm">{{ $t('year') }}</span>
          </button>
        </div>
      </div>

      <div class="h-64">
        <canvas ref="occupancyChart"></canvas>
      </div>

      <div class="grid grid-cols-7 gap-2 mt-4">
        <div v-for="(day, index) in weekDays" :key="index" class="text-center">
          <div class="text-sm font-medium">{{ day.name }}</div>
          <div class="text-lg font-semibold" :class="getOccupancyColor(day.rate)">
            {{ day.rate }}%
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  Chart.register(...registerables)

  // interface DayRate {
  //   name: string
  //   rate: number
  // }

const { t } = useI18n()

const weekDays = computed(() => [
  { name: t('mon'), rate: 65 },
  { name: t('tue'), rate: 72 },
  { name: t('wed'), rate: 85 },
  { name: t('thur'), rate: 91 },
  { name: t('fri'), rate: 95 },
  { name: t('sat'), rate: 98 },
  { name: t('sun'), rate: 75 }
])

  const occupancyChart = ref<HTMLCanvasElement | null>(null)
  const chart = ref<Chart | null>(null)

  const getOccupancyColor = (rate: number): string => {
    if (rate < 60) return 'text-red-500'
    if (rate < 80) return 'text-yellow-500'
    return 'text-green-500'
  }

  const initChart = () => {
    if (!occupancyChart.value) return
    const ctx = occupancyChart.value.getContext('2d')
    if (!ctx) return

    chart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: weekDays.value.map((day:any) => day.name),
        datasets: [
          {
            label: "Occupancy rate",
            data: weekDays.value.map((day:any) => day.rate),
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointRadius: 4,
            tension: 0.3,
            fill: true
          },
          {
            label: 'Previous week',
            data: [60, 65, 80, 85, 90, 92, 70],
            borderColor: 'rgba(209, 213, 219, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(209, 213, 219, 1)',
            pointRadius: 3,
            tension: 0.3,
            borderDash: [5, 5],
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              boxWidth: 6
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            padding: 12,
            titleFont: {
              weight: 'bold'
            },
            callbacks: {
              title: function (tooltipItems: any[]) {
                return tooltipItems[0].label
              },
              label: function (context: any) {
                return `Occupancy rate: ${context.parsed.y}%`
              }
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
            max: 100,
            ticks: {
              stepSize: 20,
              callback: function (tickValue: string | number, index: number, ticks: any[]) {
                return tickValue + '%';
              }
            }
          }
        }
      }
    })
  }

  onMounted(() => {
    initChart()
  })
  </script>
