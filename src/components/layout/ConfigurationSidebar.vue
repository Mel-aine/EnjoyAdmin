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
            {{ $t('configuration.title') }}
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

            <!-- Configuration Menu -->
            <div class="space-y-2">
              
              <!-- Rooms Configuration -->
              <div>
                <button 
                  @click="toggleSection('rooms')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.rooms,
                      'menu-item-inactive': !openSections.rooms,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">
                  
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('configuration.rooms.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.rooms,
                      },
                    ]" />
                </button>
                
                <transition name="slide-down">
                  <div v-show="openSections.rooms && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link 
                      v-for="item in roomsConfig" 
                      :key="item.path"
                      :to="item.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(item.path),
                          'menu-dropdown-item-inactive': !isActive(item.path),
                        },
                      ]">
                      {{ $t(item.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Rates Configuration -->
              <div>
                <button 
                  @click="toggleSection('rates')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.rates,
                      'menu-item-inactive': !openSections.rates,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">
                  
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('configuration.rates.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.rates,
                      },
                    ]" />
                </button>
                
                <transition name="slide-down">
                  <div v-show="openSections.rates && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link 
                      v-for="item in ratesConfig" 
                      :key="item.path"
                      :to="item.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(item.path),
                          'menu-dropdown-item-inactive': !isActive(item.path),
                        },
                      ]">
                      {{ $t(item.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Housekeeping Configuration -->
              <div>
                <button 
                  @click="toggleSection('housekeeping')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.housekeeping,
                      'menu-item-inactive': !openSections.housekeeping,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">
                  
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('configuration.housekeeping.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.housekeeping,
                      },
                    ]" />
                </button>
                
                <transition name="slide-down">
                  <div v-show="openSections.housekeeping && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link 
                      v-for="item in housekeepingConfig" 
                      :key="item.path"
                      :to="item.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(item.path),
                          'menu-dropdown-item-inactive': !isActive(item.path),
                        },
                      ]">
                      {{ $t(item.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Master Configuration -->
              <div>
                <button 
                  @click="toggleSection('master')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.master,
                      'menu-item-inactive': !openSections.master,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">
                  
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('configuration.master.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.master,
                      },
                    ]" />
                </button>
                
                <transition name="slide-down">
                  <div v-show="openSections.master && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link 
                      v-for="item in masterConfig" 
                      :key="item.path"
                      :to="item.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(item.path),
                          'menu-dropdown-item-inactive': !isActive(item.path),
                        },
                      ]">
                      {{ $t(item.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Settings Configuration -->
              <div>
                <button 
                  @click="toggleSection('settings')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.settings,
                      'menu-item-inactive': !openSections.settings,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">
                 
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('configuration.settings.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.settings,
                      },
                    ]" />
                </button>
                
                <transition name="slide-down">
                  <div v-show="openSections.settings && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link 
                      v-for="item in settingsConfig" 
                      :key="item.path"
                      :to="item.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(item.path),
                          'menu-dropdown-item-inactive': !isActive(item.path),
                        },
                      ]">
                      {{ $t(item.label) }}
                    </router-link>
                  </div>
                </transition>
              </div>

              <!-- Channel Manager Configuration -->
              <div>
                <button 
                  @click="toggleSection('channelManager')"
                  :class="[
                    'menu-item group text-sm w-full',
                    {
                      'menu-item-active': openSections.channelManager,
                      'menu-item-inactive': !openSections.channelManager,
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]">
                 
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ $t('configuration.channelManager.title') }}
                  </span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': openSections.channelManager,
                      },
                    ]" />
                </button>
                
                <transition name="slide-down">
                  <div v-show="openSections.channelManager && (isExpanded || isHovered || isMobileOpen)" class="ml-9 mt-2 space-y-1">
                    <router-link 
                      v-for="item in channelManagerConfig" 
                      :key="item.path"
                      :to="item.path"
                      :class="[
                        'menu-dropdown-item text-sm flex items-center gap-2',
                        {
                          'menu-dropdown-item-active': isActive(item.path),
                          'menu-dropdown-item-inactive': !isActive(item.path),
                        },
                      ]">
                      {{ $t(item.label) }}
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
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'

const route = useRoute()
const { isExpanded, isMobileOpen } = useSidebar()
const isHovered = ref(false)
const searchQuery = ref('')

const openSections = ref<any>({
  rooms: false,
  rates: false,
  housekeeping: false,
  master: true, // Default open
  settings: false,
  channelManager: false
})

// Rooms Configuration
const roomsConfig = ref([
  { name: 'amenities', path: '/configuration/rooms/amenities', label: 'configuration.rooms.amenities' },
  { name: 'room-type', path: '/configuration/rooms/room-type', label: 'configuration.rooms.roomType' },
  { name: 'sort-room-types', path: '/configuration/rooms/sort-room-types', label: 'configuration.rooms.sortRoomTypes' },
  { name: 'bed-type', path: '/configuration/rooms/bed-type', label: 'configuration.rooms.bedType' },
  { name: 'room', path: '/configuration/rooms/room', label: 'configuration.rooms.room' },
  { name: 'sort-room', path: '/configuration/rooms/sort-room', label: 'configuration.rooms.sortRoom' },
  { name: 'status-color', path: '/configuration/rooms/status-color', label: 'configuration.rooms.statusColor' },
  { name: 'room-owner', path: '/configuration/rooms/room-owner', label: 'configuration.rooms.roomOwner' }
])

// Rates Configuration
const ratesConfig = ref([
  { name: 'rate-type', path: '/configuration/rates/rate-type', label: 'configuration.rates.rateType' },
  { name: 'season', path: '/configuration/rates/season', label: 'configuration.rates.season' },
  { name: 'room-rates', path: '/configuration/rates/room-rates', label: 'configuration.rates.roomRates' },
  { name: 'taxes', path: '/configuration/rates/taxes', label: 'configuration.rates.taxes' },
  { name: 'sort-rates', path: '/configuration/rates/sort-rates', label: 'configuration.rates.sortRates' }
])

// Housekeeping Configuration
const housekeepingConfig = ref([
  { name: 'housekeepers', path: '/configuration/housekeeping/housekeepers', label: 'configuration.housekeeping.housekeepers' },
  { name: 'units', path: '/configuration/housekeeping/units', label: 'configuration.housekeeping.units' },
  { name: 'status', path: '/configuration/housekeeping/status', label: 'configuration.housekeeping.status' }
])

// Master Configuration
const masterConfig = ref([
  { name: 'currency', path: '/configuration/master/currency', label: 'configuration.master.currency' },
  { name: 'pay-method', path: '/configuration/master/pay-method', label: 'configuration.master.payMethod' },
  { name: 'extra-charge', path: '/configuration/master/extra-charge', label: 'configuration.master.extraCharge' },
  { name: 'identity-type', path: '/configuration/master/identity-type', label: 'configuration.master.identityType' },
  { name: 'reason', path: '/configuration/master/reason', label: 'configuration.master.reason' },
  { name: 'discounts', path: '/configuration/master/discounts', label: 'configuration.master.discounts' },
  { name: 'transportation-mode', path: '/configuration/master/transportation-mode', label: 'configuration.master.transportationMode' },
  { name: 'payouts', path: '/configuration/master/payouts', label: 'configuration.master.payouts' },
  { name: 'template-category', path: '/configuration/master/template-category', label: 'configuration.master.templateCategory' },
  { name: 'template', path: '/configuration/master/template', label: 'configuration.master.template' },
  { name: 'black-list-reason', path: '/configuration/master/black-list-reason', label: 'configuration.master.blackListReason' },
  { name: 'market-code', path: '/configuration/master/market-code', label: 'configuration.master.marketCode' },
  { name: 'reservation-type', path: '/configuration/master/reservation-type', label: 'configuration.master.reservationType' },
  { name: 'preference-type', path: '/configuration/master/preference-type', label: 'configuration.master.preferenceType' },
  { name: 'preference', path: '/configuration/master/preference', label: 'configuration.master.preference' },
  { name: 'vip-status', path: '/configuration/master/vip-status', label: 'configuration.master.vipStatus' },
  { name: 'business-source', path: '/configuration/master/business-source', label: 'configuration.master.businessSource' }
])

// Settings Configuration
const settingsConfig = ref([
  { name: 'email-account', path: '/configuration/settings/email-account', label: 'configuration.settings.emailAccount' },
  { name: 'hotel-information', path: '/configuration/settings/hotel-information', label: 'configuration.settings.hotelInformation' },
  { name: 'formula', path: '/configuration/settings/formula', label: 'configuration.settings.formula' },
  { name: 'notices', path: '/configuration/settings/notices', label: 'configuration.settings.notices' },
  { name: 'document-numbering', path: '/configuration/settings/document-numbering', label: 'configuration.settings.documentNumbering' },
  { name: 'print-and-email-settings', path: '/configuration/settings/print-and-email-settings', label: 'configuration.settings.printAndEmailSettings' },
  { name: 'check-in-and-reservation-settings', path: '/configuration/settings/check-in-and-reservation-settings', label: 'configuration.settings.checkInAndReservationSettings' },
  { name: 'display-settings', path: '/configuration/settings/display-settings', label: 'configuration.settings.displaySettings' },
  { name: 'pagination-settings', path: '/configuration/settings/pagination-settings', label: 'configuration.settings.paginationSettings' }
])

// Channel Manager Configuration
const channelManagerConfig = ref([
  { name: 'overview', path: '/configuration/channel-manager', label: 'configuration.channelManager.title' },
  { name: 'connections', path: '/configuration/channel-manager/connections', label: 'configuration.channelManager.connections.title' },
  { name: 'mapping', path: '/configuration/channel-manager/mapping', label: 'configuration.channelManager.mapping.title' },
  { name: 'rates-inventory', path: '/configuration/channel-manager/rates-inventory', label: 'configuration.channelManager.ratesInventory.title' },
  { name: 'sync-settings', path: '/configuration/channel-manager/sync-settings', label: 'configuration.channelManager.syncSettings.title' },
  { name: 'logs', path: '/configuration/channel-manager/logs', label: 'configuration.channelManager.logs.title' }
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

.menu-dropdown-item {
  @apply block px-3 py-2 rounded-md transition-colors duration-200;
}

.menu-dropdown-item-active {
  @apply bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200;
}

.menu-dropdown-item-inactive {
  @apply text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

.sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}
</style>