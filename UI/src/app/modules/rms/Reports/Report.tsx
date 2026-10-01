import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {fetchReport, fetchCompanies} from 'redux/rms/reports/reportSlice'
import {AppDispatch, RootState} from 'redux/store'
import DatePicker, {DateObject} from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import {t} from 'i18next'
import Select, {SingleValue, ActionMeta} from 'react-select'
import makeAnimated from 'react-select/animated'
import persian_fa from 'helpers/persian_fa'

const animatedComponents = makeAnimated()

interface CompanyOption {
  value: string
  label: string
}

interface ReportItem {
  title: string
  value: number | string
}

const toEnglishDigits = (str: string): string =>
  str.replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))

const Report = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {reportIndex, companies, loading, error} = useSelector((state: RootState) => state.report)

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selectedCompany, setSelectedCompany] = useState<SingleValue<CompanyOption>>(null)

  useEffect(() => {
    dispatch(fetchReport({}))
    dispatch(fetchCompanies())
  }, [dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params: any = {}

    if (startDate) params.start_date = toEnglishDigits(startDate)
    if (endDate) params.end_date = toEnglishDigits(endDate)
    if (selectedCompany) params.company_id = selectedCompany.value

    dispatch(fetchReport(params))
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setSelectedCompany(null)
    dispatch(fetchReport({}))
  }

  const handleCompanyChange = (
    newValue: SingleValue<CompanyOption>,
    actionMeta: ActionMeta<CompanyOption>
  ) => {
    setSelectedCompany(newValue)
    const params: any = {}
    if (newValue) {
      params.company_id = newValue.value
    }
    if (startDate) params.start_date = toEnglishDigits(startDate)
    if (endDate) params.end_date = toEnglishDigits(endDate)
    dispatch(fetchReport(params))
  }

  const companyOptions: CompanyOption[] = companies.map((company: any) => ({
    value: company.id.toString(),
    label: company.company_dr,
  }))

  const allReportItems: ReportItem[] = reportIndex?.data
    ? [
        {title: 'تعداد شرکت ها', value: reportIndex.data.total_companies},
        {
          title: 'تعداد شرکت ها در حال انتظار (غیر فعال)',
          value: reportIndex.data.inactive_companies,
        },
        {title: 'تعداد شرکت ها تایید شده (فعال)', value: reportIndex.data.active_companies},
        {title: 'تعداد قرارداد ها', value: reportIndex.data.total_contracts},
        {
          title: 'تعداد قرارداد ها در حال انتظار (غیرفعال)',
          value: reportIndex.data.inactive_contracts,
        },
        {title: 'تعداد قرارداد ها تایید شده (فعال)', value: reportIndex.data.active_contracts},
        {title: 'تعداد قرارداد ها رد شده است', value: reportIndex.data.cancle_contracts},
        {title: 'تعداد قرارداد ها تاریخ تمام شده', value: reportIndex.data.expired_contracts},
        {title: 'تعداد ریس ها', value: reportIndex.data.total_boss},
        {title: 'تعداد ریس ها فعال', value: reportIndex.data.active_boss},
        {title: 'تعداد ریس ها غیرفعال', value: reportIndex.data.inactive_boss},
        {title: 'تعداد معاوین ها', value: reportIndex.data.total_assistant},
        {title: 'تعداد معاوین ها فعال', value: reportIndex.data.active_assistant},
        {title: 'تعداد معاوین ها غیرفعال', value: reportIndex.data.inactive_assistant},
        {title: 'تعداد جواز ها', value: reportIndex.data.total_license},
        {title: 'تعداد جواز ها فعال', value: reportIndex.data.active_license},
        {title: 'تعداد جواز ها غیرفعال', value: reportIndex.data.inactive_license},
        {title: 'تعداد جواز ها تاریخ تمام شده', value: reportIndex.data.expired_license},
        {title: 'تعداد جواز ها رد شده', value: reportIndex.data.cancle_license},
        {title: 'تعداد جواز ها جدید', value: reportIndex.data.new_license},
        {title: 'تعداد جواز ها تمدید', value: reportIndex.data.extend_license},
        {title: 'تعداد جواز ها تجدید', value: reportIndex.data.renew_license},
        {title: 'تعداد کارمند ها', value: reportIndex.data.total_emp},
        {title: 'تعداد کارمند ها فعال', value: reportIndex.data.active_emp},
        {title: 'تعداد کارمند ها غیرفعال', value: reportIndex.data.inactive_emp},
        {title: 'تعداد جدول ها ', value: reportIndex.data.total_table},
        {title: 'تعداد جدول ها در حال انتظار', value: reportIndex.data.inactive_table},
        {title: 'تعداد جدول ها تایید شده', value: reportIndex.data.active_table},
        {title: 'تعداد اسلحه ها ', value: reportIndex.data.total_gun},
        {title: 'تعداد وسایط ها ', value: reportIndex.data.total_veh},
        {title: 'تعداد کارت ها ', value: reportIndex.data.total_cards},
        {title: 'تعداد کارت ها ارسال شده برای چاپ ', value: reportIndex.data.active_cards},
        {title: 'تعداد کارت ها چاپ نشده ', value: reportIndex.data.inactive_cards},
        {title: 'تعداد کارت ها جدید', value: reportIndex.data.new_cards},
        {title: 'تعداد کارت ها تمدید', value: reportIndex.data.extend_cards},
      ]
    : []

  const reportItems = selectedCompany
    ? allReportItems.filter(
        (item) =>
          item.title !== 'تعداد شرکت ها' &&
          item.title !== 'تعداد شرکت ها در حال انتظار (غیر فعال)' &&
          item.title !== 'تعداد شرکت ها تایید شده (فعال)'
      )
    : allReportItems

  return (
    <div className='card mb-5 shadow-lg p-3 bg-body rounded'>
      <div className='card-header'>
        <h3 className='fw-bolder'>
          <i className='fas fa-search text-primary me-2'></i>
          {t('global.list', {name: t('company.report')})}
        </h3>
      </div>
      <div className='card-body'>
        <form onSubmit={handleSubmit} className='row g-3 mb-4'>
          <div className='col-md-3'>
            <label className='form-label'>جستجو به نام کمپنی</label>
            <Select
              className='basic-single'
              classNamePrefix='select'
              isClearable={true}
              isSearchable={true}
              name='company'
              options={companyOptions}
              value={selectedCompany}
              onChange={handleCompanyChange}
              placeholder='کمپنی را انتخاب کنید...'
              noOptionsMessage={() => 'کمپنی موجود نیست'}
              loadingMessage={() => 'در حال بارگذاری...'}
              components={animatedComponents}
              isMulti={false}
              styles={{
                control: (base) => ({
                  ...base,
                  height: '38px',
                  minHeight: '38px',
                }),
              }}
            />
          </div>
          <div className='col-md-2'>
            <label className='form-label'>تاریخ شروع</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={startDate}
              format='YYYY/MM/DD'
              onChange={(date) => {
                if (Array.isArray(date)) return
                const formatted = (date as DateObject)?.format('YYYY/MM/DD')
                setStartDate(formatted || '')
              }}
              containerStyle={{width: '100%', direction: 'rtl'}}
              style={{
                width: '100%',
                height: '38px',
                fontSize: '1.2rem',
                color: '#153a81',
                fontWeight: 'bold',
              }}
              editable={true}
            />
          </div>

          <div className='col-md-2'>
            <label className='form-label'>تاریخ ختم</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={endDate}
              format='YYYY/MM/DD'
              onChange={(date) => {
                if (Array.isArray(date)) return
                const formatted = (date as DateObject)?.format('YYYY/MM/DD')
                setEndDate(formatted || '')
              }}
              containerStyle={{width: '100%', direction: 'rtl'}}
              style={{
                width: '100%',
                height: '38px',
                fontSize: '1.2rem',
                color: '#153a81',
                fontWeight: 'bold',
              }}
              editable={true}
            />
          </div>

          <div className='col-md-2 d-flex align-items-end'>
            <button type='submit' className='btn btn-primary w-100'>
              <i className='fas fa-eye'></i>&nbsp;نمایش راپور
            </button>
          </div>

          <div className='col-md-2 d-flex align-items-end'>
            <button type='button' className='btn btn-warning w-100' onClick={handleReset}>
              <i className='fas fa-undo'></i>&nbsp;بازنشانی
            </button>
          </div>
        </form>

        {loading && (
          <div className='d-flex justify-content-center'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )}
        {error && <p className='text-danger'>Error: {error}</p>}

        {reportItems.length > 0 && (
          <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4'>
            {reportItems.map((item, index) => (
              <div className='col' key={index}>
                <div className='card card-xl-stretch dashboard-item h-100'>
                  <div className='card-header border-0'>
                    <h3 className='card-title fw-bold text-primary'>{item.title}</h3>
                    <div className='card-toolbar'>
                      <span className='badge badge-light-primary fs-2 fw-semibold'>
                        {item.value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Report
