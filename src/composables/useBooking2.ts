import { ref, computed, watch } from 'vue'
import {  useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import { getRoomTypes } from '@/services/roomTypeApi'
import {  getRateTypesByRoomTypes } from '@/services/rateTypeApi'
import { createReservation } from '@/services/reservation'
import { getBaseRateByRoomAndRateType } from '@/services/roomRatesApi'
import { prepareFolioAmount, safeParseInt } from '@/utils/numericUtils'
import { getAvailableRoomsByTypeId, getMarketCodesByHotelId } from '../services/configrationApi'

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
  taxes: any[]
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
  complimentaryRoom?: boolean
  isHold: boolean
  reservationStatus: string
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
  paymentMode?: number
  creditType: string
  paymentType: string
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
  taxRates: any[]
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
  const isLoadingAvailableRooms = ref(false)

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
  const pendingUploads = ref<Set<string>>(new Set())
  const uploadErrors = ref<string[]>([])
  const isCustomPrize = ref(false)
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
      taxes: [],
    },
  ])

  // Form data
  const reservation = ref<Reservation>({
    checkinDate: new Date().toISOString().split('T')[0],
    checkinTime: '15:00',
    checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkoutTime: '16:00',
    rooms: 1,
    bookingType: '',
    bookingSource: '',
    businessSource: '',
    isComplementary: false,
    complimentaryRoom: false,
    isHold: false,
    reservationStatus: 'confirmed',
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
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    idPhoto: '',
    idType: '',
    idNumber: '',
    idExpiryDate: '',
    issuingCountry: '',
    issuingCity: '',
    profilePhoto: '',
  })
  const taxes = ref<any>([])
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
    creditType: '',
    paymentType: 'cash',
  })
  // Hold Release Date & Time data
  const holdReleaseData = ref({
    date: '',
    time: '',
    releaseTerm: '',
    remindDays: 0,
    dateType: 'hold_release_date'
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

  const businessSourcesLo = ref<any>([...serviceStore.businessSources])
  const bookingTypeLo = ref<any>([...serviceStore.reservationType])
  const marketCodesLo = ref<any>([])
  const bookingSourceLo = ref<any>([...serviceStore.bookingSources])
  // Options depuis le store
  const BookingSource = computed(() => bookingSourceLo.value || [])
  const BusinessSource = computed(() => businessSourcesLo.value || [])
  const BookingType = computed(() => bookingTypeLo.value || [])
  const MarketCode = computed(() => marketCodesLo.value || [])
  console.log('BookingType',BookingType.value )
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

  const getMarketCode = async () => {
    try {
      const hotelId = serviceStore.serviceId
      const resp = await getMarketCodesByHotelId(hotelId!)
      console.log('Market Codes response:', resp)
      marketCodesLo.value = resp.data?.data?.data.map((s: any) => ({
        value: s.code,
        label: s.name,
      }))
    } catch (error) {
      console.error('Error fetching market codes:', error)
    }
  }
  getMarketCode()
  // Watchers

  watch([() => reservation.value.checkinDate, () => reservation.value.checkoutDate], async () => {
    const arrivalDate = reservation.value.checkinDate
    const departureDate = reservation.value.checkoutDate

    if (!arrivalDate || !departureDate) {
      dateError.value = null
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)
    arrival.setHours(0, 0, 0, 0)
    departure.setHours(0, 0, 0, 0)

    if (arrival < today) {
      dateError.value = 'validation.arrivalInPast'
    } else if (departure < arrival) {
      dateError.value = 'validation.departureAfterArrival'
    } else {
      dateError.value = null
    }

    // Recalculate room rates when dates change
    // Recharger les chambres disponibles pour chaque configuration de chambre
    for (const room of roomConfigurations.value) {
      if (room.roomType) {
        // Reset la sélection de chambre car les chambres disponibles peuvent avoir changé
        room.roomNumber = ''
        await loadRoomsForRoomType(room.roomType)
      }
    }

    updateBilling()
  })

  // Watch for bookingType changes to update isHold and reservationStatus
  watch(() => reservation.value.bookingType, (newBookingType) => {
    if (newBookingType) {
      const bType = bookingTypeLo.value.filter((e: any) => e.id === newBookingType)
      if (bType && bType.length > 0) {
        reservation.value.isHold = bType[0].isHold;
        reservation.value.reservationStatus = bType[0].reservationStatus;
      }

    }
  })

  // Watch for store data changes to set default values
  watch([bookingTypeLo, bookingSourceLo], ([newBookingTypes, newBookingSources]) => {
    // Set default bookingType if not already set and options are available
    if (!reservation.value.bookingType && newBookingTypes.length > 0) {
      reservation.value.bookingType = newBookingTypes[0].id
    }

    // Set default bookingSource if not already set and options are available
    if (!reservation.value.bookingSource && newBookingSources.length > 0) {
      reservation.value.bookingSource = newBookingSources[0].id
    }
  }, { immediate: true })

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
      paymentData.value.paymentMethod = `${newMode ?? ''}`
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

    }
  }

  const loadRoomsForRoomType = async (roomTypeId: string) => {
    if (!roomTypeId) return

    const roomTypeIdNumber = Number(roomTypeId)

    try {
      isLoadingAvailableRooms.value = true
      const response = await getAvailableRoomsByTypeId(
        roomTypeIdNumber,
        reservation.value.checkinDate,
        reservation.value.checkoutDate,
      )

      console.log('Available rooms response:', response)

      if (response?.data?.data?.rooms) {
        // Filtrer seulement les chambres disponibles
        const availableRooms = response.data.data.rooms.filter(
          (room: any) => room.status === 'available',
        )

        const roomOptions: Option[] = availableRooms.map((room: any) => ({
          label: room.roomNumber,
          value: room.id,
        }))

        roomTypeRooms.value.set(roomTypeId, roomOptions)
      } else {
        // Aucune chambre disponible
        roomTypeRooms.value.set(roomTypeId, [])
      }
    } catch (error) {
      console.error('Error loading available rooms for room type:', error)
      roomTypeRooms.value.set(roomTypeId, [])
    } finally {
      isLoadingAvailableRooms.value = false
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
      taxes: [],
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
      console.log('fetchRoomtype', response)

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
      toast.error(t('toast.fetchError'))
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

      const response = await getRateTypesByRoomTypes(roomTypeId)

      if (!response.data) {
        throw new Error('Invalid rate types data structure')
      }

      return response
    } catch (error) {
      console.error('Error fetching rate types:', error)

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
        address: customer.address || '',
        country: customer.country || '',
        state: customer.state || '',
        city: customer.city || '',
        zipcode: customer.zipcode || '',
        idPhoto: customer.idPhoto || null,
        idType: customer.idType,
        idNumber: customer.idNumber,
        idExpiryDate: customer.idExpiryDate,
        issuingCountry: customer.issuingCountry,
        issuingCity: customer.issuingCity,
        profilePhoto: customer.profilePhoto || null,
        passportNumber: null,
        passportExpiry: null,
        visaNumber: null,
        visaExpiry: null,
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
        address: '',
        country: '',
        state: '',
        city: '',
        zipcode: '',
      }
      paymentData.value.cardHolderName = ''
    }
  }

  // Fonction pour attendre que tous les uploads soient terminés
  const waitForPendingUploads = async (): Promise<boolean> => {
    const maxWaitTime = 30000
    const checkInterval = 500
    let waitTime = 0

    while (pendingUploads.value.size > 0 && waitTime < maxWaitTime) {
      await new Promise((resolve) => setTimeout(resolve, checkInterval))
      waitTime += checkInterval
    }

    if (pendingUploads.value.size > 0) {
      throw new Error('Upload timeout: Some images are still being uploaded')
    }

    if (uploadErrors.value.length > 0) {
      throw new Error(`Upload errors: ${uploadErrors.value.join(', ')}`)
    }

    return true
  }

  // Fonction pour suivre l'état des uploads
  const trackUpload = (uploadId: string) => {
    pendingUploads.value.add(uploadId)
  }

  const completeUpload = (uploadId: string, success: boolean, error?: string) => {
    pendingUploads.value.delete(uploadId)
    if (!success && error) {
      uploadErrors.value.push(error)
    }
  }

  const validateRoomNumbers = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  for (const room of roomConfigurations.value) {
    if (room.roomType && room.roomNumber) {
      // Récupérer les options de chambres disponibles pour ce type de chambre
      const availableRooms = getRoomsForRoom(room.id)

      // Vérifier si le numéro de chambre saisi existe dans les options
      const roomExists = availableRooms.some(option =>
        option.value.toString() === room.roomNumber.toString()
      )

      if (!roomExists) {
        // Récupérer le nom du type de chambre pour l'erreur
        const roomTypeName = RoomTypes.value.find(rt => rt.value.toString() === room.roomType.toString())?.label || 'Unknown'
        errors.push(`Le numéro de chambre "${room.roomNumber}" n'est pas disponible pour le type "${roomTypeName}"`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

const validateRoomNumberOnChange = (roomId: string, newRoomNumber: string) => {
  const room = roomConfigurations.value.find(r => r.id === roomId)
  if (!room || !newRoomNumber) return true

  const availableRooms = getRoomsForRoom(roomId)
  const isValid = availableRooms.some(option =>
    option.value.toString() === newRoomNumber.toString()
  )

  if (!isValid) {
    const roomTypeName = RoomTypes.value.find(rt => rt.value.toString() === room.roomType.toString())?.label || 'Unknown'
    toast.error(`Le numéro de chambre "${newRoomNumber}" n'est pas disponible pour le type "${roomTypeName}"`) // Corrected escaping for consistency
    // Optionnel : réinitialiser le numéro de chambre
    // room.roomNumber = ''
    return false
  }

  return true
}

const validateAllRooms = () => {
  let isValid = true;
  const errors: string[] = [];

  for (const [index, room] of roomConfigurations.value.entries()) {

    // --- Room Type Validation ---
    if (!room.roomType) {
      isValid = false;
      errors.push(t('toast.validation.roomTypeRequired', { index: index + 1 }));
    } else {
      const roomTypeExists = RoomTypes.value.some(option => option.value === room.roomType);
      if (!roomTypeExists) {
        isValid = false;
        errors.push(t('toast.validation.roomTypeInvalid', { index: index + 1, value: room.roomType }));
      }
    }

    // --- Rate Type Validation ---
    if (!room.rateType) {
      isValid = false;
      errors.push(t('toast.validation.rateTypeRequired', { index: index + 1 }));
    } else {
      const rateTypeExists = getRateTypesForRoom(room.id).some(option => option.value === room.rateType);
      if (!rateTypeExists) {
        isValid = false;
        errors.push(t('toast.validation.rateTypeInvalid', { index: index + 1, value: room.rateType }));
      }
    }

    // --- Room Number Validation ---
    if (room.roomType && room.roomNumber) {
      const roomNumberExists = getRoomsForRoom(room.id).some(option =>
        option.value.toString() === room.roomNumber.toString()
      );
      if (!roomNumberExists) {
        isValid = false;
        const roomTypeName = RoomTypes.value.find(rt => rt.value === room.roomType)?.label || 'Unknown';
        errors.push(t('toast.validation.roomNumberInvalid', { index: index + 1, value: room.roomNumber, roomTypeName: roomTypeName }));
      }
    }
  }

  return { isValid, errors };
};
  //save reservation
  const saveReservation = async () => {
    isLoading.value = true
    try {
      // Validation
      if (!formData.value.firstName || !formData.value.lastName  || !formData.value.phoneNumber || !formData.value.email ) {
        throw new Error(t('Guest information is incomplete'))
      }

      // if (roomConfigurations.value.some((room) => !room.roomType)) {
      //   throw new Error('Room configuration is incomplete')
      // }

      if (!serviceStore.serviceId) {
        throw new Error(t('Service ID is missing'))
      }

      if (!billing.value.paymentMode) {
        throw new Error(t('Please select the payment method'))
      }

       const roomValidation = validateAllRooms()
        if (!roomValidation.isValid) {
          // Afficher toutes les erreurs de validation des chambres
          roomValidation.errors.forEach(error => toast.error(error))
          isLoading.value = false
          return
          // throw new Error('Validation des numéros de chambre échouée')
        }

      //email client
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.value.email)) {
      throw new Error(t('Invalid guest email address'))
    }

    // l'email booking voucher si activé
    if (otherInfo.value.emailBookingVouchers) {
      if (!otherInfo.value.voucherEmail) {
        throw new Error(t('Voucher email is required when email booking vouchers is enabled'))
      }
      if (!validateVoucherEmail()) {
        throw new Error(t('Invalid voucher email address'))
      }
    }
      await waitForPendingUploads()

      uploadErrors.value = []

      if (formData.value.profilePhoto && !formData.value.profilePhoto.startsWith('http')) {
        throw new Error(t('Profile photo upload incomplete'))
      }

      if (formData.value.idPhoto && !formData.value.idPhoto.startsWith('http')) {
        throw new Error(t('ID photo upload incomplete'))
      }

      let identityPayload = {
        idPhoto: formData.value.idPhoto || null,
        idType: formData.value.idType,
        idNumber: formData.value.idNumber,
        idExpiryDate: formData.value.idExpiryDate,
        issuingCountry: formData.value.issuingCountry,
        issuingCity: formData.value.issuingCity,
        profilePhoto: formData.value.profilePhoto || null,
        passportNumber: null,
        passportExpiry: null,
        visaNumber: null,
        visaExpiry: null,
      }

      // Appliquer la même logique que dans selectCustomer pour les types d'identité
      if (formData.value.idType) {
        const normalizedIdType = formData.value.idType.toLowerCase().replace(/ /g, '')

        switch (normalizedIdType) {
          case 'passport':
          case 'passeport':
            identityPayload.passportNumber = formData.value.idNumber
            identityPayload.passportExpiry = formData.value.idExpiryDate
            break
          case 'visa':
            identityPayload.visaNumber = formData.value.idNumber
            identityPayload.visaExpiry = formData.value.idExpiryDate
            break
          default:
            identityPayload.idNumber = formData.value.idNumber
            identityPayload.idExpiryDate = formData.value.idExpiryDate
            break
        }
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
        address_line: formData.value.address,
        country: formData.value.country,
        state: formData.value.state,
        city: formData.value.city,
        zipcode: formData.value.zipcode,
        ...identityPayload,
        reservation_status: reservation.value.reservationStatus,
        status: reservation.value.reservationStatus,

        // Reservation details
        hotel_id: serviceStore.serviceId,
        reservation_type_id: reservation.value.bookingType,
        booking_source: reservation.value.bookingSource,
        business_source: reservation.value.businessSource,
        // market_code_id: reservation.value.bookingSource,
        payment_type: billing.value.paymentType ,

        // Hold-specific fields (only included if isHold is true)
        ...(reservation.value.isHold && {
          isHold: reservation.value.isHold,
          holdReleaseDate: new Date(`${holdReleaseData.value.date}T${holdReleaseData.value.time}`).toISOString(),
          ReleaseTem: holdReleaseData.value.releaseTerm,
          ReleaseRemindGuestbeforeDays: holdReleaseData.value.remindDays,
          ReleaseRemindGuestbefore: holdReleaseData.value.dateType
        }),

        // Dates and guests
        arrived_date: reservation.value.checkinDate,
        check_in_time: reservation.value.checkinTime,
        depart_date: reservation.value.checkoutDate,
        check_out_time: reservation.value.checkoutTime,
        number_of_nights: numberOfNights.value,
        nights: numberOfNights.value,

        // Room configurations avec validation
        rooms: roomConfigurations.value
          .filter((room) => room.roomType )
          .map((room) => ({
            room_type_id: safeParseInt(room.roomType, 0),
            rate_type_id: room.rateType ? safeParseInt(room.rateType, 0) : undefined,
            room_id: safeParseInt(room.roomNumber, 0),
            room_rate: prepareFolioAmount(room.rate),
            adult_count: safeParseInt(room.adultCount, 1),
            child_count: safeParseInt(room.childCount, 0),
            room_rate_id: RoomRateById.value,
            taxes:
              (!billing.value.taxExempt && room.taxes?.length
                ? room.taxes.reduce((total, tax: any) => {
                  return Number(total) + Number(tax.taxAmount)
                }, 0)
                : 0) / Number(numberOfNights.value),
          })),

        // Financial
        total_amount: prepareFolioAmount(billing.value.roomCharges),
        tax_amount: prepareFolioAmount(billing.value.taxes),
        final_amount: prepareFolioAmount(billing.value.totalAmount),
        paid_amount: 0,
        remaining_amount: prepareFolioAmount(billing.value.totalAmount),

        // Additional info
        is_complementary: Boolean(reservation.value.isComplementary),

        complimentary_room: Boolean(reservation.value.isComplementary),

        // Payment info
        bill_to: billing.value.billTo,
        payment_mod: billing.value.paymentMode,
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



      console.log('Final reservation payload:', reservationPayload)

      const response = await createReservation(reservationPayload)
      reservationId.value = response.reservationId
      console.log('reservationId.value', reservationId.value)

      if (response.reservationId) {
        isPaymentButtonShow.value = true
        confirmReservation.value = true
      }

      toast.success(t('reservationCreated'))

      return response
    } catch (error: any) {
      console.error('Error saving reservation:', error)

      let message = t('errorSavingReservation')

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
      totalRate = totalRate + extraAdults * Number(baseInfo.extraAdultRate)
    }

    // Calculer les enfants supplémentaires
    const extraChildren = Math.max(0, Number(childCount) - Number(baseInfo.baseChild))
    if (extraChildren > 0 && Number(baseInfo.extraChildRate) > 0) {
      totalRate = totalRate + extraChildren * Number(baseInfo.extraChildRate)
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
      // Charger les rate types et les chambres disponibles en parallèle
      await Promise.all([
        loadRateTypesForRoomType(newRoomTypeId),
        loadRoomsForRoomType(newRoomTypeId),
      ])

      const selectedRoomTypeData = RoomTypesData.value.find((rt) => rt.id === Number(newRoomTypeId))
      if (selectedRoomTypeData) {
        room.adultCount = Number(selectedRoomTypeData.baseAdult) || 1
        room.childCount = Number(selectedRoomTypeData.baseChild) || 0
        room.rate = Number(selectedRoomTypeData.default_price) || 0

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
      const roomRate = prepareFolioAmount(room.rate)
      const nights = Math.max(1, Number(numberOfNights.value) || 1)
      return Number(total) + roomRate * nights
    }, 0)
    const defaultaxes = roomConfigurations.value.reduce((total, room) => {
      const taxs = room.taxes?.length
        ? room.taxes?.reduce((total, tax: any) => {
          return Number(total) + Number(tax.taxAmount)
        }, 0)
        : 0
      return Number(total) + taxs
    }, 0)

    // Calculer les taxes uniquement si pas d'exemption fiscale
    const taxes = billing.value.taxExempt ? 0 : defaultaxes

    // Assigner avec conversion explicite et arrondi
    billing.value.roomCharges = Number(roomCharges.toFixed(2))
    billing.value.taxes = Number(taxes.toFixed(2))
    billing.value.totalAmount = Number(roomCharges.toFixed(2))
  }

  // Ajouter un watcher pour recalculer quand taxExempt change
  watch(
    () => billing.value.taxExempt,
    () => {
      updateBilling()
    },
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
  // Reset reservation data
  Object.assign(reservation.value, {
    checkinDate: new Date().toISOString().split('T')[0],
    checkinTime: '15:00',
    checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkoutTime: '16:00',
    rooms: 1,
    bookingType: '',
    bookingSource: '',
    businessSource: '',
    isComplementary: false,
    complimentaryRoom: false,
    isHold: false,
    reservationStatus: 'confirmed',
  })

  // Reset room configurations
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
      taxes: [],
    },
  ]

  // Reset guest data
  Object.assign(guest.value, {
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
  })

  // Reset ALL formData fields - this was the missing part
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
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    idPhoto: '',
    idType: '',
    idNumber: '',
    idExpiryDate: '',
    issuingCountry: '',
    issuingCity: '',
    profilePhoto: '',
  })

  // Reset other info
  Object.assign(otherInfo.value, {
    emailBookingVouchers: false,
    voucherEmail: '',
    sendEmailAtCheckout: false,
    emailTemplate: '',
    accessToGuestPortal: false,
    successRateOnRegistrationCard: false,
  })

  // Reset billing
  Object.assign(billing.value, {
    roomCharges: 0,
    taxes: 0,
    totalAmount: 0,
    billTo: 'guest',
    taxExempt: false,
    paymentMode: undefined,
    creditType: '',
    paymentType: 'cash',
  })

  // Reset payment data
  Object.assign(paymentData.value, {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    amount: 0,
    paymentMethod: 'cash',
  })

  // Reset hold release data
  Object.assign(holdReleaseData.value, {
    date: '',
    time: '',
    releaseTerm: '',
    remindDays: 0,
    dateType: 'hold_release_date'
  })

  // Reset taxes
  taxes.value = []

  // Clear maps and other state
  roomTypeRateTypes.value.clear()
  roomTypeRooms.value.clear()
  roomTypeBaseInfo.value.clear()

  // Reset other state variables
  dateError.value = null
  confirmReservation.value = false
  isPaymentButtonShow.value = false
  reservationId.value = null
  RoomRateById.value = null
  isCustomPrize.value = false
  isCheckedIn.value = false

  // Clear upload tracking
  pendingUploads.value.clear()
  uploadErrors.value = []
}

  // Initialize
  const initialize = async () => {
    try {
      console.log('Initializing booking composable...')
      await fetchRoomTypes()
      console.log('Booking composable initialized successfully')
    } catch (error) {
      console.error('Error initializing booking composable:', error)
      toast.error(t('toast.errorInitializing'))
    }
  }


  const onRoomNumberChange = async (roomC: any) => {
    console.log('onRoomNumberChange called with:', roomC)

    if (!roomC.roomType || !roomC.roomNumber) {
      return
    }

    try {
      // Récupérer les détails de la chambre depuis l'API des chambres disponibles
      const response = await getAvailableRoomsByTypeId(
        roomC.roomType,
        reservation.value.checkinDate,
        reservation.value.checkoutDate,
      )

      if (response?.data?.rooms) {
        const selectedRoom = response.data.rooms.find((r: any) => r.id == roomC.roomNumber)

        if (selectedRoom) {
          // Si la chambre a des taxRates dans la réponse, les utiliser
          // Sinon, récupérer depuis RoomTypesData comme fallback
          let roomTaxes = []

          if (selectedRoom.taxRates) {
            roomTaxes = selectedRoom.taxRates
          } else {
            // Fallback vers les données existantes
            const rooms =
              RoomTypesData.value.filter((e: any) => e.id === roomC.roomType)[0]?.rooms || []
            const fallbackRoom = rooms.find((r: any) => r.id === roomC.roomNumber)
            roomTaxes = fallbackRoom?.taxRates || []
          }

          roomC.taxes = roomTaxes
          console.log('Room taxes:', roomTaxes)

          // Calculer les montants des taxes
          const nightsForCalculation = Math.max(1, Number(numberOfNights.value) || 1)
          roomC.taxes.forEach((tax: any) => {
            if (tax.postingType === 'flat_amount') {
              tax.taxAmount = parseFloat(tax.amount) * nightsForCalculation
            } else if (tax.postingType === 'flat_percentage') {
              tax.taxAmount =
                ((parseFloat(tax.percentage) * roomC.rate) / 100) * nightsForCalculation
            } else {
              tax.taxAmount = 0
            }
          })

          // Mettre à jour la configuration des chambres
          roomConfigurations.value.forEach((room: any) => {
            if (room.id === roomC.id) {
              room.taxes = roomC.taxes
            }
          })

          roomConfigurations.value = [...roomConfigurations.value]
          console.log('Updated roomConfigurations:', roomConfigurations.value)
        }
      }
    } catch (error) {
      console.error('Error in onRoomNumberChange:', error)
      // En cas d'erreur, utiliser l'ancienne méthode comme fallback
      const rooms = RoomTypesData.value.filter((e: any) => e.id === roomC.roomType)[0]?.rooms || []
      const fallbackRoom = rooms.find((r: any) => r.id === roomC.roomNumber)
      roomC.taxes = fallbackRoom?.taxRates || []

      const nightsForCalculation = Math.max(1, Number(numberOfNights.value) || 1)
      roomC.taxes.forEach((tax: any) => {
        if (tax.postingType === 'flat_amount') {
          tax.taxAmount = parseFloat(tax.amount) * nightsForCalculation
        } else if (tax.postingType === 'flat_percentage') {
          tax.taxAmount = ((parseFloat(tax.percentage) * roomC.rate) / 100) * nightsForCalculation
        } else {
          tax.taxAmount = 0
        }
      })

      roomConfigurations.value.forEach((room: any) => {
        if (room.id === roomC.id) {
          room.taxes = roomC.taxes
        }
      })
      roomConfigurations.value = [...roomConfigurations.value]
    }
  }

  const isCheckedIn = ref(false)

  // Updated computed property for showing check-in button
  const showCheckinButton = computed(() => {
    // Don't show if reservation isn't confirmed
    if (!confirmReservation.value) {
      return false
    }

    if (isCheckedIn.value) {
      return false
    }

    const hasValidRooms = roomConfigurations.value.some((room) => room.roomType && room.roomNumber)

    if (!hasValidRooms) {
      return false
    }

    // Only show on check-in date
    const today = new Date().toISOString().split('T')[0]
    return reservation.value.checkinDate === today
  })
  const canCityLedgerPay = computed(()=>{
    return authStore.hasPermission('access_to_transfer_charges_to_city_ledger')
  })

  const voucherEmailError = ref('')

// Fonction de validation email
const validateVoucherEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (otherInfo.value.emailBookingVouchers && otherInfo.value.voucherEmail) {
    if (!emailRegex.test(otherInfo.value.voucherEmail)) {
      voucherEmailError.value = t('validation.invalidEmail')
      return false
    } else {
      voucherEmailError.value = ''
      return true
    }
  }

  voucherEmailError.value = ''
  return true
}

// Watcher pour valider l'email en temps réel
watch(() => otherInfo.value.voucherEmail, () => {
  if (otherInfo.value.voucherEmail) {
    validateVoucherEmail()
  }
})
  return {
    // Data
    canCityLedgerPay,
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
    isCustomPrize,
    isCheckedIn,
    isLoadingAvailableRooms,
    voucherEmailError,
    validateVoucherEmail,
     validateRoomNumbers,
  validateRoomNumberOnChange,

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
    MarketCode,
    BookingType,
    creditTypes,
    billToOptions,

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
    onRoomNumberChange,
    // Core methods
    initialize,
    saveReservation,
    updateBilling,
    formatCurrency,
    goBack,
    resetForm,
    isPaymentButtonShow,
    selectBooking,
    reservationId,
    pendingUploads,
    uploadErrors,
    trackUpload,
    completeUpload,
    waitForPendingUploads,
    holdReleaseData
  }
}
