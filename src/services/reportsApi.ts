import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'
const axios = apiClient

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
  date?: string; // Format: YYYY-MM-DD
  revenueBy?: string; // Types de revenus séparés par virgules
  asOnDate?: string; // Format: YYYY-MM-DD
}

// Interface pour les paramètres d'export Word du rapport d'état des chambres
export interface RoomStatusWordExportParams {
  date: string  // Format: YYYY-MM-DD
  hotelId: number
}


export interface dailyReportOration {
  hotelId: number
  asOnDate: string
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
  taxInclusive?: boolean // ← AJOUTEZ CETTE LIGNE
  showAmount?: string
  selectedColumns?: string[] // ← AJOUTEZ AUSSI CELUI-CI SI NÉCESSAIRE
}

export interface DailyRevenueReportFilters {
  fromDate: string
  toDate: string
  hotelId: number
  dateType: 'booking' | 'stay' | 'departure'
  roomId?: number
  businessSourceId?: number
  paymentMethodIds?: number[] // CORRIGÉ: pluriel avec array
  taxIds?: number[]
  extraChargeIds?: number[]
  showUnassignRooms?: boolean
  showUnpostedInclusion?: boolean
  discardUnconfirmedBookings?: boolean
  showMobileNoField?: boolean
  showEmailField?: boolean
  reportTemplate?: string
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
    console.log('filters@@@', filters)
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

export const generateNoShowList = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    console.log('filters@@@', filters)
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
export const generateArrivalLis = async (filters: ReportFilters = {}): Promise<ApiResponse | undefined | undefined> => {
  try {
    console.log('filters@@@', filters)
    const response: AxiosResponse<ApiResponse | undefined> = await apiClient.post(
      `${API_URL}/reservation/arrivals`,
      filters,
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
      `${API_URL}/statistics/daily-receipt-summary`,
      filters,
      getHeaders()
    )

    return response.data
  } catch (error) {
    handleApiError(error)
    return undefined
  }
}
export const generateDailyReceiptRefund = async (filters: DailyReceipt): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/daily-receipt-refund-detail`,
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
/**
 * Export data and return blob URL
 */
export const exportData = async (
  format: 'csv' | 'pdf' | 'excel' = 'csv',
  reportTypes: string,
  URL_TYPE: string,
  filters: ReportFilters = {},
): Promise<{ fileUrl: string; filename: string }> => {
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

    // Créer le blob avec le type MIME correct
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || getMimeType(format)
    });

    // Créer une URL temporaire pour le blob
    const fileUrl = URL.createObjectURL(blob);

    // Générer le nom de fichier
    const filename = `${reportTypes}_${new Date().toISOString().split('T')[0]}.${getFileExtension(format)}`;

    return {
      fileUrl,       
      filename    // Nom du fichier
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
export const generateDailyRevenueReport = async (filters: DailyRevenueReportFilters): Promise<ApiResponse | undefined> => {
  try {
    console.log('filters@@@', filters)
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${API_URL}/statistics/daily-receipt-revenue`,
      filters,
      getHeaders()
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

    const url = `${API_URL}/statistics/daily-y-pdf?${queryParams.toString()}`

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
    link.download = filename || `daily-revenue-${params.date}.pdf`

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

/**
 * Exporte le rapport d'état des chambres au format Word
 * @param params - Paramètres du rapport (date et ID de l'hôtel)
 * @returns Promise avec le Blob du document Word
 */
  export const exportRoomStatusToWord = async (params: RoomStatusWordExportParams): Promise<Blob> => {
    const { date, hotelId } = params;

    // Validation des paramètres
    if (!date) {
      throw new Error('La date est requise pour l\'export du rapport');
    }

    if (!hotelId) {
      throw new Error('L\'ID de l\'hôtel est requis pour l\'export du rapport');
    }

    try {
      const response = await axios.post<Blob>(
        `${API_URL}/front-office/rooms-status`,
        { date, hotelId },
        {
          ...getHeaders(),
          responseType: 'blob',
        }
      );

      if (!response.data) {
        throw new Error('Aucune donnée reçue du serveur');
      }

      // Vérification du type de contenu
      const contentType = response.headers['content-type'] || '';
      const isWordDocument = contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document');

      if (!isWordDocument) {
        // Tentative de lecture du message d'erreur
        const errorText = await new Response(response.data).text();

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Réponse inattendue du serveur');
        } catch {
          throw new Error('Le serveur a renvoyé une réponse inattendue');
        }
      }
      return response.data;
    } catch (error) {

      // Propagation des erreurs existantes
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Une erreur inattendue est survenue lors de l\'export du rapport');
    }
};

/**
 * Télécharge le rapport d'état des chambres au format Word
 * @param params - Paramètres du rapport
 * @param filename - Nom du fichier (optionnel, par défaut: 'etat-chambres-{date}.docx')
 */
  export const downloadRoomStatusWordDocument = async (
    params: RoomStatusWordExportParams,
    filename?: string
  ): Promise<void> => {
    try {
      const blob = await exportRoomStatusToWord(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename || `etat-chambres-${params.date}.docx`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Libération de la mémoire
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement du document Word:', error);
      throw error;
    }
};




export const generateReceiptPdf = async (transactionId: string): Promise<Blob> => {
  try {

    const url = `${API_URL}/receipt/${transactionId}`

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
export const generateReceiptPdfUrl = async (transactionId: string): Promise<string> => {
  try {
    const blob = await generateReceiptPdf(transactionId)
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error generating daily revenue PDF URL:', error)
    throw error
  }
}
export const generateInvoicePdf = async (transactionId: string): Promise<Blob> => {
  try {

    const url = `${API_URL}/invoice/${transactionId}`

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
// Fonction pour générer l'URL du PDF des factures
export const generateInvoicePdfUrl = async (transactionId: string): Promise<string> => {
  try {
    const blob = await generateInvoicePdf(transactionId)
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error generating invoice PDF URL:', error)
    throw error
  }
}
export const generatePosReceiptPdf = async (transactionId: string): Promise<Blob> => {
  try {

    const url = `${API_URL}/pos-receipt/${transactionId}`

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
    console.error('Error fetching generatePosReceiptPdf :', error)
    throw error
  }
}
export const generateIncidentalInvoice = async (transactionIds: number[]): Promise<Blob> => {
  try {
    const url = `${API_URL}/incidental-invoice`

    // Utilisation de POST avec les données dans le body
    const response: AxiosResponse<Blob> = await axios.post(
      url,
      { transactionIds }, // ← Données dans le body
      {
        ...getHeaders(),
        responseType: 'blob' as const,
      }
    )

    // Valider que nous avons reçu un blob PDF
    if (response.data.type && response.data.type !== 'application/pdf') {
      throw new Error('Invalid response type: Expected PDF blob')
    }

    return response.data
  } catch (error) {
    console.error('Error fetching generateIncidentalInvoice :', error)
    throw error
  }
}
// Fonction pour générer l'URL du PDF des factures
export const generatePosReceiptPdfUrl = async (transactionId: string): Promise<string> => {
  try {
    const blob = await generatePosReceiptPdf(transactionId)
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error generating pos receipt PDF URL:', error)
    throw error
  }
}

/**
 * Company Receipt (PDF)
 * Endpoint: GET /api/reports/company-receipt/:transactionId
 * Opens the receipt PDF in a new tab (inline).
 */
export const printCompanyReceipt = async (transactionId: string): Promise<void> => {
  try {
    const url = `${API_URL}/company-receipt/${transactionId}`
    const response = await axios.get<Blob>(url, {
      ...getHeaders(),
      responseType: 'blob',
      validateStatus: (status) => status >= 200 && status < 500,
    })

    if (response.status >= 400) {
      try {
        const text = await response.data.text()
        const err = JSON.parse(text)
        throw new Error(err?.message || 'Failed to print company receipt')
      } catch {
        throw new Error('Failed to print company receipt')
      }
    }

    const blobUrl = URL.createObjectURL(response.data)
    window.open(blobUrl)
  } catch (error) {
    console.error('Error printing company receipt:', error)
    throw error
  }
}

/**
 * Company Voucher (PDF)
 * Endpoint: GET /api/reports/company-voucher/:companyId
 * Query params: fromDate, toDate (YYYY-MM-DD)
 * Opens the voucher PDF in a new tab (inline).
 */
export const printCompanyVoucher = async (
  companyId: number | string,
  fromDate: string,
  toDate: string,
): Promise<void> => {
  try {
    const url = `${API_URL}/company-voucher/${companyId}`
    const response = await axios.get<Blob>(url, {
      ...getHeaders(),
      responseType: 'blob',
      params: { fromDate, toDate },
      validateStatus: (status) => status >= 200 && status < 500,
    })

    if (response.status >= 400) {
      try {
        const text = await response.data.text()
        const err = JSON.parse(text)
        throw new Error(err?.message || 'Failed to print company voucher')
      } catch {
        throw new Error('Failed to print company voucher')
      }
    }

    const blobUrl = URL.createObjectURL(response.data)
    window.open(blobUrl)
  } catch (error) {
    console.error('Error printing company voucher:', error)
    throw error
  }
}

// URL-generating helpers for PdfExporterNode usage
export const generateCompanyReceiptPdfUrl = async (transactionId: string): Promise<string> => {
  try {
    const url = `${API_URL}/company-receipt/${transactionId}`
    const response = await axios.get<Blob>(url, {
      ...getHeaders(),
      responseType: 'blob',
      validateStatus: (status) => status >= 200 && status < 500,
    })

    if (response.status >= 400) {
      try {
        const text = await response.data.text()
        const err = JSON.parse(text)
        throw new Error(err?.message || 'Failed to generate company receipt')
      } catch {
        throw new Error('Failed to generate company receipt')
      }
    }

    return URL.createObjectURL(response.data)
  } catch (error) {
    console.error('generateCompanyReceiptPdfUrl error:', error)
    throw error
  }
}

export const generateCompanyVoucherPdfUrl = async (
  companyId: number | string,
  fromDate: string,
  toDate: string,
): Promise<string> => {
  try {
    const url = `${API_URL}/company-voucher/${companyId}`
    const response = await axios.get<Blob>(url, {
      ...getHeaders(),
      responseType: 'blob',
      params: { fromDate, toDate },
      validateStatus: (status) => status >= 200 && status < 500,
    })

    if (response.status >= 400) {
      try {
        const text = await response.data.text()
        const err = JSON.parse(text)
        throw new Error(err?.message || 'Failed to generate company voucher')
      } catch {
        throw new Error('Failed to generate company voucher')
      }
    }

    return URL.createObjectURL(response.data)
  } catch (error) {
    console.error('generateCompanyVoucherPdfUrl error:', error)
    throw error
  }
}
//daily-operation-report
export const generateOperationReport = async (params: dailyReportOration): Promise<string> => {
  try {
    const response = await apiClient.post(
      `${API_URL}/statistics/daily-operations-report-pdf`,
      params,
      {
        ...getHeaders(),
        responseType: 'blob'
      }
    )

    // Créer un objet URL à partir du blob
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    return url

  } catch (error) {
    handleApiError(error)
    throw error // Important : propager l'erreur
  }
}
export const generateDailyReceiptSummaryPdf = async (params: DailyReceipt): Promise<string> => {
  try {
    const response = await apiClient.post(
      `${API_URL}/statistics/daily-receipt-summary-pdf`,
      params,
      {
        ...getHeaders(),
        responseType: 'blob'
      }
    )

    // Créer un objet URL à partir du blob
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    return url

  } catch (error) {
    handleApiError(error)
    throw error // Important : propager l'erreur
  }
}
export const generateDailyReceiptRefundPdf = async (params: DailyReceipt): Promise<string> => {
  try {
    const response = await apiClient.post(
      `${API_URL}/statistics/daily-receipt-refund-detail-pdf`,
      params,
      {
        ...getHeaders(),
        responseType: 'blob'
      }
    )

    // Créer un objet URL à partir du blob
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    return url

  } catch (error) {
    handleApiError(error)
    throw error // Important : propager l'erreur
  }
}
export const generateDailyReceiptPdf = async (params: DailyReceipt): Promise<string> => {
  try {
    const response = await apiClient.post(
      `${API_URL}/statistics/daily-receipt-detail-pdf`,
      params,
      {
        ...getHeaders(),
        responseType: 'blob'
      }
    )

    // Créer un objet URL à partir du blob
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    return url

  } catch (error) {
    handleApiError(error)
    throw error // Important : propager l'erreur
  }
}
export const generateDailyRevenuPdf = async (params: DailyRevenueReportFilters): Promise<string> => {
  try {
    const response = await apiClient.post(
      `${API_URL}/statistics/daily-receipt-revenue-pdf`,
      params,
      {
        ...getHeaders(),
        responseType: 'blob'
      }
    )

    // Créer un objet URL à partir du blob
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    return url

  } catch (error) {
    handleApiError(error)
    throw error // Important : propager l'erreur
  }
}

// hotel history
export const getHotelHistory = async (filters: {
  hotelId?: number
  searchText?: string
  roomType?: string
  rateType?: string
  reservationType?: string
  source?: string
  showBookings?: string
  dateType?: string
  dateStart?: string
  dateEnd?: string
  stayCheckInDate?: string
  stayCheckOutDate?: string
  page?: number
  limit?: number
}) => {
  try {
    const response = await apiClient.get('/reports/hotel-histories', { params: filters ,...getHeaders() })
    return response.data
  } catch (error) {
    console.error('Error fetching reservation history:', error)
    throw error
  }
}
