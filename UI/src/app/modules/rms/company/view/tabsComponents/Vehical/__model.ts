export interface Vehical {
  id: string
  vehical_type: string
  vehical_ownership: string
  vehical_platte_no: string
  vehical_color: string
  engine_no: string
  shasi_no: string
  license_start_date: string
  license_end_date: string
  status: number
  ownerName: string
  created_at: string
  createdLocation: string
  createdDepartment: string
}

export const defaultVehical: Vehical = {
  id: '',
  vehical_type: '',
  vehical_ownership: '',
  vehical_platte_no: '',
  vehical_color: '',
  engine_no: '',
  shasi_no: '',
  license_start_date: '',
  license_end_date: '',
  status: 0,
  ownerName: '',
  created_at: '',
  createdLocation: '',
  createdDepartment: '',
}

