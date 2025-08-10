<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.description') }}
      </p>
    </div>

    <!-- Reports Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Reservation Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center mb-4">
          <CalenderIcon class="w-8 h-8 text-blue-600 mr-3" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.reservation.title') }}
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('reports.reservation.description') }}
        </p>
        <div class="space-y-2">
          <router-link
            v-for="report in reservationReports"
            :key="report.name"
            :to="report.path"
            class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {{ $t(report.label) }}
          </router-link>
        </div>
      </div>

      <!-- Front Office Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center mb-4">
          <HomeIcon class="w-8 h-8 text-green-600 mr-3" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.frontOffice.title') }}
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('reports.frontOffice.description') }}
        </p>
        <div class="space-y-2">
          <router-link
            v-for="report in frontOfficeReports"
            :key="report.name"
            :to="report.path"
            class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {{ $t(report.label) }}
          </router-link>
        </div>
      </div>

      <!-- Back Office Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center mb-4">
          <BarChartIcon class="w-8 h-8 text-purple-600 mr-3" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.backOffice.title') }}
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('reports.backOffice.description') }}
        </p>
        <div class="space-y-2">
          <router-link
            v-for="report in backOfficeReports"
            :key="report.name"
            :to="report.path"
            class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {{ $t(report.label) }}
          </router-link>
        </div>
      </div>

      <!-- Audit Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center mb-4">
          <CheckIcon class="w-8 h-8 text-orange-600 mr-3" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.audit.title') }}
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('reports.audit.description') }}
        </p>
        <div class="space-y-2">
          <router-link
            v-for="report in auditReports"
            :key="report.name"
            :to="report.path"
            class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {{ $t(report.label) }}
          </router-link>
        </div>
      </div>

      <!-- Statistical Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center mb-4">
          <PieChartIcon class="w-8 h-8 text-red-600 mr-3" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.statistical.title') }}
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('reports.statistical.description') }}
        </p>
        <div class="space-y-2">
          <router-link
            v-for="report in statisticalReports"
            :key="report.name"
            :to="report.path"
            class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {{ $t(report.label) }}
          </router-link>
        </div>
      </div>

      <!-- Custom Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center mb-4">
          <SettingsIcon class="w-8 h-8 text-indigo-600 mr-3" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.custom.title') }}
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('reports.custom.description') }}
        </p>
        <div class="space-y-2">
          <router-link
            v-for="report in customReports"
            :key="report.name"
            :to="report.path"
            class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {{ $t(report.label) }}
          </router-link>
        </div>
      </div>
    </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { CalenderIcon, HomeIcon, BarChartIcon, CheckIcon, PieChartIcon, SettingsIcon } from '@/icons'

// Reservation Reports
const reservationReports = [
  { name: 'arrival-list', path: '/reports/reservation/arrival-list', label: 'reports.reservation.arrivalList' },
  { name: 'departure-list', path: '/reports/reservation/departure-list', label: 'reports.reservation.departureList' },
  { name: 'confirmed-reservations', path: '/reports/reservation/confirmed-reservations', label: 'reports.reservation.confirmedReservations' },
  { name: 'cancelled-reservations', path: '/reports/reservation/cancelled-reservations', label: 'reports.reservation.cancelledReservations' },
  { name: 'no-show-reservations', path: '/reports/reservation/no-show-reservations', label: 'reports.reservation.noShowReservations' },
  { name: 'reservation-forecast', path: '/reports/reservation/reservation-forecast', label: 'reports.reservation.reservationForecast' }
]

// Front Office Reports
const frontOfficeReports = [
  { name: 'guest-checked-in', path: '/reports/front-office/guest-checked-in', label: 'reports.frontOffice.guestCheckedIn' },
  { name: 'guest-checked-out', path: '/reports/front-office/guest-checked-out', label: 'reports.frontOffice.guestCheckedOut' },
  { name: 'guest-list', path: '/reports/front-office/guest-list', label: 'reports.frontOffice.guestList' },
  { name: 'guest-message', path: '/reports/front-office/guest-message', label: 'reports.frontOffice.guestMessage' },
  { name: 'inclusion-report', path: '/reports/front-office/inclusion-report', label: 'reports.frontOffice.inclusionReport' },
  { name: 'inventory-by-room-type', path: '/reports/front-office/inventory-by-room-type', label: 'reports.frontOffice.inventoryByRoomType' },
  { name: 'invoice-breakdown', path: '/reports/front-office/invoice-breakdown', label: 'reports.frontOffice.invoiceBreakdown' },
  { name: 'night-audit', path: '/reports/front-office/night-audit', label: 'reports.frontOffice.nightAudit' },
  { name: 'pickup-dropoff', path: '/reports/front-office/pickup-dropoff', label: 'reports.frontOffice.pickupDropoff' },
  { name: 'room-availability', path: '/reports/front-office/room-availability', label: 'reports.frontOffice.roomAvailability' },
  { name: 'room-service-report', path: '/reports/front-office/room-service-report', label: 'reports.frontOffice.roomServiceReport' },
  { name: 'room-status-report', path: '/reports/front-office/room-status-report', label: 'reports.frontOffice.roomStatusReport' },
  { name: 'task-list-report', path: '/reports/front-office/task-list-report', label: 'reports.frontOffice.taskListReport' }
]

// Back Office Reports
const backOfficeReports = [
  { name: 'revenue-reports', path: '/reports/back-office/revenue-reports', label: 'reports.backOffice.revenueReports' },
  { name: 'expense-reports', path: '/reports/back-office/expense-reports', label: 'reports.backOffice.expenseReports' },
  { name: 'accounts-receivable', path: '/reports/back-office/accounts-receivable', label: 'reports.backOffice.accountsReceivable' },
  { name: 'accounts-payable', path: '/reports/back-office/accounts-payable', label: 'reports.backOffice.accountsPayable' },
  { name: 'cashier-reports', path: '/reports/back-office/cashier-reports', label: 'reports.backOffice.cashierReports' },
  { name: 'financial-summary', path: '/reports/back-office/financial-summary', label: 'reports.backOffice.financialSummary' },
  { name: 'payment-report', path: '/reports/back-office/payment-report', label: 'reports.backOffice.paymentReport' }
]

// Audit Reports
const auditReports = [
  { name: 'user-activity-log', path: '/reports/audit/user-activity-log', label: 'reports.audit.userActivityLog' },
  { name: 'modification-log', path: '/reports/audit/modification-log', label: 'reports.audit.modificationLog' }
]

// Statistical Reports
const statisticalReports = [
  { name: 'occupancy-reports', path: '/reports/statistical/occupancy-reports', label: 'reports.statistical.occupancyReports' },
  { name: 'adr-report', path: '/reports/statistical/adr-report', label: 'reports.statistical.adrReport' },
  { name: 'revpar-report', path: '/reports/statistical/revpar-report', label: 'reports.statistical.revparReport' },
  { name: 'market-segment-analysis', path: '/reports/statistical/market-segment-analysis', label: 'reports.statistical.marketSegmentAnalysis' },
  { name: 'source-of-business-report', path: '/reports/statistical/source-of-business-report', label: 'reports.statistical.sourceOfBusinessReport' }
]

// Custom Reports
const customReports = [
  { name: 'custom-report-builder', path: '/reports/custom/custom-report-builder', label: 'reports.custom.customReportBuilder' }
]
</script>