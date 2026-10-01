import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import {useFormik, FormikHelpers, FormikProps} from 'formik'
import * as Yup from 'yup'
import WeaponCreateForm from './WeaponCreateForm'
import {defaultWeapon, Weapon} from '../__model'
import {storeWeapon} from 'redux/rms/weapon/weaponSlice'
import type {DateObject} from 'react-multi-date-picker'

interface WeaponCreateProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

const WeaponCreate: React.FC<WeaponCreateProps> = ({showModal, setShowModal, onSuccess}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF']
  const {id} = useParams<{id: string}>()
  const [step, setStep] = useState(1)
  const [weaponDate, setWeaponDate] = useState<DateObject | null>(null)

  const basicInfoValidation = Yup.object().shape({
    number_of_weapons: Yup.string().required(
      t('validation.required', {name: t('weapon.numberOfWeapons')})
    ),
  })

  const detailsValidation = Yup.object().shape({
    slip_no: Yup.string().required(t('validation.required', {name: t('weapon.oizNo')})),
    slip_date: Yup.string().required(t('validation.required', {name: t('weapon.oizDate')})),
    money_amount: Yup.string().required(t('validation.required', {name: t('weapon.amount')})),
  })

  const formik = useFormik<Weapon>({
    initialValues: defaultWeapon,
    validationSchema: step === 1 ? basicInfoValidation : detailsValidation,
    onSubmit: async (values: Weapon, {setSubmitting}: FormikHelpers<Weapon>) => {
      if (step < 2) {
        setStep(step + 1)
        setSubmitting(false)
      } else {
        await handleSubmit(values)
        setSubmitting(false)
      }
    },
    enableReinitialize: true,
  })

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleFileChange = (newFiles: FileList | null) => {
    if (newFiles) {
      const filesArray = Array.from(newFiles)
      handleDrop(filesArray)
    }
  }

  const handleDateChange = (date: DateObject | DateObject[] | null, field: string) => {
    if (date && !Array.isArray(date)) {
      const formattedDate = `${date.year}-${date.month.number}-${date.day}`
      formik.setFieldValue(field, formattedDate)
      if (field === 'slip_date') setWeaponDate(date)
    } else {
      formik.setFieldValue(field, '')
      if (field === 'slip_date') setWeaponDate(null)
    }
  }

  const prevStep = () => setStep(step - 1)

  const handleSubmit = async (values: Weapon) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('number_of_weapons', values.number_of_weapons)
      formData.append('slip_no', values.slip_no)
      formData.append('slip_date', values.slip_date)
      formData.append('money_amount', values.money_amount)
      formData.append('created_department', values.created_department)
      formData.append('created_location', values.created_location)

      if (id) {
        formData.append('company_id', id)
      }

      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })

      await dispatch(storeWeapon(formData)).unwrap()
      toast.success(t('License created successfully!'))
      setShowModal(false)
      onSuccess()
    } catch (error) {
      toast.error(t('Error creating license. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!showModal) {
      setStep(1)
      formik.resetForm()
      setFiles([])
    }
  }, [showModal])

  const RequiredLabel = ({label}: {label: string}) => (
    <span>
      {label} <span className='text-danger'>*</span>
    </span>
  )

  return (
    <WeaponCreateForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      formik={formik as FormikProps<Weapon>}
      step={step}
      weaponDate={weaponDate}
      loading={loading}
      files={files}
      fileType={fileType}
      handleDrop={handleDrop}
      handleFileRemove={handleFileRemove}
      handleFileChange={handleFileChange}
      handleDateChange={handleDateChange}
      prevStep={prevStep}
      RequiredLabel={RequiredLabel}
      t={t}
    />
  )
}

export default WeaponCreate
