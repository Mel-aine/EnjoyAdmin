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
                <!-- Search by Name/ID -->


                <div class="">
                    <Input :lb="$t('payment.searchByName')" :inputType="'text'"
                        :placeholder="$t('payment.searchPlaceholder')" :id="'searchText'"
                        :forLabel="'payment.searchByName'" v-model="filters.searchText" />

                </div>

                <Select :lb="$t('status')" v-model="filters.status" :options="status" :is-loading="isLoadingRole" />

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

{ label: t('All'), value: '' },
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
@reference "tailwindcss";

/* Tailwind CSS is typically configured via PostCSS in a Vue project.
   The CDN link would be in your public/index.html or similar. */
.font-inter {
    font-family: 'Inter', sans-serif;
}
</style>
