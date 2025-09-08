/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReservation } from './reservation'
import { createGuest, getGuests, type GuestPayload } from './guestApi'
import { getChannexBookingRevisions, type ChannexBookingRevision } from './channelManagerApi'
import { useServiceStore } from '../composables/serviceStore'
import { useToast } from 'vue-toastification'

const serviceStore = useServiceStore()
const toast = useToast()

/**
 * Interface for processed reservation data
 */
export interface ProcessedReservationData {
  guestId: number
  hotelId: number
  checkInDate: string
  checkOutDate: string
  roomTypeId?: number
  ratePlanId?: number
  totalAmount: number
  currency: string
  status: 'pending' | 'confirmed'
  otaReservationCode: string
  otaName: string
  notes?: string
  arrivalHour?: string
  occupancy: {
    adults: number
    children: number
    infants: number
  }
  rooms: any[]
  services: any[]
  guarantee?: any
}

/**
 * Check if a guest exists by email
 */
export const findGuestByEmail = async (email: string, hotelId: number): Promise<any | null> => {
  try {
    const response = await getGuests({ email, hotelId })
    const guests = response.data?.data || []
    return guests.length > 0 ? guests[0] : null
  } catch (error) {
    console.error('Error finding guest by email:', error)
    return null
  }
}

/**
 * Create a guest from Channex customer data
 */
export const createGuestFromChannexCustomer = async (customer: any, hotelId: number): Promise<number> => {
  const guestData: GuestPayload = {
    hotelId,
    firstName: customer.name,
    lastName: customer.surname,
    email: customer.mail,
    phonePrimary: customer.phone,
    addressLine: customer.address,
    city: customer.city,
    postalCode: customer.zip,
    country: customer.country,
    companyName: customer.company?.title,
    registrationNumber: customer.company?.number
  }

  try {
    const response = await createGuest(guestData)
    return response.data?.data?.id || response.data?.id
  } catch (error) {
    console.error('Error creating guest:', error)
    throw new Error('Failed to create guest')
  }
}

/**
 * Process a single Channex booking revision
 */
export const processBookingRevision = async (revision: ChannexBookingRevision): Promise<void> => {
  const { attributes } = revision
  const hotelId = serviceStore.serviceId

  if (!hotelId) {
    throw new Error('Hotel ID not found in service store')
  }

  try {
    // Check if guest exists, create if not
    let guest = await findGuestByEmail(attributes.customer.mail, hotelId)
    let guestId: number

    if (!guest) {
      guestId = await createGuestFromChannexCustomer(attributes.customer, hotelId)
      console.log(`Created new guest with ID: ${guestId}`)
    } else {
      guestId = guest.id
      console.log(`Found existing guest with ID: ${guestId}`)
    }

    // Prepare reservation data
    const reservationData: ProcessedReservationData = {
      guestId,
      hotelId,
      checkInDate: attributes.arrival_date,
      checkOutDate: attributes.departure_date,
      totalAmount: parseFloat(attributes.amount),
      currency: attributes.currency,
      status: attributes.status === 'new' ? 'pending' : 'confirmed',
      otaReservationCode: attributes.ota_reservation_code,
      otaName: attributes.ota_name,
      notes: attributes.notes,
      arrivalHour: attributes.arrival_hour,
      occupancy: attributes.occupancy,
      rooms: attributes.rooms,
      services: attributes.services,
      guarantee: attributes.guarantee
    }

    // Create reservation
    const reservationResponse = await createReservation(reservationData)
    console.log(`Created reservation:`, reservationResponse)

    toast.success(`Successfully processed booking revision: ${attributes.unique_id}`)
  } catch (error) {
    console.error(`Error processing booking revision ${revision.id}:`, error)
    toast.error(`Failed to process booking revision: ${attributes.unique_id}`)
    throw error
  }
}

/**
 * Fetch and process all Channex booking revisions
 */
export const fetchAndProcessBookingRevisions = async (params?: {
  page?: number
  limit?: number
}): Promise<void> => {
  try {
    console.log('Fetching Channex booking revisions...')
    const response = await getChannexBookingRevisions(params)
    const { data: revisions, meta } = response.data

    console.log(`Found ${revisions.length} booking revisions (Total: ${meta.total})`)

    if (revisions.length === 0) {
      toast.info('No new booking revisions found')
      return
    }

    // Process each revision
    const results = await Promise.allSettled(
      revisions.map(revision => processBookingRevision(revision))
    )

    // Count successful and failed processing
    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.filter(result => result.status === 'rejected').length

    console.log(`Processing complete: ${successful} successful, ${failed} failed`)
    
    if (successful > 0) {
      toast.success(`Successfully processed ${successful} booking revisions`)
    }
    
    if (failed > 0) {
      toast.warning(`Failed to process ${failed} booking revisions`)
    }

  } catch (error) {
    console.error('Error fetching booking revisions:', error)
    toast.error('Failed to fetch booking revisions from Channex')
    throw error
  }
}

/**
 * Auto-sync booking revisions (can be called periodically)
 */
export const autoSyncBookingRevisions = async (): Promise<void> => {
  try {
    await fetchAndProcessBookingRevisions({ limit: 50 })
  } catch (error) {
    console.error('Auto-sync failed:', error)
  }
}