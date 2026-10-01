import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  FormControl,
  FormGroup,
  FormLabel,
} from 'react-bootstrap'
import { DateObject } from 'react-multi-date-picker'
import { FileUploader } from 'react-drag-drop-files'
import { Weapon } from '../__model'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import DatePicker from 'react-multi-date-picker'

interface WeaponEditFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: Weapon) => Promise<void>
  initialData: Weapon
  loading: boolean
  handleDrop: (files: File[]) => void
  handleFileRemove: (index: number) => void
  fileType: string[]
  files: File[]
}

const WeaponEditForm: React.FC<WeaponEditFormProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  initialData,
  loading,
  handleDrop,
  handleFileRemove,
  fileType,
  files,
}) => {
  const { t } = useTranslation()
  const [licenseDate, setLicenseDate] = useState<DateObject | null>(null)
  const [step, setStep] = useState<number>(1)

  const validationSchema = Yup.object().shape({
    slip_no: Yup.string().required(t('validation.required', { name: t('weapon.oizNo') })),
    slip_date: Yup.string().required(t('validation.required', { name: t('weapon.oizDate') })),
    money_amount: Yup.string().required(t('validation.required', { name: t('weapon.amount') })),
  })

  const formik = useFormik({
    initialValues: initialData,
    validationSchema,
    onSubmit: async (values) => {
      if (step < 2) {
        setStep(step + 1)
        return
      }
      await handleSubmit(values)
    },
    enableReinitialize: true,
  })

  const handleDateChange = (date: DateObject | DateObject[] | null, field: string) => {
    if (date && !Array.isArray(date)) {
      const formattedDate = `${date.year}-${date.month.number}-${date.day}`
      formik.setFieldValue(field, formattedDate)
      if (field === 'slip_date') setLicenseDate(date)
    } else {
      formik.setFieldValue(field, '')
      if (field === 'slip_date') setLicenseDate(null)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  useEffect(() => {
    if (showModal && initialData.slip_date) {
      const parts = initialData.slip_date.split('-')
      if (parts.length === 3) {
        setLicenseDate(
          new DateObject({
            year: parseInt(parts[0]),
            month: parseInt(parts[1]),
            day: parseInt(parts[2]),
            calendar: persian,
          })
        )
      }
    }
    if (showModal) {
      setStep(1)
    }
  }, [showModal, initialData])

  useEffect(() => {
    if (!showModal) {
      formik.resetForm()
      setLicenseDate(null)
    }
  }, [showModal])

  const RequiredLabel = ({ label }: { label: string }) => (
    <span>
      {label} <span className='text-danger'>*</span>
    </span>
  )

  return (
    <Modal show={showModal} onHide={handleClose} size='lg' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('global.edit', { name: t('weapon.weap') })}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          {step === 1 && (
            <Row>
              <Col md={6}>
                <FormGroup className='mb-3'>
                  <FormLabel>
                    <RequiredLabel label={t('global.edit', { name: t('weapon.weap') })} />
                  </FormLabel>
                  <FormControl
                    type='number'
                    name='number_of_weapons'
                    value={formik.values.number_of_weapons}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(formik.touched.number_of_weapons && formik.errors.number_of_weapons)
                    }
                    min={1}
                  />
                  {formik.touched.number_of_weapons && formik.errors.number_of_weapons && (
                    <FormControl.Feedback type='invalid'>
                      {formik.errors.number_of_weapons}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
          )}

          {step === 2 && (
            <Row>
              <Col md={6}>
                <FormGroup className='mb-3'>
                  <FormLabel>
                    <RequiredLabel label={t('weapon.oizNo')} />
                  </FormLabel>
                  <FormControl
                    type='text'
                    name='slip_no'
                    value={formik.values.slip_no}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.slip_no && formik.errors.slip_no)}
                  />
                  {formik.touched.slip_no && formik.errors.slip_no && (
                    <FormControl.Feedback type='invalid'>
                      {formik.errors.slip_no}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='mb-3'>
                  <FormLabel>
                    <RequiredLabel label={t('weapon.oizDate')} />
                  </FormLabel>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    containerStyle={{ width: '100%' }}
                    value={licenseDate}
                    onChange={(date: DateObject | DateObject[] | null) =>
                      handleDateChange(date, 'slip_date')
                    }
                    placeholder={t('weapon.oizDate')}
                    style={{
                      width: '100%',
                      height: '38px',
                      boxSizing: 'border-box',
                      fontSize: '1rem',
                    }}
                    type='search'
                    onOpenPickNewDate={false}
                    editable={true}
                    format='YYYY-MM-DD'
                  />
                  {formik.touched.slip_date && formik.errors.slip_date && (
                    <div className='text-danger' style={{ fontSize: '0.875em' }}>
                      {formik.errors.slip_date}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='mb-3'>
                  <FormLabel>
                    <RequiredLabel label={t('weapon.amount')} />
                  </FormLabel>
                  <FormControl
                    type='text'
                    name='money_amount'
                    value={formik.values.money_amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.money_amount && formik.errors.money_amount)}
                  />
                  {formik.touched.money_amount && formik.errors.money_amount && (
                    <FormControl.Feedback type='invalid'>
                      {formik.errors.money_amount}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup className='mb-3'>
                  <FormLabel>{t('global.attachments')}</FormLabel>
                  <FileUploader
                    multiple={true}
                    handleChange={handleDrop}
                    onDrop={handleDrop}
                    name='file'
                    types={fileType}
                    required={false}
                    hoverTitle={t('file_upload.drag_drop_or_click')}
                    maxSize={30}
                    label={t('file_upload.drag_drop_or_click')}
                  />
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className='d-flex align-items-center justify-content-between mb-2'
                    >
                      <span className='text-truncate' style={{ maxWidth: '300px' }}>
                        {file.name}
                      </span>
                      <button
                        type='button'
                        className='btn btn-icon btn-sm btn-danger'
                        onClick={() => handleFileRemove(index)}
                      >
                        <i className='fas fa-times' />
                      </button>
                    </div>
                  ))}
                  <small className='text-muted'>
                    {t('file_upload.supported_formats')}: {fileType.join(', ')}.{' '}
                    {t('file_upload.max_size')}: 5MB
                  </small>
                </FormGroup>
              </Col>
            </Row>
          )}
        </Modal.Body>

        <Modal.Footer className='d-flex justify-content-between'>
          <div>
            {step < 2 ? (
              <Button variant='primary' type='submit'>
                {t('weapon.next')}
              </Button>
            ) : (
              <Button variant='success' type='submit' disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as='span'
                      size='sm'
                      animation='border'
                      role='status'
                      aria-hidden='true'
                    />
                    {t('weapon.duringSave')}
                  </>
                ) : (
                  t('global.save')
                )}
              </Button>
            )}
          </div>
          <div>
            {step > 1 && (
              <Button variant='secondary' onClick={prevStep} className='me-2'>
                {t('weapon.previous')}
              </Button>
            )}
            <Button variant='danger' onClick={handleClose}>
              {t('weapon.close')}
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default WeaponEditForm
