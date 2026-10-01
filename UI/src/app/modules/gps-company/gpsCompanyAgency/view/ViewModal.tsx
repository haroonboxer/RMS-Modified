import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import RecordOwnerView from 'helpers/RecordOwnerView'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {Modal, Button, Row, Col} from 'react-bootstrap'
import {viewGpsCompanyAgency} from 'redux/gps_company/gps_company_agency/gpsCompanyAgencySlice'
import {useAppDispatch, useAppSelector} from 'redux/hooks'

interface Props {
  id: number
  onClose: () => void
}

const ViewModal: React.FC<Props> = ({id, onClose}) => {
  const dispatch = useAppDispatch()
  const {assistantView, loading} = useAppSelector((state) => state.gpsCompanyAgency)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contentType, setContentType] = useState('')

  console.log('assistantView', assistantView)

  const openModal = (contentType = '', id = 0) => {
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
      content = (
        <AttachmentViewer id={id} form_code='frm-gps-company-assistant' onClose={closeModal} />
      )
      break
    default:
      content = null
  }

  useEffect(() => {
    if (id) {
      dispatch(viewGpsCompanyAgency({id}))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Loading Assistant Details...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Loading...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  if (!assistantView) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>No Assistant Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>No data available for this assistant.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <>
      <Modal show={true} onHide={onClose} size='xl' backdrop='static'>
        <Modal.Header>
          <Modal.Title>{t('GPSCompanies.gps_agency_view')}</Modal.Title>
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
            ownerName={assistantView.ownerName}
            departmentName={assistantView.createdDepartment}
            province={assistantView.createdLocation}
            created_at={assistantView.created_at}
          />
          <Row className='mt-6'>
            <Col md={3}>
              <p>
                <strong> اسم نماینده :</strong> {assistantView.agency_manager}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong> شماره تلیفون :</strong> {assistantView.phone}
              </p>
            </Col>
            <Col md={3}></Col>
            <Col md={3}>
              <div
                className='image-container'
                style={{position: 'relative', width: '100px', height: '100px', marginRight: '40px'}}
              >
                <label className='col-form-label label fs-4 fw-bold me-2'>عکس:</label>
                <img
                  src={assistantView.photo || 'path/to/fallback/image.png'}
                  alt='assistantPhoto'
                  className='img-fluid rounded border'
                  style={{width: '100px', height: '100px', objectFit: 'cover'}}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <p style={{marginTop: '40px'}}>
                <strong>توضیحات:</strong> {assistantView.reason_dismissed}
              </p>
            </Col>
      </Row>
          <>
            <Row className='mt-6 background-f5 p-3 rounded'>
              <Col md={4}>
                <p>
                  <strong>ولایت :</strong> {assistantView.mainProvince}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>ولسوالی :</strong> {assistantView.mainDistrict}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>قریه :</strong> {assistantView.main_village}
                </p>
              </Col>
            </Row>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={onClose}>
            خروج
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
