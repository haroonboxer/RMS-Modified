import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ContractCreateForm from './VehicalCreateForm'
import { toast } from 'react-toastify'
import persian_fa from 'helpers/persian_fa'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import { defaultVehical, Vehical } from '../__model'
import { storeVehical } from 'redux/rms/vehical/vehicalSlice'

interface ContractCreateProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

const VehicalCreate: React.FC<ContractCreateProps> = ({ showModal, setShowModal, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Vehical>(defaultVehical)
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOC', 'DOCX']
  const { id } = useParams<{ id: string }>()

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleSubmit = async (values: Vehical) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('vehical_type', values.vehical_type)
      formData.append('vehical_ownership', values.vehical_ownership)
      formData.append('vehical_platte_no', values.vehical_platte_no)
      formData.append('vehical_color', values.vehical_color)
      formData.append('engine_no', values.engine_no)
      formData.append('shasi_no', values.shasi_no)
      formData.append('license_start_date', values.license_start_date)
      formData.append('license_end_date', values.license_end_date)

      if (id) {
        formData.append('company_id', id)
      }

      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })

      await dispatch(storeVehical(formData)).unwrap()
      toast.success(t('Vehical created successfully!'))
      setShowModal(false)
      onSuccess()
      setFiles([])
    } catch (error) {
      toast.error(t('Error creating vehical. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ContractCreateForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      initialData={formData}
      loading={loading}
      handleDrop={handleDrop}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      files={files}
      DatePicker={DatePicker}
      persian_fa={persian_fa}
      persian={persian}
      handleSubmit={handleSubmit} />
  )
}

export default VehicalCreate