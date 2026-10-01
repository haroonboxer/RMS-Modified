export interface Contract {
  id: string
  contract_source: string
  contract_location: string
  contract_start_date: string
  contract_end_date: string
  afghan_personal_count: string
  external_personal_count: string
  ammo_count: string
  vehical_count: string
  walkie_talkie_count: string
  equipments_value: string
  other_equipments: string  
  status: number
  ownerName: string
  created_at: string
  createdLocation: string
  createdDepartment: string
  mainProvince?: string
}

export const defaultContract: Contract = {
  id: '',
  contract_source: '',
  contract_location: '',
  contract_start_date: '',
  contract_end_date: '',
  afghan_personal_count: '',
  external_personal_count: '',
  ammo_count: '',
  vehical_count: '',
  walkie_talkie_count: '',
  equipments_value: '',
  other_equipments: '',
  status: 0,
  ownerName: '',
  created_at: '',
  createdLocation: '',
  createdDepartment: '',
}

