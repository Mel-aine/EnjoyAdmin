/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type {
  RoomTypeData,
} from '@/types/option'

const API_URL = `${import.meta.env.VITE_API_URL as string}/configuration`


const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}


///// this is the amenities sections
/**
 * Get all amenities
 * @returns {Promise<AxiosResponse<any>>}
 */

export const getAmenities = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities`, headers)
}
/**
 * Post a new amenity
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */

export const postAmenity = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenities`, data, headers)
}
/**
 * Get an amenity
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAmenity = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities/${id}`, headers)
}
/**
 * Update an amenity
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */

export const updateAmenity = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenities/${id}`, data, headers)
}
/**
 * Delete an amenity
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteAmenity = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenities/${id}`, headers)
}


////// this is the room type sections
/**
 * Get all room types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_types`, headers)
}

/** 
 * update sortOrder roomtype
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomTypeSortOrder = (data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/room_types/sort-order`, data, headers)
}

/**
 * Post a new room type
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoomType = (data: RoomTypeData): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/room_types`, data, headers)
}
/**
 * Get a room type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_types/${id}`, headers)
}
/**
 * Update a room type
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomTypeById = (id: number, data: RoomTypeData): Promise<AxiosResponse<any>> => {

  return axios.put(`${API_URL}/room_types/${id}`, data, headers)
}
/**
 * Delete a room type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomType = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/room_types/${id}`, headers)
}


////// this is the Room sections
/**
 * Get all rooms
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRooms = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms`, headers)
}
/**
 * Post a new room
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoom = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/rooms`, data, headers)
}
/**
 * Get a room
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms/${id}`, headers)
}
/**
 * Update a room
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/rooms/${id}`, data, headers)
}
/**
 * Delete a room
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/rooms/${id}`, headers)
}


////// this is the Room Owner sections
/**
 * Get all room owners
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomOwners = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room-owners`, headers)
}
/**
 * Post a new room owner
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoomOwner = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/room-owners`, data, headers)
}
/**
 * Get a room owner
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomOwnerById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room-owners/${id}`, headers)
}
/**
 * Update a room owner
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomOwnerById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/room-owners/${id}`, data, headers)
}
/**
 * Delete a room owner
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomOwnerById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/room-owners/${id}`, headers)
}




////// this is the bed type sections
/**
 * Get all bed types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBedTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/bed_types`, headers)
}
/**
 * Post a new bed type
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postBedType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/bed_types`, data, headers)
}
/**
 * Get a bed type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBedTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/bed_types/${id}`, headers)
}
/**
 * Update a bed type
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateBedTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/bed_types/${id}`, data, headers)
}
/**
 * Delete a bed type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteBedTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/bed_types/${id}`, headers)
}


// this section is for rate type
/**
 * Get all rate types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRateTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rate_types`, headers)
}
/**
 * Post a new rate type
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRateType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/rate_types`, data, headers)
}
/**
 * Get a rate type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRateTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rate_types/${id}`, headers)
}
/**
 * Update a rate type
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRateTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/rate_types/${id}`, data, headers)
}
/**
 * Delete a rate type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRateTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/rate_types/${id}`, headers)
}

// this section is for season
/**
 * Get all seasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSeasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/seasons`, headers)
}
/**
 * Post a new season
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postSeason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/seasons`, data, headers)
}
/**
 * Get a season
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSeasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/seasons/${id}`, headers)
}
/**
 * Update a season
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateSeasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/seasons/${id}`, data, headers)
}
/**
 * Delete a season
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteSeasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/seasons/${id}`, headers)
}








