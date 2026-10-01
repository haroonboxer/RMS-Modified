export interface Assistant {
  id: string
  name_dr: string
  name_pa: string
  name_en: string
  agency_manager: string
  company_id: string
  gpsCompanyName: string
  last_name_en: string
  f_name_da: string
  email: string
  phone: string
  passport_no: string
  country: string
  photo: string | null
  main_province: string
  mainProvince: string
  mainDistrict: string
  main_district: string
  main_village: string
  currentProvince: string
  current_province: string
  current_district: string
  currentDistrict: string
  current_village: string
  type_residence_info: string
  ownerName: string
  created_at: string
  createdLocation: string
  createdDepartment: string
  reason_dismissed: string
  status: number
}

export const defaultAssistant: Assistant = {
  id: '',
  name_dr: '',
  name_pa: '',
  name_en: '',
  agency_manager: '',
  company_id: '',
  gpsCompanyName: '',
  last_name_en: '',
  f_name_da: '',
  email: '',
  phone: '',
  passport_no: '',
  country: '',
  photo: '',
  main_province: '',
  mainProvince: '',
  currentProvince: '',
  main_district: '',
  mainDistrict: '',
  main_village: '',
  current_province: '',
  current_district: '',
  currentDistrict: '',
  current_village: '',
  type_residence_info: '',
  ownerName: '',
  created_at: '',
  createdLocation: '',
  createdDepartment: '',
  status: 0,
  reason_dismissed: '',
}
