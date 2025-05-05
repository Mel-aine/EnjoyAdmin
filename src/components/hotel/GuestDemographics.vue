<template>
    <div class="bg-white rounded-lg shadow p-6 h-full">
      <h2 class="text-xl font-semibold mb-6">Démographie des clients</h2>
  
      <div class="grid grid-cols-1 gap-6">
        <!-- Type de clients -->
        <div>
          <h3 class="text-sm font-medium text-gray-600 mb-3">Type de clients</h3>
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
              <span class="text-gray-600">Loisirs (45%)</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span class="text-gray-600">Affaires (30%)</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span class="text-gray-600">Groupes (25%)</span>
            </div>
          </div>
        </div>
  
        <!-- Origine des clients -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-medium text-gray-600">Origine des clients</h3>
            <button class="text-xs text-blue-600 hover:text-blue-700">Voir détails</button>
          </div>
          <div class="h-56">
            <canvas ref="originChart"></canvas>
          </div>
        </div>
  
        <!-- Durée de séjour -->
        <div>
          <h3 class="text-sm font-medium text-gray-600 mb-3">Durée de séjour</h3>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-sm text-gray-500">1-2 nuits</div>
              <div class="text-lg font-semibold">35%</div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div class="bg-purple-500 h-1.5 rounded-full" style="width: 35%"></div>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-sm text-gray-500">3-5 nuits</div>
              <div class="text-lg font-semibold">42%</div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div class="bg-purple-500 h-1.5 rounded-full" style="width: 42%"></div>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-sm text-gray-500">6-10 nuits</div>
              <div class="text-lg font-semibold">18%</div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div class="bg-purple-500 h-1.5 rounded-full" style="width: 18%"></div>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-sm text-gray-500">10+ nuits</div>
              <div class="text-lg font-semibold">5%</div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div class="bg-purple-500 h-1.5 rounded-full" style="width: 5%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Chart, registerables } from 'chart.js'
  
  // Enregistrer tous les composants Chart.js
  Chart.register(...registerables)
  
  // Référence du canvas
  const originChart = ref<HTMLCanvasElement | null>(null)
  
  // Données de démographie
  const originData = {
    labels: ['France', 'Royaume-Uni', 'Allemagne', 'États-Unis', 'Italie', 'Espagne', 'Autres'],
    data: [35, 18, 15, 12, 8, 7, 5]
  }
  
  // Fonction pour initialiser le graphique
  const initChart = () => {
    if (!originChart.value) return
  
    const ctx = originChart.value.getContext('2d')
    if (!ctx) return
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: originData.labels,
        datasets: [{
          data: originData.data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(209, 213, 219, 0.7)'
          ],
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            padding: 12,
            titleFont: {
              weight: 'bold'
            },
            callbacks: {
              label: function (context: any) {
                return `${context.label}: ${context.parsed}%`
              }
            }
          }
        }
      }
    })
  }
  
  // Initialiser à l'affichage
  onMounted(() => {
    initChart()
  })
  </script>
  