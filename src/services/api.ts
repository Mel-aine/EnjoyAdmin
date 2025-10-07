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
import type {
  AmenityCategoryPayload,
  AmenityProductPayload,
  CreateAmenityBookingPayload,
  FitlterItem,
  RoomFilterItem,
  TaskFitlterItem,
  UpdateAmenityBookingPayload,
  UpdateAmenityCategoryPayload,
} from '@/utils/models'
import type { IContract, IPayroll, ICreatePayroll } from '@/types/type'

const API_URL = import.meta.env.VITE_API_URL as string

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
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
  return axios.get(`${API_URL}/option`, getHeaders())
}

//get les services product by serviceId
export const getServiceProduct = (serviceId: number | null): Promise<AxiosResponse<any[]>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/service_product_by_serviceId/${serviceId}`, getHeaders())
}

export const getServiceProductById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/service_product/${id}`, getHeaders())
}

//get les productOptions
export const getProductOption = (): Promise<AxiosResponse<{ data: ProductOptionType[] }>> => {
  return axios.get(`${API_URL}/production_option`, getHeaders())
}

//get les services
export const getService = (serviceId?: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${serviceId}`, getHeaders())
}

//get lees actions
export const getStocksHistories = (id?: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/activity-logs/user/${id}`, getHeaders())
}

export const getServices = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services`, getHeaders())
}

//get les services products avc les options et  sans les options en fonctions de l id du services
export const getServiceProductWithOptions = (
  serviceId?: number | null,
): Promise<AxiosResponse<{ data: ServiceProductType[] }>> => {
  const url = serviceId
    ? `${API_URL}/service_product_option?serviceId=${serviceId}`
    : `${API_URL}/service_product_options`

  return axios.get(url, getHeaders())
}

export const getTypeProduct = (): Promise<AxiosResponse<{ data: RoomTypeData[] }>> => {
  return axios.get(`${API_URL}/product`, getHeaders())
}

export const getTypeProductByServiceId = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/product/${id}`, getHeaders())
}

export const getUser = (): Promise<AxiosResponse<{ data: userDataType[] }>> => {
  return axios.get(`${API_URL}/users`, getHeaders())
}
export const getCustomersList = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${id}/clients`, getHeaders())
}

export const getUserByServiceId = (id: number): Promise<AxiosResponse<{ data: string }>> => {
  console.log('-->API', getHeaders())
  return axios.get(`${API_URL}/usersbyservice/${id}`, getHeaders())
}
export const getCustomerProfile = (
  id: number,
): Promise<AxiosResponse<{ data: userDataType[] }>> => {
  return axios.get(`${API_URL}/users/${id}/profile`, getHeaders())
}
//get reservation by serviceId
export const getReservation = (
  serviceId: number | null,
): Promise<AxiosResponse<ReservationType[]>> => {
  return axios.get(`${API_URL}/reservations/${serviceId}`, getHeaders())
}

// get reservation by id
export const getReservationById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservations_by_id/${id}`, getHeaders())
}

//get service by id
export const getServiceById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${id}`, getHeaders())
}

//get service by id
export const getServiceDepartmentDetails = (
  id: number,
  departmentId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${id}/departments/${departmentId}/details`, getHeaders())
}

export const getServiceProductAndReservationById = (
  id: number | null,
): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/service_products/${id}`, getHeaders())
}

//get user by id
export const getUserId = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/users/${id}`, getHeaders())
}

export const getEmployeesDetails = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/users/${id}/details`, getHeaders())
}
//get payment
export const getPayment = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/payments/${serviceId}`, getHeaders())
}

export const getPaymentById = (id: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/payment/${id}`, getHeaders())
}

export const getCategory = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/stockCategory/${serviceId}`, getHeaders())
}

export const getSupplier = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/supplier/${serviceId}`, getHeaders())
}

export const getProduct = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/prooductService/${serviceId}`, getHeaders())
}

export const getDepartment = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/department/${serviceId}`, getHeaders())
}

export const getMovementService = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/movement/${serviceId}`, getHeaders())
}

export const getExpense = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/expenses/${serviceId}`, getHeaders())
}

export const getVehicle = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/vehicle/${serviceId}`, getHeaders())
}

export const getRoute = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/route/${serviceId}`, getHeaders())
}

export const getRole = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/services/${serviceId}/roles`, getHeaders())
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
  return axios.get(`${API_URL}/services/${serviceId}/employees${qs}`, getHeaders())
}
export const getRoles = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/roles_permissions/${serviceId}`, getHeaders())
}

export const getReservationServiceProduct = (
  reservationId: number | null,
): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/reservation_service/${reservationId}`, getHeaders())
}
export const getReservationDetailsById = (reservationId: number): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/reservations/${reservationId}/details`, getHeaders())
}
export const getReservationHistoryById = (reservationId: number): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/activity-logs/by-entity?entityType=Reservation&entityId=${reservationId}`,
    getHeaders(),
  )
}

export const getRoomHistoryById = (roomId: number): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/activity-logs/by-entity?entityType=ServiceProduct&entityId=${roomId}`,
    getHeaders(),
  )
}
export const getUserAssignment = (): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/assigmentUser`, getHeaders())
}

export const finAvailableHome = (
  serviceId: number,
  roomTypeId: number,
  arrivalDate: string,
  departureDate: string,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/service-products/available?serviceId=${serviceId}&roomTypeId=${roomTypeId}&arrivalDate=${arrivalDate}&departureDate=${departureDate}`,
    getHeaders(),
  )
}
export const getPermission = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/permission`, getHeaders())
}

export const getTasks = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/tasks/${serviceId}`, getHeaders())
}

export const getUserAssignmentById = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/assigmentUser/${serviceId}`, getHeaders())
}

// export const getCustomer = (serviceId: number | null): Promise<AxiosResponse<any>> => {
//   return axios.get(`${API_URL}/services/customer/${serviceId}`, getHeaders())
// }

export const getSchedules = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/schedules`, {
    params: {
      service_id: serviceId,
    },
    ...getHeaders()
  })
}

export const dashboard = (serviceId: any): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/staff_management/dashboard/${serviceId}`, getHeaders())
}
export const getRoomCountByRoomType = (
  serviceId: number,
  productTypeId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/type-products/room-count?service_id=${serviceId}&product_type_id=${productTypeId}`,
    getHeaders(),
  )
}

export const getRefunds = (serviceId: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/refund/${serviceId}`, getHeaders())
}

export const getServiceProductsWithDetails = (
  serviceId: number | null,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/service-products/${serviceId}/details`, getHeaders())
}

export const getOptionsEquipement = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/option_equipement`, getHeaders())
}
// --- Services API post --- //

//create service product
export const createRoom = (roomData: any): Promise<AxiosResponse<{ id: number }>> => {
  return axios.post(`${API_URL}/service_product`, roomData, getHeaders())
}

//create  product option
export const createRoomOptions = (optionsData: {
  data: RoomOptionData[]
}): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/production_option`, optionsData, getHeaders())
}

//create user
export const createUser = (userData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/assign-user`, userData, getHeaders())
}

//create product type
export const createRoomType = (roomTypeData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/product`, roomTypeData, getHeaders())
}

//create reservation
export const createReservation = (reservationData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservationswithuser`, reservationData, getHeaders())
}

//create payment
export const createPayment = (paymentData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/paymentConfirm`, paymentData, getHeaders())
}

// services/authService.ts

export function auth(credentials: { email: string; password: string; keepLoggedIn?: boolean }) {
  return axios.post(`${API_URL}/authLogin`, credentials, {
    withCredentials: true,
  })
}

export function initSpace(credentials: { userId: number }) {
  return axios.post(`${API_URL}/initSpace`, credentials, getHeaders())
}
export function logout() {
  return axios.post(
    `${API_URL}/authLogout`,
    {},
    {
       ...getHeaders()
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
  return axios.post(`${API_URL}/stockCategory`, categoryData, getHeaders())
}

//create stock category
export const createSupplier = (supplierData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/supplier`, supplierData, getHeaders())
}

//create stock product
export const createProduct = (productData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/prooductService`, productData, getHeaders())
}

//create department
export const createDepartment = (departmentData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/department`, departmentData, getHeaders())
}

export const createExpense = (expenseData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/expenses`, expenseData, getHeaders())
}

//create stock product movement
export const movementService = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/movement`, Data, getHeaders())
}

//vehicle
export const createVehicle = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/vehicle`, Data, getHeaders())
}

export const createRoute = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/route`, Data, getHeaders())
}

export const updateRolePermissions = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/roles/assign-permissions`, Data, getHeaders())
}

export const createNewRole = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/roles`, Data, getHeaders())
}

//create customer
export const createCustomer = (Data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/customers`, Data, getHeaders())
}

// --- Services API put --- //

export const updateMovementService = (
  id: number | null,
  Payload: any,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/movement/${id}`, Payload, getHeaders())
}

//update reservation ou user

export const putReservation = (id: number | null, payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/reservations_update/${id}`, payload, getHeaders())
}

//update User
export const updateUser = (id: number | null, userPayload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/users_update/${id}`, userPayload, getHeaders())
}

//update customer
export const updateCustomer = (id: number | null, userPayload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/update_customer/${id}`, userPayload, getHeaders())
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
    getHeaders(),
  )
}

//update room
export const updateRoom = (id: number | null, payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/service_product/${id}`, payload, getHeaders())
}

//update type product
export const updateRoomType = (
  id: number | null,
  roomTypePayload: any,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/product/${id}`, roomTypePayload, getHeaders())
}

export const updateCategory = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/stockCategory/${id}`, Payload, getHeaders())
}

export const updateSupplier = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/supplier/${id}`, Payload, getHeaders())
}

export const updateDpt = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/department/${id}`, Payload, getHeaders())
}

export function user_update(
  userId: number | null,
  data: { password: string; password_confirmation: string },
  token: string | null,
) {
  return axios.put(`${API_URL}/auth/${userId}`, data, {
     ...getHeaders()
  })
}

export const updateProduct = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/prooductService/${id}`, Payload, getHeaders())
}

export const updateService = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/services/${id}`, Payload, getHeaders())
}

export const updateExpense = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/expenses/${id}`, Payload, getHeaders())
}

export const updateVehicle = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/vehicle/${id}`, Payload, getHeaders())
}

export const updateRoute = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/route/${id}`, Payload, getHeaders())
}
export const confirmPayment = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/payment/${id}/confirm`, Payload, getHeaders())
}

export const updateTaskStatus = (id: number, status: string): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/tasks/${id}`, { status }, getHeaders())
}
export const checkExtendStay = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/reservations/${id}/checkExtendStay`, data, getHeaders())
}
export const confirmExtendStay = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/reservations/${id}/extendStay`, data, getHeaders())
}
export const getCancellationSummary = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservations/${id}/cancellation-summary`, getHeaders())
}
export const cancelReservation = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservations/${id}/cancel`, data, getHeaders())
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

  return axios.patch(`${API_URL}/service_product/update_status/${roomId}`, payload, getHeaders())
}


//find room
export const filterRoom = (id: number, filter: RoomFilterItem): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/service_product/${id}/filter`, filter, getHeaders())
}

//find Refund
export const filterRefund = (
  serviceId: number | null,
  filter: any,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/refund/filter/${serviceId}`, filter, getHeaders())
}

//----- SERVICE API Delete ----//

//delete reservation
export const deleteReservation = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/reservations/${id}`, getHeaders())
}

//delete serviceProduct
export const deleteServiceProduct = async (id: number | null): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.delete(`${API_URL}/service_product/${id}`, getHeaders())
    return response
  } catch (error: any) {
    throw error.response
  }
}

//delete User
export const deleteUser = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/users/${id}`, getHeaders())
}
//delete type product
export const deleteRoomType = (
  id: number | null,
  serviceId: number | null,
): Promise<AxiosResponse<any>> => {
  if (id === null) throw new Error('ID du type de chambre manquant')

  return axios.delete(`${API_URL}/product/${id}`, {
      ...getHeaders(),
    params: {
      service_id: serviceId,
    },
  })
}

export const deleteMovement = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/movement/${id}`, getHeaders())
}

export const deleteProduct = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/prooductService/${id}`, getHeaders())
}

export const deleteCategory = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/stockCategory/${id}`, getHeaders())
}

export const deleteSupplier = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/supplier/${id}`, getHeaders())
}

export const deleteDpt = (id: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->deleteDpt.id', id)
  return axios.delete(`${API_URL}/department/${id}`, getHeaders())
}

export const deleteExpense = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/expenses/${id}`, getHeaders())
}

export const deleteVehicle = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/vehicle/${id}`, getHeaders())
}

export const deleteRoute = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/route/${id}`, getHeaders())
}

/// This is to manae cancel

export const deleteCancellationPolicy = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/cancellation-policies/${id}`, getHeaders())
}
export const getCancellationPolicyById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/cancellation-policies/${id}`, getHeaders())
}
export const getCancellationPolicyByHotelId = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/cancellation-policies/hotel/${id}`, getHeaders())
}

export const insertCancellationPolicy = (datas: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/cancellation-policies `, datas, getHeaders())
}
export const updateCancellationPolicy = (id: number, datas: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/cancellation-policies/${id}`, datas, getHeaders())
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
  if (filters.searchText) {
    if (qs) qs += `&searchText=${filters.searchText}`
    else qs += `?searchText=${filters.searchText}`
  }
  return axios.get(`${API_URL}/tasks_search/filter${qs}`, getHeaders())
}

// --- API Functions ---

/**
 * Fetches all amenity categories for a specific service.
 * @param serviceId The ID of the service.
 * @returns A promise that resolves to an array of amenity categories.
 */
export const getAmenitiesByServiceId = (
  serviceId: number | string,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities-categories/service/${serviceId}`, getHeaders())
}

/**
 * Fetches a single amenity category by its ID.
 * @param id The ID of the amenity category.
 * @returns A promise that resolves to the amenity category.
 */
export const getAmenityCategoryById = (id: number | string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities-categories/${id}`, getHeaders())
}

/**
 * Creates a new amenity category.
 * @param data The data for the new amenity category.
 * @returns A promise that resolves to the newly created amenity category.
 */
export const createAmenityCategory = async (
  data: AmenityCategoryPayload,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenities-categories`, data, getHeaders())
}

/**
 * Updates an existing amenity category.
 * @param id The ID of the amenity category to update.
 * @param data The new data for the amenity category.
 * @returns A promise that resolves to the updated amenity category.
 */
export const updateAmenityCategory = async (
  id: number | string,
  data: AmenityCategoryPayload,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenities-categories/${id}`, data, getHeaders())
}

/**
 * Deletes an amenity category.
 * @param id The ID of the amenity category to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteAmenityCategory = async (id: number | string): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenities-categories/${id}`, getHeaders())
}

/*

 * Fetches all amenity categories for a specific service.
 * @param serviceId The ID of the service.
 * @returns A promise that resolves to an array of amenity categories.
 */
export const getAmenitiesProductByServiceId = (
  serviceId: number | string,
  categoryId: number | string,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/amenity-products/service/${serviceId}/category/${categoryId}`,
    getHeaders(),
  )
}

/**
 * Fetches a single amenity product by its ID.
 * @param id The ID of the amenity product.
 * @returns A promise that resolves to the amenity product.
 */
export const getAmenityProductById = (id: number | string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenity-products/${id}`, getHeaders())
}

/**
 * Creates a new amenity product.
 * @param data The data for the new amenity product.
 * @returns A promise that resolves to the newly created amenity product.
 */
export const createAmenityProduct = async (
  data: AmenityProductPayload,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenity-products`, data, getHeaders())
}

/**
 * Updates an existing amenity product.
 * @param id The ID of the amenity product to update.
 * @param data The new data for the amenity product.
 * @returns A promise that resolves to the updated amenity product.
 */
export const updateAmenityProduct = async (
  id: number | string,
  data: AmenityProductPayload,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenity-products/${id}`, data, getHeaders())
}

/**
 * Deletes an amenity product.
 * @param id The ID of the amenity category to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteAmenityProduct = async (id: number | string): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenity-products/${id}`, getHeaders())
}

export const getAmenityBookingByReservationIdAndServiceId = (
  reservationId: number,
  serviceId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/reservations/${reservationId}/services/${serviceId}/amenity-bookings`,
    getHeaders(),
  )
}
export const getUnPaidAmenityBookingByReservationId = (
  reservationId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservations/${reservationId}/unpaid-amenities`, getHeaders())
}
export const amenitiesPaymentByReservationId = (
  reservationId: number,
  data: any,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservations/${reservationId}/pay-amenities`, data, getHeaders())
}

export const getByAmenityBookingByCategoryId = (
  categoryId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenity-categories/${categoryId}/amenity-bookings`, getHeaders())
}

export const getAmenityBookingById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenity-bookings/${id}`, getHeaders())
}

export const createAmenityBooking = (
  data: CreateAmenityBookingPayload,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenity-bookings`, data, getHeaders())
}

export const updateAmenityBooking = (
  id: number,
  data: UpdateAmenityBookingPayload,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenity-bookings/${id}`, data, getHeaders())
}

export const deleteAmenityBooking = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenity-bookings/${id}`, getHeaders())
}

/**
 * Fetches tasks from the API based on a set of filter criteria.
 * @param {int} [serviceId] -
 * @param {string} [start_date] - (format: 'YYYY-MM-DD').
 * @param {string} [end_date] - (format: 'YYYY-MM-DD').
 * @returns {Promise<Array>} A promise that resolves to an array of task objects.
 */
export const getDailyOccupancyAndReservations = (
  serviceId: number,
  start_date: string,
  end_date: string,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/dashboard/service/${serviceId}/daily-occupancy?start_date=${start_date}&end_date=${end_date}`,
    getHeaders(),
  )
}

//create contract
export const createContract = (contract: IContract): Promise<AxiosResponse<{ id: number }>> => {
  return axios.post(`${API_URL}/employment_contracts`, contract, getHeaders())
}
export const updateContract = (contract: IContract): Promise<AxiosResponse<{ id: number }>> => {
  return axios.put(`${API_URL}/employment_contracts/${contract.contract_id}`, contract, getHeaders())
}
export const terminateContract = (contractId: string): Promise<AxiosResponse<{ id: number }>> => {
  return axios.put(`${API_URL}/employment_contracts/${contractId}/terminate`, {}, getHeaders())
}

//payroll
export const getPayrollsByContractId = (contractId: string): Promise<AxiosResponse<IPayroll[]>> => {
  return axios.get(`${API_URL}/payroll/by-contract/${contractId}`, getHeaders())
}

export const createPayroll = (payload: IPayroll): Promise<AxiosResponse<IPayroll>> => {
  return axios.post(`${API_URL}/payroll`, payload, getHeaders())
}
export const getReservationInvoice = (
  reservationId: string,
): Promise<AxiosResponse<IPayroll[]>> => {
  return axios.get(`${API_URL}/reservations/${reservationId}/invoice`, getHeaders())
}
