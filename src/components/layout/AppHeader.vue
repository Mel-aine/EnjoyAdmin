<template>
  <header
    class="sticky top-0 flex w-full bg-gradient-to-r from-white via-gray-50 to-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 lg:border-b shadow-lg backdrop-blur-sm">
    <div class="flex flex-col items-center justify-between grow lg:flex-row dark:bg-gray-800 lg:px-8">
      <div
        class="flex items-center  justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
        <button v-if="showSidebar" @click="handleToggle"
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
        <!-- <HeaderLogo /> -->
        <button @click="toggleApplicationMenu"
          class="flex items-center justify-center w-10 h-10 text-gray-600 rounded-xl z-99999 transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 hover:shadow-md hover:scale-105 dark:text-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 lg:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
              fill="currentColor" />
          </svg>
        </button>
        <!-- Header avec logo - position fixe -->
        <div>
          <div class="flex items-center gap-2 flex-shrink-0 min-w-[120px]">

            <img class="rounded-full w-10" src="/src/assets/images/header/logo2.png" alt="Logo" />
            <span class="inline-flex text-xl text-gray-900 font-bold flex-wrap dark:text-white">
              Enjoy
            </span>
          </div>
        </div>
        <SearchBar @select="handleReservationSelect" />
      </div>
      <div class="lg:flex self-center justify-center align-middle hidden">

      </div>
      <div :class="[isApplicationMenuOpen ? 'flex' : 'hidden']"
        class="items-center justify-between w-full gap-4 px-5 py-4 bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 backdrop-blur-sm shadow-xl border-t border-gray-100 dark:border-gray-700 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-800/80 lg:flex lg:justify-end lg:px-0 lg:shadow-none lg:bg-transparent lg:border-t-0 lg:backdrop-blur-none">
        <div class="flex items-center gap-1 sm:gap-2">

          <button v-if="canviewListBooking"
            class="relative group flex items-center px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md dark:hover:from-gray-700 dark:hover:to-gray-600"
            @click="gotoReservation">
            <List class="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300" />
            <span
              class="absolute top-full mt-2 hidden group-hover:block text-xs bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              {{ $t('AllBooking') }}
            </span>
          </button>

          <button v-if="canAddBooking"
            class="relative group flex items-center px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md dark:hover:from-gray-700 dark:hover:to-gray-600"
            @click="gotoAddReservation">
            <AddBookinIcon class="w-5 h-5  cursor-pointer text-gray-600 dark:text-gray-300" />
            <span
              class="absolute top-full mt-2 hidden group-hover:block text-xs bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              {{ $t('AddReservation') }}
            </span>
          </button>

          <!-- Nouveau bouton: Fiche d'enregistrement client -->
          <button
            class="relative group flex items-center px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md dark:hover:from-gray-700 dark:hover:to-gray-600"
            @click="openGuestRegistration">
            <PlusCircle class="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300" />
            <span
              class="absolute top-full mt-2 hidden group-hover:block text-xs bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              {{ $t('GuestRegistration') }}
            </span>
          </button>

          <button v-if="canviewStayView"
            class="relative group flex items-center px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md dark:hover:from-gray-700 dark:hover:to-gray-600"
            @click="gotoCalendar">
            <Calendar class="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300" />
            <span
              class="absolute top-full mt-2 hidden group-hover:block text-xs bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              {{ $t('stay_view') }}
            </span>
          </button>

          <!-- Bascule thème clair/sombre -->
          <button
            class="relative group flex items-center px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md dark:hover:from-gray-700 dark:hover:to-gray-600"
            @click="toggleTheme" aria-label="Basculer le thème">
            <component :is="isDarkMode ? Sun : Moon" class="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300" />
            <span
              class="absolute top-full mt-2 hidden group-hover:block text-xs bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              {{ isDarkMode ? $t('clearTheme') : $t('darkMode') }}
            </span>
          </button>

          <NotificationMenu @open="showNotification = true" :notifying="notifying"/>
          <!-- Bouton Aide / Support -->
          <button
            class="relative group flex items-center px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md dark:hover:from-gray-700 dark:hover:to-gray-600"
            @click="openSupportModal">
            <HelpCircle class="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300" />
            <span
              class="absolute top-full mt-2 hidden group-hover:block text-xs bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              {{ $t('Support') }}
            </span>
          </button>
        </div>
        <UserMenu />
      </div>
    </div>
  </header>
  <template v-if="showSidebar">
    <app-sidebar v-if="isExpanded || isMobileOpen" />
    <!-- <Backdrop /> -->
  </template>
  <template v-if="showModalAddingModal">
    <BookingFormQuick :is-open='showModalAddingModal' v-if="showModalAddingModal"
      @close="showModalAddingModal = false" />
  </template>
  <template v-if="showGuestRegistration">
    <GuestRegistrationModal v-if="showGuestRegistration" @close="showGuestRegistration = false" />
  </template>
  <template v-if="isReservationModalOpen && selectedReservation">
    <ReservationRigthModal
      :is-open="isReservationModalOpen"
      :title="selectedReservation.reservationNumber!"
      :reservation-data="selectedReservation"
      @close="isReservationModalOpen = false"
    />
  </template>
  <template v-if="showSupportModal">
    <SupportTicketModal v-if="showSupportModal" @close="showSupportModal = false" />
  </template>
  <template v-if="showNotification">
    <NotificationModal :is-open="showNotification" @close="showNotification=false" :notifications="notifications"/>
  </template>

</template>

<script setup lang="ts">
import { computed, ref,onMounted,onUnmounted } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import SearchBar from './header/SearchBar.vue'
import NotificationMenu from './header/NotificationMenu.vue'
import UserMenu from './header/UserMenu.vue'
import AppSidebar from './AppSidebar.vue'
import { Calendar, PlusCircle, List, Sun, Moon, HelpCircle } from 'lucide-vue-next'
import router from '@/router'
import { useAuthStore } from '../../composables/user'
import BookingFormQuick from '../reservations/BookingFormQuick.vue'
import GuestRegistrationModal from '../modal/GuestRegistrationModal.vue'
import SupportTicketModal from '../modal/SupportTicketModal.vue'
import AddBookinIcon from '../../icons/AddBookinIcon.vue'
import { useTheme } from '@/composables/theme'
import ReservationRigthModal from '../reservations/ReservationRigthModal.vue'
import type { ReservationDetails } from '@/utils/models'
import NotificationModal from '../modal/NotificationModal.vue'
import { fetchMyNotifications, markNotificationRead, type NotificationItem } from '@/services/notificationsApi'
import { subscribeNotifications, type Unsubscribe } from '@/services/notificationsStream'

const authStore = useAuthStore();
const showNotification = ref(false)
const showModalAddingModal = ref(false);
const showGuestRegistration = ref(false);
const showSupportModal = ref(false);
const { toggleSidebar, toggleMobileSidebar, isMobileOpen, isExpanded } = useSidebar()
const notifications = ref<NotificationItem[]>([])
let unsubscribe: Unsubscribe | null = null


const notifying = computed(() => (notifications.value || []).some((n) => !n.isRead))
const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    toggleMobileSidebar()
  }
}
const openModal = () => {
  showModalAddingModal.value = true;
}

const isApplicationMenuOpen = ref(false)

const toggleApplicationMenu = () => {
  isApplicationMenuOpen.value = !isApplicationMenuOpen.value
}
const gotoCalendar = () => {
  router.push({ name: "ReservationCalendar" })
}
const gotoReservation = () => {
  const url = router.resolve({ name: 'ReservationGridView' }).href
  window.open(url, '_blank')
}
const gotoAddReservation = () => {
  const url = router.resolve({ name: 'New Booking' }).href
  window.open(url, '_blank')
}
const openGuestRegistration = () => {
  showGuestRegistration.value = true;
}
const openSupportModal = () => {
  showSupportModal.value = true
}
// Reservation modal state and handler
const isReservationModalOpen = ref(false)
const selectedReservation = ref<ReservationDetails | null>(null)

const handleReservationSelect = (reservation: ReservationDetails) => {
  selectedReservation.value = reservation
  isReservationModalOpen.value = true
}
const canAddBooking = computed(() => {
  return authStore.hasPermission("add_reservation")
})
const canviewListBooking = computed(() => {
  return authStore.hasPermission("access_to_reservation_panel")
})
const canviewStayView = computed(() => {
  return authStore.hasPermission("access_to_stay_view")
})

// Dark mode toggle
const { isDarkMode, toggleTheme } = useTheme()
interface HeaderProps {
  showSidebar?: boolean
}

const props = withDefaults(defineProps<HeaderProps>(), {
  showSidebar: true
})



onMounted(async () => {
  try {
    notifications.value = await fetchMyNotifications()
    console.log('🔍 Notifications fetched:', notifications.value)
  } catch (e) {
    notifications.value = []
  }
  // Subscribe to realtime notifications via SSE
  unsubscribe = subscribeNotifications(
    (item) => {
      notifications.value = [item, ...notifications.value].slice(0, 100)
    },
    (err) => {
      // optional: show offline badge
      console.warn('Notifications stream error', err)
    },
  )
})


</script>
