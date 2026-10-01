export interface Weapon {
  id: number
  number_of_weapons: string
  slip_no: string
  money_amount: string
  slip_date: string
  reason_dismissed: string
  status: number
  company_id: number
  createdBy: string
  createdDepartment: string
  createdLocation: string
  created_location: string
  created_department: string
  deleted_at?: string | null
  created_at: string
  updated_at: string
}

export const defaultWeapon: Weapon = {
  id: 0,
  number_of_weapons: '',
  slip_no: '',
  money_amount: '',
  slip_date: '',
  reason_dismissed: '',
  status: 1,
  company_id: 0,
  createdBy: '',
  createdDepartment: '',
  created_department: '',
  createdLocation: '',
  created_location: '',
  deleted_at: null,
  created_at: '',
  updated_at: '',
}

export interface WeaponView extends Weapon {}

export const defaultWeaponView: WeaponView = {
  ...defaultWeapon,
}
