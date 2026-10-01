import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import type { DateObject } from 'react-multi-date-picker';

interface PrintedCardCreateFormProps {
  showModal: boolean;
  handleClose: () => void;
  handleSubmit: (values: any) => Promise<void>;
  initialData: any;
  loading: boolean;
  handleFileRemove: (index: number) => void;
  handleDrop: (files: File[]) => void;
  fileType: string[];
  files: File[];
  persian_fa: any;
  DatePicker: any;
  persian: any;
}

const PrintedCardCreateForm: React.FC<PrintedCardCreateFormProps> = ({
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
  const [startDate, setStartDate] = useState<DateObject | null>(null);
  const [endDate, setEndDate] = useState<DateObject | null>(null);

  const validationSchema = Yup.object().shape({
    issued_date: Yup.date().required(t('printedCard.issued_date_required')),
    expire_date: Yup.date()
      .required(t('printedCard.expire_date_required'))
      .min(Yup.ref('issued_date'), t('printedCard.end_date_after_start_date')),
    weapons: Yup.string()
      .required(t('printedCard.weapon_required')),
    card_type: Yup.string()
      .required(t('printedCard.card_type_required')),
    project_name_dr: Yup.string()
      .required(t('printedCard.project_name_dr_required')),
    project_name_en: Yup.string()
      .required(t('printedCard.project_name_en_required')),
    card_perimeter_dr: Yup.string()
      .required(t('printedCard.card_perimeter_dr_required')),
    card_perimeter_en: Yup.string()
      .required(t('printedCard.card_perimeter_en_required')),
  });

  const handleDateChange = (date: DateObject | DateObject[] | null, field: string, setFieldValue: any) => {
    if (date && !Array.isArray(date)) {
      const formattedDate = `${date.year}-${date.month.number.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
      setFieldValue(field, formattedDate);

      if (field === 'issued_date') setStartDate(date);
      if (field === 'expire_date') setEndDate(date);
    } else {
      setFieldValue(field, '');
      if (field === 'issued_date') setStartDate(null);
      if (field === 'expire_date') setEndDate(null);
    }
  };

  useEffect(() => {
    if (!showModal) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [showModal]);

  return (
    <Modal show={showModal} onHide={handleClose} size='xl' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>{t('printedCard.create_new_printed_card')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            try {
              await handleSubmit(values)
              handleClose()
            } catch (error) {
              toast.error(t('printedCard.error_submitting_form'))
            } finally {
              setSubmitting(false)
            }
          }}
          enableReinitialize
        >
          {({isSubmitting, setFieldValue, handleSubmit}) => (
            <FormikForm>
              <Row>
                {/* Each Form.Group is localized */}
                <Col md={12}>
                  <Form.Group className='mb-5'>
                    <Form.Label className='d-flex justify-content-center fs-5 mb-3 fw-semibold text-muted'>
                      {t('printedCard.card_type')}
                    </Form.Label>
                    <div
                      role='group'
                      aria-labelledby='card-type-radio-group'
                      className='d-flex justify-content-center gap-4'
                    >
                      <label
                        className='d-flex align-items-center gap-2 px-3 py-2 rounded border'
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          borderColor: '#dee2e6',
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Field
                          type='radio'
                          name='card_type'
                          value='new'
                          className='form-check-input m-0'
                        />
                        <span className='fw-medium'>{t('printedCard.new')}</span>
                      </label>
                      <label
                        className='d-flex align-items-center gap-2 px-3 py-2 rounded border'
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          borderColor: '#dee2e6',
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Field
                          type='radio'
                          name='card_type'
                          value='extend'
                          className='form-check-input m-0'
                        />
                        <span className='fw-medium'>{t('printedCard.extend')}</span>
                      </label>
                    </div>
                    <ErrorMessage
                      name='card_type'
                      component='div'
                      className='text-danger text-center mt-2'
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className='d-flex justify-content-end'>
                    <div className='d-flex align-items-center gap-2'>
                      <Field
                        type='checkbox'
                        name='choose_all_weapons'
                        id='choose_all_weapons'
                        className='form-check-input m-0'
                      />
                      <Form.Label htmlFor='choose_all_weapons' className='m-0'>
                        {t('printedCard.choose_all_weapons')}
                      </Form.Label>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('printedCard.chose_weapon')}</Form.Label>
                    <Field type='text' name='weapons' className='form-control' min='0' />
                    <ErrorMessage name='weapons' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('printedCard.project_name_dr')}</Form.Label>
                    <Field type='text' name='project_name_dr' className='form-control' min='0' />
                    <ErrorMessage name='project_name_dr' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('printedCard.project_name_en')}</Form.Label>
                    <Field type='text' name='project_name_en' className='form-control' min='0' />
                    <ErrorMessage name='project_name_en' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('printedCard.card_perimeter_dr')}</Form.Label>
                    <Field type='text' name='card_perimeter_dr' className='form-control' min='0' />
                    <ErrorMessage
                      name='card_perimeter_dr'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('printedCard.card_perimeter_en')}</Form.Label>
                    <Field type='text' name='card_perimeter_en' className='form-control' min='0' />
                    <ErrorMessage
                      name='card_perimeter_en'
                      component='div'
                      className='text-danger'
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('printedCard.issued_date')}</Form.Label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      containerStyle={{width: '100%'}}
                      value={startDate}
                      placeholder={t('printedCard.select_start_date')}
                      style={{width: '100%', height: '38px', fontSize: '1rem'}}
                      onOpenPickNewDate={true}
                      onChange={(date: any) => handleDateChange(date, 'issued_date', setFieldValue)}
                      editable={true}
                      format='YYYY-MM-DD'
                    />
                    <ErrorMessage name='issued_date' component='div' className='text-danger' />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{t('printedCard.expire_date')}</Form.Label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      containerStyle={{width: '100%'}}
                      value={endDate}
                      placeholder={t('printedCard.select_end_date')}
                      style={{width: '100%', height: '38px', fontSize: '1rem'}}
                      onOpenPickNewDate={true}
                      onChange={(date: any) => handleDateChange(date, 'expire_date', setFieldValue)}
                      editable={true}
                      format='YYYY-MM-DD'
                      minDate={startDate}
                    />
                    <ErrorMessage name='expire_date' component='div' className='text-danger' />
                  </Form.Group>
                </Col>
              </Row>
              <Col md={12}>
                <Form.Group className='mb-3'>
                  <Form.Label>{t('contract.attachments')}</Form.Label>
                  <FileUploader
                    multiple
                    handleChange={handleDrop}
                    onDrop={handleDrop}
                    name='file'
                    types={fileType}
                    hoverTitle={t('contract.drop_files_here')}
                    label={t('contract.upload_or_drop_files')}
                    maxSize={4}
                    onTypeError={() => toast.error(t('contract.invalid_file_type'))}
                  />
                  <ul className='mt-2'>
                    {files.map((file, index) => (
                      <li key={index} className='d-flex align-items-center'>
                        {file.name}
                        <button
                          type='button'
                          className='btn btn-icon btn-sm ms-2'
                          onClick={() => handleFileRemove(index)}
                        >
                          <i className='fas fa-times text-danger'></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Form.Group>
              </Col>
              <Modal.Footer className='d-flex justify-content-between'>
                <Button variant='primary' type='submit' disabled={loading || isSubmitting}>
                  {loading ? (
                    <>
                      <Spinner as='span' size='sm' animation='border' role='status' />
                      {t('printedCard.saving')}
                    </>
                  ) : (
                    t('printedCard.save')
                  )}
                </Button>

                <Button variant='danger' onClick={handleClose}>
                  {t('printedCard.close')}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
};

export default PrintedCardCreateForm;
