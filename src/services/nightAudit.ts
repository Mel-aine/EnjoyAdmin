/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
 
const API_URL = `${import.meta.env.VITE_API_URL as string}/night-audit`

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`, 
    },
    withCredentials: true,
  }
}

/**
 * Calculate and store night audit data
 */
export const createNightAudit = (data:any ): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}`, data, getHeaders())
}

/**
 *  get night audit details
 *  */
export const getNightAuditDetails = (hotelId: number, auditDate:string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}/${auditDate}`, getHeaders())
}

/**
 *  get night audit list
 *  */
export const getNightAuditList = (hotelId: number,): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}`, getHeaders())
}

/**
 * get night audit summary
 * */
export const getNightAuditSummary = (hotelId: number,): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}/summary`, getHeaders())
}

/**
 * get night audit room status
 * */
export const getNightAuditRoomStatus = (hotelId: number, auditDate:string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}/${auditDate}/room-status`, getHeaders())
}

/**
 * get night audit unsettled-folios
 * */
export const getNightAuditUnsettledFolios = (hotelId: number, auditDate:string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}/${auditDate}/unsettled-folios`, getHeaders())
}


/***
 * get night audit nightly-charges
 * */
export const getNightAuditNightlyCharges = (hotelId: number, auditDate:string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}/${auditDate}/nightly-charges`, getHeaders())
}


/**
 * get night audit pending-reservations
 */
export const getNightAuditPendingReservations = (hotelId: number, auditDate:string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}/${auditDate}/pending-reservations`, getHeaders())
}

/***
 * post postNightlyCharges
 * */
export const postNightlyCharges = (hotelId: number, auditDate:string, data:any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/${hotelId}/${auditDate}/post-nightly-charges`, data, getHeaders())
}
