import React from 'react'
import {Modal, Form, Button, Row, Col} from 'react-bootstrap'
import {Formik, Field, Form as FormikForm, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {FileUploader} from 'react-drag-drop-files'
import {toast} from 'react-toastify'
import {t} from 'i18next'

interface VehicalEditFormProps {
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

const VehicalEditForm: React.FC<VehicalEditFormProps> = ({
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

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header>
        <Modal.Title>{t('global.edit', {name: t('vehical.vehicals')})}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {() => (
            <FormikForm>
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.vehical_type')}</Form.Label>
                    <Field type='text' name='vehical_type' className='form-control' />
                    <ErrorMessage name='vehical_type' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={4}>
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

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.vehical_platte_no')}</Form.Label>
                    <Field type='text' name='vehical_platte_no' className='form-control' />
                    <ErrorMessage
                      name='vehical_platte_no'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.vehical_color')}</Form.Label>
                    <Field type='text' name='vehical_color' className='form-control' />
                    <ErrorMessage name='vehical_color' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.engine_no')}</Form.Label>
                    <Field type='text' name='engine_no' className='form-control' />
                    <ErrorMessage name='engine_no' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.shasi_no')}</Form.Label>
                    <Field type='text' name='shasi_no' className='form-control' />
                    <ErrorMessage name='shasi_no' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('vehical.license_start_date')}</Form.Label>
                    <Field type='date' name='license_start_date' className='form-control' />
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
                    <Field type='date' name='license_end_date' className='form-control' />
                    <ErrorMessage name='license_end_date' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FileUploader
                    multiple
                    handleChange={handleDrop}
                    onDrop={handleDrop}
                    name='file'
                    types={fileType}
                    required={false}
                    hoverTitle='Upload files'
                    maxSize={4}
                    label='Upload files'
                    onTypeError={() =>
                      toast.error('Only JPEG, PNG, JPG, PDF, DOCX files are allowed.')
                    }
                  />
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>
                        {file.name}{' '}
                        <span onClick={() => handleFileRemove(index)} style={{cursor: 'pointer'}}>
                          <i className='fas fa-times text-danger'></i>
                        </span>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>

              <Modal.Footer className='pt-3 d-flex justify-content-between'>
                <Button variant='primary' type='submit' disabled={loading}>
                  {loading ? t('weapon.duringSave') : t('global.update')}
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

export default VehicalEditForm
