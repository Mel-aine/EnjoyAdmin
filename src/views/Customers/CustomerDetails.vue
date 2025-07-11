<template>
  <AdminLayout>
  <div
    class="min-h-screen bg-white dark:bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
  >
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8 slide-in">
        <div class="flex items-center gap-4 mb-4">
          <button
            @click="goBack"
            class="text-gray-400 hover:text-gray-700 transition-colors"
          >
             ← {{ $t('Back') }}
          </button>
          <h1 class="text-3xl font-bold dark:text-white text-gray-900">{{ $t('customer_detail') }}</h1>
        </div>
        <div class="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
      </div>

      <!-- Customer Info Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Personal Info -->
        <div class="lg:col-span-2 glass-effect rounded-xl p-6 slide-in">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center"
            >
               <UserRound class="text-indigo-400" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-600">
                {{ customer.userFullName }}
              </h2>
              <p class="text-gray-500">ID: {{ customer.id }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <Mail class="text-indigo-400"/>
                <span class="text-gray-600">{{ customer.email }}</span>
              </div>
              <div class="flex items-center gap-3">
                <Phone class="text-indigo-400"/>
                <span class="text-gray-600">{{ customer.phoneNumber }}</span>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <Users class="text-indigo-400"/>
                <span class="text-gray-600">
                  {{ customer.guestCount }} {{ $t('guests') }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <Bookmark class="text-indigo-400"/>
                <span class="text-gray-600">{{ customer.reservationType }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Card -->
        <div class="glass-effect rounded-xl p-6 slide-in">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('Status') }}</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">{{ $t('Booking') }}</span>
              <span
                class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm status-badge"
              >
                {{$t(`${customer.status}`)}}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">{{ $t('Payment') }}</span>
              <span
                class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
              >
                {{ $t(`${customer.paymentStatus}`) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservation Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Dates -->
        <div class="glass-effect rounded-xl p-6 slide-in">
          <h3
            class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <Calendar class="text-indigo-400"/>
           {{ $t('stay_dates') }}
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-gray-500 text-sm">{{ $t('ArrivedDate') }}</span>
                <p class="text-gray-600 font-medium">
                  {{ formatDate(customer.arrivedDate) }}
                </p>
              </div>
              <div class="text-right">
                <span class="text-gray-500 text-sm">{{ $t('DepartDate') }}</span>
                <p class="text-gray-600 font-medium">
                  {{ formatDate(customer.departDate) }}
                </p>
              </div>
            </div>
            <div class="flex items-center justify-center">
              <div
                class="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg"
              >
                {{ calculateStayDuration() }} {{ $t('nights') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Info -->
        <div class="glass-effect rounded-xl p-6 slide-in">
          <h3
            class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <CreditCard class="text-indigo-400"/>
            {{ $t('financial_info') }}
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('TotalAmount') }}</span>
              <span class="text-gray-600 font-medium">
                {{ formatCurrency(customer.totalAmount) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('discount') }}</span>
              <span class="text-gray-600 font-medium">
                {{ formatCurrency(customer.discountAmount) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('taxes') }}</span>
              <span class="text-gray-600 font-medium">
                {{ formatCurrency(customer.taxAmount) }}
              </span>
            </div>
            <div class="border-t border-gray-700 pt-3">
              <div class="flex justify-between">
                <span class="text-gray-500">{{ $t('final_amount') }}</span>
                <span class="text-green-400 font-bold text-lg">
                  {{ formatCurrency(customer.finalAmount) }}
                </span>
              </div>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('amount_paid') }}</span>
              <span class="text-blue-400 font-medium">
                {{ formatCurrency(customer.paidAmount) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="glass-effect rounded-xl p-6 slide-in">
        <h3
          class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
        >
          <Info class="text-indigo-400"/>
          {{ $t('additional_information') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <span class="text-gray-500 text-sm">{{ $t('Createdon') }}</span>
            <p class="text-gray-600">
              {{ formatDateTime(customer.createdAt) }}
            </p>
          </div>
          <div>
            <span class="text-gray-500 text-sm">{{ $t('Modifiedon') }}</span>
            <p class="text-gray-600">
              {{ formatDateTime(customer.updatedAt) }}
            </p>
          </div>
          <div>
            <span class="text-gray-500 text-sm">{{ $t('Comment') }}</span>
            <p class="text-gray-600">
              {{ customer.comment || $t('no_comment') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <!-- <div class="flex gap-4 mt-8 slide-in">
        <button
          class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-medium"
        >
          <i class="fas fa-edit mr-2"></i>
          Modifier
        </button>
        <button
          class="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium"
        >
          <i class="fas fa-envelope mr-2"></i>
          Contacter
        </button>
        <button
          class="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-medium"
        >
          <i class="fas fa-print mr-2"></i>
          Imprimer
        </button>
      </div> -->
    </div>
  </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useBookingStore } from '@/composables/booking';
import { ref, onMounted } from 'vue'
import { UserRound } from 'lucide-vue-next';
import { Mail } from 'lucide-vue-next';
import { Phone } from 'lucide-vue-next';
import { Calendar } from 'lucide-vue-next';
import { CreditCard } from 'lucide-vue-next';
import { Info } from 'lucide-vue-next';
import { Bookmark } from 'lucide-vue-next';
import { Users } from 'lucide-vue-next';



const store = useBookingStore()

onMounted(() => {
  customer.value = store.selectedCustomer
  console.log('customer.value :', customer.value)
})
const customer = ref<any>({})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: string): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(parseFloat(amount))
}

const calculateStayDuration = (): number => {
  const arrival = new Date(customer.value.arrivedDate)
  const departure = new Date(customer.value.departDate)
  const diff = Math.abs(departure.getTime() - arrival.getTime())
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const goBack = (): void => {
  window.history.back()
}

onMounted(() => {
  document.querySelectorAll('.slide-in').forEach((el, i) => {
    ;(el as HTMLElement).style.animationDelay = `${i * 0.1}s`
  })
})
</script>

<style scoped>
.glass-effect {
  backdrop-filter: blur(10px);
  background: rgba(245, 245, 245, 1);
  border: 1px solid rgba(75, 85, 99, 0.3);
}
.status-badge {
  animation: pulse 2s infinite;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.slide-in {
  animation: slideIn 0.6s ease-out;
}
</style>
