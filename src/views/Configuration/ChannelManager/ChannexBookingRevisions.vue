<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ t('channexBookingRevisions.title') }}
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ t('channexBookingRevisions.description') }}
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="fetchBookingRevisions"
              :disabled="isLoading"
              class="inline-flex items-center rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw :class="['mr-2 h-4 w-4', { 'animate-spin': isLoading }]" />
              {{ t('channexBookingRevisions.actions.refresh') }}
            </button>
            <button
              @click="processAllRevisions"
              :disabled="isLoading || bookingRevisions.length === 0"
              class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download class="mr-2 h-4 w-4" />
              {{ t('channexBookingRevisions.actions.processAll') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Calendar class="h-8 w-8 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('channexBookingRevisions.stats.totalRevisions') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ meta.total || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircle class="h-8 w-8 text-green-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('channexBookingRevisions.stats.processed') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ processedCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Clock class="h-8 w-8 text-yellow-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('channexBookingRevisions.stats.pending') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ pendingCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <AlertCircle class="h-8 w-8 text-red-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('channexBookingRevisions.stats.errors') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ errorCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('channexBookingRevisions.filters.status') }}
            </label>
            <select
              v-model="filters.status"
              @change="applyFilters"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">{{ t('channexBookingRevisions.filters.allStatuses') }}</option>
              <option value="new">{{ t('channexBookingRevisions.status.new') }}</option>
              <option value="confirmed">{{ t('channexBookingRevisions.status.confirmed') }}</option>
              <option value="cancelled">{{ t('channexBookingRevisions.status.cancelled') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('channexBookingRevisions.filters.otaName') }}
            </label>
            <select
              v-model="filters.otaName"
              @change="applyFilters"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">{{ t('channexBookingRevisions.filters.allOTAs') }}</option>
              <option v-for="ota in uniqueOTAs" :key="ota" :value="ota">
                {{ ota }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('channexBookingRevisions.filters.dateRange') }}
            </label>
            <input
              v-model="filters.dateFrom"
              type="date"
              @change="applyFilters"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Booking Revisions Table -->
      <div class="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-md">
        <div class="px-4 py-5 sm:p-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {{ t('channexBookingRevisions.table.title') }}
            </h3>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('channexBookingRevisions.table.showing', { 
                start: (meta.page - 1) * meta.limit + 1,
                end: Math.min(meta.page * meta.limit, meta.total),
                total: meta.total 
              }) }}
            </div>
          </div>

          <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>

          <div v-else-if="filteredRevisions.length === 0" class="text-center py-8">
            <Calendar class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {{ t('channexBookingRevisions.table.noData') }}
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ t('channexBookingRevisions.table.noDataDescription') }}
            </p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {{ t('channexBookingRevisions.table.columns.bookingId') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {{ t('channexBookingRevisions.table.columns.guest') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {{ t('channexBookingRevisions.table.columns.dates') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {{ t('channexBookingRevisions.table.columns.ota') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {{ t('channexBookingRevisions.table.columns.amount') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {{ t('channexBookingRevisions.table.columns.status') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {{ t('channexBookingRevisions.table.columns.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr v-for="revision in paginatedRevisions" :key="revision.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {{ revision.attributes.unique_id }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div>
                      <div class="font-medium">{{ revision.attributes.customer.name }} {{ revision.attributes.customer.surname }}</div>
                      <div class="text-xs text-gray-400">{{ revision.attributes.customer.mail }}</div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div>
                      <div>{{ formatDate(revision.attributes.arrival_date) }} - {{ formatDate(revision.attributes.departure_date) }}</div>
                      <div class="text-xs text-gray-400">{{ revision.attributes.arrival_hour }}</div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {{ revision.attributes.ota_name }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {{ revision.attributes.amount }} {{ revision.attributes.currency }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    <span :class="getStatusBadgeClass(revision.attributes.status)">
                      {{ t(`channexBookingRevisions.status.${revision.attributes.status}`) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="viewRevisionDetails(revision)"
                        class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        <Eye class="h-4 w-4" />
                      </button>
                      <button
                        @click="processRevision(revision)"
                        :disabled="processingIds.has(revision.id)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                      >
                        <Download :class="['h-4 w-4', { 'animate-spin': processingIds.has(revision.id) }]" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="filteredRevisions.length > 0" class="mt-6 flex items-center justify-between">
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {{ t('common.previous') }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {{ t('common.next') }}
              </button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ t('common.pagination.showing') }}
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  {{ t('common.pagination.to') }}
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredRevisions.length) }}</span>
                  {{ t('common.pagination.of') }}
                  <span class="font-medium">{{ filteredRevisions.length }}</span>
                  {{ t('common.pagination.results') }}
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <ChevronLeft class="h-5 w-5" />
                  </button>
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      page === currentPage
                        ? 'relative z-10 inline-flex items-center bg-brand-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'
                        : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <ChevronRight class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Revision Details Modal -->
    <div v-if="selectedRevision" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeRevisionDetails"></div>
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 sm:align-middle">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {{ t('channexBookingRevisions.modal.title') }}: {{ selectedRevision.attributes.unique_id }}
            </h3>
            <button @click="closeRevisionDetails" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Guest Information -->
            <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-4">
              <h4 class="mb-3 font-medium text-gray-900 dark:text-white">{{ t('channexBookingRevisions.modal.guestInfo') }}</h4>
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-500 dark:text-gray-400">{{ t('channexBookingRevisions.modal.name') }}:</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedRevision.attributes.customer.name }} {{ selectedRevision.attributes.customer.surname }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500 dark:text-gray-400">{{ t('channexBookingRevisions.modal.email') }}:</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedRevision.attributes.customer.mail }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500 dark:text-gray-400">{{ t('channexBookingRevisions.modal.phone') }}:</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedRevision.attributes.customer.phone }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500 dark:text-gray-400">{{ t('channexBookingRevisions.modal.country') }}:</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedRevision.attributes.customer.country }}</dd>
                </div>
              </dl>
            </div>

            <!-- Booking Information -->
            <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-4">
              <h4 class="mb-3 font-medium text-gray-900 dark:text-white">{{ t('channexBookingRevisions.modal.bookingInfo') }}</h4>
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-500 dark:text-gray-400">{{ t('channexBookingRevisions.modal.checkIn') }}:</dt>
                  <dd class="text-gray-900 dark:text-white">{{ formatDate(selectedRevision.attributes.arrival_date) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500 dark:text-gray-400">{{ t('channexBookingRevisions.modal.checkOut') }}:</dt>
                  <dd class="text-gray-900 dark:text-white">{{ formatDate(selectedRevision.attributes.departure_date) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500 dark:text-gray-400">{{ t('channexBookingRevisions.modal.amount') }}:</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedRevision.attributes.amount }} {{ selectedRevision.attributes.currency }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500 dark:text-gray-400">{{ t('channexBookingRevisions.modal.occupancy') }}:</dt>
                  <dd class="text-gray-900 dark:text-white">
                    {{ selectedRevision.attributes.occupancy.adults }}A
                    <span v-if="selectedRevision.attributes.occupancy.children > 0">, {{ selectedRevision.attributes.occupancy.children }}C</span>
                    <span v-if="selectedRevision.attributes.occupancy.infants > 0">, {{ selectedRevision.attributes.occupancy.infants }}I</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedRevision.attributes.notes" class="mt-6">
            <h4 class="mb-2 font-medium text-gray-900 dark:text-white">{{ t('channexBookingRevisions.modal.notes') }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ selectedRevision.attributes.notes }}</p>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="closeRevisionDetails"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {{ t('common.close') }}
            </button>
            <button
              @click="processRevision(selectedRevision)"
              :disabled="processingIds.has(selectedRevision.id)"
              class="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Download :class="['mr-2 h-4 w-4', { 'animate-spin': processingIds.has(selectedRevision.id) }]" />
              {{ t('channexBookingRevisions.actions.process') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  RefreshCw, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import { getChannexBookingRevisions } from '@/services/channelManagerApi'
import type { ChannexBookingRevision } from '@/services/channelManagerApi'
import { 
  fetchAndProcessBookingRevisions, 
  processBookingRevision 
} from '@/services/channexBookingProcessor'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const isLoading = ref(false)
const bookingRevisions = ref([])
const meta = ref({ total: 0, page: 1, limit: 10 })
const processingIds = ref(new Set())
const selectedRevision = ref(null)

// Filters
const filters = ref({
  status: '',
  otaName: '',
  dateFrom: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed properties
const uniqueOTAs = computed(() => {
  const otas = bookingRevisions.value.map(r => r.attributes.ota_name)
  return [...new Set(otas)].sort()
})

const filteredRevisions = computed(() => {
  let filtered = bookingRevisions.value

  if (filters.value.status) {
    filtered = filtered.filter(r => r.attributes.status === filters.value.status)
  }

  if (filters.value.otaName) {
    filtered = filtered.filter(r => r.attributes.ota_name === filters.value.otaName)
  }

  if (filters.value.dateFrom) {
    filtered = filtered.filter(r => r.attributes.arrival_date >= filters.value.dateFrom)
  }

  return filtered
})

const paginatedRevisions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRevisions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRevisions.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
})

const processedCount = computed(() => {
  return bookingRevisions.value.filter(r => r.processed).length
})

const pendingCount = computed(() => {
  return bookingRevisions.value.filter(r => r.attributes.status === 'new').length
})

const errorCount = computed(() => {
  return bookingRevisions.value.filter(r => r.error).length
})

// Methods
const fetchBookingRevisions = async () => {
  isLoading.value = true
  try {
    const response = await getChannexBookingRevisions({ page: 1, limit: 100 })
    bookingRevisions.value = response.data.data
    meta.value = response.data.meta
    toast.success(t('channexBookingRevisions.messages.fetchSuccess'))
  } catch (error) {
    console.error('Error fetching booking revisions:', error)
    toast.error(t('channexBookingRevisions.messages.fetchError'))
  } finally {
    isLoading.value = false
  }
}

const processRevision = async (revision) => {
  processingIds.value.add(revision.id)
  try {
    await processBookingRevision(revision)
    revision.processed = true
    toast.success(t('channexBookingRevisions.messages.processSuccess', { id: revision.attributes.unique_id }))
  } catch (error) {
    console.error('Error processing revision:', error)
    revision.error = true
    toast.error(t('channexBookingRevisions.messages.processError', { id: revision.attributes.unique_id }))
  } finally {
    processingIds.value.delete(revision.id)
  }
}

const processAllRevisions = async () => {
  try {
    await fetchAndProcessBookingRevisions()
    await fetchBookingRevisions() // Refresh the list
  } catch (error) {
    console.error('Error processing all revisions:', error)
  }
}

const viewRevisionDetails = (revision) => {
  selectedRevision.value = revision
}

const closeRevisionDetails = () => {
  selectedRevision.value = null
}

const applyFilters = () => {
  currentPage.value = 1
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusBadgeClass = (status) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
  
  switch (status) {
    case 'new':
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`
    case 'confirmed':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`
    case 'cancelled':
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`
  }
}

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Lifecycle
onMounted(() => {
  fetchBookingRevisions()
})
</script>