<template>
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 bg-opacity-50"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[800px] overflow-y-auto transform transition-all duration-300 ease-out relative  p-6 dark:bg-gray-900  slide-in"
          :class="{ 'scale-100 opacity-100': isOpen, 'scale-95 opacity-0': !isOpen }"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ $t('Confirm Payment') }}</h2>
                <p class="text-sm text-gray-600">{{ $t('Complete your reservation') }}</p>
              </div>
            </div>
            
            <button
              @click="closeModal"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
  
          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Reservation Summary -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {{ $t('Reservation Summary') }}
              </h3>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">{{ $t('Guest') }}:</span>
                  <p class="font-medium">{{ guestFullName }}</p>
                </div>
                <div>
                  <span class="text-gray-600">{{ $t('Email') }}:</span>
                  <p class="font-medium">{{ guestEmail }}</p>
                </div>
                <div>
                  <span class="text-gray-600">{{ $t('Check-in') }}:</span>
                  <p class="font-medium">{{ checkinDate }}</p>
                </div>
                <div>
                  <span class="text-gray-600">{{ $t('Check-out') }}:</span>
                  <p class="font-medium">{{ checkoutDate }}</p>
                </div>
                <div>
                  <span class="text-gray-600">{{ $t('Nights') }}:</span>
                  <p class="font-medium">{{ numberOfNights }}</p>
                </div>
                <div>
                  <span class="text-gray-600">{{ $t('Rooms') }}:</span>
                  <p class="font-medium">{{ numberOfRooms }}</p>
                </div>
              </div>
            </div>
  
            <!-- Payment Amount -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">{{ $t('Total Amount') }}</span>
                <span class="text-2xl font-bold text-green-600">{{ formatCurrency(totalAmount) }}</span>
              </div>
              
              <div class="mt-2 space-y-1 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>{{ $t('Room Charges') }}</span>
                  <span>{{ formatCurrency(roomCharges) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ $t('Taxes') }}</span>
                  <span>{{ formatCurrency(taxes) }}</span>
                </div>
              </div>
            </div>
  
            <!-- Payment Method Selection -->
            <div class="space-y-4">
              <h3 class="font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {{ $t('Payment Method') }}
              </h3>
  
              <div class="grid grid-cols-2 gap-4">
                <label class="relative cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    v-model="paymentData.paymentMethod"
                    class="sr-only"
                  />
                  <div
                    class="border-2 rounded-lg p-4 text-center transition-all duration-200"
                    :class="paymentData.paymentMethod === 'cash' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'"
                  >
                    <div class="flex flex-col items-center space-y-2">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      <span class="font-medium">{{ $t('Cash') }}</span>
                    </div>
                  </div>
                </label>
  
                <label class="relative cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    v-model="paymentData.paymentMethod"
                    class="sr-only"
                  />
                  <div
                    class="border-2 rounded-lg p-4 text-center transition-all duration-200"
                    :class="paymentData.paymentMethod === 'credit' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'"
                  >
                    <div class="flex flex-col items-center space-y-2">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                      <span class="font-medium">{{ $t('Credit Card') }}</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
  
            <!-- Credit Card Form -->
            <div v-if="paymentData.paymentMethod === 'credit'" class="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 class="font-medium text-gray-900 mb-4">{{ $t('Credit Card Information') }}</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('Card Number') }}</label>
                <div class="relative">
                  <input
                    type="text"
                    :value="paymentData.cardNumber"
                    @input="paymentData.cardNumber = formatCardNumber($event.target.value)"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                  />
                  <svg class="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('Expiry Date') }}</label>
                  <input
                    type="text"
                    :value="paymentData.expiryDate"
                    @input="paymentData.expiryDate = formatExpiryDate($event.target.value)"
                    placeholder="MM/YY"
                    maxlength="5"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('CVV Code') }}</label>
                  <input
                    type="text"
                    v-model="paymentData.cvv"
                    placeholder="123"
                    maxlength="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('Cardholder Name') }}</label>
                <input
                  type="text"
                  v-model="paymentData.cardHolderName"
                  :placeholder="guestFullName"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
  
              <!-- Credit Card Types -->
              <div class="flex space-x-3 pt-2">
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{{ $t('We accept') }}:</span>
                  <div class="flex space-x-2">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8cGF0aCBkPSJNMTMuNSA3VjEzSDE1LjVWN0gxMy41WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwLjUgMTBDMTAuNSA4LjM0IDExLjg0IDcgMTMuNSA3VjEzQzExLjg0IDEzIDEwLjUgMTEuNjYgMTAuNSAxMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xOC41IDEwQzE4LjUgMTEuNjYgMTkuODQgMTMgMjEuNSAxM1Y3QzE5Ljg0IDcgMTguNSA4LjM0IDE4LjUgMTBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="Visa" class="h-5">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI1IiBmaWxsPSIjRkY1RjAwIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTAiIHI9IjUiIGZpbGw9IiNGRkY1RjAiLz4KPC9zdmc+Cg==" alt="Mastercard" class="h-5">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwNkZDRiIvPgo8cGF0aCBkPSJNOCA3SDI0VjEzSDhWN1oiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjE2IiB5PSIxMC41IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDZGQ0YiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFNRVg8L3RleHQ+Cjwvc3ZnPgo=" alt="American Express" class="h-5">
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Cash Payment Info -->
            <div v-else class="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-amber-800 mb-1">{{ $t('Cash Payment') }}</h4>
                  <p class="text-sm text-amber-700">
                    {{ $t('Payment will be collected at the reception upon your arrival. Please have the exact amount ready or we can provide change.') }}
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Security Notice -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-blue-800 text-sm mb-1">{{ $t('Secure Payment') }}</h4>
                  <p class="text-xs text-blue-700">
                    {{ $t('Your payment information is encrypted and secure. We do not store your credit card details.') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Footer Actions -->
          <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <button
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              :disabled="isPaymentLoading"
            >
              {{ $t('Cancel') }}
            </button>
  
            <button
              @click="processPayment"
              :disabled="isPaymentLoading || !isPaymentValid"
              class="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
            >
              <div v-if="isPaymentLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{{ isPaymentLoading ? $t('Processing...') : $t('Confirm Payment') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  
  interface PaymentData {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardHolderName: string
    amount: number
    paymentMethod: string
  }
  
  interface Props {
    isOpen: boolean
    paymentData: PaymentData
    guestFullName: string
    guestEmail: string
    checkinDate: string
    checkoutDate: string
    numberOfNights: number
    numberOfRooms: number
    totalAmount: number
    roomCharges: number
    taxes: number
    isPaymentLoading: boolean
    formatCurrency: (amount: number) => string
    formatCardNumber: (value: string) => string
    formatExpiryDate: (value: string) => string
  }
  
  interface Emits {
    (e: 'close'): void
    (e: 'processPayment'): void
    (e: 'update:paymentData', value: PaymentData): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const { t } = useI18n()
  
  const isPaymentValid = computed(() => {
    if (props.paymentData.paymentMethod === 'cash') {
      return true
    }
    
    if (props.paymentData.paymentMethod === 'credit') {
      return (
        props.paymentData.cardNumber.replace(/\s/g, '').length >= 16 &&
        props.paymentData.expiryDate.length === 5 &&
        props.paymentData.cvv.length >= 3 &&
        props.paymentData.cardHolderName.trim().length > 0
      )
    }
    
    return false
  })
  
  const closeModal = () => {
    if (!props.isPaymentLoading) {
      emit('close')
    }
  }
  
  const processPayment = () => {
    if (isPaymentValid.value) {
      emit('processPayment')
    }
  }
  </script>
  
  <style scoped>

  
.slide-in {
  animation: slide-in-from-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slide-in-from-bottom {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>