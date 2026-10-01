import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Employee } from '../__model'
import { districts } from 'helpers/provincesAndDistrictsJson'
import { useParams } from 'react-router-dom'
import EmployeeEditForm from './EmployeeEditForm'
import { updateEmployee } from 'redux/rms/employees/employeeSlice'

interface District {
  provincecode: number
  districtcode: string
  label: string
  value: number
  district_pa: string
  name: string
  id: string
}

interface EmployeeEditProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  employeeData: Employee & { id: number }
  onSuccess: () => void
}

const EmployeeEdit: React.FC<EmployeeEditProps> = ({
  showModal,
  setShowModal,
  employeeData,
  onSuccess,

}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [selectedDistricts, setSelectedDistricts] = useState<District[]>([])
  const [selectedCurrentDistricts, setSelectedCurrentDistricts] = useState<District[]>([])
  const [formData, setFormData] = useState<Employee & { id: number }>({
    ...employeeData,
  })
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const { id } = useParams<{ id: string }>()

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
    if (employeeData) {
      setFormData({
        ...employeeData,
        main_province: employeeData.main_province || '',
        main_district: employeeData.main_district || '',
        main_village: employeeData.main_village || '',
        current_province: employeeData.current_province || '',
        current_district: employeeData.current_district || '',
        current_village: employeeData.current_village || '',
      })
      if (employeeData.main_province) {
        const mainDistricts = districts
          .filter((district) => String(district.provincecode) === employeeData.main_province)
          .map((district) => ({
            ...district,
            name: district.label,
            id: district.districtcode,
          }))
        setSelectedDistricts(mainDistricts)
      }

      if (employeeData.current_province) {
        const currentDistricts = districts
          .filter((district) => String(district.provincecode) === employeeData.current_province)
          .map((district) => ({
            ...district,
            name: district.label,
            id: district.districtcode,
          }))
        setSelectedCurrentDistricts(currentDistricts)
      }
    }
  }, [employeeData])

  const handleSubmit = async (values: Employee & { id: number }) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('last_name', values.last_name)
      formData.append('f_name', values.f_name || '')
      formData.append('g_f_name', values.g_f_name || '')
      formData.append('phone', values.phone)
      formData.append('country', values.country)
      formData.append('type_residence_info', values.type_residence_info)
      formData.append('none_criminal_record', values.none_criminal_record)
      formData.append('none_criminal_record_info', values.none_criminal_record_info)

      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })

      if (id) {
        formData.append('company_id', id)
      }
      formData.append('main_province', values.main_province || '')
      formData.append('main_district', values.main_district || '')
      formData.append('main_village', values.main_village || '')
      formData.append('current_province', values.current_province || '')
      formData.append('current_district', values.current_district || '')
      formData.append('current_village', values.current_village || '')

      await dispatch(updateEmployee({ id: employeeData.id, formData })).unwrap()

      toast.success(t('Employee Updated successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error while updating Employee. Please try again!'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <EmployeeEditForm
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

export default EmployeeEdit
