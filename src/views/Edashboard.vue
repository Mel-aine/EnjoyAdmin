<!-- <template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
        <monthly-target />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-sale />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <customer-demographic />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlySale.vue'
import MonthlySale from '../components/ecommerce/MonthlyTarget.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
export default {
  components: {
    AdminLayout,
    EcommerceMetrics,
    MonthlyTarget,
    MonthlySale,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  name: 'Ecommerce',
}
</script> -->
<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Métriques principales de l'hôtel -->
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <hotel-metrics />
        <occupancy-rate />
      </div>
      
      <!-- Réservations mensuelles -->
      <div class="col-span-12 xl:col-span-5">
        <monthly-bookings />
      </div>
      
      <!-- Statistiques de revenus -->
      <div class="col-span-12">
        <revenue-chart />
      </div>
      
      <!-- Typologie des clients -->
      <div class="col-span-12 xl:col-span-5">
        <guest-demographics />
      </div>
      
      <!-- Réservations récentes -->
      <div class="col-span-12 xl:col-span-7">
        <recent-bookings />
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const AdminLayout = defineAsyncComponent(() => import('../components/layout/AdminLayout.vue'))
const HotelMetrics = defineAsyncComponent(() => import('../components/hotel/HotelMetrics.vue'))
const OccupancyRate = defineAsyncComponent(() => import('../components/hotel/OccupancyRate.vue'))
const MonthlyBookings = defineAsyncComponent(() => import('../components/hotel/MonthlyBookings.vue'))
const RevenueChart = defineAsyncComponent(() => import('../components/hotel/RevenueChart.vue'))
const GuestDemographics = defineAsyncComponent(() => import('../components/hotel/GuestDemographics.vue'))
const RecentBookings = defineAsyncComponent(() => import('../components/hotel/RecentBookings.vue'))
</script>
