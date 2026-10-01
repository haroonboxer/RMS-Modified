import React, {useState, useEffect} from 'react'
import {Modal, Form, Button, Row, Col, Spinner} from 'react-bootstrap'
import {Formik, Field, Form as FormikForm, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {FileUploader} from 'react-drag-drop-files'
import {toast} from 'react-toastify'
import {t} from 'i18next'
import type {DateObject} from 'react-multi-date-picker'

interface ContractCreateFormProps {
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

const ContractCreateForm: React.FC<ContractCreateFormProps> = ({
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
    contract_source: Yup.string().required(
      t('validation.required', {name: t('contract.contract_source')})
    ),
    contract_location: Yup.string().required(
      t('validation.required', {name: t('contract.contract_location')})
    ),
    contract_start_date: Yup.date().required(
      t('validation.required', {name: t('contract.contract_start_date')})
    ),
    contract_end_date: Yup.date()
      .required(t('validation.required', {name: t('contract.contract_end_date')}))
      .min(Yup.ref('contract_start_date'), t('contract.end_date_after_start_date')),
    afghan_personal_count: Yup.number()
      .required(t('validation.required', {name: t('contract.afghan_personal_count')}))
      .min(0, t('contract.must_be_positive')),
    external_personal_count: Yup.number()
      .required(t('validation.required', {name: t('contract.ext_personal_count')}))
      .min(0, t('contract.must_be_positive')),
    ammo_count: Yup.number()
      .required(t('validation.required', {name: t('contract.ammo_count')}))
      .min(0, t('contract.must_be_positive')),
    vehical_count: Yup.number()
      .required(t('validation.required', {name: t('contract.vehical_count')}))
      .min(0, t('contract.must_be_positive')),
    walkie_talkie_count: Yup.number()
      .required(t('validation.required', {name: t('contract.walkie_talkie_count')}))
      .min(0, t('contract.must_be_positive')),
    equipments_value: Yup.number()
      .required(t('validation.required', {name: t('contract.equipments_value')}))
      .min(0, t('contract.must_be_positive')),
    other_equipments: Yup.string().nullable(),
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

      if (field === 'contract_start_date') setStartDate(date)
      if (field === 'contract_end_date') setEndDate(date)
    } else {
      setFieldValue(field, '')
      if (field === 'contract_start_date') setStartDate(null)
      if (field === 'contract_end_date') setEndDate(null)
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
        <Modal.Title>{t('contract.create_new_contract')}</Modal.Title>
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
              toast.error(t('contract.error_submitting_form'))
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
                    <Form.Label>{t('contract.contract_source')}</Form.Label>
                    <Field type='text' name='contract_source' className='form-control' />
                    <ErrorMessage name='contract_source' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.contract_location')}</Form.Label>
                    <Field type='text' name='contract_location' className='form-control' />
                    <ErrorMessage
                      name='contract_location'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.contract_start_date')}</Form.Label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      containerStyle={{width: '100%'}}
                      value={startDate}
                      placeholder={t('contract.select_start_date')}
                      style={{width: '100%', height: '38px', fontSize: '1rem'}}
                      onOpenPickNewDate={true}
                      onChange={(date: any) =>
                        handleDateChange(date, 'contract_start_date', setFieldValue)
                      }
                      editable={true}
                      format='YYYY-MM-DD'
                    />
                    <ErrorMessage
                      name='contract_start_date'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.contract_end_date')}</Form.Label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      containerStyle={{width: '100%'}}
                      value={endDate}
                      placeholder={t('contract.select_end_date')}
                      style={{width: '100%', height: '38px', fontSize: '1rem'}}
                      onOpenPickNewDate={true}
                      onChange={(date: any) =>
                        handleDateChange(date, 'contract_end_date', setFieldValue)
                      }
                      editable={true}
                      format='YYYY-MM-DD'
                      minDate={startDate}
                    />
                    <ErrorMessage
                      name='contract_end_date'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.afghan_personal_count')}</Form.Label>
                    <Field
                      type='number'
                      name='afghan_personal_count'
                      className='form-control'
                      min='0'
                    />
                    <ErrorMessage
                      name='afghan_personal_count'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.ext_personal_count')}</Form.Label>
                    <Field
                      type='number'
                      name='external_personal_count'
                      className='form-control'
                      min='0'
                    />
                    <ErrorMessage
                      name='external_personal_count'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.ammo_count')}</Form.Label>
                    <Field type='number' name='ammo_count' className='form-control' min='0' />
                    <ErrorMessage name='ammo_count' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.vehical_count')}</Form.Label>
                    <Field type='number' name='vehical_count' className='form-control' min='0' />
                    <ErrorMessage name='vehical_count' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.walkie_talkie_count')}</Form.Label>
                    <Field
                      type='number'
                      name='walkie_talkie_count'
                      className='form-control'
                      min='0'
                    />
                    <ErrorMessage
                      name='walkie_talkie_count'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.equipments_value')}</Form.Label>
                    <Field type='number' name='equipments_value' className='form-control' min='0' />
                    <ErrorMessage name='equipments_value' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.other_equipments')}</Form.Label>
                    <Field
                      as='textarea'
                      name='other_equipments'
                      className='form-control'
                      rows={3}
                    />
                    <ErrorMessage name='other_equipments' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.attachments')}</Form.Label>
                    <FileUploader
                      multiple
                      handleChange={handleDrop}
                      onDrop={handleDrop}
                      name='file'
                      types={fileType}
                      hoverTitle={t('contract.drop_files_here')}
                      label={t('contract.upload_or_drop_files')}
                      maxSize={4}
                      onTypeError={() => toast.error(t('contract.invalid_file_type'))}
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

              <Modal.Footer className='d-flex justify-content-between'>
                <Button variant='primary' type='submit' disabled={loading || isSubmitting}>
                  {loading ? (
                    <>
                      <Spinner as='span' size='sm' animation='border' role='status' />
                      {t('contract.saving')}
                    </>
                  ) : (
                    t('contract.save')
                  )}
                </Button>
                <Button variant='danger' onClick={handleClose}>
                  {t('contract.close')}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default ContractCreateForm
