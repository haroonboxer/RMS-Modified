import React, {ChangeEvent} from 'react'
import {Modal, Form, Button, Row, Col} from 'react-bootstrap'
import {t} from 'i18next'
import {FileUploader} from 'react-drag-drop-files'
import {toast} from 'react-toastify'
import {FormikErrors, FormikTouched} from 'formik'

interface FormData {
  company_pa: string
  company_dr: string
  company_en: string
  address: string
  tin: string
  icon: File | null
  attachments: File[]
}

interface GpsCompanyCreateModalFormProps {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  formData: FormData
  loading: boolean
  fileInputRef: React.RefObject<HTMLInputElement>
  persian_fa: any
  DatePicker: any
  persian: any
  imagePreview: string | null
  handleDrop: (files: File[]) => void
  handleFileRemove: (index: number) => void
  fileType: string[]
  files: File[]
  errors: FormikErrors<FormData>
  touched: FormikTouched<FormData>
}

const GpsCompanyCreateModalForm: React.FC<GpsCompanyCreateModalFormProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  handleChange,
  handleImageChange,
  formData,
  loading,
  fileInputRef,
  imagePreview,
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
                <Form.Label>{t('company.address')}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t('company.enter_address')}
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  isInvalid={!!(errors.address && touched.address)}
                />
                <Form.Control.Feedback type='invalid'>{errors.address}</Form.Control.Feedback>
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
                    src={imagePreview ?? undefined}
                    className='img-fluid img-thumbnail image-view'
                    alt={t('company.icon')}
                    style={{width: '150px', height: '150px', objectFit: 'cover'}}
                  />
                </label>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.tin')}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t('company.enter_tin')}
                  name='tin'
                  value={formData.tin}
                  onChange={handleChange}
                  isInvalid={!!(errors.tin && touched.tin)}
                />
                <Form.Control.Feedback type='invalid'>{errors.tin}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('company.attachments')}</Form.Label>
                <FileUploader
                  multiple={true}
                  handleChange={handleDrop}
                  name='file'
                  accept='image/*,application/pdf'
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

export default GpsCompanyCreateModalForm
