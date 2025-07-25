<template>
  <AdminLayout>
    <div class="min-h-screen">
    <div class="mb-4 max-w-5xl mx-auto mt-2">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <!-- Left: Title & Description -->
        <div>
          <span class="text-purple-500 font-normal">{{ $t('PaymentID') }} : {{ invoice.paymentId }}</span>
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-white">{{ $t('Invoice') }}</h3>
          <p>{{ $t('Transaction') }} : {{ invoice.transactionId }}</p>
          <div class="text-gray-500 text-sm mt-1">
            <ul class="flex flex-wrap space-x-4">
              <li>
                <span class="font-medium text-gray-600 dark:text-gray-400">{{ $t('CreatedAt') }}:</span>
                <span class="text-base text-gray-700 dark:text-gray-300 ml-1">{{ invoice.createdAt }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right: Back Buttons -->
        <div class="flex items-center space-x-2">
          <!-- Desktop Button -->
          <button @click="goBack" class="hidden sm:inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm rounded-md hover:bg-gray-100 transition">
            <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{{ $t('Back') }}</span>
          </button>
          <div class="text-right print:hidden">
          <button @click="printInvoice" class="bg-[#FFA94D] text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-orange-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2-4h6m-6-4v8m6-4h-6" />
            </svg>
            {{ $t('print') }}
          </button>
        </div>
          <!-- Mobile Icon Button -->
          <button @click="goBack" class="sm:hidden inline-flex items-center justify-center p-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  <div class="print-area" ref="componentRef">
    <div class="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden print:bg-white print:shadow-none print:rounded-none print:overflow-visible font-sans">
      <!-- Header -->
      <div class="bg-[#be8ecd] text-white px-8 py-6 flex justify-between items-center print:bg-white print:text-black">
        <div>
          <h1 class="text-2xl font-bold">{{ invoice.serviceName }}</h1>
          <p class="text-sm mt-1">{{ invoice.serviceAddress }}</p>
          <p class="text-sm"><a href="" class="underline">{{ invoice.serviceEmail }}</a></p>
        </div>
        <div class="text-right">
          <p class="uppercase text-xs">{{ $t('InvoiceNumber') }}</p>
          <p class="text-lg font-bold">{{ invoice.invoiceNumber }}</p>
          <p class="text-xs mt-1">{{ $t('Date') }} : {{ invoice.date }}</p>
        </div>
      </div>

      <!-- Infos client -->
      <div class="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p class="uppercase text-sm font-semibold text-gray-500">{{ $t('InvoiceTo') }} :</p>
          <p class="font-medium text-gray-800 dark:text-gray-100 mt-1">{{ invoice.customerName }}</p>
          <p class="text-gray-600 dark:text-gray-400">{{ invoice.customerAddress }}</p>
          <p class="text-gray-600 dark:text-gray-400">{{ invoice.customerEmail }}</p>
        </div>

      </div>

      <!-- Tableau facture -->
      <div class="px-8 overflow-x-auto">
        <table class="min-w-full text-sm mt-4">
          <thead class="bg-[#F3EAF8] dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th class="px-6 py-3 text-left font-semibold">{{ $t('Description') }}</th>
              <th class="px-6 py-3 text-right font-semibold">{{ $t('Amount') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in invoice.items" :key="item.description">
              <td class="px-6 py-4 text-gray-800 dark:text-gray-100">{{ item.description }}</td>
              <td class="px-6 py-4 text-right text-gray-800 dark:text-gray-100">{{ formatCurrency(item.amount) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 dark:bg-gray-800 font-medium">
            <tr>
              <td class="px-6 py-3 text-right text-gray-600 dark:text-gray-300">{{ $t('subtotal') }}</td>
              <td class="px-6 py-3 text-right text-gray-800 dark:text-gray-100">{{ formatCurrency(subtotal) }} </td>
            </tr>
            <tr>
              <td class="px-6 py-3 text-right text-gray-600 dark:text-gray-300">TVA (0%)</td>
              <td class="px-6 py-3 text-right text-gray-800 dark:text-gray-100">{{ formatCurrency(tax) }}</td>
            </tr>
            <tr class="text-base text-gray-900 dark:text-gray-100 font-bold">
              <td class="px-6 py-3 text-right">{{ $t('Total') }}</td>
               <td class="px-6 py-3 text-right">{{ formatCurrency(total)}}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Notes -->
      <div class="px-8 py-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 print:text-gray-700">
        <p class="mb-2">{{ $t('thankyou') }} {{ invoice.serviceName }}.</p>
        <p>{{ $t('pleaseContactUs') }}.</p>
      </div>
    </div>
  </div>

  </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import {ref,onMounted,computed} from 'vue'
import { defineProps } from "vue";
import { useRoute } from 'vue-router'
import { getPaymentById,getUserId,getServiceById,getReservationById} from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import { useVueToPrint } from 'vue-to-print';
import { formatCurrency } from "@/components/utilities/UtilitiesFunction";

defineProps<{ id: string }>()
const route = useRoute()
const serviceStore = useServiceStore();
const invoice = ref<any>({} as any);
const paymentId = ref<number | null>(null);
const componentRef = ref<HTMLDivElement | null>(null);
const goBack=()=>{
  window.history.back()
}
const printInvoice = () => {
  if (!componentRef.value) return;

  const printContents = componentRef.value.innerHTML;
  const printWindow = window.open('', '_blank', 'width=1024,height=768');

  if (!printWindow) return;

  // Récupère les styles de la page actuelle
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules || [])
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Facture</title>
        <style>
          ${styles}
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body class="print-area bg-white dark:bg-gray-900 text-black">
        ${printContents}
      </body>
    </html>
  `);
  printWindow.document.close();

  // Attendre que tout soit chargé avant d’imprimer
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();

    // Ferme après un délai pour éviter les conflits
    setTimeout(() => {
      printWindow.close();
    }, 100);
  };
};



onMounted(async () => {
  const rawId = route.params.id;
  const serviceId = serviceStore.serviceId;
  if (rawId) {
    paymentId.value = Number(rawId);

    try {
      const response = await getPaymentById(paymentId.value);
      const userResponse = await getUserId(response.data.userId);
      const serviceResponse = await getServiceById (serviceId);
      const reservationResponse = await getReservationById(response.data.reservationId);
      console.log("response",reservationResponse)

      invoice.value = {
        paymentId: response.data.id,
        createdAt: new Date(response.data.createdAt).toLocaleString("fr-FR", {
          dateStyle: "long",
          timeStyle: "short"
        }),
        customerName: `${userResponse.data.firstName} ${userResponse.data.lastName}`,
        customerAddress: userResponse.data.phoneNumber,
        customerEmail: userResponse.data.email,
        invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
        date: new Date().toLocaleDateString("fr-FR", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        serviceName:serviceResponse.data.name,
        serviceEmail:serviceResponse.data.emailService,
        //serviceAddress: JSON.parse(serviceResponse.data.addressService).text,
       // serviceReservationProduct:serviceResponse.data.reservationProduct,
        paymentMethod: response.data.paymentMethod,
        transactionId: response.data.transactionId,
        status: response.data.status,
        items: [
          {
        description: `Réservation ${reservationResponse.data.reservationType} (${reservationResponse.data.guestCount} personne${reservationResponse.data.guestCount > 1 ? 's' : ''}) - ${new Date(reservationResponse.data.arrivedDate).toLocaleDateString("fr-FR")} au ${new Date(reservationResponse.data.departDate).toLocaleDateString("fr-FR")}`,
        amount: reservationResponse.data.finalAmount,
      }
    ]
      };

      console.log('Invoice:', reservationResponse);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }
});

const subtotal = computed(() => {
  return (invoice.value.items || []).reduce(
    (sum: number, item: { amount: any }) => sum + (Number(item?.amount) || 0),
    0
  );
});



const tax = computed(() => subtotal.value * 0);
// const total = computed(() => subtotal.value + tax.value);
const total = computed(() => Number(subtotal.value).toFixed(2));



</script>

<style scoped>
/* @media print {
  .print\:hidden {
    display: none !important;
  }
  .print\:text-black {
    color: black !important;
  }
  .shadow-2xl {
    box-shadow: none !important;
  }
  .rounded-2xl {
    border-radius: 0 !important;
  }
}
@media print {
  body * {
    visibility: hidden; /* Cache tout */
 /*.px-8 }

  .print-area, .print-area * {
    visibility: visible; /* Montre seulement la facture */
 /* }

  .print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
} */
@media print {
  body, html {
    margin: 0;
    padding: 0;
    height: auto;
  }

  body * {
    display: none !important; /* Cache tout */
  }

  .print-area, .print-area * {
    display: block !important; /* Affiche uniquement la facture */
  }

  .print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: white; /* Pour éviter des background dark */
    color: black;
    box-shadow: none;
    border-radius: 0;
  }

  /* Supprime padding inutiles */
  .print-area .px-8, .print-area .py-6 {
    padding: 0 !important;
  }
}


</style>
