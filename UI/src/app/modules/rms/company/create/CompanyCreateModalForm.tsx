import React, { ChangeEvent } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { t } from 'i18next'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'react-toastify'
import { FormikErrors, FormikTouched } from 'formik'

interface FormData {
  company_pa: string
  company_dr: string
  company_en: string
  icon: File | null
  haq_alamatyaz: string
  hanging_date: string
  bank_account_number: string
  amount_of_money: string
  attachments: File[]
}

interface CompanyCreateModalFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
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
  errors: FormikErrors<FormData>
  touched: FormikTouched<FormData>
}

const CompanyCreateModalForm: React.FC<CompanyCreateModalFormProps> = ({
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
  touched,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header>
        <Modal.Title>{t('company.newCompany')}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={5}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.name_da')}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t('company.enter_name_da')}
                  name='company_dr'
                  value={formData.company_dr}
                  onChange={handleChange}
                  isInvalid={!!(errors.company_dr && touched.company_dr)}
                />
                <Form.Control.Feedback type='invalid'>{errors.company_dr}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.name_en')}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t('company.enter_name_en')}
                  name='company_en'
                  value={formData.company_en}
                  onChange={handleChange}
                  isInvalid={!!(errors.company_en && touched.company_en)}
                />
                <Form.Control.Feedback type='invalid'>{errors.company_en}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.name_pa')}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t('company.enter_name_pa')}
                  name='company_pa'
                  value={formData.company_pa}
                  onChange={handleChange}
                  isInvalid={!!(errors.company_pa && touched.company_pa)}
                />
                <Form.Control.Feedback type='invalid'>{errors.company_pa}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.royalty')}</Form.Label>
                <Form.Select
                  value={haqAlamatyaz}
                  onChange={handleRoyaltyChange}
                  isInvalid={!!(errors.haq_alamatyaz && touched.haq_alamatyaz)}
                >
                  <option value='' disabled>
                    {t('company.select_option')}
                  </option>
                  <option value='yes'>{t('company.yes')}</option>
                  <option value='no'>{t('company.no')}</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.haq_alamatyaz}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.icon')}</Form.Label>
                {errors.icon && touched.icon && (
                  <div className='text-danger mb-2'>{errors.icon}</div>
                )}
                <br />
                <label className='me-5'>
                  <input
                    type='file'
                    onChange={handleImageChange}
                    name='icon'
                    hidden
                    accept='image/png, image/jpeg'
                    ref={fileInputRef}
                  />
                  <img
                    src={imagePreview}
                    className='img-fluid img-thumbnail image-view'
                    alt={t('company.icon')}
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </label>
              </Form.Group>
            </Col>
          </Row>

          {haqAlamatyaz === 'yes' && (
            <Row>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>{t('company.hanging_date')}</Form.Label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    containerStyle={{ width: '100%', direction: 'rtl' }}
                    value={hangingDate}
                    placeholder={t('company.hanging_date_placeholder')}
                    style={{
                      width: '100%',
                      height: '38px',
                      boxSizing: 'border-box',
                      fontSize: '1.2rem',
                      color: '#153a81',
                      fontWeight: 'bold',
                    }}
                    type='search'
                    onOpenPickNewDate={false}
                    onChange={(date: any) => {
                      if (date) {
                        const formattedDate = `${date.year}-${date.month.number}-${date.day}`
                        setHangingDate(formattedDate)
                      } else {
                        setHangingDate('')
                      }
                    }}
                    editable={true}
                    format='YYYY-MM-DD'
                  />
                  {errors.hanging_date && touched.hanging_date && (
                    <div className='text-danger mt-1'>{errors.hanging_date}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>{t('company.bank_account_number')}</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder={t('company.bank_account_number_placeholder')}
                    name='bank_account_number'
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    isInvalid={!!(errors.bank_account_number && touched.bank_account_number)}
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
                    placeholder={t('company.amount_of_money_placeholder')}
                    name='amount_of_money'
                    value={formData.amount_of_money}
                    onChange={handleChange}
                    isInvalid={!!(errors.amount_of_money && touched.amount_of_money)}
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
              <Form.Group>
                <Form.Label>{t('company.attachments')}</Form.Label>
                <FileUploader
                  multiple={true}
                  handleChange={handleDrop}
                  name='file'
                  types={fileType}
                  maxSize={30}
                  label={t('company.drag_drop_files')}
                  hoverTitle={t('company.drop_here')}
                  onTypeError={() => toast.error(t('error.invalid_file_type'))}
                  onSizeError={() => toast.error(t('error.file_too_large'))}
                />
                <div className='mt-3'>
                  {files.map((file, index) => (
                    <div key={index} className='d-flex align-items-center mb-2'>
                      <span className='me-2'>{file.name}</span>
                      <button
                        type='button'
                        className='btn btn-icon btn-sm btn-danger'
                        onClick={() => handleFileRemove(index)}
                      >
                        <i className='fas fa-times'></i>
                      </button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
          <Button variant='primary' type='submit' disabled={loading}>
            {loading ? t('company.saving') : t('company.save')}
          </Button>
          <Button variant='danger' onClick={handleClose}>
            {t('company.exit')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default CompanyCreateModalForm
