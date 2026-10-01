import React, {useState, ChangeEvent, useEffect, useRef} from 'react'
import {useDispatch} from 'react-redux'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import * as Yup from 'yup'
import {Formik, FormikHelpers} from 'formik'
import persian_fa from 'helpers/persian_fa'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import imagee from '_metronic/assets/images/user_male.png'
import {storeGpsCompany} from 'redux/gps_company/company/gpsCompanySlice'
import GpsCompanyCreateModalForm from './GpsCompanyCreateModalForm'

interface GpsCompanyCreateModalProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

interface FormValues {
  company_pa: string
  company_dr: string
  company_en: string
  address: string
  tin: string
  icon: File | null
  attachments: File[]
}

const GpsCompanyCreateModal: React.FC<GpsCompanyCreateModalProps> = ({
  showModal,
  setShowModal,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation()

  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showLoader, setShowLoader] = useState(false)
  const formRef = useRef<any>(null)

  const initialValues: FormValues = {
    company_pa: '',
    company_dr: '',
    company_en: '',
    address: '',
    tin: '',
    icon: null,
    attachments: [],
  }

  const validationSchema = Yup.object().shape({
    company_pa: Yup.string().required(t('validation.required', {name: t('company.company_pa')})),
    company_dr: Yup.string().required(t('validation.required', {name: t('company.company_dr')})),
    company_en: Yup.string().required(t('validation.required', {name: t('company.company_en')})),
    tin: Yup.string().required(t('validation.required', {name: t('company.tin')})),
    icon: Yup.mixed()
      .required(t('validation.required', {name: t('company.icon')}))
      .test('fileType', t('validation.image-only'), (value) => {
        if (!value) return true
        return value && ['image/jpeg', 'image/png'].includes((value as File).type)
      }),
  })

  const handleClose = () => {
    if (formRef.current) {
      formRef.current.resetForm()
    }
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setShowModal(false)
  }

  const handleFulfilledResponse = (response: any) => {
    const {meta, payload} = response

    if (meta.requestStatus === 'fulfilled') {
      setShowLoader(true)
      handleClose()
      setTimeout(() => {
        toast.success(
          <p className='fs-4 fw-bold'>
            {t('global.success', {name: t('company.created-successfully')})}
          </p>
        )
        onSuccess()
        setShowLoader(false)
      }, 300)
    } else {
      toast.error(<p className='fs-4 fw-bold'>{t('validation.required')}</p>)
      setShowLoader(false)
    }
  }

  const handleSubmit = async (values: FormValues, {setSubmitting}: FormikHelpers<FormValues>) => {
    const formDataToSend = new FormData()
    formDataToSend.append('company_pa', values.company_pa)
    formDataToSend.append('company_dr', values.company_dr)
    formDataToSend.append('company_en', values.company_en)
    formDataToSend.append('address', values.address)
    formDataToSend.append('tin', values.tin)
    if (values.icon) {
      formDataToSend.append('icon', values.icon)
    }
    values.attachments.forEach((file, index) => {
      formDataToSend.append(`attachments[${index}]`, file)
    })

    try {
      const response = await dispatch(storeGpsCompany(formDataToSend)).unwrap()
      handleFulfilledResponse({meta: {requestStatus: 'fulfilled'}, payload: response})
    } catch (error) {
      toast.error(<p className='fs-4 fw-bold'>{t('error.failed-tooo-create')}</p>)
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setFieldValue('icon', file)
    }
  }

  useEffect(() => {
    if (!showModal) {
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [showModal])

  return (
    <>
      {showLoader}
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({handleSubmit: formikSubmit, setFieldValue, values, errors, touched, isSubmitting}) => (
          <GpsCompanyCreateModalForm
            showModal={showModal}
            handleClose={handleClose}
            handleSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              formikSubmit()
            }}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => {
              const {name, value} = e.target
              setFieldValue(name, value)
            }}
            handleImageChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleImageChange(e, setFieldValue)
            }
            formData={values}
            loading={isSubmitting}
            fileInputRef={fileInputRef}
            DatePicker={DatePicker}
            persian_fa={persian_fa}
            persian={persian}
            imagePreview={imagePreview || imagee}
            handleDrop={(files: File[]) => {
              setFieldValue('attachments', [...values.attachments, ...files])
            }}
            handleFileRemove={(index: number) => {
              const newFiles = [...values.attachments]
              newFiles.splice(index, 1)
              setFieldValue('attachments', newFiles)
            }}
            fileType={fileType}
            files={values.attachments}
            errors={errors}
            touched={touched}
          />
        )}
      </Formik>
    </>
  )
}

export default GpsCompanyCreateModal
