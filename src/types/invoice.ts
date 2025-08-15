export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Company {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  siret?: string;
  tva?: string;
}

export interface Customer {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email?: string;
}

export interface Invoice {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  company: Company;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
}