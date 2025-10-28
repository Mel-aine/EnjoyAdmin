import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import apiClient from './apiClient'

const API_URL = `${import.meta.env.VITE_API_URL as string}/ota`

// Helper function to get headers with token
const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}

/**
 * Room Availability Interfaces
 */

export interface RoomAvailability {
  id: number
  name: string
  shortCode: string
  description: string
  images: string[]
  roomsLeft: number
  rooms?: any[]
  open?: boolean
  capacity: {
    base?: number
    max?: number
    children?: number
    adults?: number
  }
  amenities?: any[]
  ratePlans: Array<{
    id: number
    rateTypeId: number
    name: string
    shortCode: string
    features?: any[]
    policies: any[]
    price?: number
    basePrice?: number
    pricePerNight?: number
    breakdown?: any
    currency?: string
    minNights?: number
    maxNights?: number
  }>
}

export interface AvailabilityResponse {
  message: string
  meta: {
    hotelId: number
    startDate: string
    endDate: string
    adults: number | null
    children: number | null
    hotelName: string | null
    policies: string | null
    cancellationPolicy: string | null
    taxes?: any
  }
  data: RoomAvailability[]
}

export interface AvailabilityParams {
  hotelId: number | null
  startDate: string
  endDate: string
  adults?: number
  children?: number
}

export interface APIReservationResponse {
  id: number
  reservation_id?: string
  hotel_id: number
  hotel?: {
    name: string
    address?: string
    email?: string
    phone?: string
  }
  first_name: string
  last_name: string
  email: string
  phone_primary?: string
  confirmationNumber: string
  arrived_date: string
  depart_date: string
  check_in_time?: string
  check_out_time?: string
  number_of_nights: number
  total_amount: number
  tax_amount: number
  final_amount: number
  discount_amount?: number
  currency?: string
  reservation_status: string
  rooms: Array<{
    id: number
    room_type: {
      id: number
      roomTypeName: string
    }
    rate_type: {
      id: number
      rateTypeName: string
    }
    room_rate: number
    quantity?: number
    adult_count: number
    child_count: number
  }>
}

export interface ReservationDetails {
  id: string
  hotelName: string
  confirmationNumber: string
  hotelAddress?: string
  hotelEmail?: string
  hotelPhone?: string
  guestName: string
  email: string
  phone?: string
  checkIn: string
  checkOut: string
  checkInTime?: string
  checkOutTime?: string
  nights: number
  rooms: Array<{
    name: string
    plan: string
    quantity: number
    adults: number
    children: number
    price: number
  }>
  subtotal: number
  taxes: number
  discount: number
  total: number
  currency: string
  status: string
}

export interface OTABookingPayload {
  hotelId: string
  arrivalDate: string
  departureDate: string
  nights: number
  guest: {
    title: string
    firstName: string
    lastName: string
    mobile: string
    country: string
    email: string
  }
  items: Array<{
    roomId: number
    roomName: string
    rateTypeId: string
    planName: string
    planPrice: number
    quantity: number
    adults: number
    children: number
    taxIncluded: boolean
    totalPrice: number
  }>
   subtotal: number  // ✅ Prix HT total
  taxes: number     // ✅ Total des taxes
  taxBreakdown: Array<{  // ✅ Nouveau
    taxId: number
    taxName: string
    amount: number
    type: string
  }>
  taxIncluded: boolean
  taxRate: number
  discount: number
  totalPrice: number
  currency: string
  promoCode: string | null

}

/**
 * Get Hotel Info
 */
export const getHotelInfo = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/hotels/${hotelId}/info`, getHeaders())
}

/**
 * Get Room Availability for a hotel
 */
export const getAvailability = async (
  params: AvailabilityParams,
): Promise<AvailabilityResponse> => {
  try {
    const { hotelId, ...queryParams } = params

    const response = await axios.get<AvailabilityResponse>(
      `${API_URL}/hotels/${hotelId}/availability`,
      {
        params: queryParams,
        ...getHeaders(),
      },
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        (error.response?.data as any)?.message ||
          'Erreur lors de la récupération de la disponibilité',
      )
    }
    throw error
  }
}

/**
 * Transformer le payload OTA vers le format API de réservation
 */


export function transformOTAPayloadToReservation(
  otaPayload: OTABookingPayload,
  serviceId: number,
  userId?: number,
) {
  // Calculer le room_rate HT pour chaque item
  const roomsData = otaPayload.items.flatMap((item) => {
    let roomRateHT = item.planPrice // Prix par nuit par chambre
    let taxesPerRoom = 0

    // Si les taxes sont incluses dans le prix, on doit les extraire
    if (item.taxIncluded && otaPayload.taxBreakdown && otaPayload.taxBreakdown.length > 0) {
      // Calculer le taux total de taxation (uniquement les pourcentages)
      let totalTaxRate = 0

      otaPayload.taxBreakdown.forEach((tax: any) => {
        if (tax.type === 'flat_percentage') {

          const taxRatio = tax.amount / otaPayload.subtotal
          totalTaxRate += taxRatio
        }
      })

      if (totalTaxRate > 0) {
        roomRateHT = item.planPrice / (1 + totalTaxRate)
        taxesPerRoom = item.planPrice - roomRateHT
      } else {

        const htRatio = otaPayload.subtotal / (otaPayload.subtotal + otaPayload.taxes)
        roomRateHT = item.planPrice * htRatio
        taxesPerRoom = item.planPrice - roomRateHT
      }
    }
    // Si les taxes ne sont pas incluses, on doit les calculer
    else if (!item.taxIncluded && otaPayload.taxes > 0 && otaPayload.subtotal > 0) {
      // Le prix est déjà HT, on calcule juste les taxes à ajouter
      const itemSubtotal = item.planPrice * item.quantity * otaPayload.nights
      const itemTaxes = (itemSubtotal / otaPayload.subtotal) * otaPayload.taxes
      taxesPerRoom = itemTaxes / (item.quantity * otaPayload.nights)
    }



    // Créer une entrée pour chaque chambre
    return Array.from({ length: item.quantity }, () => ({
      room_type_id: item.roomId,
      rate_type_id: parseInt(item.rateTypeId),
      room_id: null,
      room_rate: Math.round(roomRateHT),
      adult_count: item.adults,
      child_count: item.children,
      quantity: 1,
      tax_includes: item.taxIncluded,
      taxes: Math.round(taxesPerRoom),
      meal_plan_rate_include: false,
      room_rate_id: null,
      meal_plan_id: null,
    }))
  })

  // Calculer les totaux
  const totalAmount = otaPayload.totalPrice
  const taxAmount = otaPayload.taxes
  const finalAmount = otaPayload.totalPrice

  console.log('Rooms Data:', roomsData)

  return {
    hotel_id: serviceId,
    first_name: otaPayload.guest.firstName,
    last_name: otaPayload.guest.lastName,
    email: otaPayload.guest.email,
    phone_primary: otaPayload.guest.mobile,
    title: otaPayload.guest.title,
    country: otaPayload.guest.country,

    company_name: '',
    group_name: '',
    address_line: '',
    state: '',
    city: '',
    zipcode: '',
    arrived_date: otaPayload.arrivalDate,
    check_in_time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    depart_date: otaPayload.departureDate,
    check_out_time: '12:00',
    number_of_nights: otaPayload.nights,
    nights: otaPayload.nights,
    reservation_type_id: null,
    booking_source: null,
    business_source: '',
    customType: 'individual',
    reservation_status: 'confirmed',
    status: 'confirmed',
    paid_amount: finalAmount,

    // Chambres (avec room_rate HT)
    rooms: roomsData,

    // Montants financiers
    total_amount: totalAmount,
    tax_amount: taxAmount,
    final_amount: finalAmount,
    remaining_amount: finalAmount,

    // Paiement
    payment_type: 'cash',
    bill_to: 'guest',
    payment_mod: null,

    // Taxes
    tax_exempt: false,

    // Codes promotionnels
    promo_code: otaPayload.promoCode,
    discount_amount: otaPayload.discount,

    // Options additionnelles
    is_complementary: false,
    complimentary_room: false,
    isHold: false,

    // Email et notifications
    email_booking_vouchers: true,
    voucher_email: otaPayload.guest.email,
    send_email_at_checkout: true,
    access_to_guest_portal: false,

    // Métadonnées
    created_by: userId,
    booking_channel: 'OTA_WEBSITE',
    currency: otaPayload.currency,
  }
}

/**
 * Créer une réservation OTA
 */
export async function createOTAReservation(
  payload: OTABookingPayload,
  serviceId: number,
  userId?: number,
) {
  try {
    // Transformer le payload
    const reservationPayload = transformOTAPayloadToReservation(payload, serviceId)

    console.log('Sending reservation payload:', reservationPayload)

    const response = await apiClient.post('/reservation/create', reservationPayload, getHeaders())

    return {
      success: true,
      data: response.data,
      reservationId: response.data?.reservationId || response.data?.id,
      message: 'Reservation created successfully',
    }
  } catch (error: any) {
    console.error('Error creating OTA reservation:', error)

    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create reservation',
      details: error.response?.data,
    }
  }
}

/**
 * Transformer les données de l'API backend vers le format de confirmation
 */
export function transformAPIReservationToConfirmation(
  apiData: APIReservationResponse,
): ReservationDetails {
  // Calculer les totaux pour chaque chambre
  const rooms = apiData.rooms.map((room) => {
    const quantity = room.quantity || 1
    const pricePerNight = room.room_rate
    const totalPrice = pricePerNight * quantity * apiData.number_of_nights

    return {
      name: room.room_type.roomTypeName,
      plan: room.rate_type.rateTypeName,
      quantity: quantity,
      adults: room.adult_count,
      children: room.child_count,
      price: totalPrice,
    }
  })

  return {
    id: apiData.reservation_id || `RES-${apiData.id}`,
    confirmationNumber: apiData.confirmationNumber || `RES-${apiData.id}`,
    hotelName: apiData.hotel?.name || 'Hotel',
    hotelAddress: apiData.hotel?.address,
    hotelEmail: apiData.hotel?.email,
    hotelPhone: apiData.hotel?.phone,
    guestName: `${apiData.first_name} ${apiData.last_name}`,
    email: apiData.email,
    phone: apiData.phone_primary,
    checkIn: apiData.arrived_date,
    checkOut: apiData.depart_date,
    checkInTime: apiData.check_in_time,
    checkOutTime: apiData.check_out_time,
    nights: apiData.number_of_nights,
    rooms: rooms,
    subtotal: apiData.total_amount,
    taxes: apiData.tax_amount,
    discount: apiData.discount_amount || 0,
    total: apiData.final_amount,
    currency: apiData.currency || 'XAF',
    status: apiData.reservation_status,
  }
}

/**
 * Récupérer les détails d'une réservation par son ID
 */
export async function getReservationById(
  reservationId: string | number,
): Promise<ReservationDetails> {
  try {
    const response = await axios.get(`${API_URL}/hotels/reservation/${reservationId}`, getHeaders())

    if (!response.data) {
      throw new Error('No reservation data received')
    }
    console.log('Fetched reservation data:', response.data)
    // Transformer les données API vers le format de confirmation
    return transformAPIReservationToConfirmation(response.data)
  } catch (error: any) {
    console.error('Error fetching reservation:', error)
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to fetch reservation details',
    )
  }
}

/** * Annuler une réservation par son ID
 */
export async function cancelReservationById(
  reservationId: string | number,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.post(
      `${API_URL}/hotels/reservation/${reservationId}/cancel`,
      {},
      getHeaders(),
    )

    return {
      success: true,
      message: response.data?.message || 'Reservation cancelled successfully',
    }
  } catch (error: any) {
    console.error('Error cancelling reservation:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to cancel reservation',
    }
  }
}

/**cancellation summary  */
export async function getCancellationSummary(
  reservationId: string | number,
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const response = await axios.get(
      `${API_URL}/hotels/cancellation-summary/${reservationId}`,
      getHeaders(),
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    console.error('Error fetching cancellation summary:', error)
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || 'Failed to fetch cancellation summary',
    }
  }
}
