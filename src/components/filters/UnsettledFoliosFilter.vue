<template>
  <div class="flex justify-end">
    <BasicButton @click="showFilter = true" variant="secondary" :icon="FilterIcon"
      :label="$t('reservationsList.filterSectionTitle')">
    </BasicButton>
  </div>
  
  <RightSideModal :is-open="showFilter" :title="$t('reservationsList.filterSectionTitle')"
    @close="showFilter = false">
    <div class="grid grid-cols-1 gap-6">
      <!-- Search by dropdown and input -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select :lb="'Search by'" v-model="filters.searchBy" :options="searchByOptions" />
        
        <Input :lb="'Search'" :inputType="'text'"
          :placeholder="'Folio#, Res#, G...'"
          :id="'searchText'"
          :forLabel="'search'"
          v-model="filters.searchText" />
      </div>

      <!-- Arrival section -->
      <div class="space-y-3">
        <div class="flex items-center">
          <input v-model="filters.arrivalEnabled" type="checkbox" id="arrival" 
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label for="arrival" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Arrival</label>
        </div>
        
        <div v-if="filters.arrivalEnabled" class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:pl-6 items-end">
          <InputDatePicker 
            :lb="'From Date'" 
            :inputType="'date'"
            :id="'dateFrom'"
            :forLabel="'dateFrom'"
            v-model="filters.dateFrom"
            :placeholder="'01/09/20'" 
          />
          
          <div class="flex justify-center py-2 md:py-0">
            <span class="text-gray-500 text-lg md:mb-1">→</span>
          </div>
          
          <InputDatePicker 
            :lb="'To Date'" 
            :inputType="'date'"
            :id="'dateTo'"
            :forLabel="'dateTo'"
            v-model="filters.dateTo"
            :placeholder="'31/10/20'" 
          />
        </div>
      </div>

      <!-- Status dropdown -->
      <Select :lb="'Status'" v-model="filters.status" :options="statusOptions" />

      <!-- Additional note -->
      <div class="text-center pt-2">
        <p class="text-sm text-red-500">You can also filter the date as per your requirement</p>
      </div>

      <!-- Action buttons -->
      <div class="mt-2 flex flex-col-reverse sm:flex-row justify-end gap-3">
        <BasicButton @click="clearFilters" variant="secondary" :icon="XCircleIcon"
          :label="$t('reservationsList.clearFilters')" class="w-full sm:w-auto">
        </BasicButton>
        <BasicButton @click="applyFilters" variant="primary" :icon="SearchIcon"
          :label="$t('reservationsList.applyFilters')" class="w-full sm:w-auto">
        </BasicButton>
      </div>
    </div>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon
} from 'lucide-vue-next';
import RightSideModal from '@/components/modal/RightSideModal.vue';
import Input from '@/components/forms/FormElements/Input.vue';
import Select from '@/components/forms/FormElements/Select.vue';
import BasicButton from '@/components/buttons/BasicButton.vue';
import { getTypeProductByServiceId } from '@/services/api';
import type { RoomTypeData } from '@/types/option';
import { useServiceStore } from '@/composables/serviceStore';
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue';

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
const serviceStore = useServiceStore();
const activeRoomTypes = ref<RoomTypeData[]>([]);

// Options for dropdowns using the same pattern as the first component
const searchByOptions = computed(() => [
  { label: 'All', value: 'all' },
  { label: 'Folio#', value: 'folio' },
  { label: 'Guest Name', value: 'guest' },
  { label: 'Reservation#', value: 'reservation' }
]);

const statusOptions = computed(() => [
  { label: '-Select-', value: '' },
  { label: 'Checked Out', value: 'Checked Out' },
  { label: 'Cancel', value: 'Cancel' },
  { label: 'Open', value: 'Open' },
  { label: 'Pending', value: 'Pending' }
]);

const applyFilters = () => {
  emits('filter', filters.value);
  showFilter.value = false; // Close modal after applying filters
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
    const serviceId = serviceStore.serviceId;
    const response = await getTypeProductByServiceId(serviceId);

    activeRoomTypes.value = response.data
      .filter((type: RoomTypeData) => type.status === 'active')
      .map((item: RoomTypeData) => ({
        ...item,
        value: item.id,
        label: item.roomTypeName,
      }));
  } catch (error) {
    console.error('Error fetching room types:', error);
  }
};

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