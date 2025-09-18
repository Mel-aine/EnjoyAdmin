import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'
import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL as string}/reports`

const getHeaders  = () => {
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
export interface GuestCheckoutFilters {
  fromDate: string
  toDate: string
  hotelId: number
}

export interface DailyReceipt {
  fromDate:string
  toDate: string
  hotelId: number
  receiptByUserId: number
  currencyId: number
  paymentMethodId: number
}
export interface PickupDropoffFilters {
  startDate: string
  endDate: string
  type?: string
  hotelId: number
}
export interface DailyRevenueParams {
  hotelId: number | string;
  asOnDate: string; // Format: YYYY-MM-DD
  revenueBy?: string; // Types de revenus séparés par virgules
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
  company?: string
  travelAgent?: string
  businessSource?: string
  market?: string
  minAmount?: number
  maxAmount?: number
  user?: string
  rateFrom?: number
  rateTo?: number
  reservationType?: string
  taxInclusive?: boolean
  showAmount?: string
}

const handleApiError = (error: any): never => {
  console.error('Erreur API:', error)
  throw {
    message: error.response?.data?.message || 'Erreur API',
    error: error.response?.data?.error || error.message,
  }
}

// Obtenir les types de rapports disponibles
export const getAvailableReports = async (): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.get(
      `${API_URL}`,
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}

// Générer un rapport spécifique (méthode générique)
export const generateReport = async (
  reportType: string,
  filters: ReportFilters = {}
): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/generate`,
      { reportType, filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Méthodes spécifiques pour chaque type de rapport

// Arrival Reports
export const generateArrivalList = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/arrival-list`,
      { reportType: 'arrivalList', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Departure Reports
export const generateDepatureList = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/departure-list`,
      { reportType: 'departureList', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// cancelled Reports
export const generateCancelledList = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/cancelled`,
      { reportType: 'cancelledReservations', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// void Reports
export const generateVoidList = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/void`,
      { reportType: 'voidReservations', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateDepartureList = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/departure-list`,
      { reportType: 'departureList', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateConfirmedReservations = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/confirmed`,
      { reportType: 'confirmedReservations', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateCancelledReservations = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/cancelled`,
      { reportType: 'cancelledReservations', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateNoShowReservations = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/no-show`,
      { reportType: 'noShowReservations', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateReservationForecast = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservations/forecast`,
      { reportType: 'reservationForecast', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Front Office Reports
export const generateGuestCheckedIn = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/front-office/checked-in`,
      { reportType: 'guestCheckedIn', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateGuestCheckedOut = async (filters: GuestCheckoutFilters): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/guest-checkout`,
      filters,
      getHeaders() 
    )
    
    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}
export const generateDailyReceiptSummary = async (filters: DailyReceipt): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/daily-receipt-detail`,
      filters,
      getHeaders() 
    )
    
    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}
export const generateDailyReceiptDetail = async (filters: DailyReceipt): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/daily-receipt-detail`,
      filters,
      getHeaders() 
    )
    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}
export const generatePickupDropoff = async (filters: PickupDropoffFilters): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/pickup-dropoff`,
      filters,
      getHeaders() 
    )
    
    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}
export const generateRoomAvailability = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/front-office/room-availability`,
      { reportType: 'roomAvailability', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateRoomStatus = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/front-office/room-status`,
      { reportType: 'roomStatus', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateTaskList = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/front-office/task-list`,
      { reportType: 'taskList', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Back Office Reports
export const generateRevenueReport = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/back-office/revenue`,
      { reportType: 'revenueReport', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateExpenseReport = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/back-office/expenses`,
      { reportType: 'expenseReport', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateCashierReport = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/back-office/cashier`,
      { reportType: 'cashierReport', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Audit Reports
export const generateUserActivityLog = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/audit/user-activity`,
      { reportType: 'userActivityLog', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Statistical Reports
export const generateOccupancyReport = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/occupancy`,
      { reportType: 'occupancyReport', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}


///***
// 
// getVoidPaymentReport
//  */

export const getVoidPaymentReport = async (data: any) => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/void-payment`,
      data,
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/***
 * 
 * void-charge
 * 
 */

export const getVoidChargeReport = async (data: any) => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/void-charge`,
      data,
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/***
 * void-transaction
 */
export const getVoidTransactionReport = async (data: any) => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/void-transaction`,
      data,
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
/**
 * guest-list
 */
export const getGuestListReport = async (data: any) => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/guest-list`,
      data,
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/**
 * folio-list
 */
export const getFolioListReport = async (data: any) => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/folio-list`,
      data,
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/***
 *  audit
 */
export const getAuditReport = async (data: any) => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/audit`,
      data,
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/***
 * 
 */
export const generateADRReport = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/adr`,
      { reportType: 'adrReport', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateRevPARReport = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/revpar`,
      { reportType: 'revparReport', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateMarketSegmentAnalysis = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/market-segment`,
      { reportType: 'marketSegmentAnalysis', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const generateSourceOfBusinessReport = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/statistics/source-of-business`,
      { reportType: 'sourceOfBusinessReport', filters },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
// Export
export const exportData = async (
  format: 'csv' | 'pdf' | 'excel' = 'csv',
  reportTypes: string,
  URL_TYPE: string,
  filters: ReportFilters = {},
): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post(
      `${API_URL}/exports/${URL_TYPE}`,
      {
        reportType: reportTypes,
        format,
        filters
      },
      {
        ...getHeaders(),
        responseType: 'blob'
      }
    )

    // Vérification de base que nous avons des données
    if (!response.data) {
      throw new Error('Aucune donnée reçue du serveur');
    }

    // Pour PDF, ne pas essayer de valider le blob immédiatement
    // Créer le blob avec le type MIME correct
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || getMimeType(format)
    });

    // Télécharger le fichier sans validation préalable pour PDF
    const filename = `${reportTypes}_${new Date().toISOString().split('T')[0]}.${getFileExtension(format)}`;
    downloadFile(blob, filename);

    return {
      success: true,
      message: `Fichier ${format.toUpperCase()} téléchargé avec succès`
    };
  } catch (error) {
    console.error('Erreur détaillée lors de l\'export:', error);

    // Gestion des erreurs
    if ((error as any).response?.status === 400) {
      try {
        // Essayer de lire le message d'erreur du backend
        const errorText = await (error as any).response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Erreur de validation des paramètres');
        } catch {
          throw new Error(errorText || 'Erreur de validation');
        }
      } catch (parseError) {
        throw new Error('Erreur de format de réponse du serveur');
      }
    }

    throw error;
  }
};

// Fonctions utilitaires
const getMimeType = (format: string): string => {
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'csv': 'text/csv',
    'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  return mimeTypes[format] || 'application/octet-stream';
};

const getFileExtension = (format: 'pdf' | 'csv' | 'excel'): string => {
  const extensions: Record<'pdf' | 'csv' | 'excel', string> = {
    'pdf': 'pdf',
    'csv': 'csv',
    'excel': 'xlsx'
  };
  return extensions[format] || 'bin';
};

// Fonctions utilitaires
const getFileInfo = (format: string): { mimeType: string; fileExtension: string } => {
  switch (format) {
    case 'csv':
      return {
        mimeType: 'text/csv; charset=utf-8',
        fileExtension: 'csv'
      };
    case 'pdf':
      return {
        mimeType: 'application/pdf',
        fileExtension: 'pdf'
      };
    case 'excel':
      return {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileExtension: 'xlsx'
      };
    default:
      return {
        mimeType: 'text/csv; charset=utf-8',
        fileExtension: 'csv'
      };
  }
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Validation spécifique pour les PDF
const validatePdfBlob = async (blob: Blob): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Vérifier la taille minimale d'un PDF (au moins 100 bytes)
    if (blob.size < 100) {
      reject(new Error('Le fichier PDF est trop petit et probablement corrompu'));
      return;

    }

    // Lire les premiers bytes pour vérifier le header PDF
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer.slice(0, 5));

      // Vérifier le header PDF (%PDF-)
      const header = Array.from(uint8Array).map(byte =>
        String.fromCharCode(byte)).join('');

      if (!header.startsWith('%PDF-')) {
        reject(new Error('Le fichier ne semble pas être un PDF valide'));
        return;
      }

      resolve();
    };

    reader.onerror = () => {
      reject(new Error('Impossible de lire le fichier PDF'));
    };

    reader.readAsArrayBuffer(blob.slice(0, 1024)); // Lire seulement les premiers 1KB
  });
};

// Alternative: Vérification plus simple
const quickPdfValidation = (blob: Blob): boolean => {
  // Un PDF valide doit avoir une certaine taille
  if (blob.size < 100) return false;

  // Vérifier le type MIME
  if (!blob.type.includes('pdf')) {
    console.warn('Type MIME inattendu pour PDF:', blob.type);
  }

  return true;
};


// Générer un rapport personnalisé
export const generateCustomReport = async (
  tableName: string,
  selectedFields: string[] = [],
  filters: ReportFilters = {},
  joins: any[] = [],
  groupBy: string[] = [],
  orderBy: any[] = []
): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/custom`,
      { tableName, selectedFields, filters, joins, groupBy, orderBy },
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Obtenir les modèles de rapports
export const getReportTemplates = async (): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.get(
      `${API_URL}/templates`,
      getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Obtenir les statistiques de rapports
export const getReportStats = async (hotelId?: number): Promise<ApiResponse | undefined> => {
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
  }
}

// Vérifier la santé du service de rapports
export const checkReportsHealth = async (): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.get(
      `${API_URL}/health`,
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// daily-revenue-report
export const getDailyRevenuePDF = async (params: DailyRevenueParams): Promise<Blob> => {
  try {
    const queryParams = new URLSearchParams()
    
    // Construire les paramètres de requête
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    const url = `${API_URL}/statistics/daily-revenue-pdf?${queryParams.toString()}`
    
    // Configuration axios pour recevoir une réponse blob
    const config = {
      ...getHeaders(),
      responseType: 'blob' as const,
    }

    const response: AxiosResponse<Blob> = await axios.get(url, config)
    
    // Valider que nous avons reçu un blob PDF
    if (response.data.type && response.data.type !== 'application/pdf') {
      throw new Error('Invalid response type: Expected PDF blob')
    }

    return response.data
  } catch (error) {
    console.error('Error fetching daily revenue PDF:', error)
    throw error
  }
}

// Fonction pour générer l'URL du PDF des revenus quotidiens
export const getDailyRevenuePDFUrl = async (params: DailyRevenueParams): Promise<string> => {
  try {
    const blob = await getDailyRevenuePDF(params)
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error generating daily revenue PDF URL:', error)
    throw error
  }
}

// Fonction pour télécharger directement le PDF des revenus quotidiens
export const downloadDailyRevenuePDF = async (params: DailyRevenueParams, filename?: string): Promise<void> => {
  try {
    const blob = await getDailyRevenuePDF(params)
    const url = URL.createObjectURL(blob)
    
    // Créer un élément de téléchargement temporaire
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `daily-revenue-${params.asOnDate}.pdf`
    
    // Déclencher le téléchargement
    document.body.appendChild(link)
    link.click()
    
    // Nettoyer
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading daily revenue PDF:', error)
    throw error
  }
}

// Fonction de validation des paramètres
export const validateDailyRevenueParams = (params: DailyRevenueParams): void => {
  if (!params.hotelId) {
    throw new Error('Hotel ID is required')
  }
  
  if (!params.asOnDate) {
    throw new Error('As On Date is required')
  }
  
  // Valider le format de la date (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(params.asOnDate)) {
    throw new Error('Date must be in YYYY-MM-DD format')
  }
  
  // Valider que la date est valide
  const date = new Date(params.asOnDate)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided')
  }
}