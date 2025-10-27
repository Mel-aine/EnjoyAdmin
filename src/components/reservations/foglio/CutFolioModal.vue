<template>
    <div class="fixed inset-0 overflow-hidden z-999" aria-labelledby="slide-over-title" role="dialog"
        aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
            <!-- Background overlay -->
            <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity dark:bg-black/40" aria-hidden="true"></div>

            <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div class="relative w-screen max-w-md">
                    <!-- Slide-over panel -->
                    <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                        <!-- Header -->
                        <div class="px-4 py-2 sm:px-4 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-start justify-between">
                                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">{{ $t('cutFolio') }}</h2>
                                <XIcon @click="closeModal" class="text-gray-300 hover:text-red-500 cursor-pointer dark:text-gray-400 dark:hover:text-red-400"
                                    aria-label="Close panel" />
                            </div>
                        </div>
                        
                        <!-- Content -->
                        <div class="flex-1 px-4 py-6 space-y-4 dark:text-gray-100">
                            <Toggle 
                                :title="$t('all')"
                                v-model="toggleStates.all"
                                @update:modelValue="onAllToggleChange"
                            />
                            <Toggle 
                                :title="$t('Room charges')"
                                v-model="toggleStates.roomCharges"
                                @update:modelValue="onIndividualToggleChange"
                            />
                            <Toggle 
                                :title="$t('Extract charges')"
                                v-model="toggleStates.extractCharges"
                                @update:modelValue="onIndividualToggleChange"
                            />
                            <Toggle 
                                :title="$t('Payment(Bank,cash & city ledger)')"
                                v-model="toggleStates.payment"
                                @update:modelValue="onIndividualToggleChange"
                            />
                        </div>
                        
                        <!-- Footer -->
                        <div class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 dark:border-gray-700 dark:bg-gray-900">
                            <div class="flex justify-end space-x-2">
                                <BasicButton 
                                    variant="secondary" 
                                    @click="closeModal" 
                                    :label="$t('Cancel')"
                                    :disabled="isLoading"
                                />
                                <BasicButton 
                                    variant="primary" 
                                    @click="cutFolioTransaction"
                                    :label="isLoading ? $t('Processing') + '...' : $t('save')" 
                                    :disabled="isLoading"
                                    :loading="isLoading"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { XIcon } from 'lucide-vue-next'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Toggle from '../../forms/FormElements/Toggle.vue'
import { cutFolioHandler } from '../../../services/foglioApi'
import { useServiceStore } from '../../../composables/serviceStore'

interface Props {
    folioId?: number | string
}

const props = withDefaults(defineProps<Props>(), {
    folioId: undefined
})

const { t } = useI18n()
const toast = useToast()
const emit = defineEmits(['close',"refresh"])

const isLoading = ref(false)

// Toggle states
const toggleStates = reactive({
    all: false,
    roomCharges: false,
    extractCharges: false,
    payment: false
})

// Watch for individual toggles to update "All" toggle
watch(
    () => [toggleStates.roomCharges, toggleStates.extractCharges, toggleStates.payment],
    ([roomCharges, extractCharges, payment]) => {
        // If all individual toggles are checked, check "All"
        if (roomCharges && extractCharges && payment) {
            toggleStates.all = true
        }
        // If any individual toggle is unchecked, uncheck "All"
        else if (toggleStates.all && (!roomCharges || !extractCharges || !payment)) {
            toggleStates.all = false
        }
    },
    { deep: true }
)

// Handle "All" toggle change
const onAllToggleChange = (value: boolean) => {
    toggleStates.all = value
    if (value) {
        // If "All" is checked, check all individual toggles
        toggleStates.roomCharges = true
        toggleStates.extractCharges = true
        toggleStates.payment = true
    } else {
        // If "All" is unchecked, uncheck all individual toggles
        toggleStates.roomCharges = false
        toggleStates.extractCharges = false
        toggleStates.payment = false
    }
}

// Handle individual toggle changes
const onIndividualToggleChange = () => {
    // The watcher will handle updating the "All" toggle automatically
}

const closeModal = () => {
    emit('close')
}

const cutFolioTransaction = async () => {
    if (!props.folioId) {
        toast.error(t('folioIdRequired'))
        return
    }

    isLoading.value = true
    try {
        const payload = {
            folioId: props.folioId,
            //all: toggleStates.all,
            hotelId:useServiceStore().serviceId,
            roomCharges: toggleStates.roomCharges,
            extractCharges: toggleStates.extractCharges,
            payment: toggleStates.payment
        }

        const response = await cutFolioHandler(payload)
        
        if (response && response.data) {
            toast.success(t('cutFolioSuccess'))
            closeModal();
            emit('refresh')
        } else {
            toast.error(t('cutFolioError'))
        }
    } catch (error: any) {
        console.error('Error cutting folio:', error)
        // Display server error message if available
        const errorMessage = error?.response?.data?.error || error?.error || t('cutFolioError')
        toast.error(errorMessage)
    } finally {
        isLoading.value = false
    }
}
</script>