<template>
    <div class="fixed inset-0 overflow-hidden z-999999" aria-labelledby="slide-over-title" role="dialog"
        aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
            <!-- Background overlay -->
            <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div class="relative w-screen max-w-3xl">
                    <!-- Slide-over panel -->
                    <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                        <!-- Header -->
                        <div class="px-4 py-2 sm:px-4 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-start justify-between">
                                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">{{
                                    $t('cutFolio') }}</h2>
                                <XIcon @click="closeModal" class="text-gray-300 hover:text-red-500 cursor-pointer"
                                    aria-label="Close panel" />
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="flex justify-between">
                                <span>{{ $t('all') }}</span>
                                <span></span>
                            </div>
                            <div class="flex justify-between">
                                <span>{{ $t('Room charges') }}</span>
                                <span></span>
                            </div>
                            <div class="flex justify-between">
                                <span>{{ $t('Extract charges') }}</span>
                                <span></span>
                            </div>
                            <div class="flex justify-between">
                                <span>{{ $t('Payment(Bank,cash & city ledger)') }}</span>
                                <span></span>
                            </div>
                        </div>
                        <div class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6" v-if="$slots.footer">
                            <div class="flex justify-end space-x-2">
                                <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"
                                    :disabled="isLoading">
                                </BasicButton>
                                <BasicButton variant="primary" @click="cutFolioTransaction"
                                    :label="isLoading ? $t('Creating...') : $t('save')" :disabled="isLoading"
                                    :loading="isLoading"></BasicButton>
                            </div>
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

const router = useRouter()
const { t } = useI18n()
const isLoading = ref(false)
// Loading state
const loading = ref(false)
const emit = defineEmits(['close'])
// Form data
const formData = ref({
    all: '',
    paymentType: 'cash',
    reference: '',
    amount: null,
    comment: ''
})


const closeModal = () => {
    emit('close')
}
const cutFolioTransaction = async () => {
    loading.value = true;
    try {
        const playload ={
            
        }
        const response = await cutFol;
        const resData = response.data;
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