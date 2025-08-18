import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import { getRoomTypes } from '@/services/roomTypeApi'
import { getRateTypes } from '@/services/rateTypeApi'
import { createReservation, getReservationDetailsById } from '@/services/reservation'
import { getBaseRateByRoomAndRateType } from '@/services/roomRatesApi'
import {getPaymentMethods} from '@/services/paymentMethodApi'

// Types existants...
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

interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardHolderName: string
  amount: number
  paymentMethod: string
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

interface RoomExtraInfo {
  baseAdult: number
  baseChild: number
  extraAdults: number
  extraChildren: number
  extraAdultRate: number
  extraChildRate: number
  extraAdultCost: number
  extraChildCost: number
  totalExtraCost: number
}

export function useBooking() {
  // Store references
  const router = useRouter()
  const toast = useToast()
  const { t } = useI18n()
  const serviceStore = useServiceStore()
  const authStore = useAuthStore()

  // Loading states
  const isLoading = ref(false)
  const isLoadingRoom = ref(false)
  const isLoadingRate = ref(false)
  const isPaymentLoading = ref(false)

  // Data refs
  const RoomTypes = ref<Option[]>([])
  const RoomTypesData = ref<RoomTypeData[]>([])
  const roomTypeRateTypes = ref<Map<string, Option[]>>(new Map())
  const roomTypeRooms = ref<Map<string, Option[]>>(new Map())
  const selectBooking = ref<any | null>(null)
  const reservationId = ref<number | null>(null)
  const RoomRateById = ref<number | null>(null)
  const isPaymentButtonShow = ref(false)
  const confirmReservation = ref(false)
  const PaymentMethods = ref<any[]>([])
  const roomTypeBaseInfo = ref<
    Map<
      string,
      { baseAdult: number; baseChild: number; extraAdultRate: number; extraChildRate: number }
    >
  >(new Map())

  // Payment data
  const paymentData = ref<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    amount: 0,
    paymentMethod: 'cash',
  })

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
      isOpen: false,
    },
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
    id: 0,
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

  const guestFullName = computed(() => {
    return `${formData.value.firstName} ${formData.value.lastName}`.trim()
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
  watch(
    () => reservation.value.rooms,
    (newRoomCount) => {
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
    },
  )

  // Watch pour recalculer la facturation quand les configurations changent
  watch(
    roomConfigurations,
    () => {
      updateBilling()
    },
    { deep: true },
  )

  // Watch pour synchroniser le mode de paiement
  watch(
    () => billing.value.paymentMode,
    (newMode) => {
      paymentData.value.paymentMethod = newMode
    },
  )

  // Watch pour synchroniser le montant total
  watch(
    () => billing.value.totalAmount,
    (newAmount) => {
      paymentData.value.amount = newAmount
    },
  )

  // Methods pour la gestion des room types
  const getRateTypesForRoom = (roomId: string): Option[] => {
    const room = roomConfigurations.value.find((r) => r.id === roomId)
    if (!room || !room.roomType) return []

    return roomTypeRateTypes.value.get(room.roomType) || []
  }

  const getRoomsForRoom = (roomId: string): Option[] => {
    const room = roomConfigurations.value.find((r) => r.id === roomId)
    if (!room || !room.roomType) return []

    return roomTypeRooms.value.get(room.roomType) || []
  }


  // Fonction pour charger les rate types pour un room type spécifique
  const loadRateTypesForRoomType = async (roomTypeId: string, forceReload = false) => {
    if (!roomTypeId) return

    const roomTypeIdNumber = Number(roomTypeId)

    try {
      if (roomTypeRateTypes.value.has(roomTypeId) && !forceReload) {
        return
      }

      const response = await fetchRateTypes(roomTypeIdNumber)
      console.log('fetchRateTypes response:', response)

      if (response?.data?.roomType?.rateTypes) {
        const rateTypeOptions: Option[] = response.data.roomType.rateTypes.map((rateType: any) => ({
          label: rateType.rateTypeName,
          value: rateType.id,
        }))

        roomTypeRateTypes.value.set(roomTypeId, rateTypeOptions)
      }
    } catch (error) {
      console.error('Error loading rate types for room type:', error)
      toast.error(t('toast.errorLoadingRateTypes'))
    }
  }

  const loadRoomsForRoomType = async (roomTypeId: string) => {
    if (!roomTypeId || RoomTypesData.value.length === 0) return

    const roomTypeIdNumber = Number(roomTypeId)

    try {
      const selectedRoomTypeData = RoomTypesData.value.find(
        (roomType: RoomTypeData) => roomType.id === roomTypeIdNumber,
      )

      if (!selectedRoomTypeData || !selectedRoomTypeData.rooms) return

      const availableRooms = selectedRoomTypeData.rooms.filter((room: RoomData) => {
        return room.status !== 'maintenance' && room.status !== 'out_of_order'
      })

      const roomOptions: Option[] = availableRooms.map((room: RoomData) => ({
        label: room.roomNumber,
        value: room.id,
      }))

      roomTypeRooms.value.set(roomTypeId, roomOptions)
    } catch (error) {
      console.error('Error loading rooms for room type:', error)
    }
  }

  //fonction pour récupérer le base rate
  const fetchBaseRate = async (
    roomTypeId: string,
    rateTypeId: string,
    date?: string,
  ): Promise<number | null> => {
    try {
      const hotelId = serviceStore.serviceId
      if (!hotelId) {
        throw new Error('Hotel ID not found')
      }

      const response = await getBaseRateByRoomAndRateType({
        hotel_id: hotelId,
        room_type_id: Number(roomTypeId),
        rate_type_id: Number(rateTypeId),
        date: date || reservation.value.checkinDate,
      })
      console.log('fetchBaseRate', response)

      return response?.baseRate || null
    } catch (error) {
      console.error('Error fetching base rate:', error)
      return null
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
      isOpen: false,
    }
    roomConfigurations.value.push(newRoom)
    reservation.value.rooms = roomConfigurations.value.length
  }

  const removeRoom = (roomId: string) => {
    if (roomConfigurations.value.length <= 1) return
    roomConfigurations.value = roomConfigurations.value.filter((room) => room.id !== roomId)
    reservation.value.rooms = roomConfigurations.value.length
  }

  const toggleDropdown = (roomId: string) => {
    roomConfigurations.value.forEach((room) => {
      room.isOpen = room.id === roomId ? !room.isOpen : false
    })
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
        value: room.id,
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

  const fetchRateTypes = async (roomTypeId: any) => {
    try {
      if (!roomTypeId) {
        throw new Error('roomTypeId ID not found')
      }

      const response = await getRateTypes(roomTypeId)

      if (!response.data) {
        throw new Error('Invalid rate types data structure')
      }

      return response
    } catch (error) {
      console.error('Error fetching rate types:', error)
      toast.error(t('toast.errorfetchRateTypes'))
      return { data: { roomType: { rateTypes: [] } } }
    }
  }

  // Customer handling (inchangé)
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
        roleId: customer.roleId || null,
      }

      // Mettre à jour le nom sur la carte
      paymentData.value.cardHolderName = guestFullName.value
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
        id: 0,
      }
      paymentData.value.cardHolderName = ''
    }
  }
  //save reservation
  const saveReservation = async () => {
    isLoading.value = true
    try {
      // Validation
      if (!formData.value.firstName || !formData.value.email) {
        throw new Error('Guest information is incomplete')
      }

      if (roomConfigurations.value.some((room) => !room.roomType)) {
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
        title: formData.value.title || 'Mr',
        company_name: formData.value.companyName || '',
        group_name: formData.value.groupName || '',
        address_line: guest.value.address,
        country: guest.value.country,
        state: guest.value.state,
        city: guest.value.city,
        zipcode: guest.value.zipcode,
        status:'confirmed',
        reservation_status:'confirmed',

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
          .filter((room) => room.roomType && room.roomNumber)
          .map((room) => ({
            room_type_id: Number(room.roomType),
            rate_type_id: room.rateType ? Number(room.rateType) : undefined,
            room_id: Number(room.roomNumber),
            room_rate: Number(room.rate) || 0,
            adult_count: Number(room.adultCount) || 1,
            child_count: Number(room.childCount) || 0,
            room_rate_id:RoomRateById.value
          })),

        // Financial
        total_amount: Number(billing.value.roomCharges) || 0,
        tax_amount: Number(billing.value.taxes) || 0,
        final_amount: Number(billing.value.totalAmount) || 0,
        paid_amount: 0,
        remaining_amount: Number(billing.value.totalAmount) || 0,

        // Additional info
        is_complementary: Boolean(reservation.value.isComplementary),

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

      console.log('Final reservation payload:', reservationPayload)

      const response = await createReservation(reservationPayload)
      reservationId.value = response.reservationId
      console.log('reservationId.value', reservationId.value)

      if (response.reservationId) {
        isPaymentButtonShow.value = true
        confirmReservation.value = true
      }
      // resetForm()
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


  // Fonction calculateRoomRate
  const calculateRoomRate = (
    roomTypeId: string,
    adultCount: number,
    childCount: number,
    baseRate: number,
  ): number => {
    const baseInfo = roomTypeBaseInfo.value.get(roomTypeId)
    if (!baseInfo) return Number(baseRate) || 0 // Assurer la conversion en nombre

    // Conversion explicite en nombres pour éviter la concaténation
    let totalRate = Number(baseRate) || 0

    // Calculer les adultes supplémentaires
    const extraAdults = Math.max(0, Number(adultCount) - Number(baseInfo.baseAdult))
    if (extraAdults > 0 && Number(baseInfo.extraAdultRate) > 0) {
      totalRate = totalRate + (extraAdults * Number(baseInfo.extraAdultRate))
    }

    // Calculer les enfants supplémentaires
    const extraChildren = Math.max(0, Number(childCount) - Number(baseInfo.baseChild))
    if (extraChildren > 0 && Number(baseInfo.extraChildRate) > 0) {
      totalRate = totalRate + (extraChildren * Number(baseInfo.extraChildRate))
    }

    return Number(totalRate.toFixed(2)) // Arrondir à 2 décimales
  }

  //  Fonction onRateTypeChange
  const onRateTypeChange = async (roomId: string, newRateTypeId: string) => {
    const room = roomConfigurations.value.find((r) => r.id === roomId)
    if (!room || !room.roomType || !newRateTypeId) return

    try {
      isLoadingRate.value = true

      // Récupérer les informations complètes du rate
      const rateInfo = await fetchRateInfo(
        room.roomType,
        newRateTypeId,
        reservation.value.checkinDate,
      )

      if (rateInfo) {
        // Mettre à jour les informations de base avec conversion explicite en nombres
        const baseInfo = roomTypeBaseInfo.value.get(room.roomType) || {
          baseAdult: 1,
          baseChild: 0,
          extraAdultRate: 0,
          extraChildRate: 0,
        }

        // Conversion explicite en nombres
        baseInfo.extraAdultRate = Number(rateInfo.extraAdultRate) || 0
        baseInfo.extraChildRate = Number(rateInfo.extraChildRate) || 0
        roomTypeBaseInfo.value.set(room.roomType, baseInfo)

        // Calculer le tarif avec conversion explicite
        room.rate = calculateRoomRate(
          room.roomType,
          Number(room.adultCount),
          Number(room.childCount),
          Number(rateInfo.baseRate) || 0,
        )


        updateBilling()
      }
    } catch (error) {
      console.error('Error fetching rate info:', error)
      toast.error(t('toast.errorFetchingBaseRate'))
    } finally {
      isLoadingRate.value = false
    }
  }

  //  Fonction onRoomTypeChange
  const onRoomTypeChange = async (roomId: string, newRoomTypeId: string) => {
    const room = roomConfigurations.value.find((r) => r.id === roomId)
    if (!room) return

    // Reset les sélections dépendantes
    room.rateType = ''
    room.roomNumber = ''
    room.rate = 0

    if (!newRoomTypeId) return

    try {
      await Promise.all([
        loadRateTypesForRoomType(newRoomTypeId),
        loadRoomsForRoomType(newRoomTypeId),
      ])

      const selectedRoomTypeData = RoomTypesData.value.find((rt) => rt.id === Number(newRoomTypeId))
      if (selectedRoomTypeData) {
        room.adultCount = Number(selectedRoomTypeData.baseAdult) || 1
        room.childCount = Number(selectedRoomTypeData.baseChild) || 0
        room.rate = Number(selectedRoomTypeData.default_price) || 0

        // Stocker les informations avec conversion en nombres
        roomTypeBaseInfo.value.set(newRoomTypeId, {
          baseAdult: Number(selectedRoomTypeData.baseAdult) || 1,
          baseChild: Number(selectedRoomTypeData.baseChild) || 0,
          extraAdultRate: 0,
          extraChildRate: 0,
        })
      }
    } catch (error) {
      console.error('Error in onRoomTypeChange:', error)
      toast.error(t('toast.errorLoadingRoomTypeData'))
    }
  }

  // Fonction updateBilling
  const updateBilling = () => {
    const roomCharges = roomConfigurations.value.reduce((total, room) => {
      const roomRate = Number(room.rate) || 0
      const nights = Number(numberOfNights.value) || 0
      return Number(total) + (roomRate * nights)
    }, 0)

    // Calculer les taxes uniquement si pas d'exemption fiscale
    const taxes = billing.value.taxExempt ? 0 : Number(roomCharges) * 0.15

    // Assigner avec conversion explicite et arrondi
    billing.value.roomCharges = Number(roomCharges.toFixed(2))
    billing.value.taxes = Number(taxes.toFixed(2))
    billing.value.totalAmount = Number((roomCharges + taxes).toFixed(2))
  }

  // Ajouter un watcher pour recalculer quand taxExempt change
  watch(
    () => billing.value.taxExempt,
    () => {
      updateBilling()
    }
  )

  // Fonction onOccupancyChange
  const onOccupancyChange = (
    roomId: string,
    field: 'adultCount' | 'childCount',
    newValue: number,
  ) => {
    const room = roomConfigurations.value.find((r) => r.id === roomId)
    if (!room || !room.roomType || !room.rateType) return

    // Conversion explicite et validation
    const numericValue = Number(newValue) || 0
    if (numericValue < 0) return // Éviter les valeurs négatives

    // Mettre à jour la valeur avec conversion
    room[field] = numericValue

    // Recalculer le tarif
    recalculateRoomRate(roomId)
  }

  //  Fonction fetchRateInfo
  const fetchRateInfo = async (
    roomTypeId: string,
    rateTypeId: string,
    date?: string,
  ): Promise<any | null> => {
    try {
      const hotelId = serviceStore.serviceId
      if (!hotelId) {
        throw new Error('Hotel ID not found')
      }

      const response = await getBaseRateByRoomAndRateType({
        hotel_id: hotelId,
        room_type_id: Number(roomTypeId),
        rate_type_id: Number(rateTypeId),
        date: date || reservation.value.checkinDate,
      })

      console.log('fetchRateInfo response:', response)
      RoomRateById.value = response.id

      // Validation et conversion explicite des données reçues
      return {
        baseRate: Number(response?.baseRate) || 0,
        extraAdultRate: Number(response?.extraAdultRate) || 0,
        extraChildRate: Number(response?.extraChildRate) || 0,
        singleOccupancyRate: Number(response?.singleOccupancyRate) || 0,
        doubleOccupancyRate: Number(response?.doubleOccupancyRate) || 0,
        tripleOccupancyRate: Number(response?.tripleOccupancyRate) || 0,
      }
    } catch (error) {
      console.error('Error fetching rate info:', error)
      return null
    }
  }

  // Fonction getRoomExtraInfo
  const getRoomExtraInfo = (roomId: string): RoomExtraInfo => {
  const room = roomConfigurations.value.find((r) => r.id === roomId)
  if (!room || !room.roomType) {
    return {
      baseAdult: 0,
      baseChild: 0,
      extraAdults: 0,
      extraChildren: 0,
      extraAdultRate: 0,
      extraChildRate: 0,
      extraAdultCost: 0,
      extraChildCost: 0,
      totalExtraCost: 0,
    }
  }

  const baseInfo = roomTypeBaseInfo.value.get(room.roomType)
  if (!baseInfo) {
    return {
      baseAdult: 0,
      baseChild: 0,
      extraAdults: 0,
      extraChildren: 0,
      extraAdultRate: 0,
      extraChildRate: 0,
      extraAdultCost: 0,
      extraChildCost: 0,
      totalExtraCost: 0,
    }
  }

  const adultCount = Number(room.adultCount) || 0
  const childCount = Number(room.childCount) || 0
  const baseAdult = Number(baseInfo.baseAdult) || 0
  const baseChild = Number(baseInfo.baseChild) || 0
  const extraAdultRate = Number(baseInfo.extraAdultRate) || 0
  const extraChildRate = Number(baseInfo.extraChildRate) || 0
  const extraAdults = Math.max(0, adultCount - baseAdult)
  const extraChildren = Math.max(0, childCount - baseChild)
  const extraAdultCost = extraAdults * extraAdultRate
  const extraChildCost = extraChildren * extraChildRate
  const totalExtraCost = extraAdultCost + extraChildCost

  return {
    baseAdult,
    baseChild,
    extraAdults,
    extraChildren,
    extraAdultRate,
    extraChildRate,
    extraAdultCost: Number(extraAdultCost.toFixed(2)),
    extraChildCost: Number(extraChildCost.toFixed(2)),
    totalExtraCost: Number(totalExtraCost.toFixed(2)),
  }
}


  //  watch recalculer automatiquement quand les comptes changent
  watch(
    roomConfigurations,
    (newConfigs, oldConfigs) => {
      newConfigs.forEach((room, index) => {
        const oldRoom = oldConfigs?.[index]
        if (
          oldRoom &&
          (room.adultCount !== oldRoom.adultCount || room.childCount !== oldRoom.childCount)
        ) {
          // Recalculer le tarif si le nombre d'adultes ou d'enfants a changé
          if (room.roomType && room.rateType) {
            recalculateRoomRate(room.id)
          }
        }
      })
      updateBilling()
    },
    { deep: true },
  )



  // Fonction pour recalculer le tarif d'une chambre spécifique

  const recalculateRoomRate = async (roomId: string) => {
    const room = roomConfigurations.value.find((r) => r.id === roomId)
    if (!room || !room.roomType || !room.rateType) return

    try {
      const rateInfo = await fetchRateInfo(
        room.roomType,
        room.rateType,
        reservation.value.checkinDate,
      )
      if (!rateInfo) return

      let baseInfo = roomTypeBaseInfo.value.get(room.roomType)

      if (!baseInfo) {
        baseInfo = {
          baseAdult: rateInfo.baseAdult ?? 0,
          baseChild: rateInfo.baseChild ?? 0,
          extraAdultRate: rateInfo.extraAdultRate ?? 0,
          extraChildRate: rateInfo.extraChildRate ?? 0,
        }
        roomTypeBaseInfo.value.set(room.roomType, baseInfo)
      }

      room.rate = calculateRoomRate(
        room.roomType,
        room.adultCount,
        room.childCount,
        rateInfo.baseRate,
      )

      updateBilling()
    } catch (error) {
      console.error('Error recalculating room rate:', error)
    }
  }



  // afficher les détails des extras dans le résumé
  const roomExtraDetails = computed(() => {
    return roomConfigurations.value.map((room) => ({
      id: room.id,
      ...getRoomExtraInfo(room.id),
    }))
  })

  const resetForm = () => {
    // Reset form data (votre code existant)
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

    roomConfigurations.value = [
      {
        id: 'room-1',
        roomType: '',
        rateType: '',
        roomNumber: '',
        adultCount: 1,
        childCount: 0,
        rate: 0,
        isOpen: false,
      },
    ]

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
      id: 0,
    })


    roomTypeRateTypes.value.clear()
    roomTypeRooms.value.clear()
  }

  // Initialize
  const initialize = async () => {
    try {
      console.log('Initializing booking composable...')
      await fetchRoomTypes()
      await fetchPaymentMethod()
      console.log('Booking composable initialized successfully')
    } catch (error) {
      console.error('Error initializing booking composable:', error)
      toast.error(t('toast.errorInitializing'))
    }
  }

  const fetchPaymentMethod = async() =>{
    try {

      const response = await getPaymentMethods(serviceStore.serviceId!)
      console.log('response....',response.data.data)
      PaymentMethods.value = response.data.data.map((p:any)=>{
        return {
          ...p,
          label : p.methodName,
          value : p.id
        }
      })

    } catch (error) {
      console.error('error',error)

    }
  }

  const showCheckinButton = computed(() => {

  if (!confirmReservation.value) {
    return false
  }

  const today = new Date().toISOString().split('T')[0]
  return reservation.value.checkinDate === today
})

  return {
    // Data
    reservation,
    guest,
    otherInfo,
    billing,
    formData,
    roomConfigurations,
    paymentData,
    PaymentMethods,
    roomTypeBaseInfo,

    // Room type data
    RoomTypes,
    RoomTypesData,

    // States
    isLoading,
    isLoadingRoom,
    isLoadingRate,
    isPaymentLoading,
    dateError,
    confirmReservation,

    // Computed
    numberOfNights,
    totalRoomCharges,
    totalAmount,
    guestFullName,
    roomExtraDetails,
    showCheckinButton,

    // Options
    BookingSource,
    BusinessSource,
    BookingType,
    creditTypes,
    billToOptions,
    emailTemplates,

    // Room configuration methods
    addRoom,
    removeRoom,
    toggleDropdown,
    onRoomTypeChange,
    onRateTypeChange,
    getRateTypesForRoom,
    getRoomsForRoom,
    fetchBaseRate,
    getRoomExtraInfo,
    recalculateRoomRate,
    calculateRoomRate,
    onOccupancyChange,
    onCustomerSelected,

    // Core methods
    initialize,
    saveReservation,
    updateBilling,
    formatCurrency,
    goBack,
    resetForm,
    isPaymentButtonShow,
    selectBooking,
  }
}
