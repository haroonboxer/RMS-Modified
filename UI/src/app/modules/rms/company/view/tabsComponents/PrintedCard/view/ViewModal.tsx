import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import RecordOwnerView from 'helpers/RecordOwnerView'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { viewPrintedCard } from 'redux/rms/printedCard/printedCardSlice'

interface Props {
  id: number
  onClose: () => void
}

const PrintedCardViewModal: React.FC<Props> = ({ id, onClose }) => {
  const dispatch = useAppDispatch()
  const { printedCardView, loading, error } = useAppSelector((state) => state.printedCard)
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
      content = <AttachmentViewer id={id} form_code='frm-09' onClose={closeModal} />
      break
    default:
      content = null
  }

  useEffect(() => {
    if (id) {
      dispatch(viewPrintedCard({ id }))
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
          <Modal.Title>{t('global.view', { name: t('printedCard.printedCards') })}</Modal.Title>
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
                <strong>{t('printedCard.card_type')}:</strong>
                {printedCardView.card_type === 'new' ? (
                  <span>
                    {t('printedCard.new')}
                  </span>
                ) : printedCardView.card_type === 'extend' ? (
                  <span>
                    {t('printedCard.extend')}
                  </span>
                ) : (
                  printedCardView.card_type
                )}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.selected_weapons')}:</strong> {printedCardView.weapons}
              </p>
            </Col>
          </Row>
          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.project_name_dr')}:</strong>{' '}
                {printedCardView.project_name_dr}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.project_name_en')}:</strong> {printedCardView.project_name_en}
              </p>
            </Col>
          </Row>
          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.card_perimeter_dr')}:</strong>{' '}
                {printedCardView.card_perimeter_dr}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.card_perimeter_en')}:</strong> {printedCardView.card_perimeter_en}
              </p>
            </Col>
          </Row>
          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.issued_date')}:</strong>{' '}
                {printedCardView.issued_date}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>{t('printedCard.expire_date')}:</strong> {printedCardView.expire_date}
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
