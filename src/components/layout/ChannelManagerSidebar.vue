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
            {{ $t('configuration.channelManager.title') }}
          </span>
        </router-link>
      </div>

      <!-- Zone de navigation scrollable -->
      <div class="flex-1 overflow-hidden"
        @mouseenter="!isExpanded && (isHovered = true)"
        @mouseleave="isHovered = false">

        <nav class="h-full overflow-y-auto sidebar-scroll px-2 py-2">
          <div class="flex flex-col gap-2 pb-6">

            <!-- Channel Manager Navigation -->
            <div class="space-y-1">
              <router-link
                v-for="menuItem in menuItems"
                :key="menuItem.path"
                :to="menuItem.path"
                :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive(menuItem.path),
                    'menu-item-inactive': !isActive(menuItem.path),
                  },
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span :class="[
                  isActive(menuItem.path)
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <component :is="menuItem.icon" />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t(menuItem.title) }}
                </span>
              </router-link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'

// Icons
import DashboardIcon from '@/icons/DashboardIcon.vue'
import ConnectionIcon from '@/icons/ConnectionIcon.vue'
import MappingIcon from '@/icons/MappingIcon.vue'
import RatesIcon from '@/icons/RatesIcon.vue'
import SyncIcon from '@/icons/SyncIcon.vue'
import LogsIcon from '@/icons/LogsIcon.vue'
import PlusIcon from '@/icons/PlusIcon.vue'
import RefreshIcon from '@/icons/RefreshIcon.vue'
import BoxCubeIcon from '@/icons/BoxCubeIcon.vue'
import GridIcon from '@/icons/GridIcon.vue'
import CalenderIcon from '@/icons/CalenderIcon.vue'
import ListIcon from '@/icons/ListIcon.vue'

const route = useRoute()
const { isExpanded, isMobileOpen } = useSidebar()
const isHovered = ref(false)

// Menu items configuration
const menuItems = ref([
  {
    path: '/configuration/channel-manager',
    title: 'configuration.channelManager.overview',
    icon: markRaw(DashboardIcon)
  },
  {
    path: '/configuration/channel-manager/inventory-channel-booking',
    title: 'Inventory',
    icon: markRaw(BoxCubeIcon)
  },
  {
    path: '/configuration/channel-manager/channels-booking',
    title: 'Booking',
    icon: markRaw(CalenderIcon)
  },
  {
    path: '/configuration/channel-manager/rooms-rates',
    title: 'Room & Rates',
    icon: markRaw(RatesIcon)
  },
  {
    path: '/configuration/channel-manager/channel-manager',
    title: 'Channels',
    icon: markRaw(ConnectionIcon)
  },
  {
    path: '/configuration/channel-manager/properties',
    title: 'Properties',
    icon: markRaw(GridIcon)
  }
])

// Emits for parent component actions
const emit = defineEmits(['add-connection', 'sync-all'])

// Check if route is active
const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>


/* Sidebar scroll styles */
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
