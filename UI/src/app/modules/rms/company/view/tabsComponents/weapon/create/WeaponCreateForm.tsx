import React from 'react'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import {FileUploader} from 'react-drag-drop-files'
import {toast} from 'react-toastify'
import {FormikProps} from 'formik'
import type {DateObject} from 'react-multi-date-picker'
import {Weapon} from '../__model'
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
} from 'react-bootstrap'

interface WeaponCreateFormProps {
  showModal: boolean
  handleClose: () => void
  formik: FormikProps<Weapon>
  step: number
  weaponDate: DateObject | null
  loading: boolean
  files: File[]
  fileType: string[]
  handleDrop: (files: File[]) => void
  handleFileRemove: (index: number) => void
  handleFileChange: (files: FileList | null) => void
  handleDateChange: (date: DateObject | DateObject[] | null, field: string) => void
  prevStep: () => void
  RequiredLabel: React.FC<{label: string}>
  t: (key: string) => string
}

const WeaponCreateForm: React.FC<WeaponCreateFormProps> = ({
  showModal,
  handleClose,
  formik,
  step,
  weaponDate,
  loading,
  files,
  fileType,
  handleDrop,
  handleFileRemove,
  handleDateChange,
  prevStep,
  RequiredLabel,
  t,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} size='lg' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('weapon.tableInformation')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          {step === 1 && (
            <Row>
              <Col md={6}>
                <FormGroup className='mb-3'>
                  <FormLabel>
                    <RequiredLabel label={t('weapon.numberOfWeapons')} />
                  </FormLabel>
                  <FormControl
                    type='text'
                    name='number_of_weapons'
                    value={formik.values.number_of_weapons}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(formik.touched.number_of_weapons && formik.errors.number_of_weapons)
                    }
                  />
                  {formik.touched.number_of_weapons && formik.errors.number_of_weapons && (
                    <FormControl.Feedback type='invalid'>
                      {formik.errors.number_of_weapons as React.ReactNode}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
          )}

          {step === 2 && (
            <Row>
              <Col md={6}>
                <FormGroup className='mb-3'>
                  <FormLabel>
                    <RequiredLabel label={t('weapon.oizNo')} />
                  </FormLabel>
                  <FormControl
                    type='text'
                    name='slip_no'
                    value={formik.values.slip_no}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.slip_no && formik.errors.slip_no)}
                  />
                  {formik.touched.slip_no && formik.errors.slip_no && (
                    <FormControl.Feedback type='invalid'>
                      {formik.errors.slip_no as React.ReactNode}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='mb-3'>
                  <FormLabel>
                    <RequiredLabel label={t('weapon.oizDate')} />
                  </FormLabel>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    containerStyle={{width: '100%'}}
                    value={weaponDate}
                    placeholder={t('weapon.oizDate')}
                    style={{
                      width: '100%',
                      height: '38px',
                      boxSizing: 'border-box',
                      fontSize: '1rem',
                    }}
                    type='search'
                    onOpenPickNewDate={false}
                    onChange={(date: any) => handleDateChange(date, 'slip_date')}
                    editable={true}
                    format='YYYY-MM-DD'
                  />
                  {formik.touched.slip_date && formik.errors.slip_date && (
                    <div className='text-danger' style={{fontSize: '0.875em'}}>
                      {formik.errors.slip_date as React.ReactNode}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='mb-3'>
                  <FormLabel>
                    <RequiredLabel label={t('weapon.amount')} />
                  </FormLabel>
                  <FormControl
                    type='number'
                    name='money_amount'
                    value={formik.values.money_amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.money_amount && formik.errors.money_amount)}
                  />
                  {formik.touched.money_amount && formik.errors.money_amount && (
                    <FormControl.Feedback type='invalid'>
                      {formik.errors.money_amount as React.ReactNode}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup className='mb-3'>
                  <FormLabel>{t('company.attachments')}</FormLabel>
                  <FileUploader
                    multiple={true}
                    handleChange={handleDrop}
                    onDrop={handleDrop}
                    name='file'
                    types={fileType}
                    required={false}
                    hoverTitle={t('Upload files')}
                    maxSize={4}
                    label={t('Upload files')}
                    onTypeError={() => toast.error(t('Invalid file type'))}
                  />
                  {files.map((file: any, index: number) => (
                    <li key={index}>
                      {file.name}
                      <span onClick={() => handleFileRemove(index)}>
                        <i className='fas fa-times fs-4 text-danger mt-2 ms-2 bg-light-dark shadow cursor-pointer'></i>
                      </span>
                    </li>
                  ))}
                  <small className='text-muted'>
                    {t('Supported formats:')} {fileType.join(', ')}. {t('Max size: 5MB')}
                  </small>
                </FormGroup>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
          <div>
            {step < 2 ? (
              <Button variant='primary' type='submit'>
                {t('weapon.next')}
              </Button>
            ) : (
              <Button variant='success' type='submit' disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as='span'
                      size='sm'
                      animation='border'
                      role='status'
                      aria-hidden='true'
                    />
                    {t('weapon.duringSave')}
                  </>
                ) : (
                  t('weapon.save')
                )}
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
      </Form>
    </Modal>
  )
}

export default WeaponCreateForm
