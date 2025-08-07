<template>
    <div class="bg-white min-h-screen flex flex-col items-center py-1 pb-30 px-4">
        <div :id="elementId" ref="invoiceContent" class="w-full max-w-3xl border rounded-lg shadow-lg p-8 bg-white">
            <!-- Header -->
            <h1 class="text-2xl font-bold text-center mb-6 text-primary">{{ $t('invoice.hotel_receipt_template') }}</h1>
            <div class="flex justify-between mb-6">
                <!-- Hotel Details -->
                <div>
                    <h2 class="font-semibold text-lg mb-2">{{ $t('invoice.hotel_details') }}</h2>
                    <div>{{ hotel?.name }}</div>
                    <div>{{ hotel.address }}</div>
                    <div>{{ hotel.city }} {{ hotel.state }} {{ hotel.zip }}</div>
                    <div>{{ hotel.phone }}</div>
                    <div>{{ hotel.email }}</div>
                    <div>{{ hotel.website }}</div>
                </div>
                <!-- Guest Details -->
                <div>
                    <h2 class="font-semibold text-lg mb-2">{{ $t('invoice.guest_details') }}</h2>
                    <div>{{ guest.firstName }} {{ guest.lastName }}</div>
                    <div>{{ guest.address }}</div>
                    <div>{{ guest.city }}, {{ guest.state }}, {{ guest.zip }}</div>
                    <div>{{ guest.phone }}</div>
                    <div>{{ guest.email }}</div>
                    <div>{{ guest.passportId }}</div>
                </div>
            </div>
            <!-- Check-In & Check-Out Details -->
            <div class="mb-6">
                <h2 class="font-semibold text-lg mb-2">{{ $t('invoice.checkin_checkout_details') }}</h2>
                <div>{{ $t('invoice.checkin_date') }}: {{ checkinDate }} {{ $t('invoice.at') }} {{ checkinTime }}</div>
                <div>{{ $t('invoice.checkout_date') }}: {{ checkoutDate }} {{ $t('invoice.at') }} {{ checkoutTime }}
                </div>
                <div>{{ $t('invoice.number_of_nights') }}: {{ nights }}</div>
            </div>
            <!-- Room and Rate Details Table -->
            <div class="mb-6">
                <h2 class="font-semibold text-lg mb-2">{{ $t('invoice.room_and_rate_details') }}</h2>
                <table class="w-full border mb-2">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.room_type') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.room_number') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.rate_per_night') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.no_of_nights') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.total') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(room, i) in rooms" :key="i">
                            <td class="border px-2 py-1 pb-3">{{ room.type }}</td>
                            <td class="border px-2 py-1 pb-3 ">{{ room.number }}</td>
                            <td class="border px-2 py-1 pb-3">{{ formatCurrency(room.rate) }}</td>
                            <td class="border px-2 py-1 pb-3">{{ room.nights }}</td>
                            <td class="border px-2 py-1 pb-3">{{ formatCurrency(room.total) }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="text-right font-semibold">{{ $t('invoice.subtotal') }}: {{ formatCurrency(roomSubtotal) }}
                </div>
            </div>
            <!-- Additional Services and Charges -->
            <div class="mb-6" v-if="services.length > 0">
                <h2 class="font-semibold text-lg mb-2">{{ $t('invoice.additional_services_and_charges') }}</h2>
                <table class="w-full border mb-2">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.description') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.quantity') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.price') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.total') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(service, i) in services" :key="i">
                            <tr class="bg-gray-200 font-bold">
                                <td class="border px-2 py-1 pb-3">{{ service.amenityOrderNumber }}</td>
                                <td class="border px-2 py-1 pb-3">{{ }}</td>
                                <td class="border px-2 py-1 pb-3">{{ }}</td>
                                <td class="border px-2 py-1 pb-3">{{ formatCurrency(service.totalAmount) }}</td>
                            </tr>
                            <tr v-for="(item, i) in service.items" :key="i">
                                <td class="border px-2 py-1 pb-3">{{ item.amenityName }}</td>
                                <td class="border px-2 py-1 pb-3">{{ item.quantity }}</td>
                                <td class="border px-2 py-1 pb-3">{{ item.price }}</td>
                                <td class="border px-2 py-1 pb-3">{{ formatCurrency(item.total) }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="text-right font-semibold">{{ $t('invoice.subtotal') }}: {{ formatCurrency(serviceSubtotal)
                    }}</div>
            </div>
            <!-- Taxes and Fees -->
            <div class="mb-6" v-if="taxes.length > 0">
                <h2 class="font-semibold text-lg mb-2">{{ $t('invoice.taxes_and_fees') }}</h2>
                <table class="w-full border mb-2">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.description') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.rate') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.amount') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(tax, i) in taxes" :key="i">
                            <td class="border px-2 py-1 pb-3">{{ tax.description }}</td>
                            <td class="border px-2 py-1 pb-3">{{ tax.rate }}</td>
                            <td class="border px-2 py-1 pb-3">{{ formatCurrency(tax.amount) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Grand Total -->
            <div class="text-right text-xl font-bold mb-6">
                {{ $t('invoice.grand_total') }}: {{ formatCurrency(grandTotal) }}
            </div>
            <!-- Payment Details -->
            <div class="mb-6" v-if="payments.length > 0">
                <h2 class="font-semibold text-lg mb-2">{{ $t('invoice.payment_details') }}</h2>
                <table class="w-full border mb-2">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.date') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.description') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.payment_method') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.transaction_id') }}</th>
                            <th class="border px-2 py-1 pb-3 text-left">{{ $t('invoice.amount') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(pay, i) in payments" :key="i">
                            <td class="border px-2 py-1 pb-3">{{ formatDateT(pay.date) }}</td>
                            <td class="border px-2 py-1 pb-3 text-sm">{{ pay.description }}</td>
                            <td class="border px-2 py-1 pb-3">{{ pay.method }}</td>
                            <td class="border px-2 py-1 pb-3">{{ pay.transactionId }}</td>
                            <td class="border px-2 py-1 pb-3">{{ formatCurrency(pay.amount) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Special Requests/Notes -->
            <div class="mb-6">
                <h2 class="font-semibold text-lg mb-2">{{ $t('invoice.special_requests_notes') }}</h2>
                <div>{{ notes }}</div>
            </div>
            <!-- Footer -->
            <div class="mt-8 border-t pt-4 text-sm text-gray-700">
                <div>{{ $t('invoice.thank_you_for_choosing', { hotel: hotel.name }) }}</div>
                <div>{{ $t('invoice.welcome_back_message') }}</div>
                <div>{{ $t('invoice.feedback_contact', { email: hotel.email, phone: hotel.phone }) }}</div>
                <div class="mt-4">
                    <span class="font-semibold">{{ $t('invoice.signature') }}</span>: ______________________
                </div>
                <div>
                    <span class="font-semibold">{{ $t('invoice.date') }}</span>: {{ today }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { defineProps } from 'vue';
import { getReservationInvoice } from '@/services/api'

import router from '@/router'
import { formatDateT } from '../utilities/UtilitiesFunction'
import html2pdf from 'html2pdf.js'

const invoiceId = router.currentRoute.value.params.id as string
const invoiceContent = ref<HTMLElement | null>(null);
const hotel = ref<any>({})
const guest = ref<any>({})

const props = defineProps({
    elementId: { type: String, required: true },
    id:{
        type: String, required: true 
    }
})
const emits = defineEmits(['ready'])
const checkinDate = ref('')
const checkinTime = ref('')
const checkoutDate = ref('')
const checkoutTime = ref('')
const nights = ref(0)
const rooms = ref<any>([])
const roomSubtotal = ref(0)
const services = ref<any>([])
const serviceSubtotal = ref(0)
const taxes = ref<any>([])
const grandTotal = ref(0)
const payments = ref<any>([]) // Now a list of payments
const notes = ref('')
const today = new Date().toLocaleDateString()


function formatCurrency(amount: number) {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' })
}

const downloadAsPdf = () => {
    if (!invoiceContent.value) return;

    const options = {
        margin: 0.5,
        filename: `invoice-${guest.value.firstName}-${guest.value.lastName}-${invoiceId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } // 👈 très important
    };

    html2pdf().from(invoiceContent.value).set(options).save();
}

async function fetchInvoiceData(invoiceId: string) {
    const response = await getReservationInvoice(invoiceId)
    const data: any = response.data
    hotel.value = data.hotel
    guest.value = data.guest
    checkinDate.value = data.checkinDate
    checkinTime.value = data.checkinTime
    checkoutDate.value = data.checkoutDate
    checkoutTime.value = data.checkoutTime
    nights.value = data.nights
    rooms.value = data.rooms
    roomSubtotal.value = rooms.value.reduce((sum: number, r: any) => sum + r.total, 0)
    services.value = data.services
    serviceSubtotal.value = services.value.reduce((sum: number, s: any) => sum + s.totalAmount, 0)
    taxes.value = data.taxes
    grandTotal.value = roomSubtotal.value + serviceSubtotal.value // + taxes.value.reduce((sum: number, t: any) => sum + t.amount, 0)
    payments.value = data.payments // Array of payments
    notes.value = data.notes;
    emits('ready')
}

onMounted(() => {
    fetchInvoiceData(props.id??invoiceId).then(() => {
        if (router.currentRoute.value.query.download === 'true') {
            nextTick(() => {
                downloadAsPdf();
            });
        }
    })
})

</script>