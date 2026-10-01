import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {districts} from 'helpers/provincesAndDistrictsJson'
import {useParams} from 'react-router-dom'
import {storeEmployee} from 'redux/rms/employees/employeeSlice'
import EmployeeCreateForm from './EmployeeCreateForm'
import {defaultEmployee, Employee} from '../__model'

interface District {
  provincecode: number
  districtcode: string
  label: string
  value: number
  district_pa: string
  name: string
  id: string
}

interface EmployeeCreateProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

const EmployeeCreate: React.FC<EmployeeCreateProps> = ({showModal, setShowModal, onSuccess}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Employee>(defaultEmployee)
  const [selectedDistricts, setSelectedDistricts] = useState<District[]>([])
  const [selectedCurrentDistricts, setSelectedCurrentDistricts] = useState<District[]>([])
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG']
  const {id} = useParams<{id: string}>()
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
      setFormData(defaultEmployee)
      setFiles([])
    }
  }, [showModal])

  const handleSubmit = async (values: Employee) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('last_name', values.last_name)
      formData.append('f_name', values.f_name)
      formData.append('g_f_name', values.g_f_name)
      formData.append('phone', values.phone)
      formData.append('none_criminal_record', values.none_criminal_record)
      formData.append('none_criminal_record_info', values.none_criminal_record_info)
      formData.append('country', values.country)
      formData.append('type_residence_info', values.type_residence_info)

      if (id) {
        formData.append('company_id', id)
      }

      formData.append('main_province', values.main_province)
      formData.append('main_district', values.main_district)
      formData.append('main_village', values.main_village)
      formData.append('current_province', values.current_province)
      formData.append('current_district', values.current_district)
      formData.append('current_village', values.current_village)
      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
      await dispatch(storeEmployee(formData)).unwrap()
      toast.success(t('Employee created successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error creating assistant. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <EmployeeCreateForm
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

export default EmployeeCreate
