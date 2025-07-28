<template>
  <div v-if="user" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ $t('welcome') }}, {{ user.firstName + ' ' + user.lastName }}
            </h1>
            <p class="mt-1 text-gray-600">
              {{ $t('manage_your') }}  {{ totalServices }} {{ $t('service_available') }}
            </p>
          </div>

          <!-- User Profile -->
           <div class="mt-4 sm:mt-0 relative">
              <!-- Bouton utilisateur -->
              <button
                @click="toggleDropdown"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                :class="{ 'bg-gray-100': isDropdownOpen }"
              >
                <!-- Avatar -->
                <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold">
                    {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                  </span>
                </div>

                <!-- Informations utilisateur -->
                <div class="hidden sm:block text-left">
                  <p class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>

                <!-- Icône chevron -->
                <ChevronDownIcon
                  class="w-5 h-5 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isDropdownOpen }"
                />
              </button>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-show="isDropdownOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-gray-300 ring-opacity-5 z-50"
                >
                  <div class="py-1">
                    <!-- Déconnexion -->
                    <button
                      @click="handleLogout"
                      class="flex items-center w-full px-4 py-3 text-sm text-orange-600 hover:text-orange-800 transition-colors duration-150"
                    >
                      <LogoutIcon class="w-4 h-4 mr-3" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </transition>

              <!-- Overlay pour fermer le dropdown -->
              <div
                v-show="isDropdownOpen"
                @click="closeDropdown"
                class="fixed inset-0 z-40"
              ></div>
           </div>
          <!-- <div class="mt-4 sm:mt-0 flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold">
                {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
              </span>
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Filters -->
      <div class="mb-8 space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search Bar -->
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('search_service')"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
            />
          </div>

          <!-- Category Filter -->
          <div class="sm:w-64">
            <select
              v-model="selectedCategory"
              class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
            >
              <option value="">{{ $t('all_category') }}</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700">
            {{ $t('showing') }}  {{ (currentPage - 1) * servicesPerPage + 1 }} {{ $t('to') }}
            {{ Math.min(currentPage * servicesPerPage, filteredServices.length) }}
            {{ $t('of') }} {{ filteredServices.length }} {{ $t('service') }}
          </p>

          <!-- View Toggle -->
          <div class="flex items-center space-x-2">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Services Grid/List -->
      <div v-if="paginatedServices && paginatedServices.length" class="mb-8">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="service in paginatedServices"
            :key="service.id"
            @click="handleServiceSelect(service)"
            class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-purple-200"
          >
            <div class="p-6">
              <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <img
                    v-if="service.logo"
                    :src="service.logo"
                    alt="logo service"
                    class="w-12 h-12 rounded-full object-cover"
                    @error="handleImageError"
                  />
                  <span v-else class="text-white font-bold text-xl">
                    {{ service.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </div>

              <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors truncate">
                  {{ service.name }}
                </h3>
                <p v-if="service.description" class="text-sm text-gray-500 mb-4 line-clamp-2">
                  {{ service.description }}
                </p>
                <div v-if="service.category" class="mb-4">
                  <span class="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {{ service.category.categoryName }}
                  </span>
                </div>
              </div>

              <button class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-sm">
                {{ $t('manage_this_service') }}
              </button>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div
            v-for="service in paginatedServices"
            :key="service.id"
            @click="handleServiceSelect(service)"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-purple-200"
          >
            <div class="p-6 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <img
                    v-if="service.logo"
                    :src="service.logo"
                    alt="logo service"
                    class="w-10 h-10 rounded-full object-cover"
                    @error="handleImageError"
                  />
                  <span v-else class="text-white font-bold">
                    {{ service.name.charAt(0).toUpperCase() }}
                  </span>
                </div>

                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                    {{ service.name }}
                  </h3>
                  <p v-if="service.description" class="text-sm text-gray-500 mt-1">
                    {{ service.description }}
                  </p>
                  <div v-if="service.category" class="mt-2">
                    <span class="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {{ service.category.categoryName }}
                    </span>
                  </div>
                </div>
              </div>

              <button class="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium">
                {{ $t('manage') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('no_service') }}</h3>
        <p class="text-gray-500 mb-4">
          {{ searchQuery || selectedCategory
            ? $t('no_service_match')
            : $t('no_service_available')
          }}
        </p>
        <button
          v-if="searchQuery || selectedCategory"
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {{ $t('clean_filter') }}
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2 mt-8">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div class="flex space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 rounded-lg transition-colors',
              page === currentPage
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted , computed, watch, defineEmits,nextTick } from 'vue'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'
import { useRouter } from 'vue-router'
import { ChevronDownIcon, LogoutIcon} from '@/icons'
import { logout } from '@/services/api';

const user = ref<any | null>(null)
const router = useRouter()
const authStore = useAuthStore()
const serviceStore = useServiceStore()
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const servicesPerPage = ref(12)
const viewMode = ref<'grid' | 'list'>('grid')


interface Service {
  id: number;
  name: string;
  color?: string;
  icon?: string;
  stats?: Record<string, number | string>;
  category?:any
}
const services = computed(() => serviceStore.getService)

onMounted(() => {
  if (authStore.user) {
    user.value = authStore.user
    console.log("services (computed)", services.value)
  }
})

const emit = defineEmits(['service-selected'])

const handleServiceSelect = async (service: Service) => {
  console.log('Service sélectionné:', service.id)

  serviceStore.setServiceId(service.id)

  serviceStore.setCurrentService(service)

  const rawCategory = service?.category
  const categoryName =
    typeof rawCategory === 'object' ? rawCategory.categoryName : rawCategory

  serviceStore.setServiceCategory(categoryName)
  emit('service-selected', service)
  await router.push('/welcome')

}



const totalServices = computed(() => services.value.length)

const categories = computed(() => {
  const catSet = new Set<string>()
  services.value.forEach((service:any) => {
    const rawCat = service.category
    const name = typeof rawCat === 'object' ? rawCat.categoryName : rawCat
    if (name) catSet.add(name)
  })
  return [...catSet].sort()
})

const filteredServices = computed(() => {
  let filtered = services.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((service:any) =>
      service.name.toLowerCase().includes(query) ||
      (service.description?.toLowerCase().includes(query)) ||
      (typeof service.category === 'string'
        ? service.category.toLowerCase().includes(query)
        : service.category?.categoryName?.toLowerCase().includes(query))
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((service:any) => {
      const category =
        typeof service.category === 'object'
          ? service.category.categoryName
          : service.category
      return category === selectedCategory.value
    })
  }

  return filtered
})

const totalPages = computed(() =>
  Math.ceil(filteredServices.value.length / servicesPerPage.value)
)

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * servicesPerPage.value
  const end = start + servicesPerPage.value
  return filteredServices.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)

  if (current - delta <= 0) {
    end = Math.min(total, end + (delta - current + 1))
  }
  if (current + delta >= total) {
    start = Math.max(1, start - (current + delta - total))
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})


const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
}


const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) target.style.display = 'none'
}


watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

const isDropdownOpen = ref(false)

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const signOut = async () => {
  try {
    closeDropdown();
    authStore.forceLogout();
    serviceStore.clearServiceId();
    serviceStore.clearCurrentService();
    serviceStore.clearServiceCategory();
    serviceStore.clearPermissions();
    serviceStore.clearUserService();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roleId');
    localStorage.removeItem('UserId');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('roleId');
    sessionStorage.removeItem('UserId');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token');

    await nextTick();

    try {
      await logout();
    } catch (err) {
      console.error('Erreur API logout:', err);
    }

    await router.replace('/');
  } catch (error) {
    console.error('Erreur lors du logout:', error);
  }
};

const handleLogout = () => {
  closeDropdown()
  signOut()
}
</script>
<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation pour les cartes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
</style>

