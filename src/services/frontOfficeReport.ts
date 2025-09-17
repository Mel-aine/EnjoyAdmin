/**
 * Room Availability Report API Service - Version axios
 *
 * Service simplifié et professionnel pour la gestion des rapports de disponibilité des chambres
 *
 * @author EnjoyAdmin
 * @version 2.0.0
 */

import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/composables/user'

export interface RoomAvailabilityParams {
  hotelId: number
  dateFrom: string
  dateTo: string
  roomTypeId?: string | number
  floor?: string | number
  includeSummary?: boolean
  includeCharts?: boolean
  includeDetails?: boolean
  groupByFloor?: boolean
}

export interface RoomData {
  id: string
  roomNumber: string
  roomType: string
  floor: number
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  currentGuest?: string
  checkOutDate?: string
  nextAvailable?: string
}

export interface RoomAvailabilityResponse {
  success: boolean
  message?: string
  data: {
    data: RoomData[]
    summary: {
      totalRooms: number
      availableRooms: number
      occupiedRooms: number
      occupancyRate: number
    }
  }
}

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}

class RoomAvailabilityReportsService {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}/reports/front-office`

  private get axiosInstance() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Génère les données du rapport de disponibilité
   */
  async generateReport(params: RoomAvailabilityParams): Promise<RoomAvailabilityResponse> {
    try {
      this.validateParams(params)

      const { data } = await this.axiosInstance.post<RoomAvailabilityResponse>(
        '/room-availability',
        this.cleanParams(params),
        getHeaders()

      )

      if (!data.success) {
        throw new Error(data.message || 'Échec de génération du rapport')
      }

      return data
    } catch (error) {
      this.handleAxiosError(error, 'Échec de génération du rapport')
    }
  }

  /**
   * Génère un PDF et retourne le blob
   */
  async generatePDF(params: RoomAvailabilityParams): Promise<Blob> {
    try {
      this.validateParams(params)

      const { data } = await this.axiosInstance.post<ArrayBuffer>(
        '/room-availability-pdf',
        this.cleanParams(params),
        { ...getHeaders(), responseType: 'arraybuffer' }
      )

      const blob = new Blob([data], { type: 'application/pdf' })

      if (blob.size === 0) {
        throw new Error('PDF vide reçu')
      }

      return blob
    } catch (error) {
      this.handleAxiosError(error, 'Échec de génération du PDF')
    }
  }

  /**
   * Génère un PDF et retourne une URL objet
   */
  async generatePDFUrl(params: RoomAvailabilityParams): Promise<string> {
    const blob = await this.generatePDF(params)
    return URL.createObjectURL(blob)
  }

  /**
   * Télécharge directement un PDF
   */
  async downloadPDF(params: RoomAvailabilityParams, filename?: string): Promise<void> {
    const blob = await this.generatePDF(params)
    const defaultFilename = this.generateFilename('room_availability', params.dateFrom, params.dateTo, 'pdf')
    this.downloadBlob(blob, filename || defaultFilename)
  }

  /**
   * Export (pdf, excel, csv)
   */
  async export(params: RoomAvailabilityParams, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    try {
      const { data } = await this.axiosInstance.post<ArrayBuffer>(
        '/room-availability-export',
        { ...this.cleanParams(params), format },
        { responseType: 'arraybuffer' }
      )

      return new Blob([data], { type: this.getMimeType(format) })
    } catch (error) {
      this.handleAxiosError(error, `Échec export ${format}`)
    }
  }

  /**
   * Types de chambres disponibles
   */
  async getRoomTypes(hotelId: number): Promise<Array<{ value: string; label: string }>> {
    try {
      const { data } = await this.axiosInstance.get<{ roomTypes: Array<{ value: string; label: string }> }>(
        `/room-types?hotelId=${hotelId}`
      )
      return data.roomTypes || this.getDefaultRoomTypes()
    } catch (error) {
      console.warn('Erreur chargement types de chambres:', error)
      return this.getDefaultRoomTypes()
    }
  }

  /**
   * Étages disponibles
   */
  async getFloors(hotelId: number): Promise<Array<{ value: string; label: string }>> {
    try {
      const { data } = await this.axiosInstance.get<{ floors: Array<{ value: string; label: string }> }>(
        `/floors?hotelId=${hotelId}`
      )
      return data.floors || this.getDefaultFloors()
    } catch (error) {
      console.warn('Erreur chargement étages:', error)
      return this.getDefaultFloors()
    }
  }

  // --- Méthodes utilitaires privées ---

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  private generateFilename(reportType: string, dateFrom: string, dateTo: string, format: string): string {
    const fromDate = dateFrom.replace(/-/g, '')
    const toDate = dateTo.replace(/-/g, '')
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '')

    return `${reportType}_${fromDate}_${toDate}_${timestamp}.${format}`
  }

  private validateParams(params: RoomAvailabilityParams): void {
    if (!params.hotelId) throw new Error('ID hôtel requis')
    if (!params.dateFrom || !params.dateTo) throw new Error('Plage de dates requise')

    const startDate = new Date(params.dateFrom)
    const endDate = new Date(params.dateTo)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Format de date invalide')
    }

    if (startDate > endDate) {
      throw new Error('La date de début doit être antérieure ou égale à la date de fin')
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff > 365) {
      throw new Error('La plage de dates ne peut pas dépasser 365 jours')
    }
  }

  private cleanParams(params: RoomAvailabilityParams): RoomAvailabilityParams {
    return {
      hotelId: Number(params.hotelId),
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      roomTypeId: params.roomTypeId ? String(params.roomTypeId) : undefined,
      floor: params.floor ? String(params.floor) : undefined,
      includeSummary: params.includeSummary ?? true,
      includeCharts: params.includeCharts ?? true,
      includeDetails: params.includeDetails ?? true,
      groupByFloor: params.groupByFloor ?? false
    }
  }

  private getDefaultRoomTypes(): Array<{ value: string; label: string }> {
    return [
      { value: 'standard', label: 'Chambre Standard' },
      { value: 'deluxe', label: 'Chambre Deluxe' },
      { value: 'suite', label: 'Suite' }
    ]
  }

  private getDefaultFloors(): Array<{ value: string; label: string }> {
    return [
      { value: '1', label: 'Étage 1' },
      { value: '2', label: 'Étage 2' },
      { value: '3', label: 'Étage 3' }
    ]
  }

  private getMimeType(format: 'pdf' | 'excel' | 'csv'): string {
    switch (format) {
      case 'pdf':
        return 'application/pdf'
      case 'excel':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      case 'csv':
        return 'text/csv'
      default:
        return 'application/octet-stream'
    }
  }

  private handleAxiosError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ message?: string }>
      const msg = err.response?.data?.message || err.message || defaultMessage
      console.error(defaultMessage, err)
      throw new Error(msg)
    }
    throw new Error(defaultMessage)
  }
}

// Export instance singleton
export const roomAvailabilityService = new RoomAvailabilityReportsService()
export default roomAvailabilityService

// Utilitaires pour les dates
export const formatDateForApi = (date: Date): string => date.toISOString().split('T')[0]

export const getDateRangeOptions = () => {
  const today = new Date()
  return {
    today: formatDateForApi(today),
    tomorrow: formatDateForApi(new Date(today.getTime() + 24 * 60 * 60 * 1000)),
    nextWeek: formatDateForApi(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
    nextMonth: formatDateForApi(new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
    next3Months: formatDateForApi(new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()))
  }
}
