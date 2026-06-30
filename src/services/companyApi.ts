/**
 * Company API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * exportCompanies conserve un appel axios direct (responseType: 'blob').
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useServiceStore } from '../composables/serviceStore'

const API_URL = `${import.meta.env.VITE_API_URL as string}/configuration/hotels`

export interface ApiResponse<T = any> {
  message: string
  data?: T
  error?: string
}

export interface Company {
  id: number
  name: string
  companyName?: string
  contactPerson: string
  contactTitle?: string
  country: string
  email: string
  contact: string
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending' | string
  balance: number
  currency: string
  address?: string
  notes?: string
  registrationNumber?: string
  taxId?: string
  shortCode?: string
  openingBalance?: number
  creditLimit?: number
  state?: string
  city?: string
  postalCode?: string
  addToBusinessSource?: boolean
  doNotCountAsCityLedger?: boolean
}

export interface CompanyFilter {
  searchText?: string
  status?: string
  country?: string
  minBalance?: number
  maxBalance?: number
  email?: string
  page?: number
  limit?: number
}

const handleApiError = (error: any): never => {
  console.error('API Error:', error)
  throw {
    message: error.response?.data?.message || 'API Error',
    error: error.response?.data?.error || error.message,
  }
}

// ── Helper pour construire l'URL company_accounts ─────────────────────

const getHotelId = (): number => {
  const store = useServiceStore()
  return store.serviceId ?? 0
}

const companyUrl = (hotelId?: number) => `${API_URL}/${hotelId ?? getHotelId()}/company_accounts`
const cityLedgerUrl = (hotelId?: number) => `${API_URL}/${hotelId ?? getHotelId()}/city_ledger`

// ── CRUD Companies ─────────────────────────────────────────────────────

/** Get all companies — le premier argument est params (rétrocompatible) */
export const getCompanies = async (params: any = {}, hotelId?: number): Promise<Company[] | undefined> => {
  try {
    const result = await offlineAwareApiCall('GET', `${companyUrl(hotelId)}`, {
      resourceType: 'company',
      params,
    })
    return result.data?.data ?? result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Get all companies (with all flag) */
export const getAllCompanies = async (params: any = {}, hotelId?: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `${companyUrl(hotelId)}`, {
      resourceType: 'company',
      params: { ...params, all: true },
    })
    return result.data
  } catch (error) {
    console.error('Error fetching all companies:', error)
    throw error
  }
}

/** Get filtered companies — le premier argument est filter (rétrocompatible) */
export const getFilteredCompanies = async (filter: CompanyFilter, hotelId?: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `${companyUrl(hotelId)}`, {
      resourceType: 'company',
      params: {
        filters: {
          searchText: filter.searchText,
          status: filter.status,
          country: filter.country,
          email: filter.email,
          minBalance: filter.minBalance,
          maxBalance: filter.maxBalance,
        },
        page: filter.page,
        perPage: filter.limit,
      },
    })
    return result.data?.data ?? result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Get company by ID */
export const getCompanyById = async (companyId: number, hotelId?: number): Promise<Company | undefined> => {
  try {
    const result = await offlineAwareApiCall('GET', `${companyUrl(hotelId)}/${companyId}`, {
      resourceType: 'company',
      resourceId: companyId,
    })
    return result.data?.data ?? result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Create new company */
export const createCompany = async (companyData: Partial<Company>, hotelId?: number): Promise<Company | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `${companyUrl(hotelId)}`, {
      data: companyData,
      resourceType: 'company',
      queuePriority: 7,
    })
    return result.data?.data ?? result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Update company */
export const updateCompany = async (companyId: number, companyData: Partial<Company>, hotelId?: number): Promise<Company | undefined> => {
  try {
    const result = await offlineAwareApiCall('PUT', `${companyUrl(hotelId)}/${companyId}`, {
      data: companyData,
      resourceType: 'company',
      resourceId: companyId,
      queuePriority: 7,
    })
    return result.data?.data ?? result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Delete company */
export const deleteCompany = async (companyId: number, hotelId?: number): Promise<ApiResponse | undefined> => {
  try {
    const result = await offlineAwareApiCall('DELETE', `${companyUrl(hotelId)}/${companyId}`, {
      resourceType: 'company',
      resourceId: companyId,
      queuePriority: 7,
    })
    console.log('response', result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Export companies (blob) */
export const exportCompanies = async (hotelId?: number): Promise<Blob | undefined> => {
  try {
    const response: AxiosResponse<Blob> = await apiClient.get(
      `${companyUrl(hotelId)}/export`,
      { responseType: 'blob' }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Audit companies */
export const auditCompanies = async (hotelId?: number): Promise<ApiResponse | undefined> => {
  try {
    const result = await offlineAwareApiCall('GET', `${companyUrl(hotelId)}/audit`, {
      resourceType: 'company',
    })
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

// ── City Ledger ────────────────────────────────────────────────────────

/** Get City Ledger */
export const getCityLedger = async (
  hotelId?: number,
  options: { page?: number; limit?: number; searchText?: string; companyId?: number } = {}
): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `${cityLedgerUrl(hotelId)}`, {
      resourceType: 'company',
      params: {
        page: options.page,
        perPage: options.limit,
        searchText: options.searchText,
        companyId: options.companyId,
      },
    })
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Get City Ledger Details */
export const getCityLedgerDetails = async (params: {
  companyAccountId: number
  hotelId: number
  dateFrom: string
  dateTo: string
  usePostingDate: boolean
  searchText: string
  showVoided: boolean
  page: number
  limit: number
}): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `${cityLedgerUrl(params.hotelId)}`, {
      resourceType: 'folio_transaction',
      params,
    })
    console.log('response', result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** POS transaction payment */
export const postTransactionPayCompanyBulk = async (data: any): Promise<any> => {
  const hotelId = data.hotelId
  try {
    const result = await offlineAwareApiCall('POST', `${companyUrl(hotelId)}/company_folios/payment-with-assignment`, {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    console.log('response', result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Void Folio Transaction */
export const voidFolioPayTransaction = async (id: number, data: { reason: string }, hotelId?: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', `${companyUrl(hotelId)}/company_folios/payments/${id}/void`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error voiding folio transaction:', error)
    throw error
  }
}
