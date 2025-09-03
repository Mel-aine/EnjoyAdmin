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
              <!-- Overview/Dashboard -->
              <router-link 
                :to="'/configuration/channel-manager'"
                :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive('/configuration/channel-manager'),
                    'menu-item-inactive': !isActive('/configuration/channel-manager'),
                  },
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span :class="[
                  isActive('/configuration/channel-manager')
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <DashboardIcon />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t('configuration.channelManager.overview') }}
                </span>
              </router-link>

              <!-- Connections -->
              <router-link 
                :to="'/configuration/channel-manager/connections'"
                :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive('/configuration/channel-manager/connections'),
                    'menu-item-inactive': !isActive('/configuration/channel-manager/connections'),
                  },
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span :class="[
                  isActive('/configuration/channel-manager/connections')
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <ConnectionIcon />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t('configuration.channelManager.connections.title') }}
                </span>
              </router-link>

              <!-- Mapping -->
              <router-link 
                :to="'/configuration/channel-manager/mapping'"
                :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive('/configuration/channel-manager/mapping'),
                    'menu-item-inactive': !isActive('/configuration/channel-manager/mapping'),
                  },
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span :class="[
                  isActive('/configuration/channel-manager/mapping')
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <MappingIcon />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t('configuration.channelManager.mapping.title') }}
                </span>
              </router-link>

              <!-- Rates & Inventory -->
              <router-link 
                :to="'/configuration/channel-manager/rates-inventory'"
                :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive('/configuration/channel-manager/rates-inventory'),
                    'menu-item-inactive': !isActive('/configuration/channel-manager/rates-inventory'),
                  },
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span :class="[
                  isActive('/configuration/channel-manager/rates-inventory')
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <RatesIcon />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t('configuration.channelManager.ratesInventory.title') }}
                </span>
              </router-link>

              <!-- Sync Settings -->
              <router-link 
                :to="'/configuration/channel-manager/sync-settings'"
                :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive('/configuration/channel-manager/sync-settings'),
                    'menu-item-inactive': !isActive('/configuration/channel-manager/sync-settings'),
                  },
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span :class="[
                  isActive('/configuration/channel-manager/sync-settings')
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <SyncIcon />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t('configuration.channelManager.syncSettings.title') }}
                </span>
              </router-link>

              <!-- Logs -->
              <router-link 
                :to="'/configuration/channel-manager/logs'"
                :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive('/configuration/channel-manager/logs'),
                    'menu-item-inactive': !isActive('/configuration/channel-manager/logs'),
                  },
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span :class="[
                  isActive('/configuration/channel-manager/logs')
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <LogsIcon />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t('configuration.channelManager.logs.title') }}
                </span>
              </router-link>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

            <!-- Quick Actions Section -->
            <div class="space-y-1">
              <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span v-if="isExpanded || isHovered || isMobileOpen">
                  {{ $t('configuration.channelManager.quickActions') }}
                </span>
              </div>
              
              <!-- Add Connection -->
              <button 
                @click="$emit('add-connection')"
                :class="[
                  'menu-item group w-full text-left',
                  'menu-item-inactive hover:menu-item-active',
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span class="menu-item-icon-inactive group-hover:menu-item-icon-active">
                  <PlusIcon />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t('configuration.channelManager.addConnection') }}
                </span>
              </button>

              <!-- Sync All -->
              <button 
                @click="$emit('sync-all')"
                :class="[
                  'menu-item group w-full text-left',
                  'menu-item-inactive hover:menu-item-active',
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                <span class="menu-item-icon-inactive group-hover:menu-item-icon-active">
                  <RefreshIcon />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text">
                  {{ $t('configuration.channelManager.syncAll') }}
                </span>
              </button>
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

// Icons
import DashboardIcon from '@/icons/DashboardIcon.vue'
import ConnectionIcon from '@/icons/ConnectionIcon.vue'
import MappingIcon from '@/icons/MappingIcon.vue'
import RatesIcon from '@/icons/RatesIcon.vue'
import SyncIcon from '@/icons/SyncIcon.vue'
import LogsIcon from '@/icons/LogsIcon.vue'
import PlusIcon from '@/icons/PlusIcon.vue'
import RefreshIcon from '@/icons/RefreshIcon.vue'

const route = useRoute()
const { isExpanded, isMobileOpen } = useSidebar()
const isHovered = ref(false)

// Emits for parent component actions
const emit = defineEmits(['add-connection', 'sync-all'])

// Check if route is active
const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
/* Menu item styles */
.menu-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out;
}

.menu-item-active {
  @apply bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm;
}

.menu-item-inactive {
  @apply text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200;
}

.menu-item-text {
  @apply font-medium text-sm;
}

.menu-item-icon-active {
  @apply text-purple-600 dark:text-purple-400;
}

.menu-item-icon-inactive {
  @apply text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300;
}

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