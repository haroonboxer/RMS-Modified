import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import LicenseEditForm from './LicenseEditForm'
import { License } from '../__model'
import { defaultLicense } from '../__model'
import persian_fa from 'helpers/persian_fa'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import { updateLicense } from 'redux/drone/license/droneCameraLicenseSlice'

interface LicenseEditProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  licenseData: License & { id: number }
  onSuccess: () => void
}

const LicenseEdit: React.FC<LicenseEditProps> = ({
  showModal,
  setShowModal,
  licenseData,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<License & { id: number }>({
    ...defaultLicense,
    id: 0,
  })
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF']
  const { id } = useParams<{ id: string }>()

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  useEffect(() => {
    if (licenseData) {
      let fee = 0
      switch (licenseData.license_type) {
        case 'new':
          fee = 20000
          break
        case 'extend':
          fee = 20000
          break
        case 'renew':
          fee = 0
          break
        default:
          fee = Number(licenseData.fee) || 0
      }

      setFormData({
        ...licenseData,
        issue_date: licenseData.issue_date || '',
        validity_date: licenseData.validity_date || '',
        license_type: licenseData.license_type || '',
        fee: fee,
        drone_model: licenseData.drone_model || '',
        drone_sn: licenseData.drone_sn || '',
      })
    }
  }, [licenseData])

  const handleSubmit = async (values: License & { id: number }) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('license_type', values.license_type)
      formData.append('issue_date', values.issue_date)
      formData.append('validity_date', values.validity_date)
      formData.append('hanging_date', values.hanging_date)
      formData.append('bank_account_number', values.bank_account_number.toString())
      formData.append('fee', values.fee.toString())
      formData.append('drone_model', values.drone_model)
      formData.append('drone_sn', values.drone_sn)

      if (id) {
        formData.append('company_id', id)
      }

      files.forEach((file) => {
        formData.append('attachments[]', file)
      })

      await dispatch(updateLicense({ id: licenseData.id, formData })).unwrap()
      toast.success(t('License updated successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error updating license. Please try again.'))
      console.error('Update error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LicenseEditForm
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

export default LicenseEdit
