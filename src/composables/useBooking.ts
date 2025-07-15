import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import {
  getServiceProduct,
  createReservation,
  getService,
  createPayment,
  getReservationById,
  getUserId,
  putReservation,
  getReservationServiceProduct,
  getTypeProductByServiceId,
} from '@/services/api'
import type {
  ProductType,
  RoomTypeData,
  userDataType,
  Payment,
  ReservationType,
} from '@/types/option'
import type { RoomSelection } from '@/utils/models'

export function useBooking() {
  const ServiceProduct = ref<ProductType[]>([])
  const ProductList = ref<ProductType[]>([])
  const reservations = ref<Partial<ReservationType>>({})
  const route = useRoute()
  const isLoading = ref(false)
  const { t } = useI18n()
  const isPaymentModalOpen = ref(false)
  const toast = useToast()
  const fetchData = ref<RoomSelection[]>([])
  const adults = ref(1)
  const children = ref(0)
  const totalPersons = computed(() => adults.value + children.value)
  const serviceStore = useServiceStore()
  const router = useRouter()
  const isEditMode = ref(false)
  const selectedProducts = ref<RoomSelection[]>([])
  const totalPrice = ref(0)
  const ActiveRoomTypes = ref<RoomTypeData[]>([])
  const selectedRoomType = ref<RoomTypeData | null>(null)
  const reservationType = ref('')
  const manualTotalGuests = ref<number | null>(null)
  const availableTakens = ref<string[]>([])

  const updateRoomSelections = (newSelections: RoomSelection[]) => {
    selectedProducts.value = newSelections
  }

  const updateTotalPrice = (newPrice: number) => {
    totalPrice.value = newPrice
  }

  const Payements = ref<Payment[]>([])
  const reservationSummary = ref({
    clientName: '',
    room: '',
    type: '',
    total: 0,
  })

  const currentPageTitle = computed(() => t('Booking'))

  const fetchServiceData = async () => {
    try {
      const serviceId = serviceStore.serviceId
      const response = await getService(serviceId)

      const service = response.data
      const parsedMethods: string[] = Array.isArray(service.paymentMethods)
        ? service.paymentMethods
        : JSON.parse(service.paymentMethods || '[]')

      const paymentMethods = parsedMethods.map((method) => ({
        label: method,
        value: method,
      }))

      Payements.value = [
        {
          ...service,
          paymentMethods,
        },
      ]
    } catch (error) {
      console.error('Erreur lors de la récupération du service :', error)
    }
  }

  const fetchServiceProduct = async () => {
    try {
      const serviceId = serviceStore.serviceId
      const response = await getServiceProduct(serviceId)
      const serviceProducts = response.data
      ProductList.value = response.data
      console.log('serviceprod', serviceProducts)
      ServiceProduct.value = serviceProducts
        .filter((product: ProductType) => product.status == 'available')
        .map((products: ProductType) => {
          return {
            ...products,
            value: products.productName,
            label: products.productName,
            price: products.price,
            roomTypeSelect: products.productTypeId,
          }
        })
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error)
    }
  }

  const reservationCustomerTypeOptions = ref([
    { id: 'Individual', label: t('Individual') },
    { id: 'Group', label: t('Group') },
    { id: 'Corporate', label: t('Corporate') },
  ])
  const reservationCustomerType = ref('Individual')
  const flatpickrConfig = {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    wrap: true,
  }

  watch(totalPersons, (newVal: number) => {
    form.value.totalPerson = newVal
  })

  interface ReservationForm {
    roomType: string | null
    package: string
    arrivalDate: string
    departureDate: string
    normalDescription: string
    totalPerson: number | null
    numberOfNights: number | null
    payment: string
    default_guest: number
    default_deposit: number
    extra_guest: number
  }

  const selectedPaymentMethod = ref('')
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const form = ref<ReservationForm>({
    roomType: null,
    package: '',
    arrivalDate: startOfDay.toISOString(),
    departureDate: endOfDays.toISOString(),
    normalDescription: '',
    totalPerson: totalPersons.value,
    numberOfNights: totalPersons.value,
    payment: 'pending',
    default_guest: 0,
    default_deposit: 0,
    extra_guest: 0,
  })
  const reservationId = ref<number | null>(null)

  const userId = ref<number | null>(null)
  const authStore = useAuthStore()

  const formData = ref<userDataType>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    roleId: null,
    companyName: '',
    groupName: '',
  })

  const saveReservation = async () => {
    isLoading.value = true
    try {
      const reservationPayload = {
        first_name: selectedCustomer.value?.firstName || '',
        last_name: selectedCustomer.value?.lastName || '',
        email: selectedCustomer.value?.email || '',
        phone_number: selectedCustomer.value?.phoneNumber || '',
        service_id: serviceStore.serviceId,
        reservation_type: 'Direct Booking',
        tax_amount: extraGuestPrice.value,
        final_amount: finalTotalPrice.value,
        total_amount: calculateTotalPrice.value,
        discount_amount: form.value.default_deposit,
        guest_count: totalGuests.value,
        arrived_date: form.value.arrivalDate,
        depart_date: form.value.departureDate,
        special_requests: form.value.normalDescription,
        paid_amount: 0,
        created_by: serviceStore.serviceId,
        customer_type: reservationCustomerType.value,
        company_name: formData.value.companyName || '',
        group_name: formData.value.groupName || '',
        booking_source: 'Hotel',
        number_of_nights: form.value.numberOfNights,
        remaining_amount:  finalTotalPrice.value,
        invoice_available: true,
        check_in_date: '',
        check_out_date: '',
        products: selectedProducts.value.map((product: RoomSelection) => ({
          service_product_id: product.roomType,
          start_date: form.value.arrivalDate,
          end_date: form.value.departureDate,
          extra_guest: product.extra_guest || 0,
          total_adult: product.total_guests,
          total_children: product.children,
          rate_per_night: product.roomPrice,
          taxes: 0,
          discounts: 0,
        })),
      }

      const response = await createReservation(reservationPayload)
      reservationSummary.value = {
        clientName: `${selectedCustomer.value?.firstName} ${selectedCustomer.value?.lastName}`,
        room: form.value.roomType ?? '',
        type: form.value.package ?? 'Hotels & Stays',
        total: Number(finalTotalPrice.value ?? 0),
      }
      reservationId.value = response.data.reservation.id
      userId.value = response.data.reservation.userId

      form.value = {
        roomType: null,
        package: '',
        arrivalDate: '',
        departureDate: '',
        normalDescription: '',
        totalPerson: 0,
        numberOfNights: 0,
        payment: '',
        default_guest: 0,
        default_deposit: 0,
        extra_guest: 0,
      }
      toast.success(t('toast.reservationCreated'))
      isPaymentModalOpen.value = true
      reservations.value = response.data
    } catch (error: unknown) {
      const message = 'Error while saving reservation'
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

  const savePayment = async () => {
    isLoading.value = true
    const paymentStatus = selectedPaymentMethod.value === 'Cash' ? 'pending' : 'paid'
    try {
      const payload = {
        user_id: userId.value,
        reservation_id: reservationId.value,
        amount_paid: reservationSummary.value.total,
        payment_method: selectedPaymentMethod.value,
        payment_date: new Date().toISOString(),
        transaction_id: '#TRAN-001',
        status: paymentStatus,
        created_by: userId.value,
        last_modified_by: userId.value,
        service_id: serviceStore.serviceId,
      }

      const response = await createPayment(payload)

      if (response.status === 201) {
        toast.success(t('toast.paymentSucess'))
        isPaymentModalOpen.value = false
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

  const dateError = ref<string | null>(null)

  watch([() => form.value.arrivalDate, () => form.value.departureDate], () => {
    const arrivalDate = form.value.arrivalDate
    const departureDate = form.value.departureDate

    if (!arrivalDate || !departureDate) {
      dateError.value = null
      return
    }

    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)

    if (departure <= arrival) {
      dateError.value = 'The departure date must be after the arrival date.'
    } else {
      dateError.value = null
    }
  })

  const numberOfNights = computed(() => {
    const { arrivalDate, departureDate } = form.value

    if (!arrivalDate || !departureDate) return 0

    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)

    const diffTime = departure.getTime() - arrival.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return diffDays > 0 ? diffDays : 0
  })

  const loadReservationData = async () => {
    const rawId = route.params.id

    if (!rawId) return

    isEditMode.value = true
    reservationId.value = Number(rawId)

    const reservation = (await getReservationById(reservationId.value)).data
    const customerReservation = (await getUserId(reservation.userId)).data
    const reservationProducts = (await getReservationServiceProduct(reservationId.value)).data
    formData.value = {
      ...formData.value,
      firstName: customerReservation.firstName,
      lastName: customerReservation.lastName,
      phoneNumber: customerReservation.phoneNumber,
      email: customerReservation.email,
    }

    form.value = {
      roomType: reservation.reservationProduct,
      package: reservation.reservationType,
      arrivalDate: reservation.arrivedDate,
      departureDate: reservation.departDate,
      normalDescription: reservation.specialRequests,
      totalPerson: reservation.guestCount,
      numberOfNights: reservation.numberOfNights,
      payment: reservation.payment,
      default_guest: 0,
      default_deposit: reservation.discountAmount,
      extra_guest: 0,
    }
    manualTotalGuests.value = reservation.guestCount
    fetchData.value = reservationProducts.map((product: any): RoomSelection => {
      console.log('reservation', product)
      availableTakens.value.push(product.serviceProduct.id)
      return {
        roomType: product.serviceProduct.id,
        roomTypeSelect: product.serviceProduct.productTypeId,
        arrivalDate: reservation.arrived_date || '',
        departureDate: reservation.depart_date || '',
        numberOfNights: numberOfNights.value,
        adults: reservation.guest_count || 1,
        children: 0,
        roomPrice: product.price || 0,
        dateError: '',
        showOccupancyDropdown: false,
        extra_guest: 0,
        extraGuestPrice: 0,
        totalPrice: 0,
      }
    })
  }

  const calculateTotalPrice = computed(() => {
    if (fetchData.value.length > 0) {
      return fetchData.value.reduce((total: number, room: RoomSelection) => {
        const nights = room.numberOfNights ?? 1
        return total + (room.roomPrice || 0) * nights
      }, 0)
    } else if (selectedProducts.value.length > 0) {
      return selectedProducts.value.reduce((total: number, product: RoomSelection) => {
        return total + (product.roomPrice || 0) * numberOfNights.value
      }, 0)
    }

    const nights = numberOfNights.value ?? 0
    return (totalPrice.value || 0) * nights
  })

  const extraGuestPrice = computed(() => {
    if (selectedProducts.value.length > 0) {
      return selectedProducts.value.reduce((total: number, product: RoomSelection) => {
        return total + product.extra_guest * product.extraGuestPrice * numberOfNights.value
      }, 0)
    }
    return 0
  })

  const totalExtraGuests = computed(() => {
    if (selectedProducts.value.length > 0) {
      return selectedProducts.value.reduce((total: number, product: RoomSelection) => {
        return total + parseInt(product.extra_guest.toString() || '0')
      }, 0)
    }
    return 0
  })

  const totalMinimalAmount = computed(() => {
    if (selectedProducts.value.length > 0) {
      return selectedProducts.value.reduce((total: number, product: RoomSelection) => {
        return total + (product.default_deposit || 0) * numberOfNights.value
      }, 0)
    }
    return 0
  })

  const availableRooms = computed(() => {
    const rooms = ServiceProduct.value
    const existingRoomIds = rooms.map((r: ProductType) => r.id)
    const missingRooms = fetchData.value
      .filter((r: RoomSelection) => !existingRoomIds.includes(parseInt(r.roomType)))
      .map((r: RoomSelection) => {
        const roomFromAll = ProductList.value.find(
          (room: ProductType) => room.id === parseInt(r.roomType),
        ) as any
        console.log('this is the room', roomFromAll)
        return {
          id: roomFromAll?.id || r.roomType,
          productName: roomFromAll ? roomFromAll.productName : r.roomType,
          price: r.roomPrice,
          label: roomFromAll ? `${roomFromAll.productName} (réservée)` : `${r.roomType} (réservée)`,
          roomType: roomFromAll?.id,
          roomTypeSelect: roomFromAll?.productTypeId,
          numberOfNights: numberOfNights.value,
        }
      })

    const finalRooms = [...rooms, ...missingRooms]

    return finalRooms.map((room: any) => ({
      ...room,
      label: room.productName,
      roomPrice: room.price,
      roomType: room.id,
    }))
  })

  const updateReservation = async () => {
    try {
      if (!reservationId.value) throw new Error('Aucune réservation sélectionnée')

      const payloadUpdate = {
        first_name: selectedCustomer.value?.firstName || '',
        last_name: selectedCustomer.value?.lastName || '',
        email: selectedCustomer.value?.email || '',
        phone_number: selectedCustomer.value?.phoneNumber || '',
        tax_amount: extraGuestPrice.value,
        final_amount: finalTotalPrice.value,
        total_amount: calculateTotalPrice.value,
        discount_amount: form.value.default_deposit,
        guest_count: totalGuests.value,
        service_id: serviceStore.serviceId,
        reservation_type: 'Direct Booking',
        arrived_date: form.value.arrivalDate,
        depart_date: form.value.departureDate,
        special_requests: form.value.normalDescription,
        last_modified_by: authStore.UserId,
        paid_amount: remainingAmount.value,
        payment_status: form.value.payment,

        products: selectedProducts.value.map((product: RoomSelection) => ({
          service_product_id: product.roomType,
          start_date: form.value.arrivalDate,
          end_date: form.value.departureDate,
        })),
      }

      const response = await putReservation(reservationId.value, payloadUpdate)

      if (response.status !== 200) {
        throw new Error(response.data?.message || 'Error while updating')
      }

      toast.success(t('toast.updateReservation'))
    } catch (error: unknown) {
      const message = t('toast.Error')
      if (error instanceof Error) {
        toast.error(error.message || message)
      } else {
        toast.error(message)
      }
    }
  }

  const handleSubmit = async () => {
    isLoading.value = true
    try {
      if (isEditMode.value) {
        await updateReservation()
      } else {
        await saveReservation()
      }
    } finally {
      isLoading.value = false
    }
  }

  const selectedCustomer = ref<userDataType | null>(null)
  const manualInput = ref({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  })

  const onCustomerSelected = (customer: userDataType | null) => {
    if (customer) {
      selectedCustomer.value = customer
      manualInput.value = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
      }
    } else {
      selectedCustomer.value = null
      manualInput.value = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
      }
    }
  }

  const goBack = () => {
    isEditMode.value = false
    formData.value = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      roleId: null,
      companyName: '',
      groupName: '',
    }
    form.value = {
      roomType: null,
      package: '',
      arrivalDate: '',
      departureDate: '',
      normalDescription: '',
      totalPerson: 0,
      numberOfNights: 0,
      payment: ' ',
      default_guest: 0,
      default_deposit: 0,
      extra_guest: 0,
    }
    window.history.back()
  }
  const fetchRoomType = async () => {
    try {
      const serviceId = serviceStore.serviceId
      const response = await getTypeProductByServiceId(serviceId)

      ActiveRoomTypes.value = response.data
        .filter((type: RoomTypeData) => type.status === 'active')
        .map((item: RoomTypeData) => ({
          ...item,
          value: item.id,
          label: item.name,
        }))
    } catch (error) {
      console.error('Erreur lors de la récupération des roomtypes:', error)
    }
  }

  watch(selectedRoomType, (newType: RoomTypeData | null) => {
    reservationType.value = newType?.name || 'Hotels & Stays'
    form.value.default_guest = Number(newType?.defaultGuest) || 1
    form.value.default_deposit = newType?.defaultDeposit || 0
  })

  const totalGuests = computed(() => {
    return Number(form.value.default_guest) + Number(form.value.extra_guest)
  })

  const finalTotalPrice = computed(() => {
    return Number(calculateTotalPrice.value) + Number(extraGuestPrice.value)
  })

  const remainingAmount = computed(() => {
    return Math.max(0, finalTotalPrice.value - (form.value.default_deposit || 0))
  })
  const roomChange = (room_id: string) => {
    if (availableTakens.value.includes(room_id)) {
      availableTakens.value = availableTakens.value.filter((e: string) => e != room_id)
    } else {
      availableTakens.value.push(room_id)
    }
  }

  return {
    ServiceProduct,
    ProductList,
    reservations,
    route,
    isLoading,
    t,
    isPaymentModalOpen,
    toast,
    fetchData,
    adults,
    children,
    totalPersons,
    serviceStore,
    router,
    isEditMode,
    selectedProducts,
    totalPrice,
    ActiveRoomTypes,
    selectedRoomType,
    reservationType,
    manualTotalGuests,
    availableTakens,
    updateRoomSelections,
    updateTotalPrice,
    Payements,
    reservationSummary,
    currentPageTitle,
    fetchServiceData,
    fetchServiceProduct,
    reservationCustomerTypeOptions,
    reservationCustomerType,
    flatpickrConfig,
    form,
    selectedPaymentMethod,
    userId,
    authStore,
    formData,
    saveReservation,
    savePayment,
    dateError,
    numberOfNights,
    loadReservationData,
    calculateTotalPrice,
    extraGuestPrice,
    totalExtraGuests,
    totalMinimalAmount,
    availableRooms,
    updateReservation,
    handleSubmit,
    selectedCustomer,
    manualInput,
    onCustomerSelected,
    goBack,
    fetchRoomType,
    totalGuests,
    finalTotalPrice,
    remainingAmount,
    roomChange,
  }
}
