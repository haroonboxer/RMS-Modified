import React, {useState, useRef, ChangeEvent, FormEvent, useEffect} from 'react'
import CompanyEditModalForm from './CompanyEditModalForm'
import {useTranslation} from 'react-i18next'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import {toast} from 'react-toastify'
import {updateCompany} from 'redux/rms/company/companySlice'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import * as Yup from 'yup'

interface CompanyData {
  id?: string
  company_pa?: string
  company_dr?: string
  company_en?: string
  icon?: string | null
  bank_account_number?: string
  amount_of_money?: string
  haq_alamatyaz?: string
  hanging_date?: string
}

interface FormData {
  company_pa: string
  company_dr: string
  company_en: string
  icon: string | File | null
  bank_account_number: string
  amount_of_money: string
}

const CompanyEditModal: React.FC<{
  showModal: boolean
  handleClose: () => void
  companyData: CompanyData
}> = ({showModal, handleClose, companyData}) => {
  const {t} = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    company_pa: companyData.company_pa || '',
    company_dr: companyData.company_dr || '',
    company_en: companyData.company_en || '',
    icon: companyData.icon || null,
    bank_account_number: companyData.bank_account_number || '',
    amount_of_money: companyData.amount_of_money || '',
  })

  const [haqAlamatyaz, setHaqAlamatyaz] = useState(companyData.haq_alamatyaz || '')
  const [hangingDate, setHangingDate] = useState(companyData.hanging_date || '')
  const [imagePreview, setImagePreview] = useState(companyData.icon || '')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const dispatch = useDispatch<AppDispatch>()

  const validationSchema = Yup.object().shape({
    company_pa: Yup.string().required(t('validation.required', {name: t('company.company_pa')})),
    company_dr: Yup.string().required(t('validation.required', {name: t('company.company_dr')})),
    company_en: Yup.string().required(t('validation.required', {name: t('company.company_en')})),
    haqAlamatyaz: Yup.string().required(t('validation.required', {name: t('company.royalty')})),
    hangingDate: Yup.string().when('haqAlamatyaz', {
      is: 'yes',
      then: Yup.string().required(t('validation.required', {name: t('company.hanging_date')})),
    }),
    bank_account_number: Yup.string().when('haqAlamatyaz', {
      is: 'yes',
      then: Yup.string().required(
        t('validation.required', {name: t('company.bank_account_number')})
      ),
    }),
    amount_of_money: Yup.string().when('haqAlamatyaz', {
      is: 'yes',
      then: Yup.string()
        .required(t('validation.required', {name: t('company.amount_of_money')}))
        .matches(/^\d+$/, t('validation.numbers-only')),
    }),
  })
  useEffect(() => {
    if (!showModal) {
      setFormData({
        company_pa: companyData.company_pa || '',
        company_dr: companyData.company_dr || '',
        company_en: companyData.company_en || '',
        icon: companyData.icon || null,
        bank_account_number: companyData.bank_account_number || '',
        amount_of_money: companyData.amount_of_money || '',
      })
      setHaqAlamatyaz(companyData.haq_alamatyaz || '')
      setHangingDate(companyData.hanging_date || '')
      setImagePreview(companyData.icon || '')
      setFiles([])
      setErrors({})
    }
  }, [showModal, companyData])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData((prev) => ({...prev, [name]: value}))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({...prev, icon: file}))
      setImagePreview(URL.createObjectURL(file))
      if (errors['icon']) {
        setErrors((prev) => {
          const newErrors = {...prev}
          delete newErrors['icon']
          return newErrors
        })
      }
    }
  }

  const handleRoyaltyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setHaqAlamatyaz(e.target.value)
    setErrors((prev) => {
      const newErrors = {...prev}
      delete newErrors['bank_account_number']
      delete newErrors['amount_of_money']
      delete newErrors['hangingDate']
      return newErrors
    })
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await validationSchema.validate(
        {
          ...formData,
          haqAlamatyaz,
          hangingDate,
        },
        {abortEarly: false}
      )

      if (!companyData.id) {
        toast.error(t('error.missing_company_id'))
        return
      }

      setLoading(true)

      const formDataToSend = new FormData()
      formDataToSend.append('id', companyData.id)
      formDataToSend.append('company_pa', formData.company_pa)
      formDataToSend.append('company_dr', formData.company_dr)
      formDataToSend.append('company_en', formData.company_en)

      if (formData.icon) {
        if (formData.icon instanceof File) {
          formDataToSend.append('icon', formData.icon)
        } else if (typeof formData.icon === 'string') {
          formDataToSend.append('icon', formData.icon)
        }
      }

      formDataToSend.append('haq_alamatyaz', haqAlamatyaz)
      formDataToSend.append('hanging_date', hangingDate)
      formDataToSend.append('bank_account_number', formData.bank_account_number)
      formDataToSend.append('amount_of_money', formData.amount_of_money)

      files.forEach((file, index) => {
        formDataToSend.append(`attachments[${index}]`, file)
      })

      await dispatch(updateCompany(formDataToSend)).unwrap()
      toast.success(<p className='fs-4 fw-bold'>{t('company.update_success')}</p>)
      handleClose()
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message
          }
        })
        setErrors(newErrors)
        toast.error(<p className='fs-4 fw-bold'>{t('error.validation_error')}</p>)
      } else {
        console.error('Error updating company:', error)
        toast.error(<p className='fs-4 fw-bold'>{t('error.failed-to-update')}</p>)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CompanyEditModalForm
      showModal={showModal}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleImageChange={handleImageChange}
      handleRoyaltyChange={handleRoyaltyChange}
      formData={formData}
      loading={loading}
      fileInputRef={fileInputRef}
      persian_fa={persian_fa}
      DatePicker={DatePicker}
      persian={persian}
      haqAlamatyaz={haqAlamatyaz}
      imagePreview={imagePreview}
      hangingDate={hangingDate}
      setHangingDate={setHangingDate}
      handleDrop={handleDrop}
      handleFileRemove={handleFileRemove}
      fileType={['JPG', 'PNG', 'PDF']}
      files={files}
      errors={errors}
    />
  )
}

export default CompanyEditModal
