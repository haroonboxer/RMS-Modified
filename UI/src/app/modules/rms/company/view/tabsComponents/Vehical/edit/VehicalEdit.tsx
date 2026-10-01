import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import VehicalEditForm from './VehicalEditForm'
import {updateVehical} from 'redux/rms/vehical/vehicalSlice'
import {Vehical} from '../__model'

interface VehicalEditProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  vehicalData: Vehical & {id: number}
  onSuccess: () => void
}

const VehicalEdit: React.FC<VehicalEditProps> = ({
  showModal,
  setShowModal,
  vehicalData,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()
  const {id: companyId} = useParams<{id: string}>()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Vehical & {id: number}>(vehicalData)
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }
  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  useEffect(() => {
    if (vehicalData) {
      setFormData(vehicalData)
    }
  }, [vehicalData])
  const handleSubmit = async (values: Vehical & {id: number}) => {
    setLoading(true)
    try {
      const formDataObj = new FormData()

      formDataObj.append('vehical_type', values.vehical_type)
      formDataObj.append('vehical_ownership', values.vehical_ownership)
      formDataObj.append('vehical_platte_no', values.vehical_platte_no)
      formDataObj.append('vehical_color', values.vehical_color)
      formDataObj.append('engine_no', values.engine_no)
      formDataObj.append('shasi_no', values.shasi_no)
      formDataObj.append('license_start_date', values.license_start_date)
      formDataObj.append('license_end_date', values.license_end_date)

      if (companyId) {
        formDataObj.append('company_id', companyId)
      }

      files.forEach((file, index) => {
        formDataObj.append(`attachments[${index}]`, file)
      })

      await dispatch(updateVehical({id: vehicalData.id, formData: formDataObj})).unwrap()
      toast.success(t('Vehicle updated successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error updating vehicle. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <VehicalEditForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      handleSubmit={handleSubmit}
      initialData={formData}
      loading={loading}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      handleDrop={handleDrop}
      files={files}
    />
  )
}

export default VehicalEdit
