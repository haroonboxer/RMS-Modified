import React, {ChangeEvent, FormEvent} from 'react'
import {Modal, Form, Button, Row, Col, Spinner} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {FileUploader} from 'react-drag-drop-files'
import {toast} from 'react-toastify'

interface FormData {
  company_pa: string
  company_dr: string
  company_en: string
  icon: string | File | null
  bank_account_number: string
  amount_of_money: string
}

interface CompanyEditModalFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (e: FormEvent) => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRoyaltyChange: (e: ChangeEvent<HTMLSelectElement>) => void
  formData: FormData
  loading: boolean
  fileInputRef: React.RefObject<HTMLInputElement>
  persian_fa: any
  DatePicker: any
  persian: any
  haqAlamatyaz: string
  imagePreview: string
  hangingDate: string
  setHangingDate: (date: string) => void
  handleDrop: (files: File[]) => void
  handleFileRemove: (index: number) => void
  fileType: string[]
  files: File[]
  errors: Record<string, string>
}

const CompanyEditModalForm: React.FC<CompanyEditModalFormProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  handleChange,
  handleImageChange,
  handleRoyaltyChange,
  formData,
  loading,
  fileInputRef,
  persian_fa,
  DatePicker,
  persian,
  haqAlamatyaz,
  imagePreview,
  hangingDate,
  setHangingDate,
  handleDrop,
  handleFileRemove,
  fileType,
  files,
  errors,
}) => {
  const {t} = useTranslation()

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('global.edit', {name: t('company.CompanyCreate')})}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={5}>
              <Form.Group className='mb-3'>
                <Form.Label>
                  {t('company.name_da')} <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t('company.enter_name_da')}
                  name='company_dr'
                  value={formData.company_dr}
                  onChange={handleChange}
                  isInvalid={!!errors.company_dr}
                />
                <Form.Control.Feedback type='invalid'>{errors.company_dr}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>
                  {t('company.name_en')} <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t('company.enter_name_en')}
                  name='company_en'
                  value={formData.company_en}
                  onChange={handleChange}
                  isInvalid={!!errors.company_en}
                />
                <Form.Control.Feedback type='invalid'>{errors.company_en}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className='mb-3'>
                <Form.Label>
                  {t('company.name_pa')} <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t('company.enter_name_pa')}
                  name='company_pa'
                  value={formData.company_pa}
                  onChange={handleChange}
                  isInvalid={!!errors.company_pa}
                />
                <Form.Control.Feedback type='invalid'>{errors.company_pa}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.royalty')}</Form.Label>
                <Form.Select
                  value={haqAlamatyaz}
                  onChange={handleRoyaltyChange}
                  isInvalid={!!errors.haqAlamatyaz}
                >
                  <option value='' disabled>
                    {t('company.select')}
                  </option>
                  <option value='yes'>{t('company.yes')}</option>
                  <option value='no'>{t('company.no')}</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.haqAlamatyaz}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.icon')}</Form.Label>
                <div
                  className='image-upload-container'
                  onClick={triggerFileInput}
                  style={{cursor: 'pointer'}}
                >
                  <input
                    type='file'
                    onChange={handleImageChange}
                    name='icon'
                    hidden
                    accept='image/png, image/jpeg'
                    ref={fileInputRef}
                  />
                  {imagePreview ? (
                    <img
                      src={typeof formData.icon === 'string' ? formData.icon : imagePreview}
                      className='img-fluid img-thumbnail image-view'
                      alt={t('company.icon')}
                      style={{width: '150px', height: '150px', objectFit: 'cover'}}
                    />
                  ) : (
                    <div className='image-placeholder'>
                      <i className='fas fa-camera fa-3x'></i>
                      <p>{t('company.click_to_upload')}</p>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {haqAlamatyaz === 'yes' && (
            <Row className='mt-3'>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>{t('company.hanging_date')}</Form.Label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={hangingDate}
                    placeholder={t('company.hanging_date')}
                    containerStyle={{width: '100%', direction: 'rtl'}}
                    style={{
                      width: '100%',
                      height: '38px',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                    onChange={(date: any) => {
                      setHangingDate(date ? `${date.year}-${date.month.number}-${date.day}` : '')
                    }}
                    editable
                    format='YYYY-MM-DD'
                  />
                  {errors.hangingDate && (
                    <div className='text-danger small mt-1'>{errors.hangingDate}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>{t('company.bank_account_number')}</Form.Label>
                  <Form.Control
                    type='text'
                    name='bank_account_number'
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    isInvalid={!!errors.bank_account_number}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.bank_account_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>{t('company.amount_of_money')}</Form.Label>
                  <Form.Control
                    type='text'
                    name='amount_of_money'
                    value={formData.amount_of_money}
                    onChange={handleChange}
                    isInvalid={!!errors.amount_of_money}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.amount_of_money}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
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
                hoverTitle={t('company.upload_files')}
                maxSize={4}
                label={t('company.upload_files')}
                onTypeError={() => toast.error(t('error.invalid_file_type'))}
              />
              <ul className='list-unstyled mt-2'>
                {files.map((file, index) => (
                  <li key={index} className='d-flex align-items-center mb-2'>
                    <span className='me-2'>{file.name}</span>
                    <button
                      type='button'
                      className='btn btn-sm btn-danger'
                      onClick={() => handleFileRemove(index)}
                    >
                      <i className='fas fa-times'></i>
                    </button>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
          <Button variant='primary' type='submit' disabled={loading}>
            {loading ? (
              <>
                <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
                <span className='ms-2'>{t('company.saving')}</span>
              </>
            ) : (
              t('company.save')
            )}
          </Button>
          <Button variant='danger' onClick={handleClose} disabled={loading}>
            {t('company.exit')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CompanyEditModalForm
