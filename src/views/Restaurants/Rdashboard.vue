<template>
  <div>
    <AdminLayout>

      <div class="restaurant-dashboard p-6">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Restaurant Dashboard</h1>
        <div class="text-sm text-gray-500">
          {{ currentDate }}
        </div>
      </div>

      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Chiffre d'affaires"
          :value="stats.revenue"
          icon="💰"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Commandes aujourd'hui"
          :value="stats.orders"
          icon="🛒"
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Menus"
          :value="stats.customers"
          icon="🍽️"
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Plats populaires"
          :value="stats.topDish"
          icon="🍲"
          color="bg-orange-100 text-orange-600"
        />
      </div>

      <!-- Graphique et commandes récentes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Graphique des ventes -->
        <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Ventes des 7 derniers jours</h2>
          <SalesChart :chart-data="chartData" />
        </div>

        <!-- Commandes récentes -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Commandes récentes</h2>
          <RecentOrders :orders="recentOrders" />
        </div>
      </div>

      <!-- Plats populaires -->
      <div class="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Plats les plus populaires</h2>
        <PopularDishes :dishes="popularDishes" />
      </div>
    </div>
    </AdminLayout>
  </div>
</template>
<script setup>
import { ref, computed,defineAsyncComponent } from 'vue'
const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'));
const StatCard= defineAsyncComponent(() => import('@/components/dashboardRestau/StatCard.vue'))
const SalesChart = defineAsyncComponent(() => import('@/components/dashboardRestau/SalesChart.vue'))
const RecentOrders = defineAsyncComponent(() => import('@/components/dashboardRestau/RecentOrders.vue'))
const PopularDishes = defineAsyncComponent(() => import('@/components/dashboardRestau/PopularDishes.vue'))


  // Données statistiques
  const stats = ref({
    revenue: '2,450 €',
    orders: 56,
    customers: 48,
    topDish: 'Poulet rôti'
  })

  // Commandes récentes
  const recentOrders = ref([
    { id: 125, table: 'T12', amount: '45.50 €', status: 'Servi', time: '12:45' },
    { id: 124, table: 'T08', amount: '32.00 €', status: 'En cuisine', time: '12:30' },
    { id: 123, table: 'T05', amount: '28.50 €', status: 'Payé', time: '12:15' },
    { id: 122, table: 'T03', amount: '62.00 €', status: 'Servi', time: '11:50' },
    { id: 121, table: 'T10', amount: '18.00 €', status: 'Payé', time: '11:30' },
    { id: 120, table: 'T11', amount: '20.00 €', status: 'Rejeté', time: '12:30' }
  ])

  // Plats populaires
  const popularDishes = ref([
    { name: 'Poulet rôti', orders: 24, revenue: '288 €' },
    { name: 'Pizza Margherita', orders: 18, revenue: '216 €' },
    { name: 'Salade César', orders: 15, revenue: '120 €' },
    { name: 'Pâtes Carbonara', orders: 12, revenue: '144 €' },
    { name: 'Tiramisu', orders: 10, revenue: '60 €' }
  ])

  // Données pour le graphique
  const chartData = ref({
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Ventes (€)',
        data: [450, 520, 480, 620, 780, 950, 720],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      }
    ]
  })

  // Date actuelle formatée
  const currentDate = computed(() => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })
  </script>

  <style scoped>
  .restaurant-dashboard {
    background-color: #f8fafc;
    min-height: 100vh;
  }
  </style>
