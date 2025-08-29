<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search</h3>
    
    <!-- Search by dropdown and input -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search by</label>
        <select v-model="filters.searchBy" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
          <option value="all">All</option>
          <option value="folio">Folio#</option>
          <option value="guest">Guest Name</option>
          <option value="reservation">Reservation#</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
        <input v-model="filters.searchText" type="text" placeholder="Folio#, Res#, G..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400" />
      </div>
    </div>

    <!-- Arrival checkbox and date range -->
    <div class="mb-4">
      <div class="flex items-center mb-2">
        <input v-model="filters.arrivalEnabled" type="checkbox" id="arrival" 
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
        <label for="arrival" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Arrival</label>
      </div>
      
      <div v-if="filters.arrivalEnabled" class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
        <div class="relative">
          <flat-pickr v-model="filters.dateFrom" :config="flatpickrConfig"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="01/09/20" />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <CalendarIcon class="h-4 w-4" />
          </span>
        </div>
        
        <div class="flex items-center">
          <span class="text-gray-500 mx-2">→</span>
          <div class="relative flex-1">
            <flat-pickr v-model="filters.dateTo" :config="flatpickrConfig"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="31/10/20" />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CalendarIcon class="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Status dropdown -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
      <select v-model="filters.status" 
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
        <option value="">-Select-</option>
        <option value="Checked Out">Checked Out</option>
        <option value="Cancel">Cancel</option>
        <option value="Open">Open</option>
        <option value="Pending">Pending</option>
      </select>
    </div>

    <!-- Action buttons -->
    <div class="flex justify-between items-center">
      <button @click="clearFilters" 
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
        Clear
      </button>
      
      <button @click="applyFilters" 
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Search
      </button>
    </div>
    
    <!-- Additional note -->
    <div class="mt-4 text-center">
      <p class="text-sm text-red-500">You can also filter the date as per your requirement</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon
} from 'lucide-vue-next';
import RightSideModal from '@/components/modal/RightSideModal.vue';
import Input from '@/components/forms/FormElements/Input.vue';
import BasicButton from '@/components/buttons/BasicButton.vue';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import CalendarIcon from '@/icons/CalendarIcon.vue';
import { getTypeProductByServiceId } from '@/services/api';
import type { RoomTypeData } from '@/types/option';
import { useServiceStore } from '@/composables/serviceStore';

// Define folio filter interface
interface FolioFilterItem {
  searchBy: string;
  searchText: string;
  status: string;
  arrivalEnabled: boolean;
  dateFrom: string;
  dateTo: string;
}

const emits = defineEmits(['filter']);
defineProps({
  showDate: {
    type: Boolean,
    default: true
  }
})

// Filter state
const filters = ref<FolioFilterItem>({
  searchBy: 'all',
  searchText: '',
  status: '',
  arrivalEnabled: false,
  dateFrom: '',
  dateTo: '',
});

const showFilter = ref(false);
const serviceStore = useServiceStore()

// Options for status dropdown
const statusOptions = ref([
  'Open', 'Closed', 'Pending', 'Disputed'
]);

const flatpickrConfig = {
  dateFormat: 'd/m/y',
  altInput: false,
  wrap: false,
}

const activeRoomTypes = ref<RoomTypeData[]>([]);

const applyFilters = () => {
  emits('filter', filters.value)
};

const clearFilters = () => {
  filters.value.searchBy = 'all';
  filters.value.searchText = '';
  filters.value.status = '';
  filters.value.arrivalEnabled = false;
  filters.value.dateFrom = '';
  filters.value.dateTo = '';
  applyFilters(); // Re-apply filters to show all
};

const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getTypeProductByServiceId(serviceId)

    activeRoomTypes.value = response.data
      .filter((type: RoomTypeData) => type.status === 'active')
      .map((item: RoomTypeData) => ({
        ...item,
        value: item.id,
        label: item.name,
      }))
  } catch (error) {
    console.error('Error fetching room types:', error)
  }
}

// Initial filter application on component mount
onMounted(() => {
  fetchRoomType();
  applyFilters();
});
</script>

<style>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>