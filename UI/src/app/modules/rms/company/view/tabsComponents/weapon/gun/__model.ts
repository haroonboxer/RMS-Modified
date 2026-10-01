export interface Gun {
  id: number
  gun_no: string
  gun_type: string
  gun_diameter: string
  taedad_jabeh: string
  gun_country: string
  attachments?: any[]
  company_id?: number | null
  weapon_id?: number | null
  created_by?: string
  created_department?: string
  created_location?: string
  created_at?: string
  updated_department?: string
  updated_location?: string
}

export const defaultGun: Gun = {
  id: 0,
  gun_no: '',
  gun_type: '',
  gun_diameter: '',
  taedad_jabeh: '',
  gun_country: '',
  company_id: null,
  weapon_id: null,
  created_by: '',
  created_department: '',
  created_location: '',
  created_at: '',
}
