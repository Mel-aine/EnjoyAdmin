<template>
  <div class="flex justify-end mb-3">
    <BasicButton @click="showFilter = true" variant="secondary" :icon="FilterIcon"
      :label="$t('companyDatabase.filterSectionTitle')">
    </BasicButton>
  </div>
  <RightSideModal :is-open="showFilter" :title="$t('companyDatabase.filterSectionTitle')"
    @close="showFilter = false">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <!-- Search by Company Name/Contact Person -->
      <div class="lg:col-span-2">
        <Input :lb="$t('companyDatabase.searchByNameOrContact')" :inputType="'text'"
          :placeholder="$t('companyDatabase.searchPlaceholder')" :id="'searchText'"
          :forLabel="'companyDatabase.searchByNameOrContact'" v-model="filters.searchText" />
      </div>

      <!-- Status Filter -->
      <div>
        <label for="status" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('companyDatabase.filterStatus') }}:</label>
        <select id="status" v-model="filters.status"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">{{ $t('companyDatabase.filterAll') }}</option>
          <option v-for="statusOption in statusOptions" :key="statusOption" :value="statusOption">
            {{ $t(`companyDatabase.status_${statusOption.toLowerCase()}`) }}
          </option>
        </select>
      </div>

      <!-- Country Filter -->
      <div>
        <label for="country" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('companyDatabase.filterCountry') }}:</label>
        <select id="country" v-model="filters.country"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">{{ $t('companyDatabase.filterAllCountries') }}</option>
          <option v-for="countryOption in countryOptions" :key="countryOption" :value="countryOption">
            {{ countryOption }}
          </option>
        </select>
      </div>

      <!-- Balance Range Filter -->
      <div>
        <Input :lb="$t('companyDatabase.minBalance')" :inputType="'number'"
          :placeholder="$t('companyDatabase.minBalancePlaceholder')" :id="'minBalance'"
          :forLabel="'companyDatabase.minBalance'" v-model="filters.minBalance" />
      </div>

      <div>
        <Input :lb="$t('companyDatabase.maxBalance')" :inputType="'number'"
          :placeholder="$t('companyDatabase.maxBalancePlaceholder')" :id="'maxBalance'"
          :forLabel="'companyDatabase.maxBalance'" v-model="filters.maxBalance" />
      </div>

      <!-- Email Filter -->
      <div class="lg:col-span-2">
        <Input :lb="$t('companyDatabase.filterByEmail')" :inputType="'email'"
          :placeholder="$t('companyDatabase.emailPlaceholder')" :id="'email'"
          :forLabel="'companyDatabase.filterByEmail'" v-model="filters.email" />
      </div>

      <!-- Action Buttons -->
      <div class="mt-2 flex justify-end gap-3 lg:col-span-2">
        <BasicButton @click="applyFilters" variant="primary" :icon="SearchIcon"
          :label="$t('companyDatabase.applyFilters')">
        </BasicButton>
        <BasicButton @click="clearFilters" variant="secondary" :icon="XCircleIcon"
          :label="$t('companyDatabase.clearFilters')">
        </BasicButton>
      </div>
    </div>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon
} from 'lucide-vue-next';
import RightSideModal from '@/components/modal/RightSideModal.vue';
import Input from '@/components/forms/FormElements/Input.vue';
import BasicButton from '@/components/buttons/BasicButton.vue';

const { t } = useI18n();

// Define company filter interface
interface CompanyFilterItem {
  searchText: string;
  status: string;
  country: string;
  minBalance: string;
  maxBalance: string;
  email: string;
}

const emits = defineEmits(['filter']);

// Filter state
const filters = ref<CompanyFilterItem>({
  searchText: '', // For company name or contact person
  status: '',
  country: '',
  minBalance: '',
  maxBalance: '',
  email: '',
});

const showFilter = ref(false);

// Options for status dropdown
const statusOptions = ref([
  'Active', 'Inactive', 'Suspended', 'Pending'
]);

// Options for country dropdown (you can expand this list)
const countryOptions = ref([
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Australia', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'South Africa', 'Nigeria',
  'Egypt', 'Morocco', 'Kenya', 'Ghana', 'Cameroon'
]);

const applyFilters = () => {
  emits('filter', filters.value);
  showFilter.value = false;
};

const clearFilters = () => {
  filters.value.searchText = '';
  filters.value.status = '';
  filters.value.country = '';
  filters.value.minBalance = '';
  filters.value.maxBalance = '';
  filters.value.email = '';
  applyFilters(); // Re-apply filters to show all
};
</script>

<style scoped>
/* Additional styles if needed */
</style>