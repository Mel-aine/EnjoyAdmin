import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '../composables/serviceStore'
import axios from 'axios'
const API_URL = `${import.meta.env.VITE_API_URL as string}/configuration`

const authStore = useAuthStore()
const serviceStore = useServiceStore();
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

export interface ApiResponse<T = any> {
  message: string
  data?: T
  error?: string
}

export interface Company {
  id: number
  name: string
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
}

const handleApiError = (error: any): never => {
  console.error('API Error:', error)
  throw {
    message: error.response?.data?.message || 'API Error',
    error: error.response?.data?.error || error.message,
  }
}

// Get all companies
export const getCompanies = async (): Promise<Company[] | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<Company[]>> = await apiClient.get(
      `/configuration/company_accounts/hotel/${serviceStore.serviceId}`,
      headers
    )
    return response.data.data
  } catch (error) {
    handleApiError(error)
  }
}

// Get filtered companies
export const getFilteredCompanies = async (filter: CompanyFilter): Promise<Company[] | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<Company[]>> = await apiClient.post(
      '/configuration/company_accounts/filter',
      filter,
      headers
    )
    return response.data.data
  } catch (error) {
    handleApiError(error)
  }
}

// Get company by ID
export const getCompanyById = async (companyId: number): Promise<Company | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<Company>> = await apiClient.get(
      `/configuration/company_accounts/${companyId}`,
      headers
    )
    return response.data.data
  } catch (error) {
    handleApiError(error)
  }
}

// Create new company
export const createCompany = async (companyData: Partial<Company>): Promise<Company | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<Company>> = await apiClient.post(
      '/configuration/company_accounts',
      companyData,
      headers
    )
    return response.data.data
  } catch (error) {
    handleApiError(error)
  }
}

// Update company
export const updateCompany = async (companyId: number, companyData: Partial<Company>): Promise<Company | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<Company>> = await apiClient.put(
      `/configuration/company_accounts/${companyId}`,
      companyData,
      headers
    )
    return response.data.data
  } catch (error) {
    handleApiError(error)
  }
}

// Delete company
export const deleteCompany = async (companyId: number): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.delete(
      `/configuration/company_accounts/${companyId}`,
      headers
    )
    console.log('response', response)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Export companies
export const exportCompanies = async (): Promise<Blob | undefined> => {
  try {
    const response: AxiosResponse<Blob> = await apiClient.get(
      '/configuration/company_accounts/export',
      {
        ...headers,
        responseType: 'blob',
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Audit companies
export const auditCompanies = async (): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      '/configuration/company_accounts/audit',
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}


/** get getCityLedger
 * 
 */

export const getCityLedger = async (hotelId: number): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      `/configuration/company_accounts/city_ledger/${hotelId}`,
      headers
    )
    console.log('response', response)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/**
 * filter city lefer transaction 
 */

export const getCityLedgerDetails = async (params: {
  companyAccountId: number,
  hotelId: number,
  dateFrom: string,
  dateTo: string,
  usePostingDate: boolean, // Default to posting date
  searchText: string,
  showVoided: boolean, // Default to hide voided transactions
  page: number,
  limit: number
}): Promise<any> => {
  try {
    const response: AxiosResponse<AxiosResponse> = await axios.get(
      `${API_URL}/city_ledger`,
      {
        params,
        ...headers
      }
    )
    console.log('response', response)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/**
 * pos transaction payment 
 */
export const postTransactionPayCompanyBulk = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse<AxiosResponse> = await axios.post(
      `${API_URL}/company_folios/payment-with-assignment`, data, headers
    )
    console.log('response', response)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}