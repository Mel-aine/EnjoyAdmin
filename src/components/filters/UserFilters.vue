<!-- ReservationsList.vue -->
<template>
    <div class="flex justify-end ">
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

            <Select :lb="$t('Role')" v-model="filters.roleId" :options="roles" :is-loading="isLoadingRole" />
            <Select :lb="$t('staffManager.department')" v-model="filters.department" :is-loading="isLoadingDepartment"
                :options="departments" />

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

import type { FitlterItem } from '@/utils/models';

import { getRoles} from '@/services/userApi'
import {  getDepartment } from '@/services/departmentApi'
import { useServiceStore } from '@/composables/serviceStore';
import Select from '../forms/FormElements/Select.vue';
import BasicButton from '../buttons/BasicButton.vue';
import { useI18n } from 'vue-i18n';
const isLoadingRole = ref(false);
const isLoadingDepartment = ref(false);
const {t} = useI18n()

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
        const hotelId = serviceStore.serviceId
        const response = await getRoles(hotelId)
        console.log('role', response.data)
        roles.value = [{ label: t('All'), value: '' }].concat(response.data.map((r: any) => {
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
        const hotelId = serviceStore.serviceId;
        console.log('hotelId :', hotelId);

        const departmentsResponse = await getDepartment(hotelId);
        departments.value = [{ label: t('All'), value: '' }].concat(departmentsResponse.data.data.data.map((d: any) => {
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
@reference "tailwindcss";

/* Tailwind CSS is typically configured via PostCSS in a Vue project.
   The CDN link would be in your public/index.html or similar. */
.font-inter {
    font-family: 'Inter', sans-serif;
}
</style>
