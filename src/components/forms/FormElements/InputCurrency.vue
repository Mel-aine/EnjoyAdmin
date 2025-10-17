<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCurrencyStore } from '@/composables/currencyStore'

const props = defineProps({
    lb: String,
    inputType: {
        type: String,
        default: 'number' // type nombre car c'est un prix
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: [String, Number],
        default: ''
    },
    forLabel: String,
    id: String,
    placeholder: String,
    min: Number,
    currency: {
        type: String,
        default: 'XAF' // devise par défaut
    },
    showCurrencySelector: {
        type: Boolean,
        default: true // Allow currency selection by default
    },
    customClass:{
      type:String,
      default:''
    }
})

const emit = defineEmits(['update:modelValue', 'update:currency'])

const currencyStore = useCurrencyStore()
const showDropdown = ref(false)
const selectedCurrency = ref(props.currency)

const availableCurrencies = computed(() => currencyStore.getCurrencies)
const isLoading = computed(() => currencyStore.isLoading)

const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    emit('update:modelValue', input.value)
}

const selectCurrency = (currency: any) => {
    selectedCurrency.value = currency.code
    currencyStore.setSelectedCurrency(currency.code)
    emit('update:currency', currency.code)
    showDropdown.value = false
}

const toggleDropdown = () => {
    if (!props.disabled && props.showCurrencySelector) {
        showDropdown.value = !showDropdown.value
    }
}

// Initialize currency store
onMounted(async () => {
    try {
        currencyStore.init()
        await currencyStore.fetchCurrencies()
        selectedCurrency.value = props.currency || currencyStore.getSelectedCurrency
    } catch (error) {
        console.error('Error loading currencies:', error)
    }
})
</script>

<template>
    <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" :for="id">
            {{ lb }}<span v-if="isRequired" class="text-red-500">*</span>
        </label>
        <div class="relative">
            <!-- Currency Selector -->
            <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <div class="relative">
                    <button
                        v-if="showCurrencySelector"
                        type="button"
                        @click="toggleDropdown"
                        :disabled="disabled || isLoading"
                        class="flex items-center gap-1 text-sm font-medium  text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        :class="{
                            'cursor-pointer': !disabled && !isLoading,
                            'cursor-not-allowed opacity-50': disabled || isLoading
                        }"
                    >
                        <span>{{ selectedCurrency }}</span>
                        <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <span v-else class="text-gray-600 dark:text-gray-400 pointer-events-none">
                        {{ selectedCurrency }}
                    </span>

                    <!-- Currency Dropdown -->
                    <div v-if="showDropdown && showCurrencySelector" class="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        <div v-if="isLoading" class="p-3 text-center text-sm text-gray-500">
                            Loading currencies...
                        </div>
                        <button
                            v-else
                            v-for="currency in availableCurrencies"
                            :key="currency.id"
                            type="button"
                            @click="selectCurrency(currency)"
                            class="w-full px-3 py-2 text-left text-sm  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                            :class="{
                                'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300': selectedCurrency === currency.code
                            }"
                        >
                            <span class="font-medium">{{ currency.code }}</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">{{ currency.sign }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <input
                :type="inputType"
                :id="id"
                :required="isRequired"
                :disabled="disabled"
                :min="min"
                :value="modelValue"
                @input="handleInput"
                :placeholder="placeholder"
                :class="[
                  'h-11 w-full rounded-lg border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800',
                  {
                    'pl-20': showCurrencySelector,
                    'pl-14': !showCurrencySelector
                },
                props.customClass
                ]"

            />
        </div>

        <!-- Click outside to close dropdown -->
        <div v-if="showDropdown" @click="showDropdown = false" class="fixed inset-0 z-10"></div>
    </div>
</template>

<style scoped>
input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    border-color: #d1d5db;
}
/* padding-left = espace pour le symbole XAF affiché à gauche */
</style>
