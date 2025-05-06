<template>
    <div class="bg-white rounded-lg shadow p-6 h-full">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">Réservations mensuelles</h2>
        <div class="relative">
          <select v-model="selectedMonth" @change="updateChartData"
            class="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm">
            <option>Mai 2025</option>
            <option>Avril 2025</option>
            <option>Mars 2025</option>
            <option>Février 2025</option>
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
            <span class="text-sm font-medium">Réservations directes</span>
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
            <span class="text-sm font-medium">Groupes & Entreprises</span>
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
          <div class="text-gray-500">Total réservations</div>
        </div>
        <div class="border-l px-4 py-2 text-sm text-center">
          <div class="text-3xl font-bold text-green-600">25.8K€</div>
          <div class="text-gray-500">Revenus</div>
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
        labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
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
  </script>
