export interface BaseMenuItem {
  icon: any;
  name: string;
  roles: number[];
}

export interface MenuLink extends BaseMenuItem {
  path: string;
  subItems?: undefined;
}

export interface MenuGroup extends BaseMenuItem {
  subItems: MenuItem[];
  path?: undefined;
}

type MenuItem = MenuLink | MenuGroup;

export interface MenuGroupWrapper {
  title: string;
  items: MenuItem[];
}

export interface IDepartement {
  id?: string;
  name: string;
  description: string;
  manager: number;
  employeeCount: number;
  status: string;
}

export interface IContract {
  "employee_id": number,
  "probation_start_date": string,
  "probation_end_date": string,
  "contract_start_date": string,
  "contract_end_date": string,
  "base_salary": number,
  "special_conditions": string,
  "status": 'Active' | 'Terminated' | 'Suspended',
  "contract_file_path": string
  "is_cdi": boolean,
  "contract_id"?: string,
}

export interface IContractFormData {
  probation_start_date: string
  probation_start_date_error?: string

  probation_end_date: string
  probation_end_date_error?: string

  contract_start_date: string
  contract_start_date_error?: string

  contract_end_date: string
  contract_end_date_error?: string

  base_salary: number
  base_salary_error?: string

  special_conditions: string
  special_conditions_error?: string

  status: 'Active' | 'Terminated' | 'Suspended'
  status_error?: string

  contract_file_path: File | null
  contract_file_path_error?: string

  is_cdi: boolean
  is_cdi_error?: string
}

export interface IPayroll {
  contract_id: number;
  month_year: string;
  gross_salary: number;
  normal_hours: number;
  overtime_hours: number;
  overtime_pay: number;
  bonuses: number;
  allowances: number;
  cnps_contributions: number;
  withheld_taxes: number;
  net_salary: number;
  rib_employe: string;
  payslip_file_path: string;
}

export interface IPayrollFormData {
  payrollId: number
  payrollId_error?: string

  contractId: number
  contractId_error?: string

  monthYear: string
  monthYear_error?: string

  grossSalary: number
  grossSalary_error?: string

  normalHours: number
  normalHours_error?: string

  overtimeHours: number
  overtimeHours_error?: string

  overtimePay: number
  overtimePay_error?: string

  bonuses: number
  bonuses_error?: string

  allowances: number
  allowances_error?: string

  cnpsContributions: number
  cnpsContributions_error?: string

  withheldTaxes: number
  withheldTaxes_error?: string

  netSalary: number
  netSalary_error?: string

  ribEmploye: string
  ribEmploye_error?: string

  payslipFilePath: string
  payslipFilePath_error?: string

  status: string
  status_error?: string
}

export interface ICreatePayroll {
  contractId: number;
  monthYear: string;
  grossSalary: number;
  normalHours: number;
  overtimeHours: number;
  bonuses: number;
  allowances: number;
}
