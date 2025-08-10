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
        <router-link to="/dashboard" class="flex items-center gap-2">
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
              <div>
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
                      v-for="report in reservationReports" 
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
              <div>
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
                      v-for="report in frontOfficeReports" 
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
              <div>
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
                      v-for="report in backOfficeReports" 
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
              <div>
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
                      v-for="report in auditReports" 
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
              <div>
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
                      v-for="report in statisticalReports" 
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
              <div>
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
                      v-for="report in customReports" 
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
import CalenderIcon from '@/icons/CalenderIcon.vue'
import HomeIcon from '@/icons/HomeIcon.vue'
import BarChartIcon from '@/icons/BarChartIcon.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
import PieChartIcon from '@/icons/PieChartIcon.vue'
import SettingsIcon from '@/icons/SettingsIcon.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'

const route = useRoute()
const { isExpanded, isMobileOpen } = useSidebar()
const isHovered = ref(false)
const searchQuery = ref('')

const openSections = ref({
  reservation: false,
  frontOffice: true, // Default open as shown in the image
  backOffice: false,
  audit: false,
  statistical: false,
  custom: false
})

// Reservation Reports
const reservationReports = ref([
  { name: 'arrival-list', path: '/reports/reservation/arrival-list', label: 'reports.reservation.arrivalList' },
  { name: 'departure-list', path: '/reports/reservation/departure-list', label: 'reports.reservation.departureList' },
  { name: 'confirmed-reservations', path: '/reports/reservation/confirmed-reservations', label: 'reports.reservation.confirmedReservations' },
  { name: 'cancelled-reservations', path: '/reports/reservation/cancelled-reservations', label: 'reports.reservation.cancelledReservations' },
  { name: 'no-show-reservations', path: '/reports/reservation/no-show-reservations', label: 'reports.reservation.noShowReservations' },
  { name: 'reservation-forecast', path: '/reports/reservation/reservation-forecast', label: 'reports.reservation.reservationForecast' }
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
  { name: 'room-service-report', path: '/reports/front-office/room-service-report', label: 'reports.frontOffice.roomServiceReport' },
  { name: 'room-status-report', path: '/reports/front-office/room-status-report', label: 'reports.frontOffice.roomStatusReport' },
  { name: 'task-list-report', path: '/reports/front-office/task-list-report', label: 'reports.frontOffice.taskListReport' }
])

// Back Office Reports
const backOfficeReports = ref([
  { name: 'revenue-reports', path: '/reports/back-office/revenue-reports', label: 'reports.backOffice.revenueReports' },
  { name: 'expense-reports', path: '/reports/back-office/expense-reports', label: 'reports.backOffice.expenseReports' },
  { name: 'accounts-receivable', path: '/reports/back-office/accounts-receivable', label: 'reports.backOffice.accountsReceivable' },
  { name: 'accounts-payable', path: '/reports/back-office/accounts-payable', label: 'reports.backOffice.accountsPayable' },
  { name: 'cashier-reports', path: '/reports/back-office/cashier-reports', label: 'reports.backOffice.cashierReports' },
  { name: 'financial-summary', path: '/reports/back-office/financial-summary', label: 'reports.backOffice.financialSummary' },
  { name: 'payment-report', path: '/reports/back-office/payment-report', label: 'reports.backOffice.paymentReport' }
])

// Audit Reports
const auditReports = ref([
  { name: 'user-activity-log', path: '/reports/audit/user-activity-log', label: 'reports.audit.userActivityLog' },
  { name: 'modification-log', path: '/reports/audit/modification-log', label: 'reports.audit.modificationLog' }
])

// Statistical Reports
const statisticalReports = ref([
  { name: 'occupancy-reports', path: '/reports/statistical/occupancy-reports', label: 'reports.statistical.occupancyReports' },
  { name: 'adr-report', path: '/reports/statistical/adr-report', label: 'reports.statistical.adrReport' },
  { name: 'revpar-report', path: '/reports/statistical/revpar-report', label: 'reports.statistical.revparReport' },
  { name: 'market-segment-analysis', path: '/reports/statistical/market-segment-analysis', label: 'reports.statistical.marketSegmentAnalysis' },
  { name: 'source-of-business-report', path: '/reports/statistical/source-of-business-report', label: 'reports.statistical.sourceOfBusinessReport' }
])

// Custom Reports
const customReports = ref([
  { name: 'custom-report-builder', path: '/reports/custom/custom-report-builder', label: 'reports.custom.customReportBuilder' }
])

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