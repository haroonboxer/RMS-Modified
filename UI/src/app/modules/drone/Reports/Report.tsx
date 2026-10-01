import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'redux/store'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import { t } from 'i18next'
import Select, { SingleValue, ActionMeta } from 'react-select'
import makeAnimated from 'react-select/animated'
import persian_fa from 'helpers/persian_fa'
import axios from 'axios'
import Swal from 'sweetalert2'
import { fetchdroneCameraCompanies, fetchdroneCameraReport } from 'redux/drone/reports/reportSlice'

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
  const { reportIndex, companies, loading, error } = useSelector(
    (state: RootState) => state.droneCameraReport
  )

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selectedCompany, setSelectedCompany] = useState<SingleValue<CompanyOption>>(null)

  useEffect(() => {
    dispatch(fetchdroneCameraReport({}))
    dispatch(fetchdroneCameraCompanies())
  }, [dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params: any = {}

    if (startDate) params.start_date = toEnglishDigits(startDate)
    if (endDate) params.end_date = toEnglishDigits(endDate)
    if (selectedCompany) params.company_id = selectedCompany.value

    dispatch(fetchdroneCameraReport(params))
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setSelectedCompany(null)
    dispatch(fetchdroneCameraReport({}))
  }

  const handleCompanyChange = (
    newValue: SingleValue<CompanyOption>,
    actionMeta: ActionMeta<CompanyOption>
  ) => {
    setSelectedCompany(newValue)

    const params: any = {}
    if (newValue) params.company_id = newValue.value
    if (startDate) params.start_date = toEnglishDigits(startDate)
    if (endDate) params.end_date = toEnglishDigits(endDate)

    dispatch(fetchdroneCameraReport(params))
  }

  const downloadExcel = () => {
    const queryParams = new URLSearchParams()

    if (startDate) queryParams.append('start_date', toEnglishDigits(startDate))
    if (endDate) queryParams.append('end_date', toEnglishDigits(endDate))
    if (selectedCompany) queryParams.append('company_id', selectedCompany.value)

    axios({
      url: `api/DroneCameraReport/generate-report`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      params: Object.fromEntries(queryParams.entries()),
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url

        let fileName = 'drone_report'
        if (selectedCompany) fileName = `${selectedCompany.label}_${fileName}`
        if (startDate && endDate) fileName += `_from_${startDate}_to_${endDate}`

        link.setAttribute('download', `${fileName}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to download Excel file',
        })
      })
  }

  const companyOptions: CompanyOption[] = companies.map((company: any) => ({
    value: company.id.toString(),
    label: company.company_dr,
  }))

  const allReportItems: ReportItem[] = reportIndex?.data
    ? [
      // Companies
      { title: 'تعداد شرکت ها', value: reportIndex.data.total_companies },

      // Licenses
      { title: 'تعداد جواز ها', value: reportIndex.data.total_license },
      { title: 'جواز های فعال', value: reportIndex.data.active_license },
      { title: 'جواز های رد شده', value: reportIndex.data.cancle_license },
      { title: 'جواز های جدید', value: reportIndex.data.new_license },
      { title: 'جواز های تمدید', value: reportIndex.data.extend_license },
      { title: 'جواز های مثنی', value: reportIndex.data.renew_license },
      { title: 'کارت های چاپ شده', value: reportIndex.data.printedCard },

      // Personnel 
      { title: 'تعداد جواز شخصی', value: reportIndex.data.total_personnel },
      { title: 'تعداد جواز شخصی فعال و تایید شده', value: reportIndex.data.active_personnel },
      { title: 'تعداد جواز شخصی در انتظار', value: reportIndex.data.pending_personnel },
      { title: 'تعداد جواز شخصی منقضی شده', value: reportIndex.data.dismissed_personnel },
    ]
    : []

  // Hide company count when filtering by company
  const reportItems = selectedCompany
    ? allReportItems.filter((item) => item.title !== 'تعداد شرکت ها')
    : allReportItems

  return (
    <div className='card mb-5 shadow-lg p-3 bg-body rounded'>
      <div className='card-header'>
        <h3 className='fw-bolder'>
          <i className='fas fa-search text-primary me-2'></i>
          {t('global.list', { name: t('company.report') })}
        </h3>
      </div>

      <div className='card-body'>
        <form onSubmit={handleSubmit} className='row g-3 mb-4'>
          <div className='col-md-3'>
            <label className='form-label'>جستجو به نام شرکت</label>
            <Select<CompanyOption, false>
              className='basic-single'
              classNamePrefix='select'
              isClearable
              isSearchable
              options={companyOptions}
              value={selectedCompany}
              onChange={handleCompanyChange}
              placeholder='شرکت را انتخاب کنید...'
              components={animatedComponents}
            />
          </div>

          <div className='col-md-3'>
            <label className='form-label'>تاریخ شروع</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={startDate}
              format='YYYY/MM/DD'
              onChange={(date) => {
                if (!Array.isArray(date)) {
                  setStartDate((date as DateObject)?.format('YYYY/MM/DD') || '')
                }
              }}
              containerStyle={{ width: '100%', direction: 'rtl' }}
              style={{ width: '100%', height: '38px' }}
            />
          </div>

          <div className='col-md-3'>
            <label className='form-label'>تاریخ ختم</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={endDate}
              format='YYYY/MM/DD'
              onChange={(date) => {
                if (!Array.isArray(date)) {
                  setEndDate((date as DateObject)?.format('YYYY/MM/DD') || '')
                }
              }}
              containerStyle={{ width: '100%', direction: 'rtl' }}
              style={{ width: '100%', height: '38px' }}
            />
          </div>

          <div className='col-md-1 d-flex align-items-end'>
            <button type='submit' className='btn btn-primary w-100'>
              <i className='fas fa-eye'></i>&nbsp;نمایش راپور
            </button>
          </div>
          <div className='col-md-1 d-flex align-items-end'>
            <button type='button' className='btn btn-warning w-100' onClick={handleReset}>
              <i className='fas fa-undo'></i>&nbsp;بازنشانی
            </button>
          </div>
          <div className='col-md-1 d-flex align-items-end'>
            <button type='button' className='btn btn-success w-100' onClick={downloadExcel}>
              <i className='fas fa-file-excel me-2'></i>
              {t('global.excel')}
            </button>
          </div>
        </form>

        {loading && (
          <div className='text-center'>
            <div className='spinner-border text-primary' />
          </div>
        )}

        {error && <p className='text-danger'>Error: {error}</p>}

        {reportItems.length > 0 && (
          <div className='row g-4'>
            {reportItems.map((item, index) => (
              <div className='col-md-3' key={index}>
                <div className='card shadow-sm h-100'>
                  <div className='card-body text-center'>
                    <h6 className='text-muted'>{item.title}</h6>
                    <h3 className='fw-bold text-primary'>{item.value}</h3>
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