import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import {Gun} from '../__model'
import {updateGun} from 'redux/rms/gun/gunSlice'
import GunEditForm from './GunEditForm'

interface GunEditProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  gunData: Gun & {id: number}
  onSuccess: () => void
}

const GunEdit: React.FC<GunEditProps> = ({showModal, setShowModal, gunData, onSuccess}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Gun & {id: number}>({
    ...gunData,
  })
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const {id} = useParams<{id: string}>()
  const {WeaponId, CompanyId} = useParams<{WeaponId: string; CompanyId: string}>()
  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }
  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  useEffect(() => {
    if (gunData) {
      setFormData(gunData)
    }
  }, [gunData])

  const handleSubmit = async (values: Gun & {id: number}) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('gun_country', values.gun_country || '')
      formData.append('gun_no', values.gun_no)
      formData.append('gun_type', values.gun_type || '')
      formData.append('gun_diameter', values.gun_diameter)
      formData.append('taedad_jabeh', values.taedad_jabeh || '')
      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })

      if (CompanyId) formData.append('company_id', CompanyId)
      if (WeaponId) formData.append('weapon_id', WeaponId)

      await dispatch(updateGun({id: gunData.id, formData})).unwrap()

      toast.success(t('Gun updated successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error updating Gun. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <GunEditForm
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

export default GunEdit
