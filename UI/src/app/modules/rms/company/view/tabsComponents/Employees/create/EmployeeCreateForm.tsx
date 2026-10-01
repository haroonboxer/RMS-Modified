import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { provinces } from 'helpers/provincesAndDistrictsJson'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'react-toastify'
import { t } from 'i18next'

interface District {
  provincecode: number
  districtcode: string
  label: string
  value: number
  district_pa: string
  name: string
  id: string
}

interface AssistantCreateFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: any) => void
  initialData: any
  loading: boolean
  handleProvinceChange: (provinceId: string) => void
  handleCurrentProvinceChange: (provinceId: string) => void
  selectedDistricts: District[]
  selectedCurrentDistricts: District[]
  handleFileRemove: any
  handleDrop: any
  fileType: any
  files: any
}

const EmployeeCreateForm: React.FC<AssistantCreateFormProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  initialData,
  loading,
  handleProvinceChange,
  handleCurrentProvinceChange,
  selectedDistricts,
  selectedCurrentDistricts,
  handleFileRemove,
  handleDrop,
  fileType,
  files,
}) => {
  const [step, setStep] = useState(1)

  const personalInfoValidation = Yup.object().shape({
    name: Yup.string().required(t('validation.required', { name: t('employee.name') })),
    last_name: Yup.string().required(t('validation.required', { name: t('employee.last_name') })),
    f_name: Yup.string().required(t('validation.required', { name: t('employee.f_name') })),
    g_f_name: Yup.string().required(t('validation.required', { name: t('employee.g_f_name') })),
  })

  const residenceInfoValidation = Yup.object().shape({
    phone: Yup.string()
      .matches(/^\d{10}$/, t('validation.phone'))
      .required(t('validation.required', { name: t('employee.phone') })),
    passport_no: Yup.string().nullable(),
    country: Yup.string().required(t('validation.required', { name: t('employee.country') })),
  })

  const criminalInfoValidation = Yup.object().shape({
    none_criminal_record: Yup.string().required(
      t('validation.required', { name: t('employee.criminalRecordInfo') })
    ),
    none_criminal_record_info: Yup.string().when('none_criminal_record', {
      is: 'yes',
      then: Yup.string().required(
        t('validation.required', { name: t('employee.criminalRecordInfo') })
      ),
    }),
  })

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  useEffect(() => {
    if (!showModal) {
      setStep(1)
    }
  }, [showModal])

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header>
        <Modal.Title>{t('global.add', { name: t('employee.employees') })}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialData}
          validationSchema={
            step === 1
              ? personalInfoValidation
              : step === 2
                ? residenceInfoValidation
                : criminalInfoValidation
          }
          onSubmit={(values, actions) => {
            if (step < 3) {
              nextStep()
            } else {
              handleSubmit(values)
            }
          }}
          enableReinitialize
        >
          {(formik) => (
            <FormikForm>
              {step === 1 && (
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>{t('employee.name')}</Form.Label>
                      <Field type='text' name='name' className='form-control' />
                      <ErrorMessage name='name' component='div' className='text-danger' />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>{t('employee.last_name')}</Form.Label>
                      <Field type='text' name='last_name' className='form-control' />
                      <ErrorMessage name='last_name' component='div' className='text-danger' />
                    </Form.Group>
                  </Col>
                  <br />
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>{t('employee.f_name')}</Form.Label>
                      <Field type='text' name='f_name' className='form-control' />
                      <ErrorMessage name='f_name' component='div' className='text-danger' />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>{t('employee.g_f_name')}</Form.Label>
                      <Field type='text' name='g_f_name' className='form-control' />
                      <ErrorMessage name='g_f_name' component='div' className='text-danger' />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {step === 2 && (
                <>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>{t('employee.phone')}</Form.Label>
                        <Field type='text' name='phone' className='form-control' />
                        <ErrorMessage name='phone' component='div' className='text-danger' />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>{t('employee.country')}</Form.Label>
                        <Field type='text' name='country' className='form-control' />
                        <ErrorMessage name='country' component='div' className='text-danger' />
                      </Form.Group>
                    </Col>
                    <hr className='mb-6 mt-4' />
                  </Row>
                  {formik.values.country && (
                    <>
                      {formik.values.country === 'Afghanistan' ||
                        formik.values.country === 'افغانستان' ? (
                        <div className='row'>
                          <div className='col-md-5'>
                            <div className='form-group mb-3'>
                              <label htmlFor='main_province'>{t('boss.main_province')}</label>
                              <select
                                id='main_province'
                                className='form-control select-2'
                                {...formik.getFieldProps('main_province')}
                                onChange={(e) => {
                                  formik.handleChange(e)
                                  handleProvinceChange(e.target.value)
                                }}
                              >
                                <option value=''>{t('boss.select_province')}</option>
                                {provinces.map((province) => (
                                  <option key={province.value} value={province.value}>
                                    {province.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className='form-group mb-3'>
                              <label htmlFor='main_district'>{t('boss.main_district')}</label>
                              <select
                                id='main_district'
                                className='form-control'
                                {...formik.getFieldProps('main_district')}
                              >
                                <option value=''>{t('boss.select_district')}</option>
                                {selectedDistricts.map((district) => (
                                  <option key={district.value} value={district.value}>
                                    {district.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className='form-group mb-3'>
                              <label htmlFor='main_village'>{t('boss.main_village')}</label>
                              <input
                                id='main_village'
                                type='text'
                                className='form-control'
                                {...formik.getFieldProps('main_village')}
                              />
                            </div>
                          </div>
                          <div className='col-md-2 d-flex align-items-center justify-content-center'>
                            <button
                              type='button'
                              className='btn btn-icon btn-light-primary'
                              onClick={() => {
                                formik.setFieldValue(
                                  'current_province',
                                  formik.values.main_province
                                )
                                formik.setFieldValue(
                                  'current_district',
                                  formik.values.main_district
                                )
                                formik.setFieldValue('current_village', formik.values.main_village)
                                handleCurrentProvinceChange(formik.values.main_province)
                              }}
                              title='Copy from main residence'
                            >
                              <i className='fas fa-arrow-left fs-2'></i>
                            </button>
                          </div>
                          <div className='col-md-5'>
                            <div className='form-group mb-3'>
                              <label htmlFor='current_province'>{t('boss.current_province')}</label>
                              <select
                                id='current_province'
                                className='form-control'
                                {...formik.getFieldProps('current_province')}
                                onChange={(e) => {
                                  formik.handleChange(e)
                                  handleCurrentProvinceChange(e.target.value)
                                }}
                              >
                                <option value=''>{t('boss.select_province')}</option>
                                {provinces.map((province) => (
                                  <option key={province.value} value={province.value}>
                                    {province.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className='form-group mb-3'>
                              <label htmlFor='current_district'>{t('boss.current_district')}</label>
                              <select
                                id='current_district'
                                className='form-control'
                                {...formik.getFieldProps('current_district')}
                              >
                                <option value=''>{t('boss.select_district')}</option>
                                {selectedCurrentDistricts.map((district) => (
                                  <option key={district.value} value={district.value}>
                                    {district.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className='form-group mb-3'>
                              <label htmlFor='current_village'>{t('boss.current_village')}</label>
                              <input
                                id='current_village'
                                type='text'
                                className='form-control'
                                {...formik.getFieldProps('current_village')}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='row'>
                          <div className='col-md-12'>
                            <div className='form-group'>
                              <label htmlFor='type_residence_info'>
                                {t('boss.type_residence_info')}
                              </label>
                              <input
                                id='type_residence_info'
                                type='text'
                                className='form-control'
                                style={{ height: '120px' }}
                                {...formik.getFieldProps('type_residence_info')}
                              />
                              {formik.errors.type_residence_info &&
                                formik.touched.type_residence_info && (
                                  <div className='text-danger'>aaa</div>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {step === 3 && (
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>{t('employee.criminalRecord')}</Form.Label>
                      <Field as='select' name='none_criminal_record' className='form-control'>
                        <option value=''>{t('employee.select')}</option>
                        <option value='yes'>{t('employee.yes')}</option>
                        <option value='no'>{t('employee.no')}</option>
                      </Field>
                      <ErrorMessage
                        name='none_criminal_record'
                        component='div'
                        className='text-danger'
                      />
                    </Form.Group>
                  </Col>
                  {formik.values.none_criminal_record === 'yes' && (
                    <Col md={12}>
                      <Form.Group className='mb-3'>
                        <Form.Label>{t('employee.criminalRecordInfo')}</Form.Label>
                        <Field
                          as='textarea'
                          name='none_criminal_record_info'
                          className='form-control'
                          style={{ height: '100px' }}
                        />
                        <ErrorMessage
                          name='none_criminal_record_info'
                          component='div'
                          className='text-danger'
                        />
                      </Form.Group>
                    </Col>
                  )}
                  <Row className='mt-6'>
                    <Col>
                      <FileUploader
                        multiple={true}
                        handleChange={handleDrop}
                        onDrop={handleDrop}
                        name='file'
                        types={fileType}
                        required={false}
                        hoverTitle='upload files'
                        maxSize={4}
                        label='upload files'
                        onTypeError={(err: any) =>
                          toast.error(<p className='fs-4 fw-bold'>upload</p>)
                        }
                      />
                      <ul>
                        {files.map((file: any, index: number) => (
                          <li key={index}>
                            {file.name}
                            <span onClick={() => handleFileRemove(index)}>
                              <i className='fas fa-times fs-4 text-danger mt-2 ms-2 bg-light-dark shadow cursor-pointer'></i>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Col>
                  </Row>
                </Row>
              )}
              <Modal.Footer className='d-flex justify-content-between'>
                <div>
                  {step < 3 ? (
                    <Button variant='primary' type='submit'>
                      {t('weapon.next')}
                    </Button>
                  ) : (
                    <Button variant='success' type='submit' disabled={loading}>
                      {loading ? t('weapon.duringSave') : t('global.update')}
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
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default EmployeeCreateForm
