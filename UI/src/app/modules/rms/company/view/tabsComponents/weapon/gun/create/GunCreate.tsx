import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import {Gun} from '../__model'
import {storeGun} from 'redux/rms/gun/gunSlice'
import GunCreateForm from './GunCreateForm'

interface GunCreateProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

const GunCreate: React.FC<GunCreateProps> = ({showModal, setShowModal, onSuccess}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const {WeaponId, CompanyId} = useParams<{WeaponId: string; CompanyId: string}>()
  const [formData, setFormData] = useState({
    guns: [
      {
        gun_no: '',
        gun_type: '',
        gun_diameter: '',
        taedad_jabeh: '',
        gun_country: '',
      },
    ],
  })
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
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
      setFormData({
        guns: [
          {
            gun_no: '',
            gun_type: '',
            gun_diameter: '',
            taedad_jabeh: '',
            gun_country: '',
          },
        ],
      })
      setFiles([])
    }
  }, [showModal])

  const handleSubmit = async (values: {guns: Gun[]}) => {
    setLoading(true)
    try {
      const formData = new FormData()
      values.guns.forEach((gun, gunIndex) => {
        formData.append(`guns[${gunIndex}][gun_no]`, gun.gun_no)
        formData.append(`guns[${gunIndex}][gun_type]`, gun.gun_type || '')
        formData.append(`guns[${gunIndex}][gun_diameter]`, gun.gun_diameter)
        formData.append(`guns[${gunIndex}][taedad_jabeh]`, gun.taedad_jabeh || '')
        formData.append(`guns[${gunIndex}][gun_country]`, gun.gun_country || '')
      })

      if (CompanyId) {
        formData.append('company_id', CompanyId)
      }
      if (WeaponId) {
        formData.append('weapon_id', WeaponId)
      }

      files.forEach((file) => {
        formData.append(`attachments`, file)
      })

      await dispatch(storeGun(formData)).unwrap()
      toast.success(t('Guns created successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error creating guns. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <GunCreateForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      handleSubmit={handleSubmit}
      initialData={formData}
      loading={loading}
      handleDrop={handleDrop}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      files={files}
    />
  )
}

export default GunCreate
