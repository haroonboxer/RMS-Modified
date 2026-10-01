import React, {ChangeEvent, useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import {Boss} from '../view/__model'
import BossEditForm from './BossEditForm'
import {updateBoss} from 'redux/rms/boss/bossSlice'
import * as Yup from 'yup'

interface BossEditProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  bossData: Boss
  onSuccess: () => void
}

const BossEdit: React.FC<BossEditProps> = ({showModal, setShowModal, bossData, onSuccess}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const {id} = useParams<{id: string}>()
  const {t} = useTranslation()
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const [formData, setFormData] = useState<Boss>(bossData)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const validationMessages = {
    required: (name: string) => `${name} ${t('boss.is_required')}`,
    max: (name: string) => `${name} ${t('boss.is_too_long')}`,
    required_select: (name: string) => `${t('boss.please_select')} ${name}`,
  }

  const validationSchema = Yup.object().shape({
    name_dr: Yup.string().required(validationMessages.required(t('boss.name_da'))),
    name_en: Yup.string().required(validationMessages.required(t('boss.name_en'))),
    last_name_dr: Yup.string().required(validationMessages.required(t('boss.last_name_da'))),
    last_name_en: Yup.string().required(validationMessages.required(t('boss.last_name_en'))),
    f_name_da: Yup.string().required(validationMessages.required(t('boss.father_name_da'))),
    email: Yup.string()
      .email(t('boss.invalid_email'))
      .required(validationMessages.required(t('boss.email'))),
    phone: Yup.string().required(validationMessages.required(t('boss.phone'))),
    passport_no: Yup.string().required(validationMessages.required(t('boss.passport_no'))),
    country: Yup.string().required(validationMessages.required(t('boss.country'))),
  })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('error.file_too_large'))
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error(t('error.invalid_file_type'))
        return
      }
      setPhotoFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  useEffect(() => {
    if (bossData) {
      setFormData(bossData)
      if (bossData.photo) {
        setImagePreview(bossData.photo as string)
      }
    }
  }, [bossData])

  const handleSubmit = async (values: Boss) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name_dr', values.name_dr)
      formData.append('last_name_dr', values.last_name_dr)
      formData.append('name_en', values.name_en)
      formData.append('last_name_en', values.last_name_en)
      formData.append('f_name_da', values.f_name_da)
      formData.append('email', values.email)
      formData.append('phone', values.phone)
      formData.append('passport_no', values.passport_no)
      formData.append('country', values.country)

      if (values.main_province) formData.append('main_province', values.main_province)
      if (values.main_district) formData.append('main_district', values.main_district)
      if (values.main_village) formData.append('main_village', values.main_village)
      if (values.current_province) formData.append('current_province', values.current_province)
      if (values.current_district) formData.append('current_district', values.current_district)
      if (values.current_village) formData.append('current_village', values.current_village)
      if (values.type_residence_info)
        formData.append('type_residence_info', values.type_residence_info)

      if (photoFile) {
        formData.append('photo', photoFile)
      }

      if (id) {
        formData.append('company_id', id)
      }

      files.forEach((file) => {
        formData.append('attachments[]', file)
      })

      await dispatch(updateBoss({id: bossData.id, formData})).unwrap()
      toast.success(t('boss.Boss_updated_successfully'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error updating Boss. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <BossEditForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      handleSubmit={handleSubmit}
      initialData={formData}
      loading={loading}
      handleFileRemove={handleFileRemove}
      handleImageChange={handleImageChange}
      fileType={fileType}
      handleDrop={handleDrop}
      files={files}
      validationSchema={validationSchema}
      imagePreview={imagePreview}
    />
  )
}

export default BossEdit
