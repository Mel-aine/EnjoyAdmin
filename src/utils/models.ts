export interface RoomSelection {
  roomType: string
  arrivalDate: string
  departureDate: string
  numberOfNights: number
  roomTypeSelect: number | null
  adults: number
  children: number
  roomPrice: number | null
  dateError: string
  showOccupancyDropdown: boolean
  default_guest?: number
  extra_guest: number
  total_guests?: number
  default_deposit?: number
  extraGuestPrice: number
  totalPrice: number
  totalExtraGuestPrice: number
  totalAmount: number
}

/**
 * Interface representing the detailed information of a hotel reservation.
 */
export interface ReservationDetails {
  id: number
  userId: number
  serviceId: number
  reservationType: string
  reservationNumber: string | null
  guestCount: number
  numberOfSeats: number | null
  specialRequests: string | null
  status: string | 'cancelled' | 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'no-show' // Assuming these are the possible statuses
  comment: string | null
  cancellationReason: string | null
  arrivedDate: string // ISO 8601 string (e.g., "2025-07-12T00:00:00.000Z")
  departDate: string // ISO 8601 string
  reservationTime: string | null // Assuming time might be a string if present
  totalAmount: number // Stored as string, consider converting to number if doing calculations
  discountAmount: string // Stored as string
  taxAmount: string // Stored as string
  finalAmount: string // Stored as string
  paidAmount: number // Stored as string
  createdBy: number
  lastModifiedBy: number | null
  createdAt: string // ISO 8601 string
  updatedAt: string // ISO 8601 string
  bookingSource: string
  checkInDate: string
  checkOutDate: string
  numberOfNights: number
  remainingAmount: number
  invoiceAvailable: boolean
  paymentStatus: string | 'pending' | 'paid' | 'partially-paid' | 'overpaid' // Assuming these are the possible statuses
  customerType: string
  groupName: string | null
  companyName: string | null
  service: ServiceDetails
  user: UserDetails
  payments: PaymentRecord[] // This array is empty in your example, but included for completeness
  reservationServiceProducts: ReservationServiceProduct[]
}

/**
 * Interface representing the details of the hotel service.
 */
export interface ServiceDetails {
  id: number
  name: string
  description: string
  categoryId: number
  addressService: string // This is a JSON string, you might want to parse it into AddressServiceDetails
  phoneNumberService: string
  emailService: string
  website: string
  openings: {
    [day: string]: {
      // Keys are days of the week (e.g., "Monday", "Friday")
      closing: string // Time string (e.g., "18:00")
      opening: string // Time string (e.g., "09:00")
    }
  }
  priceRange: string
  facilities: ServiceFacility[]
  policies: string
  paymentMethods: string[]
  averageRating: string // Stored as string
  reviewCount: number
  logo: string
  statusService: string
  images: string[]
  createdBy: number
  lastModifiedBy: number | null
  createdAt: string // ISO 8601 string
  updatedAt: string // ISO 8601 string
  price: number | null // Assuming price can be null
}

/**
 * Interface for the parsed address service details.
 * If `addressService` is always parsed, you would use this directly in `ServiceDetails`.
 */
export interface AddressServiceDetails {
  text: string
  lat: number
  lng: number
}

/**
 * Interface for individual service facilities.
 */
export interface ServiceFacility {
  id: string
  name: string
  price: number
  icon: string
  custom: boolean
}

/**
 * Interface representing the user (guest) details.
 */
export interface UserDetails {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address: string | null
  lastLogin: string | null // ISO 8601 string if present
  twoFactorEnabled: boolean
  roleId: number
  status: string
  createdBy: number | null
  lastModifiedBy: number | null
  createdAt: string // ISO 8601 string
  updatedAt: string // ISO 8601 string
  nationality: string | null
  profilePhoto: string
}

/**
 * Interface representing a single payment record.
 * (Based on your `payments` array being empty, this is a placeholder for future payment data)
 */
export interface PaymentRecord {
  amountPaid: number
  createdAt: string
  createdBy: number
  id: number
  lastModifiedBy: number
  notes: string | null
  orderId: number | null
  paymentDate: string
  paymentDetails: string | null // This could be more specific if you know the structure of payment details
  paymentMethod: string
  reservationId: number
  serviceId: number
  status: string
  transactionId: string
  updatedAt: string
  userId: number
}

/**
 * Interface representing a product or room associated with the reservation.
 */
export interface ReservationServiceProduct {
  id: number
  reservationId: number
  serviceProductId: number
  startDate: string // ISO 8601 string
  endDate: string // ISO 8601 string
  createdBy: number
  lastModifiedBy: number | null
  createdAt: string // ISO 8601 string
  updatedAt: string // ISO 8601 string
  serviceProduct: ServiceProductDetails
  totalAdult: number
  totalChildren: number
  ratePerNight: number
  taxes: number
  discounts: number
  extraGuest: number
  totalExtraGuestPrice: number
  totalAmount: number
  checkInDate: string
  checkOutDate: string
  status: string
}

/**
 * Interface representing the details of a service product (e.g., a specific room).
 */
export interface ServiceProductDetails {
  id: number
  serviceId: number
  productName: string
  price: number
  description: string
  availability: boolean
  customizationAllowed: boolean
  paymentType: string
  createdBy: number
  lastModifiedBy: number | null
  createdAt: string // ISO 8601 string
  updatedAt: string // ISO 8601 string
  status: string // e.g., "booked"
  productTypeId: number
}

export interface ActivityLog {
  id: number
  userId: number
  username: string
  action: string
  entityType: string
  entityId: string
  description: string
  changes: any | null
  ipAddress: string | null
  userAgent: string | null
  createdBy: number
  createdAt: string
  updatedAt: string
  user: UserDetails
}

export interface Room {
  id: string
  label: string
  price: number
  roomType: number
  roomTypeSelect: number
  maxOccupancy?: number
  roomNumber?: string
}

export interface CancellationPolicy {
  policyId?: number // Primary Key
  serviceId?: number // Foreign Key referencing Hotels table
  policyName?: string
  freeCancellationPeriodValue: number
  freeCancellationPeriodUnit: 'hours' | 'days'
  cancellationFeeType: 'none' | 'fixed' | 'percentage' | 'first_night'
  cancellationFeeValue: number
  nonRefundableRateEnabled: boolean
  specialConditionsNotes: string
  lastModifiedByUserId?: number // Foreign Key referencing Utilisateurs table
  last_modified_at?: string // DATETIME
  createdAt?: string // DATETIME
}

export interface FitlterItem {
  searchText: string
  status: string
  roomType: string
  checkInDate: string
  checkOutDate: string
}

export interface RoomFilterItem {
  searchText: string
  status: string
  roomType: string
  equipment: Array<{label: string, value: string}>
  floor: string
}
