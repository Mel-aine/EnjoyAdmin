<template>
<!-- @reference tailwindcss -->
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
            v-for="report in filteredReservationReports"
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
            v-for="report in filteredFrontOfficeReports"
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
            v-for="report in filteredBackOfficeReports"
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
            v-for="report in filteredAuditReports"
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
            v-for="report in filteredStatisticalReports"
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
            v-for="report in filteredCustomReports"
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
import { useAuthStore } from '@/composables/user'
import { ref, computed } from 'vue'

const authStore = useAuthStore()


// Mapping des noms de rapports vers les permissions
const reportPermissions = {
  // Reservation Reports
  'arrival-list': 'arrival_list',
  'departure-list': 'departure_list',
  'cancelled-reservations': 'cancelled_reservations',
  'no-show-reservations': 'no_show_reservations',
  'country-wise-reservation-statistics': 'country_wise_reservation_statistics',
  'release-reservation-list': 'release_reservation_list',
  'reservation-activity': 'reservation_activity',
  'void-reservation': 'void_reservations',

  // Front Office Reports
  'guest-checked-in': 'guest_checked_in',
  'guest-checked-out': 'guest_checked_out',
  'guest-list': 'guest_list',
  'guest-message': 'guest_message',
  'inclusion-report': 'inclusion_report',
  'inventory-by-room-type': 'inventory_by_room_type',
  'invoice-breakdown': 'invoice_breakdown',
  'night-audit': 'night_audit',
  'pickup-dropoff': 'pickup_dropoff',
  'room-availability': 'room_availability',
  'room-status-report': 'room_status_report',
  'task-list-report': 'task_list_report',

  // Back Office Reports
  'advance-deposit-ledger': 'advance_deposit_ledger',
  'city-ledger-detail': 'city_ledger_detail',
  'city-ledger-summary': 'city_ledger_summary',
  'daily-extra-charge-detail': 'daily_extra_charge_detail',
  'daily-receipt-detail': 'daily_receipt_detail',
  'daily-receipt-summary': 'daily_receipt_summary',
  'daily-refund-report': 'daily_refund_report',
  'daily-revenue': 'daily_revenue',
  'expense-voucher': 'expense_voucher',
  'folio-list': 'folio_list',
  'guest-ledger': 'guest_ledger',
  'house-status': 'house_status',
  'manager-report': 'manager_report',
  'revenue-by-rate-type': 'revenue_by_rate_type',
  'revenue-by-room-type': 'revenue_by_room_type',
  'travel-agent-commission-detail': 'travel_agent_commission_detail',
  'travel-agent-commission-summary': 'travel_agent_commission_summary',

  // Audit Reports
  'audit-trail': 'audit_trail',
  'ip-report': 'ip_report',
  'void-charge': 'void_charge',
  'void-payment': 'void_payment',
  'void-transaction': 'void_transaction',

  // Statistical Reports
  'business-analysis': 'business_analysis',
  'contribution-analysis-report': 'contribution_analysis_report',
  'monthly-country-wise-pax-analysis': 'monthly_country_wise_pax_analysis',
  'monthly-revenue-by-income-stream': 'monthly_revenue_by_income_stream',
  'monthly-statistics': 'monthly_statistics',
  'monthly-summary': 'monthly_summary',
  'monthly-tax': 'monthly_tax',
  'room-sale-statistics': 'room_sale_statistics',
  'room-statistics': 'room_statistics',
  'room-on-books': 'room_on_books',
  'yearly-statistics': 'yearly_statistics',
  'booking-source-wise-reservation-statistics': 'booking_source_wise_reservation_statistics',
  'channelwise-booking-report': 'channelwise_booking_report',
  'mobile-desktop-wise-reservation-statistics': 'mobile_desktop_wise_reservation_statistics',
  'ota-wise-monthly-breakdown': 'ota_wise_monthly_breakdown',
  'performance-analysis-report': 'performance_analysis_report',

  // Custom Reports
  'monthly-occupancy': 'monthly_occupancy',
  'monthly-revenue': 'monthly_revenue',
  'payment-summary': 'payment_summary',
  'revenue-by-rate-type-summary': 'revenue_by_rate_type_summary',
  'statistics-by-room-type': 'statistics_by_room_type'
}
// Reservation Reports
const reservationReports = ref([
  { name: 'arrival-list', path: '/reports/reservation/arrival-list', label: 'reports.reservation.arrivalList' },
  { name: 'departure-list', path: '/reports/reservation/departure-list', label: 'reports.reservation.departureList' },
  // { name: 'confirmed-reservations', path: '/reports/reservation/confirmed-reservations', label: 'reports.reservation.confirmedReservations' },
  { name: 'cancelled-reservations', path: '/reports/reservation/cancelled-reservations', label: 'reports.reservation.cancelledReservations' },
  { name: 'no-show-reservations', path: '/reports/reservation/no-show-reservations', label: 'reports.reservation.noShowReservations' },
  // { name: 'reservation-forecast', path: '/reports/reservation/reservation-forecast', label: 'reports.reservation.reservationForecast' },
  { name: 'country-wise-reservation-statistics', path: '/reports/reservation/country-wise-reservation-statistics', label: 'reports.reservation.countryWiseReservationStatistics' },
  { name: 'release-reservation-list', path: '/reports/reservation/release-reservation-list', label: 'reports.reservation.releaseReservationList' },
  { name: 'reservation-activity', path: '/reports/reservation/reservation-activity', label: 'reports.reservation.reservationActivity' },
  { name: 'void-reservation', path: '/reports/reservation/void-reservation', label: 'reports.reservation.voidReservation' },
])

// Front Office Reports
const frontOfficeReports = ref([
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
  // { name: 'room-service-report', path: '/reports/front-office/room-service-report', label: 'reports.frontOffice.roomServiceReport' },
  { name: 'room-status-report', path: '/reports/front-office/room-status-report', label: 'reports.frontOffice.roomStatusReport' },
  { name: 'task-list-report', path: '/reports/front-office/task-list-report', label: 'reports.frontOffice.taskListReport' }
])

// Back Office Reports
const backOfficeReports = ref([
 /*   { name: 'revenue-reports', path: '/reports/back-office/revenue-reports', label: 'reports.backOffice.revenueReports' },
  { name: 'expense-reports', path: '/reports/back-office/expense-reports', label: 'reports.backOffice.expenseReports' },
  { name: 'accounts-receivable', path: '/reports/back-office/accounts-receivable', label: 'reports.backOffice.accountsReceivable' },
  { name: 'accounts-payable', path: '/reports/back-office/accounts-payable', label: 'reports.backOffice.accountsPayable' },
  { name: 'cashier-reports', path: '/reports/back-office/cashier-reports', label: 'reports.backOffice.cashierReports' },
  { name: 'financial-summary', path: '/reports/back-office/financial-summary', label: 'reports.backOffice.financialSummary' },
  { name: 'payment-report', path: '/reports/back-office/payment-report', label: 'reports.backOffice.paymentReport' } */
  { name: 'advance-deposit-ledger', path: '/reports/back-office/advance-deposit-ledger', label: 'reports.backOffice.advanceDepositLedger' },
  { name: 'city-ledger-detail', path: '/reports/back-office/city-ledger-detail', label: 'reports.backOffice.cityLedgerDetail' },
  { name: 'city-ledger-summary', path: '/reports/back-office/city-ledger-summary', label: 'reports.backOffice.cityLedgerSummary' },
  { name: 'daily-extra-charge-detail', path: '/reports/back-office/daily-extra-charge-detail', label: 'reports.backOffice.dailyExtraChargeDetail' },
  { name: 'daily-receipt-detail', path: '/reports/back-office/daily-receipt-detail', label: 'reports.backOffice.dailyReceiptDetail' },
  { name: 'daily-receipt-summary', path: '/reports/back-office/daily-receipt-summary', label: 'reports.backOffice.dailyReceiptSummary' },
  { name: 'daily-refund-report', path: '/reports/back-office/daily-refund-report', label: 'reports.backOffice.dailyRefundReport' },
  { name: 'daily-revenue', path: '/reports/back-office/daily-revenue', label: 'reports.backOffice.dailyRevenue' },
  { name: 'expense-voucher', path: '/reports/back-office/expense-voucher', label: 'reports.backOffice.expenseVoucher' },
  { name: 'folio-list', path: '/reports/back-office/folio-list', label: 'reports.backOffice.folioList' },
  { name: 'guest-ledger', path: '/reports/back-office/guest-ledger', label: 'reports.backOffice.guestLedger' },
  { name: 'house-status', path: '/reports/back-office/house-status', label: 'reports.backOffice.houseStatus' },
  { name: 'manager-report', path: '/reports/back-office/manager-report', label: 'reports.backOffice.managerReport' },
  { name: 'revenue-by-rate-type', path: '/reports/back-office/revenue-by-rate-type', label: 'reports.backOffice.revenueByRateType' },
  { name: 'revenue-by-room-type', path: '/reports/back-office/revenue-by-room-type', label: 'reports.backOffice.revenueByRoomType' },
  { name: 'travel-agent-commission-detail', path: '/reports/back-office/travel-agent-commission-detail', label: 'reports.backOffice.travelAgentCommissionDetail' },
  { name: 'travel-agent-commission-summary', path: '/reports/back-office/travel-agent-commission-summary', label: 'reports.backOffice.travelAgentCommissionSummary' }
])

// Audit Reports
const auditReports = ref([
  /*   { name: 'user-activity-log', path: '/reports/audit/user-activity-log', label: 'reports.audit.userActivityLog' },
  { name: 'modification-log', path: '/reports/audit/modification-log', label: 'reports.audit.modificationLog' } */
  { name: 'audit-trail', path: '/reports/audit/audit-trail', label: 'reports.audit.auditTrail' },
  { name: 'ip-report', path: '/reports/audit/ip-report', label: 'reports.audit.ipReport' },
  { name: 'void-charge', path: '/reports/audit/void-charge', label: 'reports.audit.voidCharge' },
  { name: 'void-payment', path: '/reports/audit/void-payment', label: 'reports.audit.voidPayment' },
  { name: 'void-transaction', path: '/reports/audit/void-transaction', label: 'reports.audit.voidTransaction' },
])

// Statistical Reports
const statisticalReports = ref([
    /* { name: 'occupancy-reports', path: '/reports/statistical/occupancy-reports', label: 'reports.statistical.occupancyReports' },
  { name: 'adr-report', path: '/reports/statistical/adr-report', label: 'reports.statistical.adrReport' },
  { name: 'revpar-report', path: '/reports/statistical/revpar-report', label: 'reports.statistical.revparReport' },
  { name: 'market-segment-analysis', path: '/reports/statistical/market-segment-analysis', label: 'reports.statistical.marketSegmentAnalysis' },
  { name: 'source-of-business-report', path: '/reports/statistical/source-of-business-report', label: 'reports.statistical.sourceOfBusinessReport' }, */
  { name: 'business-analysis', path: '/reports/statistical/business-analysis', label: 'reports.statistical.businessAnalysis' },
  { name: 'contribution-analysis-report', path: '/reports/statistical/contribution-analysis-report', label: 'reports.statistical.contributionAnalysisReport' },
  { name: 'monthly-country-wise-pax-analysis', path: '/reports/statistical/monthly-country-wise-pax-analysis', label: 'reports.statistical.monthlyCountryWisePaxAnalysis' },
  { name: 'monthly-revenue-by-income-stream', path: '/reports/statistical/monthly-revenue-by-income-stream', label: 'reports.statistical.monthlyRevenueByIncomeStream' },
  { name: 'monthly-statistics', path: '/reports/statistical/monthly-statistics', label: 'reports.statistical.monthlyStatistics' },
  { name: 'monthly-summary', path: '/reports/statistical/monthly-summary', label: 'reports.statistical.monthlySummary' },
  { name: 'monthly-tax', path: '/reports/statistical/monthly-tax', label: 'reports.statistical.monthlyTax' },
  { name: 'room-sale-statistics', path: '/reports/statistical/room-sale-statistics', label: 'reports.statistical.roomSaleStatistics' },
  { name: 'room-statistics', path: '/reports/statistical/room-statistics', label: 'reports.statistical.roomStatistics' },
  { name: 'room-on-books', path: '/reports/statistical/room-on-books', label: 'reports.statistical.roomOnBooks' },
  { name: 'yearly-statistics', path: '/reports/statistical/yearly-statistics', label: 'reports.statistical.yearlyStatistics' },
  { name: 'booking-source-wise-reservation-statistics', path: '/reports/statistical/booking-source-wise-reservation-statistics', label: 'reports.statistical.bookingSourceWiseReservationStatistics' },
  { name: 'channelwise-booking-report', path: '/reports/statistical/channelwise-booking-report', label: 'reports.statistical.channelwiseBookingReport' },
  { name: 'mobile-desktop-wise-reservation-statistics', path: '/reports/statistical/mobile-desktop-wise-reservation-statistics', label: 'reports.statistical.mobileDesktopWiseReservationStatistics' },
  { name: 'ota-wise-monthly-breakdown', path: '/reports/statistical/ota-wise-monthly-breakdown', label: 'reports.statistical.otaWiseMonthlyBreakdown' },
  { name: 'performance-analysis-report', path: '/reports/statistical/performance-analysis-report', label: 'reports.statistical.performanceAnalysisReport' }
])

// Custom Reports
const customReports = ref([
  { name: 'monthly-occupancy', path: '/reports/custom/monthly-occupancy', label: 'reports.custom.monthlyOccupancy' },
  { name: 'monthly-revenue', path: '/reports/custom/monthly-revenue', label: 'reports.custom.monthlyRevenue' },
  { name: 'payment-summary', path: '/reports/custom/payment-summary', label: 'reports.custom.paymentSummary' },
  { name: 'revenue-by-rate-type-summary', path: '/reports/custom/revenue-by-rate-type-summary', label: 'reports.custom.revenueByRateTypeSummary' },
  { name: 'statistics-by-room-type', path: '/reports/custom/statistics-by-room-type', label: 'reports.custom.statisticsByRoomType' }
])


// Computed properties pour filtrer les rapports selon les permissions
const filteredReservationReports = computed(() => {
  return reservationReports.value.filter(report => {
    const permission = reportPermissions[report.name as keyof typeof reportPermissions]
    return permission ? authStore.hasReportPermission(permission) : false
  })
})

const filteredFrontOfficeReports = computed(() => {
  return frontOfficeReports.value.filter(report => {
    const permission = reportPermissions[report.name as keyof typeof reportPermissions]
    return permission ? authStore.hasReportPermission(permission) : false
  })
})

const filteredBackOfficeReports = computed(() => {
  return backOfficeReports.value.filter(report => {
    const permission = reportPermissions[report.name as keyof typeof reportPermissions]
    return permission ? authStore.hasReportPermission(permission) : false
  })
})

const filteredAuditReports = computed(() => {
  return auditReports.value.filter(report => {
    const permission = reportPermissions[report.name as keyof typeof reportPermissions]
    return permission ? authStore.hasReportPermission(permission) : false
  })
})

const filteredStatisticalReports = computed(() => {
  return statisticalReports.value.filter(report => {
    const permission = reportPermissions[report.name as keyof typeof reportPermissions]
    return permission ? authStore.hasReportPermission(permission) : false
  })
})

const filteredCustomReports = computed(() => {
  return customReports.value.filter(report => {
    const permission = reportPermissions[report.name as keyof typeof reportPermissions]
    return permission ? authStore.hasReportPermission(permission) : false
  })
})
</script>
