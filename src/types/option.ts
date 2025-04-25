
export interface OptionType {
  id: number;
  optionName: string;
  type: 'select' | 'text' | 'number' | 'picklist';
  values: { label: string; value: string }[];
  isDefault: boolean;
}

export interface ServiceProductType {
  id: number;
  serviceId: number
  productName:string
  productType:string
  price:number
  description: string
  availability: boolean
  customizationAllowed:boolean
  paymentType:string
  status:string
  options:ProductOptionType[];
}

export interface ProductType {
  id: number;
  serviceId: number
  productName:string
  productType:string
  price:number
  description: string
  availability: boolean
  customizationAllowed:boolean
  paymentType:string
  status:string
}

export interface ProductOptionType {
  id: number;
  serviceProductId: number
  optionId:number
  optionPrice:number
  optionType:string
  value: string
  [key: string]: string | number;
}
export interface RoomTypeData{
  name:string
  description : string
  status : string
}

export interface  ReservationType{
  id:number
  // user_id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  role_id: number | null
  service_id: number
  reservation_type: string
  status: string
  total_price: number
  arrived_date:string
  depart_date:string
  reservation_time:string
  reservation_product:number
  comment:string
  created_by: number
  lastModified_by: number
  payment:string
}

// export interface userDataType {
//   id:number
//   firstName: string
//   lastName : string
//   email:string
//   phoneNumber:number
//   roleId:number
// }

export interface userDataType  {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  roleId: number | null
}



