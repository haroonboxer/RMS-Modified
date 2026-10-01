import React, {useState, ChangeEvent, useEffect, useRef} from 'react'
import {useDispatch} from 'react-redux'
import {storeCompany} from 'redux/rms/company/companySlice'
import {AppDispatch} from 'redux/store'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import * as Yup from 'yup'
import {Formik, FormikHelpers} from 'formik'
import CompanyCreateModalForm from './CompanyCreateModalForm'
import persian_fa from 'helpers/persian_fa'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import imagee from '_metronic/assets/images/user_male.png'

interface CompanyCreateModalProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

interface FormValues {
  company_pa: string
  company_dr: string
  company_en: string
  icon: File | null
  haq_alamatyaz: string
  hanging_date: string
  bank_account_number: string
  amount_of_money: string
  attachments: File[]
}

const CompanyCreateModal: React.FC<CompanyCreateModalProps> = ({
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
    icon: null,
    haq_alamatyaz: '',
    hanging_date: '',
    bank_account_number: '',
    amount_of_money: '',
    attachments: [],
  }

  const validationSchema = Yup.object().shape({
    company_pa: Yup.string().required(t('validation.required', {name: t('company.company_pa')})),
    company_dr: Yup.string().required(t('validation.required', {name: t('company.company_dr')})),
    company_en: Yup.string().required(t('validation.required', {name: t('company.company_en')})),
    icon: Yup.mixed()
      .required(t('validation.required', {name: t('company.icon')}))
      .test('fileType', t('validation.image-only'), (value) => {
        if (!value) return true
        return value && ['image/jpeg', 'image/png'].includes((value as File).type)
      }),
    haq_alamatyaz: Yup.string().required(t('validation.required', {name: t('company.royalty')})),
    hanging_date: Yup.string().when('haq_alamatyaz', {
      is: 'yes',
      then: Yup.string().required(t('validation.required', {name: t('company.hanging_date')})),
    }),
    bank_account_number: Yup.string().when('haq_alamatyaz', {
      is: 'yes',
      then: Yup.string().required(
        t('validation.required', {name: t('company.bank_account_number')})
      ),
    }),
    amount_of_money: Yup.string().when('haq_alamatyaz', {
      is: 'yes',
      then: Yup.string()
        .required(t('validation.required', {name: t('company.amount_of_money')}))
        .matches(/^\d+$/, t('validation.numbers-only')),
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
    if (values.icon) {
      formDataToSend.append('icon', values.icon)
    }
    formDataToSend.append('haq_alamatyaz', values.haq_alamatyaz)
    formDataToSend.append('hanging_date', values.hanging_date)
    formDataToSend.append('bank_account_number', values.bank_account_number)
    formDataToSend.append('amount_of_money', values.amount_of_money)

    values.attachments.forEach((file, index) => {
      formDataToSend.append(`attachments[${index}]`, file)
    })

    try {
      const response = await dispatch(storeCompany(formDataToSend)).unwrap()
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
          <CompanyCreateModalForm
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
            handleRoyaltyChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setFieldValue('haq_alamatyaz', e.target.value)
            }}
            formData={values}
            loading={isSubmitting}
            fileInputRef={fileInputRef}
            DatePicker={DatePicker}
            persian_fa={persian_fa}
            persian={persian}
            haqAlamatyaz={values.haq_alamatyaz}
            imagePreview={imagePreview || imagee}
            hangingDate={values.hanging_date}
            setHangingDate={(date: string) => setFieldValue('hanging_date', date)}
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

export default CompanyCreateModal
