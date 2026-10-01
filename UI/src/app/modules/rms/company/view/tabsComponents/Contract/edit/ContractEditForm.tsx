import React from 'react'
import {Modal, Form, Button, Row, Col} from 'react-bootstrap'
import {Formik, Field, Form as FormikForm, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {FileUploader} from 'react-drag-drop-files'
import {t} from 'i18next'

interface EmployeeEditFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: any) => void
  initialData: any
  loading: boolean
  handleFileRemove: (index: number) => void
  handleDrop: (fileList: File[]) => void
  fileType: string[]
  files: File[]
}

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

const ContractEditForm: React.FC<EmployeeEditFormProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  initialData,
  loading,
  handleFileRemove,
  handleDrop,
  fileType,
  files,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('global.edit', {name: t('contract.contract')})}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log('Submitting values:', values)
            handleSubmit(values)
          }}
          enableReinitialize
        >
          {(formik) => (
            <FormikForm onSubmit={formik.handleSubmit}>
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
                    <Field type='text' name='contract_start_date' className='form-control' />
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
                    <Field type='text' name='contract_end_date' className='form-control' />
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
                    <Field type='number' name='afghan_personal_count' className='form-control' />
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
                    <Field type='number' name='external_personal_count' className='form-control' />
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
                    <Field type='number' name='ammo_count' className='form-control' />
                    <ErrorMessage name='ammo_count' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.vehical_count')}</Form.Label>
                    <Field type='number' name='vehical_count' className='form-control' />
                    <ErrorMessage name='vehical_count' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.walkie_talkie_count')}</Form.Label>
                    <Field type='number' name='walkie_talkie_count' className='form-control' />
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
                    <Field type='number' name='equipments_value' className='form-control' />
                    <ErrorMessage name='equipments_value' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.other_equipments')}</Form.Label>
                    <Field
                      as='textarea'
                      style={{height: '100px'}}
                      name='other_equipments'
                      className='form-control'
                    />
                    <ErrorMessage name='other_equipments' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={12} className='mt-4'>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('contract.attachments')}</Form.Label>
                    <FileUploader
                      multiple={true}
                      handleChange={handleDrop}
                      name='file'
                      types={fileType}
                      hoverTitle={t('contract.upload_or_drop_files')}
                      dropMessageStyle={{
                        backgroundColor: '#f8f9fa',
                        border: '1px dashed #dee2e6',
                      }}
                    />
                    {files.length > 0 && (
                      <div className='mt-3'>
                        <h6>{t('contract.attachments')}:</h6>
                        <ul className='list-group'>
                          {files.map((file, index) => (
                            <li
                              key={index}
                              className='list-group-item d-flex justify-content-between align-items-center'
                            >
                              {file.name}
                              <button
                                type='button'
                                className='btn btn-sm btn-outline-danger'
                                onClick={() => handleFileRemove(index)}
                              >
                                {t('global.remove')}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <div className='d-flex justify-content-between'>
                <Button variant='primary' type='submit' disabled={loading}>
                  {loading ? t('contract.saving') : t('contract.save')}
                </Button>
                <Button variant='danger' type='button' onClick={handleClose}>
                  {t('contract.close')}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default ContractEditForm
