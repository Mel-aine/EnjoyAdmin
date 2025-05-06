<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Taux d'occupation hebdomadaire</h2>
        <div class="flex space-x-2">
          <button class="text-gray-500 hover:text-gray-700">
            <span class="text-sm">Cette semaine</span>
          </button>
          <button class="text-gray-400 hover:text-gray-700">
            <span class="text-sm">Mois</span>
          </button>
          <button class="text-gray-400 hover:text-gray-700">
            <span class="text-sm">Année</span>
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

  Chart.register(...registerables)

  interface DayRate {
    name: string
    rate: number
  }

  const weekDays = ref<DayRate[]>([
    { name: 'Lun', rate: 65 },
    { name: 'Mar', rate: 72 },
    { name: 'Mer', rate: 85 },
    { name: 'Jeu', rate: 91 },
    { name: 'Ven', rate: 95 },
    { name: 'Sam', rate: 98 },
    { name: 'Dim', rate: 75 }
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
            label: "Taux d'occupation",
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
            label: 'Semaine précédente',
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
                return `Taux d'occupation: ${context.parsed.y}%`
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
