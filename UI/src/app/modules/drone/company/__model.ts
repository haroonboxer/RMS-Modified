export interface Company {
  company_pa: string
  company_dr: string
  company_en: string
  icon: string
  status: string
  reason_dismissed: string
}

export const defaultCompany: Company = {
  company_pa: '',
  company_dr: '',
  company_en: '',
  icon: '',
  reason_dismissed: '',
  status: '0',
}

export interface CompanyView {
  record: {
    company_pa: string
    company_dr: string
    company_en: string
    icon: string
    status: string
    reason_dismissed: string
    createdBy: string
    createdLocation: string
    createdDepartment: string
    created_at: string
  }
}

export const defaultCompanyView: CompanyView = {
  record: {
    company_pa: '',
    company_dr: '',
    company_en: '',
    icon: '',
    reason_dismissed: '',
    status: '0',
    createdBy: '',
    createdLocation: '',
    createdDepartment: '',
    created_at: '',
  },
}
