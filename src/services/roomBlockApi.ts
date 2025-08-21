/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/room-blocks`


const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}


/**
 * create Room Block
 */
export const createRoomBlock = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(API_URL, data, headers)
}

/**
 * get Room Blocks
 */
export const getRoomBlocks = (hotelId: any): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}`, headers )
}

/**
 * delete Room Block
 */
export const deleteBlock = (blockId: string): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/${blockId}`, headers)
}