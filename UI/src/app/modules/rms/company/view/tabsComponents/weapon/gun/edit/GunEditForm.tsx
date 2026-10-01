import React from 'react'
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'react-toastify'
import { t } from 'i18next'

interface GunEditFormProps {
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

const GunEditForm: React.FC<GunEditFormProps> = ({
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
  const validationSchema = Yup.object().shape({
    gun_no: Yup.string().required(t('validation.required', { name: t('weapon.gunNumber') })),
    gun_country: Yup.string().required(t('validation.required', { name: t('weapon.country') })),
    taedad_jabeh: Yup.string().required(t('validation.required', { name: t('weapon.taedadJabeh') })),
    gun_type: Yup.string().required(t('validation.required', { name: t('weapon.typeOfGun') })),
    gun_diameter: Yup.string().required(t('validation.required', { name: t('weapon.qatar') })),
  })

  return (
    <Modal show={showModal} onHide={handleClose} size='lg' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('global.edit', { name: t('weapon.gun') })}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && !initialData.id ? (
          <div className='text-center py-5'>
            <Spinner animation='border' variant='primary' />
            <p className='mt-2'>معلومات در حال بارگذاری است...</p>
          </div>
        ) : (
          <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {() => (
              <FormikForm>
                <Row className='mb-3 border-bottom pb-3 align-items-end'>
                  <Col md={4}>
                    <Form.Group className='mb-2'>
                      <Form.Label>{t('weapon.country')}</Form.Label>
                      <Field
                        type='text'
                        name='gun_country'
                        className='form-control form-control-sm'
                      />
                      <ErrorMessage
                        name='gun_country'
                        component='div'
                        className='text-danger small'
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-2'>
                      <Form.Label>{t('weapon.typeOfGun')}</Form.Label>
                      <Field type='text' name='gun_type' className='form-control form-control-sm' />
                      <ErrorMessage name='gun_type' component='div' className='text-danger small' />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-2'>
                      <Form.Label>{t('weapon.gunNumber')}</Form.Label>
                      <Field type='text' name='gun_no' className='form-control form-control-sm' />
                      <ErrorMessage name='gun_no' component='div' className='text-danger small' />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className='mb-2'>
                      <Form.Label>{t('weapon.taedadJabeh')}</Form.Label>
                      <Field
                        type='text'
                        name='taedad_jabeh'
                        className='form-control form-control-sm'
                      />
                      <ErrorMessage
                        name='taedad_jabeh'
                        component='div'
                        className='text-danger small'
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className='mb-2'>
                      <Form.Label>{t('weapon.qatar')}</Form.Label>
                      <Field
                        type='text'
                        name='gun_diameter'
                        className='form-control form-control-sm'
                      />
                      <ErrorMessage
                        name='gun_diameter'
                        component='div'
                        className='text-danger small'
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className='mt-4'>
                  <Col>
                    <h6 className='mb-3'>{t('global.attachments')}</h6>
                    <FileUploader
                      multiple
                      handleChange={handleDrop}
                      name='file'
                      types={fileType}
                      hoverTitle='فایل‌ها را اینجا رها کنید'
                      maxSize={30}
                      label='فایل‌ها را بکشید و رها کنید یا کلیک کنید'
                      onTypeError={() => toast.error('نوع فایل پشتیبانی نمی‌شود')}
                    />

                    {files.length > 0 && (
                      <div className='mt-3'>
                        <ul className='list-unstyled'>
                          {files.map((file, index) => (
                            <li key={index} className='d-flex align-items-center mb-2'>
                              <span className='me-2'>{file.name}</span>
                              <button
                                type='button'
                                className='btn btn-sm btn-danger'
                                onClick={() => handleFileRemove(index)}
                              >
                                <i className='fas fa-times' />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Col>
                </Row>

                <Modal.Footer className='pt-3 justify-content-between'>
                  <Button variant='primary' size='sm' type='submit' disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as='span' size='sm' animation='border' role='status' />
                        <span className='ms-2'>{t('boss.saving')}</span>
                      </>
                    ) : (
                      t('global.update')
                    )}
                  </Button>
                  <Button variant='danger' size='sm' onClick={handleClose}>
                    {t('weapon.close')}
                  </Button>
                </Modal.Footer>
              </FormikForm>
            )}
          </Formik>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default GunEditForm
