<template>
  <div :class="[
    'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
    sidebarStore.isExpanded ? 'w-64' : 'w-16',
    sidebarStore.isMobileOpen ? 'translate-x-0' : '-translate-x-full',
    'lg:translate-x-0'
  ]">
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div v-if="sidebarStore.isExpanded" class="flex items-center space-x-2">
        <Settings class="w-6 h-6 text-blue-600" />
        <h2 class="text-lg font-semibold text-gray-900">Configuration</h2>
      </div>
      <button @click="sidebarStore.toggleSidebar()" class="p-1 rounded-md hover:bg-gray-100 lg:hidden">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Search Bar -->
    <div v-if="sidebarStore.isExpanded" class="p-4 border-b border-gray-200">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search configuration..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
      </div>
    </div>

    <!-- Navigation -->
    <nav 
      ref="navElement" 
      class="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
      @scroll="handleScroll"
    >
      <!-- Rooms Section -->
      <div class="space-y-1">
        <button 
          @click="toggleSection('rooms')" 
          :class="[
            'w-full flex items-center justify-between p-2 text-left rounded-md hover:bg-gray-100 transition-colors',
            sidebarStore.isExpanded ? 'px-3' : 'px-2 justify-center'
          ]"
        >
          <div class="flex items-center space-x-3">
            <Home class="w-5 h-5 text-gray-600" />
            <span v-if="sidebarStore.isExpanded" class="text-sm font-medium text-gray-900">Rooms</span>
          </div>
          <ChevronDown 
            v-if="sidebarStore.isExpanded" 
            :class="[
              'w-4 h-4 text-gray-400 transition-transform',
              expandedSections.rooms ? 'rotate-180' : ''
            ]" 
          />
        </button>

        <div v-if="expandedSections.rooms && sidebarStore.isExpanded" class="ml-6 space-y-1">
          <router-link 
            v-for="item in filteredRoomsItems" 
            :key="item.path" 
            :to="item.path"
            class="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            active-class="text-gray-900 bg-gray-200 font-medium"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- Rates Section -->
      <div class="space-y-1">
        <button 
          @click="toggleSection('rates')" 
          :class="[
            'w-full flex items-center justify-between p-2 text-left rounded-md hover:bg-gray-100 transition-colors',
            sidebarStore.isExpanded ? 'px-3' : 'px-2 justify-center'
          ]"
        >
          <div class="flex items-center space-x-3">
            <DollarSign class="w-5 h-5 text-gray-600" />
            <span v-if="sidebarStore.isExpanded" class="text-sm font-medium text-gray-900">Rates</span>
          </div>
          <ChevronDown 
            v-if="sidebarStore.isExpanded" 
            :class="[
              'w-4 h-4 text-gray-400 transition-transform',
              expandedSections.rates ? 'rotate-180' : ''
            ]" 
          />
        </button>

        <div v-if="expandedSections.rates && sidebarStore.isExpanded" class="ml-6 space-y-1">
          <router-link 
            v-for="item in filteredRatesItems" 
            :key="item.path" 
            :to="item.path"
            class="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            active-class="text-gray-900 bg-gray-200 font-medium"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- Housekeeping Section -->
      <div class="space-y-1">
        <button 
          @click="toggleSection('housekeeping')" 
          :class="[
            'w-full flex items-center justify-between p-2 text-left rounded-md hover:bg-gray-100 transition-colors',
            sidebarStore.isExpanded ? 'px-3' : 'px-2 justify-center'
          ]"
        >
          <div class="flex items-center space-x-3">
            <Users class="w-5 h-5 text-gray-600" />
            <span v-if="sidebarStore.isExpanded" class="text-sm font-medium text-gray-900">Housekeeping</span>
          </div>
          <ChevronDown 
            v-if="sidebarStore.isExpanded" 
            :class="[
              'w-4 h-4 text-gray-400 transition-transform',
              expandedSections.housekeeping ? 'rotate-180' : ''
            ]" 
          />
        </button>

        <div v-if="expandedSections.housekeeping && sidebarStore.isExpanded" class="ml-6 space-y-1">
          <router-link 
            v-for="item in filteredHousekeepingItems" 
            :key="item.path" 
            :to="item.path"
            class="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            active-class="text-gray-900 bg-gray-200 font-medium"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- Master Section -->
      <div class="space-y-1">
        <button 
          @click="toggleSection('master')" 
          :class="[
            'w-full flex items-center justify-between p-2 text-left rounded-md hover:bg-gray-100 transition-colors',
            sidebarStore.isExpanded ? 'px-3' : 'px-2 justify-center'
          ]"
        >
          <div class="flex items-center space-x-3">
            <Database class="w-5 h-5 text-gray-600" />
            <span v-if="sidebarStore.isExpanded" class="text-sm font-medium text-gray-900">Master</span>
          </div>
          <ChevronDown 
            v-if="sidebarStore.isExpanded" 
            :class="[
              'w-4 h-4 text-gray-400 transition-transform',
              expandedSections.master ? 'rotate-180' : ''
            ]" 
          />
        </button>

        <div v-if="expandedSections.master && sidebarStore.isExpanded" class="ml-6 space-y-1">
          <router-link 
            v-for="item in filteredMasterItems" 
            :key="item.path" 
            :to="item.path"
            class="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            active-class="text-gray-900 bg-gray-200 font-medium"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- Settings Section -->
      <div class="space-y-1">
        <button 
          @click="toggleSection('settings')" 
          :class="[
            'w-full flex items-center justify-between p-2 text-left rounded-md hover:bg-gray-100 transition-colors',
            sidebarStore.isExpanded ? 'px-3' : 'px-2 justify-center'
          ]"
        >
          <div class="flex items-center space-x-3">
            <Cog class="w-5 h-5 text-gray-600" />
            <span v-if="sidebarStore.isExpanded" class="text-sm font-medium text-gray-900">Settings</span>
          </div>
          <ChevronDown 
            v-if="sidebarStore.isExpanded" 
            :class="[
              'w-4 h-4 text-gray-400 transition-transform',
              expandedSections.settings ? 'rotate-180' : ''
            ]" 
          />
        </button>

        <div v-if="expandedSections.settings && sidebarStore.isExpanded" class="ml-6 space-y-1">
          <router-link 
            v-for="item in filteredSettingsItems" 
            :key="item.path" 
            :to="item.path"
            class="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            active-class="text-gray-900 bg-gray-200 font-medium"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- Staff Section -->
      <div class="space-y-1">
        <button 
          @click="toggleSection('staff')" 
          :class="[
            'w-full flex items-center justify-between p-2 text-left rounded-md hover:bg-gray-100 transition-colors',
            sidebarStore.isExpanded ? 'px-3' : 'px-2 justify-center'
          ]"
        >
          <div class="flex items-center space-x-3">
            <UserCircle class="w-5 h-5 text-gray-600" />
            <span v-if="sidebarStore.isExpanded" class="text-sm font-medium text-gray-900">Staff</span>
          </div>
          <ChevronDown 
            v-if="sidebarStore.isExpanded" 
            :class="[
              'w-4 h-4 text-gray-400 transition-transform',
              expandedSections.staff ? 'rotate-180' : ''
            ]" 
          />
        </button>

        <div v-if="expandedSections.staff && sidebarStore.isExpanded" class="ml-6 space-y-1">
          <router-link 
            v-for="item in filteredStaffItems" 
            :key="item.path" 
            :to="item.path"
            class="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            active-class="text-gray-900 bg-gray-200 font-medium"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import {
  Settings,
  X,
  Search,
  Home,
  DollarSign,
  Users,
  Database,
  Cog,
  ChevronDown,
  UserCircle,
} from 'lucide-vue-next'

// Types
interface MenuItem {
  path: string
  label: string
}

type SectionKey = 'rooms' | 'rates' | 'housekeeping' | 'master' | 'settings' | 'staff'

interface ExpandedSections {
  rooms: boolean
  rates: boolean
  housekeeping: boolean
  master: boolean
  settings: boolean
  staff: boolean
}

const sidebarStore = useSidebar()
const searchQuery = ref('')
const route = useRoute()
const navElement = ref<HTMLElement | null>(null)

const expandedSections = ref<ExpandedSections>({
  rooms: true,
  rates: true,
  housekeeping: true,
  master: true,
  settings: true,
  staff: true
})

// Handler for scroll event with proper typing
const handleScroll = (): void => {
  if (navElement.value) {
    const scrollTop = navElement.value.scrollTop ?? 0
    sidebarStore.saveScrollPosition(scrollTop)
  }
}

// Save scroll position before route change
const handleBeforeRouteChange = (): void => {
  if (navElement.value) {
    const scrollTop = navElement.value.scrollTop ?? 0
    sidebarStore.saveScrollPosition(scrollTop)
  }
}

// Restore scroll position after route change
const restoreScrollPosition = (): void => {
  if (navElement.value) {
    const savedPosition = sidebarStore.getScrollPosition()
    navElement.value.scrollTop = savedPosition
  }
}

// Handle global clicks with proper event typing
const handleGlobalClick = (event: MouseEvent): void => {
  const target = event.target as HTMLElement
  const link = target.closest('a')
  
  if (link?.getAttribute('href')?.startsWith('/configuration/')) {
    handleBeforeRouteChange()
  }
}

// Toggle section with type-safe parameter
const toggleSection = (section: SectionKey): void => {
  expandedSections.value[section] = !expandedSections.value[section]
  
  // Save state to localStorage
  localStorage.setItem('sidebar-expanded-sections', JSON.stringify(expandedSections.value))
  
  // Restore position after animation
  if (expandedSections.value[section]) {
    setTimeout(restoreScrollPosition, 300)
  }
}

// Component lifecycle
onMounted(() => {
  // Restore expanded sections from localStorage
  const savedSections = localStorage.getItem('sidebar-expanded-sections')
  if (savedSections) {
    try {
      const parsed = JSON.parse(savedSections) as ExpandedSections
      expandedSections.value = parsed
    } catch (error) {
      console.error('Failed to parse saved sections:', error)
    }
  }
  
  // Restore scroll position on initial load
  restoreScrollPosition()
  
  // Add global click listener
  document.addEventListener('click', handleGlobalClick)
})

// Cleanup event listeners
onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick)
})

// Watch for route changes
watch(() => route.path, () => {
  handleBeforeRouteChange()
  setTimeout(restoreScrollPosition, 0)
})

// Menu items configuration
const roomsItems: MenuItem[] = [
  { path: '/configuration/rooms/amenities', label: 'Amenities' },
  { path: '/configuration/rooms/room-type', label: 'Room Type' },
  { path: '/configuration/rooms/set-room-types', label: 'Set Room Types' },
  { path: '/configuration/rooms/bed-type', label: 'Bed Type' },
  { path: '/configuration/rooms/room-floor', label: 'Room Floor' },
  { path: '/configuration/rooms/status-color', label: 'Status Color' },
  { path: '/configuration/rooms/room-owner', label: 'Room Owner' }
]

const ratesItems: MenuItem[] = [
  { path: '/configuration/rates/rate-type', label: 'Rate Type' },
  { path: '/configuration/rates/season', label: 'Season' },
  { path: '/configuration/rates/room-rates', label: 'Room Rates' },
  { path: '/configuration/rates/taxes', label: 'Taxes' },
  { path: '/configuration/rates/set-offers', label: 'Set Offers' },
  { path: '/configuration/rates/meal-plan-builder', label: 'Meal Plan' }
]

const housekeepingItems: MenuItem[] = [
  { path: '/configuration/housekeeping/housekeepers', label: 'Housekeepers' },
  { path: '/configuration/housekeeping/units', label: 'Units' },
  { path: '/configuration/housekeeping/status', label: 'Status' }
]

const masterItems: MenuItem[] = [
  { path: '/configuration/master/currency', label: 'Currency' },
  { path: '/configuration/master/pay-method', label: 'Pay Method' },
  { path: '/configuration/master/extra-charge', label: 'Extra Charge' },
  { path: '/configuration/master/identity-type', label: 'Identity Type' },
  { path: '/configuration/master/reason', label: 'Reason' },
  { path: '/configuration/master/discounts', label: 'Discounts' },
  { path: '/configuration/master/transportation-mode', label: 'Transportation Mode' },
  { path: '/configuration/master/payouts', label: 'Payouts' },
  { path: '/configuration/master/template-category', label: 'Template Category' },
  { path: '/configuration/master/template', label: 'Template' },
  { path: '/configuration/master/black-list-reason', label: 'Black List Reason' },
  { path: '/configuration/master/market-code', label: 'Market Code' },
  { path: '/configuration/master/reservation-type', label: 'Reservation Type' },
  { path: '/configuration/master/preference-type', label: 'Preference Type' },
  { path: '/configuration/master/preference', label: 'Preference' },
  { path: '/configuration/master/vip-status', label: 'vip status' },
  { path: '/configuration/master/business-source', label: 'Business Source' }
]

const settingsItems: MenuItem[] = [
  { path: '/configuration/settings/email-accounts', label: 'Email Accounts' },
  { path: '/configuration/settings/hotel-information', label: 'Hotel Information' },
  { path: '/configuration/settings/formula', label: 'Formula' },
  { path: '/configuration/settings/notices', label: 'Notices' },
  { path: '/configuration/settings/document-numbering', label: 'Document Numbering' },
  { path: '/configuration/settings/print-and-email-settings', label: 'Print and Email Settings' },
  { path: '/configuration/settings/check-in-and-reservation-settings', label: 'Check In and Reservation Settings' },
  { path: '/configuration/settings/display-settings', label: 'Display Settings' },
  { path: '/configuration/settings/registration-settings', label: 'Registration Settings' }
]

const staffItems: MenuItem[] = [
  { path: '/configuration/staff/department', label: 'Department' },
  { path: '/configuration/staff/staff_management', label: 'Staff Management' },
  { path: '/configuration/staff/user_role', label: 'User Role' }
]

// Filtered items computed properties
const filteredRoomsItems = computed<MenuItem[]>(() => {
  if (!searchQuery.value) return roomsItems
  return roomsItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredRatesItems = computed<MenuItem[]>(() => {
  if (!searchQuery.value) return ratesItems
  return ratesItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredHousekeepingItems = computed<MenuItem[]>(() => {
  if (!searchQuery.value) return housekeepingItems
  return housekeepingItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredMasterItems = computed<MenuItem[]>(() => {
  if (!searchQuery.value) return masterItems
  return masterItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredSettingsItems = computed<MenuItem[]>(() => {
  if (!searchQuery.value) return settingsItems
  return settingsItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredStaffItems = computed<MenuItem[]>(() => {
  if (!searchQuery.value) return staffItems
  return staffItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
@reference "tailwindcss";

/* Smooth scrolling for navigation container */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* Ensure active state styling works properly with higher specificity */
:deep(.router-link-active.router-link-active) {
  color: #111827 !important;
  background-color: #e5e7eb !important;
  font-weight: 500 !important;
}

/* Alternative approach - target the active class directly */
:deep(a.router-link-active) {
  color: #111827 !important;
  background-color: #e5e7eb !important;
  font-weight: 500 !important;
}

/* Hide scrollbar but keep functionality */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Firefox scrollbar */
nav {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}
</style>