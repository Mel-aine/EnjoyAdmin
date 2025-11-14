<template>
    <RightSideModal :is-open="isOpen" :title="$t('Exchange Rate')" @close="closeModal">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('Exchange Rate') }}</h3>
        </template>
        <!-- Form -->
        <div class="px-2 space-y-4">
            <!-- Currency List -->
            <div class="space-y-3">
                <div class="grid grid-cols-3 bg-gray-400 dark:bg-black dark:text-white px-3 py-2">
                    <div class="">{{ $t('Name') }}</div>
                    <div class="">{{ $t('Exchange Rate') }}</div>
                </div>
                <div v-for="currency in currencies" :key="currency.id" class="dark:bg-black dark:text-white border border-gray-200 rounded-lg p-4">
                    <!-- Exchange Rate Input -->
                    <div v-if="!currency.isBaseCurrency" class="grid grid-cols-3 gap-4">
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-700 dark:text-white mb-1">{{ currency.name }}</label>
                        </div>
                        <div class="col-span-1">
                            <div class="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                                <span class="text-sm font-semibold text-gray-900">{{ baseCurrency }}</span>
                                <span class="text-sm font-medium text-gray-600">1.0000</span>
                            </div>
                        </div>
                        <div class="col-span-1 flex align-middle self-center items-center">
                             <span class="me-3">=</span>
                             <div>
                                 <InputCurrency v-model="currency.exchangeRate" :currency="currency.code"
                                     :placeholder="'0.0000'"
                                     @update:modelValue="updateExchangeRate(currency.id, $event)" />
                             </div>
                         </div>
                    </div>
                    <!-- Base Currency Display (XAF) -->
                    <div v-else class="grid grid-cols-3 gap-4">
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-700 dark:text-white mb-1">{{ currency.name }}</label>
                        </div>
                        <div class="col-span-2">
                            <div class="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                <span class="text-sm font-semibold text-green-800">{{ currency.code }}</span>
                                <span class="text-xs text-green-600">{{ $t('Base Currency - No exchange rate needed') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No currencies message -->
            <div v-if="currencies.length === 0 && !isLoading" class="text-center py-8">
                <p class="text-gray-500">{{ $t('No currencies available') }}</p>
            </div>

            <!-- Loading state -->
            <div v-if="isLoading" class="text-center py-8">
                <div class="inline-flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span class="text-gray-500">{{ $t('Loading currencies...') }}</span>
                </div>
            </div>
        </div>

        <template #footer>
            <div v-if="hasRatesGreaterThanOne" class="flex justify-end space-x-2">
                <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"></BasicButton>
                <BasicButton variant="primary" @click="saveExchangeRates" :label="$t('Save')" :loading="isSaving"
                    :disabled="isSaving || !hasChanges"></BasicButton>
            </div>
        </template>
    </RightSideModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import RightSideModal from '../../components/modal/RightSideModal.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import InputCurrency from '../../components/forms/FormElements/InputCurrency.vue'
import { getCurrencies, updateCurrencyById } from '@/services/configrationApi'
import { useServiceStore } from '../../composables/serviceStore'
import { useToast } from 'vue-toastification'
import { safeParseFloat } from '../../utils/numericUtils'
import { useI18n } from 'vue-i18n'

interface Currency {
    id: number
    name: string
    code: string
    symbol?: string
    exchangeRate: number
    isBaseCurrency?: boolean
}

interface Props {
    isOpen: boolean
}

interface Emits {
    (e: 'close'): void
    (e: 'save', data: Currency[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const isLoading = ref(false)
const isSaving = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const { t } = useI18n()

// Base currency (typically the hotel's primary currency)
const baseCurrency = ref('XAF')

// Currencies data
const currencies = ref<Currency[]>([])
const originalRates = ref<{ [key: number]: number }>({})

// Computed properties for button visibility and state
const hasRatesGreaterThanOne = computed(() => {
    return currencies.value.some(currency => 
        !currency.isBaseCurrency && currency.exchangeRate > 1
    )
})

const hasChanges = computed(() => {
    return currencies.value.some(currency => 
        !currency.isBaseCurrency && originalRates.value[currency.id] !== currency.exchangeRate
    )
})

// Methods
const closeModal = () => {
    // Reset to original rates if user cancels
    currencies.value.forEach(currency => {
        if (originalRates.value[currency.id] !== undefined) {
            currency.exchangeRate = originalRates.value[currency.id]
        }
    })
    emit('close')
}

const updateExchangeRate = (currencyId: number, newRate: number) => {
    const currency = currencies.value.find(c => c.id === currencyId)
    if (currency) {
        currency.exchangeRate = safeParseFloat(newRate)
    }
}

const saveExchangeRates = async () => {
    try {
        isSaving.value = true

        // Validate exchange rates
        const invalidRates = currencies.value.filter(c => !c.isBaseCurrency && (c.exchangeRate <= 0 || isNaN(c.exchangeRate)))
        if (invalidRates.length > 0) {
            toast.error(t('Please enter valid exchange rates for all currencies'))
            return
        }

        // Update each currency with new exchange rate
        const updatePromises = currencies.value
            .filter(currency => !currency.isBaseCurrency && originalRates.value[currency.id] !== currency.exchangeRate)
            .map(currency => {
                const updateData = {
                    name: currency.name,
                    code: currency.code,
                    symbol: currency.symbol,
                    exchangeRate: currency.exchangeRate,
                    hotelId: serviceStore.serviceId
                }
                return updateCurrencyById(currency.id, updateData)
            })

        if (updatePromises.length === 0) {
            toast.info(t('No changes to save'))
            closeModal()
            return
        }

        // Execute all updates
        await Promise.all(updatePromises)

        // Update original rates to current rates
        currencies.value.forEach(currency => {
            originalRates.value[currency.id] = currency.exchangeRate
        })

        // Show success message
        toast.success(t('Exchange rates updated successfully'))

        // Emit the updated currencies
        emit('save', currencies.value)
        closeModal()
    } catch (error) {
        console.error('Error saving exchange rates:', error)
        toast.error(t('Failed to update exchange rates. Please try again.'))
    } finally {
        isSaving.value = false
    }
}

// Fetch currencies from API
const fetchCurrencies = async () => {
    try {
        isLoading.value = true
        const response = await getCurrencies()
        const currencyData = response.data.data?.data || []

        currencies.value = currencyData.map((currency: any) => ({
            id: currency.id,
            name: currency.name,
            code: currency.code,
            symbol: currency.symbol,
            exchangeRate: safeParseFloat(currency.exchangeRate || currency.exchange_rate || 1),
            isBaseCurrency: currency.currencyCode === 'XAF' || currency.isDefault // XAF is base currency
        }))

        // Store original rates for reset functionality
        originalRates.value = {}
        currencies.value.forEach(currency => {
            originalRates.value[currency.id] = currency.exchangeRate
        })

    } catch (error) {
        console.error('Error fetching currencies:', error)
        toast.error(t('Failed to load currencies'))
    } finally {
        isLoading.value = false
    }
}

// Initialize data on component mount
onMounted(() => {
    if (props.isOpen) {
        fetchCurrencies()
    }
})

// Fetch currencies when modal opens
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        fetchCurrencies()

        // Close modal on escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal()
            }
        }
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }
})
</script>

<style scoped>
/* Custom styles for the modal */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Currency item hover effect */
.currency-item:hover {
    background-color: #f9fafb;
}

/* Loading spinner animation */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>