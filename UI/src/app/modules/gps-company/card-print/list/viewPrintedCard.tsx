import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import RecordOwnerView from 'helpers/RecordOwnerView'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {Modal, Button, Row, Col} from 'react-bootstrap'
import {viewPrintedCard} from 'redux/gps_company/printedCard/gpsPrintedCardSlice'
import {useAppDispatch, useAppSelector} from 'redux/hooks'

interface Props {
  id: number
  onClose: () => void
}

const PrintedCardViewModal: React.FC<Props> = ({id, onClose}) => {
  const dispatch = useAppDispatch()
  const {printedCardView, loading, error} = useAppSelector((state) => state.gpsPrintedCard)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contentType, setContentType] = useState('')

  const openModal = (contentType = '') => {
    setContentType(contentType)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setContentType('')
  }

  let content: JSX.Element | null = null

  switch (contentType) {
    case 'view':
      content = <AttachmentViewer id={id} form_code='frm-W4' onClose={closeModal} />
      break
    default:
      content = null
  }

  // Dispatch the action when component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(viewPrintedCard({id}))
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('license.loadingDetails')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <div className='spinner-border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
            <p className='mt-2'>{t('global.loading')}</p>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  if (error) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('license.errorTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={onClose}>
            {t('global.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  if (!printedCardView) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('license.noData')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('license.noDataAvailable')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={onClose}>
            {t('global.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <>
      <Modal show={true} onHide={onClose} size='xl' backdrop='static'>
        <Modal.Header>
          <Modal.Title>{t('global.view', {name: t('printedCard.printedCards')})}</Modal.Title>
          <button
            className='btn btn-sm btn-flex btn-primary fw-bold me-2'
            style={{float: 'left'}}
            onClick={() => openModal('view')}
          >
            <i className='fas fa-camera fs-5 me-2'></i>
            {t('global.viewAttachment')}
          </button>
        </Modal.Header>
        <Modal.Body>
          <Row className='text-center justify-content-center my-4'>
            <Col md={4}>
              <img
                src={printedCardView.company_icon}
                alt='Company Logo'
                className='img-thumbnail mb-2'
                style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}}
              />
              <div>
                <strong>لوگو شرکت</strong>
              </div>
            </Col>

            <Col md={4}>
              <img
                src={printedCardView.boss_photo}
                alt='Boss Photo'
                className='img-thumbnail mb-2'
                style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}}
              />
              <div>
                <strong>ریس</strong>
              </div>
            </Col>

            <Col md={4}>
              <img
                src={printedCardView.assistant_photo}
                alt='Assistant Photo'
                className='img-thumbnail mb-2'
                style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}}
              />
              <div>
                <strong>معاون</strong>
              </div>
            </Col>
          </Row>

          <RecordOwnerView
            title={t('global.recordOwner')}
            icon={'fa fa-user-plus'}
            ownerName={printedCardView.ownerName}
            departmentName={printedCardView.createdDepartment}
            province={printedCardView.createdLocation}
            created_at={printedCardView.created_at}
          />

          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.company_name')}:</strong> {printedCardView.company_name_dr}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.license_type')}:</strong> &nbsp;&nbsp;&nbsp;
                {printedCardView.license_type === 'new' ? (
                  <span>{t('printedCard.new')}</span>
                ) : printedCardView.license_type === 'extend' ? (
                  <span>{t('printedCard.extend')}</span>
                ) : printedCardView.license_type === 'renew' ? (
                  <span>{t('printedCard.renew')}</span>
                ) : (
                  printedCardView.license_type
                )}
              </p>
            </Col>
          </Row>
          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.boss_name_dr')}:</strong> &nbsp;&nbsp;&nbsp;
                {printedCardView.boss_name_dr}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.assistant_name_dr')}:</strong>&nbsp;&nbsp;&nbsp;{' '}
                {printedCardView.assistant_name_dr}
              </p>
            </Col>
          </Row>
          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.issued_date')}:</strong> &nbsp;&nbsp;&nbsp;
                {printedCardView.issue_date}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.expire_date')}:</strong>&nbsp;&nbsp;&nbsp;{' '}
                {printedCardView.validity_date}
              </p>
            </Col>
          </Row>
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
