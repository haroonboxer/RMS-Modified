import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react'
import CompanyEditModalForm from './CompanyEditModalForm'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import * as Yup from 'yup'
import { updateCompany } from 'redux/drone/company/droneCameraCompanySlice'

interface CompanyData {
  id?: string
  company_pa?: string
  company_dr?: string
  company_en?: string
  address?: string
  tin?: string
  icon?: string | null
}

interface FormData {
  company_pa: string
  company_dr: string
  company_en: string
  address: string
  tin?: string
  icon: string | File | null
}

const CompanyEditModal: React.FC<{
  showModal: boolean
  handleClose: () => void
  companyData: CompanyData
}> = ({ showModal, handleClose, companyData }) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    company_pa: companyData.company_pa || '',
    company_dr: companyData.company_dr || '',
    company_en: companyData.company_en || '',
    address: companyData.address || '',
    tin: companyData.tin || '',
    icon: companyData.icon || null,
  })
  
  const [imagePreview, setImagePreview] = useState(companyData.icon || '')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useDispatch<AppDispatch>()

  const validationSchema = Yup.object().shape({
    company_pa: Yup.string().required(t('validation.required', { name: t('company.company_pa') })),
    company_dr: Yup.string().required(t('validation.required', { name: t('company.company_dr') })),
    company_en: Yup.string().required(t('validation.required', { name: t('company.company_en') })),
    tin: Yup.string().required(t('validation.required', { name: t('company.tin') })),
  })
  useEffect(() => {
    if (!showModal) {
      setFormData({
        company_pa: companyData.company_pa || '',
        company_dr: companyData.company_dr || '',
        company_en: companyData.company_en || '',
        address: companyData.address || '',
        tin: companyData.tin || '',
        icon: companyData.icon || null,
      })
      setImagePreview(companyData.icon || '')
      setFiles([])
      setErrors({})
    }
  }, [showModal, companyData])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, icon: file }))
      setImagePreview(URL.createObjectURL(file))
      if (errors['icon']) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors['icon']
          return newErrors
        })
      }
    }
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
        },
        { abortEarly: false }
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
      formDataToSend.append('address', formData.address)
      formDataToSend.append('tin', formData.tin || '')

      if (formData.icon) {
        if (formData.icon instanceof File) {
          formDataToSend.append('icon', formData.icon)
        } else if (typeof formData.icon === 'string') {
          formDataToSend.append('icon', formData.icon)
        }
      }

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
      formData={formData}
      loading={loading}
      fileInputRef={fileInputRef}
      persian_fa={persian_fa}
      DatePicker={DatePicker}
      persian={persian}
      imagePreview={imagePreview}
      handleDrop={handleDrop}
      handleFileRemove={handleFileRemove}
      fileType={['JPG', 'PNG', 'PDF']}
      files={files}
      errors={errors}
    />
  )
}

export default CompanyEditModal
