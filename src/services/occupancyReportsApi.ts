/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

// Occupancy Reports API interfaces
export interface MonthlyOccupancyParams {
  month: number
  year?: number
  hotelId?: number
}

export interface OccupancyReportResponse {
  success: boolean
  data?: Blob
  message?: string
}

const API_URL = `${import.meta.env.VITE_API_URL as string}/reports/statistics`

const authStore = useAuthStore()
const headers: any = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

/**
 * Get Monthly Occupancy PDF Report
 * 
 * Fetches a PDF blob containing monthly occupancy statistics for a specific hotel.
 * 
 * @param params - Query parameters for the occupancy report
 * @param params.month - Month (1-12) for the report
 * @param params.year - Year for the report (defaults to current year if not provided)
 * @param params.hotelId - Hotel ID (uses default hotel if not specified)
 * @returns Promise<Blob> - PDF blob data
 * 
 * @example
 * // Get January 2024 occupancy for hotel ID 1
 * const pdfBlob = await getMonthlyOccupancyPDF({ month: 1, year: 2024, hotelId: 1 })
 * 
 * // Get current month occupancy (defaults to current year)
 * const pdfBlob = await getMonthlyOccupancyPDF({ month: 3 })
 * 
 * // Get February 2024 occupancy (uses default hotel if not specified)
 * const pdfBlob = await getMonthlyOccupancyPDF({ month: 2, year: 2024 })
 */
export const getMonthlyOccupancyPDF = async (params: MonthlyOccupancyParams): Promise<Blob> => {
  try {
    const queryParams = new URLSearchParams()

    // Add required month parameter
    queryParams.append('month', params.month.toString())

    // Add optional parameters if they exist
    if (params.year) {
      queryParams.append('year', params.year.toString())
    }
    if (params.hotelId) {
      queryParams.append('hotelId', params.hotelId.toString())
    }

    const url = `${API_URL}/monthly-occupancy-pdf?${queryParams.toString()}`
    
    // Configure axios to receive blob response
    const config = {
      ...headers,
      responseType: 'blob' as const,
    }

    const response: AxiosResponse<Blob> = await axios.get(url, config)
    
    // Validate that we received a PDF blob
    if (response.data.type !== 'application/pdf') {
      throw new Error('Invalid response type: Expected PDF blob')
    }

    return response.data
  } catch (error) {
    console.error('Error fetching monthly occupancy PDF:', error)
    throw error
  }
}

/**
 * Get Monthly Occupancy PDF URL
 * 
 * Creates a blob URL for displaying the PDF in a viewer component.
 * 
 * @param params - Query parameters for the occupancy report
 * @returns Promise<string> - Blob URL for the PDF
 * 
 * @example
 * const pdfUrl = await getMonthlyOccupancyPDFUrl({ month: 1, year: 2024, hotelId: 1 })
 * // Use pdfUrl in EnjoyPDFView component
 */
export const getMonthlyOccupancyPDFUrl = async (params: MonthlyOccupancyParams): Promise<string> => {
  try {
    const pdfBlob = await getMonthlyOccupancyPDF(params)
    console.log(pdfBlob)
    return URL.createObjectURL(pdfBlob)
  } catch (error) {
    console.error('Error creating PDF URL:', error)
    throw error
  }
}

/**
 * Download Monthly Occupancy PDF
 * 
 * Downloads the PDF file directly to the user's device.
 * 
 * @param params - Query parameters for the occupancy report
 * @param filename - Optional custom filename for the download
 * 
 * @example
 * await downloadMonthlyOccupancyPDF({ month: 1, year: 2024, hotelId: 1 }, 'occupancy-jan-2024.pdf')
 */
export const downloadMonthlyOccupancyPDF = async (
  params: MonthlyOccupancyParams, 
  filename?: string
): Promise<void> => {
  try {
    const pdfBlob = await getMonthlyOccupancyPDF(params)
    
    // Generate default filename if not provided
    const defaultFilename = `occupancy-report-${params.month}-${params.year || new Date().getFullYear()}.pdf`
    const finalFilename = filename || defaultFilename
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = finalFilename
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading monthly occupancy PDF:', error)
    throw error
  }
}

/**
 * Validate Monthly Occupancy Parameters
 * 
 * Validates the parameters before making API calls.
 * 
 * @param params - Parameters to validate
 * @returns boolean - True if valid, throws error if invalid
 */
export const validateMonthlyOccupancyParams = (params: MonthlyOccupancyParams): boolean => {
  // Validate month (1-12)
  if (!params.month || params.month < 1 || params.month > 12) {
    throw new Error('Month must be between 1 and 12')
  }
  
  // Validate year if provided
  if (params.year && (params.year < 2000 || params.year > new Date().getFullYear() + 1)) {
    throw new Error('Year must be between 2000 and next year')
  }
  
  // Validate hotelId if provided
  if (params.hotelId && params.hotelId <= 0) {
    throw new Error('Hotel ID must be a positive number')
  }
  
  return true
}

/**
 * Get Available Occupancy Report Months
 * 
 * Helper function to get available months for occupancy reports.
 * 
 * @returns Array of month objects with value and label
 */
export const getAvailableMonths = () => {
  return [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]
}

/**
 * Get Available Years
 * 
 * Helper function to get available years for occupancy reports.
 * 
 * @param startYear - Starting year (defaults to 2020)
 * @returns Array of year objects with value and label
 */
export const getAvailableYears = (startYear: number = 2020) => {
  const currentYear = new Date().getFullYear()
  const years = []
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push({ value: year, label: year.toString() })
  }
  
  return years
}