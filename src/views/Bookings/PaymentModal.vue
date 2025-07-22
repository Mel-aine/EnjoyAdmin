<template>
  <div v-if="isOpen" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 bg-opacity-50"
    @click.self="closeModal">
    <div class="relative w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 shadow-xl slide-in">
      <!-- Close button -->
      <button @click="closeModal"
        class="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>

      <div class="bg-white dark:bg-gray-900 p-6 rounded-xl">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <Wallet class="mr-2 text-blue-600" :size="24" />
          {{ $t('ConfirmPayment') }}
        </h2>

        <!-- Financial Summary -->
        <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-2">
            <DollarSign class="mr-2 text-blue-700 dark:text-blue-400" :size="20" />
            {{ $t('TotalAmount') }}: <span class="ml-2 font-bold">{{ formatCurrency(reservation.finalAmount) }}</span>
          </p>
          <p class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-2">
            <CreditCard class="mr-2 text-green-700 dark:text-green-400" :size="20" />
            {{ $t('amount_paid') }}: <span class="ml-2 font-bold text-green-700 dark:text-green-400">{{
              formatCurrency(reservation.paidAmount) }}</span>
          </p>
          <p
            :class="['text-xl font-bold flex items-center', remainingBalance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
            <Banknote class="mr-2" :size="24" />
            {{ $t('Remaining') }}: <span class="ml-2">{{ formatCurrency(remainingBalance) }}</span>
          </p>
        </div>

        <!-- Payment Status -->
        <div v-if="remainingBalance <= 0 && reservation.paymentStatus === 'paid'"
          class="bg-green-100 text-green-800 p-4 rounded-md text-center font-semibold text-lg flex items-center justify-center">
          <CheckCircle class="mr-2" :size="24" />
          {{ $t('paid_in_full') }}
        </div>
        <div v-else-if="remainingBalance < 0 && reservation.paymentStatus === 'overpaid'"
          class="bg-purple-100 text-purple-800 p-4 rounded-md text-center font-semibold text-lg flex items-center justify-center">
          <AlertCircle class="mr-2" :size="24" />
          {{ $t('refund_due') }}: {{ formatCurrency(Math.abs(remainingBalance)) }}
        </div>

        <!-- Payment Form -->
        <form v-else @submit.prevent="handlePaymentSubmit" class="space-y-4">
          <div>
            <label for="paymentAmount" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
              $t('Amount') }} (XAF):</label>
            <input type="number" id="paymentAmount" v-model="paymentAmount" min="0.01" step="0.01"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
              :placeholder="`Ex: ${remainingBalance.toFixed(2)}`" required />
          </div>
          <div>
            <label for="paymentMethod" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
              $t('PaymentMethod') }}:</label>
            <select id="paymentMethod" v-model="paymentMethod"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              required>
              <option v-for="method in availablePaymentMethods" :key="method" :value="method">{{ $t(method) }}</option>
            </select>
          </div>
          <div>
            <label for="transactionRef" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
              $t('TransactionRef') }} ({{ $t('Optional') }}):</label>
            <input type="text" id="transactionRef" v-model="transactionRef"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
              :placeholder="$t('TransactionRefPlaceholder')" />
          </div>
          <button type="submit"
            class="mt-4 w-full flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 transform hover:scale-105">
            <Spinner v-if="isLoading" />
            <DollarSign v-else class="mr-2" :size="18" />
            {{ $t('RecordPayment') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import type { ReservationDetails } from '@/utils/models';
import { formatCurrency, generateTransactionId } from '@/components/utilities/UtilitiesFunction';
import { Wallet, DollarSign, CreditCard, Banknote, CheckCircle, AlertCircle } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/composables/user';
import { createPayment } from '@/services/api';
import { useRouter } from 'vue-router';
import Spinner from '@/components/spinner/Spinner.vue';

const { t } = useI18n();
const toast = useToast();

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  reservation: {
    type: Object as PropType<ReservationDetails>,
    required: true,
  },
});

// Emits
const emit = defineEmits(['close', 'payment-recorded']);

// State
const paymentAmount = ref('');
const paymentMethod = ref('');
const transactionRef = ref(generateTransactionId());
const router = useRouter();
const authStore = useAuthStore()
const isLoading = ref(false);
// Computed Properties
const remainingBalance = computed(() => {
  if (!props.reservation) return 0;
  const finalAmount = parseFloat(props.reservation.finalAmount) || 0;
  const paidAmount = parseFloat(`${props.reservation.paidAmount}`) || 0;
  return finalAmount - paidAmount;
});

const availablePaymentMethods = computed(() => {
  const serviceMethods = props.reservation?.service?.paymentMethods || [];
  const allMethods = new Set([...serviceMethods, 'Cash', 'Bank Transfer', 'Credit Card']);
  return Array.from(allMethods);
});

// Watcher to set defaults when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (availablePaymentMethods.value.length > 0) {
      paymentMethod.value = availablePaymentMethods.value.includes('Credit Card')
        ? 'Credit Card'
        : availablePaymentMethods.value[0];
    }
    if (remainingBalance.value > 0) {
      paymentAmount.value = remainingBalance.value.toFixed(2);
    }
  }
}, { immediate: true });

// Methods
function closeModal() {
  emit('close');
}

async function handlePaymentSubmit() {
  const amount = parseFloat(paymentAmount.value);

  if (isNaN(amount) || amount <= 0) {
    toast.error(t('alert.invalid_payment_amount'));
    return;
  }

  if (amount > remainingBalance.value) {
    if (!confirm(t('alert.overpayment_confirmation', {
      paymentAmount: formatCurrency(amount),
      remainingBalance: formatCurrency(remainingBalance.value)
    }))) {
      return;
    }
  }
  await savePayment(amount);
  emit('payment-recorded', {
    amount,
    method: paymentMethod.value,
    ref: transactionRef.value,
  });

}

const savePayment = async (amount: number) => {
  isLoading.value = true
  try {
    const payload = {
      user_id: props.reservation.userId,
      reservation_id: props.reservation.id,
      payment_type: paymentMethod.value,
      amount_paid: amount,
      payment_method: paymentMethod.value,
      payment_date: new Date().toISOString(),
      transaction_id: transactionRef.value,
      status: "paid",
      created_by: authStore.UserId,
      last_modified_by: authStore.UserId,
      service_id: props.reservation.serviceId,
    }
    const response = await createPayment(payload)

    if (response.status === 201) {
      toast.success(t('toast.paymentSucess'))
      emit('payment-recorded')
      router.push({ name: 'ViewInvoice', params: { id: response.data.id } })
    } else {
      toast.error(t('toast.paymentError'))
    }
  } catch (error: unknown) {
    const message = 'An error occurred during payment.'
    if (error instanceof Object && 'response' in error && error.response) {
      const axiosError = error as { response: { data: { message: string } } }
      toast.error(axiosError.response.data.message || message)
    } else {
      toast.error(message)
    }
  } finally {
    isLoading.value = false
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