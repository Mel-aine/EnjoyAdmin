import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { OptionType,ServiceProductType,ProductOptionType,RoomTypeData,ReservationType,userDataType} from '@/types/option'


const API_URL = import.meta.env.VITE_API_URL as string

// --- Types ---
export interface Option {
  id?: number
  name: string
  description?: string

  // ajoute d'autres champs selon ton modèle
}

export interface CreateRoomData {
  service_id:number
  product_name: string
  product_type:string
  description: string
  // availability:boolean
  status: string
  price: string
}

export interface RoomOptionData {
  service_product_id: number
  option_id: number
  option_type: string
  value:string
}



interface serviceType {
  id: number;
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  website: string;
  logo: string | null;
  images: string[] | null;
  address: {
    text: string;
    lat: number;
    lng: number;
  };
  categoryId: number;
  capacity: number | null;
  facilities: string[];
  policies: string;
  priceRange: string | null;
  paymentMethods: { label: string; value: string }[];
  openings: Record<string, { opening: string; closing: string }>;
  status: 'active' | 'inactive'; // Ajuste selon tes valeurs possibles
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  lastModifiedBy: string | null;
}





// --- Services API get ---
//get les options
export const getOptions = (): Promise<AxiosResponse<{ data: OptionType[] }>> => {
  return axios.get(`${API_URL}/option`)
}
//get les services product by serviceId
export const getServiceProduct = (
  serviceId: number | null
): Promise<AxiosResponse<ServiceProductType[]>> => {
  return axios.get(`${API_URL}/service_product_by_serviceId/${serviceId}`);
};



//get les productOptions
export const getProductOption = (): Promise<AxiosResponse<{ data: ProductOptionType[] }>> => {
  return axios.get(`${API_URL}/production_option`)
}

export const getService = (serviceId?:number | null): Promise<AxiosResponse< any >> => {
  return axios.get(`${API_URL}/services/${serviceId}`)
}

export const getServices = (): Promise<AxiosResponse< any >> => {
  return axios.get(`${API_URL}/services`)
}
//get les services products avc les options et  sans les options en fonctions de l id du services
export const getServiceProductWithOptions = (
  serviceId?: number | null
): Promise<AxiosResponse<{ data: ServiceProductType[] }>> => {
  const url = serviceId
    ? `${API_URL}/service_product_options?serviceId=${serviceId}`
    : `${API_URL}/service_product_options`

  return axios.get(url)
}


export const getTypeProduct = (): Promise<AxiosResponse<{ data: RoomTypeData[] }>> => {
  return axios.get(`${API_URL}/product`);
};

export const getUser = (): Promise<AxiosResponse<{ data: userDataType[] }>> => {
  return axios.get(`${API_URL}/users`);
};
//get reservation by serviceId
export const getReservation = (serviceId: number | null): Promise<AxiosResponse<ReservationType[]>> => {
  return axios.get(`${API_URL}/reservations/${serviceId}`);
};
// get reservation by id
export const getReservationById= (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservations_by_id/${id}`);
};
//get service by id
export const getServiceById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/services/${id}`);
};
//get user by id
export const getUserId= (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/users/${id}`);
};
//get payment
export const  getPayment= (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payment`);
};

export const  getPaymentById= (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payment/${id}`);
};

// --- Services API post ---

//create service product
export const createRoom = (
  roomData: any
): Promise<AxiosResponse<{ id: number }>> => {
  return axios.post(`${API_URL}/service_product`, roomData);
};

//create  product option
export const createRoomOptions = (optionsData: { data: RoomOptionData[] }):Promise<AxiosResponse<any>> => {
     return axios.post(`${API_URL}/production_option`, optionsData);
   };

   //create user
   export const createUser = (userData: any):Promise<AxiosResponse<any>> => {
    return axios.post(`${API_URL}/users`, userData);
  };

//create product type
   export const createRoomType = (roomTypeData:any):Promise<AxiosResponse<any>> => {
    return axios.post(`${API_URL}/product`, roomTypeData);
  };

//create reservation
export const createReservation = (reservationData: any ):Promise<AxiosResponse<any>> => {
    return axios.post(`${API_URL}/reservationswithuser`, reservationData);
};
//create payment
export const createPayment = (paymentData: any ):Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/paymentConfirm`, paymentData);
};

// services/authService.ts

export function auth(credentials: { email: string, password: string ,keepLoggedIn?: boolean}) {
  return axios.post(`${API_URL}/auth`, credentials)
}
export function validateEmail(email: string) {
  return axios.post(`${API_URL}/validateEmail`, { email });
}

export function validatePassword(email: string, password: string) {
  return axios.post(`${API_URL}/validatePassword`, { email, password });
}

//update reservation ou user

export const putReservation= (id: number | null , payload:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/reservations_update/${id}`, payload);
};
//update User
export const updateUser= (id: number | null , userPayload:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/users/${id}`, userPayload);
};

//update room option
export const updateRoomOptions= (id: number | null , optionsPayload:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/product_option/by-service/${id}`, {
    options: optionsPayload
  });;
};

//update room
export const updateRoom = (id: number | null , payload:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/service_product/${id}`, payload);
};
//update type product
export const updateRoomType= (id: number | null , roomTypePayload:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/product/${id}`, roomTypePayload);
};
//delete reservation
export const deleteReservation= (id: number | null ): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/reservations/${id}`);
};

//delete serviceProduct
export const deleteServiceProduct= (id: number | null ): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/service_product/${id}`);
};
//delete User
export const  deleteUser= (id: number | null ): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/users/${id}`);
};
//delete type product
export const  deleteRoomType = (id: number | null ): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/product/${id}`);
};

