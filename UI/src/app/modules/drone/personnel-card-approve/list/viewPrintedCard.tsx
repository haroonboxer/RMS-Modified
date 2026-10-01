import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { viewPrintedCard } from 'redux/drone/printedCard/droneCameraCardPrintSlice'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

interface Props {
  id: number
  onClose: () => void
}

const PrintedCardViewModal: React.FC<Props> = ({ id, onClose }) => {
  const dispatch = useAppDispatch()
  const { printedCardView, loading, error } = useAppSelector(
    (state) => state.droneCameraCardPrint
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contentType, setContentType] = useState('')

  const openModal = (type = '') => {
    setContentType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setContentType('')
  }

  const record: any = printedCardView

  const isCompanyLicense = record?.company_id !== null
  const isPersonnelLicense = record?.personnel_id !== null

  const hasAfghanistanResidence =
    record?.mainProvince ||
    record?.mainDistrict ||
    record?.main_village ||
    record?.currentProvince ||
    record?.currentDistrict ||
    record?.current_village

  const topRowCards = [
    { icon: 'fa fa-user-plus', label: t('global.recordOwner'), value: record?.ownerName },
    { icon: 'fa fa-building', label: t('global.departmentName'), value: record?.createdDepartment },
    { icon: 'fa fa-map-marker-alt', label: t('global.recordLocation'), value: record?.createdLocation },
    { icon: 'fa fa-calendar', label: t('global.regDate'), value: record?.created_at }
  ]

  const infoCards = [
    { icon: 'fa fa-user', label: t('personnelDroneCamera.name_dr'), value: record?.name_dr },
    { icon: 'fa fa-user', label: t('personnelDroneCamera.name_en'), value: record?.name_en },
    { icon: 'fa fa-user', label: t('personnelDroneCamera.f_name_da'), value: record?.f_name_da },
    { icon: 'fa fa-id-card', label: t('personnelDroneCamera.last_name_dr'), value: record?.last_name_dr },
    { icon: 'fa fa-id-card', label: t('personnelDroneCamera.last_name_en'), value: record?.last_name_en },
    { icon: 'fa fa-phone', label: t('personnelDroneCamera.phone'), value: record?.phone },
    { icon: 'fa fa-envelope', label: t('personnelDroneCamera.email'), value: record?.email },
    { icon: 'fa fa-briefcase', label: t('personnelDroneCamera.job'), value: record?.job },
    { icon: 'fa fa-passport', label: t('personnelDroneCamera.passport_no'), value: record?.passport_no },

    ...(hasAfghanistanResidence
      ? [
        { icon: 'fa fa-map', label: t('personnelDroneCamera.main_province'), value: record?.mainProvince },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.main_district'), value: record?.mainDistrict },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.main_village'), value: record?.main_village },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.current_province'), value: record?.currentProvince },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.current_district'), value: record?.currentDistrict },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.current_village'), value: record?.current_village },
      ]
      : [
        { icon: 'fa fa-globe', label: t('personnelDroneCamera.country'), value: record?.country },
        { icon: 'fa fa-home', label: t('personnelDroneCamera.type_residence_info'), value: record?.type_residence_info },
      ]),


    { icon: 'fa fa-id-card', label: t('printedCard.license_type'), value: record?.license_type },
    { icon: 'fa fa-calendar-check', label: t('printedCard.issued_date'), value: record?.issue_date },
    { icon: 'fa fa-calendar-times', label: t('printedCard.expire_date'), value: record?.validity_date },
  ]

  let content: JSX.Element | null = null

  if (contentType === 'view') {
    content = (
      <AttachmentViewer
        id={id}
        form_code='frm-DC-License-License'
        onClose={closeModal}
      />
    )
  }

  useEffect(() => {
    if (id) {
      dispatch(viewPrintedCard({ id }))
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Body className='text-center p-6'>
          <div className='spinner-border' role='status'></div>
          <p className='mt-3'>{t('global.loading')}</p>
        </Modal.Body>
      </Modal>
    )
  }

  if (error) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Body>
          <p>{error}</p>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <>
      <Modal show={true} onHide={onClose} size='xl' backdrop='static'>
        <Modal.Header>
          <Modal.Title> {t('global.view', { name: t('printedCard.printedCards') })}</Modal.Title>
          <button
            className='btn btn-sm btn-flex btn-primary fw-bold me-2'
            style={{ float: 'left' }}
            onClick={() => openModal('view')}
          >
            <i className='fas fa-camera fs-5 me-2'></i>
            {t('global.viewAttachment')}
          </button>
        </Modal.Header>
        <Modal.Body>

          {/* TOP CARDS */}
          <div className='row gx-4 gy-4 mb-8'>
            {topRowCards.map(({ icon, label, value }, idx) => (
              <div key={idx} className='col-md-3'>
                <div className='p-3 border rounded bg-light h-100 d-flex align-items-center' style={{ gap: '0.75rem' }}>
                  <i className={`${icon} text-primary fs-4`} />
                  <div>
                    <label className='form-label text-muted mb-1 fw-bold'>{label}</label>
                    <div className='fs-6 text-dark'>
                      {value || <em>{t('global.notAvailable')}</em>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr />

          <div className='row'>

            {/* LEFT INFO */}
            <div className='col-md-9'>
              <div className='row gx-4 gy-4'>
                {infoCards.map(({ icon, label, value }, idx) => (
                  <div key={idx} className='col-lg-4 col-md-6 col-sm-12'>
                    <div className='p-3 border rounded bg-light h-100 d-flex align-items-center' style={{ gap: '0.75rem' }}>
                      <i className={`${icon} text-primary fs-4`} />
                      <div>
                        <label className='form-label text-muted mb-1 fw-bold'>
                          {label}
                        </label>
                        <div className='fs-6 text-dark'>
                          {value || <em>{t('global.notAvailable')}</em>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT PHOTO */}
            <div className='col-md-3 d-flex justify-content-center'>
              <div style={{ width: '100%', maxWidth: '240px' }}>

                {isCompanyLicense && (
                  <>
                    <label className='fw-bold text-center w-100 mb-2'>لوگو شرکت</label>
                    <div className='border rounded mb-4 d-flex justify-content-center align-items-center' style={{ height: '120px', backgroundColor: '#f8f9fa' }}>
                      <img src={record?.company_icon || '/media/placeholder.png'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>

                    <label className='fw-bold text-center w-100 mb-2'>ریس</label>
                    <div className='border rounded mb-4 d-flex justify-content-center align-items-center' style={{ height: '120px', backgroundColor: '#f8f9fa' }}>
                      <img src={record?.boss_photo || '/media/placeholder.png'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>

                    <label className='fw-bold text-center w-100 mb-2'>معاون</label>
                    <div className='border rounded d-flex justify-content-center align-items-center' style={{ height: '120px', backgroundColor: '#f8f9fa' }}>
                      <img src={record?.assistant_photo || '/media/placeholder.png'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  </>
                )}

                {isPersonnelLicense && (
                  <>
                    <label className='fw-bold text-center w-100 mb-3'>
                      {t('personnelDroneCamera.photo')}
                    </label>

                    <div className='border rounded shadow-sm d-flex justify-content-center align-items-center'
                      style={{ height: '260px', backgroundColor: '#f8f9fa' }}>
                      <img
                        src={record?.photo || '/media/placeholder.png'}
                        alt='Personnel'
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </>
                )}

              </div>
            </div>

          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='danger' onClick={onClose}>
            {t('global.close')}
          </Button>
        </Modal.Footer>
      </Modal>

      <CustomModal
        modalContent={content}
        show={isModalOpen}
        onClose={closeModal}
        modalSize='sm'
        modalTile={t('global.viewAttachment')}
      />
    </>
  )
}

export default PrintedCardViewModal