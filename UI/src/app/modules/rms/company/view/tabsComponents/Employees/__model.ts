
export interface Employee {
  id: string
  name: string
  last_name: string
  f_name: string
  g_f_name: string
  phone: string
  none_criminal_record: string
  none_criminal_record_info: string
  country: string
  type_residence_info: string
  main_province: string
  main_district: string
  main_village: string
  current_province: string
  current_district: string
  current_village: string
  ownerName: string
  created_at: string
  createdLocation: string
  createdDepartment: string
  status: number

  mainProvince?: string
}

export const defaultEmployee: Employee = {
  id: '',
  name: '',
  last_name: '',
  f_name: '',
  g_f_name: '',
  phone: '',
  none_criminal_record: '',
  none_criminal_record_info: '',
  country: '',
  type_residence_info: '',
  main_province: '',
  main_district: '',
  main_village: '',
  current_province: '',
  current_district: '',
  current_village: '',
  ownerName: '',
  created_at: '',
  createdLocation: '',
  createdDepartment: '',
  status: 0,
}