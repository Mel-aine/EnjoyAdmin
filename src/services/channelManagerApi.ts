/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '../composables/serviceStore'

const API_URL = import.meta.env.VITE_API_URL as string
const CHANNEX_API_URL = `${API_URL}/channex`

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }
}

const headers = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}

const getServiceStore = () => {
  return useServiceStore()
}
// --- Types ---
export interface ChannelConnection {
  id: number
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  logo: string
  description: string
  lastSync?: Date
  credentials?: {
    username?: string
    password?: string
    apiKey?: string
    endpoint?: string
  }
  settings?: {
    autoSync?: boolean
    syncFrequency?: string
    rateMarkup?: number
    inventoryBuffer?: number
  }
}

export interface RoomMapping {
  id: number
  pmsRoomTypeId: number
  pmsRoomTypeName: string
  channelRoomTypeId: string
  channelRoomTypeName: string
  channelId: number
  occupancy: number
  bedConfiguration: string
  includesBreakfast: boolean
  isRefundable: boolean
  cancellationPolicy: string
}

// --- Channex Booking Revision Types ---
export interface ChannexBookingRevision {
  type: string
  id: string
  attributes: {
    id: string
    property_id: string
    booking_id: string
    unique_id: string
    system_id: string
    ota_reservation_code: string
    ota_name: string
    status: string
    rooms: {
      amount: string
      checkin_date: string
      checkout_date: string
      rate_plan_id: string
      room_type_id: string
      ota_unique_id: string
      days: Record<string, string>
      occupancy: {
        adults: number
        children: number
        infants: number
      }
    }[]
    services: {
      type: string
      total_price: string
      price_per_unit: string
      price_mode: string
      persons: number
      nights: number
      name: string
    }[]
    guarantee: {
      expiration_date: string
      cvv: string
      cardholder_name: string
      card_type: string
      card_number: string
    }
    customer: {
      zip: string
      surname: string
      phone: string
      name: string
      mail: string
      language: string
      country: string
      city: string
      address: string
      company?: {
        title: string
        number: string
        number_type: string
        type: string
      }
    }
    occupancy: {
      adults: number
      children: number
      infants: number
    }
    arrival_date: string
    departure_date: string
    arrival_hour: string
    amount: string
    currency: string
    notes: string
    inserted_at: string
  }
}

export interface ChannexBookingRevisionsResponse {
  meta: {
    total: number
    page: number
    limit: number
  }
  data: ChannexBookingRevision[]
}

export interface RateMapping {
  id: number
  pmsRatePlanId: number
  pmsRatePlanName: string
  channelRatePlanId: string
  channelRatePlanName: string
  channelId: number
  markup: number
  isActive: boolean
}

export interface SyncLog {
  id: number
  timestamp: Date
  level: 'info' | 'warning' | 'error'
  channel: string
  channelLogo: string
  operation: 'rate_sync' | 'inventory_sync' | 'reservation_sync' | 'connection_test'
  message: string
  duration?: number
  details?: any
  stackTrace?: string
}

export interface SyncSettings {
  globalSettings: {
    syncMode: 'automatic' | 'manual' | 'scheduled'
    defaultSyncFrequency: string
    syncWindowStart: string
    syncWindowEnd: string
    retryAttempts: number
    enableAutoSync: boolean
    enableNotifications: boolean
    enableErrorAlerts: boolean
  }
  channelSettings: {
    [channelId: number]: {
      enabled: boolean
      ratesSyncFrequency: string
      inventorySyncFrequency: string
      reservationsSyncFrequency: string
      bidirectionalRates: boolean
      bidirectionalInventory: boolean
      autoConfirmReservations: boolean
    }
  }
  conflictSettings: {
    rateConflictResolution: string
    inventoryConflictResolution: string
    reservationConflictResolution: string
    overbookingPolicy: string
  }
}

export interface RateInventoryData {
  date: Date
  pmsRate: number
  channelRate: number
  availability: number
  syncStatus: 'synced' | 'pending' | 'error'
}

export interface ConnectionCredentials {
  channelType: string
  credentials: {
    username?: string
    password?: string
    apiKey?: string
    endpoint?: string
    hotelId?: string
    propertyId?: string
  }
  testConnection?: boolean
}

export interface ApiResponse<T = any> {
  message: string
  data?: T
  error?: string
}

// --- Legacy Channex Migration ---

/**
 *  Migrate complete hotel data to Channex
 * @param hotel id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const migrateCompleteHotel = (): Promise<AxiosResponse<any>> => {
  const serviceStore = getServiceStore()
  return axios.post(`${CHANNEX_API_URL}/migrate/${serviceStore.serviceId}`, {}, getHeaders())
}

// --- Channel Connections API ---

/**
 * Get all channel connections
 */
export const getChannelConnections = (): Promise<AxiosResponse<ApiResponse<ChannelConnection[]>>> => {
  return axios.get(`${API_URL}/channel-manager/connections`, getHeaders())
}

/**
 * Get a specific channel connection by ID
 */
export const getChannelConnection = (id: number): Promise<AxiosResponse<ApiResponse<ChannelConnection>>> => {
  return axios.get(`${API_URL}/channel-manager/connections/${id}`, getHeaders())
}

/**
 * Create a new channel connection
 */
export const createChannelConnection = (data: ConnectionCredentials): Promise<AxiosResponse<ApiResponse<ChannelConnection>>> => {
  return axios.post(`${API_URL}/channel-manager/connections`, data, getHeaders())
}

/**
 * Update a channel connection
 */
export const updateChannelConnection = (id: number, data: Partial<ChannelConnection>): Promise<AxiosResponse<ApiResponse<ChannelConnection>>> => {
  return axios.put(`${API_URL}/channel-manager/connections/${id}`, data, getHeaders())
}

/**
 * Delete a channel connection
 */
export const deleteChannelConnection = (id: number): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.delete(`${API_URL}/channel-manager/connections/${id}`, getHeaders())
}

/**
 * Test channel connection
 */
export const testChannelConnection = (data: ConnectionCredentials): Promise<AxiosResponse<ApiResponse<{ success: boolean; message: string }>>> => {
  return axios.post(`${API_URL}/channel-manager/connections/test`, data, getHeaders())
}

/**
 * Sync a specific channel
 */
export const syncChannel = (id: number): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.post(`${API_URL}/channel-manager/connections/${id}/sync`, {}, getHeaders())
}

/**
 * Sync all channels
 */
export const syncAllChannels = (): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.post(`${API_URL}/channel-manager/sync-all`, {}, getHeaders())
}

// --- Room and Rate Mapping API ---

/**
 * Get room mappings for a channel
 */
export const getRoomMappings = (channelId: number): Promise<AxiosResponse<ApiResponse<RoomMapping[]>>> => {
  return axios.get(`${API_URL}/channel-manager/mappings/rooms/${channelId}`, getHeaders())
}

/**
 * Create room mapping
 */
export const createRoomMapping = (data: Omit<RoomMapping, 'id'>): Promise<AxiosResponse<ApiResponse<RoomMapping>>> => {
  return axios.post(`${API_URL}/channel-manager/mappings/rooms`, data, getHeaders())
}

/**
 * Update room mapping
 */
export const updateRoomMapping = (id: number, data: Partial<RoomMapping>): Promise<AxiosResponse<ApiResponse<RoomMapping>>> => {
  return axios.put(`${API_URL}/channel-manager/mappings/rooms/${id}`, data, getHeaders())
}

/**
 * Delete room mapping
 */
export const deleteRoomMapping = (id: number): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.delete(`${API_URL}/channel-manager/mappings/rooms/${id}`, getHeaders())
}

/**
 * Get rate mappings for a channel
 */
export const getRateMappings = (channelId: number): Promise<AxiosResponse<ApiResponse<RateMapping[]>>> => {
  return axios.get(`${API_URL}/channel-manager/mappings/rates/${channelId}`, getHeaders())
}

/**
 * Create rate mapping
 */
export const createRateMapping = (data: Omit<RateMapping, 'id'>): Promise<AxiosResponse<ApiResponse<RateMapping>>> => {
  return axios.post(`${API_URL}/channel-manager/mappings/rates`, data, getHeaders())
}

/**
 * Update rate mapping
 */
export const updateRateMapping = (id: number, data: Partial<RateMapping>): Promise<AxiosResponse<ApiResponse<RateMapping>>> => {
  return axios.put(`${API_URL}/channel-manager/mappings/rates/${id}`, data, getHeaders())
}

/**
 * Delete rate mapping
 */
export const deleteRateMapping = (id: number): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.delete(`${API_URL}/channel-manager/mappings/rates/${id}`, getHeaders())
}

/**
 * Sync room mappings from channel
 */
export const syncRoomMappings = (channelId: number): Promise<AxiosResponse<ApiResponse<RoomMapping[]>>> => {
  return axios.post(`${API_URL}/channel-manager/mappings/rooms/${channelId}/sync`, {}, getHeaders())
}

/**
 * Sync rate mappings from channel
 */
export const syncRateMappings = (channelId: number): Promise<AxiosResponse<ApiResponse<RateMapping[]>>> => {
  return axios.post(`${API_URL}/channel-manager/mappings/rates/${channelId}/sync`, {}, getHeaders())
}

// --- Rates and Inventory API ---

/**
 * Get rates and inventory data
 */
export const getRatesInventory = (params: {
  channelId?: number
  roomTypeId?: number
  startDate?: string
  endDate?: string
}): Promise<AxiosResponse<ApiResponse<RateInventoryData[]>>> => {
  const queryParams = new URLSearchParams()
  if (params.channelId) queryParams.append('channelId', params.channelId.toString())
  if (params.roomTypeId) queryParams.append('roomTypeId', params.roomTypeId.toString())
  if (params.startDate) queryParams.append('startDate', params.startDate)
  if (params.endDate) queryParams.append('endDate', params.endDate)

  return axios.get(`${API_URL}/channel-manager/rates-inventory?${queryParams.toString()}`, getHeaders())
}

/**
 * Update rates for a specific date range
 */
export const updateRates = (data: {
  channelId: number
  roomTypeId: number
  startDate: string
  endDate: string
  rate: number
}): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.put(`${API_URL}/channel-manager/rates`, data, getHeaders())
}

/**
 * Update inventory for a specific date range
 */
export const updateInventory = (data: {
  channelId: number
  roomTypeId: number
  startDate: string
  endDate: string
  availability: number
}): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.put(`${API_URL}/channel-manager/inventory`, data, getHeaders())
}

/**
 * Get sync statistics
 */
export const getSyncStats = (): Promise<AxiosResponse<ApiResponse<{
  totalRooms: number
  availableRooms: number
  averageRate: number
  lastSync: Date
}>>> => {
  return axios.get(`${API_URL}/channel-manager/sync-stats`, getHeaders())
}

// --- Sync Settings API ---

/**
 * Get sync settings
 */
export const getSyncSettings = (): Promise<AxiosResponse<ApiResponse<SyncSettings>>> => {
  return axios.get(`${API_URL}/channel-manager/sync-settings`, getHeaders())
}

/**
 * Update sync settings
 */
export const updateSyncSettings = (data: SyncSettings): Promise<AxiosResponse<ApiResponse<SyncSettings>>> => {
  return axios.put(`${API_URL}/channel-manager/sync-settings`, data, getHeaders())
}

/**
 * Create sync schedule
 */
export const createSyncSchedule = (data: {
  name: string
  frequency: string
  time: string
  channels: string[]
  enabled: boolean
}): Promise<AxiosResponse<ApiResponse<any>>> => {
  return axios.post(`${API_URL}/channel-manager/sync-schedules`, data, getHeaders())
}

/**
 * Update sync schedule
 */
export const updateSyncSchedule = (id: number, data: {
  name: string
  frequency: string
  time: string
  channels: string[]
  enabled: boolean
}): Promise<AxiosResponse<ApiResponse<any>>> => {
  return axios.put(`${API_URL}/channel-manager/sync-schedules/${id}`, data, getHeaders())
}

/**
 * Delete sync schedule
 */
export const deleteSyncSchedule = (id: number): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.delete(`${API_URL}/channel-manager/sync-schedules/${id}`, getHeaders())
}

// --- Logs API ---

/**
 * Get sync logs with filters
 */
export const getSyncLogs = (params: {
  page?: number
  limit?: number
  dateRange?: string
  channel?: string
  logLevel?: string
  operation?: string
  search?: string
}): Promise<AxiosResponse<ApiResponse<{
  data: SyncLog[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}>>> => {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.dateRange) queryParams.append('dateRange', params.dateRange)
  if (params.channel) queryParams.append('channel', params.channel)
  if (params.logLevel) queryParams.append('logLevel', params.logLevel)
  if (params.operation) queryParams.append('operation', params.operation)
  if (params.search) queryParams.append('search', params.search)

  return axios.get(`${API_URL}/channel-manager/logs?${queryParams.toString()}`, getHeaders())
}

/**
 * Get log statistics
 */
export const getLogStats = (): Promise<AxiosResponse<ApiResponse<{
  total: number
  successful: number
  errors: number
  warnings: number
}>>> => {
  return axios.get(`${API_URL}/channel-manager/logs/stats`, getHeaders())
}

/**
 * Export logs
 */
export const exportLogs = (params: {
  dateRange?: string
  channel?: string
  logLevel?: string
  operation?: string
  format?: 'csv' | 'excel'
}): Promise<AxiosResponse<Blob>> => {
  const queryParams = new URLSearchParams()
  if (params.dateRange) queryParams.append('dateRange', params.dateRange)
  if (params.channel) queryParams.append('channel', params.channel)
  if (params.logLevel) queryParams.append('logLevel', params.logLevel)
  if (params.operation) queryParams.append('operation', params.operation)
  if (params.format) queryParams.append('format', params.format)

  return axios.get(`${API_URL}/channel-manager/logs/export?${queryParams.toString()}`, {
    ...getHeaders(),
    responseType: 'blob'
  })
}

/**
 * Retry failed operation
 */
export const retryOperation = (logId: number): Promise<AxiosResponse<ApiResponse<void>>> => {
  return axios.post(`${API_URL}/channel-manager/logs/${logId}/retry`, {}, getHeaders())
}

// --- Available Channels API ---

/**
 * Get list of available channel types for connection
 */
export const getAvailableChannels = (): Promise<AxiosResponse<ApiResponse<{
  id: string
  name: string
  description: string
  logo: string
  features: string[]
  credentialFields: {
    name: string
    label: string
    type: 'text' | 'password' | 'url'
    required: boolean
    placeholder?: string
  }[]
}[]>>> => {
  return axios.get(`${API_URL}/channel-manager/available-channels`, getHeaders())
}

/**
 * Get PMS room types for mapping
 */
export const getPMSRoomTypes = (): Promise<AxiosResponse<ApiResponse<{
  id: number
  name: string
  description: string
  occupancy: number
  bedConfiguration: string
}[]>>> => {
  return axios.get(`${API_URL}/channel-manager/pms-room-types`, getHeaders())
}

/**
 * Get PMS rate plans for mapping
 */
export const getPMSRatePlans = (): Promise<AxiosResponse<ApiResponse<{
  id: number
  name: string
  description: string
  isActive: boolean
}[]>>> => {
  return axios.get(`${API_URL}/channel-manager/pms-rate-plans`, getHeaders())
}

/**
 * Get channel room types for mapping
 */
export const getChannelRoomTypes = (channelId: number): Promise<AxiosResponse<ApiResponse<{
  id: string
  name: string
  description: string
  occupancy: number
  bedConfiguration: string
}[]>>> => {
  return axios.get(`${API_URL}/channel-manager/channels/${channelId}/room-types`, getHeaders())
}

/**
 * Get channel rate plans for mapping
 */
export const getChannelRatePlans = (channelId: number): Promise<AxiosResponse<ApiResponse<{
  id: string
  name: string
  description: string
  isActive: boolean
}[]>>> => {
  return axios.get(`${API_URL}/channel-manager/channels/${channelId}/rate-plans`, getHeaders())
}



/**
 * Get Channex booking revisions feed
 * This endpoint retrieves booking revisions from Channex API
 */
export const getChannexBookingRevisions = (params?: {
  page?: number
  limit?: number
}): Promise<AxiosResponse<ChannexBookingRevisionsResponse>> => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const url = `${CHANNEX_API_URL}/booking-revisions/feed${queryParams.toString() ? '?' + queryParams.toString() : ''}`
  return axios.get(url,)
}

/**
 * Get iframe URL for channel
 */
export const getIframUrl = (page:string): Promise<AxiosResponse<ApiResponse<{
  url: string
}>>> => {
  const serviceStore = getServiceStore()
  return axios.post(`${CHANNEX_API_URL}/iframe/url`,{
    hotelId: serviceStore.serviceId,
    page: page
  }, getHeaders())
}

interface RoomTypeAttributes {
  title: string
}

interface RoomType {
  id: string
  attributes: RoomTypeAttributes
}

interface RoomTypesData {
  data: RoomType[]
  roomTypes?:any
}
/**
 * get roomtype channel
 */
export const getRoomTypes = (propertyId:any):Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.get(`${CHANNEX_API_URL}/properties/${propertyId}/room-types`, getHeaders())
}

/**
 * get rateplan channel
 */
export const getRatesPlans = (propertyId:any):Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.get(`${CHANNEX_API_URL}/properties/${propertyId}/rate-plans`, getHeaders())
}


interface GetRestrictionsParams {
  rate_plan_ids?: string[];
  date_from: string;
  date_to: string;
  restrictions: string;
}
interface GetAvaibilitiesParams {
  date_from: string;
  date_to: string;
}
export const getRestrictions = (
  propertyId: string | number,
  params: GetRestrictionsParams
): Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.post<ApiResponse<RoomTypesData>>(
    `${CHANNEX_API_URL}/properties/${propertyId}/restrictions`,
    params,
    getHeaders()
  )
}
export const getAvailability = (
  propertyId: string | number,
  params: GetAvaibilitiesParams
): Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.get<ApiResponse<RoomTypesData>>(
    `${CHANNEX_API_URL}/properties/${propertyId}/availability`,
    { ...getHeaders(), params }
  )
}
export const getRoomTypesAndRatePlans = (propertyId:any):Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.get(`${CHANNEX_API_URL}/properties/${propertyId}/room-types-with-rate-plans`, getHeaders())
}

export const updateRestrictions = (
  propertyId: string | number,
  data: any
): Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.put<ApiResponse<RoomTypesData>>(
    `${CHANNEX_API_URL}/properties/${propertyId}/restrictions`,
    data,
    getHeaders()
  )
}

export const updateAvaibility = (
  propertyId: string | number,
  data: any
): Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.put<ApiResponse<RoomTypesData>>(
    `${CHANNEX_API_URL}/properties/${propertyId}/availability`,
    data,
    getHeaders()
  )
}

/**
 * Update rates for a property (Channex)
 * Expects payload shape: { values: [{ property_id, rate_plan_id, date_from, date_to, rate }] }
 */
export const updateRatesValues = (
  propertyId: string | number,
  data: any
): Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.put<ApiResponse<RoomTypesData>>(
    `${CHANNEX_API_URL}/properties/${propertyId}/rates`,
    data,
    getHeaders()
  )
}

export const getBookings= (
  propertyId: string | number,
  params: GetAvaibilitiesParams
): Promise<AxiosResponse<ApiResponse<RoomTypesData>>> => {
  return axios.get<ApiResponse<RoomTypesData>>(
    `${CHANNEX_API_URL}/properties/${propertyId}/bookings`,
    { ...getHeaders(), params }
  )
}