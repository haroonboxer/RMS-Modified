import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import RecordOwnerView from 'helpers/RecordOwnerView'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {Modal, Button, Row, Col} from 'react-bootstrap'
import {useAppDispatch, useAppSelector} from 'redux/hooks'
import {viewContract} from 'redux/rms/contract/contractSlice'

interface Props {
  id: number
  onClose: () => void
}

const ContractViewModal: React.FC<Props> = ({id, onClose}) => {
  const dispatch = useAppDispatch()
  const {contractView, loading, error} = useAppSelector((state) => state.contract)
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
      content = <AttachmentViewer id={id} form_code='frm-04' onClose={closeModal} />
      break
    default:
      content = null
  }

  useEffect(() => {
    if (id) {
      dispatch(viewContract({id}))
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

  if (!contractView) {
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
          <Modal.Title>{t('global.view', {name: t('contract.contract')})}</Modal.Title>
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
            icon={'fa fa-user-plus'}
            ownerName={contractView.ownerName}
            departmentName={contractView.createdDepartment}
            province={contractView.createdLocation}
            created_at={contractView.created_at}
          />
          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={3}>
              <p>
                <strong>{t('contract.contract_source')}:</strong> {contractView.contract_source}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('contract.contract_location')}:</strong> {contractView.contract_location}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('contract.contract_start_date')}:</strong>{' '}
                {contractView.contract_start_date}
              </p>
            </Col>

            <Col md={3}>
              <p>
                <strong>{t('contract.contract_end_date')}:</strong> {contractView.contract_end_date}
              </p>
            </Col>
          </Row>

          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={3}>
              <p>
                <strong>{t('contract.afghan_personal_count')}:</strong>{' '}
                {contractView.afghan_personal_count}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('contract.ext_personal_count')}:</strong>{' '}
                {contractView.external_personal_count}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('contract.ammo_count')}:</strong> {contractView.ammo_count}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('contract.vehical_count')}:</strong> {contractView.vehical_count}
              </p>
            </Col>
          </Row>
          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={3}>
              <p>
                <strong>{t('contract.walkie_talkie_count')}:</strong>{' '}
                {contractView.walkie_talkie_count}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('contract.equipments_value')}:</strong> {contractView.equipments_value}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('contract.other_equipments')}:</strong> {contractView.other_equipments}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('contract.contract_status')}:</strong>
                <span
                  className={`badge ${contractView.status === 1 ? 'bg-success' : 'bg-danger'} ms-2`}
                >
                  {contractView.status === 1 ? t('license.active') : t('license.inactive')}
                </span>
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

export default ContractViewModal
