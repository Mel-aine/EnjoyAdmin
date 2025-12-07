// services/workOrderReportsApi.ts
import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/reports/work-orders`
const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface WorkOrderFilters {
  hotelId?: number
  startDate?: string
  endDate?: string
  status?: string
  priority?: string
  departmentId?: number
  assignedTo?: number
  createdBy?: number
  roomId?: number
  category?: string
}

export interface WorkOrderReportData {
  title: string
  data: any
  summary?: {
    totalWorkOrders?: number
    statusCounts?: Array<{ status: string; count: number }>
    priorityCounts?: Array<{ priority: string; count: number }>
    departmentCounts?: Array<{ department: string; count: number }>
    assigneeCounts?: Array<{ assignee: string; count: number }>
    totalOverdue?: number
    averageDaysOverdue?: number
    totalCompleted?: number
    averageCompletionTime?: number
    statusSummary?: {
      total: number
      pending: number
      inProgress: number
      completed: number
      overdue: number
    }
    prioritySummary?: {
      high: number
      medium: number
      low: number
    }
  }
  html?: string
}

export interface WorkOrderReportResponse extends ApiResponse<WorkOrderReportData> {
  reportType: string
  generatedAt: string
  filters: WorkOrderFilters
}

export interface AvailableReport {
  id: string
  name: string
  description: string
  category: string
}

const handleApiError = (error: any): never => {
  console.error('Work Order Report API Error:', error)
  throw {
    message: error.response?.data?.message || 'Work Order Report API Error',
    error: error.response?.data?.error || error.message,
  }
}

// Obtenir tous les types de rapports disponibles pour les bons de travail
export const getAvailableWorkOrderReports = async (): Promise<ApiResponse<AvailableReport[]> | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<AvailableReport[]>> = await apiClient.get(
      API_URL,
        getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}

// Fonction générique pour générer un rapport de bon de travail
const generateWorkOrderReportBase = async (
  endpoint: string,
  reportType: string,
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  try {
    const response: AxiosResponse<WorkOrderReportResponse> = await apiClient.post(
      `${API_URL}${endpoint}`,
      { 
        reportType, 
        filters: {
          ...filters,
          format: 'json'
        }
      },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}

// Générer un rapport par statut
export const generateWorkOrdersByStatus = async (
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  return generateWorkOrderReportBase('/by-status', 'workOrdersByStatus', filters)
}

// Générer un rapport par priorité
export const generateWorkOrdersByPriority = async (
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  return generateWorkOrderReportBase('/by-priority', 'workOrdersByPriority', filters)
}

// Générer un rapport par département
export const generateWorkOrdersByDepartment = async (
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  return generateWorkOrderReportBase('/by-department', 'workOrdersByDepartment', filters)
}

// Générer un rapport par assigné
export const generateWorkOrdersByAssignee = async (
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  return generateWorkOrderReportBase('/by-assignee', 'workOrdersByAssignee', filters)
}

// Générer un rapport des bons de travail en retard
export const generateOverdueWorkOrders = async (
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  return generateWorkOrderReportBase('/overdue', 'workOrdersOverdue', filters)
}

// Générer un rapport des bons de travail terminés
export const generateCompletedWorkOrders = async (
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  return generateWorkOrderReportBase('/completed', 'workOrdersCompleted', filters)
}

// Générer un rapport de synthèse des bons de travail
export const generateWorkOrdersSummary = async (
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  return generateWorkOrderReportBase('/summary', 'workOrdersSummary', filters)
}

// Fonction générique pour générer n'importe quel type de rapport
export const generateWorkOrderReport = async (
  reportType: string,
  filters: WorkOrderFilters = {}
): Promise<WorkOrderReportResponse | undefined> => {
  switch (reportType) {
    case 'workOrdersByStatus':
      return generateWorkOrdersByStatus(filters)
    case 'workOrdersByPriority':
      return generateWorkOrdersByPriority(filters)
    case 'workOrdersByDepartment':
      return generateWorkOrdersByDepartment(filters)
    case 'workOrdersByAssignee':
      return generateWorkOrdersByAssignee(filters)
    case 'workOrdersOverdue':
      return generateOverdueWorkOrders(filters)
    case 'workOrdersCompleted':
      return generateCompletedWorkOrders(filters)
    case 'workOrdersSummary':
      return generateWorkOrdersSummary(filters)
    default:
      throw new Error(`Unknown work order report type: ${reportType}`)
  }
}

// Export des rapports de bons de travail en différents formats
export const exportWorkOrderReport = async (
  reportType: string,
  format: 'csv' | 'pdf' | 'excel' = 'pdf',
  filters: WorkOrderFilters = {}
): Promise<Blob | undefined> => {
  try {
    // Mapping des types de rapports vers les endpoints
    const endpointMapping: Record<string, string> = {
      'workOrdersByStatus': '/by-status',
      'workOrdersByPriority': '/by-priority',
      'workOrdersByDepartment': '/by-department',
      'workOrdersByAssignee': '/by-assignee',
      'workOrdersOverdue': '/overdue',
      'workOrdersCompleted': '/completed',
      'workOrdersSummary': '/summary'
    }

    const endpoint = endpointMapping[reportType]
    if (!endpoint) {
      throw new Error(`Unknown report type for export: ${reportType}`)
    }

    const response: AxiosResponse<Blob> = await apiClient.post(
      `${API_URL}${endpoint}`,
      { 
        reportType, 
        filters: {
          ...filters,
          format
        }
      },
      {
        ...getHeaders(),
        responseType: 'blob'
      }
    )

    // Vérification de base que nous avons des données
    if (!response.data) {
      throw new Error('Aucune donnée reçue du serveur pour l\'export')
    }

    console.log('Work Order Export - Headers de réponse:', response.headers)
    console.log('Work Order Export - Taille des données:', response.data.size)
    console.log('Work Order Export - Type de contenu:', response.headers['content-type'])

    // Créer le blob avec le type MIME correct
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || getMimeType(format)
    })

    // Pour PDF, validation optionnelle
    if (format === 'pdf' && !quickPdfValidation(blob)) {
      console.warn('Le fichier PDF généré pourrait être corrompu')
    }

    // Télécharger automatiquement le fichier
    const filename = `work-order-report-${reportType}-${new Date().toISOString().split('T')[0]}.${getFileExtension(format)}`
    downloadFile(blob, filename)

    return blob
  } catch (error) {
    console.error('Erreur lors de l\'export du rapport de bon de travail:', error)
    
    if ((error as any).response?.status === 400) {
      try {
        const errorText = await (error as any).response.data.text()
        try {
          const errorJson = JSON.parse(errorText)
          throw new Error(errorJson.message || 'Erreur de validation des paramètres du rapport')
        } catch {
          throw new Error(errorText || 'Erreur de validation du rapport')
        }
      } catch (parseError) {
        throw new Error('Erreur de format de réponse du serveur pour le rapport')
      }
    }

    throw error
  }
}

// Fonctions utilitaires
const getMimeType = (format: string): string => {
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'csv': 'text/csv',
    'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
  return mimeTypes[format] || 'application/octet-stream'
}

const getFileExtension = (format: 'pdf' | 'csv' | 'excel'): string => {
  const extensions: Record<'pdf' | 'csv' | 'excel', string> = {
    'pdf': 'pdf',
    'csv': 'csv',
    'excel': 'xlsx'
  }
  return extensions[format] || 'bin'
}

const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Validation simple pour les PDF
const quickPdfValidation = (blob: Blob): boolean => {
  // Un PDF valide doit avoir une certaine taille
  if (blob.size < 100) {
    console.warn('Work Order PDF trop petit:', blob.size, 'bytes')
    return false
  }

  // Vérifier le type MIME
  if (!blob.type.includes('pdf')) {
    console.warn('Type MIME inattendu pour Work Order PDF:', blob.type)
  }

  return true
}

// Statistiques spécifiques aux bons de travail
export const getWorkOrderStats = async (
  hotelId?: number
): Promise<ApiResponse | undefined> => {
  try {
    const params = hotelId ? { hotelId } : {}
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.get(
      `${API_URL}/stats`,
      {
        ...getHeaders(),
        params
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}

// Validation des filtres de bons de travail
export const validateWorkOrderFilters = (filters: WorkOrderFilters): void => {
  if (filters.startDate && filters.endDate) {
    const startDate = new Date(filters.startDate)
    const endDate = new Date(filters.endDate)
    
    if (startDate > endDate) {
      throw new Error('La date de début ne peut pas être postérieure à la date de fin')
    }
  }

  if (filters.hotelId && (filters.hotelId <= 0 || !Number.isInteger(filters.hotelId))) {
    throw new Error('L\'ID de l\'hôtel doit être un nombre entier positif')
  }

  if (filters.departmentId && (filters.departmentId <= 0 || !Number.isInteger(filters.departmentId))) {
    throw new Error('L\'ID du département doit être un nombre entier positif')
  }

  if (filters.assignedTo && (filters.assignedTo <= 0 || !Number.isInteger(filters.assignedTo))) {
    throw new Error('L\'ID de l\'utilisateur assigné doit être un nombre entier positif')
  }

  if (filters.createdBy && (filters.createdBy <= 0 || !Number.isInteger(filters.createdBy))) {
    throw new Error('L\'ID du créateur doit être un nombre entier positif')
  }

  if (filters.roomId && (filters.roomId <= 0 || !Number.isInteger(filters.roomId))) {
    throw new Error('L\'ID de la chambre doit être un nombre entier positif')
  }

  const validStatuses = ['pending', 'in_progress', 'on_hold', 'completed', 'cancelled']
  if (filters.status && !validStatuses.includes(filters.status)) {
    throw new Error(`Le statut doit être l'un des suivants: ${validStatuses.join(', ')}`)
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent']
  if (filters.priority && !validPriorities.includes(filters.priority)) {
    throw new Error(`La priorité doit être l'une des suivantes: ${validPriorities.join(', ')}`)
  }
}

// Export des données avec validation
export const exportWorkOrderData = async (
  format: 'csv' | 'pdf' | 'excel' = 'csv',
  reportType: string,
  filters: WorkOrderFilters = {}
): Promise<any> => {
  try {
    // Valider les filtres avant l'export
    validateWorkOrderFilters(filters)

    const response: AxiosResponse = await apiClient.post(
      `${API_URL}/exports/${reportType}`,
      {
        reportType,
        format,
        filters
      },
      {
        ...getHeaders(),
        responseType: 'blob'
      }
    )

    if (!response.data) {
      throw new Error('Aucune donnée reçue du serveur pour l\'export des bons de travail')
    }

    console.log('Work Order Export Data - Headers:', response.headers)
    console.log('Work Order Export Data - Size:', response.data.size)

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || getMimeType(format)
    })

    const filename = `work-orders-${reportType}_${new Date().toISOString().split('T')[0]}.${getFileExtension(format)}`
    downloadFile(blob, filename)

    return {
      success: true,
      message: `Fichier Work Order ${format.toUpperCase()} téléchargé avec succès`,
      filename
    }
  } catch (error) {
    console.error('Erreur lors de l\'export des données de bon de travail:', error)
    throw error
  }
}
