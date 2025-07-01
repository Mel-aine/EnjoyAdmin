<template>
  <div>
    <div class="mt-10">
      <TableComponent
        :items="titles"
        :datas="reservations"
        :filterable="true"
        :pagination="true"
        :loading="loading"
        :showHeader="true"
        :title="$t('Booking')"
        :pageSize="15"
        :showButtonAllElement="true"
        @edit="onEditBooking"
        @delete="onDeleteBooking"
        @view="onviewBooking"
        class="modern-table"
      />
    </div>
  </div>
  <ModalDelete
    v-if="modalShow"
    @close="modalShow = false"
    @delete="confirmDelete"
    :isLoading="loadingDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import {
  getReservation,
  getUser,
  getServiceProduct,
  deleteReservation,
  getReservationServiceProduct,
} from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import type { ReservationType, userDataType, ServiceProductType } from '@/types/option'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import { formatDateT } from '@/components/utilities/UtilitiesFunction'
import { useBookingStore } from '@/composables/booking'

const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
const serviceStore = useServiceStore()
const toast = useToast()
const modalShow = ref(false)
const users = ref<userDataType[]>([])
const selectedReservation = ref<any>(null)
const selectedReservationId = ref<number | null>(null)
const loadingDelete = ref(false)
const loading = ref(true)
const store = useBookingStore()
const fetchUsers = async () => {
  const response = await getUser()
  users.value = response.data.data
  console.log('userrr', users.value)
}

const serviceProducts = ref<ServiceProductType[]>([])
const fetchServiceProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId

    const response = await getServiceProduct(serviceId)
    serviceProducts.value = response.data
    console.log('hhh', serviceProducts.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
  }
}

const reservations = ref<ReservationType[]>([])

const fetchReservation = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getReservation(serviceId)
    console.log('....', response.data)

    reservations.value = await Promise.all(
      response.data.map(async (res: any) => {
        const user = users.value.find((u: any) => u.id === res.userId)
        const statusClasses = getStatusColor(res.status).split(' ')
        const paymentClasses = getPaymentColor(res.paymentStatus).split(' ')

        const products = await fetchReservationServiceProduct(res.id)

        return {
          ...res,
          date: formatDateT(res.arrivedDate),
          dateD: formatDateT(res.departDate),
          email: user?.email || '',
          phone:user?.phoneNumber || '',
          userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
          statusColor: {
            label: res.status,
            bg: statusClasses[0],
            text: statusClasses[1],
          },
          paymentStatusColor: {
            label: res.paymentStatus,
            bg: paymentClasses[0],
            text: paymentClasses[1],
          },
          serviceProducts: products,
        }
      }),
    )

    reservations.value.sort((a: any, b: any) => a.userFullName.localeCompare(b.userFullName))

    console.log('.....reservation', reservations.value)
  } catch (error) {
    console.error('fetch failed:', error)
  }
}

onMounted(async () => {
  await fetchUsers()
  await fetchServiceProduct()
  await new Promise((resolve) => setTimeout(resolve, 500))
  await fetchReservation()

  loading.value = false
})

const titles = computed(() => [
  {
    name: 'userFullName',
    label: t('Name'),
    type: 'text',
    sortable: true,
    filterable: false,
  },
  {
    name: 'email',
    label: t('Email'),
    type: 'url',
    filterable: true,
  },
  {
    name: 'date',
    label: t('CheckIn'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'dateD',
    label: t('CheckOut'),
    type: 'text',
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
      {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
        color: 'bg-red-100 text-red-600 px-2 py-1 rounded-full',
      },
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

const fetchReservationServiceProduct = async (reservationId: number) => {
  try {
    const response = await getReservationServiceProduct(reservationId)
    const result = response.data.map((item: any) => {
      const product = serviceProducts.value.find((p: any) => p.id === item.serviceProductId)

      return {
        ...item,
        productName: product?.productName || 'Inconnu',
        productType: product?.productType || '',
        productDetails: product || {},
        startDateFormatted: formatDateT(item.startDate),
        endDateFormatted: formatDateT(item.endDate),
      }
    })

    console.log('Produits liés à la réservation :', result)
    return result
  } catch (error) {
    console.log('Erreur fetchReservationServiceProduct', error)
    return []
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
    router.push({ name: 'BookingDetails', params: { id: booking.id } })
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
