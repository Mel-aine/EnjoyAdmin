import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/reports`
const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface ReportFilters {
  hotelId?: number
  startDate?: string
  endDate?: string
  roomTypeId?: number
  guestId?: number
  userId?: number
  status?: string
  departmentId?: number
  bookingSourceId?: number
  ratePlanId?: number
}

const handleApiError = (error: any): never => {
  console.error('Erreur API:', error)
  throw {
    message: error.response?.data?.message || 'Erreur API',
    error: error.response?.data?.error || error.message,
  }
}

// Obtenir les types de rapports disponibles
export const getAvailableReports = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      `${API_URL}`,
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Générer un rapport spécifique (méthode générique)
export const generateReport = async (
  reportType: string,
  filters: ReportFilters = {}
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/generate`,
      { reportType, filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Méthodes spécifiques pour chaque type de rapport

// Reservation Reports
export const generateArrivalList = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/reservations/arrival-list`,
      { reportType: 'arrivalList', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Correction dans services/reportsApi.ts
export const exportArrivalList = async (
  format: 'csv' | 'pdf' | 'excel' = 'csv',
  filters: ReportFilters = {}
): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post(
      `${API_URL}/exports/arrival-list`,
      { 
        reportType: 'arrivalList', 
        format, 
        filters 
      },
      {
        ...headers,
        responseType: 'blob' // Toujours utiliser blob pour tous les formats
      }
    )

    // Créer le blob à partir de la réponse
    const blob = new Blob([response.data])
    
    // Déterminer le type MIME et l'extension en fonction du format
    let mimeType, fileExtension
    switch (format) {
      case 'csv':
        mimeType = 'text/csv'
        fileExtension = 'csv'
        break
      case 'pdf':
        mimeType = 'application/pdf'
        fileExtension = 'pdf'
        break
      case 'excel':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        fileExtension = 'xlsx'
        break
      default:
        mimeType = 'text/csv'
        fileExtension = 'csv'
    }

    // Créer le blob avec le bon type MIME
    const formattedBlob = new Blob([response.data], { type: mimeType })
    const url = window.URL.createObjectURL(formattedBlob)
    const link = document.createElement('a')
    
    // Générer un nom de fichier avec timestamp
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
    link.setAttribute('download', `arrival_list_${timestamp}.${fileExtension}`)
    
    link.href = url
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    return { 
      success: true, 
      message: `Fichier ${format.toUpperCase()} téléchargé avec succès` 
    }
  } catch (error) {
    console.error('Erreur détaillée lors de l\'export:', error)
    
    // Gestion spécifique des erreurs 400
    if (error.response?.status === 400) {
      // Essayer de lire le message d'erreur du blob
      try {
        const errorData = await error.response.data.text()
        const errorJson = JSON.parse(errorData)
        throw {
          message: errorJson.message || 'Erreur de validation des paramètres',
          error: errorJson.error || 'Bad Request'
        }
      } catch (parseError) {
        throw {
          message: 'Erreur de format de réponse du serveur',
          error: 'Invalid server response format'
        }
      }
    }
    
    handleApiError(error)
  }
}
export const generateDepartureList = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/reservations/departure-list`,
      { reportType: 'departureList', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateConfirmedReservations = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/reservations/confirmed`,
      { reportType: 'confirmedReservations', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateCancelledReservations = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/reservations/cancelled`,
      { reportType: 'cancelledReservations', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateNoShowReservations = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/reservations/no-show`,
      { reportType: 'noShowReservations', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateReservationForecast = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/reservations/forecast`,
      { reportType: 'reservationForecast', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Front Office Reports
export const generateGuestCheckedIn = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/front-office/checked-in`,
      { reportType: 'guestCheckedIn', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateGuestCheckedOut = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/front-office/checked-out`,
      { reportType: 'guestCheckedOut', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateRoomAvailability = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/front-office/room-availability`,
      { reportType: 'roomAvailability', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateRoomStatus = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/front-office/room-status`,
      { reportType: 'roomStatus', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateTaskList = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/front-office/task-list`,
      { reportType: 'taskList', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Back Office Reports
export const generateRevenueReport = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/back-office/revenue`,
      { reportType: 'revenueReport', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateExpenseReport = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/back-office/expenses`,
      { reportType: 'expenseReport', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateCashierReport = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/back-office/cashier`,
      { reportType: 'cashierReport', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Audit Reports
export const generateUserActivityLog = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/audit/user-activity`,
      { reportType: 'userActivityLog', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Statistical Reports
export const generateOccupancyReport = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/occupancy`,
      { reportType: 'occupancyReport', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateADRReport = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/adr`,
      { reportType: 'adrReport', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateRevPARReport = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/revpar`,
      { reportType: 'revparReport', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateMarketSegmentAnalysis = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/market-segment`,
      { reportType: 'marketSegmentAnalysis', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateSourceOfBusinessReport = async (filters: ReportFilters = {}): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/source-of-business`,
      { reportType: 'sourceOfBusinessReport', filters },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Exporter un rapport (CSV, PDF, Excel)
export const exportReport = async (
  reportType: string,
  format: 'csv' | 'pdf' | 'excel' = 'csv',
  filters: ReportFilters = {}
): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post(
      `${API_URL}/export`,
      { reportType, format, filters },
      {
        ...headers,
        responseType: format === 'csv' ? 'blob' : 'json'
      }
    )

    if (format === 'csv') {
      // Gérer le téléchargement du fichier CSV
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${reportType}_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Fichier CSV téléchargé avec succès' }
    }

    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Générer un rapport personnalisé
export const generateCustomReport = async (
  tableName: string,
  selectedFields: string[] = [],
  filters: ReportFilters = {},
  joins: any[] = [],
  groupBy: string[] = [],
  orderBy: any[] = []
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/custom`,
      { tableName, selectedFields, filters, joins, groupBy, orderBy },
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Obtenir les modèles de rapports
export const getReportTemplates = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      `${API_URL}/templates`,
      headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Obtenir les statistiques de rapports
export const getReportStats = async (hotelId?: number): Promise<ApiResponse> => {
  try {
    const params = hotelId ? { hotelId } : {}
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      `${API_URL}/stats`,
      {
        ...headers,
        params
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Vérifier la santé du service de rapports
export const checkReportsHealth = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      `${API_URL}/health`,
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}