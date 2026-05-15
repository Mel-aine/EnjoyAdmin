import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'


const axios = apiClient
const API_URL = `${import.meta.env.VITE_API_URL as string}/market_place`
const HOTEL_API_URL = `${import.meta.env.VITE_API_URL as string}/hotels`

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Module {
  id: number
  name: string
  description?: string
  category?: string
  version?: string
  badge?: string
  iconUrl?: string
  previewImage?: string
  isOfficial?: boolean
  isInstalled?: boolean
  featured?: boolean
  priceMonthly?: number | null
  addOns?: AddOn[]
}

export interface AddOn {
  id: number
  moduleId: number
  name: string
  min: number
  max: number
  priceMonth: number
  priceYear: number
}

export interface InvoiceSubscriptionItemPayload {
  module_id: number
  billing_cycle: 'monthly' | 'yearly'
  price: number
  limit_count: number | null
  add_on_id?: number | null
}

export interface InvoicesSubscriptionsPayload {
  periodStart: string
  periodEnd: string
  currency: string
  subscriptions: InvoiceSubscriptionItemPayload[]
}



/**
 * Build a default payload for a module installation.
 * periodStart = today, periodEnd = today + 1 month (monthly) or + 1 year (yearly)
 */
export const buildInstallPayload = (
  mod: {
    id: number
    priceMonthly?: number | null
    addOns?: AddOn[]
  },
  options: {
    billingCycle?: 'monthly' | 'yearly'
    addOnId?: number | null
    limitCount?: number | null
    currency?: string
  } = {},
): InvoicesSubscriptionsPayload => {
  const defaultAddOn = mod.addOns?.[0] ?? null
  const resolvedAddOnId = options.addOnId ?? defaultAddOn?.id ?? null
  const selectedAddOn = resolvedAddOnId
    ? mod.addOns?.find((a) => a.id === resolvedAddOnId) ?? null
    : null
  const resolvedLimitCount = options.limitCount ?? selectedAddOn?.min ?? null
  const { billingCycle = 'monthly', currency = 'XAF' } = options

  const now = new Date()
  const periodStart = now.toISOString().split('T')[0]
  const periodEnd =
    billingCycle === 'yearly'
      ? new Date(new Date(now).setFullYear(now.getFullYear() + 1)).toISOString().split('T')[0]
      : new Date(new Date(now).setMonth(now.getMonth() + 1)).toISOString().split('T')[0]

  // Resolve price: use selected add-on price or module base price
  let price = 0
  if (selectedAddOn) {
    price = selectedAddOn
      ? billingCycle === 'yearly'
        ? selectedAddOn.priceYear
        : selectedAddOn.priceMonth
      : 0
  } else {
    price = Number(mod.priceMonthly ?? 0)
  }

  return {
    periodStart,
    periodEnd,
    currency,
    subscriptions: [
      {
        module_id: mod.id,
        billing_cycle: billingCycle,
        price,
        limit_count: resolvedLimitCount,
        add_on_id: resolvedAddOnId,
      },
    ],
  }
}



/**
 * Get all marketplace modules
 */
export const getModules = (params: any = {}): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}`, { ...getHeaders(), params })
}

/**
 * Get module by ID
 */
export const getModuleById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}`, getHeaders())
}

/**
 * Enable (install) a module — creates an invoice + subscription
 */
export const installModule = (
  hotelId: number,
  moduleId: number,
  payload: InvoicesSubscriptionsPayload,
): Promise<AxiosResponse<any>> => {
  return axios.post(
    `${API_URL}/${hotelId}/invoices-subscriptions`,
    payload,
    getHeaders(),
  )
}



export const uninstallModule = (id: number, payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/subscriptions`, payload, getHeaders())
}



/**
 * Get hotel by ID (used to read whatsappEnabled and other settings)
 */
export const getHotelById = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${HOTEL_API_URL}/${hotelId}`, getHeaders())
}

/**
 * Update hotel information (used to toggle whatsappEnabled, etc.)
 */

export const updateHotelInformation = (hotelId:number,payload:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${HOTEL_API_URL}/${hotelId}/information`, payload, getHeaders())
}
