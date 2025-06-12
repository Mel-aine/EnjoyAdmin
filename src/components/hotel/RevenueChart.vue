<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">{{ $t('earning_statistic') }}</h2>
        <div class="flex space-x-2">
          <button class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600 font-medium">{{ $t('year') }}</button>
          <button class="px-3 py-1 text-sm rounded-full text-gray-500 hover:bg-gray-100">{{ $t('half') }}</button>
          <button class="px-3 py-1 text-sm rounded-full text-gray-500 hover:bg-gray-100">{{ $t('quarter') }}</button>
          <button class="px-3 py-1 text-sm rounded-full text-gray-500 hover:bg-gray-100">{{ $t('month') }}</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Revenu total -->
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-blue-600 text-sm font-medium mb-1">{{ $t('total_earning') }}</div>
          <div class="text-2xl font-bold">1,283,250 FCFA</div>
          <div class="flex items-center mt-2">
            <span class="text-green-500 text-xs font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              8.2%
            </span>
            <span class="text-xs text-gray-500 ml-2">vs {{ $t('previous_year') }}</span>
          </div>
        </div>

        <!-- Taux d'occupation moyen -->
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-green-600 text-sm font-medium mb-1">{{ $t('average_occupancy') }}</div>
          <div class="text-2xl font-bold">72.5%</div>
          <div class="flex items-center mt-2">
            <span class="text-green-500 text-xs font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              5.3%
            </span>
            <span class="text-xs text-gray-500 ml-2">vs {{ $t('previous_year') }}</span>
          </div>
        </div>

        <!-- ADR -->
        <div class="bg-purple-50 rounded-lg p-4">
          <div class="text-purple-600 text-sm font-medium mb-1">{{ $t('average_price') }} (ADR)</div>
          <div class="text-2xl font-bold">155 FCFA</div>
          <div class="flex items-center mt-2">
            <span class="text-red-500 text-xs font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              1.2%
            </span>
            <span class="text-xs text-gray-500 ml-2">vs {{ $t('previous_year') }}</span>
          </div>
        </div>
      </div>

      <div class="h-72">
        <canvas ref="revenueChart"></canvas>
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

  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  export default defineComponent({
    name: 'RevenueChart',
    setup() {
      const revenueChart = ref<HTMLCanvasElement | null>(null);
      let chart: Chart | null = null;

      const monthlyData = {
        months: ['Jan', 'Fev', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue2025: [98500, 105200, 120500, 115800, 125600, 135000, 158000, 167500, 145200, 130500, null, null],
        revenue2024: [92000, 98500, 110200, 108500, 120000, 126500, 150200, 162000, 138500, 122000, 118000, 128500],
        occupancy2025: [65, 68, 72, 70, 75, 82, 95, 98, 85, 78, null, null]
      };

      const initChart = () => {
        if (!revenueChart.value) return;

        const ctx = revenueChart.value.getContext('2d');
        if (!ctx) return;

        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: monthlyData.months,
            datasets: [
              {
                type: 'bar',
                label: 'Revenus 2025',
                data: monthlyData.revenue2025,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 4,
                order: 2,
                yAxisID: 'y',
              },
              {
                type: 'bar',
                label: 'Revenus 2024',
                data: monthlyData.revenue2024,
                backgroundColor: 'rgba(209, 213, 219, 0.7)',
                borderRadius: 4,
                order: 3,
                yAxisID: 'y',
              },
              {
                type: 'line',
                label: "Taux d'occupation 2025",
                data: monthlyData.occupancy2025,
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                pointRadius: 4,
                fill: false,
                tension: 0.4,
                order: 1,
                yAxisID: 'y1',
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                padding: 12,
                titleFont: { weight: 'bold' },
                callbacks: {
                  label(context:any) {
                    if (context.dataset.yAxisID === 'y1') {
                      return `Taux d'occupation: ${context.parsed.y}%`;
                    } else {
                      return `Revenu: ${context.parsed.y.toLocaleString()} €`;
                    }
                  }
                }
              }
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                beginAtZero: true,
                position: 'left',
                title: { display: true, text: 'Earning (FCFA)' },
                ticks: {
                  callback: (value: string | number) => `${value.toLocaleString()} €`
                }
              },
              y1: {
                beginAtZero: true,
                max: 100,
                position: 'right',
                title: { display: true, text: "Taux d'occupation (%)" },
                ticks: {
                   callback: (tickValue: string | number) => `${tickValue}%`
                },
                grid: { display: false }
              }
            }
          }
        });
      };

      onMounted(() => {
        initChart();
      });

      return {
        revenueChart
      };
    }
  });
  </script>
