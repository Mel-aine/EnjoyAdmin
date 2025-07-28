<template>
  <div class="mb-8 max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h3 class="text-xl font-semibold text-gray-700 mb-6">{{ $t('PaymentMethod') }}</h3>

    <!-- Grid de méthodes de paiement -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="method in paymentMethods"
        :key="method.value"
        class="relative"
      >
        <!-- Carte cliquable -->
        <label
          :for="method.value"
          class="block cursor-pointer"
        >
          <div
            class="border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
            :class="[
              selectedPayments.includes(method.value)
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            ]"
          >
            <!-- Checkbox -->
            <input
              :id="method.value"
              v-model="selectedPayments"
              :value="method.value"
              type="checkbox"
              class="absolute top-3 right-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
            />

            <!-- Contenu de la carte -->
            <div class="pr-6">
              <!-- Icône -->
              <div class="text-3xl mb-3">{{ method.icon }}</div>

              <!-- Nom -->
              <h4 class="font-medium text-gray-900 mb-1">
                {{ $t(method.label) }}
              </h4>

              <!-- Description -->
              <p class="text-sm text-gray-500">
                {{ $t(method.description) }}
              </p>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Résumé des sélections -->
    <div class="mt-6 pt-4 border-t border-gray-200">
      <div v-if="selectedPayments.length > 0">
        <h4 class="text-sm font-medium text-gray-700 mb-3">
          {{ $t('SelectedMethods') }} ({{ selectedPayments.length }})
        </h4>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="payment in selectedPayments"
            :key="payment"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
          >
            <span class="mr-1">{{ getPaymentMethodIcon(payment) }}</span>
            {{ $t(getPaymentMethodLabel(payment)) }}
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500 italic text-sm">
        {{ $t('NoPaymentMethodsSelected') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Méthodes de paiement disponibles
const paymentMethods = ref([
  {
    value: 'Cash',
    label: 'Cash',
    description: 'PaymentCash',
    icon: '💵'
  },
  {
    value: 'SmallPay',
    label: 'SmallPay',
    description: 'PaymentSmallPay',
    icon: 'S'
  },
  {
    value: 'Credit Card',
    label: 'CreditCard',
    description: 'PaymentCreditCard',
    icon: '💳'
  },
  {
    value: 'debit card',
    label: 'DebitCard',
    description: 'PaymentDebitCard',
    icon: '🏧'
  },
  {
    value: 'Bank Transfer',
    label: 'BankTransfer',
    description: 'PaymentBankTransfer',
    icon: '🏦'
  },
  {
    value: 'Mobile Money',
    label: 'MobileMoney',
    description: 'PaymentMobileMoney',
    icon: '📱'
  },
   {
    value: 'Orange Money',
    label: 'OrangeMoney',
    description: 'PaymentOrangeMoney',
    icon: '📱'
  },
  {
    value: 'PayPal',
    label: 'PayPal',
    description: 'PaymentPayPal',
    icon: '🅿️'
  },
  {
  value: 'Check',
  label: 'check',
  description: 'PaymentCheck',
  icon: '📝'
}


])


// Props pour recevoir les valeurs initiales
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

// Méthodes sélectionnées
const selectedPayments = ref([...props.modelValue])




// Méthodes utilitaires
const getPaymentMethodLabel = (value) => {
  const method = paymentMethods.value.find(m => m.value === value)
  return method ? method.label : value
}

const getPaymentMethodIcon = (value) => {
  const method = paymentMethods.value.find(m => m.value === value)
  return method ? method.icon : ''
}

// Emit pour informer le parent
const emit = defineEmits(['update:modelValue'])

// Watcher pour émettre les changements
watch(selectedPayments, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(selectedPayments.value)) {
    selectedPayments.value = [...newValue]
  }
}, { immediate: true })




</script>
