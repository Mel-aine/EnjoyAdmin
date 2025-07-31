/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type {
  OptionType,
  ServiceProductType,
  ProductOptionType,
  RoomTypeData,
  ReservationType,
  userDataType,
} from '@/types/option'
import type { FitlterItem, RoomFilterItem, TaskFitlterItem } from '@/utils/models'
import type { IContract, IPayroll, ICreatePayroll } from '@/types/type'

const API_URL = import.meta.env.VITE_API_URL as string
const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}
// --- Types ---
export interface Option {
  id?: number
  name: string
  description?: string

  // ajoute d'autres champs selon ton modèle
}

export interface CreateRoomData {
  service_id: number
  product_name: string
  product_type: string
  description: string
  // availability:boolean
  status: string
  price: string
}

export interface RoomOptionData {
  service_product_id: number
  option_id: number
  option_type: string
  value: string
}

// --- Services API get --- //

//get les options
export const getOptions = (): Promise<AxiosResponse<{ data: OptionType[] }>> => {
  return axios.get(`${API_URL}/option`, headers)
}

//get les services product by serviceId
export const getServiceProduct = (serviceId: number | null): Promise<AxiosResponse<any[]>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/service_product_by_serviceId/${serviceId}`, headers)
}

export const getServiceProductById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/service_product/${id}`, headers)
}

//get les productOptions
export const getProductOption = (): Promise<AxiosResponse<{ data: ProductOptionType[] }>> => {
  return axios.get(`${API_URL}/production_option`, headers)
}

//get les services
export const getService = (serviceId?: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${serviceId}`, headers)
}

//get lees actions
export const getStocksHistories = (id?: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/activity-logs/user/${id}`, headers)
}

export const getServices = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services`, headers)
}

//get les services products avc les options et  sans les options en fonctions de l id du services
export const getServiceProductWithOptions = (
  serviceId?: number | null,
): Promise<AxiosResponse<{ data: ServiceProductType[] }>> => {
  const url = serviceId
    ? `${API_URL}/service_product_option?serviceId=${serviceId}`
    : `${API_URL}/service_product_options`

  return axios.get(url, headers)
}

export const getTypeProduct = (): Promise<AxiosResponse<{ data: RoomTypeData[] }>> => {
  return axios.get(`${API_URL}/product`, headers)
}

export const getTypeProductByServiceId = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/product/${id}`, headers)
}

export const getUser = (): Promise<AxiosResponse<{ data: userDataType[] }>> => {
  return axios.get(`${API_URL}/users`, headers)
}
export const getCustomersList = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${id}/clients`, headers)
}

export const getUserByServiceId = (id: number): Promise<AxiosResponse<{ data: string }>> => {
  console.log('-->API', headers)
  return axios.get(`${API_URL}/usersbyservice/${id}`, headers)
}
export const getCustomerProfile = (
  id: number,
): Promise<AxiosResponse<{ data: userDataType[] }>> => {
  return axios.get(`${API_URL}/users/${id}/profile`, headers)
}
//get reservation by serviceId
export const getReservation = (
  serviceId: number | null,
): Promise<AxiosResponse<ReservationType[]>> => {
  return axios.get(`${API_URL}/reservations/${serviceId}`, headers)
}

// get reservation by id
export const getReservationById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservations_by_id/${id}`, headers)
}

//get service by id
export const getServiceById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${id}`, headers)
}

//get service by id
export const getServiceDepartmentDetails = (
  id: number,
  departmentId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${id}/departments/${departmentId}/details`, headers)
}

export const getServiceProductAndReservationById = (
  id: number | null,
): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/service_products/${id}`, headers)
}

//get user by id
export const getUserId = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/users/${id}`, headers)
}

export const getEmployeesDetails = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/users/${id}/details`, headers)
}
//get payment
export const getPayment = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/payments/${serviceId}`, headers)
}

export const getPaymentById = (id: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/payment/${id}`, headers)
}

export const getCategory = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/stockCategory/${serviceId}`, headers)
}

export const getSupplier = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/supplier/${serviceId}`, headers)
}

export const getProduct = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/prooductService/${serviceId}`, headers)
}

export const getDepartment = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/department/${serviceId}`, headers)
}

export const getMovementService = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/movement/${serviceId}`, headers)
}

export const getExpense = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/expenses/${serviceId}`, headers)
}

export const getVehicle = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/vehicle/${serviceId}`, headers)
}

export const getRoute = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/route/${serviceId}`, headers)
}

export const getRole = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/services/${serviceId}/roles`, headers)
}
export const getEmployeesForService = (
  serviceId: number | null,
  filter: FitlterItem,
): Promise<AxiosResponse<any>> => {
  let qs = ``
  if (filter.department) {
    if (qs) qs += `&departmentId=${filter.department}`
    else qs += `?departmentId=${filter.department}`
  }
  if (filter.roleId) {
    if (qs) qs += `&roleId=${filter.roleId}`
    else qs += `?roleId=${filter.roleId}`
  }
  if (filter.searchText) {
    if (qs) qs += `&search=${filter.searchText}`
    else qs += `?search=${filter.searchText}`
  }
  return axios.get(`${API_URL}/services/${serviceId}/employees${qs}`, headers)
}
export const getRoles = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/roles_permissions/${serviceId}`, headers)
}

export const getReservationServiceProduct = (
  reservationId: number | null,
): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/reservation_service/${reservationId}`, headers)
}
export const getReservationDetailsById = (reservationId: number): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/reservations/${reservationId}/details`, headers)
}
export const getReservationHistoryById = (reservationId: number): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/activity-logs/by-entity?entityType=Reservation&entityId=${reservationId}`,
    headers,
  )
}

export const getRoomHistoryById = (roomId: number): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/activity-logs/by-entity?entityType=ServiceProduct&entityId=${roomId}`,
    headers,
  )
}
export const getUserAssignment = (): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/assigmentUser`, headers)
}

export const finAvailableHome = (
  serviceId: number,
  roomTypeId: number,
  arrivalDate: string,
  departureDate: string,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/service-products/available?serviceId=${serviceId}&roomTypeId=${roomTypeId}&arrivalDate=${arrivalDate}&departureDate=${departureDate}`,
    headers,
  )
}
export const getPermission = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/permission`, headers)
}

export const getTasks = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/tasks/${serviceId}`, headers)
}

export const getUserAssignmentById = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/assigmentUser/${serviceId}`, headers)
}

export const getCustomer = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/customer/${serviceId}`, headers)
}

export const getSchedules = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/schedules`, {
    params: {
      service_id: serviceId,
    },
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  })
}

export const dashboard = (serviceId: any): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/staff_management/dashboard/${serviceId}`, headers)
}
export const getRoomCountByRoomType = (
  serviceId: number,
  productTypeId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/type-products/room-count?service_id=${serviceId}&product_type_id=${productTypeId}`,
    headers,
  )
}

export const getRefunds = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', headers)
  return axios.get(`${API_URL}/refund/${serviceId}`, headers)
}

export const getServiceProductsWithDetails = (
  serviceId: number | null,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/service-products/${serviceId}/details`, headers)
}

export const getOptionsEquipement = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/option_equipement`, headers)
}
// --- Services API post --- //

//create service product
export const createRoom = (roomData: any): Promise<AxiosResponse<{ id: number }>> => {
  return axios.post(`${API_URL}/service_product`, roomData, headers)
}

//create  product option
export const createRoomOptions = (optionsData: {
  data: RoomOptionData[]
}): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/production_option`, optionsData, headers)
}

//create user
export const createUser = (userData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/assign-user`, userData, headers)
}

//create product type
export const createRoomType = (roomTypeData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/product`, roomTypeData, headers)
}

//create reservation
export const createReservation = (reservationData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservationswithuser`, reservationData, headers)
}

//create payment
export const createPayment = (paymentData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/paymentConfirm`, paymentData, headers)
}

// services/authService.ts

export function auth(credentials: { email: string; password: string; keepLoggedIn?: boolean }) {
  return axios.post(`${API_URL}/authLogin`, credentials, {
    withCredentials: true,
  })
}

export function logout() {
  return axios.post(
    `${API_URL}/authLogout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      withCredentials: true,
    },
  )
}

export function validateEmail(email: string) {
  return axios.post(`${API_URL}/validateEmail`, { email })
}

export function validatePassword(email: string, password: string) {
  return axios.post(`${API_URL}/validatePassword`, { email, password })
}

//create stock category
export const createCategory = (categoryData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/stockCategory`, categoryData, headers)
}

//create stock category
export const createSupplier = (supplierData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/supplier`, supplierData, headers)
}

//create stock product
export const createProduct = (productData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/prooductService`, productData, headers)
}

//create department
export const createDepartment = (departmentData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/department`, departmentData, headers)
}

export const createExpense = (expenseData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/expenses`, expenseData, headers)
}

//create stock product movement
export const movementService = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/movement`, Data, headers)
}

//vehicle
export const createVehicle = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/vehicle`, Data, headers)
}

export const createRoute = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/route`, Data, headers)
}

export const updateRolePermissions = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/roles/assign-permissions`, Data, headers)
}

export const createNewRole = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/roles`, Data, headers)
}

// --- Services API put --- //

export const updateMovementService = (
  id: number | null,
  Payload: any,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/movement/${id}`, Payload, headers)
}

//update reservation ou user

export const putReservation = (id: number | null, payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/reservations_update/${id}`, payload, headers)
}

//update User
export const updateUser = (id: number | null, userPayload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/users_update/${id}`, userPayload, headers)
}

//update room option
export const updateRoomOptions = (
  id: number | null,
  optionsPayload: any,
): Promise<AxiosResponse<any>> => {
  return axios.put(
    `${API_URL}/product_option/by-service/${id}`,
    {
      options: optionsPayload,
    },
    headers,
  )
}

//update room
export const updateRoom = (id: number | null, payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/service_product/${id}`, payload, headers)
}

//update type product
export const updateRoomType = (
  id: number | null,
  roomTypePayload: any,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/product/${id}`, roomTypePayload, headers)
}

export const updateCategory = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/stockCategory/${id}`, Payload, headers)
}

export const updateSupplier = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/supplier/${id}`, Payload, headers)
}

export const updateDpt = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/department/${id}`, Payload, headers)
}

export function user_update(
  userId: number | null,
  data: { password: string; password_confirmation: string },
  token: string | null,
) {
  return axios.put(`${API_URL}/auth/${userId}`, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
}

export const updateProduct = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/prooductService/${id}`, Payload, headers)
}

export const updateService = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/services/${id}`, Payload, headers)
}

export const updateExpense = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/expenses/${id}`, Payload, headers)
}

export const updateVehicle = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/vehicle/${id}`, Payload, headers)
}

export const updateRoute = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/route/${id}`, Payload, headers)
}
export const confirmPayment = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/payment/${id}/confirm`, Payload, headers)
}

export const updateTaskStatus = (id: number, status: string): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/tasks/${id}`, { status }, headers)
}
export const checkExtendStay = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/reservations/${id}/checkExtendStay`, data, headers)
}
export const confirmExtendStay = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/reservations/${id}/extendStay`, data, headers)
}
export const getCancellationSummary = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservations/${id}/cancellation-summary`, headers)
}
export const cancelReservation = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservations/${id}/cancel`, data, headers)
}

export const updateRoomStatus = (
  roomId: number,
  status: string,
  force = false,
  maintenanceData?: { reason: string; startDate: string; endDate: string; notes: string },
): Promise<AxiosResponse<any>> => {
  const payload: any = { status, force }

  if (status === 'maintenance' && maintenanceData) {
    Object.assign(payload, maintenanceData)
  }

  return axios.patch(`${API_URL}/service_product/update_status/${roomId}`, payload, headers)
}

// Find reservation
export const filterReservation = (id: number, filter: FitlterItem): Promise<AxiosResponse<any>> => {
  let qs = ``
  if (filter.checkInDate) {
    if (qs) qs += `&checkInDate=${filter.checkInDate}`
    else qs += `?checkInDate=${filter.checkInDate}`
  }
  if (filter.checkOutDate) {
    if (qs) qs += `&checkOutDate=${filter.checkOutDate}`
    else qs += `?checkOutDate=${filter.checkOutDate}`
  }
  if (filter.roomType) {
    if (qs) qs += `&roomType=${filter.roomType}`
    else qs += `?roomType=${filter.roomType}`
  }
  if (filter.searchText) {
    if (qs) qs += `&searchText=${filter.searchText}`
    else qs += `?searchText=${filter.searchText}`
  }
  if (filter.status) {
    if (qs) qs += `&status=${filter.status}`
    else qs += `?status=${filter.status}`
  }
  return axios.get(`${API_URL}/services/${id}/reservation/search${qs}`, headers)
}

//find room
export const filterRoom = (id: number, filter: RoomFilterItem): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/service_product/${id}/filter`, filter, headers)
}

//find Refund
export const filterRefund = (
  serviceId: number | null,
  filter: any,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/refund/filter/${serviceId}`, filter, headers)
}

//----- SERVICE API Delete ----//

//delete reservation
export const deleteReservation = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/reservations/${id}`, headers)
}

//delete serviceProduct
export const deleteServiceProduct = async (id: number | null): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.delete(`${API_URL}/service_product/${id}`, headers)
    return response
  } catch (error: any) {
    throw error.response
  }
}

//delete User
export const deleteUser = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/users/${id}`, headers)
}
//delete type product
export const deleteRoomType = (
  id: number | null,
  serviceId: number | null,
): Promise<AxiosResponse<any>> => {
  if (id === null) throw new Error('ID du type de chambre manquant')

  return axios.delete(`${API_URL}/product/${id}`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
    params: {
      service_id: serviceId,
    },
  })
}

export const deleteMovement = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/movement/${id}`, headers)
}

export const deleteProduct = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/prooductService/${id}`, headers)
}

export const deleteCategory = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/stockCategory/${id}`, headers)
}

export const deleteSupplier = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/supplier/${id}`, headers)
}

export const deleteDpt = (id: number | null): Promise<AxiosResponse<any>> => {

  console.log('-->deleteDpt.id', id)
  return axios.delete(`${API_URL}/department/${id}`, headers)
}

export const deleteExpense = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/expenses/${id}`, headers)
}

export const deleteVehicle = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/vehicle/${id}`, headers)
}

export const deleteRoute = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/route/${id}`, headers)
}

/// This is to manae cancel

export const deleteCancellationPolicy = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/cancellation-policies/${id}`, headers)
}
export const getCancellationPolicyById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/cancellation-policies/${id}`, headers)
}
export const getCancellationPolicyByHotelId = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/cancellation-policies/hotel/${id}`, headers)
}

export const insertCancellationPolicy = (datas: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/cancellation-policies `, datas, headers)
}
export const updateCancellationPolicy = (id: number, datas: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/cancellation-policies/${id}`, datas, headers)
}

/**
 * Fetches tasks from the API based on a set of filter criteria.
 *
 * @param {object} filters - The filter criteria for the tasks.
 * @param {number} [filters.serviceId] - The ID of the service to scope the tasks.
 * @param {number} [filters.userId] - The ID of the user the tasks are assigned to.
 * @param {number} [filters.departmentId] - The ID of the department to get tasks for all its members.
 * @param {string} [filters.createdDate] - The creation date of the task (format: 'YYYY-MM-DD'). This filters on the `created_at` field.
 * @param {string} [filters.dueDate] - The due date of the task (format: 'YYYY-MM-DD').
 * @param {'todo' | 'in_progress' | 'done' | 'cancelled' | 'pending'} [filters.status] - The status of the task.
 * @returns {Promise<Array>} A promise that resolves to an array of task objects.
 */
export const findTasks = (filters: TaskFitlterItem): Promise<AxiosResponse<any>> => {
  let qs = ``
  if (filters.departmentId) {
    if (qs) qs += `&departmentId=${filters.departmentId}`
    else qs += `?departmentId=${filters.departmentId}`
  }
  if (filters.status) {
    if (qs) qs += `&status=${filters.status}`
    else qs += `?status=${filters.status}`
  }
  if (filters.dueDate) {
    if (qs) qs += `&dueDate=${filters.dueDate}`
    else qs += `?dueDate=${filters.dueDate}`
  }
  if (filters.createdDate) {
    if (qs) qs += `&createdDate=${filters.createdDate}`
    else qs += `?createdDate=${filters.createdDate}`
  }
  if (filters.serviceId) {
    if (qs) qs += `&serviceId=${filters.serviceId}`
    else qs += `?serviceId=${filters.serviceId}`
  }
  if(filters.searchText){
     if (qs) qs += `&searchText=${filters.searchText}`
    else qs += `?searchText=${filters.searchText}`
  }
  return axios.get(`${API_URL}/tasks_search/filter${qs}`, headers)
}

//create contract
export const createContract = (contract: IContract): Promise<AxiosResponse<{ id: number }>> => {
  return axios.post(`${API_URL}/employment_contracts`, contract, headers)
}
export const updateContract = (contract: IContract): Promise<AxiosResponse<{ id: number }>> => {
  return axios.put(`${API_URL}/employment_contracts/${contract.contract_id}`, contract, headers)
}
export const terminateContract = (contractId: string): Promise<AxiosResponse<{ id: number }>> => {
  return axios.put(`${API_URL}/employment_contracts/${contractId}/terminate`, {}, headers)
}


//payroll
export const getPayrollsByContractId = (contractId: string): Promise<AxiosResponse<IPayroll[]>> => {
  return axios.get(`${API_URL}/payroll/by-contract/${contractId}`, headers)
}

export const createPayroll = (payload: IPayroll): Promise<AxiosResponse<IPayroll>> => {
  return axios.post(`${API_URL}/payroll`, payload, headers)
}
