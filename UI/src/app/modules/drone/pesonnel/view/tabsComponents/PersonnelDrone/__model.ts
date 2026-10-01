export interface Boss {
  id: 0
  name_dr: string
  name_en: string
  last_name_dr: string
  last_name_en: string
  f_name_da: string
  email: string
  phone: string
  job: string
  passport_no: string
  photo: string
  country: string
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
  status: string
  reason_dismissed: string
  ownerName: string
  created_at: string
  createdDepartment: string
  createdLocation: string
}

export const defaultBoss: Boss = {
  id: 0,
  name_dr: '',
  name_en: '',
  last_name_dr: '',
  last_name_en: '',
  f_name_da: '',
  email: '',
  phone: '',
  job: '',
  passport_no: '',
  photo: '',
  country: '',
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
  status: '0',
  reason_dismissed: '',
  ownerName: '',
  created_at: '',
  createdDepartment: '',
  createdLocation: '',
}

export interface BossView {
  record: Boss
}

export const defaultBossView: BossView = {
  record: defaultBoss,
}

export interface BossEdit {
  record: Boss
}
export const defaultBossEdit: BossEdit = {
  record: defaultBoss,
}
