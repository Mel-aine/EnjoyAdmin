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
                    <Input :lb="$t('userList.searchByName')" :inputType="'text'"
                        :placeholder="$t('userList.searchPlaceholder')" :id="'searchText'"
                        :forLabel="'userList.searchByName'" v-model="filters.searchText" />

                </div>

                <Select :lb="$t('status')" v-model="filters.status" :options="status" :is-loading="isLoadingRole" />
                <Select :lb="$t('staffManager.department')" v-model="filters.departmentId"
                    :is-loading="isLoadingDepartment" :options="departments" />
                <!-- Check-in Date Filter -->
                <div >
                    <label for="checkInDate" class="block text-gray-700 text-sm font-bold mb-2">{{
                        $t('dueDate') }}:</label>
                    <div class="relative">
                        <flat-pickr v-model="filters.dueDate" :config="flatpickrConfig"
                            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :placeholder="$t('Selectdate')" />
                        <span
                            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <CalendarIcon />
                        </span>
                    </div>
                </div>
                <!-- Check-out Date Filter -->
                <div >
                    <label for="checkOutDate" class="block text-gray-700 text-sm font-bold mb-2">{{
                        $t('createdDate') }}:</label>
                    <div class="relative">
                        <flat-pickr v-model="filters.createdDate" :config="flatpickrConfig"
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

import type { TaskFitlterItem } from '@/utils/models';
import { getDepartment, getRole } from '@/services/api';
import { useServiceStore } from '@/composables/serviceStore';
import Select from '../forms/FormElements/Select.vue';
import flatPickr from 'vue-flatpickr-component'

import 'flatpickr/dist/flatpickr.css'
import { TaskStatus } from '@/utils/constants';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const flatpickrConfig = {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    wrap: true,
}
const isLoadingRole = ref(false);
const isLoadingDepartment = ref(false);
const serviceStore = useServiceStore()

const emits = defineEmits(['filter']);
defineProps({
    showDate: {
        type: Boolean,
        default: false
    }
})
// Filter state
const filters = ref<TaskFitlterItem>({
    userId: '', // For guest name or reservation number
    status: '',
    dueDate: '',
    createdDate: '',
    roleId: '',
    departmentId: '',
    serviceId: serviceStore.serviceId!,
    searchText: ''
});
const status = ref<any[]>([
    
{ label: 'All', value: '' },
{ label: t(TaskStatus.TODO), value: TaskStatus.TODO },
{ label: t(TaskStatus.IN_PROGRESS), value: TaskStatus.IN_PROGRESS },
{ label: t(TaskStatus.DONE), value: TaskStatus.DONE },
{ label: t(TaskStatus.CANCELLED), value: TaskStatus.CANCELLED },
{ label: t(TaskStatus.PENDING), value: TaskStatus.PENDING}
])
const departments = ref<any[]>([])
const showFilter = ref(false);
// Options for status dropdown




const applyFilters = () => {
    emits('filter', filters.value)
};

const clearFilters = () => {
    filters.value.userId = '';
    filters.value.status = '';
    filters.value.dueDate = '';
    filters.value.createdDate = '';
    filters.value.departmentId = '';
    filters.value.roleId = "";
    filters.value.serviceId = serviceStore.serviceId!;
    filters.value.searchText = '';
    applyFilters(); // Re-apply filters to show all
};

const fetchDepartment = async () => {
    isLoadingDepartment.value = true
    try {
        const serviceId = serviceStore.serviceId;
        console.log('Service ID:', serviceId);

        const departmentsResponse = await getDepartment(serviceId);
        departments.value = [{ label: 'All', value: '' }].concat(departmentsResponse.data.map((d: any) => {
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
