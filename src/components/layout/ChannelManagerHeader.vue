<template>
  <header
    class="sticky top-0 flex w-full bg-gradient-to-r from-white via-gray-50 to-white border-gray-200 z-49 dark:border-gray-800 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 lg:border-b shadow-lg backdrop-blur-sm">
    <div class="flex items-center justify-between grow dark:bg-gray-800 lg:px-8">
      <!-- Left: sidebar toggle + logo/title -->
      <div class="flex items-center gap-3 px-3 py-3 lg:px-0 lg:py-4">
        <button @click="handleToggle" v-if="isMobileOpen"
          class="flex items-center justify-center w-10 h-10 text-gray-600 border-gray-200 rounded-xl z-99999 dark:border-gray-700 dark:text-gray-300 lg:h-9 lg:w-9 lg:border transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-md hover:scale-105"
          :class="[
            isMobileOpen
              ? 'lg:bg-transparent dark:lg:bg-transparent bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-blue-200 dark:border-gray-600'
              : '',
          ]">
          <svg v-if="isMobileOpen || isExpanded" class="fill-current" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
              fill="currentColor" />
          </svg>
          <svg v-else width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
              fill="currentColor" />
          </svg>
        </button>

        <div class="flex items-center gap-2 flex-shrink-0 min-w-[120px]">
          <img class="rounded-full w-10" src="/src/assets/images/header/logo2.png" alt="Logo" />
          <span class="inline-flex text-xl text-gray-900 font-bold flex-wrap dark:text-white">
            {{ $t('configuration.channelManager.title') }}
          </span>
        </div>
      </div>

      <!-- Middle: horizontal nav built from ChannelManagerSidebar menu items -->
      <nav class="hidden lg:flex items-center gap-1 px-4 py-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200',
            isActive(item.path)
              ? 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900 dark:text-white'
              : 'text-gray-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:text-gray-300',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-sm">{{ $t(item.title) }}</span>
        </router-link>
      </nav>

      <!-- Right: theme toggle + notification + user menu -->
      <div class="flex items-center gap-2 px-5 py-4 lg:px-0">
        <!-- Migration Button (moved from Overview) -->
        <div v-if="!currentService.channexPropertyId" class="flex">
          <BasicButton
            :label="isLoading ? t('configuration.channelManager.common.migrating') : t('configuration.channelManager.migrateHotelData')"
            :loading="isLoading"
            variant="secondary"
            @click="handleMigrate"
          />
        </div>
        <button
          class="relative group flex items-center px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md dark:hover:from-gray-700 dark:hover:to-gray-600"
          @click="toggleTheme"
          aria-label="Toggle theme">
          <component :is="isDarkMode ? Sun : Moon" class="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300" />
          <span
            class="absolute top-full mt-2 hidden group-hover:block text-xs bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
            {{ isDarkMode ? $t('clearTheme') : $t('darkMode') }}
          </span>
        </button>
        <!-- Support button -->
        <button
          class="relative group flex items-center px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md dark:hover:from-gray-700 dark:hover:to-gray-600"
          @click="openSupportModal"
          aria-label="Open support modal">
          <HelpCircle class="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300" />
          <span
            class="absolute top-full mt-2 hidden group-hover:block text-xs bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
            {{ $t('Support') }}
          </span>
        </button>
        <NotificationMenu />
        <ChannelManagerUserMenu />
      </div>
    </div>
  </header>
  <template v-if="showSupportModal">
    <SupportTicketModal v-if="showSupportModal" @close="showSupportModal = false" />
  </template>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { useRoute } from 'vue-router'
import NotificationMenu from './header/NotificationMenu.vue'
import ChannelManagerUserMenu from './header/ChannelManagerUserMenu.vue'
import { useTheme } from '@/composables/theme'
import DashboardIcon from '@/icons/DashboardIcon.vue'
import ConnectionIcon from '@/icons/ConnectionIcon.vue'
import RatesIcon from '@/icons/RatesIcon.vue'
import BoxCubeIcon from '@/icons/BoxCubeIcon.vue'
import GridIcon from '@/icons/GridIcon.vue'
import CalenderIcon from '@/icons/CalenderIcon.vue'
import { Sun, Moon } from 'lucide-vue-next'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { migrateCompleteHotel } from '@/services/channelManagerApi'
import { useServiceStore } from '@/composables/serviceStore'
import SupportTicketModal from '../modal/SupportTicketModal.vue'
import { HelpCircle } from 'lucide-vue-next'

const route = useRoute()
const { toggleSidebar, toggleMobileSidebar, isMobileOpen, isExpanded } = useSidebar()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const isLoading = ref(false)
const currentService = useServiceStore().getCurrentService

const handleMigrate = async () => {
  try {
    isLoading.value = true
    const res = await migrateCompleteHotel()
    const message = res?.data?.message || t('configuration.channelManager.common.success')
    toast.success(message)
  } catch (error: any) {
    const message = error?.response?.data?.message || t('configuration.channelManager.migrationError')
    toast.error(message)
    console.error('migrateCompleteHotel error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    toggleMobileSidebar()
  }
}

// Build menu items similar to ChannelManagerSidebar
const menuItems = ref([
  {
    path: '/configuration/channel-manager',
    title: 'configuration.channelManager.booking',
    icon: markRaw(DashboardIcon)
  },
  {
    path: '/configuration/channel-manager/inventory-channel-booking',
    title: 'configuration.channelManager.inventory',
    icon: markRaw(BoxCubeIcon)
  },
 /* {
    path: '/configuration/channel-manager/channels-booking',
    title: 'configuration.channelManager.booking',
    icon: markRaw(CalenderIcon)
  },*/
  {
    path: '/configuration/channel-manager/rooms-rates',
    title: 'configuration.channelManager.roomsRates',
    icon: markRaw(RatesIcon)
  },
  {
    path: '/configuration/channel-manager/channel-manager',
    title: 'configuration.channelManager.channels',
    icon: markRaw(ConnectionIcon)
  },
  {
    path: '/configuration/channel-manager/properties',
    title: 'configuration.channelManager.properties',
    icon: markRaw(GridIcon)
  }
])

const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/')
}

const { isDarkMode, toggleTheme } = useTheme()

const showSupportModal = ref(false)
const openSupportModal = () => {
  showSupportModal.value = true
}
</script>

<style scoped>
</style>
