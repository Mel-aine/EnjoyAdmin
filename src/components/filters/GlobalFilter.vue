<!-- ReservationsList.vue -->
<template>
    <div class="flex justify-end mb-3">
        <BasicButton @click="showFilter = true" variant="secondary" :icon="FilterIcon"
            :label="$t('reservationsList.filterSectionTitle')">
        </BasicButton>
    </div>
    <RightSideModal :is-open="showFilter" :title="$t('reservationsList.filterSectionTitle')"
        @close="showFilter = false">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <!-- Search by Name/Number -->
                    <div class="lg:col-span-2">
                        <Input :lb="$t('reservationsList.searchByNameOrNumber')" :inputType="'text'"
                            :placeholder="$t('reservationsList.searchPlaceholder')" :id="'searchText'"
                            :forLabel="'reservationsList.searchByNameOrNumber'" v-model="filters.searchText" />

                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label for="status" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
                            $t('reservationsList.filterStatus')
                            }}:</label>
                        <select id="status" v-model="filters.status"
                            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">

                            <option value="">{{ $t('reservationsList.filterAll') }}</option>
                            <option v-for="statusOption in statusOptions" :key="statusOption" :value="statusOption">{{
                                $t(`reservationStatus.${statusOption}`) }}</option>
                        </select>
                    </div>

                    <!-- Room Type Filter -->
                    <div>
                        <label for="roomType" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
                            $t('reservationsList.filterRoomType') }}:</label>
                        <select id="roomType" v-model="filters.roomType"
                            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                            >
                            <option value="">{{ $t('reservationsList.filterAll') }}</option>
                            <option v-for="type in activeRoomTypes" :key="type.id" :value="type.id">{{ type.label }}
                            </option>
                        </select>
                    </div>

                    <!-- Check-in Date Filter -->
                    <div v-if="showDate">
                        <label for="checkInDate" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
                            $t('reservationsList.filterCheckInDate') }}:</label>
                        <div class="relative">
                            <flat-pickr v-model="filters.checkInDate" :config="flatpickrConfig"
                                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                                :placeholder="$t('Selectdate')" />
                            <span
                                class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <CalendarIcon />
                            </span>
                        </div>
                    </div>
                    <!-- Check-out Date Filter -->
                    <div v-if="showDate">
                        <label for="checkOutDate" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
                            $t('reservationsList.filterCheckOutDate') }}:</label>
                        <div class="relative">
                            <flat-pickr v-model="filters.checkOutDate" :config="flatpickrConfig"
                                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                                :placeholder="$t('Selectdate')" />
                            <span
                                class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <CalendarIcon />
                            </span>
                        </div>
                    </div>
            <div class="mt-2 flex justify-end gap-3 lg:col-span-2">
                <BasicButton @click="applyFilters" variant="secondary" :icon="SearchIcon"
                    :label="$t('reservationsList.applyFilters')">
                </BasicButton>
                <BasicButton @click="clearFilters" variant="secondary" :icon="XCircleIcon"
                    :label="$t('reservationsList.clearFilters')">
                </BasicButton>
            </div>
        </div>
    </RightSideModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon, List as ListIcon
} from 'lucide-vue-next';
import RightSideModal from '@/components/modal/RightSideModal.vue';
import Input from '@/components/forms/FormElements/Input.vue';
import BasicButton from '@/components/buttons/BasicButton.vue';
import flatPickr from 'vue-flatpickr-component'

import 'flatpickr/dist/flatpickr.css'
import CalendarIcon from '@/icons/CalendarIcon.vue';
import type { FitlterItem } from '@/utils/models';
import { getTypeProductByServiceId } from '@/services/api';
import type { RoomTypeData } from '@/types/option';
import { useServiceStore } from '@/composables/serviceStore';

const emits = defineEmits(['filter']);
defineProps({
    showDate: {
        type: Boolean,
        default: false
    }
})
// Filter state
const filters = ref<FitlterItem>({
    searchText: '', // For guest name or reservation number
    status: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
});
const showFilter = ref(false);
const serviceStore = useServiceStore()
// Options for status dropdown
const statusOptions = ref([
    'Confirmed', 'Cancelled', 'Checked-in', 'Checked-out', 'Pending', 'No-show'
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
    filters.value.checkInDate = '';
    filters.value.checkOutDate = '';
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
                label: item.roomTypeName,
            }))
    } catch (error) {
        console.error('Erreur lors de la récupération des roomtypes:', error)
    }
}

// Initial filter application on component mount
onMounted(() => {
    fetchRoomType();
    applyFilters();
});
</script>

<style>
@reference "tailwindcss";

/* Tailwind CSS is typically configured via PostCSS in a Vue project.
   The CDN link would be in your public/index.html or similar. */
.font-inter {
    font-family: 'Inter', sans-serif;
}
</style>
