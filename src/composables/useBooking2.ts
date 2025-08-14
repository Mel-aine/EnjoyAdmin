import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import { getRoomTypes } from '@/services/roomTypeApi'
import { getRateTypes } from '@/services/rateTypeApi'
import {createReservation} from '@/services/reservation'

// Types
interface RoomConfiguration {
  id: string
  roomType: string
  rateType: string
  roomNumber: string
  adultCount: number
  childCount: number
  rate: number
  isOpen: boolean
}

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

}

interface Guest {
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

interface Option {
  label: string
  value: number | string
}

interface RoomTypeData {
  id: number
  hotelId: number
  default_price?: number
  shortCode: string
  roomTypeName: string
  baseAdult: number
  baseChild: number
  maxAdult: number
  maxChild: number
  publishToWebsite: boolean
  roomAmenities: number[] | null
  color: string
  defaultWebInventory: number
  sortOrder: number
  createdByUserId: number | null
  updatedByUserId: number | null
  isDeleted: boolean
  rooms: RoomData[]
}

interface RoomData {
  id: number
  roomNumber: string
  roomTypeId: number
  status: string
}

interface RateTypeData {
  id: number
  hotelId: number
  rateTypeName: string
  shortCode: string
  roomTypes: string | null
  status: string
  isDeleted: boolean
  isPackage: boolean | null
  createdAt: string
  updatedAt: string
  createdByUserId: number
  updatedByUserId: number
}

interface CustomerType {
  label: string
  value: string
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
  const isLoadingRoom = ref(false)

  // Data refs
  const RoomTypes = ref<Option[]>([])
  const RoomTypesData = ref<RoomTypeData[]>([])
  const RateTypes = ref<RateTypeData[]>([])

  // Stockage des rate types et rooms par room type pour éviter les conflits
  const roomTypeRateTypes = ref<Map<string, Option[]>>(new Map())
  const roomTypeRooms = ref<Map<string, Option[]>>(new Map())

  // Room configurations management
  const roomConfigurations = ref<RoomConfiguration[]>([
    {
      id: 'room-1',
      roomType: '',
      rateType: '',
      roomNumber: '',
      adultCount: 1,
      childCount: 0,
      rate: 0,
      isOpen: false
    }
  ])

  // Form data
  const reservation = ref<Reservation>({
    checkinDate: new Date().toISOString().split('T')[0],
    checkinTime: '15:00',
    checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkoutTime: '11:00',
    rooms: 1,
    bookingType: '',
    bookingSource: '',
    businessSource: '',
    isComplementary: false,
  })

  const guest = ref<Guest>({
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
  })

  const formData = ref<any>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    roleId: null,
    companyName: '',
    groupName: '',
    title: '',
    id: 0
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
    billTo: 'guest',
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

  // Options depuis le store
  const BookingSource = computed(() => serviceStore.bookingSources || [])
  const BusinessSource = computed(() => serviceStore.businessSources || [])
  const BookingType = computed(() => serviceStore.reservationType || [])

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

  // Customer types
  const reservationCustomerType = computed(() => [
    { label: t('Individual'), value: 'individual' },
    { label: t('Company'), value: 'company' },
    { label: t('Group'), value: 'group' },
  ])

  // Watchers
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

    updateBilling()
  })

  // Watch pour la synchronisation du nombre de chambres
  watch(() => reservation.value.rooms, (newRoomCount) => {
    const currentRoomCount = roomConfigurations.value.length

    if (newRoomCount > currentRoomCount) {
      // Ajouter des chambres
      for (let i = currentRoomCount; i < newRoomCount; i++) {
        addRoom()
      }
    } else if (newRoomCount < currentRoomCount && newRoomCount > 0) {
      // Supprimer des chambres (en gardant au moins une)
      roomConfigurations.value = roomConfigurations.value.slice(0, newRoomCount)
    }
  })

  // Watch pour recalculer la facturation quand les configurations changent
  watch(roomConfigurations, () => {
    updateBilling()
  }, { deep: true })

  // Methods pour la gestion des room types
  const getRateTypesForRoom = (roomId: string): Option[] => {
    const room = roomConfigurations.value.find(r => r.id === roomId)
    if (!room || !room.roomType) return []

    return roomTypeRateTypes.value.get(room.roomType) || []
  }

  const getRoomsForRoom = (roomId: string): Option[] => {
    const room = roomConfigurations.value.find(r => r.id === roomId)
    if (!room || !room.roomType) return []

    return roomTypeRooms.value.get(room.roomType) || []
  }

  const onRoomTypeChange = async (roomId: string, newRoomTypeId: string) => {
    const room = roomConfigurations.value.find(r => r.id === roomId)
    if (!room) return

    // Reset les sélections dépendantes
    room.rateType = ''
    room.roomNumber = ''
    room.rate = 0

    if (!newRoomTypeId) return

    // Charger les rate types et rooms pour ce type de chambre
    await loadRateTypesForRoomType(newRoomTypeId)
    await loadRoomsForRoomType(newRoomTypeId)

    // Mettre à jour les informations de base selon le room type
    const selectedRoomTypeData = RoomTypesData.value.find(rt => rt.id === Number(newRoomTypeId))
    if (selectedRoomTypeData) {
      room.adultCount = selectedRoomTypeData.baseAdult
      room.childCount = selectedRoomTypeData.baseChild
      room.rate = selectedRoomTypeData.default_price || 0
    }
  }

  const loadRateTypesForRoomType = async (roomTypeId: string) => {
    if (!roomTypeId || RateTypes.value.length === 0) return

    const roomTypeIdNumber = Number(roomTypeId)

    try {
      const filteredRates = RateTypes.value.filter((rate: RateTypeData) => {
        if (!rate.roomTypes) return false

        try {
          const roomTypeIds = JSON.parse(rate.roomTypes)

          return Array.isArray(roomTypeIds) && roomTypeIds.includes(roomTypeIdNumber)
        } catch (parseError) {
          console.error('Error parsing roomTypes JSON for rate:', rate.id, parseError)
          return false
        }
      })

      const rateOptions: Option[] = filteredRates.map((rate: RateTypeData) => ({
        label: rate.rateTypeName,
        value: rate.id
      }))

      roomTypeRateTypes.value.set(roomTypeId, rateOptions)

    } catch (error) {
      console.error('Error loading rate types for room type:', error)
    }
  }

  const loadRoomsForRoomType = async (roomTypeId: string) => {
    if (!roomTypeId || RoomTypesData.value.length === 0) return

    const roomTypeIdNumber = Number(roomTypeId)

    try {
      const selectedRoomTypeData = RoomTypesData.value.find(
        (roomType: RoomTypeData) => roomType.id === roomTypeIdNumber
      )

      if (!selectedRoomTypeData || !selectedRoomTypeData.rooms) return

      const availableRooms = selectedRoomTypeData.rooms.filter((room: RoomData) => {
        return room.status !== 'maintenance' && room.status !== 'out_of_order'
      })

      const roomOptions: Option[] = availableRooms.map((room: RoomData) => ({
        label: room.roomNumber,
        value: room.id
      }))

      roomTypeRooms.value.set(roomTypeId, roomOptions)
    } catch (error) {
      console.error('Error loading rooms for room type:', error)
    }
  }

  // Room configuration methods
  const addRoom = () => {
    const newRoom: RoomConfiguration = {
      id: `room-${Date.now()}`,
      roomType: '',
      rateType: '',
      roomNumber: '',
      adultCount: 1,
      childCount: 0,
      rate: 0,
      isOpen: false
    }
    roomConfigurations.value.push(newRoom)

    // Synchroniser avec le nombre de chambres dans reservation
    reservation.value.rooms = roomConfigurations.value.length
  }

  const removeRoom = (roomId: string) => {
    if (roomConfigurations.value.length <= 1) return // Garder au moins une chambre

    roomConfigurations.value = roomConfigurations.value.filter(room => room.id !== roomId)

    // Synchroniser avec le nombre de chambres dans reservation
    reservation.value.rooms = roomConfigurations.value.length
  }

  const toggleDropdown = (roomId: string) => {
    roomConfigurations.value.forEach(room => {
      room.isOpen = room.id === roomId ? !room.isOpen : false
    })
  }

  // Billing methods
  const updateBilling = () => {
    const roomCharges = roomConfigurations.value.reduce((total, room) => {
      return total + ((room.rate || 0) * numberOfNights.value)
    }, 0)

    const taxes = roomCharges * 0.15 // 15% tax example

    billing.value.roomCharges = roomCharges
    billing.value.taxes = taxes
    billing.value.totalAmount = roomCharges + taxes
  }

  const totalRoomCharges = computed(() => billing.value.roomCharges)
  const totalAmount = computed(() => billing.value.totalAmount)

  // Data fetching methods
  const fetchRoomTypes = async () => {
    try {
      isLoadingRoom.value = true
      const hotelId = serviceStore.serviceId

      if (!hotelId) {
        throw new Error('Hotel ID not found')
      }

      const response = await getRoomTypes(hotelId)

      if (!response.data?.data?.data || !Array.isArray(response.data.data.data)) {
        throw new Error('Invalid room types data structure')
      }

      RoomTypesData.value = response.data.data.data

      const roomTypeOptions: Option[] = response.data.data.data.map((room: RoomTypeData) => ({
        label: room.roomTypeName,
        value: room.id
      }))
      RoomTypes.value = roomTypeOptions

    } catch (error) {
      console.error('Error fetching room types:', error)
      toast.error(t('toast.errorFetchingRoomTypes'))
      RoomTypes.value = []
      RoomTypesData.value = []
    } finally {
      isLoadingRoom.value = false
    }
  }

  const fetchRateTypes = async () => {
    try {
      const hotelId = serviceStore.serviceId

      if (!hotelId) {
        throw new Error('Hotel ID not found')
      }

      const response = await getRateTypes(hotelId)


      if (!response.data?.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid rate types data structure')
      }

      RateTypes.value = response.data.data

    } catch (error) {
      console.error('Error fetching rate types:', error)
      toast.error(t('toast.errorfetchRateTypes'))
      RateTypes.value = []
    }
  }

  // Customer handling
  const onCustomerSelected = (customer: any | null) => {
    if (customer) {
      formData.value = {
        ...formData.value,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phoneNumber: customer.phoneNumber || '',
        email: customer.email || '',
        companyName: customer.companyName || '',
        groupName: customer.groupName || '',
        title: customer.title || '',
        id: customer.id || 0,
        roleId: customer.roleId || null
      }
    } else {
      formData.value = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        roleId: null,
        companyName: '',
        groupName: '',
        title: '',
        id: 0
      }
    }
  }

  // Save reservation
 const saveReservation = async () => {
  isLoading.value = true
  try {
    // Validation
    if (!formData.value.firstName || !formData.value.email) {
      throw new Error('Guest information is incomplete')
    }

    if (roomConfigurations.value.some(room => !room.roomType)) {
      throw new Error('Room configuration is incomplete')
    }

    if (!serviceStore.serviceId) {
      throw new Error('Service ID is missing')
    }

    const reservationPayload = {
      // Guest information
      first_name: formData.value.firstName,
      last_name: formData.value.lastName,
      email: formData.value.email,
      phone_primary: formData.value.phoneNumber,
      title: formData.value.title || '',
      company_name: formData.value.companyName || '',
      group_name: formData.value.groupName || '',
      address_line: guest.value.address,
      country: guest.value.country,
      state: guest.value.state,
      city: guest.value.city,
      zipcode: guest.value.zipcode,

      // Reservation details
      hotel_id: serviceStore.serviceId,
      reservation_type: reservation.value.bookingType,
      booking_source: reservation.value.bookingSource,
      business_source: reservation.value.businessSource,

      // Dates and guests
      arrived_date: reservation.value.checkinDate,
      arrived_time: reservation.value.checkinTime,
      depart_date: reservation.value.checkoutDate,
      depart_time: reservation.value.checkoutTime,
      number_of_nights: numberOfNights.value,
      nights: numberOfNights.value,

      // Room configurations avec validation
      rooms: roomConfigurations.value
        .filter(room => room.roomType && room.roomNumber)
        .map(room => ({
          room_type_id: Number(room.roomType),
          rate_type_id: room.rateType ? Number(room.rateType) : undefined,
          room_id: Number(room.roomNumber),
          room_rate: Number(room.rate) || 0,
          adult_count: Number(room.adultCount) || 1,
          child_count: Number(room.childCount) || 0
        })),

      // Financial
      total_amount: Number(billing.value.roomCharges) || 0,
      tax_amount: Number(billing.value.taxes) || 0,
      final_amount: Number(billing.value.totalAmount) || 0,
      paid_amount: 0,
      remaining_amount: Number(billing.value.totalAmount) || 0,

      // Additional info
      is_complementary: Boolean(reservation.value.isComplementary),
      reservation_status: 'PENDING',

      // Payment info
      bill_to: billing.value.billTo,
      payment_mode: billing.value.paymentMode,
      credit_type: billing.value.creditType || undefined,
      tax_exempt: Boolean(billing.value.taxExempt),

      // Other info
      email_booking_vouchers: Boolean(otherInfo.value.emailBookingVouchers),
      voucher_email: otherInfo.value.voucherEmail || undefined,
      send_email_at_checkout: Boolean(otherInfo.value.sendEmailAtCheckout),
      email_template: otherInfo.value.emailTemplate || undefined,
      access_to_guest_portal: Boolean(otherInfo.value.accessToGuestPortal),

      created_by: Number(authStore.UserId),
    }

    // Validation finale
    if (!reservationPayload.rooms || reservationPayload.rooms.length === 0) {
      throw new Error('At least one valid room configuration is required')
    }

    console.log('Final reservation payload:', JSON.stringify(reservationPayload, null, 2))

    // Appel API
    const response = await createReservation(reservationPayload)

    toast.success(t('toast.reservationCreated'))

    return response

  } catch (error: any) {
    console.error('Error saving reservation:', error)

    let message = t('toast.errorSavingReservation')

    if (error?.response?.data?.error) {
      message = error.response.data.error
    } else if (error?.response?.data?.message) {
      message = error.response.data.message
    } else if (error.message) {
      message = error.message
    }

    toast.error(message)
    throw error
  } finally {
    isLoading.value = false
  }
}
  // Utility methods
  const formatCurrency = (value: number): string => {
    return `${value.toLocaleString()} XAF`
  }

  const goBack = () => {
    router.back()
  }

  const resetForm = () => {
    // Reset form data
    Object.assign(reservation.value, {
      checkinDate: new Date().toISOString().split('T')[0],
      checkinTime: '15:00',
      checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkoutTime: '11:00',
      rooms: 1,
      bookingType: '',
      bookingSource: '',
      businessSource: '',
      isComplementary: false,
    })

    // Reset room configurations
    roomConfigurations.value = [{
      id: 'room-1',
      roomType: '',
      rateType: '',
      roomNumber: '',
      adultCount: 1,
      childCount: 0,
      rate: 0,
      isOpen: false
    }]

    // Reset other forms...
    Object.assign(guest.value, {
      address: '',
      country: '',
      state: '',
      city: '',
      zipcode: '',
    })

    Object.assign(formData.value, {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      roleId: null,
      companyName: '',
      groupName: '',
      title: '',
      id: 0
    })

    // Clear maps
    roomTypeRateTypes.value.clear()
    roomTypeRooms.value.clear()
  }

  // Initialize
  const initialize = async () => {
    try {
      console.log('Initializing booking composable...')
      await Promise.all([
        fetchRoomTypes(),
        fetchRateTypes()
      ])
      console.log('Booking composable initialized successfully')
    } catch (error) {
      console.error('Error initializing booking composable:', error)
      toast.error(t('toast.errorInitializing'))
    }
  }

  return {
    // Data
    reservation,
    guest,
    otherInfo,
    billing,
    formData,
    roomConfigurations,

    // Room type data
    RoomTypes,
    RoomTypesData,

    // States
    isLoading,
    isLoadingRoom,
    dateError,

    // Computed
    numberOfNights,
    totalRoomCharges,
    totalAmount,

    // Options
    BookingSource,
    BusinessSource,
    BookingType,
    creditTypes,
    billToOptions,
    emailTemplates,
    reservationCustomerType,

    // Room configuration methods
    addRoom,
    removeRoom,
    toggleDropdown,
    onRoomTypeChange,
    getRateTypesForRoom,
    getRoomsForRoom,

    // Customer methods
    onCustomerSelected,

    // Core methods
    initialize,
    saveReservation,
    updateBilling,
    formatCurrency,
    goBack,
    resetForm,
  }
}
