import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import LicenseCreateForm from './LicenseCreateForm'
import {defaultLicense, License} from '../__model'
import persian_fa from 'helpers/persian_fa'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import {storeLicense} from 'redux/workshop/license/workshopLicenseSlice'

interface LicenseCreateProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

const LicenseCreate: React.FC<LicenseCreateProps> = ({showModal, setShowModal, onSuccess}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<License>(defaultLicense)
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF']
  const {id} = useParams<{id: string}>()

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  useEffect(() => {
    if (!showModal) {
      setFormData(defaultLicense)
      setFiles([])
    }
  }, [showModal])

  const handleSubmit = async (values: License) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('license_type', values.license_type)
      formData.append('issue_date', values.issue_date)
      formData.append('validity_date', values.validity_date)
      formData.append('hanging_date', values.hanging_date)
      formData.append('bank_account_number', values.bank_account_number.toString())
      formData.append('fee', values.fee.toString())

      if (id) {
        formData.append('company_id', id)
      }

      files.forEach((file, index) => {
        formData.append('attachments[]', file)
      })

      await dispatch(storeLicense(formData)).unwrap()
      toast.success(t('License created successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      console.log('===========>>>', error)
      toast.error(t('Error creating license. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <LicenseCreateForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      handleSubmit={handleSubmit}
      initialData={formData}
      loading={loading}
      handleDrop={handleDrop}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      files={files}
      DatePicker={DatePicker}
      persian_fa={persian_fa}
      persian={persian}
    />
  )
}

export default LicenseCreate
