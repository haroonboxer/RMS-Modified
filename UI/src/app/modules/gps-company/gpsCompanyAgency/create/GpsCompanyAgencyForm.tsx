import React, {useEffect, useState} from 'react'
import {Modal, Form, Button, Row, Col} from 'react-bootstrap'
import {Formik, Field, Form as FormikForm, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import imagee from '_metronic/assets/images/user_male.png'
import {provinces} from 'helpers/provincesAndDistrictsJson'
import {FileUploader} from 'react-drag-drop-files'
import {toast} from 'react-toastify'
import {t, use} from 'i18next'
import {countries} from 'helpers/countries'
import {useDispatch} from 'react-redux'

import {AppDispatch} from 'redux/store'

interface District {
  provincecode: number
  districtcode: string
  label: string
  value: number
  district_pa: string
  name: string
  id: string
}

interface GpsCompanyAgencyFormProps {
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

const GpsCompanyAgencyForm: React.FC<GpsCompanyAgencyFormProps> = ({
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
  const dispatch = useDispatch<AppDispatch>()
  const [gpsCompany, setGpsCompany] = useState<any[]>([])

  const validationSchema = Yup.object().shape({
    // name_dr: Yup.string().required(t('validation.required', {name: t('assistant.name_dr')})),
    // name_pa: Yup.string().required(t('validation.required', {name: t('assistant.name_pa')})),
    // name_en: Yup.string().required(t('validation.required', {name: t('assistant.name_en')})),
    // company_id: Yup.string().required(t('validation.required', {name: t('assistant.company_id')})),
    company_id: Yup.string().nullable(),
    main_province: Yup.string().nullable(),
    main_district: Yup.string().nullable(),
    main_village: Yup.string().nullable(),
    // current_province: Yup.string().nullable(),
    // current_district: Yup.string().nullable(),
    // current_village: Yup.string().nullable(),
    photo: Yup.mixed()
      .nullable()
      .required(t('validation.required', {name: t('company.photo')}))
      .test('fileType', t('validation.image-only'), (value) => {
        if (!value) return true
        return value && ['image/jpeg', 'image/png', 'image/jpg'].includes((value as File).type)
      }),
  })

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header>
        <Modal.Title>{t('GPSCompanies.gps_add_agency')}</Modal.Title>
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
                {/* <Col me={9}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-4'>
                        <Form.Label>{t('assistant.name_dr')}</Form.Label>
                        <Field type='text' name='name_dr' className='form-control' />
                        <ErrorMessage name='name_dr' component='div' className='text-danger' />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-4'>
                        <Form.Label>نام ( پشتو )</Form.Label>
                        <Field type='text' name='name_pa' className='form-control' />
                        <ErrorMessage name='name_pa' component='div' className='text-danger' />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className='mb-4'>
                        <Form.Label>{t('assistant.name_en')}</Form.Label>
                        <Field type='text' name='name_en' className='form-control' />
                        <ErrorMessage name='name_en' component='div' className='text-danger' />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label> {t('GPSCompanies.agency_agent_name')}</Form.Label>
                        <Field type='text' name='agency_manager' className='form-control' />
                        <ErrorMessage
                          name='agency_manager'
                          component='div'
                          className='text-danger'
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label> {t('assistant.phone')}</Form.Label>
                        <Field type='text' name='phone' className='form-control' />
                        <ErrorMessage name='phone' component='div' className='text-danger' />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col> */}

                <Col md={9}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label> {t('GPSCompanies.agency_agent_name')}</Form.Label>
                        <Field type='text' name='agency_manager' className='form-control' />
                        <ErrorMessage
                          name='agency_manager'
                          component='div'
                          className='text-danger'
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label> {t('assistant.phone')}</Form.Label>
                        <Field type='text' name='phone' className='form-control' />
                        <ErrorMessage name='phone' component='div' className='text-danger' />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label htmlFor='main_province'>{t('GPSCompanies.province')}</label>
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
                        <label htmlFor='main_district'>{t('GPSCompanies.district')}</label>
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
                        <label htmlFor='main_village'>{t('GPSCompanies.village')}</label>
                        <input
                          id='main_village'
                          type='text'
                          className='form-control'
                          {...formik.getFieldProps('main_village')}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor='assistant-photo'>{t('GPSCompanies.agent_image')}</Form.Label>
                  <br />
                  <label htmlFor='assistant-photo' style={{cursor: 'pointer'}}>
                    <input
                      id='assistant-photo'
                      name='photo'
                      type='file'
                      hidden
                      accept='image/png, image/jpeg'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          formik.setFieldValue('photo', file)
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
                  {/* Show validation error */}
                  {formik.touched.photo && formik.errors.photo && (
                    <div className='text-danger mt-1' style={{fontSize: '0.875rem'}}>
                      {formik.errors.photo as string}
                    </div>
                  )}
                </Col>
              </Row>
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
                    maxSize={30}
                    label='upload files'
                    onTypeError={() => toast.error(t('error.invalid_file_type'))}
                    onSizeError={() => toast.error(t('error.file_too_large'))}
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

export default GpsCompanyAgencyForm
