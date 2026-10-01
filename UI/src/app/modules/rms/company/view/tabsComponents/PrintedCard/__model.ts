export interface PrintedCard {
  id: string
  weapons: string
  card_type: string
  project_name_dr: string
  project_name_en: string
  card_perimeter_dr: string
  card_perimeter_en: string
  issued_date: string
  expire_date: string
  status: number
  ownerName: string
  created_at: string
  createdLocation: string
  createdDepartment: string
  mainProvince?: string
}

export const defaultPrintedCard: PrintedCard = {
  id: '',
  weapons: '',
  card_type: '',
  project_name_dr: '',
  project_name_en: '',
  card_perimeter_dr: '',
  card_perimeter_en: '',
  issued_date: '',
  expire_date: '',
  status: 0,
  ownerName: '',
  created_at: '',
  createdLocation: '',
  createdDepartment: '',
}

