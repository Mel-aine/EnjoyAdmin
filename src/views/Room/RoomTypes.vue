
<template>
  <div class="">
    <AdminLayout>
      <FullScreenLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />

      <!-- Header avec actions -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5">
        <div class="flex items-center gap-4">
          <!-- Toggle View -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              @click="viewMode = 'list'"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              {{ $t('List') }}
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              {{ $t('Grid') }}
            </button>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{{ $t('Total') }}: {{ roomTypeData.length }}</span>
            <span>{{ $t('Active') }}: {{ activeRoomTypes }}</span>
            <span>{{ $t('Inactive') }}: {{ inactiveRoomTypes }}</span>
          </div>
        </div>

        <div class="flex space-x-2">

          <button
            @click="OpenModal"
            class="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ t('AddRoomType') }}
          </button>


          <button
            @click="importDefaultDefaults"
            class="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📥
            {{ t('importdefault') }}
          </button>
        </div>

      </div>

      <div class="">
        <!-- Vue Liste -->
        <div v-if="viewMode === 'list'" class="space-y-5 sm:space-y-6 mt-10">
          <TableComponent
            :items="titles"
            :datas="roomTypeData"
            :filterable="true"
            :pagination="true"
            :loading="loading"
            :showHeader="true"
            :title="$t('AllRoomType')"
            :pageSize="15"
            :showButtonAllElement="true"
            @edit="onEditRoomType"
            @delete="onDeleteRoomType"
            class="modern-table"
          />
        </div>

        <!-- Vue Grille -->
        <div v-else class="mt-10">
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('AllRoomType') }}</h2>
            <div class="flex items-center gap-4">
              <!-- Filtre de statut -->
              <select
                v-model="statusFilter"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{{ $t('AllStatus') }}</option>
                <option value="active">{{ $t('Active') }}</option>
                <option value="inactive">{{ $t('Inactive') }}</option>
              </select>

              <!-- Recherche -->
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('search...')"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Grille des cartes -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" v-if="!loading">
            <div
              v-for="roomType in paginatedGridData"
              :key="roomType.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group"
            >
              <!-- Header de la carte -->
              <div class="p-6 pb-4">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">
                      {{ roomType.name }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          roomType.statusColor.bg,
                          roomType.statusColor.text
                        ]"
                      >
                        {{ roomType.statusColor.label }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ roomType.roomCount || 0 }} {{ $t('Rooms') }}
                      </span>
                    </div>
                  </div>

                  <!-- Menu actions -->
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="onEditRoomType(roomType)"
                      class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      :title="$t('Edit')"
                    >
                      <svg class="h-4 w-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                        <path stroke="none" d="M0 0h24v24H0z"/>
                        <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
                      </svg>
                    </button>
                    <button
                      @click="onDeleteRoomType(roomType)"
                      class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      :title="$t('Delete')"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {{ roomType.description || $t('NoDescription') }}
                </p>
              </div>

              <!-- Informations tarifaires -->
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ $t('Price') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(roomType.price) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ $t('DefaultGuest') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ roomType.defaultGuest }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ $t('ExtraGuestPrice') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(roomType.extraGuestPrice) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ $t('DefaultDeposit') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(roomType.defaultDeposit) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading state pour la grille -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="i in 8" :key="i" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="p-6 animate-pulse">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination pour la grille -->
          <div v-if="viewMode === 'grid' && !loading && filteredGridData.length > gridPageSize" class="mt-8 flex justify-center">
            <nav class="flex items-center gap-2">
              <button
                @click="gridCurrentPage = Math.max(1, gridCurrentPage - 1)"
                :disabled="gridCurrentPage === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                {{ $t('previous') }}
              </button>

              <div class="flex items-center gap-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="gridCurrentPage = page"
                  :class="[
                    'px-3 py-2 text-sm font-medium rounded-lg',
                    gridCurrentPage === page
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="gridCurrentPage = Math.min(totalGridPages, gridCurrentPage + 1)"
                :disabled="gridCurrentPage === totalGridPages"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                {{ $t('next') }}
              </button>
            </nav>
          </div>

          <!-- Message si aucune donnée -->
          <div v-if="!loading && filteredGridData.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('NoRoomTypes') }}</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('StartByCreatingRoomType') }}</p>
          </div>
        </div>
      </div>
      </FullScreenLayout>
    </AdminLayout>

    <!-- Modal reste identique -->
    <Modal v-if="modalOpen" @close="closeModal">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <button @click="closeModal"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" fill="" />
            </svg>
          </button>

          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ isEditMode ? $t('EditRoomType') : $t('AddRoomType') }}
            </h4>
          </div>

          <form class="flex flex-col">
            <div class="custom-scrollbar h-[500px] md:h-[510px] overflow-y-auto p-2">
              <div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-6">
                  <div>
                    <Input :lb="$t('RoomName')" :placeholder="$t('RoomName')" :id="'room'" :forLabel="'room'" v-model="form.name" />
                  </div>
                  <div>
                    <Input :lb="$t('DefaultGuest')" :placeholder="$t('DefaultGuest')" :id="'default_guest'" inputType="Number" :forLabel="'default_guest'" v-model.number="form.default_guest" />
                  </div>
                  <div>
                    <InputCurrency :lb="$t('price')" :placeholder="$t('price')" :id="'price'" :forLabel="'price'" v-model.number="form.price" />
                  </div>
                  <div>
                    <InputCurrency :lb="$t('ExtraGuestPrice')" :placeholder="$t('ExtraGuestPrice')" :id="'extra_guest'" :forLabel="'extra_guest'" v-model.number="form.extra_guest" />
                  </div>
                  <div>
                    <Input :lb="$t('Vat(%)')" :placeholder="$t('Vat')" :id="'vat'" inputType="Number" :disabled="true" :forLabel="'vat'" v-model.number="form.vat" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('final_price') }}</label>
                    <div class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800">
                      {{ formatted }}
                    </div>
                  </div>
                  <div>
                    <InputCurrency :lb="$t('DefaultDeposit')" :placeholder="$t('DefaultDeposit')" :id="'default_deposit'" :forLabel="'default_deposit'" v-model.number="form.default_deposit" />
                  </div>
                  <div>
                    <Select :lb="$t('Status')" :options="status" v-model="form.status" />
                  </div>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('Description') }}</label>
                  <textarea v-model="form.description" :placeholder="$t('Largetext')" rows="6" class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"></textarea>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
              <button @click="closeModal" type="button" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                {{ $t('Cancel') }}
              </button>
              <button :disabled="isLoading" type="button" class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto" @click.prevent="handleSubmit">
                <span v-if="!isLoading">{{ isEditMode ? $t('EditRoomType') : $t('AddRoomType') }}</span>
                <span v-else class="flex items-center gap-2">
                  <Spinner class="w-4 h-4" />
                  {{ $t('Processing') }}...
                </span>
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>

  <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
  <Spinner v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75" />
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { createRoomType, getTypeProductByServiceId,getRoomCountByRoomType } from '@/services/api'
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import type { RoomTypeData } from '@/types/option'
import { useServiceStore } from '@/composables/serviceStore'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import { updateRoomType, deleteRoomType } from '@/services/api'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import InputCurrency from '@/components/forms/FormElements/InputCurrency.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import { defaultRoomTypes } from '@/assets/data/roomtype'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

// États principaux
const isLoading = ref(false)
const loading = ref(true)
const loadingDelete = ref(false)
const selectedRoomTypeId = ref<number | null>(null)
const show = ref(false)
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const serviceStore = useServiceStore()
const modalOpen = ref(false)
const selectedRoomType = ref<any>(null)
const isEditMode = ref(false)

// Nouveaux états pour les vues
const viewMode = ref<'list' | 'grid'>('list')
const searchQuery = ref('')
const statusFilter = ref('')
const gridCurrentPage = ref<any>(1)
const gridPageSize = ref(12)

// Données
const roomTypeData = ref<RoomTypeData[]>([])
const currentPageTitle = computed(() => t('RoomTypes'))

const status = computed(() => [
  { value: 'active', label: t('Active') },
  { value: 'inactive', label: t('Inactive') },
])

const activeRoomTypes = computed(() => roomTypeData.value.filter(room => room.status === 'active').length)
const inactiveRoomTypes = computed(() => roomTypeData.value.filter(room => room.status === 'inactive').length)

// Filtrage pour la grille
const filteredGridData = computed(() => {
  let filtered = [...roomTypeData.value]

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(room => room.status === statusFilter.value)
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(room =>
      room.name.toLowerCase().includes(query) ||
      room.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Pagination pour la grille
const totalGridPages = computed(() => Math.ceil(filteredGridData.value.length / gridPageSize.value))

const paginatedGridData = computed(() => {
  const start = (gridCurrentPage.value - 1) * gridPageSize.value
  const end = start + gridPageSize.value
  return filteredGridData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalGridPages.value
  const current = gridCurrentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages.filter(page => page !== '...' || true)
})

// Titres pour le tableau (avec ajout du nombre de chambres)
const titles = computed(() => [
  {
    name: 'Name',
    label: t('Name'),
    type: 'TextRoom',
    sortable: true,
    filterable: false,
  },
  {
    name: 'description',
    label: t('description'),
    type: 'text',
    filterable: true,

  },
  {
    name: 'price',
    label: t('price'),
    type: 'currency',
    event: 'view',
    filterable: true,
    width: '100px',
  },
  {
    name: 'extraGuestPrice',
    label: t('ExtraGuestPrice'),
    type: 'currency',
    filterable: true,
    width: '100px',
  },
  {
    name: 'defaultDeposit',
    label: t('DefaultDeposit'),
    type: 'currency',
    filterable: true,
    width: '100px',
  },
  {
    name: 'defaultGuest',
    label: t('DefaultGuest'),
    type: 'text',
    filterable: true,
    width: '100px',
  },
  // {
  //   name: 'roomCount',
  //   label: t('RoomCount'),
  //   type: 'text',
  //   filterable: true,
  //   width: '50px',
  // },
  {
    name: 'statusColor',
    label: t('Status'),
    type: 'badge',
    filterable: false,
     width: '100px',
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'Edit',
        event: 'edit',
        icone: ` <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>`,
      },
      {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
        color: 'bg-red-100 text-red-600 px-2 py-1 rounded-full',
      },
    ],
  },
])

// Formulaire
const form = ref<any>({
  name: '',
  status: '',
  description: '',
  price: 0,
  default_guest: 0,
  extra_guest: 0,
  default_deposit: 0,
  vat: 19.25,
})


const totalWithVat = computed(() => {
  const base = form.value.price || 0
  const vatRate = form.value.vat || 0
  return Number((base + (base * vatRate) / 100).toFixed(2))
})

const formatted = computed(() => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(totalWithVat.value)
})


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'inactive':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// Fonctions API
const SaveRoomType = async () => {
  isLoading.value = true
  try {
    const serviceId = serviceStore.serviceId

    if (!serviceId) {
      throw new Error('Service ID is not defined')
    }
    const Payload = {
      name: form.value.name,
      description: form.value.description,
      status: form.value.status,
      service_id: serviceId,
      price: Number(totalWithVat.value),
      default_guest: form.value.default_guest,
      extra_guest_price: form.value.extra_guest,
      default_deposit: form.value.default_deposit,
    }

    const roomResponse = await createRoomType(Payload)
    modalOpen.value = false
    form.value = {
      name: '',
      status: '',
      description: '',
      price: 0,
      default_guest: 0,
      extra_guest: 0,
      default_deposit: 0,
      vat: 19.25,
    }
    console.log("roomResponse",roomResponse)
    fetchRoomType()
    toast.success(t('toast.roomtypesuccess'))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde', error)
    toast.error(t('toast.roomtypeerror'))
  } finally {
    isLoading.value = false
  }
}


const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId

    if (!serviceId) {
      throw new Error('Service ID is not defined')
    }

    const response = await getTypeProductByServiceId(serviceId)

    const typeIds = response.data.map((roomType:any) => roomType.id)
    const roomCounts = await Promise.all(
      typeIds.map((id:any) => getRoomCountByRoomType(serviceId,id))
    )
      console.log("roomCounts",roomCounts)
    const roomTypesWithCount = response.data.map((roomType:any, index:any) => {
      const statusClasses = getStatusColor(roomType.status).split(' ')

      return {
        ...roomType,
        Name : {
          name:roomType.name,
          roomCount: roomCounts[index].data.total_rooms || 0,
        },
        roomCount: roomCounts[index].data.total_rooms || 0,
        statusColor: {
          label: t(roomType.status),
          bg: statusClasses[0],
          text: statusClasses[1],
        },
      }
    })

    roomTypeData.value = roomTypesWithCount.sort((a:any, b:any) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}



const updateFormData = async () => {
  isLoading.value = true

  try {
    const serviceId = serviceStore.serviceId
    const id = selectedRoomTypeId.value

    if (!id) {
      toast.error(t('toast.selectError'))
      return
    }

    const roomTypePayload = {
      name: form.value.name,
      description: form.value.description,
      status: form.value.status,
      service_id: serviceId,
      price: Math.round(totalWithVat.value),
      default_guest: form.value.default_guest,
      extra_guest_price: form.value.extra_guest,
      default_deposit: form.value.default_deposit,
    }

    await updateRoomType(id, roomTypePayload)
    fetchRoomType()
    toast.success(t('toast.roomTypeUpdatedSuccess'))

    // Réinitialisation du formulaire
    form.value = {
      name: '',
      status: '',
      description: '',
      price: 0,
      default_guest: 0,
      extra_guest: 0,
      default_deposit: 0,
      vat: 19.25,
    }
    selectedRoomType.value = null
    isEditMode.value = false
    modalOpen.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    toast.error(t('toast.updateError'))
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async () => {
  if (selectedRoomTypeId.value !== null) {
    loadingDelete.value = true
    try {
      const serviceId = serviceStore.serviceId
      await deleteRoomType(selectedRoomTypeId.value,serviceId)
      toast.success(t('toast.roomTypeDeleted'))
      roomTypeData.value = roomTypeData.value.filter((r: any) => r.id !== selectedRoomTypeId.value)
    } catch (error: any) {
       if (error.response) {
      const code = error.response.data?.code || 'UNKNOWN'
      toast.error(t(`errors.${code}`) || t('errors.UNKNOWN'))
    } else {
      toast.error(t('errors.UNKNOWN'))
    }
    } finally {
      loadingDelete.value = false
      show.value = false
      selectedRoomTypeId.value = null
    }
  }
}

const importDefaultDefaults = async () => {
  const defaultRoomTypesData = defaultRoomTypes
  if (defaultRoomTypesData && defaultRoomTypesData.length > 0) {
    isLoading.value = true
    try {
      const serviceId = serviceStore.serviceId

      if (!serviceId) {
        throw new Error('Service ID is not defined')
      }

      for (const roomType of defaultRoomTypesData) {
        const Payload = {
          name: roomType.name,
          description: roomType.description,
          status: 'active',
          service_id: serviceId,
          price: roomType.Prix,
          default_guest: roomType.DefaultGuest,
          extra_guest_price: roomType.ExtraGuestPrice,
          default_deposit: roomType.DefaultDeposit,
        }

        await createRoomType(Payload)
      }

      fetchRoomType()
      toast.success(t('toast.defaultRoomTypesImported'))
    } catch (error) {
      console.error('Erreur lors de l\'importation des types de chambre par défaut', error)
      toast.error(t('toast.importError'))
    } finally {
      isLoading.value = false
    }
  }
}

// Gestionnaires d'événements
const onEditRoomType = (type: any) => handleBookingAction('edit', type)
const onDeleteRoomType = (type: any) => handleBookingAction('delete', type)

const handleBookingAction = (action: string, type: any) => {
  if (action === 'edit') {
    const roomTypeToEdit = roomTypeData.value.find((r: any) => r.id === Number(type.id))
    selectedRoomTypeId.value = type.id

    if (roomTypeToEdit) {
      const priceTTC = roomTypeToEdit.price
      const vatRate = form.value.vat || 0
      const priceHT = Math.round(priceTTC / (1 + vatRate / 100))

      form.value = {
        name: roomTypeToEdit.name,
        status: roomTypeToEdit.status,
        description: roomTypeToEdit.description,
        price: priceHT,
        default_guest: Number(roomTypeToEdit.defaultGuest),
        extra_guest: roomTypeToEdit.extraGuestPrice,
        default_deposit: roomTypeToEdit.defaultDeposit,
        vat: vatRate,
      }

      isEditMode.value = true
      modalOpen.value = true
    }
  } else if (action === 'delete') {
    selectedRoomTypeId.value = type.id
    show.value = true
  }
}

const handleSubmit = async () => {
  if (isEditMode.value) {
    await updateFormData()
  } else {
    await SaveRoomType()
  }
}

const closeModal = () => {
  form.value = {
    name: '',
    status: '',
    description: '',
    price: 0,
    default_guest: 0,
    extra_guest: 0,
    default_deposit: 0,
    vat: 19.25,
  }
  isEditMode.value = false
  modalOpen.value = false
}

const OpenModal = () => {
  modalOpen.value = true
  isEditMode.value = false
}

// Watchers
watch(locale, fetchRoomType)
watch(statusFilter, () => {
  gridCurrentPage.value = 1
})
watch(searchQuery, () => {
  gridCurrentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  await fetchRoomType()
  await new Promise((resolve) => setTimeout(resolve, 500))
  loading.value = false
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modern-table {
  @apply shadow-sm border border-gray-200 dark:border-gray-700;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
