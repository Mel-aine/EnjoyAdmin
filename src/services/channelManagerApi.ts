/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '../composables/serviceStore'

const API_URL = import.meta.env.VITE_API_URL as string
const CHANNEX_API_URL = `${API_URL}/channex`
const authStore = useAuthStore()

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${authStore.token}`,
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

const serviceStore = useServiceStore();
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
 * Get iframe URL for channel
 */
export const getIframUrl = (page:string): Promise<AxiosResponse<ApiResponse<{
  url: string
}>>> => {
  return axios.post(`${CHANNEX_API_URL}/iframe/url`,{
    hotelId: serviceStore.serviceId,
    page: page
  }, headers)
}

      
