<script setup lang="ts">
import { computed, ref } from 'vue';
import BasicButton from '../../buttons/BasicButton.vue';
import Input from '../../forms/FormElements/Input.vue';
import InputCheckBox from '../../forms/FormElements/InputCheckBox.vue';
import { SearchIcon, XIcon } from 'lucide-vue-next';
import ReusableTable from '../../tables/ReusableTable.vue';
import type { Column } from '../../../utils/models';
import { findFolio } from '../../../services/foglioApi';
import { useServiceStore } from '../../../composables/serviceStore';
import { useI18n } from 'vue-i18n';
const isOpen = ref(false);
const loading = ref(false);
const folios = ref([]);
const { t } = useI18n()
// Props for v-model support
const props = defineProps<{
    modelValue?: any;
}>();

const emit = defineEmits(['selectFolio', 'update:modelValue']);

// Use modelValue from props or fallback to internal ref
const selectedFolio = computed({
    get: () => props.modelValue || null,
    set: (value) => emit('update:modelValue', value)
});

const selectFolio = (item: any) => {
    emit('update:modelValue', item);
    emit('selectFolio', item);
    isOpen.value = false;
}
const filters = ref({
    searchText: '',
    inHouse: false,
    reservation: false,
})

const fetchFolio = async () => {
    loading.value = true;
    try {
        const playload = {
            hotelId: useServiceStore().serviceId!,
            searchText: filters.value.searchText,
            inhouse: filters.value.inHouse,
            reservation: filters.value.reservation
        }
        const response = await findFolio(playload);
        console.log('response of the service', response);
        folios.value = response.data;
    } catch (e) {
        console.log('error')
    } finally {
        loading.value = false;
    }
}
const columnsFolios = computed<Column[]>(() => {
    return [
        { key: 'folioNumber', label: t('Folio No.'), sortable: true },
        { key: 'roomNumber', label: t('Room'), sortable: true },
        { key: 'guest', label: t('guest '), sortable: true },
        { key: 'billingContact', label: t('billingContact'), sortable: true },
        { key: 'arrivedDate', label: t('arrivalDate'), type: "date", sortable: true },
        { key: 'departureDate', label: t('departureDate'),type: "date", sortable: true },
        { key: "balance", label: t("balance") },
        { key: "action", label: "", type: "custom" }

    ]
})
</script>

<template>
    <div class="flex justify-end mb-3">
        <div @click="isOpen = true"
            class=" cursor-pointer flex gap-3 dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800">
            <SearchIcon class="w-5 h-5 text-gray-500"></SearchIcon>
            <input type="text" placeholder="Search folio" :disabled="true" class="w-full" :value="selectedFolio ? (typeof selectedFolio.guest === 'object' ? selectedFolio.guest?.displayName : selectedFolio.guest) || 'Search folio' : 'Search folio'">
        </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 overflow-hidden z-999999" aria-labelledby="slide-over-title" role="dialog"
        aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
            <!-- Background overlay -->
            <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div class="relative w-screen max-w-4xl">
                    <!-- Slide-over panel -->
                    <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                        <!-- Header -->
                        <div class="px-4 py-2 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-start justify-between">
                                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">{{
                                    $t('Find folio') }}</h2>
                                <XIcon @click="isOpen = false" class="text-gray-300 hover:text-red-300 cursor-pointer"
                                    aria-label="Close panel" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5 p-5">
                            <!-- Search by Name/Number -->
                            <div class="flex flex-col col-span-4">
                                <Input :inputType="'search'" :placeholder="$t('Search folio, Room or Guest ')"
                                    :id="'searchText'" :forLabel="'reservationsList.searchByNameOrNumber'"
                                    v-model="filters.searchText" />
                                <div class="flex gap-2 mt-2">

                                    <InputCheckBox :label="$t('inHouse')" :id="'inHouse'" v-model="filters.inHouse" />
                                    <InputCheckBox :label="$t('Reservation')" :id="'reservation'"
                                        v-model="filters.reservation" />
                                </div>

                            </div>
                            <div class=" col-span-1 align-middle mt-2 "></div>
                            <div class=" col-span-1 align-middle mt-2 ">
                                <BasicButton :label="$t('Search')" @click="fetchFolio" :icon="SearchIcon"
                                    :loading="loading" />
                            </div>

                        </div>
                        <ReusableTable :columns="columnsFolios" :data="folios" :selectable="false" :loading="loading"
                            :searchable="false" :show-header="false" :title="''">
                            <!-- Custom cell for Open column -->
                            <template #column-action="{ item }">
                                <BasicButton :label="$t('select')" @click="selectFolio(item)" />

                            </template>


                        </ReusableTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>