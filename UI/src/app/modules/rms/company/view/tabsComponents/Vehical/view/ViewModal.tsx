import React, {useEffect, useState} from 'react'
import {Modal, Button, Row, Col} from 'react-bootstrap'
import {t} from 'i18next'
import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import RecordOwnerView from 'helpers/RecordOwnerView'
import {useAppDispatch, useAppSelector} from 'redux/hooks'
import {viewVehical} from 'redux/rms/vehical/vehicalSlice'

interface Props {
  id: number
  onClose: () => void
}

const ViewModal: React.FC<Props> = ({id, onClose}) => {
  const dispatch = useAppDispatch()
  const {vehicalView, loading} = useAppSelector((state) => state.vehical)
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

  useEffect(() => {
    if (id) {
      dispatch(viewVehical({id}))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('global.loadingAssistantDetails')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('global.loading')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            {t('global.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  if (!vehicalView) {
    return (
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('global.view', {name: t('vehical.vehicals')})}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('global.noDataAvailable')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            {t('global.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const content =
    contentType === 'view' ? (
      <AttachmentViewer id={id} form_code='frm-08' onClose={closeModal} />
    ) : null

  return (
    <>
      <Modal show onHide={onClose} size='xl' backdrop='static'>
        <Modal.Header>
          <Modal.Title>{t('global.view', {name: t('vehical.vehicals')})}</Modal.Title>
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
          <RecordOwnerView
            title={t('global.recordOwner')}
            icon='fa fa-user-plus'
            ownerName={vehicalView.ownerName}
            departmentName={vehicalView.createdDepartment}
            province={vehicalView.createdLocation}
            created_at={vehicalView.created_at}
          />

          <Row className='mt-6'>
            <Col md={3}>
              <p>
                <strong>{t('vehical.vehical_type')}:</strong> {vehicalView.vehical_type}
              </p>
              <p style={{marginTop: '40px'}}>
                <strong>{t('vehical.vehical_ownership')}:</strong> {vehicalView.vehical_ownership}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('vehical.vehical_platte_no')}:</strong> {vehicalView.vehical_platte_no}
              </p>
              <p style={{marginTop: '40px'}}>
                <strong>{t('vehical.vehical_color')}:</strong> {vehicalView.vehical_color}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('vehical.engine_no')}:</strong> {vehicalView.engine_no}
              </p>
              <p style={{marginTop: '40px'}}>
                <strong>{t('vehical.shasi_no')}:</strong> {vehicalView.shasi_no}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('vehical.license_start_date')}:</strong> {vehicalView.license_start_date}
              </p>
              <p style={{marginTop: '40px'}}>
                <strong>{t('vehical.license_end_date')}:</strong> {vehicalView.license_end_date}
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

export default ViewModal
