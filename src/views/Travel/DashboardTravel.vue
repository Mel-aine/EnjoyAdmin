<script setup lang="ts">
// import { ref, onMounted, onBeforeUnmount } from 'vue';
// import AdminLayout from '@/components/layout/AdminLayout.vue';
// import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
// import { Bar } from 'vue-chartjs';
// import {  Line } from 'vue-chartjs';
// import {  Pie } from 'vue-chartjs';
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   LineElement,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   PointElement
// } from 'chart.js';

// ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, ArcElement, CategoryScale, LinearScale, PointElement);

// import { Car} from 'lucide-vue-next';
// import { DollarSign } from 'lucide-vue-next';
// import {Calendar} from 'lucide-vue-next';
// import {Users} from 'lucide-vue-next';
// import {RefreshCw} from 'lucide-vue-next';
// import {MapPin} from 'lucide-vue-next';
// import {Clock} from 'lucide-vue-next';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const vehicleUsageData = {
//   labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
//   datasets: [
//     { label: 'SUV', data: [65, 59, 80, 81, 56, 95], backgroundColor: '#0088FE' },
//     { label: 'Berline', data: [42, 38, 40, 55, 48, 72], backgroundColor: '#00C49F' },
//     { label: 'Utilitaire', data: [28, 35, 42, 40, 36, 55], backgroundColor: '#FFBB28' },
//   ]
// };

// const revenueData = {
//   labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
//   datasets: [
//     {
//       label: 'Revenus',
//       data: [12500, 11800, 15400, 16200, 14300, 22000],
//       borderColor: '#8884d8',
//       backgroundColor: 'rgba(136, 132, 216, 0.2)',
//       tension: 0.4,
//       fill: true
//     }
//   ]
// };

// const vehicleTypeData = {
//   labels: ['SUV', 'Berline', 'Utilitaire', 'Électrique'],
//   datasets: [
//     {
//       label: 'Types de véhicules',
//       data: [42, 28, 18, 12],
//       backgroundColor: COLORS,
//     }
//   ]
// };

// const activeVehicles = ref(48);
// const totalRevenue = ref(92200);
// const totalBookings = ref(386);
// const activeClients = ref(195);
// const loading = ref(false);

// function refreshData() {
//   loading.value = true;
//   setTimeout(() => {
//     activeVehicles.value = Math.floor(40 + Math.random() * 20);
//     totalRevenue.value = Math.floor(90000 + Math.random() * 5000);
//     totalBookings.value = Math.floor(350 + Math.random() * 50);
//     activeClients.value = Math.floor(180 + Math.random() * 30);
//     loading.value = false;
//   }, 1000);
// }

// let interval: number;
// onMounted(() => {
//   interval = setInterval(() => {
//     activeVehicles.value += Math.floor(Math.random() * 3) - 1;
//   }, 8000);
// });
// onBeforeUnmount(() => {
//   clearInterval(interval);
// });

// const vehicleStatuses = [
//   { id: 'VEH-1032', type: 'SUV Premium', client: 'Martin Dupont', status: 'En cours', location: 'Paris', return: '12 juin' },
//   { id: 'VEH-985', type: 'Berline', client: 'Sophie Laurent', status: 'Réservé', location: 'Lyon', return: '18 juin' },
//   { id: 'VEH-1104', type: 'Utilitaire', client: 'Antoine Dubois', status: 'En cours', location: 'Marseille', return: '10 juin' },
//   { id: 'VEH-1078', type: 'SUV Compact', client: 'Claire Martin', status: 'Disponible', location: 'Nice', return: '-' },
//   { id: 'VEH-991', type: 'Électrique', client: 'Thomas Petit', status: 'En maintenance', location: 'Bordeaux', return: '14 juin' },
// ];
</script>

<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'dashboard'" />
  <!-- <div class="bg-gray-50 min-h-screen p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-end items-center mb-8">

        <button @click="refreshData" class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <RefreshCw :class="loading ? 'animate-spin' : ''" />
          Actualiser
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Utilisation des véhicules</h2>
          <Bar :data="vehicleUsageData" :options="{ responsive: true, plugins: { legend: { position: 'top' } } }" />
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Revenus mensuels</h2>
          <Line :data="revenueData" :options="{ responsive: true, plugins: { legend: { position: 'top' } } }" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Types de véhicules</h2>
          <Pie :data="vehicleTypeData" :options="{ responsive: true, plugins: { legend: { position: 'right' } } }" />
        </div>


        <div class="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-2">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Statut des véhicules récents</h2>
          <div class="space-y-4">
            <div v-for="vehicle in vehicleStatuses" :key="vehicle.id" class="flex items-center border-b border-gray-100 pb-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                <Car class="text-gray-600" />
              </div>
              <div class="flex-grow">
                <div class="flex justify-between">
                  <p class="font-medium text-gray-800">{{ vehicle.id }} - {{ vehicle.type }}</p>
                  <div :class="[
                    'px-3 py-1 rounded-full text-xs',
                    vehicle.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                    vehicle.status === 'Réservé' ? 'bg-purple-100 text-purple-800' :
                    vehicle.status === 'Disponible' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ vehicle.status }}
                  </div>
                </div>
                <div class="flex mt-1 text-sm text-gray-500">
                  <div class="flex items-center mr-4">
                    <Users class="mr-1" /> {{ vehicle.client }}
                  </div>
                  <div class="flex items-center mr-4">
                    <MapPin  class="mr-1" /> {{ vehicle.location }}
                  </div>
                  <div class="flex items-center">
                    <Clock class="mr-1" /> Retour: {{ vehicle.return }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</AdminLayout>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
