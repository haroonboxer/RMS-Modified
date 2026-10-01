import React from 'react'
import {Modal, Form, Button, Row, Col} from 'react-bootstrap'
import {Formik, Field, Form as FormikForm, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import imagee from '_metronic/assets/images/user_male.png'
import {provinces} from 'helpers/provincesAndDistrictsJson'
import {FileUploader} from 'react-drag-drop-files'
import {toast} from 'react-toastify'
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

const AssistantCreateForm: React.FC<AssistantCreateFormProps> = ({
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
  const validationSchema = Yup.object().shape({
    name_dr: Yup.string().required(t('validation.required', {name: t('assistant.name_dr')})),
    name_en: Yup.string().required(t('validation.required', {name: t('assistant.name_en')})),
    last_name_dr: Yup.string().required(
      t('validation.required', {name: t('assistant.last_name_dr')})
    ),
    last_name_en: Yup.string().required(
      t('validation.required', {name: t('assistant.last_name_en')})
    ),
    f_name_da: Yup.string().required(t('validation.required', {name: t('assistant.fatherName')})),
    email: Yup.string()
      .email(t('validation.email', {name: t('assistant.email')}))
      .required(t('validation.required', {name: t('assistant.email')})),
    phone: Yup.string()
      .matches(/^\d{10}$/, t('validation.phone', {name: t('assistant.phone')}))
      .required(t('validation.required', {name: t('assistant.phone')})),
    passport_no: Yup.string().required(t('validation.required', {name: t('assistant.passportId')})),
    country: Yup.string().required(t('validation.required', {name: t('assistant.country')})),
    main_province: Yup.string().nullable(),
    main_district: Yup.string().nullable(),
    main_village: Yup.string().nullable(),
    current_province: Yup.string().nullable(),
    current_district: Yup.string().nullable(),
    current_village: Yup.string().nullable(),
    photo: Yup.mixed().nullable(),
  })

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header>
        <Modal.Title>{t('global.add', {name: t('assistant.assistantName')})}</Modal.Title>
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
              <Row>
                <Col md={3}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('assistant.name_dr')}</Form.Label>
                    <Field type='text' name='name_dr' className='form-control' />
                    <ErrorMessage name='name_dr' component='div' className='text-danger' />
                  </Form.Group>

                  <Form.Group className='mb-3' style={{marginTop: '25px'}}>
                    <Form.Label>{t('assistant.last_name_en')}</Form.Label>
                    <Field type='text' name='last_name_en' className='form-control' />
                    <ErrorMessage name='last_name_en' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('assistant.last_name_dr')}</Form.Label>
                    <Field type='text' name='last_name_dr' className='form-control' />
                    <ErrorMessage name='last_name_dr' component='div' className='text-danger' />
                  </Form.Group>

                  <Form.Group className='mb-3' style={{marginTop: '25px'}}>
                    <Form.Label>{t('assistant.fatherName')}</Form.Label>
                    <Field type='text' name='f_name_da' className='form-control' />
                    <ErrorMessage name='f_name_da' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('assistant.name_en')}</Form.Label>
                    <Field type='text' name='name_en' className='form-control' />
                    <ErrorMessage name='name_en' component='div' className='text-danger' />
                  </Form.Group>

                  <Form.Group className='mb-3' style={{marginTop: '25px'}}>
                    <Form.Label>{t('assistant.email')}</Form.Label>
                    <Field type='email' name='email' className='form-control' />
                    <ErrorMessage name='email' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Label>{t('assistant.image')}</Form.Label>
                  <br />
                  <label>
                    <input
                      type='file'
                      hidden
                      accept='image/png, image/jpeg'
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          formik.setFieldValue('photo', e.target.files[0])
                        }
                      }}
                    />
                    <img
                      src={formik.values.photo ? URL.createObjectURL(formik.values.photo) : imagee}
                      className='img-fluid img-thumbnail'
                      alt='user-photo'
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        marginRight: '40px',
                      }}
                    />
                  </label>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('assistant.phone')}</Form.Label>
                    <Field type='text' name='phone' className='form-control' />
                    <ErrorMessage name='phone' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('assistant.passportId')}</Form.Label>
                    <Field type='text' name='passport_no' className='form-control' />
                    <ErrorMessage name='passport_no' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('assistant.country')}</Form.Label>
                    <Field type='text' name='country' className='form-control' />
                    <ErrorMessage name='country' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
              </Row>
              {formik.values.country && (
                <>
                  {formik.values.country === 'Afghanistan' ||
                  formik.values.country === 'افغانستان' ? (
                    <>
                      <div className='row'>
                        <div className='col-md-4'>
                          <div className='form-group'>
                            <label htmlFor='main_province'>{t('boss.main_province')}</label>
                            <select
                              id='main_province'
                              className='form-control'
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
                        </div>
                        <div className='col-md-4'>
                          <div className='form-group'>
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
                        </div>
                        <div className='col-md-4'>
                          <div className='form-group'>
                            <label htmlFor='main_village'>{t('boss.main_village')}</label>
                            <input
                              id='main_village'
                              type='text'
                              className='form-control'
                              {...formik.getFieldProps('main_village')}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-4'>
                          <div className='form-group'>
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
                        </div>
                        <div className='col-md-4'>
                          <div className='form-group'>
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
                        </div>
                        <div className='col-md-4'>
                          <div className='form-group'>
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
                    </>
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
                            style={{height: '120px'}}
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
                      toast.error(<p className='fs-4 fw-bold'>{t('global.attachment')}</p>)
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

              <Modal.Footer className='d-flex justify-content-between'>
                <Button variant='primary' type='submit' disabled={loading}>
                  {loading ? t('weapon.duringSave') : t('global.SAVE')}
                </Button>
                <Button variant='danger' onClick={handleClose}>
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

export default AssistantCreateForm
