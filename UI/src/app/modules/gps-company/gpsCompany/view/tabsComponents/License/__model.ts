export interface License {
  id: number
  license_type: string
  issue_date: string
  validity_date: string
  hanging_date: string
  activity_type: string
  fee: number | string
  bank_account_number: number | string
  status: number
  company_id: string
  created_by: string
  created_department: string
  created_location: string
  deleted_at?: string | null
  created_at: string
  updated_at: string
  ownerName: string
  createdLocation: string
  createdDepartment: string
}

export const defaultLicense: License = {
  id: 0,
  license_type: '',
  issue_date: '',
  validity_date: '',
  hanging_date: '',
  activity_type: '',
  fee: 0,
  bank_account_number: 0,
  status: 1,
  company_id: '',
  created_by: '',
  created_department: '',
  created_location: '',
  created_at: '',
  updated_at: '',
  ownerName: '',
  createdLocation: '',
  createdDepartment: '',
}
