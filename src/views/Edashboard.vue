
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
