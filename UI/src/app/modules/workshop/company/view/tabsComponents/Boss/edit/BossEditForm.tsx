import React, { ChangeEvent, useEffect, useState } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import { t } from 'i18next'
import { FileUploader } from 'react-drag-drop-files'
import imagee from '_metronic/assets/images/user_male.png'
import { districts, provinces } from 'helpers/provincesAndDistrictsJson'
import * as Yup from 'yup'
import { Boss } from '../view/__model'
import { countries } from 'helpers/countries'
import CustomeSelect from 'app/customes/CustomeSelect'
import { toast } from 'react-toastify'

interface BossEditFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: Boss) => void
  initialData: Boss
  loading: boolean
  handleFileRemove: (index: number) => void
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleDrop: (fileList: File[]) => void
  fileType: string[]
  files: File[]
  validationSchema: Yup.ObjectSchema<any>
  imagePreview: string | null
}

const BossEditForm: React.FC<BossEditFormProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  initialData,
  loading,
  handleFileRemove,
  handleImageChange,
  handleDrop,
  fileType,
  files,
  validationSchema,
  imagePreview,
}) => {
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([])
  const [selectedCurrentDistricts, setSelectedCurrentDistricts] = useState<any[]>([])

  const formattedInitialData: Boss = {
    ...initialData,
    main_province: initialData.main_province || initialData.mainProvince,
    main_district: initialData.main_district || initialData.mainDistrict,
    current_province: initialData.current_province || initialData.currentProvince,
    current_district: initialData.current_district || initialData.currentDistrict,
    type_residence_info: initialData.type_residence_info || 'not anything ',
  }



  useEffect(() => {
    if (formattedInitialData.main_province) {
      const filtered = districts.filter(
        (d) => String(d.provincecode) === String(formattedInitialData.main_province)
      )
      setSelectedDistricts(filtered)
    }

    if (formattedInitialData.current_province) {
      const filtered = districts.filter(
        (d) => String(d.provincecode) === String(formattedInitialData.current_province)
      )
      setSelectedCurrentDistricts(filtered)
    }
  }, [showModal])

  const handleProvinceChange = (provinceId: string) => {
    const filtered = districts.filter((d) => String(d.provincecode) === provinceId)
    setSelectedDistricts(filtered)
  }

  const handleCurrentProvinceChange = (provinceId: string) => {
    const filtered = districts.filter((d) => String(d.provincecode) === provinceId)
    setSelectedCurrentDistricts(filtered)
  }

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('global.edit', { name: t('boss.BossCreate') })}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={formattedInitialData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formik) => {
            const isAfghanistan =
              formik.values.country === 'Afghanistan' || formik.values.country === 'افغانستان'

            return (
              <FormikForm onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md={9}>
                    <Row>
                      {[
                        'name_dr',
                        'name_en',
                        'last_name_dr',
                        'last_name_en',
                        'f_name_da',
                        'email',
                        'phone',
                        'passport_no',

                      ].map((field, index) => (
                        <Col md={4} key={index}>
                          <Form.Group className='mb-3'>
                            <Form.Label>{t(`boss.${field}`)}</Form.Label>
                            <Field
                              type={field === 'email' ? 'email' : 'text'}
                              name={field}
                              className='form-control'
                            />
                            <ErrorMessage name={field} component='div' className='text-danger' />
                          </Form.Group>
                        </Col>
                      ))}
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label htmlFor='country'>{t('assistant.country')}</label>
                          <select
                            id='country'
                            className='form-control'
                            {...formik.getFieldProps('country')}
                            onChange={(e) => {
                              formik.handleChange(e)
                              // Reset province and district when country changes
                              formik.setFieldValue('main_province', '')
                              formik.setFieldValue('main_district', '')
                              formik.setFieldValue('main_village', '')
                              formik.setFieldValue('current_province', '')
                              formik.setFieldValue('current_district', '')
                              formik.setFieldValue('current_village', '')
                              formik.setFieldValue('type_residence_info', '')

                            }}
                          >
                            <option value=''>{t('boss.select_country')}</option>
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>



                    </Row>
                  </Col>
                  <Col md={3}>
                    <Form.Label>{t('global.image')}</Form.Label>
                    <br />
                    <label>
                      <input
                        type='file'
                        hidden
                        accept='image/png, image/jpeg'
                        onChange={handleImageChange}
                      />
                      <img
                        src={imagePreview || imagee}
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

                {isAfghanistan ? (
                  <>
                    <Row>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('boss.main_province')}</Form.Label>
                          <Form.Select
                            {...formik.getFieldProps('main_province')}
                            onChange={(e) => {
                              formik.handleChange(e)
                              handleProvinceChange(e.target.value)
                            }}
                          >
                            <option value=''>{t('boss.select_province')}</option>
                            {provinces.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('boss.main_district')}</Form.Label>
                          <Form.Select {...formik.getFieldProps('main_district')}>
                            <option value=''>{t('boss.select_district')}</option>
                            {selectedDistricts.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('boss.main_village')}</Form.Label>
                          <Field type='text' name='main_village' className='form-control' />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className='mt-3'>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('boss.current_province')}</Form.Label>
                          <Form.Select
                            {...formik.getFieldProps('current_province')}
                            onChange={(e) => {
                              formik.handleChange(e)
                              handleCurrentProvinceChange(e.target.value)
                            }}
                          >
                            <option value=''>{t('boss.select_province')}</option>
                            {provinces.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('boss.current_district')}</Form.Label>
                          <Form.Select {...formik.getFieldProps('current_district')}>
                            <option value=''>{t('boss.select_district')}</option>
                            {selectedCurrentDistricts.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('boss.current_village')}</Form.Label>
                          <Field type='text' name='current_village' className='form-control' />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Row className='mt-3'>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>{t('boss.type_residence_info')}</Form.Label>
                        <Field
                          as='textarea'
                          rows={4}
                          name='type_residence_info'
                          className='form-control'
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Col md={12} className='mt-4'>
                  <Form.Group>
                    <Form.Label>{t('contract.attachments')}</Form.Label>
                    <FileUploader
                      multiple={true}
                      handleChange={handleDrop}
                      name='file'
                      maxSize={30}
                      types={fileType}
                      hoverTitle={t('contract.upload_or_drop_files')}
                      onTypeError={() => toast.error(t('error.invalid_file_type'))}
                      onSizeError={() => toast.error(t('error.file_too_large'))
                      }
                      dropMessageStyle={{ backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6' }}
                    />
                    {files.length > 0 && (
                      <ul className='list-group mt-3'>
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
                    )}
                  </Form.Group>
                </Col>

                <div className='d-flex justify-content-between mt-4'>
                  <Button variant='primary' type='submit' disabled={loading}>
                    {loading ? t('company.saving') : t('global.save')}
                  </Button>
                  <Button variant='danger' onClick={handleClose}>
                    {t('global.close')}
                  </Button>
                </div>
              </FormikForm>
            )
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default BossEditForm
