import React, {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useTranslation} from 'react-i18next'
import type {DateObject} from 'react-multi-date-picker'
import {FileUploader} from 'react-drag-drop-files'
import {License} from '../__model'
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
} from 'react-bootstrap'
import {toast} from 'react-toastify'
import {allGpsCompanyAgency} from 'redux/gps_company/gps_company_agency/gpsCompanyAgencySlice'
import {useLocation, useParams} from 'react-router-dom'
import {useAppDispatch} from 'redux/hooks'
import Select from 'react-select'
import {provices} from 'app/modules/authentication/core/_request'

interface LicenseCreateFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: License) => Promise<void>
  initialData: License
  loading: boolean
  handleDrop: (files: File[]) => void
  handleFileRemove: (index: number) => void
  fileType: string[]
  files: File[]
  persian_fa: any
  DatePicker: any
  persian: any
}

const LicenseCreateForm: React.FC<LicenseCreateFormProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  initialData,
  loading,
  handleDrop,
  handleFileRemove,
  fileType,
  files,
  persian_fa,
  DatePicker,
  persian,
}) => {
  const {t} = useTranslation()
  const [startDate, setStartDate] = useState<DateObject | null>(null)
  const [issueDate, setIssueStartDate] = useState<DateObject | null>(null)
  const [validityDate, setValidityDate] = useState<DateObject | null>(null)

  const validationSchema = Yup.object().shape({
    license_type: Yup.string().required(t('license.license_type_is_required')),
    activity_type: Yup.string().required(t('license.activity_type_is_required')),
    issue_date: Yup.string().required(t('license.issue_date_is_required')),
    validity_date: Yup.string().required(t('license.validity_date_is_required')),
    hanging_date: Yup.string().required(t('license.hanging_date_is_required')),
    bank_account_number: Yup.string().required(t('license.bank_account_number_is_required')),
    fee: Yup.number()
      .required(t('license.fee_is_required'))
      .min(0, t('license.fee_must_be_positive')),
  })

  const formik = useFormik({
    initialValues: initialData,
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values)
    },
    enableReinitialize: true,
  })

  const handleDateChange = (date: DateObject | DateObject[] | null, field: string) => {
    if (date && !Array.isArray(date)) {
      const formattedDate = `${date.year}-${date.month.number}-${date.day}`
      formik.setFieldValue(field, formattedDate)
      if (field === 'startDate') setStartDate(date)
      if (field === 'issue_date') setIssueStartDate(date)
      if (field === 'validity_date') setValidityDate(date)
    } else {
      formik.setFieldValue(field, '')
      if (field === 'startDate') setStartDate(null)
      if (field === 'issue_date') setIssueStartDate(null)
      if (field === 'validity_date') setValidityDate(null)
    }
  }

  const dispatch = useAppDispatch()
  const {id} = useParams()
  const location = useLocation()
  const {item} = (location.state as any) || {}

  const [gpsAgency, setGpsAgency] = useState<GpsAgencyType[]>([])

  type GpsAgencyType = {
    id: number
    agency_manager: string
    mainProvinceName: string
  }

  useEffect(() => {
    if (!id) return
    dispatch(allGpsCompanyAgency({id}))
      .unwrap()
      .then((res: any) => {
        if (res.status == true) {
          setGpsAgency(res.data)
          console.log(res)
        }
      })
  }, [id, dispatch])

  const handleFileChange = (newFiles: FileList | null) => {
    if (newFiles) {
      const filesArray = Array.from(newFiles)
      handleDrop(filesArray)
    }
  }

  const RequiredLabel = ({label}: {label: string}) => (
    <FormLabel>
      {label} <span className='text-danger'>*</span>
    </FormLabel>
  )

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      formik.resetForm()
      setStartDate(null)
      setIssueStartDate(null)
      setValidityDate(null)
    }
  }, [showModal])

  // Set fee based on license type
  // useEffect(() => {
  //   const {license_type} = formik.values
  //   if (license_type === 'new') {
  //     formik.setFieldValue('fee', 100000)
  //   } else if (license_type === 'extend') {
  //     formik.setFieldValue('fee', 50000)
  //   } else if (license_type === 'renew') {
  //     formik.setFieldValue('fee', 0)
  //   }
  // }, [formik.values.license_type])

  const handleActivityTypeChange = (option: any) => {
    formik.setFieldValue('activity_type', option?.value)
  }

  // Set fee based on license type
  useEffect(() => {
    const {license_type, activity_type} = formik.values
    let fee = 0
    if (activity_type === 'central_license') {
      // Central license fees
      if (license_type === 'new') fee = 100000
      else if (license_type === 'extend') fee = 50000
      else if (license_type === 'renew') fee = 0
    } else {
      // Non-central license fees
      if (license_type === 'new') fee = 5000
      else if (license_type === 'extend') fee = 5000
      else if (license_type === 'renew') fee = 0
    }

    if (formik.values.fee !== fee) {
      formik.setFieldValue('fee', fee)
    }
  }, [formik.values.license_type, formik.values.activity_type])

  return (
    <Modal show={showModal} onHide={handleClose} size='lg' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('license.create_new_license')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('GPSCompanies.activity_type')} />
                <Select
                  id='activity_type'
                  name='activity_type'
                  className='react-select-container'
                  classNamePrefix='react-select'
                  options={[
                    {value: '', label: t('GPSCompanies.activity_type')},
                    {value: 'central_license', label: t('GPSCompanies.central_license')},
                    ...gpsAgency.map((item) => ({
                      value: item.id,
                      // label: item.agency_manager,
                      label: `${item.mainProvinceName ?? 'N/A'} / نماینده - ${item.agency_manager}`,
                    })),
                  ]}
                  value={
                    [
                      {value: '', label: t('GPSCompanies.activity_type')},
                      {value: 'central_license', label: t('GPSCompanies.central_license')},
                      ...gpsAgency.map((item) => ({
                        value: item.id,
                        // label: item.agency_manager,
                        label: `${item.mainProvinceName ?? 'N/A'} / نماینده - ${
                          item.agency_manager
                        }`,
                      })),
                    ].find((option) => option.value === formik.values.activity_type) || null
                  }
                  // onChange={(option: any) => formik.setFieldValue('activity_type', option?.value)}
                  onChange={handleActivityTypeChange}
                  onBlur={() => formik.setFieldTouched('activity_type', true)}
                />

                {formik.touched.activity_type && formik.errors.activity_type && (
                  <div className='invalid-feedback d-block'>{formik.errors.activity_type}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.license_type')} />
                <FormSelect
                  name='license_type'
                  value={formik.values.license_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.license_type && formik.errors.license_type)}
                >
                  <option value=''>{t('license.select_license_type')}</option>
                  <option value='new'>{t('license.new')}</option>
                  <option value='extend'>{t('license.extend')}</option>
                  <option value='renew'>{t('license.renew')}</option>
                </FormSelect>
                {formik.touched.license_type && formik.errors.license_type && (
                  <FormControl.Feedback type='invalid'>
                    {formik.errors.license_type}
                  </FormControl.Feedback>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.fee_amount')} />
                <FormControl
                  style={{textAlign: 'center'}}
                  type='number'
                  name='fee'
                  value={formik.values.fee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.fee && formik.errors.fee)}
                  placeholder={t('license.enter_fee_amount')}
                  readOnly
                />
                {formik.touched.fee && formik.errors.fee && (
                  <FormControl.Feedback type='invalid'>{formik.errors.fee}</FormControl.Feedback>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.hangingDate')} />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  containerStyle={{width: '100%'}}
                  value={startDate}
                  placeholder={t('license.hangingDate')}
                  style={{
                    width: '100%',
                    height: '38px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                  }}
                  type='search'
                  onOpenPickNewDate={true}
                  onChange={(date: any) => handleDateChange(date, 'hanging_date')}
                  editable={true}
                  format='YYYY-MM-DD'
                />
                {formik.touched.hanging_date && formik.errors.hanging_date && (
                  <div className='text-danger' style={{fontSize: '0.875em'}}>
                    {formik.errors.hanging_date}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.bankAccountNumber')} />
                <FormControl
                  style={{textAlign: 'right'}}
                  type='text'
                  name='bank_account_number'
                  value={formik.values.bank_account_number || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.bank_account_number && formik.errors.bank_account_number)
                  }
                  placeholder={t('license.bankAccountNumber')}
                />
                {formik.touched.bank_account_number && formik.errors.bank_account_number && (
                  <div className='text-danger' style={{fontSize: '0.875em'}}>
                    {formik.errors.bank_account_number}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.issue_date')} />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  containerStyle={{width: '100%'}}
                  value={issueDate}
                  placeholder={t('license.select_issue_date')}
                  style={{
                    width: '100%',
                    height: '38px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                  }}
                  type='search'
                  onOpenPickNewDate={true}
                  onChange={(date: any) => handleDateChange(date, 'issue_date')}
                  editable={true}
                  format='YYYY-MM-DD'
                />
                {formik.touched.issue_date && formik.errors.issue_date && (
                  <div className='text-danger' style={{fontSize: '0.875em'}}>
                    {formik.errors.issue_date}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.validity_date')} />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  containerStyle={{width: '100%'}}
                  value={validityDate}
                  placeholder={t('license.select_validity_date')}
                  style={{
                    width: '100%',
                    height: '38px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                  }}
                  type='search'
                  onOpenPickNewDate={true}
                  onChange={(date: any) => handleDateChange(date, 'validity_date')}
                  editable={true}
                  format='YYYY-MM-DD'
                />
                {formik.touched.validity_date && formik.errors.validity_date && (
                  <div className='text-danger' style={{fontSize: '0.875em'}}>
                    {formik.errors.validity_date}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={8}>
              <FormGroup className='mb-3'>
                <FormLabel>{t('global.attachments')}</FormLabel>
                <FileUploader
                  handleChange={handleFileChange}
                  name='attachments'
                  types={fileType}
                  multiple={true}
                  maxSize={30}
                  label={t('file_upload.drag_drop_or_click')}
                  onTypeError={() => toast.error(t('error.invalid_file_type'))}
                  onSizeError={() => toast.error(t('error.file_too_large'))}
                />
                {files.length > 0 && (
                  <div className='mt-3'>
                    <h6>
                      {t('file_upload.selected_files')} ({files.length})
                    </h6>
                    <div className='list-group'>
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className='list-group-item d-flex justify-content-between align-items-center py-2 px-3'
                        >
                          <div className='d-flex align-items-center'>
                            <span className='badge bg-secondary me-2'>{index + 1}</span>
                            <span className='text-truncate' style={{maxWidth: '300px'}}>
                              {file.name}
                            </span>
                            <small className='text-muted ms-2'>
                              {(file.size / 1024).toFixed(2)} KB
                            </small>
                          </div>
                          <button
                            className='btn btn-link p-0 text-muted'
                            onClick={() => handleFileRemove(index)}
                            title={t('global.remove')}
                            style={{background: 'transparent', border: 'none', color: 'red'}}
                          >
                            <i className='fa fa-times text-danger'></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <small className='text-muted d-block mt-2'>
                  {t('file_upload.supported_formats')}: {fileType.join(', ')}.{' '}
                  {t('file_upload.max_size')}
                </small>
              </FormGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
          <Button variant='primary' type='submit' disabled={loading}>
            {loading ? (
              <>
                <Spinner as='span' size='sm' animation='border' role='status' aria-hidden='true' />
                {t('global.saving')}
              </>
            ) : (
              t('global.save')
            )}
          </Button>
          <Button variant='danger' onClick={handleClose} disabled={loading}>
            {t('global.close')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default LicenseCreateForm
