import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch } from 'redux/hooks'
import { toast } from 'react-toastify'
import { FileUploader } from 'react-drag-drop-files'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { provinces, districts } from 'helpers/provincesAndDistrictsJson'
import image from '_metronic/assets/images/user_male.png'
import { t } from 'i18next'
import { Modal } from 'react-bootstrap'
import { countries } from 'helpers/countries'
import { storeBoss } from 'redux/gps_company/boss/gpsCompanyBossSlice'

interface BossCreateModalProps {
  show: boolean
  onHide: () => void
  onSuccess: () => void
}

const BossCreateModal = ({ show, onHide, onSuccess }: BossCreateModalProps) => {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [photo, setPhoto] = useState<File | null>(null)
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([])
  const [selectedCurrentDistricts, setSelectedCurrentDistricts] = useState<any[]>([])
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { id } = useParams<{ id: string }>()

  const validationMessages = {
    required: (name: string) => `${name} ${t('boss.is_required')}`,
    max: (name: string) => `${name} ${t('boss.is_too_long')}`,
    required_select: (name: string) => `${t('boss.please_select')} ${name}`,
  }

  const FormSchema = Yup.object().shape({
    name_dr: Yup.string().required(validationMessages.required(t('boss.name_da'))),
    name_en: Yup.string().required(validationMessages.required(t('boss.name_en'))),
    last_name_dr: Yup.string().required(validationMessages.required(t('boss.last_name_da'))),
    last_name_en: Yup.string().required(validationMessages.required(t('boss.last_name_en'))),
    f_name_da: Yup.string().required(validationMessages.required(t('boss.father_name_da'))),
    phone: Yup.string().required(validationMessages.required(t('boss.phone'))),
    passport_no: Yup.string().required(validationMessages.required(t('boss.passport_no'))),
    country: Yup.string().required(validationMessages.required(t('boss.country'))),
    email: Yup.string()
      .email(t('boss.invalid_email'))
      .required(validationMessages.required(t('boss.email'))),
    photo: Yup.mixed()
      .required(t('validation.required', { name: t('company.photo') }))
      .test('fileType', t('validation.image-only'), (value) => {
        if (!value) return true
        return value && ['image/jpeg', 'image/png', 'image/jpg'].includes((value as File).type)
      }),
  })

  const initialValues = {
    name_dr: '',
    name_en: '',
    last_name_dr: '',
    last_name_en: '',
    f_name_da: '',
    phone: '',
    passport_no: '',
    country: '',
    email: '',
    main_province: '',
    main_district: '',
    main_village: '',
    current_province: '',
    current_district: '',
    current_village: '',
    type_residence_info: '',
    photo: null,
  }

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      setLoading(true)
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && key !== 'photo') {
          formData.append(key, value)
        }
      })

      if (photo) {
        formData.append('photo', photo)
      } else {
        toast.error('Please upload a valid photo.')
        setLoading(false)
        return
      }
      if (id) {
        formData.append('company_id', id)
      } else {
        toast.error('Invalid company ID.')
        setLoading(false)
        return
      }
      files.forEach((file) => formData.append('attachments[]', file))
      try {
        const response = await dispatch(storeBoss(formData))
        if (response?.meta?.requestStatus === 'fulfilled') {
          toast.success(t('boss.toast_save'))
          onSuccess?.()
          onHide()
        } else {
          toast.error(t('boss.toast_error_boss'))
        }
      } catch (error) {
        toast.error('Error during submission.')
      } finally {
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    if (show) {
      formik.resetForm()
      setFiles([])
      setPhoto(null)
      setSelectedDistricts([])
      setSelectedCurrentDistricts([])
      setImagePreview(null)
    }
  }, [show])
  const handleProvinceChange = async (provinceId: string) => {
    const filteredDistricts = districts.filter(
      (district) => String(district.provincecode) === provinceId
    )
    setSelectedDistricts(filteredDistricts)
  }

  const handleCurrentProvinceChange = async (provinceId: string) => {
    const filteredDistricts = districts.filter(
      (district) => String(district.provincecode) === provinceId
    )
    setSelectedCurrentDistricts(filteredDistricts)
  }

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setPhoto(file)
      formik.setFieldValue('photo', file)     // <- key line to trigger Formik validation
      formik.setTouched({ ...formik.touched, photo: true }) // Optional: to trigger error display
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }


  const defaultImage = image

  return (
    <Modal show={show} onHide={onHide} size='xl' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 className='fw-bolder'>
            <i className='fas fa-plus text-primary'></i> {t('boss.add_boss')}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='col-md-12'>
          <form onSubmit={formik.handleSubmit}>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label htmlFor='name_dr'>{t('boss.name_dr')}</label>
                  <input
                    id='name_dr'
                    type='text'
                    className='form-control'
                    {...formik.getFieldProps('name_dr')}
                  />
                  {formik.errors.name_dr && formik.touched.name_dr && (
                    <div className='text-danger'>{formik.errors.name_dr}</div>
                  )}

                  <label htmlFor='last_name_en' className='mt-4'>
                    {t('boss.last_name_en')}
                  </label>
                  <input
                    id='last_name_en'
                    type='text'
                    className='form-control'
                    {...formik.getFieldProps('last_name_en')}
                  />
                  {formik.errors.last_name_en && formik.touched.last_name_en && (
                    <div className='text-danger'>{formik.errors.last_name_en}</div>
                  )}

                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label htmlFor='name_en'>{t('boss.name_en')}</label>
                  <input
                    id='name_en'
                    type='text'
                    className='form-control'
                    {...formik.getFieldProps('name_en')}
                  />
                  {formik.errors.name_en && formik.touched.name_en && (
                    <div className='text-danger'>{formik.errors.name_en}</div>
                  )}

                  <label htmlFor='f_name_da' className='mt-4'>
                    {t('boss.f_name_da')}
                  </label>
                  <input
                    id='f_name_da'
                    type='text'
                    className='form-control'
                    {...formik.getFieldProps('f_name_da')}
                  />
                  {formik.errors.f_name_da && formik.touched.f_name_da && (
                    <div className='text-danger'>{formik.errors.f_name_da}</div>
                  )}
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label htmlFor='last_name_dr'>{t('boss.last_name_dr')}</label>
                  <input
                    id='last_name_dr'
                    type='text'
                    className='form-control'
                    {...formik.getFieldProps('last_name_dr')}
                  />
                  {formik.errors.last_name_dr && formik.touched.last_name_dr && (
                    <div className='text-danger'>{formik.errors.last_name_dr}</div>
                  )}
                  <label htmlFor='email' className='mt-4'>
                    {t('boss.email')}
                  </label>
                  <input
                    id='email'
                    type='email'
                    className='form-control'
                    {...formik.getFieldProps('email')}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <div className='text-danger'>{formik.errors.email}</div>
                  )}
                </div>
              </div>
              <div className='col-md-2 mx-6'>
                <div className='form-group'>
                  <label htmlFor='photo'>{t('boss.photo')}</label>
                  <br />
                  <input
                    id='photo'
                    name='photo'
                    type='file'
                    hidden
                    accept='image/png, image/jpeg'
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <img
                    src={imagePreview || defaultImage}
                    className='img-fluid img-thumbnail'
                    alt='user-logo'
                    style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                  />
                  {formik.touched.photo && formik.errors.photo && (
                    <div className='text-danger mt-1' style={{ fontSize: '0.875rem' }}>
                      {formik.errors.photo}
                    </div>
                  )}
                </div>
              </div>


            </div>
            <div className='row'>
              <div className='col-md-4'>
                <div className='form-group'>
                  <label htmlFor='phone'>{t('boss.phone')}</label>
                  <input
                    id='phone'
                    type='text'
                    className='form-control'
                    {...formik.getFieldProps('phone')}
                  />
                  {formik.errors.phone && formik.touched.phone && (
                    <div className='text-danger'>{formik.errors.phone}</div>
                  )}
                </div>
              </div>
              <div className='col-md-4'>
                <div className='form-group'>
                  <label htmlFor='passport_no'>{t('boss.passport_no')}</label>
                  <input
                    id='passport_no'
                    type='text'
                    className='form-control'
                    {...formik.getFieldProps('passport_no')}
                  />
                  {formik.errors.passport_no && formik.touched.passport_no && (
                    <div className='text-danger'>{formik.errors.passport_no}</div>
                  )}
                </div>
              </div>
              {/* <div className='col-md-4'>
                <div className='form-group'>
                  <label htmlFor='country'>{t('boss.country')}</label>
                  <input
                    id='country'
                    type='text'
                    className='form-control'
                    {...formik.getFieldProps('country')}
                    onChange={(e) => {
                      formik.handleChange(e)
                      formik.setFieldValue('country', e.target.value)
                    }}
                  />
                  {formik.errors.country && formik.touched.country && (
                    <div className='text-danger'>{formik.errors.country}</div>
                  )}
                </div>
              </div> */}


              <div className='col-md-4'>
                <div className='form-group'>
                  <label htmlFor='country'>{t('boss.country')}</label>
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



            </div>
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
                          {formik.errors.main_province && formik.touched.main_province && (
                            <div className='text-danger'>{formik.errors.main_province}</div>
                          )}
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
                          {formik.errors.main_district && formik.touched.main_district && (
                            <div className='text-danger'>{formik.errors.main_district}</div>
                          )}
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
                          {formik.errors.main_village && formik.touched.main_village && (
                            <div className='text-danger'>{formik.errors.main_village}</div>
                          )}
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
                          {formik.errors.current_province && formik.touched.current_province && (
                            <div className='text-danger'>{formik.errors.current_province}</div>
                          )}
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
                          {formik.errors.current_district && formik.touched.current_district && (
                            <div className='text-danger'>{formik.errors.current_district}</div>
                          )}
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
                          {formik.errors.current_village && formik.touched.current_village && (
                            <div className='text-danger'>{formik.errors.current_village}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='form-group'>
                        <label htmlFor='type_residence_info'>{t('boss.type_residence_info')}</label>
                        <input
                          id='type_residence_info'
                          type='text'
                          className='form-control'
                          style={{ height: '120px' }}
                          {...formik.getFieldProps('type_residence_info')}
                        />
                        {formik.errors.type_residence_info &&
                          formik.touched.type_residence_info && (
                            <div className='text-danger'>{formik.errors.type_residence_info}</div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <br />
            <div className='row background-fa'>
              <div className='col-lg-12'>
                <legend className='fs-3'>
                  <b>
                    &nbsp;
                    <i className={`fas fa-solid fa-paperclip text-primary fs-2 me-2`}></i>
                    {t('boss.upload')}
                  </b>
                </legend>
                <div className='row mb-8 m-10'>
                  <FileUploader
                    multiple={true}
                    handleChange={handleDrop}
                    onDrop={handleDrop}
                    name='file'
                    hoverTitle={t('boss.upload_files')}
                    maxSize={30}
                    label={t('boss.upload_files')}
                    onTypeError={() => toast.error(t('error.invalid_file_type'))}
                    onSizeError={() => toast.error(t('error.file_too_large'))
                    }
                  />
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>
                        {file.name}
                        <span onClick={() => handleFileRemove(index)}>
                          <i className='fas fa-times fs-4 text-danger mt-2 ms-2 bg-light-dark shadow cursor-pointer'></i>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className='d-flex justify-content-between mt-4'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {loading ? t('boss.saving') : t('boss.save_boss')}
              </button>

              <button
                className='btn btn-danger'
                type='button'
                disabled={loading}
                onClick={() => navigate(-1)}
              >
                {loading ? t('boss.redirecting') : t('boss.back')}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default BossCreateModal
