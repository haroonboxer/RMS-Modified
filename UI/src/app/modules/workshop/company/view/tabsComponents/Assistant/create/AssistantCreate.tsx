import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import AssistantCreateForm from './AssistantCreateForm'
import { Assistant, defaultAssistant } from '../__model'
import { districts } from 'helpers/provincesAndDistrictsJson'
import { useParams } from 'react-router-dom'
import { storeWorkshopAssistant } from 'redux/workshop/assistant/workshopAssistantSlice'

interface District {
  provincecode: number
  districtcode: string
  label: string
  value: number
  district_pa: string
  name: string
  id: string
}

interface AssistantCreateProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

const AssistantCreate: React.FC<AssistantCreateProps> = ({ showModal, setShowModal, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Assistant>(defaultAssistant)
  const [selectedDistricts, setSelectedDistricts] = useState<District[]>([])
  const [selectedCurrentDistricts, setSelectedCurrentDistricts] = useState<District[]>([])
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const { id } = useParams<{ id: string }>()
  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleProvinceChange = (provinceId: string, isCurrentProvince: boolean = false) => {
    const filteredDistricts = districts
      .filter((district) => String(district.provincecode) === provinceId)
      .map((district) => ({
        ...district,
        name: district.label,
        id: district.districtcode,
      }))

    if (isCurrentProvince) {
      setSelectedCurrentDistricts(filteredDistricts)
    } else {
      setSelectedDistricts(filteredDistricts)
    }
  }

  const handleCurrentProvinceChange = (provinceId: string) => {
    handleProvinceChange(provinceId, true)
  }

  useEffect(() => {
    if (!showModal) {
      setFormData(defaultAssistant)
      setFiles([])
    }
  }, [showModal])

  const handleSubmit = async (values: Assistant) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name_dr', values.name_dr)
      formData.append('name_en', values.name_en || '')
      formData.append('last_name_dr', values.last_name_dr)
      formData.append('last_name_en', values.last_name_en || '')
      formData.append('f_name_da', values.f_name_da || '')
      formData.append('email', values.email)
      formData.append('phone', values.phone)
      formData.append('passport_no', values.passport_no || '')
      formData.append('country', values.country)
      formData.append('type_residence_info', values.type_residence_info || '')

      if (values.photo !== null && typeof values.photo !== 'string') {
        formData.append('photo', values.photo)
      } else if (typeof values.photo === 'string' && values.photo) {
        formData.append('photo', values.photo)
      } else {
        formData.append('photo', '')
      }
      if (id) {
        formData.append('company_id', id)
      }
      formData.append('main_province', values.main_province || '')
      formData.append('main_district', values.main_district || '')
      formData.append('main_village', values.main_village || '')
      formData.append('current_province', values.current_province || '')
      formData.append('current_district', values.current_district || '')
      formData.append('current_village', values.current_village || '')
      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
      await dispatch(storeWorkshopAssistant(formData)).unwrap()
      toast.success(t('Assistant created successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error creating assistant. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AssistantCreateForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      handleSubmit={handleSubmit}
      initialData={formData}
      loading={loading}
      handleProvinceChange={handleProvinceChange}
      handleCurrentProvinceChange={handleCurrentProvinceChange}
      selectedDistricts={selectedDistricts}
      selectedCurrentDistricts={selectedCurrentDistricts}
      handleDrop={handleDrop}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      files={files}
    />
  )
}

export default AssistantCreate
