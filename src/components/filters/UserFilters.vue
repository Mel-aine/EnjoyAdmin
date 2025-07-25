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
                <!-- Search by Name/Number -->


                <div class="lg:col-span-2">
                    <Input :lb="$t('userList.searchByName')" :inputType="'text'"
                        :placeholder="$t('userList.searchPlaceholder')" :id="'searchText'"
                        :forLabel="'userList.searchByName'" v-model="filters.searchText" />

                </div>

                <Select  :lb="$t('Role')" v-model="filters.roleId" :options="roles"
                    :is-loading="isLoadingRole" />
                <Select  :lb="$t('staffManager.department')" v-model="filters.department"
                    :is-loading="isLoadingDepartment" :options="departments" />

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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon, List as ListIcon
} from 'lucide-vue-next';
import Input from '@/components/forms/FormElements/Input.vue';

import type { FitlterItem } from '@/utils/models';
import { getDepartment, getRole } from '@/services/api';
import { useServiceStore } from '@/composables/serviceStore';
import Select from '../forms/FormElements/Select.vue';
const isLoadingRole = ref(false);
const isLoadingDepartment = ref(false);

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
    roleId: '',
    department: ''
});
const roles = ref<any[]>([])
const departments = ref<any[]>([])
const showFilter = ref(false);
const serviceStore = useServiceStore()
// Options for status dropdown




const applyFilters = () => {
    emits('filter', filters.value)
};

const clearFilters = () => {
    filters.value.searchText = '';
    filters.value.status = '';
    filters.value.roomType = '';
    filters.value.checkInDate = '';
    filters.value.checkOutDate = '';
    filters.value.roleId = "";
    filters.value.department = "";
    applyFilters(); // Re-apply filters to show all
};

const fetchRole = async () => {
    isLoadingRole.value = true
    try {
        const serviceId = serviceStore.serviceId
        const response = await getRole(serviceId)
        console.log('role', response.data)
        roles.value =[{ label: 'All', value: '' }].concat( response.data.map((r: any) => {
            return {
                label: r.roleName,
                value: r.id,
            }
        }))
        console.log('roles.value', roles.value)
    } catch (error) {
        console.error('fetch failed:', error)
    } finally {
        isLoadingRole.value = false
    }
}
const fetchDepartment = async () => {
    isLoadingDepartment.value = true
    try {
        const serviceId = serviceStore.serviceId;
        console.log('Service ID:', serviceId);

        const departmentsResponse = await getDepartment(serviceId);
        departments.value =[{ label: 'All', value: '' }].concat(departmentsResponse.data.map((d: any) => {
            return {
                ...d,
                label: d.name,
                value: d.id
            }
        }));
        console.log('Departments:', departments.value);


    } catch (error) {
        console.error('Erreur lors de la récupération :', error);
    } finally {
        isLoadingDepartment.value = false
    }
};
// Initial filter application on component mount
onMounted(() => {
    fetchRole();
    fetchDepartment()
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
