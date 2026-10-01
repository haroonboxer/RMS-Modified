import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import type { DateObject } from 'react-multi-date-picker'
import { FileUploader } from 'react-drag-drop-files'
import { License } from '../__model'
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
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState<DateObject | null>(null)
  const [validityDate, setValidityDate] = useState<DateObject | null>(null)
  const [licenseDate, setLicenseDate] = useState<DateObject | null>(null)

  const validationSchema = Yup.object().shape({
    license_type: Yup.string().required(t('license.license_type_is_required')),
    issue_date: Yup.date().required(t('license.issue_date_is_required')),
    validity_date: Yup.date().required(t('license.validity_date_is_required')),
    license_date: Yup.date().required(t('license.license_date_is_required')),
    slip_no: Yup.string().required(t('license.slip_number_is_required')),
    fee: Yup.number()
      .required(t('license.fee_is_required'))
      .positive(t('license.fee_must_be_positive')),
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
      if (field === 'issue_date') setStartDate(date)
      if (field === 'validity_date') setValidityDate(date)
      if (field === 'license_date') setLicenseDate(date)
    } else {
      formik.setFieldValue(field, '')
      if (field === 'issue_date') setStartDate(null)
      if (field === 'validity_date') setValidityDate(null)
      if (field === 'license_date') setLicenseDate(null)
    }
  }

  const handleFileChange = (newFiles: FileList | null) => {
    if (newFiles) {
      const filesArray = Array.from(newFiles)
      handleDrop(filesArray)
    }
  }

  const RequiredLabel = ({ label }: { label: string }) => (
    <FormLabel>
      {label} <span className='text-danger'>*</span>
    </FormLabel>
  )
  React.useEffect(() => {
    if (!showModal) {
      formik.resetForm()
      setStartDate(null)
      setValidityDate(null)
      setLicenseDate(null)
    }
  }, [showModal])

  return (
    <Modal show={showModal} onHide={handleClose} size='lg' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('license.create_new_license')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
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

            <Col md={6}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.slip_no')} />
                <FormControl
                  type='text'
                  name='slip_no'
                  value={formik.values.slip_no}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.slip_no && formik.errors.slip_no)}
                  placeholder={t('license.enter_slip_number')}
                />
                {formik.touched.slip_no && formik.errors.slip_no && (
                  <FormControl.Feedback type='invalid'>
                    {formik.errors.slip_no}
                  </FormControl.Feedback>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.fee_amount')} />
                <FormControl
                  type='number'
                  name='fee'
                  value={formik.values.fee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.fee && formik.errors.fee)}
                  placeholder={t('license.enter_fee_amount')}
                />
                {formik.touched.fee && formik.errors.fee && (
                  <FormControl.Feedback type='invalid'>{formik.errors.fee}</FormControl.Feedback>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.license_date')} />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  containerStyle={{ width: '100%' }}
                  value={licenseDate}
                  placeholder={t('license.select_license_date')}
                  style={{
                    width: '100%',
                    height: '38px',
                    boxSizing: 'border-box',
                    fontSize: '1.2rem',
                    color: '#153a81',
                    fontWeight: 'bold',
                  }}
                  type='search'
                  onOpenPickNewDate={true}
                  onChange={(date: any) => handleDateChange(date, 'license_date')}
                  editable={true}
                  format='YYYY-MM-DD'
                />
                {formik.touched.license_date && formik.errors.license_date && (
                  <div className='text-danger' style={{ fontSize: '0.875em' }}>
                    {formik.errors.license_date}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.issue_date')} />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  containerStyle={{ width: '100%' }}
                  value={startDate}
                  placeholder={t('license.select_issue_date')}
                  style={{
                    width: '100%',
                    height: '38px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                  }}
                  type='search'
                  onOpenPickNewDate={false}
                  onChange={(date: any) => handleDateChange(date, 'issue_date')}
                  editable={true}
                  format='YYYY-MM-DD'
                />
                {formik.touched.issue_date && formik.errors.issue_date && (
                  <div className='text-danger' style={{ fontSize: '0.875em' }}>
                    {formik.errors.issue_date}
                  </div>
                )}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className='mb-3'>
                <RequiredLabel label={t('license.validity_date')} />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  containerStyle={{ width: '100%' }}
                  value={validityDate}
                  placeholder={t('license.select_validity_date')}
                  style={{
                    width: '100%',
                    height: '38px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                  }}
                  type='search'
                  onOpenPickNewDate={false}
                  onChange={(date: any) => handleDateChange(date, 'validity_date')}
                  editable={true}
                  format='YYYY-MM-DD'
                />
                {formik.touched.validity_date && formik.errors.validity_date && (
                  <div className='text-danger' style={{ fontSize: '0.875em' }}>
                    {formik.errors.validity_date}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup className='mb-3'>
                <FormLabel>{t('global.attachments')}</FormLabel>
                <FileUploader
                  handleChange={handleFileChange}
                  name='attachments'
                  types={fileType}
                  multiple={true}
                  maxSize={30}
                  label={t('file_upload.drag_drop_or_click')}
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
                            <span className='text-truncate' style={{ maxWidth: '300px' }}>
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
                            style={{ background: 'transparent', border: 'none', color: 'red' }}
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
