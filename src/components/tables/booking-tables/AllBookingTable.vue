<template>
  <div>
    <BookingFilter @filter="applyFilter" />
    <div class="mt-10">
      <TableComponent :items="titles" :datas="reservations" :filterable="true" :pagination="true" :loading="loading"
        :showHeader="true" :title="$t('Booking')" :pageSize="15" :showButtonAllElement="true" :searchable="false"
        @edit="onEditBooking" @delete="onDeleteBooking" @view="onviewBooking" class="modern-table">
        <template v-slot:headerActions>
          <div class="flex justify-end ">
            <a href="/add_booking"
              class="block px-4 py-2 dark:hover:text-white bg-primary hover:bg-primary/85 text-white font-bold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105  items-center">{{
                $t('AddBooking') }} </a>
          </div>
        </template>
      </TableComponent>
    </div>
  </div>
  <ModalDelete v-if="modalShow" @close="modalShow = false" @delete="confirmDelete" :isLoading="loadingDelete" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import {
  deleteReservation,
} from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import type { ReservationType } from '@/types/option'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { defineAsyncComponent } from 'vue'
const ModalDelete = defineAsyncComponent(() => import('@/components/modal/ModalDelete.vue'))
import TableComponent from '@/components/tables/TableComponent.vue'
import { useBookingStore } from '@/composables/booking'
import BookingFilter from '@/views/Bookings/BookingFilter.vue'
import type { FitlterItem } from '@/utils/models'
import { filterReservation } from '../../../services/hotelApi'

const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
const serviceStore = useServiceStore()
const toast = useToast()
const modalShow = ref(false)
const selectedReservation = ref<any>(null)
const selectedReservationId = ref<number | null>(null)
const loadingDelete = ref(false)
const loading = ref(true)
const store = useBookingStore()
const reservations = ref<ReservationType[]>([])

const safeTranslate = (key: string) => {
  try {
    return t?.(key) || key
  } catch (e) {
    console.warn('Translation error:', e)
    return key
  }
}
// Formatter functions
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(locale.value, options);
};


const applyFilter = async (filter: FitlterItem) => {
  loading.value = true;
  console.log(' filter:', filter);
  const res = await filterReservation(serviceStore.serviceId!, filter);

  reservations.value =[];
  if (res.status === 200 || res.status === 201) {
    console.log(res.data)
    reservations.value = res.data.map((res: any) => {
      const user = res.user;
      const statusClasses = getStatusColor(res.status).split(' ')
      const paymentClasses = getPaymentColor(res.paymentStatus).split(' ')
      return {
        ...res,
        date: res.arrivedDate,
        dateD: res.departDate,
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
        statusColor: {
          label: safeTranslate(res.status),
          bg: statusClasses[0],
          text: statusClasses[1],
        },
        paymentStatusColor: {
          label: safeTranslate(res.paymentStatus),
          bg: paymentClasses[0],
          text: paymentClasses[1],
        },
      }
    })
  }
  loading.value = false
}
onMounted(async () => {
  await applyFilter({
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    searchText: '',
    status: '',
  })
  loading.value = false
})

const titles = computed(() => [


 {
    name: 'reservationNumber',
    label: t('reservationNumber'),
    type: 'text',
    sortable: true,
    filterable: false,
  },
  {
    name: 'userFullName',
    label: t('Name'),
    type: 'text',
    sortable: true,
    filterable: false,
  },
  {
    name: 'totalAmount',
    label: t('TotalAmount'),
    type: 'currency',
    filterable: true,
  },
  {
    name: 'date',
    label: t('CheckIn'),
    type: 'date',
    filterable: true,
  },
  {
    name: 'dateD',
    label: t('CheckOut'),
    type: 'date',
    event: 'view',
    filterable: true,
  },
  {
    name: 'statusColor',
    label: t('Status'),
    type: 'badge',
    filterable: false,
  },
  {
    name: 'paymentStatusColor',
    label: t('Payment'),
    type: 'badge',
    filterable: false,
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'View',
        event: 'view',
        icone: ` <svg class="h-6 w-6 text-orange-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>`,
      },
      {
        name: 'Edit',
        event: 'edit',
        icone: ` <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>`,
      },
     /* {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
        color: 'bg-red-100 text-red-600 px-2 py-1 rounded-full',
      },*/
    ],
  },
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    case 'checked-in':
      return 'bg-purple-100 text-purple-700'
    case 'checked-out':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getPaymentColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700'
    case 'unpaid':
      return 'bg-red-100 text-red-700'
    case 'refunded':
      return 'bg-blue-100 text-blue-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}


const onEditBooking = (booking: any) => handleBookingAction('edit', booking)
const onDeleteBooking = (booking: any) => handleBookingAction('delete', booking)
const onviewBooking = (booking: any) => handleBookingAction('view', booking)

const handleBookingAction = (action: string, booking: any) => {
  if (action === 'edit') {
    selectedReservation.value = reservations.value.find((r: any) => r.id === Number(booking.id))
    router.push({ name: 'EditBooking', params: { id: booking.id } })
    console.log('Editing reservation:', selectedReservation.value)
  } else if (action === 'delete') {
    selectedReservationId.value = booking.id
    modalShow.value = true
  } else if (action === 'view') {
    selectedReservation.value = reservations.value.find((r: any) => r.id === Number(booking.id))
    router.push({ name: 'reservationDetails', params: { id: booking.id } })
    store.setBooking(selectedReservation.value)

    console.log('selectedReservation.value:', selectedReservation.value)
  }
}

const confirmDelete = async () => {
  if (selectedReservationId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteReservation(selectedReservationId.value)
      toast.success(t('toast.reservationDelete'))
      reservations.value = reservations.value.filter(
        (r: any) => r.id !== selectedReservationId.value,
      )
      console.log(`Suppression de la réservation ID: ${selectedReservationId.value}`)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    } finally {
      loadingDelete.value = false
      modalShow.value = false
      selectedReservationId.value = null
    }
  }
}
</script>

<style scoped></style>
