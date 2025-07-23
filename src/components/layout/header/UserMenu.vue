<template>



  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400 space-x-1"
      @click.prevent="toggleDropdown"
    >
      <!-- <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img src="" alt="User" />
      </span> -->
       <div class="relative flex-shrink-0">
            <img
              v-if="picture"
              :src="picture"
              alt="Photo utilisateur"
              class="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-500 shadow-lg"
            />
            <div
              v-else
              class="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-100 to-white backdrop-blur-sm flex items-center justify-center text-gray-800 text-lg sm:text-xl font-bold border-2 border-gray-500"
            >
              {{ userInitials }}
            </div>
          </div>

      <span class="block mr-1 font-medium text-theme-sm"> {{ fullName }} </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ fullName }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ Email }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <router-link
        to="/"
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
       {{$t('SignOut')}}
      </router-link>

      <div class="mt-4 border-t border-gray-900 pt-4">
          <ServiceSwitcher  />
      </div>
    </div>

    <!-- Dropdown End v-if="user?.service?.length" -->
  </div>
</template>

<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import ServiceSwitcher from '@/views/Services/ServiceSwitcher.vue'
import { logout } from '@/services/api';
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted ,computed} from 'vue'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";
const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const { t } = useI18n();
const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: t('Viewprofile') },
  { href: '/setting', icon: SettingsIcon, text: t('Accountsettings') },
  // { href: '/profile', icon: InfoCircleIcon, text: 'Support' },
]




const authStore = useAuthStore()
const serviceStore = useServiceStore()
const router = useRouter()

const fullName = computed(() => {
  const userData = authStore.user
  console.log("userData",userData)
  const user = JSON.parse(userData);
   return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
})
const Email = computed(() => {
  const userData = authStore.user
  const user = JSON.parse(userData);
   return `${user?.email ?? ''}`
})

// const signOut = () => {
//   authStore.logout()
//   serviceStore.clearServiceId();
//   serviceStore.clearCurrentService();
//   serviceStore.clearServiceCategory();
//   serviceStore.clearPermissions();
//   authStore.clearsetRoleId();
//   authStore.clearsetUserId()
//   authStore.clearsetUser()
//   closeDropdown()
//   router.push('/')
// }



const signOut = async () => {

 try {
    await logout();

  authStore.logout()
  serviceStore.clearServiceId()
  serviceStore.clearCurrentService()
  serviceStore.clearServiceCategory()
  serviceStore.clearPermissions()
  authStore.clearsetRoleId()
  authStore.clearsetUserId()
  authStore.clearsetUser()
  closeDropdown()
  router.push('/')
  } catch (error) {
    console.error('Erreur lors du logout', error);
  }

}


const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const userInitials = computed(() => {
  const names = fullName.value.trim().split(' ');
  return names?.map((n)=> n[0]).slice(0, 2).join('');
});

const closeDropdown = () => {
  dropdownOpen.value = false
}


const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
