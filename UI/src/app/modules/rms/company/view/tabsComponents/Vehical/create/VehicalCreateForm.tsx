import React, {useState, useEffect} from 'react'
import {Modal, Form, Button, Row, Col, Spinner} from 'react-bootstrap'
import {Formik, Field, Form as FormikForm, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {FileUploader} from 'react-drag-drop-files'
import {toast} from 'react-toastify'
import {t} from 'i18next'
import type {DateObject} from 'react-multi-date-picker'

interface VehicalCreateFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: any) => Promise<void>
  initialData: any
  loading: boolean
  handleFileRemove: (index: number) => void
  handleDrop: (files: File[]) => void
  fileType: string[]
  files: File[]
  persian_fa: any
  DatePicker: any
  persian: any
}

const VehicalCreateForm: React.FC<VehicalCreateFormProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  initialData,
  loading,
  handleDrop,
  handleFileRemove,
  fileType,
  files,
  persian_fa,
  DatePicker,
  persian,
}) => {
  const [startDate, setStartDate] = useState<DateObject | null>(null)
  const [endDate, setEndDate] = useState<DateObject | null>(null)

  const validationSchema = Yup.object().shape({
    vehical_type: Yup.string()
      .required(t('vehical.vehical_type_required'))
      .max(50, t('vehical.max_50_chars')),
    vehical_ownership: Yup.string()
      .required(t('vehical.vehical_ownership_required'))
      .max(100, t('vehical.max_100_chars')),
    vehical_platte_no: Yup.string()
      .required(t('vehical.platte_no_required'))
      .min(3, t('vehical.min_3_chars'))
      .max(15, t('vehical.max_15_chars')),
    vehical_color: Yup.string()
      .required(t('vehical.color_required'))
      .max(30, t('vehical.max_30_chars')),
    engine_no: Yup.string()
      .required(t('vehical.engine_no_required'))
      .min(5, t('vehical.min_5_chars'))
      .max(20, t('vehical.max_20_chars')),
    shasi_no: Yup.string()
      .required(t('vehical.shasi_no_required'))
      .min(5, t('vehical.min_5_chars'))
      .max(20, t('vehical.max_20_chars')),
    license_start_date: Yup.date()
      .required(t('vehical.start_date_required'))
      .typeError(t('vehical.invalid_date')),
    license_end_date: Yup.date()
      .required(t('vehical.end_date_required'))
      .min(Yup.ref('license_start_date'), t('vehical.end_date_after_start'))
      .typeError(t('vehical.invalid_date')),
  })

  const handleDateChange = (
    date: DateObject | DateObject[] | null,
    field: string,
    setFieldValue: any
  ) => {
    if (date && !Array.isArray(date)) {
      const formattedDate = `${date.year}-${date.month.number
        .toString()
        .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`
      setFieldValue(field, formattedDate)

      if (field === 'license_start_date') setStartDate(date)
      if (field === 'license_end_date') setEndDate(date)
    } else {
      setFieldValue(field, '')
      if (field === 'license_start_date') setStartDate(null)
      if (field === 'license_end_date') setEndDate(null)
    }
  }

  useEffect(() => {
    if (!showModal) {
      setStartDate(null)
      setEndDate(null)
    }
  }, [showModal])

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('global.add', {name: t('vehical.vehicals')})}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            try {
              await handleSubmit(values)
              handleClose()
            } catch (error) {
              toast.error(t('vehical.error_submitting_form'))
            } finally {
              setSubmitting(false)
            }
          }}
          enableReinitialize
        >
          {({isSubmitting, setFieldValue, handleSubmit}) => (
            <FormikForm>
              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.vehical_type')}</Form.Label>
                    <Field type='text' name='vehical_type' className='form-control' />
                    <ErrorMessage name='vehical_type' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.vehical_ownership')}</Form.Label>
                    <Field type='text' name='vehical_ownership' className='form-control' />
                    <ErrorMessage
                      name='vehical_ownership'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.vehical_platte_no')}</Form.Label>
                    <Field type='text' name='vehical_platte_no' className='form-control' min='0' />
                    <ErrorMessage
                      name='vehical_platte_no'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.vehical_color')}</Form.Label>
                    <Field type='text' name='vehical_color' className='form-control' min='0' />
                    <ErrorMessage name='vehical_color' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.engine_no')}</Form.Label>
                    <Field type='text' name='engine_no' className='form-control' min='0' />
                    <ErrorMessage name='engine_no' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.shasi_no')}</Form.Label>
                    <Field type='text' name='shasi_no' className='form-control' min='0' />
                    <ErrorMessage name='shasi_no' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.license_start_date')}</Form.Label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      containerStyle={{width: '100%'}}
                      value={startDate}
                      placeholder={t('vehical.select_start_date')}
                      style={{width: '100%', height: '38px', fontSize: '1rem'}}
                      onOpenPickNewDate={true}
                      onChange={(date: any) =>
                        handleDateChange(date, 'license_start_date', setFieldValue)
                      }
                      editable={true}
                      format='YYYY-MM-DD'
                    />
                    <ErrorMessage
                      name='license_start_date'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.license_end_date')}</Form.Label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      containerStyle={{width: '100%'}}
                      value={endDate}
                      placeholder={t('vehical.select_end_date')}
                      style={{width: '100%', height: '38px', fontSize: '1rem'}}
                      onOpenPickNewDate={true}
                      onChange={(date: any) =>
                        handleDateChange(date, 'license_end_date', setFieldValue)
                      }
                      editable={true}
                      format='YYYY-MM-DD'
                      minDate={startDate}
                    />
                    <ErrorMessage name='license_end_date' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.attachments')}</Form.Label>
                    <FileUploader
                      multiple
                      handleChange={handleDrop}
                      onDrop={handleDrop}
                      name='file'
                      types={fileType}
                      hoverTitle={t('vehical.drop_files_here')}
                      label={t('vehical.upload_or_drop_files')}
                      maxSize={4}
                      onTypeError={() => toast.error(t('vehical.invalid_file_type'))}
                    />
                    <ul className='mt-2'>
                      {files.map((file, index) => (
                        <li key={index} className='d-flex align-items-center'>
                          {file.name}
                          <button
                            type='button'
                            className='btn btn-icon btn-sm ms-2'
                            onClick={() => handleFileRemove(index)}
                          >
                            <i className='fas fa-times text-danger'></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Form.Group>
                </Col>
              </Row>

              <Modal.Footer className='pt-3 d-flex justify-content-between'>
                <Button variant='primary' type='submit' disabled={loading || isSubmitting}>
                  {loading ? (
                    <>
                      <Spinner as='span' size='sm' animation='border' role='status' />
                      {t('vehical.saving')}
                    </>
                  ) : (
                    t('vehical.save')
                  )}
                </Button>
                <Button variant='danger' onClick={handleClose}>
                  {t('vehical.close')}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default VehicalCreateForm
