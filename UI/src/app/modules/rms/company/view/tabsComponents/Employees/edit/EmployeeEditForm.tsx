import React, {useEffect, useState} from 'react'
import {Modal, Form, Button, Row, Col} from 'react-bootstrap'
import {Formik, Field, Form as FormikForm, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {provinces} from 'helpers/provincesAndDistrictsJson'
import {FileUploader} from 'react-drag-drop-files'
import {t} from 'i18next'

interface District {
  provincecode: number
  districtcode: string
  label: string
  value: number
  district_pa: string
  name: string
  id: string
}
interface EmployeeEditFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: any) => void
  initialData: any
  loading: boolean
  handleProvinceChange: (provinceId: string) => void
  handleCurrentProvinceChange: (provinceId: string) => void
  selectedDistricts: District[]
  selectedCurrentDistricts: District[]
  handleFileRemove: (index: number) => void
  handleDrop: (fileList: File[]) => void
  fileType: string[]
  files: File[]
}

const EmployeeEditForm: React.FC<EmployeeEditFormProps> = ({
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
    name: Yup.string().required(t('validation.required', {name: t('employee.name')})),
    last_name: Yup.string().required(t('validation.required', {name: t('employee.last_name')})),
    f_name: Yup.string().required(t('validation.required', {name: t('employee.f_name')})),
    g_f_name: Yup.string().required(t('validation.required', {name: t('employee.g_f_name')})),
  })

  const residenceInfoValidation = Yup.object().shape({
    phone: Yup.string()
      .matches(/^\d{10}$/, t('validation.phone'))
      .required(t('validation.required', {name: t('employee.phone')})),
    passport_no: Yup.string().nullable(),
    country: Yup.string().required(t('validation.required', {name: t('employee.country')})),
  })

  const criminalInfoValidation = Yup.object().shape({
    none_criminal_record: Yup.string().required(
      t('validation.required', {name: t('employee.criminalRecordInfo')})
    ),
    none_criminal_record_info: Yup.string().when('none_criminal_record', {
      is: 'yes',
      then: Yup.string().required(
        t('validation.required', {name: t('employee.criminalRecordInfo')})
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
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
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
              actions.validateForm().then((errors) => {
                if (Object.keys(errors).length === 0) {
                  nextStep()
                }
              })
            } else {
              handleSubmit(values)
            }
          }}
          enableReinitialize
        >
          {(formik) => (
            <FormikForm>
              <Row className='mb-4 justify-content-center'>
                <Col md={8} className='d-flex justify-content-center'>
                  <Button
                    variant={step === 1 ? 'primary' : 'outline-primary'}
                    onClick={() => setStep(1)}
                    className='mx-2'
                  >
                    اطلاعات شخصی
                  </Button>
                  <Button
                    variant={step === 2 ? 'primary' : 'outline-primary'}
                    onClick={() => {
                      if (step < 2) {
                        formik.validateForm().then((errors) => {
                          if (Object.keys(errors).length === 0) setStep(2)
                        })
                      } else {
                        setStep(2)
                      }
                    }}
                    className='mx-2'
                  >
                    اطلاعات تماس و اقامت
                  </Button>
                  <Button
                    variant={step === 3 ? 'primary' : 'outline-primary'}
                    onClick={() => {
                      if (step < 3) {
                        formik.validateForm().then((errors) => {
                          if (Object.keys(errors).length === 0) setStep(3)
                        })
                      } else {
                        setStep(3)
                      }
                    }}
                    className='mx-2'
                  >
                    اطلاعات سوابق
                  </Button>
                </Col>
              </Row>
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
                  </Row>

                  {formik.values.country === 'Afghanistan' ||
                  formik.values.country === 'افغانستان' ? (
                    <>
                      <Row className='mt-3'>
                        <Col md={4}>
                          <Form.Group className='mb-3'>
                            <Form.Label>{t('boss.main_province')}</Form.Label>
                            <Field
                              as='select'
                              name='main_province'
                              className='form-control'
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
                            </Field>
                          </Form.Group>
                          <ErrorMessage
                            name='main_province'
                            component='div'
                            className='text-danger'
                          />
                        </Col>

                        <Col md={4}>
                          <Form.Group className='mb-3'>
                            <Form.Label>{t('boss.main_district')}</Form.Label>
                            <Field
                              as='select'
                              name='main_district'
                              className='form-control'
                              disabled={!formik.values.main_province}
                            >
                              <option value=''>{t('boss.select_district')}</option>
                              {selectedDistricts.map((district) => (
                                <option key={district.value} value={district.value}>
                                  {district.label}
                                </option>
                              ))}
                            </Field>
                          </Form.Group>
                          <ErrorMessage
                            name='main_district'
                            component='div'
                            className='text-danger'
                          />
                        </Col>

                        <Col md={4}>
                          <Form.Group className='mb-3'>
                            <Form.Label>{t('boss.main_village')}</Form.Label>
                            <Field type='text' name='main_village' className='form-control' />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className='mt-3'>
                        <Col md={4}>
                          <Form.Group className='mb-3'>
                            <Form.Label>{t('boss.current_province')}</Form.Label>
                            <Field
                              as='select'
                              name='current_province'
                              className='form-control'
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
                            </Field>
                          </Form.Group>
                          <ErrorMessage
                            name='current_province'
                            component='div'
                            className='text-danger'
                          />
                        </Col>

                        <Col md={4}>
                          <Form.Group className='mb-3'>
                            <Form.Label>{t('boss.current_district')}</Form.Label>
                            <Field
                              as='select'
                              name='current_district'
                              className='form-control'
                              disabled={!formik.values.current_province}
                            >
                              <option value=''>{t('boss.select_district')}</option>
                              {selectedCurrentDistricts.map((district) => (
                                <option key={district.value} value={district.value}>
                                  {district.label}
                                </option>
                              ))}
                            </Field>
                          </Form.Group>
                          <ErrorMessage
                            name='current_district'
                            component='div'
                            className='text-danger'
                          />
                        </Col>

                        <Col md={4}>
                          <Form.Group className='mb-3'>
                            <Form.Label>{t('boss.current_village')}</Form.Label>
                            <Field type='text' name='current_village' className='form-control' />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className='mt-2'>
                        <Col md={12} className='text-center'>
                          <Button
                            variant='outline-secondary'
                            onClick={() => {
                              formik.setFieldValue('current_province', formik.values.main_province)
                              formik.setFieldValue('current_district', formik.values.main_district)
                              formik.setFieldValue('current_village', formik.values.main_village)
                              handleCurrentProvinceChange(formik.values.main_province)
                            }}
                            disabled={!formik.values.main_province}
                          >
                            کاپی از آدرس اصلی
                          </Button>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <Row className='mt-3'>
                      <Col md={12}>
                        <Form.Group className='mb-3'>
                          <Form.Label>اطلاعات محل سکونت</Form.Label>
                          <Field
                            as='textarea'
                            name='type_residence_info'
                            className='form-control'
                            rows={3}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
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
                          style={{height: '100px'}}
                        />
                        <ErrorMessage
                          name='none_criminal_record_info'
                          component='div'
                          className='text-danger'
                        />
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={12} className='mt-4'>
                    <Form.Group className='mb-3'>
                      <FileUploader
                        multiple={true}
                        handleChange={handleDrop}
                        name='file'
                        types={fileType}
                        hoverTitle='فایل را اینجا آپلود کنید'
                        dropMessageStyle={{
                          backgroundColor: '#f8f9fa',
                          border: '1px dashed #dee2e6',
                        }}
                      />
                      {files.length > 0 && (
                        <div className='mt-3'>
                          <h6>فایل های انتخاب شده:</h6>
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
                                  حذف
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
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
                      {loading ? t('weapon.duringSave') : t('weapon.save')}
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

export default EmployeeEditForm
