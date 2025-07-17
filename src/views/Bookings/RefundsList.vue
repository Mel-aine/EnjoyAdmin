<!-- RefundsList.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header of the component -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center rounded-t-xl">
        <h1 class="text-3xl font-bold mb-2">{{ $t('refundsList.headerTitle') }}</h1>
        <p class="text-lg">{{ $t('refundsList.headerSubtitle') }}</p>
      </div>

      <!-- Filter Section -->
      <div class="p-6 bg-gray-50 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FilterIcon class="mr-2 text-blue-600" :size="20" /> {{ $t('refundsList.filterSectionTitle') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date Range Filter -->
          <div>
            <label for="startDate" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('refundsList.filterStartDate') }}:</label>
            <input
              type="date"
              id="startDate"
              v-model="filters.startDate"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          <div>
            <label for="endDate" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('refundsList.filterEndDate') }}:</label>
            <input
              type="date"
              id="endDate"
              v-model="filters.endDate"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>

          <!-- Room Type Filter -->
          <div>
            <label for="roomType" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('refundsList.filterRoomType') }}:</label>
            <select
              id="roomType"
              v-model="filters.roomType"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="">{{ $t('refundsList.filterAll') }}</option>
              <option v-for="type in uniqueRoomTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <!-- Specific Room Filter -->
          <div>
            <label for="specificRoom" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('refundsList.filterSpecificRoom') }}:</label>
            <select
              id="specificRoom"
              v-model="filters.specificRoomId"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="">{{ $t('refundsList.filterAll') }}</option>
              <option v-for="room in uniqueRooms" :key="room.id" :value="room.id">{{ room.productName }}</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="applyFilters"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <SearchIcon class="mr-2" :size="18" /> {{ $t('refundsList.applyFilters') }}
          </button>
          <button
            @click="clearFilters"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <XCircleIcon class="mr-2" :size="18" /> {{ $t('refundsList.clearFilters') }}
          </button>
        </div>
      </div>

      <!-- Refunds List Section -->
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <ListIcon class="mr-2 text-blue-600" :size="20" /> {{ $t('refundsList.listSectionTitle') }}
        </h2>
        <div v-if="filteredRefunds.length > 0" class="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableRefundId') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableReservationId') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableGuestName') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableRoom') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableRoomType') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableAmount') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableMethod') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableDate') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableReason') }}</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ $t('refundsList.tableStatus') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="refund in filteredRefunds" :key="refund.refund_id" class="border-b last:border-b-0 hover:bg-gray-50">
                <td class="py-3 px-4 text-sm text-gray-800">{{ refund.refund_id }}</td>
                <td class="py-3 px-4 text-sm text-gray-800">{{ refund.reservation_id }}</td>
                <td class="py-3 px-4 text-sm text-gray-800">{{ getGuestName(refund.reservation_id) }}</td>
                <td class="py-3 px-4 text-sm text-gray-800">{{ getRoomName(refund.reservation_id) }}</td>
                <td class="py-3 px-4 text-sm text-gray-800">{{ getRoomType(refund.reservation_id) }}</td>
                <td class="py-3 px-4 text-sm text-green-700 font-semibold">{{ formatCurrency(refund.refund_amount) }}</td>
                <td class="py-3 px-4 text-sm text-gray-800">{{ refund.refund_method }}</td>
                <td class="py-3 px-4 text-sm text-gray-800">{{ formatDate(refund.refund_date) }}</td>
                <td class="py-3 px-4 text-sm text-gray-800">{{ refund.reason }}</td>
                <td class="py-3 px-4 text-sm">
                  <span :class="getStatusClass(refund.status)">{{ refund.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-center text-gray-600 italic py-8">{{ $t('refundsList.noRefundsFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon, List as ListIcon
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

// --- Type Definitions (based on your relational model) ---
interface Refund {
  refund_id: number;
  reservation_id: number;
  payment_id_original: number | null;
  refund_amount: number;
  refund_date: string; // DATETIME string
  refund_method: string;
  transaction_reference: string | null;
  reason: string;
  processed_by_user_id: number;
  status: 'Pending' | 'Completed' | 'Failed';
  created_at: string;
  updated_at: string;
}

// Simplified Reservation type for linking
interface Reservation {
  id: number;
  userId: number;
  user: {
    firstName: string;
    lastName: string;
  };
  reservationServiceProducts: {
    serviceProductId: number;
    serviceProduct: {
      id: number;
      productName: string; // e.g., "Room 700"
      description: string; // e.g., "Chambre standard"
    };
  }[];
}

// --- End Type Definitions ---

const { t } = useI18n();

// Mock Data (simulating data fetched from backend)
const allRefunds = ref<Refund[]>([
  {
    refund_id: 1, reservation_id: 93, payment_id_original: null, refund_amount: 50000.00,
    refund_date: "2025-07-15T10:00:00Z", refund_method: "Credit Card", transaction_reference: "REF123",
    reason: "Annulation dans le délai gratuit", processed_by_user_id: 4, status: "Completed",
    created_at: "2025-07-15T09:50:00Z", updated_at: "2025-07-15T10:00:00Z"
  },
  {
    refund_id: 2, reservation_id: 94, payment_id_original: 101, refund_amount: 25000.00,
    refund_date: "2025-07-14T14:30:00Z", refund_method: "Mobile Money", transaction_reference: "MMREF456",
    reason: "Annulation hors délai - frais déduits", processed_by_user_id: 4, status: "Pending",
    created_at: "2025-07-14T14:00:00Z", updated_at: "2025-07-14T14:30:00Z"
  },
  {
    refund_id: 3, reservation_id: 95, payment_id_original: 201, refund_amount: 10000.00,
    refund_date: "2025-07-13T09:00:00Z", refund_method: "Bank Transfer", transaction_reference: "BTREF789",
    reason: "Surpaiement", processed_by_user_id: 4, status: "Completed",
    created_at: "2025-07-13T08:50:00Z", updated_at: "2025-07-13T09:00:00Z"
  },
  {
    refund_id: 4, reservation_id: 93, payment_id_original: null, refund_amount: 10000.00,
    refund_date: "2025-07-16T11:00:00Z", refund_method: "Credit Card", transaction_reference: "REF124",
    reason: "Annulation dans le délai gratuit", processed_by_user_id: 4, status: "Completed",
    created_at: "2025-07-16T10:50:00Z", updated_at: "2025-07-16T11:00:00Z"
  },
]);

const allReservations = ref<Reservation[]>([
  {
    id: 93, userId: 109,
    user: { firstName: "Styves", lastName: "Tchio" },
    reservationServiceProducts: [
      { serviceProductId: 12, serviceProduct: { id: 12, productName: "Room 700", description: "Standard Room" } },
      { serviceProductId: 46, serviceProduct: { id: 46, productName: "Room 001", description: "Deluxe Room" } },
    ]
  },
  {
    id: 94, userId: 110,
    user: { firstName: "Alice", lastName: "Smith" },
    reservationServiceProducts: [
      { serviceProductId: 13, serviceProduct: { id: 13, productName: "Room 205", description: "Suite" } },
    ]
  },
  {
    id: 95, userId: 111,
    user: { firstName: "Bob", lastName: "Johnson" },
    reservationServiceProducts: [
      { serviceProductId: 14, serviceProduct: { id: 14, productName: "Room 301", description: "Standard Room" } },
    ]
  },
]);

// Filter state
const filters = ref({
  startDate: '',
  endDate: '',
  roomType: '',
  specificRoomId: '',
});

// Computed properties for dropdown options
const uniqueRoomTypes = computed(() => {
  const types = new Set<string>();
  allReservations.value.forEach(res => {
    res.reservationServiceProducts.forEach(prod => {
      types.add(prod.serviceProduct.description); // Using description as room type for simplicity
    });
  });
  return Array.from(types);
});

const uniqueRooms = computed(() => {
  const rooms = new Map<number, { id: number; productName: string; description: string }>();
  allReservations.value.forEach(res => {
    res.reservationServiceProducts.forEach(prod => {
      if (!rooms.has(prod.serviceProduct.id)) {
        rooms.set(prod.serviceProduct.id, prod.serviceProduct);
      }
    });
  });
  return Array.from(rooms.values());
});

// Function to get guest name by reservation ID
const getGuestName = (reservationId: number) => {
  const reservation = allReservations.value.find(res => res.id === reservationId);
  return reservation ? `${reservation.user.firstName} ${reservation.user.lastName}` : 'N/A';
};

// Function to get room name by reservation ID (assuming one main room per reservation for simplicity)
const getRoomName = (reservationId: number) => {
  const reservation = allReservations.value.find(res => res.id === reservationId);
  return reservation && reservation.reservationServiceProducts.length > 0
    ? reservation.reservationServiceProducts[0].serviceProduct.productName
    : 'N/A';
};

// Function to get room type by reservation ID (assuming one main room per reservation for simplicity)
const getRoomType = (reservationId: number) => {
  const reservation = allReservations.value.find(res => res.id === reservationId);
  return reservation && reservation.reservationServiceProducts.length > 0
    ? reservation.reservationServiceProducts[0].serviceProduct.description
    : 'N/A';
};

// Formatter functions
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(t('locale'), options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(t('locale'), { style: 'currency', currency: 'XAF' }).format(amount);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Completed': return 'px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800';
    case 'Pending': return 'px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800';
    case 'Failed': return 'px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800';
    default: return 'px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
  }
};

// Filtered refunds logic
const filteredRefunds = ref<Refund[]>([]);

const applyFilters = () => {
  filteredRefunds.value = allRefunds.value.filter(refund => {
    const refundDate = new Date(refund.refund_date);
    const startDate = filters.value.startDate ? new Date(filters.value.startDate) : null;
    const endDate = filters.value.endDate ? new Date(filters.value.endDate) : null;

    // Date filter
    if (startDate && refundDate < startDate) return false;
    if (endDate && refundDate > endDate) return false;

    // Room Type filter
    if (filters.value.roomType) {
      const roomType = getRoomType(refund.reservation_id);
      if (roomType !== filters.value.roomType) return false;
    }

    // Specific Room filter
    if (filters.value.specificRoomId) {
      const reservation = allReservations.value.find(res => res.id === refund.reservation_id);
      if (!reservation || !reservation.reservationServiceProducts.some(p => p.serviceProduct.id === parseInt(filters.value.specificRoomId))) {
        return false;
      }
    }

    return true;
  });
};

const clearFilters = () => {
  filters.value.startDate = '';
  filters.value.endDate = '';
  filters.value.roomType = '';
  filters.value.specificRoomId = '';
  applyFilters(); // Re-apply filters to show all
};

// Initial filter application on component mount
onMounted(() => {
  applyFilters();
});
</script>

<style>
/* Tailwind CSS is typically configured via PostCSS in a Vue project.
   The CDN link would be in your public/index.html or similar. */
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
