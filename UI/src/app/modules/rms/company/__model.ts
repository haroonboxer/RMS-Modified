export interface Company {
  company_pa: string
  company_dr: string
  company_en: string
  icon: string
  haq_alamatyaz: string
  date_of_issue: string
  date_of_validity: string
  hanging_date: string
  bank_account_number: string
  amount_of_money: string
  status: string
  reason_dismissed: string
}

export const defaultCompany: Company = {
  company_pa: '',
  company_dr: '',
  company_en: '',
  icon: '',
  haq_alamatyaz: '',
  date_of_issue: '',
  date_of_validity: '',
  hanging_date: '',
  bank_account_number: '',
  amount_of_money: '',
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
    haq_alamatyaz: string
    date_of_issue: string
    date_of_validity: string
    hanging_date: string
    bank_account_number: string
    amount_of_money: string
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
    haq_alamatyaz: '',
    date_of_issue: '',
    date_of_validity: '',
    hanging_date: '',
    bank_account_number: '',
    amount_of_money: '',
    reason_dismissed: '',
    status: '0',
    createdBy: '',
    createdLocation: '',
    createdDepartment: '',
    created_at: '',
  },
}
