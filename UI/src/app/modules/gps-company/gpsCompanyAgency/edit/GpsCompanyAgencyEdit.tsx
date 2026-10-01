import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {Assistant} from '../__model'
import {provinces, districts} from 'helpers/provincesAndDistrictsJson'
import {useParams} from 'react-router-dom'
import GpsCompanyAgencyEditForm from './GpsCompanyAgencyEditForm'
import {updateGpsCompanyAgency} from 'redux/gps_company/gps_company_agency/gpsCompanyAgencySlice'

interface District {
  provincecode: number
  districtcode: string
  label: string
  value: number
  district_pa: string
  name: string
  id: string
}

interface GpsCompanyAgencyEditProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  assistantData: Assistant & {id: number}
  onSuccess: () => void
}

const GpsCompanyAgencyEdit: React.FC<GpsCompanyAgencyEditProps> = ({
  showModal,
  setShowModal,
  assistantData,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Assistant & {id: number}>({
    ...assistantData,
    photo: assistantData.photo || null, // Ensure photo is either a URL or null
  })
  const [selectedDistricts, setSelectedDistricts] = useState<District[]>([])
  const [selectedCurrentDistricts, setSelectedCurrentDistricts] = useState<District[]>([])
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const {id} = useParams<{id: string}>()

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }
  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
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
    if (assistantData) {
      setFormData(assistantData)
      if (assistantData.main_province) {
        const mainDistricts = districts
          .filter(
            (district) => String(district.provincecode) === String(assistantData.main_province)
          )
          .map((district) => ({
            ...district,
            name: district.label,
            id: district.districtcode,
          }))

        setSelectedDistricts(mainDistricts)
      }

      if (assistantData.current_province) {
        const currentDistricts = districts
          .filter(
            (district) => String(district.provincecode) === String(assistantData.current_province)
          )
          .map((district) => ({
            ...district,
            name: district.label,
            id: district.districtcode,
          }))

        setSelectedCurrentDistricts(currentDistricts)
      }
    }
  }, [assistantData])

  const handleSubmit = async (values: Assistant & {id: number}) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name_dr', values.name_dr)
      formData.append('name_pa', values.name_pa || '')
      formData.append('name_en', values.name_en || '')
      formData.append('agency_manager', values.agency_manager || '')
      formData.append('phone', values.phone || '')

      if (id) {
        formData.append('company_id', id)
      }
      if (values.photo !== null && typeof values.photo !== 'string') {
        formData.append('photo', values.photo)
      } else if (typeof values.photo === 'string' && values.photo) {
        formData.append('photo', values.photo)
      } else {
        formData.append('photo', '')
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
      await dispatch(updateGpsCompanyAgency({id: assistantData.id, formData})).unwrap()
      toast.success(t('ریکارد موفقانه تجدید گردید!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error creating assistant. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <GpsCompanyAgencyEditForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      handleSubmit={handleSubmit}
      initialData={formData}
      loading={loading}
      handleProvinceChange={handleProvinceChange}
      handleCurrentProvinceChange={handleCurrentProvinceChange}
      selectedDistricts={selectedDistricts}
      selectedCurrentDistricts={selectedCurrentDistricts}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      handleDrop={handleDrop}
      files={files}
    />
  )
}

export default GpsCompanyAgencyEdit
