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
  reservation_id?: number
  guest:Record<string,any>
  nights:Number
  child:Number
  adults:Number
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

/**
 * Interface representing hotel information and configuration
 */
export interface Hotel {
  id?: number
  hotelName: string
  email: string
  phoneNumber: string
  fax?: string
  website?: string
  country: string
  address: string
  address2?: string
  city: string
  stateProvince: string
  postalCode: string
  propertyType: string
  grade?: number
  logoUrl?: string
  registrationNo1?: string
  registrationNo2?: string
  registrationNo3?: string
  cancellationPolicy?: string
  hotelPolicy?: string
  // New fields for channel manager integration
  migrated: boolean // Set to true when migration is done successfully
  channelEnable: boolean // Set to true if user activates channel manager
  lastMigrationDate?: string // ISO 8601 datetime string - last time migration was done
  createdAt?: string
  updatedAt?: string
}

export interface FitlterItem {
  searchText: string
  status: string
  roomType: string
  checkInDate: string
  checkOutDate: string
  roleId?: string
  department?: string
}
export interface TaskFitlterItem {
  userId: string
  status: string
  dueDate: string
  createdDate: string
  roleId?: string
  departmentId?: string
  serviceId?: number
  searchText?: string
}
export interface RoomFilterItem {
  searchText: string
  status: string
  roomType: string
  equipment: Array<{ label: string; value: string }>
  floor: string
}

export interface Form {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  password: string
  roleId: string | number | undefined
  hire_date: string
  department: number
  dateOfBirth: string
  placeOfBirth: string
  gender?: string
  city?: string
  country?: string
  emergencyPhone?: string
  personalEmail?: string
  socialSecurityNumber?: string
  nationalIdNumber?: string
  contractType?: string
  contractEndDate: string
  dataProcessingConsent?: boolean
  consentDate: string
  language:string
}
export const defaultData = (): Form => {
  return {
    firstName: '',
    lastName: '',
    roleId: 0,
    phoneNumber: '',
    email: '',
    password: '',
    department: 0,
    hire_date: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    city: '',
    country: 'CM',
    emergencyPhone: '',
    personalEmail: '',
    socialSecurityNumber: '',
    nationalIdNumber: '',
    contractType: '',
    contractEndDate: '',
    dataProcessingConsent: true,
    consentDate: '',
    language:''
  }
}

// --- TypeScript Interfaces for Payloads ---

export interface AmenityCategoryPayload {
  name: string
  description?: string | null
  service_id: number
  status?: 'active' | 'inactive' | 'archived'
  source_type: 'External' | 'Internal'
  external_system_id?: string | ''
}

export interface UpdateAmenityCategoryPayload {
  name?: string
  description?: string | null
  service_id?: number
  status: 'active' | 'inactive' | 'archived'
  source_type?: 'External' | 'Internal'
  external_system_id?: string | null
}
export const defaultAmenityCategoryPayload = (): AmenityCategoryPayload => {
  return {
    name: '',
    description: '',
    service_id: 0,
    status: 'active',
    source_type: 'Internal',
    external_system_id: '',
  }
}

export interface AmenityProductPayload {
  name: string
  price: number
  description?: string | null
  status?: 'active' | 'inactive' | 'archived'
  amenities_category_id: number
  service_id: number
  pricing_model: 'flat_rate' | 'time_based'
  time_unit?: 'hour' | 'day'
}

export const defaultAmenityProductPayloadPayload = (): AmenityProductPayload => {
  return {
    name: '',
    description: '',
    service_id: 0,
    status: 'active',
    amenities_category_id: 0,
    price: 0,
    pricing_model: 'flat_rate',
  }
}


// Interface pour un article de réservation
export interface AmenityBookingItemPayload {
  amenity_product_id: number
  quantity: number
}

// Interface pour la création d'une réservation
export interface CreateAmenityBookingPayload {
  reservation_id: number
  status: 'pending' | 'completed' | 'cancelled'
  items: AmenityBookingItemPayload[]
}

// Interface pour la mise à jour d'une réservation
export interface UpdateAmenityBookingPayload {
  status?: 'pending' | 'completed' | 'cancelled'
  items?: AmenityBookingItemPayload[]
}


// Interfaces
export interface TableColumn {
    name: string
    label: string
    type?: 'text' | 'date' | 'url' | 'badge' | 'percentage' | 'image' | 'action' | 'imageText' | 'rating' | 'currency' | 'TextRoom'
    sortable?: boolean
    filterable?: boolean
    style?: string
    minWidth?: string
    width?: string
    actions?: Array<{
        name: string
        event: string
        icone: string
        color?: string
    }>
    inputField?: {
        type: string
        placeholder: string
    }
    event?: string | any
    colored?: boolean,
    isTranslatable: boolean
}

export interface PaymentFilterItem {
  paymentId : number
  searchText: string
  status: string,
  serviceId?: number
}


export  interface Column {
  key: string
  label: string
  type?: 'text' | 'email' | 'badge' | 'image' | 'custom' | 'date'
  imageKey?: string // For image type, the key for the image URL
  badgeColors?: Record<string, any> // For badge type, color mapping
  searchable?: boolean
  translatable?: boolean // Whether the column content should be translated
  dateFormat?: string // Format for date columns
}

export interface Action {
  label: string
  handler: (item: any) => void
  icon?: any
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  condition?: (item: any) => boolean // Optional condition to show/hide action
}


export interface CheckInReservationPayload {
  reservationRooms: number[],
  actualCheckInTime: string,
  notes?: string,
  keyCardsIssued?: number,
  depositAmount?: number

}

export interface Template {
  id: string
  name: string
  description: string
  type?: string
  component?: any
  options?: any
}
// Props
export interface AuditLog {
  id: string | number
  action: string
  description: string
  changes?: Record<string, { old: any; new: any }> | null
  timestamp: string
  userId: string | number
  userName?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  sessionId?: string | null
  entityId?: string | number | null
  entityType?: string | null
  meta?: Record<string, any> | null
}