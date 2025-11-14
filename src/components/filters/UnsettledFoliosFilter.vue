<template>
  <div class="flex justify-end">
    <BasicButton @click="showFilter = true" variant="secondary" :icon="FilterIcon"
      :label="$t('reservationsList.filterSectionTitle')">
    </BasicButton>
  </div>

  <RightSideModal :is-open="showFilter" :title="$t('reservationsList.filterSectionTitle')" @close="showFilter = false">
    <div class="grid grid-cols-1 gap-6">
      <!-- Search by dropdown and input -->
      <div class="grid grid-cols-1  gap-4">
        <Input :lb="$t('common.search')" :inputType="'text'" :placeholder="$t('unsettledFolios.filter.searchPlaceholder')" :id="'searchText'"
          :forLabel="'search'" v-model="filters.searchText" />
      </div>

      <!-- Arrival section -->
      <div v-if="showDate" vclass="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:pl-6 items-end">
        <InputDoubleDatePicker :title="$t('unsettledFolios.filter.arrivalDate')" :id="'arrivalDate'" :forLabel="'arrivalDate'" allow-past-dates
          v-model="filters.date" :placeholder="'01/09/20'" />

      </div>

      <!-- Status dropdown -->
      <Select :lb="$t('unsettledFolios.filter.status')" v-model="filters.status" :options="statusOptions" />


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
import { useI18n } from 'vue-i18n';
import {
  Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon
} from 'lucide-vue-next';
import RightSideModal from '@/components/modal/RightSideModal.vue';
import Input from '@/components/forms/FormElements/Input.vue';
import Select from '@/components/forms/FormElements/Select.vue';
import BasicButton from '@/components/buttons/BasicButton.vue';
import InputDoubleDatePicker from '../forms/FormElements/InputDoubleDatePicker.vue';
// i18n
const { t } = useI18n();

// Define folio filter interface
interface FolioFilterItem {
  searchText: string;
  status: string;
  date: { start: string, end: string }
}

const emits = defineEmits(['filter']);

// Accept external control to show/hide the date section
defineProps({
  showDate: {
    type: Boolean,
    default: false
  }
});

// Filter state
const filters = ref<FolioFilterItem>({
  searchText: '',
  status: '',
  date: { start: '', end: '' }
});

const showFilter = ref(false);

// Options for dropdowns using the same pattern as the first component
const statusOptions = computed(() => [
  { label: t('-Select-'), value: '' },
  { label: t('checkout'), value: 'checkout' },
  { label: t('cancelled'), value: 'cancelled' },
  { label: t('noshow'), value: 'noshow' },
  { label: t('inhouse'), value: 'inhouse' }
]);

const applyFilters = () => {
  emits('filter', filters.value);
  showFilter.value = false; // Close modal after applying filters
};

const clearFilters = () => {
  filters.value.searchText = '';
  filters.value.status = '';
  filters.value.date = { start: '', end: '' };
  applyFilters(); // Re-apply filters to show all
};

// Initial filter application on component mount
onMounted(() => {
  applyFilters();
});
</script>

<style>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>