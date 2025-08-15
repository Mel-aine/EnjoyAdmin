<template>
  <div class="flex justify-end mb-3">
    <BasicButton @click="showFilter = true" variant="secondary" :icon="FilterIcon"
      :label="$t('unsettledFolios.filterSectionTitle')">
    </BasicButton>
  </div>
  <RightSideModal :is-open="showFilter" :title="$t('unsettledFolios.filterSectionTitle')"
    @close="showFilter = false">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <!-- Search by Guest Name/Folio Number -->
      <div class="lg:col-span-2">
        <Input :lb="$t('unsettledFolios.searchByGuestOrFolio')" :inputType="'text'"
          :placeholder="$t('unsettledFolios.searchPlaceholder')" :id="'searchText'"
          :forLabel="'unsettledFolios.searchByGuestOrFolio'" v-model="filters.searchText" />
      </div>

      <!-- Status Filter -->
      <div>
        <label for="status" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('unsettledFolios.filterStatus') }}:</label>
        <select id="status" v-model="filters.status"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">{{ $t('unsettledFolios.filterAll') }}</option>
          <option v-for="statusOption in statusOptions" :key="statusOption" :value="statusOption">
            {{ $t(`folioStatus.${statusOption}`) }}
          </option>
        </select>
      </div>

      <!-- Room Type Filter -->
      <div>
        <label for="roomType" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('unsettledFolios.filterRoomType') }}:</label>
        <select id="roomType" v-model="filters.roomType"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">{{ $t('unsettledFolios.filterAll') }}</option>
          <option v-for="type in activeRoomTypes" :key="type.id" :value="type.id">{{ type.label }}</option>
        </select>
      </div>

      <!-- Balance Range Filter -->
      <div>
        <label for="minBalance" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('unsettledFolios.minBalance') }}:</label>
        <input id="minBalance" v-model="filters.minBalance" type="number" step="0.01" min="0"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          :placeholder="$t('unsettledFolios.enterMinBalance')" />
      </div>

      <div>
        <label for="maxBalance" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('unsettledFolios.maxBalance') }}:</label>
        <input id="maxBalance" v-model="filters.maxBalance" type="number" step="0.01" min="0"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          :placeholder="$t('unsettledFolios.enterMaxBalance')" />
      </div>

      <!-- Date Range Filter -->
      <div v-if="showDate">
        <label for="dateFrom" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('unsettledFolios.filterDateFrom') }}:</label>
        <div class="relative">
          <flat-pickr v-model="filters.dateFrom" :config="flatpickrConfig"
            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
            :placeholder="$t('Selectdate')" />
          <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <CalendarIcon />
          </span>
        </div>
      </div>

      <div v-if="showDate">
        <label for="dateTo" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('unsettledFolios.filterDateTo') }}:</label>
        <div class="relative">
          <flat-pickr v-model="filters.dateTo" :config="flatpickrConfig"
            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
            :placeholder="$t('Selectdate')" />
          <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <CalendarIcon />
          </span>
        </div>
      </div>

      <div class="mt-2 flex justify-end gap-3 lg:col-span-2">
        <BasicButton @click="applyFilters" variant="secondary" :icon="SearchIcon"
          :label="$t('unsettledFolios.applyFilters')">
        </BasicButton>
        <BasicButton @click="clearFilters" variant="secondary" :icon="XCircleIcon"
          :label="$t('unsettledFolios.clearFilters')">
        </BasicButton>
      </div>
    </div>
  </RightSideModal>
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
  searchText: string;
  status: string;
  roomType: string;
  minBalance: string;
  maxBalance: string;
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
  searchText: '', // For guest name or folio number
  status: '',
  roomType: '',
  minBalance: '',
  maxBalance: '',
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
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}

const activeRoomTypes = ref<RoomTypeData[]>([]);

const applyFilters = () => {
  emits('filter', filters.value)
};

const clearFilters = () => {
  filters.value.searchText = '';
  filters.value.status = '';
  filters.value.roomType = '';
  filters.value.minBalance = '';
  filters.value.maxBalance = '';
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