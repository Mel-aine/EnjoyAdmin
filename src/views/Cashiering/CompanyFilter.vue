<template>
  <div class="flex justify-end mb-3">
    <BasicButton @click="showFilter = true" variant="secondary" :icon="FilterIcon"
      :label="$t('companyFilter.title')">
    </BasicButton>
  </div>
  <RightSideModal :is-open="showFilter" :title="$t('companyFilter.title')"
    @close="showFilter = false">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <!-- Search by Company Name/Contact Person -->
      <div class="lg:col-span-2">
        <Input :lb="$t('companyFilter.title')" :inputType="'text'"
          :placeholder="$t('companyFilter.searchText')" :id="'searchText'"
          :forLabel="'companyFilter.searchText'" v-model="filters.searchText" />
      </div>

      <!-- Status Filter -->
      <div>
        <label for="status" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('companyFilter.status') }}:</label>
        <select id="status" v-model="filters.status"
          class="dark:bg-dark-900 h-11 w-full  border border-black/50 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">{{ $t('all') }}</option>
          <option v-for="statusOption in statusOptions" :key="statusOption" :value="statusOption">
            {{ $t(`${statusOption.toLowerCase()}`) }}
          </option>
        </select>
      </div>

      <!-- Country Filter -->
      <div>
       <InputCountries  v-model="filters.country" />
      </div>

      <!-- Balance Range Filter -->
      <div>
        <Input :lb="$t('companyFilter.minBalance')" :inputType="'number'"
          :placeholder="$t('companyFilter.minBalance')" :id="'minBalance'"
          :forLabel="'companyFilter.minBalance'" v-model="filters.minBalance" />
      </div>

      <div>
        <Input :lb="$t('companyFilter.maxBalance')" :inputType="'number'"
          :placeholder="$t('companyFilter.maxBalance')" :id="'maxBalance'"
          :forLabel="'companyFilter.maxBalance'" v-model="filters.maxBalance" />
      </div>

      <!-- Email Filter -->
      <div class="lg:col-span-2">
        <Input :lb="$t('companyFilter.email')" :inputType="'email'"
          :placeholder="$t('companyFilter.email')" :id="'email'"
          :forLabel="'companyFilter.filterByEmail'" v-model="filters.email" />
      </div>

      <!-- Action Buttons -->
      <div class="mt-2 flex justify-end gap-3 lg:col-span-2">
        <BasicButton @click="applyFilters" variant="primary" :icon="SearchIcon"
          :label="$t('companyFilter.applyFilters')">
        </BasicButton>
        <BasicButton @click="clearFilters" variant="secondary" :icon="XCircleIcon"
          :label="$t('companyFilter.clearFilters')">
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
import InputCountries from '../../components/forms/FormElements/InputCountries.vue';

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
   t('Active'), t('Inactive'),  t('Suspended'),  t('Pending')
]);


const applyFilters = () => {
  emits('filter', filters.value);
  // showFilter.value = false;
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
