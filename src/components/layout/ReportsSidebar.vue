<template>
  <aside>
    <div :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]">

      <!-- Header avec logo - position fixe -->
      <div :class="[
        'pt-4 pb-4 flex-shrink-0',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]">
        <router-link to="/front-office/dashboard" class="flex items-center gap-2">
          <img v-if="isExpanded || isHovered || isMobileOpen"
            class="dark:hidden rounded-full w-10"
            src="/src/assets/images/header/logo2.png"
            alt="Logo" />
          <img v-if="isExpanded || isHovered || isMobileOpen"
            class="hidden dark:block rounded-full w-10"
            src="/src/assets/images/header/logo2.png"
            alt="Logo" />
          <img v-else
            class="rounded-full w-10"
            src="/src/assets/images/header/logo2.png"
            alt="Logo" />
          <span v-if="isExpanded || isHovered || isMobileOpen"
            class="inline-flex text-xl text-gray-900 font-bold flex-wrap">
            {{ $t('reports.title') }}
          </span>
        </router-link>
      </div>

      <!-- Zone de navigation scrollable -->
      <div class="flex-1 overflow-hidden"
        @mouseenter="!isExpanded && (isHovered = true)"
        @mouseleave="isHovered = false">

        <nav class="h-full overflow-y-auto sidebar-scroll px-2 py-2">
          <div class="flex flex-col gap-2 pb-6">

            <!-- Search Bar -->
            <div v-if="isExpanded || isHovered || isMobileOpen" class="mb-4">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="$t('Searchortypecommand')"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                <svg class="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Reports Menu -->
            <div class="space-y-2">

              <!-- Reservation Report -->
              <div v-if="filteredReservationReports.length > 0">
                <button
                  @click="toggleSection('reservation')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.reservation,
                      'menu-item-inactive': !openSections.reservation,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">

                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('reports.reservation.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.reservation,
                      },
                    ]" />
                </button>

                <transition name="slide-down">
                  <div v-show="openSections.reservation && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link
                      v-for="report in filteredReservationReports"
                      :key="report.path"
                      :to="report.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(report.path),
                          'menu-dropdown-item-inactive': !isActive(report.path),
                        },
                      ]">
                      {{ $t(report.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Front Office Report -->
              <div v-if="filteredFrontOfficeReports.length > 0">
                <button
                  @click="toggleSection('frontOffice')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.frontOffice,
                      'menu-item-inactive': !openSections.frontOffice,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('reports.frontOffice.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.frontOffice,
                      },
                    ]" />
                </button>

                <transition name="slide-down">
                  <div v-show="openSections.frontOffice && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link
                      v-for="report in filteredFrontOfficeReports"
                      :key="report.path"
                      :to="report.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(report.path),
                          'menu-dropdown-item-inactive': !isActive(report.path),
                        },
                      ]">
                      {{ $t(report.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Back Office Report -->
              <div v-if="filteredBackOfficeReports.length > 0">
                <button
                  @click="toggleSection('backOffice')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.backOffice,
                      'menu-item-inactive': !openSections.backOffice,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">

                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('reports.backOffice.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.backOffice,
                      },
                    ]" />
                </button>

                <transition name="slide-down">
                  <div v-show="openSections.backOffice && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link
                      v-for="report in filteredBackOfficeReports"
                      :key="report.path"
                      :to="report.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(report.path),
                          'menu-dropdown-item-inactive': !isActive(report.path),
                        },
                      ]">
                      {{ $t(report.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Audit Report -->
              <div v-if="filteredAuditReports.length > 0">
                <button
                  @click="toggleSection('audit')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.audit,
                      'menu-item-inactive': !openSections.audit,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">

                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('reports.audit.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.audit,
                      },
                    ]" />
                </button>

                <transition name="slide-down">
                  <div v-show="openSections.audit && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link
                      v-for="report in filteredAuditReports"
                      :key="report.path"
                      :to="report.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(report.path),
                          'menu-dropdown-item-inactive': !isActive(report.path),
                        },
                      ]">
                      {{ $t(report.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Statistical Report -->
              <div v-if="filteredStatisticalReports.length > 0">
                <button
                  @click="toggleSection('statistical')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.statistical,
                      'menu-item-inactive': !openSections.statistical,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">

                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('reports.statistical.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.statistical,
                      },
                    ]" />
                </button>

                <transition name="slide-down">
                  <div v-show="openSections.statistical && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link
                      v-for="report in filteredStatisticalReports"
                      :key="report.path"
                      :to="report.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(report.path),
                          'menu-dropdown-item-inactive': !isActive(report.path),
                        },
                      ]">
                      {{ $t(report.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Custom Report -->
              <div v-if="filteredCustomReports.length > 0">
                <button
                  @click="toggleSection('custom')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.custom,
                      'menu-item-inactive': !openSections.custom,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">

                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('reports.custom.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.custom,
                      },
                    ]" />
                </button>

                <transition name="slide-down">
                  <div v-show="openSections.custom && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link
                      v-for="report in filteredCustomReports"
                      :key="report.path"
                      :to="report.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(report.path),
                          'menu-dropdown-item-inactive': !isActive(report.path),
                        },
                      ]">
                      {{ $t(report.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

            </div>
          </div>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import { useAuthStore } from '@/composables/user'
import CalenderIcon from '@/icons/CalenderIcon.vue'
import HomeIcon from '@/icons/HomeIcon.vue'
import BarChartIcon from '@/icons/BarChartIcon.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
import PieChartIcon from '@/icons/PieChartIcon.vue'
import SettingsIcon from '@/icons/SettingsIcon.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'

const route = useRoute()
const { isExpanded, isMobileOpen } = useSidebar()
const authStore = useAuthStore()
const isHovered = ref(false)
const searchQuery = ref('')

const openSections = ref<any>({
  reservation: false,
  frontOffice: true, // Default open as shown in the image
  backOffice: false,
  audit: false,
  statistical: false,
  custom: false
})

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
  { name: 'arrival-list', path: '/reports/reservation/arrival-list', label: 'reports.reservation.arrivalList'  },
  { name: 'departure-list', path: '/reports/reservation/departure-list', label: 'reports.reservation.departureList' },
  { name: 'cancelled-reservations', path: '/reports/reservation/cancelled-reservations', label: 'reports.reservation.cancelledReservations' },
  { name: 'no-show-reservations', path: '/reports/reservation/no-show-reservations', label: 'reports.reservation.noShowReservations' },
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
  { name: 'room-status-report', path: '/reports/front-office/room-status-report', label: 'reports.frontOffice.roomStatusReport' },
  { name: 'task-list-report', path: '/reports/front-office/task-list-report', label: 'reports.frontOffice.taskListReport' }
])

// Back Office Reports
const backOfficeReports = ref([
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
  { name: 'audit-trail', path: '/reports/audit/audit-trail', label: 'reports.audit.auditTrail' },
  { name: 'ip-report', path: '/reports/audit/ip-report', label: 'reports.audit.ipReport' },
  { name: 'void-charge', path: '/reports/audit/void-charge', label: 'reports.audit.voidCharge' },
  { name: 'void-payment', path: '/reports/audit/void-payment', label: 'reports.audit.voidPayment' },
  { name: 'void-transaction', path: '/reports/audit/void-transaction', label: 'reports.audit.voidTransaction' },
])

// Statistical Reports
const statisticalReports = ref([
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

const toggleSection = (section: string) => {
  openSections.value[section] = !openSections.value[section]
}

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>

.menu-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer;
}

.menu-item-active {
  @apply bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300;
}

.menu-item-inactive {
  @apply text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white;
}

.menu-item-icon-active {
  @apply text-purple-600 dark:text-purple-400;
}

.menu-item-icon-inactive {
  @apply text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200;
}

.menu-item-text {
  @apply font-medium;
}

.menu-dropdown-item {
  @apply px-3 py-2 rounded-md transition-all duration-200 cursor-pointer;
}

.menu-dropdown-item-active {
  @apply bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300;
}

.menu-dropdown-item-inactive {
  @apply text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white;
}

.sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
