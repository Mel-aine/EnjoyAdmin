import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'


// Types
interface Reservation {
  checkinDate: string
  checkinTime: string
  checkoutDate: string
  checkoutTime: string
  rooms: number
  bookingType: string
  bookingSource: string
  businessSource: string
  isComplementary: boolean
  roomType: string
  rateType: string
  roomNumber: string
  adultCount: string
  childCount: string
  rate: number
}

interface Guest {
  title: string
  name: string
  mobile: string
  email: string
  address: string
  country: string
  state: string
  city: string
  zipcode: string
}

interface OtherInfo {
  emailBookingVouchers: boolean
  voucherEmail: string
  sendEmailAtCheckout: boolean
  emailTemplate: string
  accessToGuestPortal: boolean
  successRateOnRegistrationCard: boolean
}

interface Billing {
  roomCharges: number
  taxes: number
  totalAmount: number
  billTo: string
  taxExempt: boolean
  paymentMode: string
  creditType: string
}

interface ProductType {
  id: number
  productName: string
  price: number
  status: string
  productTypeId: number
}

interface RoomTypeData {
  id: number
  name: string
  status: string
  defaultGuest: number
  defaultDeposit: number
}

export function useBooking() {
  // Store references
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()
  const { t } = useI18n()
  const serviceStore = useServiceStore()
  const authStore = useAuthStore()

  // Loading states
  const isLoading = ref(false)
  const isEditMode = ref(false)
  const isPaymentModalOpen = ref(false)

  // Data refs
  const ServiceProduct = ref<ProductType[]>([])
  const ProductList = ref<ProductType[]>([])
  const ActiveRoomTypes = ref<RoomTypeData[]>([])
  const selectedRoomType = ref<RoomTypeData | null>(null)
  const reservationId = ref<number | null>(null)
  const userId = ref<number | null>(null)

  // Form data
  const reservation = ref<Reservation>({
    checkinDate: new Date().toISOString().split('T')[0],
    checkinTime: '15:00',
    checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkoutTime: '11:00',
    rooms: 1,
    bookingType: 'confirm',
    bookingSource: 'direct',
    businessSource: '',
    isComplementary: false,
    roomType: '',
    rateType: '',
    roomNumber: '',
    adultCount: '2',
    childCount: '0',
    rate: 0,
  })

  const guest = ref<Guest>({
    title: 'Mr',
    name: '',
    mobile: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
  })

  const otherInfo = ref<OtherInfo>({
    emailBookingVouchers: false,
    voucherEmail: '',
    sendEmailAtCheckout: false,
    emailTemplate: '',
    accessToGuestPortal: false,
    successRateOnRegistrationCard: false,
  })

  const billing = ref<Billing>({
    roomCharges: 0,
    taxes: 0,
    totalAmount: 0,
    billTo: '',
    taxExempt: false,
    paymentMode: 'cash',
    creditType: '',
  })

  const dateError = ref<string | null>(null)

  // Computed properties
  const numberOfNights = computed(() => {
    const checkin = new Date(reservation.value.checkinDate)
    const checkout = new Date(reservation.value.checkoutDate)
    const diffTime = checkout.getTime() - checkin.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays > 0 ? Math.ceil(diffDays) : 0
  })



  // Options
  const bookingTypes = computed(() => [
    { label: t('Confirm'), value: 'confirm' },
    { label: t('Pending'), value: 'pending' },
    { label: t('Cancelled'), value: 'cancelled' },
  ])

  const bookingSources = computed(() => [
    { label: t('Direct'), value: 'direct' },
    { label: t('Online'), value: 'online' },
    { label: t('Phone'), value: 'phone' },
    { label: t('Walk-in'), value: 'walk-in' },
  ])

  const businessSources = computed(() => [
    { label: t('Corporate'), value: 'corporate' },
    { label: t('Leisure'), value: 'leisure' },
    { label: t('Group'), value: 'group' },
  ])

  const creditTypes = computed(() => [
    { label: 'Visa', value: 'visa' },
    { label: 'MasterCard', value: 'mastercard' },
    { label: 'American Express', value: 'amex' },
  ])

  const billToOptions = computed(() => [
    { label: t('Guest'), value: 'guest' },
    { label: t('Company'), value: 'company' },
    { label: t('Agent'), value: 'agent' },
  ])

  const emailTemplates = computed(() => [
    { label: t('Thank You Email'), value: 'thank-you' },
    { label: t('Confirmation Email'), value: 'confirmation' },
    { label: t('Welcome Email'), value: 'welcome' },
  ])

  // Watchers
  watch([() => reservation.value.checkinDate, () => reservation.value.checkoutDate], () => {
    updateBilling()
  })

  watch(() => reservation.value.rate, () => {
    updateBilling()
  })

  watch(() => numberOfNights.value, () => {
    updateBilling()
  })

  watch([() => reservation.value.checkinDate, () => reservation.value.checkoutDate], () => {
    const arrivalDate = reservation.value.checkinDate
    const departureDate = reservation.value.checkoutDate

    if (!arrivalDate || !departureDate) {
      dateError.value = null
      return
    }

    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)

    if (departure <= arrival) {
      dateError.value = 'validation.departureAfterArrival'
    } else {
      dateError.value = null
    }
  })
  // Methods
  const updateBilling = () => {
    const roomCharges = reservation.value.rate * numberOfNights.value * reservation.value.rooms
    const taxes = roomCharges * 0.15 // 15% tax example

    billing.value.roomCharges = roomCharges
    billing.value.taxes = taxes
    billing.value.totalAmount = roomCharges + taxes
  }


  const fetchRoomTypes = async () => {
    try {
      const serviceId = serviceStore.serviceId
      // const response = await getTypeProductByServiceId(serviceId)

      // ActiveRoomTypes.value = response.data
      //   .filter((type: RoomTypeData) => type.status === 'active')
      //   .map((type: RoomTypeData) => ({
      //     ...type,
      //     value: type.id,
      //     label: type.name,
      //   }))
    } catch (error) {
      console.error('Error fetching room types:', error)
      toast.error(t('toast.errorFetchingRoomTypes'))
    }
  }

  const saveReservation = async () => {
    // if (!canSave.value) {
    //   toast.error(t('toast.fillRequiredFields'))
    //   return
    // }

    isLoading.value = true
    try {
      const reservationPayload = {
        // Guest information
        first_name: guest.value.name.split(' ')[0] || '',
        last_name: guest.value.name.split(' ').slice(1).join(' ') || '',
        email: guest.value.email,
        phone_number: guest.value.mobile,

        // Reservation details
        service_id: serviceStore.serviceId,
        reservation_type: reservation.value.bookingType,
        booking_source: reservation.value.bookingSource,
        business_source: reservation.value.businessSource,

        // Dates and guests
        arrived_date: reservation.value.checkinDate,
        depart_date: reservation.value.checkoutDate,
        number_of_nights: numberOfNights.value,

        // Financial
        total_amount: billing.value.roomCharges,
        tax_amount: billing.value.taxes,
        final_amount: billing.value.totalAmount,
        paid_amount: 0,
        remaining_amount: billing.value.totalAmount,

        // Room details
        room_type: reservation.value.roomType,
        rate_type: reservation.value.rateType,
        room_number: reservation.value.roomNumber,

        // Additional info
        special_requests: '',
        is_complementary: reservation.value.isComplementary,

        created_by: authStore.UserId,
      }

      // const response = await createReservation(reservationPayload)

      // if (response.status === 201) {
      //   reservationId.value = response.data.reservation.id
      //   userId.value = response.data.reservation.userId

      //   toast.success(t('toast.reservationCreated'))

      // }
    } catch (error: any) {
      console.error('Error saving reservation:', error)
      const message = error?.response?.data?.message || t('toast.errorSavingReservation')
      toast.error(message)
    } finally {
      isLoading.value = false
    }
  }



  // const loadReservationData = async () => {
  //   const rawId = route.params.id
  //   if (!rawId) return

  //   isEditMode.value = true
  //   reservationId.value = Number(rawId)

  //   try {
  //     // Load reservation data
  //     const reservationResponse = await getReservationById(reservationId.value)
  //     const reservationData = reservationResponse.data

  //     // Load customer data
  //     const customerResponse = await getUserId(reservationData.userId)
  //     const customerData = customerResponse.data

  //     // Update forms with loaded data
  //     reservation.value = {
  //       checkinDate: reservationData.arrivedDate,
  //       checkoutDate: reservationData.departDate,
  //       checkinTime: '15:00', // Default or from data
  //       checkoutTime: '11:00', // Default or from data
  //       rooms: 1, // From data if available
  //       bookingType: reservationData.reservationType,
  //       bookingSource: reservationData.bookingSource || 'direct',
  //       businessSource: reservationData.businessSource || '',
  //       isComplementary: reservationData.isComplementary || false,
  //       roomType: reservationData.roomType || '',
  //       rateType: reservationData.rateType || '',
  //       roomNumber: reservationData.roomNumber || '',
  //       adultCount: String(reservationData.guestCount || 1),
  //       childCount: '0',
  //       rate: reservationData.totalAmount / reservationData.numberOfNights || 0,
  //     }

  //     guest.value = {
  //       title: 'Mr', // Default or from data
  //       name: `${customerData.firstName} ${customerData.lastName}`,
  //       mobile: customerData.phoneNumber,
  //       email: customerData.email,
  //       address: customerData.address || '',
  //       country: customerData.country || '',
  //       state: customerData.state || '',
  //       city: customerData.city || '',
  //       zipcode: customerData.zipcode || '',
  //     }

  //     updateBilling()

  //   } catch (error) {
  //     console.error('Error loading reservation data:', error)
  //     toast.error(t('toast.errorLoadingReservation'))
  //   }
  // }

  const handleSubmit = async () => {
    if (isEditMode.value) {
      // await updateReservation()
    } else {
      await saveReservation()
    }
  }


  const resetForm = () => {
    reservation.value = {
      checkinDate: new Date().toISOString().split('T')[0],
      checkinTime: '15:00',
      checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkoutTime: '11:00',
      rooms: 1,
      bookingType: 'confirm',
      bookingSource: 'direct',
      businessSource: '',
      isComplementary: false,
      roomType: '',
      rateType: '',
      roomNumber: '',
      adultCount: '2',
      childCount: '0',
      rate: 0,
    }

    guest.value = {
      title: 'Mr',
      name: '',
      mobile: '',
      email: '',
      address: '',
      country: '',
      state: '',
      city: '',
      zipcode: '',
    }

    billing.value = {
      roomCharges: 0,
      taxes: 0,
      totalAmount: 0,
      billTo: '',
      taxExempt: false,
      paymentMode: 'cash',
      creditType: '',
    }

    otherInfo.value = {
      emailBookingVouchers: false,
      voucherEmail: '',
      sendEmailAtCheckout: false,
      emailTemplate: '',
      accessToGuestPortal: false,
      successRateOnRegistrationCard: false,
    }
  }

  const goBack = () => {
    resetForm()
    isEditMode.value = false
    router.back()
  }



  const formatCurrency = (value: number): string => {
    return `${value.toFixed(2)}`
  }

  // Initialize data on component mount
  const initialize = async () => {
    await Promise.all([
      fetchRoomTypes(),
    ])

    // Load reservation data if in edit mode
    // if (route.params.id) {
    //   await loadReservationData()
    // }
  }

  return {
    // Data
    reservation,
    guest,
    otherInfo,
    billing,
    ServiceProduct,
    ProductList,
    ActiveRoomTypes,
    selectedRoomType,
    reservationId,
    userId,

    // States
    isLoading,
    isEditMode,
    isPaymentModalOpen,

    // Computed
    numberOfNights,
    dateError,

    // Options
    bookingTypes,
    bookingSources,
    businessSources,
    creditTypes,
    billToOptions,
    emailTemplates,

    // Methods
    initialize,
    fetchRoomTypes,
    saveReservation,
    handleSubmit,
    resetForm,
    goBack,
    updateBilling,
    formatCurrency,

    // Utils
    t,
    toast,
    router,
    route,
  }
}
