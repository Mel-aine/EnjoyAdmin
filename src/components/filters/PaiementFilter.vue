<!-- ReservationsList.vue -->
<template>
    <div class="flex justify-end mb-3" v-if="!showFilter">
        <button @click="showFilter = true"
            class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
            <FilterIcon class="mr-2 text-white" :size="20" /> {{ $t('reservationsList.filterSectionTitle') }}
        </button>
    </div>
    <div class="w-full shadow-lg  bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700  "
        v-if="showFilter">
        <!-- Search and Filter Section -->
        <div class="p-6 bg-gray-50 border-b border-gray-200">
            <div class="flex justify-between  items-start">
                <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FilterIcon class="mr-2 text-primary" :size="20" /> {{ $t('reservationsList.filterSectionTitle') }}
                </h2>
                <button @click="showFilter = false">
                    <XCircleIcon class="mr-2 text-primary" :size="20" />
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Search by Name/ID -->


                <div class="lg:col-span-2">
                    <Input :lb="$t('payment.searchByName')" :inputType="'text'"
                        :placeholder="$t('payment.searchPlaceholder')" :id="'searchText'"
                        :forLabel="'payment.searchByName'" v-model="filters.searchText" />

                </div>

                <Select :lb="$t('status')" v-model="filters.status" :options="status" :is-loading="isLoadingRole" />

                <div class="lg:col-span-2 flex items-end justify-end">
                      <div class="mt-2 flex justify-start gap-3 lg:col-span-2">
                    <button @click="applyFilters"
                        class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                        <SearchIcon class="mr-2" :size="18" /> {{ $t('reservationsList.applyFilters') }}
                    </button>
                    <button @click="clearFilters"
                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                        <XCircleIcon class="mr-2" :size="18" /> {{ $t('reservationsList.clearFilters') }}
                    </button>
                </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon, List as ListIcon
} from 'lucide-vue-next';
import Input from '@/components/forms/FormElements/Input.vue';
import type { PaymentFilterItem } from '@/utils/models';
import Select from '../forms/FormElements/Select.vue';
import { PaymentStatus } from '@/utils/constants';
import { useServiceStore } from '@/composables/serviceStore';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isLoadingRole = ref(false);
const showFilter = ref(false);
const serviceStore = useServiceStore()
const emits = defineEmits(['filter']);
// Filter state
const filters = ref<PaymentFilterItem>({
    paymentId: 0,
    status: '',
    searchText: '',
    serviceId: serviceStore.serviceId!,
});
const status = ref<any[]>([

{ label: 'All', value: '' },
{ label: t(PaymentStatus.PAID), value: PaymentStatus.PAID },
{ label: t(PaymentStatus.REFUNDED), value: PaymentStatus.REFUNDED },
{ label: t(PaymentStatus.PENDING), value: PaymentStatus.PENDING}
])



const applyFilters = () => {
    emits('filter', filters.value)
};

const clearFilters = () => {
    filters.value.paymentId = 0;
    filters.value.status = '';
    filters.value.searchText = '';
    filters.value.serviceId = serviceStore.serviceId!;
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
