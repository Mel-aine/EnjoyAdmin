
<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-semibold text-gray-900">{{ $t('OccupancyofRooms') }}</h1>
              <div class="ml-4 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                {{ roomStats.total }} {{ $t('Rooms') }}
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center space-x-3">
              <button
                @click="refreshRooms"
                :disabled="isLoading"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ $t('refresh') }}
              </button>

              <button
                @click="exportData"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ $t('export') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Dashboard -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ roomStats.available }}</p>
                  <p class="text-xs text-gray-500">{{ $t('Available') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ roomStats.occupied }}</p>
                  <p class="text-xs text-gray-500">{{ $t('Occupied') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ roomStats.booked }}</p>
                  <p class="text-xs text-gray-500">{{ $t('Booked') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ roomStats.cleaning }}</p>
                  <p class="text-xs text-gray-500">{{ $t('Cleaning') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ roomStats.maintenance }}</p>
                  <p class="text-xs text-gray-500">{{ $t('Maintenance') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ roomStats.out_of_order }}</p>
                  <p class="text-xs text-gray-500">{{ $t('statut.outOfOrder') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="p-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div class="flex items-center space-x-3">
                <!-- Search -->
                <div class="relative w-[500px]">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="$t('search ...')"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <!-- Status Filter -->
                <select
                  v-model="statusFilter"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">{{ $t('All_statuses') }}</option>
                  <option value="available">{{ $t('Available') }}</option>
                  <option value="booked">{{ $t('Booked') }}</option>
                  <option value="occupied">{{ $t('Occupied') }}</option>
                  <option value="out_of_order">{{ $t('statut.outOfOrder') }}</option>
                  <option value="cleaning">{{ $t('Cleaning') }}</option>
                  <option value="maintenance">{{ $t('Maintenance') }}</option>
                </select>

                <!-- Room Type Filter -->
                <select
                  v-model="roomTypeFilter"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">{{ $t('All_room_types') }}</option>
                  <option v-for="type in roomTypeData" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <div class="flex items-center space-x-3">
                <!-- Items per page -->
                <select
                  v-model="itemsPerPage"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="12">12 {{ $t('per_page') }}</option>
                  <option value="24">24 {{ $t('per_page') }}</option>
                  <option value="48">48 {{ $t('per_page') }}</option>
                  <option value="96">96 {{ $t('per_page') }}</option>
                </select>


              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white shadow rounded-lg">
          <div class="p-6">
            <div class="animate-pulse">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="n in 6" :key="n" class="bg-gray-200 h-48 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>


          <div  class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              <RoomCard
                v-for="room in paginatedRooms"
                :key="room.id"
                :room="room"
                :isCheckingIn="isCheckingIn"
                :isCheckingOut="isCheckingOut"
                @request-status-change="handleQuickStatusChange(room, $event)"
                @change="handleStatusChange"
                @maintenance-set = "handleMaintenance(room, $event)"
                @status-change="handleQuickStatusChange"
              />
            </div>
          </div>


        <!-- Pagination -->
        <div v-if="filteredRooms.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage > 1 && currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('Previous') }}
            </button>
            <button
              @click="currentPage < totalPages && currentPage++"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('Next') }}
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                {{ $t('showing') }}
                <span class="font-medium">{{ startIndex + 1 }}</span>
                {{ $t('to') }}
                <span class="font-medium">{{ Math.min(endIndex, filteredRooms.length) }}</span>
                {{ $t('of') }}
                <span class="font-medium">{{ filteredRooms.length }}</span>
                {{ $t('results') }}
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="currentPage > 1 && currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>

                <button
                  @click="currentPage < totalPages && currentPage++"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Change Modal -->
    <StatusChangeModal
      v-if="showStatusModal"
      :room="selectedRoom"
      :currentStatus="selectedRoom?.status"
      @updateStatus = "confirmStatusChange"
      @close="showStatusModal = false"
    />
    <!-- Modal de maintenance -->
    <div v-if="showMaintenanceModal" class="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full bg-black/25 bg-opacity-50 flex items-center justify-center modal z-99999 ">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ $t('maintenanceSetup') }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('reason') }}</label>
            <select v-model="maintenanceForm.reason" class="w-full p-2 border border-gray-300 rounded-md">
              <option value="plumbing">{{ $t('plumbing') }}</option>
              <option value="electrical">{{ $t('electrical') }}</option>
              <option value="cleaning">{{ $t('deepCleaning') }}</option>
              <option value="renovation">{{ $t('renovation') }}</option>
              <option value="other">{{ $t('other') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('priority') }}</label>
            <select v-model="maintenanceForm.priority" class="w-full p-2 border border-gray-300 rounded-md">
              <option value="low">{{ $t('priority.low') }}</option>
              <option value="medium">{{ $t('priority.medium') }}</option>
              <option value="high">{{ $t('priority.high') }}</option>
              <option value="urgent">{{ $t('priority.urgent') }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('debut') }}</label>
            <input v-model="maintenanceForm.estimatedDuration" type="date" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Heures">
          </div>
           <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('fin') }}</label>
            <input v-model="maintenanceForm.estimatedDuration" type="date" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Heures">
          </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('notes') }}</label>
            <textarea v-model="maintenanceForm.notes" class="w-full p-2 border border-gray-300 rounded-md" rows="3"></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="showMaintenanceModal = false" class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            {{ $t('cancel') }}
          </button>
          <button @click="confirmMaintenance" class="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
            {{ $t('confirm') }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { ref, computed, onMounted, watch } from 'vue'
import RoomCard from './RoomCard.vue'
import StatusChangeModal from './StatusChangeModal.vue'
import { useServiceStore } from '@/composables/serviceStore';
import { getServiceProductWithOptions, getTypeProductByServiceId,updateRoomStatus } from "@/services/api";
import { checkInReservations, checkOutReservations, getRoomReservations } from "@/services/reservation";


// State variables
const serviceProducts = ref<any[]>([]);
const serviceStore = useServiceStore();
const statusFilter = ref('');
const roomTypeFilter = ref('');
const searchQuery = ref('');
const loading = ref(false);
const error = ref('');
const isCheckingIn = ref(false);
const isCheckingOut = ref(false);
const isLoading = ref(false);
const roomTypeData = ref<any[]>([]);
const itemsPerPage = ref(12);
const currentPage = ref<any>(1);
const showStatusModal = ref(false);
const selectedRoom = ref<any>(null);
const showMaintenanceModal = ref(false)

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredRooms.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
});

const paginatedRooms = computed(() => {
  return filteredRooms.value.slice(startIndex.value, endIndex.value);
});

// Watch for filter changes to reset pagination
watch([statusFilter, roomTypeFilter, searchQuery, itemsPerPage], () => {
  currentPage.value = 1;
});

const fetchServiceProduct = async () => {
  loading.value = true;
  error.value = '';

  try {
    const serviceId = serviceStore.serviceId;
    const response = await getServiceProductWithOptions(serviceId);
    const serviceProductsData = response.data;

    if (Array.isArray(serviceProductsData)) {
      const serviceProductWithOptions = await Promise.all(
        serviceProductsData.map(async (product: any) => {
          const associatedOptions = product.options?.filter((option: any) =>
            option.serviceProductId === product.id
          ) || [];

          let reservations: any[] = [];

          try {
            const response = await getRoomReservations(product.id);
            reservations = response;
          } catch (error) {
            console.warn(`Erreur lors de la récupération des réservations pour ${product.id}:`, error);
          }

          let nextAvailable: string | null = null;
          let checkOutTime: string | null = null;

          const reservationsWithDepartDate = reservations.filter(r => r.reservation?.departDate);

          if (reservationsWithDepartDate.length > 0) {
            const sortedByDepartDateDesc = reservationsWithDepartDate.sort(
              (a, b) => new Date(b.reservation.departDate).getTime() - new Date(a.reservation.departDate).getTime()
            );

            const latestReservation = sortedByDepartDateDesc[0];
            nextAvailable = latestReservation?.reservation?.departDate || null;
            checkOutTime = latestReservation?.reservation?.departDate || null;
          }


          const checkedInGuest = reservations.find((r: any) => r.reservation.status === 'checked-in');
          const guestName = checkedInGuest
            ? `${checkedInGuest.creator?.firstName ?? ''} ${checkedInGuest.creator?.lastName ?? ''}`.trim()
            : null;

          return {
            ...product,
            options: associatedOptions,
            reservations: reservations,
            guestName: guestName,
            nextAvailable,
            checkOutTime,
            status: product.status || 'available'
          };
        })
      );

      serviceProducts.value = serviceProductWithOptions;
    }
  } catch (error: any) {
    console.error('Erreur lors de la récupération des produits:', error);
    error.value = 'Erreur lors du chargement des chambres';
  } finally {
    loading.value = false;
  }
};

const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getTypeProductByServiceId(serviceId);

    roomTypeData.value = response.data
      .filter((type: any) => type.status === 'active')
      .map((item: any) => ({
        ...item,
        value: item.id,
        label: item.name,
      }));
  } catch (error) {
    console.error('Erreur lors de la récupération des roomtypes:', error);
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([fetchServiceProduct(), fetchRoomType()]);
  } catch (e) {
    console.error("Erreur lors du fetch des données:", e);
  } finally {
    isLoading.value = false;
  }
});

// Flatten service products for display
const flattenServiceProducts = computed(() => {
  const products = serviceProducts.value.length > 0 ? serviceProducts.value : [];

  return products.map((product: any) => {
    const flatProduct: any = {
      ...product,
      productTypeName: getRoomTypeName(product.productTypeId)
    };

    product.options?.forEach((option: any) => {
      const key = `option_${option.optionId}`;
      flatProduct[key] = option.value;
    });

    return flatProduct;
  });
});

// Filtered rooms based on status, type, and search
const filteredRooms = computed(() => {
  let filtered = flattenServiceProducts.value;

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter((room: any) => room.status === statusFilter.value);
  }

  // Filter by room type
  if (roomTypeFilter.value) {
    filtered = filtered.filter((room: any) => room.productTypeId === roomTypeFilter.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((room: any) =>
      room.productName?.toLowerCase().includes(query) ||
      room.productTypeName?.toLowerCase().includes(query) ||
      room.guestName?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Room statistics
const roomStats = computed(() => {
  const stats = {
    available: 0,
    booked: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
    out_of_order: 0,
    total: flattenServiceProducts.value.length
  };

  flattenServiceProducts.value.forEach((room: any) => {
    if (stats.hasOwnProperty(room.status)) {
      stats[room.status as keyof typeof stats]++;
    }
  });

  return stats;
});

const getRoomTypeName = (id: number): string => {
  return roomTypeData.value.find((t: any) => t.value === id)?.label || '';
};


const refreshRooms = async () => {
  await fetchServiceProduct();
};

const exportData = () => {
  const data = filteredRooms.value.map(room => ({
    room: room.productName,
    type: room.productTypeName,
    status: room.status,
  }));

  const csv = [
    ['Room', 'Type', 'Status'],
    ...data.map((row:any) => Object.values(row))
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rooms-export.csv';
  a.click();
  URL.revokeObjectURL(url);
};


const handleStatusChange = async (payload: any) => {
  let roomId: number, newStatus: string
  let force = false

  // 📦 Format flexible
  if (payload.roomId && payload.newStatus) {
    roomId = payload.roomId
    newStatus = payload.newStatus
  } else if (payload.room && payload.status) {
    roomId = payload.room.id
    newStatus = payload.status
  } else {
    console.error("handleStatusChange appelé avec un payload invalide :", payload)
    return
  }

  const roomToUpdate = serviceProducts.value.find((r: any) => r.id === roomId)

  if (!roomToUpdate) {
    console.warn(`Chambre avec ID ${roomId} non trouvée.`)
    return
  }

  // ✅ Mettre à jour localement pour UI instantanée
  roomToUpdate.status = newStatus

  const tryUpdate = async (forced = false) => {
    try {
      await updateRoomStatus(roomId, newStatus, forced)
      console.log(`✅ Statut de la chambre ${roomId} mis à jour sur le serveur.`)
    } catch (error: any) {
      // ⚠️ Si la chambre est occupée et que l'API demande un forçage
      if (error?.message?.includes("forcer") || error?.message?.includes("occupée")) {
        const confirmed = window.confirm("La chambre est occupée. Voulez-vous forcer le changement de statut ?")
        if (confirmed) {
          await tryUpdate(true)
        } else {
          // 🔄 Rétablir l'ancien statut si refus
          roomToUpdate.status = payload.room?.status || 'available'
          console.info(`Changement annulé.`)
        }
      } else {
        console.error("Erreur API :", error)
      }
    }
  }

  await tryUpdate(force)

  if (newStatus === 'cleaning') {
    setTimeout(() => {
      if (roomToUpdate.status === 'cleaning') {
        roomToUpdate.status = 'available'
        updateRoomStatus(roomId, 'available', false).catch((e) =>
          console.error("Erreur maj auto cleaning → available :", e)
        )
      }
    }, 1800000)
  }

  // 🧹 Suppression des données clients si maintenance
  if (newStatus === 'maintenance') {
    delete roomToUpdate.guestName
    delete roomToUpdate.checkInTime
    delete roomToUpdate.checkOutTime
    delete roomToUpdate.nextAvailable
    console.log(`Données client supprimées pour la chambre ${roomToUpdate.id} (maintenance).`)
  }

  console.log(`✅ Chambre ${roomToUpdate.productName} → ${newStatus}`)
}


const handleQuickStatusChange = (room: any, newStatus: string) => {
  selectedRoom.value = room;
  showStatusModal.value = true;
};

const handleMaintenance = (room:any,newStatus: string)=>{
  selectedRoom.value = room;
  showMaintenanceModal.value = true;
}

// const confirmMaintenance = () => {
//   const maintenanceData = {
//     reason: maintenanceForm.value.reason,
//     priority: maintenanceForm.value.priority,
//     estimatedDuration: maintenanceForm.value.estimatedDuration,
//     notes: maintenanceForm.value.notes,
//     startDate: new Date().toISOString(),
//     estimatedEndDate: maintenanceForm.value.estimatedDuration
//       ? new Date(Date.now() + (maintenanceForm.value.estimatedDuration * 60 * 60 * 1000)).toISOString()
//       : null
//   }

//   // emit('maintenance-set', { room: props.room, maintenanceData })
//   showMaintenanceModal.value = false

//   Object.keys(maintenanceForm).forEach(key => {
//     maintenanceForm[key] = key === 'reason' ? 'plumbing' : key === 'priority' ? 'medium' : ''
//   })
// }
const confirmStatusChange = (payload: { roomId: number | string; newStatus: string }) => {
  handleStatusChange(payload);
  showStatusModal.value = false;
  selectedRoom.value = null;
};

/*const notifySuccess = (message: string) => alert(message);
const notifyError = (message: string) => alert(message);

// mise à jour locale
const updateLocalReservationState = (room: any, wrapperId: number, guestName: string) => {
  const now = new Date().toISOString();

  const reservationIndex = room.reservations.findIndex((res: any) => res.id === wrapperId);
  if (reservationIndex !== -1) {
    room.reservations[reservationIndex].reservation.status = 'checked-in';
    room.reservations[reservationIndex].reservation.check_in_date = now;
  }

  const roomToUpdate = serviceProducts.value.find((r: any) => r.id === room.id);
  if (roomToUpdate) {
    roomToUpdate.status = 'occupied';
    roomToUpdate.guestName = guestName;
    roomToUpdate.checkInTime = now;
  }
};

 de check-in et check out
const handleCheckIn = async (room: any) => {
  isCheckingIn.value = true;

  try {
    console.log(`[handleCheckIn] Début du check-in pour la chambre:`, room.name || room.productName);

   const confirmedWrapper = room.reservations?.find(
      (res: any) => res.reservation?.status?.toLowerCase() === 'confirmed'
    );

    console.log("confirmedWrapper", room.reservations)

    if (!confirmedWrapper) {
      console.warn('[handleCheckIn] Aucun wrapper avec status "confirmed" trouvé');
      room.reservations?.forEach((res: any, i: number) => {
        console.log(`→ Réservation ${i}: wrapper.status = ${res.status}`);
      });
      notifyError('Aucune réservation confirmée trouvée pour cette chambre.');
      return;
    }


    const reservationId = confirmedWrapper.reservation.id;
    const reservationServiceProductId = confirmedWrapper.id;
    const guestName = confirmedWrapper.creator?.firstName || 'Client inconnu';

    console.log(`[handleCheckIn] Client: ${guestName}, Reservation ID: ${reservationId}`);

    const result = await checkInReservations(reservationId, [reservationServiceProductId]);

    const updatedReservation = result.reservation;
    const updatedProducts = result.reservationProducts;

    console.log(`[handleCheckIn] API Check-in réussi`, updatedReservation, updatedProducts);

    updateLocalReservationState(room, reservationServiceProductId, guestName);

    await fetchServiceProduct();

    console.log(`[handleCheckIn] Check-in terminé pour ${reservationId}`);
    notifySuccess(`Check-in réussi pour ${guestName}`);

  } catch (apiError: any) {
    console.error('[handleCheckIn] Erreur lors du check-in:', apiError);

    if (apiError.response) {
      const status = apiError.response.status;
      const data = apiError.response.data;

      switch (status) {
        case 404:
          notifyError('Réservation ou produit non trouvé. Veuillez actualiser la page.');
          break;
        case 400:
          notifyError('Données invalides pour le check-in. Veuillez vérifier.');
          break;
        case 500:
          notifyError('Erreur serveur. Veuillez réessayer.');
          break;
        default:
          notifyError(`Erreur: ${data?.message || 'Erreur inconnue.'}`);
      }
    } else if (apiError.request) {
      notifyError('Le serveur ne répond pas. Vérifiez votre connexion.');
    } else {
      notifyError('Erreur technique lors du check-in.');
    }
  } finally {
    isCheckingIn.value = false;
  }
};


// const handleCheckOut = async (room: any) => {
//   isCheckingOut.value = true;
//   try {
//     console.log(`Début du check-out pour la chambre : ${room.name || room.productName} (ID: ${room.id})`);

//     if (!room.reservations?.length) {
//       console.log("Aucune réservation trouvée pour cette chambre.");
//       alert("Aucune réservation trouvée.");
//       return;
//     }

//     const checkedInWrapper = room.reservations.find(
//       (res: any) => res.reservation.status === 'checked-in'
//     );
//     console.log("checkedInWrapper",room.reservation)

//     if (!checkedInWrapper) {
//       console.log("Aucune réservation avec status 'checked-in' trouvée.");
//       alert("Aucune réservation en cours trouvée pour cette chambre.");
//       return;
//     }

//     const reservationId = checkedInWrapper.reservation.id;
//     const reservationServiceProductId = checkedInWrapper.id;
//     const guestName = checkedInWrapper.creator?.firstName || 'Client inconnu';

//     console.log(`[handleCheckOut] Reservation ID: ${reservationId}`);
//     console.log(`[handleCheckOut] ReservationServiceProduct ID: ${reservationServiceProductId}`);

//     const result = await checkOutReservations(reservationId, [reservationServiceProductId])
//     console.log("[handleCheckOut] Réponse API:", result?.data);

//     checkedInWrapper.status = 'checked-out';
//     checkedInWrapper.check_out_date = new Date().toISOString();

//     const roomToUpdate = serviceProducts.value.find((r) => r.id === room.id);
//     if (roomToUpdate) {
//       roomToUpdate.status = 'checked-out';
//       roomToUpdate.checkOutTime = new Date().toISOString();
//       console.log(`→ Chambre mise à jour localement : status = 'checked-out', checkOutTime = ${roomToUpdate.checkOutTime}`);
//     }

//     await fetchServiceProduct();
//     alert(`Check-out réussi pour ${guestName}`);
//   } catch (error: any) {
//     console.error("Erreur lors du check-out :", error);
//     alert("Erreur lors du check-out. Veuillez réessayer.");
//   } finally {
//     isCheckingOut.value = false;
//   }
// };
*/


const maintenanceForm = ref({
  reason: 'plumbing',
  priority: 'medium',
  estimatedDuration: '',
  notes: ''
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
