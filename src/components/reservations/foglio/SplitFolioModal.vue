<template>
    <div class="fixed inset-0 overflow-hidden z-999999" aria-labelledby="slide-over-title" role="dialog"
        aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
            <!-- Background overlay -->
            <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div class="relative w-screen max-w-7xl">
                    <!-- Slide-over panel -->
                    <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                        <!-- Header -->
                        <div class="px-4 py-2 sm:px-4 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-start justify-between">
                                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">{{
                                    $t('selectFolio') }}</h2>
                                <XIcon @click="closeModal" class="text-gray-300 hover:text-red-500 cursor-pointer"
                                    aria-label="Close panel" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-x-8 p-4">
                            <!-- source folio-->
                            <div>
                                <div>

                                    <div class=" mb-3">
                                        <div class="grid grid-cols-5 gap-3">
                                            <div class="col-span-2">
                                                <label
                                                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{
                                                        $t('sourceFolio') }}</label>
                                                <FindFolio @selectFolio="selectSourceFolio" />
                                            </div>
                                            <div class="col-span-3">

                                                <RadioGroup v-model="formData.paymentType" :options="[
                                                    { value: 'new', label: 'All Folio of this guest' },
                                                    { value: 'existing', label: 'Selected Folio' }
                                                ]" label="Scope" />
                                            </div>
                                        </div>
                                    </div>
                                    <ReusableTable :columns="columnsFolios" :data="sourceFolios" :selectable="true"
                                        :loading="loading" @selection-change="handleSelectionChange" :searchable="false"
                                        :show-header="false" :title="''">
                                    </ReusableTable>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div class="mb-3">
                                        <div class="grid grid-cols-5 gap-3">
                                            <div class="col-span-2">
                                                <label
                                                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{
                                                        $t('destinationFolio') }}</label>
                                                <FindFolio @selectFolio="destinationSelected" />
                                            </div>
                                        </div>
                                    </div>
                                    <ReusableTable :columns="columnsFolios" :data="destinationFolios" :title="''"
                                        :selectable="false" :loading="loading" :searchable="false" :show-header="false">
                                    </ReusableTable>
                                </div>
                            </div>
                        </div>
                        <!-- switch button-->
                        <div @click="splitFolio" :class="{ 'text-primary cursor-pointer': canSplit }"
                            class="flex text-gray-300 items-center cursor-pointer -ms-2 fixed top-1/2 left-[58%]">

                            <ChevronRightCircle class="w-7 h-7" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ReusableTable from '../../tables/ReusableTable.vue'
import Select from '../../forms/FormElements/Select.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputDatePicker from '../../components/forms/FormElements/InputDatePicker.vue'
import { ChevronRightCircle, Save, Search, SearchCodeIcon, SearchIcon, SearchSlash, XIcon } from 'lucide-vue-next'
import InputCurrency from '../../components/forms/FormElements/InputCurrency.vue'
import InputDoubleDatePicker from '../../components/forms/FormElements/InputDoubleDatePicker.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import RadioGroup from '../../forms/FormElements/RadioGroup .vue'
import { formatCurrency } from '../../../utils/numericUtils'
import type { Column } from '../../../utils/models'
import FindFolio from './FindFolio.vue'
import { getFolioStatement } from '../../../services/foglioApi'
import { split } from 'lodash'

const router = useRouter()
const { t } = useI18n()

// Loading state
const loading = ref(false)
const emit = defineEmits(['close'])
// Form data
const formData = ref({
    cityLedgerAccount: '',
    paymentType: 'cash',
    reference: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    amount: null,
    comment: ''
})

// Sample guest data
const sourceFolios = ref<Column[]>([
])
const destinationFolios = ref<Column[]>([
])
// Selected guests
const selectedFolios = ref<any>([])
const handleSelectionChange = (vals: any[]) => {
    selectedFolios.value = vals;
}
// Table columns definition
const columnsFolios = [
    { key: 'folio', label: 'Folio No.', sortable: true },
    { key: 'date', label: 'Date ', sortable: true },
    { key: 'room', label: 'Room', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
]

const selectFolio = ref<any>(null);
const destinationFolioSelected = ref<any>(null)

const selectSourceFolio = (item: any) => {
    selectFolio.value = item;
    if (selectFolio.value && selectFolio.value.id) {
        fetchFoliotransaction();
    }
    console.log('get all methode transaction', item)
}
const canSplit = computed(() => {
    return selectedFolios.value && selectedFolios.value.length > 0
})
const closeModal = () => {
    emit('close')
}
const fetchFoliotransaction = async () => {
    loading.value = true;
    try {
        const response = await getFolioStatement(selectFolio.value.id);
        const resData = response.data;
        sourceFolios.value = resData.transactions?.map((e: any) => {
            return {
                ...e,
            }
        })
        console.log('response of fetching reservation', response)
    } catch (e) {

    } finally {
        loading.value = false
    }
}
const splitFolio = () => {

}

const destinationSelected = (item: any) => {
    destinationFolioSelected.value = item
}
onMounted(() => {

})
</script>