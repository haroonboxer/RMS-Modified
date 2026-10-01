import React from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'react-toastify'
import { t } from 'i18next'

interface GunCreateFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: any) => void
  initialData: any
  loading: boolean
  handleFileRemove: any
  handleDrop: any
  fileType: any
  files: any
}

const GunCreateForm: React.FC<GunCreateFormProps> = ({
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
    guns: Yup.array().of(
      Yup.object().shape({
        gun_no: Yup.string().required(t('validation.required', { name: t('weapon.gunNumber') })),
        gun_country: Yup.string().required(t('validation.required', { name: t('weapon.country') })),
        gun_type: Yup.string().required(t('validation.required', { name: t('weapon.typeOfGun') })),
        gun_diameter: Yup.string().required(t('validation.required', { name: t('weapon.qatar') })),
        taedad_jabeh: Yup.string().required(
          t('validation.required', { name: t('weapon.taedadJabeh') })
        ),
      })
    ),
  })

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('global.add', { name: t('weapon.gun') })}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formik) => (
            <FormikForm>
              <FieldArray name='guns'>
                {({ push, remove }) => (
                  <>
                    {formik.values.guns?.map((gun: any, index: number) => (
                      <Row key={index} className='mb-3 border-bottom pb-3 align-items-end'>
                        <Col md={3}>
                          <Form.Group className='mb-2'>
                            <Form.Label>{t('weapon.country')}</Form.Label>
                            <Field
                              type='text'
                              name={`guns[${index}].gun_country`}
                              className='form-control form-control-sm'
                            />
                            <ErrorMessage
                              name={`guns[${index}].gun_country`}
                              component='div'
                              className='text-danger small'
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className='mb-2'>
                            <Form.Label>{t('weapon.typeOfGun')}</Form.Label>
                            <Field
                              type='text'
                              name={`guns[${index}].gun_type`}
                              className='form-control form-control-sm'
                            />
                            <ErrorMessage
                              name={`guns[${index}].gun_type`}
                              component='div'
                              className='text-danger small'
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group className='mb-2'>
                            <Form.Label>{t('weapon.gunNumber')}</Form.Label>
                            <Field
                              type='text'
                              name={`guns[${index}].gun_no`}
                              className='form-control form-control-sm'
                            />
                            <ErrorMessage
                              name={`guns[${index}].gun_no`}
                              component='div'
                              className='text-danger small'
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group className='mb-2'>
                            <Form.Label>{t('weapon.qatar')}</Form.Label>
                            <Field
                              type='text'
                              name={`guns[${index}].gun_diameter`}
                              className='form-control form-control-sm'
                            />
                            <ErrorMessage
                              name={`guns[${index}].gun_diameter`}
                              component='div'
                              className='text-danger small'
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group className='mb-2'>
                            <Form.Label>{t('weapon.taedadJabeh')}</Form.Label>
                            <Field
                              type='text'
                              name={`guns[${index}].taedad_jabeh`}
                              className='form-control form-control-sm'
                            />
                            <ErrorMessage
                              name={`guns[${index}].taedad_jabeh`}
                              component='div'
                              className='text-danger small'
                            />
                          </Form.Group>
                        </Col>

                        <Col className='d-flex justify-content-end gap-1'>
                          {index > 0 && (
                            <Button
                              variant='danger'
                              size='sm'
                              onClick={() => remove(index)}
                              className='py-0 px-2'
                            >
                              x
                            </Button>
                          )}
                          {index === formik.values.guns.length - 1 && (
                            <Button
                              variant='success'
                              size='sm'
                              onClick={() =>
                                push({
                                  gun_no: '',
                                  gun_type: '',
                                  gun_diameter: '',
                                  taedad_jabeh: '',
                                  gun_country: '',
                                })
                              }
                              className='py-0 px-2'
                            >
                              +
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </FieldArray>

              <Row className='mt-4'>
                <Col>
                  <FileUploader
                    multiple={true}
                    handleChange={handleDrop}
                    onDrop={handleDrop}
                    name='file'
                    types={fileType}
                    required={false}
                    hoverTitle={t('Drop files here')}
                    maxSize={30}
                    label={t('global.attachments')}
                    onTypeError={() => toast.error(t('File type not supported'))}
                    onSizeError={() => toast.error(t('File size too large (max 5MB)'))}
                  />
                  <ul className='small'>
                    {files.map((file: any, index: number) => (
                      <li key={index}>
                        {file.name}
                        <span onClick={() => handleFileRemove(index)}>
                          <i className='fas fa-times text-danger ms-2 cursor-pointer'></i>
                        </span>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>

              <Modal.Footer className='pt-3 justify-content-between'>
                <Button variant='primary' size='sm' type='submit' disabled={loading}>
                  {loading ? t('boss.saving') : t('weapon.save')}
                </Button>
                <Button variant='danger' size='sm' onClick={handleClose}>
                  {t('weapon.close')}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default GunCreateForm
