<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Métriques principales de l'hôtel -->
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <hotel-metrics
          :occupancyRate="generalStats.occupancyRate"
          :occupancyTrend="generalStats.totalReservationsThisMonth"
          :revPAR="generalStats.totalRevenueThisMonth"
          :revPARTrend="generalStats.revPARTrend"
          :avgStayDuration="averageLengthOfStay.averageLengthOfStay"
          :avgStayTrend="generalStats.avgStayTrend"
          :availableRooms="generalStats.availableRooms"
          :totalRooms="generalStats.totalRooms"
          :roomsBookedToday="generalStats.reservedToday"
        />

        <occupancy-rate
          :data="occupancyData"
          :current-period="selectedPeriod"
          @changeView="handleViewChange"
        />
      </div>

      <!-- Réservations mensuelles -->
      <div class="col-span-12 xl:col-span-5">
        <monthly-bookings :months="months" :bookingsData="bookingsData" :variations="variations" />
        <!-- <monthly-bookings/> -->
      </div>

      <!-- Statistiques de revenus -->
      <div class="col-span-12">
        <revenue-chart
          :monthlyData="combinedData"
          :totalOccupancyRate="totalOccupancyRate"
          :Adr="Adr"
          :revenuTotal="revenuTotal"
          :currentView="selectedPeriods"
          @changeViews="handleViewChanges"
        />
      </div>

      <!-- Typologie des clients -->
      <div class="col-span-12 xl:col-span-5">
        <guest-demographics :stay-duration="stayDuration" />
      </div>

      <!-- Réservations récentes -->
      <div class="col-span-12 xl:col-span-7">
        <recent-bookings :recent-bookings = "reservations" />
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, ref, computed, watch } from 'vue'
import { useServiceStore } from '@/composables/serviceStore'
import {
  getGeneralStats,
  getAverageLengthOfStay,
  getOccupancyRate,
  getOccupancyRateTotal,
  getADR,
  getRevenuTotal,
  getRevenuTotalMonthly,
  getOccupancyRateMonthly,
  getStayDuration,
  getRecentReservation
} from '@/services/dashboard'

const AdminLayout = defineAsyncComponent(() => import('../components/layout/AdminLayout.vue'))
const HotelMetrics = defineAsyncComponent(() => import('../components/hotel/HotelMetrics.vue'))
const OccupancyRate = defineAsyncComponent(() => import('../components/hotel/OccupancyRate.vue'))
const MonthlyBookings = defineAsyncComponent(
  () => import('../components/hotel/MonthlyBookings.vue'),
)
const RevenueChart = defineAsyncComponent(() => import('../components/hotel/RevenueChart.vue'))
const GuestDemographics = defineAsyncComponent(
  () => import('../components/hotel/GuestDemographics.vue'),
)
const RecentBookings = defineAsyncComponent(() => import('../components/hotel/RecentBookings.vue'))
const serviceStore = useServiceStore()
const generalStats = ref<any>({})
const averageLengthOfStay = ref<any>({})
const selectedPeriod = ref<'weekly' | 'monthly' | 'yearly'>('weekly')
const selectedPeriods = ref<'quarterly' | 'monthly' | 'yearly' | 'semester'>('monthly')
const stayDuration = ref<Record<string, number>>({})
const occupancyData = ref<{ current: DayRate[]; previous: DayRate[] }>({
  current: [],
  previous: [],
})
const totalOccupancyRate = ref<any>(null)
const Adr = ref<any>(null)
const revenuTotal = ref<any>(null)
const reservations = ref<any[]>([])

const fetchGeneralStat = async () => {
  try {
    const serviceId = serviceStore.serviceId

    const [result, result1, result2, reservation] = await Promise.all([
      getGeneralStats(serviceId),
      getAverageLengthOfStay(serviceId),
      getStayDuration(serviceId),
      getRecentReservation(serviceId)
    ])

    generalStats.value = result.data
    averageLengthOfStay.value = result1.data
     stayDuration.value = result2.data
     reservations.value = reservation
    console.log("result2reservations.value", reservations.value)
  } catch (error) {
    console.error('error fetching fetchGeneralStat', error)
  }
}


onMounted(async() => {
  await fetchGeneralStat()
  await fetchOccupancyData()
  await fetchRevenuData()
  await fetchRevenuAndOccupancyData()
})

interface DayRate {
  label: string
  occupancyRate: number
}

const handleViewChange = (view: 'weekly' | 'monthly' | 'yearly') => {
  selectedPeriod.value = view
  fetchOccupancyData()
}

const handleViewChanges = (view: 'quarterly' | 'monthly' | 'yearly' | 'semester') => {
  selectedPeriods.value = view
  fetchRevenuData()
}
const fetchOccupancyData = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const result = await getOccupancyRate({
      serviceId,
      period: selectedPeriod.value,
    })

    occupancyData.value = {
      current: result.data.current.map((day:any) => ({
        label: day.label,
        occupancyRate: day.occupancyRate,
      })),
      previous: result.data.previous.map((day:any) => ({
        label: day.label,
        occupancyRate: day.occupancyRate,
      })),
    }
  } catch (e) {
    console.error('Erreur fetchOccupancyData:', e)
  }
}

const combinedData = ref<any[]>([])

const fetchRevenuAndOccupancyData = async () => {
  try {
    const serviceId = serviceStore.serviceId

    const [occupancyRes, revenueRes] = await Promise.all([
      getOccupancyRateMonthly(serviceId),
      getRevenuTotalMonthly(serviceId),
    ])

    const occupancyData = occupancyRes.data
    const revenueCurrent = revenueRes.data.currentYear
    const revenuePrevious = revenueRes.data.previousYear

    combinedData.value = occupancyData.map((occ:any, index:any) => {
      return {
        month: occ.month,
        occupancyRate: occ.occupancyRate || 0,
        totalRevenue: revenueCurrent[index]?.totalRevenue || 0,
        previousRevenue: revenuePrevious[index]?.totalRevenue || 0,
      }
    })

    console.log('✅ Combined Data:', combinedData)
    return combinedData
  } catch (e) {
    console.error('❌ Erreur fetchRevenuData:', e)
    return []
  }
}

const fetchRevenuData = async () => {
  const serviceId = serviceStore.serviceId
  const period = selectedPeriods.value

  try {
    const res = await getOccupancyRateTotal({ serviceId, period })
    totalOccupancyRate.value = res.data
    console.log('totalOccupancyRate.value ', totalOccupancyRate.value)
  } catch (e) {
    console.error('Erreur getOccupancyRateTotal', e)
  }

  try {
    const res = await getADR({ serviceId, period })
    Adr.value = res.data
  } catch (e) {
    console.error('Erreur getADR', e)
  }

  try {
    const res = await getRevenuTotal({ serviceId, period })
    revenuTotal.value = res.data
  } catch (e) {
    console.error('Erreur getRevenuTotal', e)
  }
}

const months = [
  { key: 'May 2025', label: 'may', year: 2025 },
  { key: 'April 2025', label: 'april', year: 2025 },
  { key: 'March 2025', label: 'march', year: 2025 },
  { key: 'February 2025', label: 'february', year: 2025 },
]

const bookingsData = {
  'May 2025': {
    direct: [12, 15, 18, 13],
    ota: [28, 32, 36, 28],
    group: [8, 4, 12, 8],
  },
  'April 2025': {
    direct: [10, 13, 16, 14],
    ota: [25, 30, 34, 26],
    group: [6, 5, 10, 9],
  },
  'March 2025': {
    direct: [9, 11, 14, 10],
    ota: [20, 22, 28, 25],
    group: [5, 6, 8, 7],
  },
  'February 2025': {
    direct: [8, 10, 11, 9],
    ota: [18, 20, 23, 21],
    group: [4, 5, 6, 6],
  },
}

const variations = {
  'May 2025': { direct: 12, ota: 5, group: -3, total: 214, earnings: '25.8K' },
  'April 2025': { direct: 10, ota: 4, group: -2, total: 200, earnings: '23.5K' },
  'March 2025': { direct: 8, ota: 3, group: -1, total: 180, earnings: '21.0K' },
  'February 2025': { direct: 7, ota: 2, group: 0, total: 160, earnings: '19.0K' },
}
</script>
