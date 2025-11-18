<template>
  <header
    class="sticky top-0 flex  dark:bg-gray-800 w-full bg-gradient-to-r from-white via-gray-50 to-white border-gray-200 z-49 dark:border-gray-800 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 lg:border-b shadow-lg backdrop-blur-sm">
    <div class="flex flex-col items-center justify-between dark:bg-gray-800 grow lg:flex-row lg:px-8">
      <div
        class="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
        
        <HeaderLogo />
        <button @click="toggleApplicationMenu"
          class="flex items-center justify-center w-10 h-10 text-gray-600 rounded-xl z-99999 transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 hover:shadow-md hover:scale-105 dark:text-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 lg:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
              fill="currentColor" />
          </svg>
        </button>
        <!-- Header avec logo - position fixe -->
      <div >
        <div class="flex items-center gap-2" >

          <img
            class="rounded-full w-10"
           src="/src/assets/images/header/logo2.png"
            alt="Logo" />
          <span
            class="inline-flex text-xl text-gray-900 dark:text-white font-bold flex-wrap">
            Enjoy
          </span>
        </div>
      </div>
      </div>
      <div class="lg:flex self-center justify-center align-middle hidden">

      </div>
      <div :class="[isApplicationMenuOpen ? 'flex' : 'hidden']"
        class="items-center justify-between w-full gap-4 px-5 py-4 bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 backdrop-blur-sm shadow-xl border-t border-gray-100 dark:border-gray-700 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-800/80 lg:flex lg:justify-end lg:px-0 lg:shadow-none lg:bg-transparent lg:border-t-0 lg:backdrop-blur-none">
        <div class="flex items-center gap-1 sm:gap-2">
          <NotificationMenu />
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
        </div>
        <ConfigurationUserMenu />
      </div>
    </div>
  </header>
  <template v-if="showSupportModal">
    <SupportTicketModal v-if="showSupportModal" @close="showSupportModal = false" />
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import HeaderLogo from './header/HeaderLogo.vue'
import NotificationMenu from './header/NotificationMenu.vue'
import ConfigurationUserMenu from './header/ConfigurationUserMenu.vue'
import SupportTicketModal from '../modal/SupportTicketModal.vue'
import { HelpCircle } from 'lucide-vue-next'

const { toggleSidebar, toggleMobileSidebar, isMobileOpen, isExpanded } = useSidebar()

const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    toggleMobileSidebar()
  }
}

const isApplicationMenuOpen = ref(false)

const toggleApplicationMenu = () => {
  isApplicationMenuOpen.value = !isApplicationMenuOpen.value
}

const showSupportModal = ref(false)
const openSupportModal = () => {
  showSupportModal.value = true
}
</script>