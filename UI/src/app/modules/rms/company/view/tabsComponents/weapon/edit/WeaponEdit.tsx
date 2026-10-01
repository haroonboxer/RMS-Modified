import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import {defaultWeapon, Weapon} from '../__model'
import {updateWeapon} from 'redux/rms/weapon/weaponSlice'
import WeaponEditForm from './WeaponEditForm'

interface WeaponEditProps {
  showModal: boolean
  onClose: () => void
  weaponData: Weapon
  onSuccess: () => void
}

const WeaponEdit: React.FC<WeaponEditProps> = ({showModal, onClose, weaponData, onSuccess}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Weapon>({
    ...defaultWeapon,
    id: weaponData.id,
  })
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF']
  const {id} = useParams<{id: string}>()

  const handleDrop = (fileList: File[]) => {
    setFiles((prev) => [...prev, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (weaponData) {
      setFormData(weaponData)
    }
  }, [weaponData])

  const handleSubmit = async (values: Weapon) => {
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('number_of_weapons', values.number_of_weapons.toString())
      formDataToSend.append('slip_no', values.slip_no)
      formDataToSend.append('money_amount', values.money_amount)
      formDataToSend.append('slip_date', values.slip_date)

      if (id) {
        formDataToSend.append('company_id', id)
      }

      files.forEach((file) => {
        formDataToSend.append('attachments[]', file)
      })

      await dispatch(updateWeapon({id: values.id, formData: formDataToSend})).unwrap()
      toast.success(t('weapon.weapon_updated_successfully'))
      onClose()
      onSuccess()
    } catch (error) {
      toast.error(t('weapon.error_updating_weapon'))
      console.error('Update error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <WeaponEditForm
      showModal={showModal}
      handleClose={onClose}
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

export default WeaponEdit
