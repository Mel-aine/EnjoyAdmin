<template>
  <AdminLayout>
    <FullScreenLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">{{ $t('actionHistory.title') }}</h2>
        <p class="text-gray-600 mt-1">{{ $t('actionHistory.subtitle') }}</p>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  v-model="searchTerm"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  :placeholder="$t('actionHistory.searchPlaceholder')"
                />
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <select
                v-model="selectedActionType"
                class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="">{{ $t('actionHistory.allActions') }}</option>
                <option value="CREATE">{{ $t('actionHistory.CREATE') }}</option>
                <option value="UPDATE">{{ $t('actionHistory.UPDATE') }}</option>
                <option value="CANCEL">{{ $t('actionHistory.CANCEL') }}</option>
                <option value="CHECK_IN">{{ $t('actionHistory.CHECK_IN') }}</option>
                <option value="CHECK_OUT">{{ $t('actionHistory.CHECK_OUT') }}</option>
                <option value="LOGIN">{{ $t('actionHistory.LOGIN') }}</option>
                <option value="LOGOUT">{{ $t('actionHistory.LOGOUT') }}</option>
              </select>

              <select
                v-model="itemsPerPage"
                class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
                <option value="100">100 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des actions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('actionHistory.recentActivities') }}</h3>
            <span class="text-sm text-gray-500">
              {{ $t('actionHistory.totalResults', { count: filteredLogs.length }) }}
            </span>
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>

        <div v-else>
          <div class="divide-y divide-gray-200">
            <div
              v-for="log in paginatedLogs"
              :key="log.id"
              class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <span class="text-lg">{{ getActionIcon(log.action) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex px-2 py-1 text-sm font-semibold rounded-full"
                      :class="getActionColor(log.action)"
                    >
                      {{ $t(`actionHistory.${log.action}`) }}
                    </span>
                    <span class="text-sm text-gray-500 capitalize">{{ log.entityType }}</span>
                  </div>
                  <p class="text-sm text-gray-900 mt-1">{{ $t(`${log.description}`) }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ new Date(log.createdAt).toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">
                  {{ $t('actionHistory.showing') }} {{ startIndex + 1 }} {{ $t('actionHistory.to') }} {{ endIndex }} {{ $t('actionHistory.of') }} {{ filteredLogs.length }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="goToPage(1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronsLeft size="20"/>
                </button>
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size="20"/>
                </button>

                <div class="flex items-center space-x-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'px-3 py-1 text-sm font-medium rounded-md',
                      page === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span v-if="showEllipsis" class="px-2 py-1 text-sm text-gray-500">...</span>
                </div>

                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size="20"/>
                </button>
                <button
                  @click="goToPage(totalPages)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight size="20"/>
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredLogs.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('actionHistory.noLogs') }}</h3>
            <p class="text-gray-500">{{ $t('actionHistory.noLogsMsg') }}</p>
          </div>
        </div>
      </div>
    </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { actionsMock } from "@/assets/data/StaffData";
import {getStocksHistories } from "@/services/api"
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useServiceStore } from '@/composables/serviceStore';
import {useAuthStore} from '@/composables/user';
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
import { ChevronsLeft } from 'lucide-vue-next';
import { ChevronLeft } from 'lucide-vue-next';
import { ChevronRight } from 'lucide-vue-next';
import { ChevronsRight } from 'lucide-vue-next';


const actionLogs = ref<Record<string, any>>([])
const loading = ref(true)
const serviceStore = useServiceStore()
const authStore = useAuthStore()

// Paramètres de pagination et filtres
const currentPage = ref(1)
const itemsPerPage = ref(25)
const searchTerm = ref('')
const selectedActionType = ref('')

// Computed pour les logs filtrés
const filteredLogs = computed(() => {
  let filtered = actionLogs.value

  // Filtrer par terme de recherche
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter((log:any) =>
      log.description?.toLowerCase().includes(term) ||
      log.entityType?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term)
    )
  }

  // Filtrer par type d'action
  if (selectedActionType.value) {
    filtered = filtered.filter((log:any) => log.action === selectedActionType.value)
  }

  return filtered
})

// Computed pour la pagination
const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage.value))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLogs.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredLogs.value.length))

// Pagination intelligente
const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    // Afficher toutes les pages si moins de 7
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Logique pour pagination intelligente
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 3) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2)
    }
  }

  return pages
})

const showEllipsis = computed(() => {
  return totalPages.value > 7 && currentPage.value < totalPages.value - 3
})

// Fonctions
function getActionIcon(action: string) {
  switch (action) {
    case 'CREATE': return '➕'
    case 'UPDATE': return '✏️'
    case 'CANCEL': return '🗑️'
    case 'CHECK_IN': return '✅'
    case 'LOGIN' : return '🔐'
    case 'LOGOUT' : return '🔓'
    default: return '📝'
  }
}

function getActionColor(action: string) {
  switch (action) {
    case 'CREATE': return 'bg-green-100 text-green-800'
    case 'UPDATE': return 'bg-indigo-100 text-indigo-800'
    case 'CANCEL': return 'bg-red-100 text-red-800'
    case 'CHECK_IN': return 'bg-purple-100 text-purple-800'
    case 'LOGIN': return 'bg-orange-100 text-orange-800'
    case 'LOGOUT': return 'bg-pink-100 text-pink-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Réinitialiser la page quand les filtres changent
watch([searchTerm, selectedActionType, itemsPerPage], () => {
  currentPage.value = 1
})

onMounted(async () => {
  try {
    const id = authStore.UserId
    const response = await getStocksHistories(id)

    console.log("......responseActions",response.data)
    actionLogs.value = response.data
  } catch (error) {
    console.error('Error fetching action logs:', error)
    // Optionally, you can set an error state here
    // handle error
  } finally {
    loading.value = false
  }
})
</script>
