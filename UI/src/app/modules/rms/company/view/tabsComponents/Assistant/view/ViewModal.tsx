import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import RecordOwnerView from 'helpers/RecordOwnerView'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {Modal, Button, Row, Col} from 'react-bootstrap'
import {useAppDispatch, useAppSelector} from 'redux/hooks'
import {viewAssistant} from 'redux/rms/assistant/assistantSlice'

interface Props {
  id: number
  onClose: () => void
}

const ViewModal: React.FC<Props> = ({id, onClose}) => {
  const dispatch = useAppDispatch()
  const {assistantView, loading} = useAppSelector((state) => state.assistant)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contentType, setContentType] = useState('')

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
      content = <AttachmentViewer id={id} form_code='frm-02' onClose={closeModal} />
      break
    default:
      content = null
  }

  useEffect(() => {
    if (id) {
      dispatch(viewAssistant({id}))
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
          <Modal.Title>{t('global.view', {name: t('assistant.assistantName')})}</Modal.Title>
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
                <strong>نام:</strong> {assistantView.name_dr}
              </p>
              <p style={{marginTop: '40px'}}>
                <strong>تخلص (انگلیسی):</strong> {assistantView.last_name_en}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>تخلص:</strong> {assistantView.last_name_dr}
              </p>
              <p style={{marginTop: '40px'}}>
                <strong>نام پدر:</strong> {assistantView.f_name_da}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>نام (انگلیسی):</strong> {assistantView.name_en}
              </p>

              <p style={{marginTop: '40px'}}>
                <strong>شماره تلفن:</strong> {assistantView.phone}
              </p>
            </Col>
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

          <Row className='mt-6'>
            <Col md={3}>
              <p>
                <strong>ایمیل:</strong> {assistantView.email}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>شماره پاسپورت:</strong> {assistantView.passport_no}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>کشور:</strong> {assistantView.country}
              </p>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row>
            <Col>
              <p style={{marginTop: '40px'}}>
                <strong>توضیحات:</strong> {assistantView.reason_dismissed}
              </p>
            </Col>
          </Row>
          {assistantView.country === 'Afghanistan' || assistantView.country === 'افغانستان' ? (
            <>
              <Row className='mt-6 background-f5 p-3 rounded'>
                <Col md={4}>
                  <p>
                    <strong>سکونت اصلی:</strong> {assistantView.mainProvince}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>ولسوالی اصلی:</strong> {assistantView.mainDistrict}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>قریه اصلی:</strong> {assistantView.main_village}
                  </p>
                </Col>
              </Row>

              <Row className='mt-6 background-f5 p-3 rounded'>
                <Col md={4}>
                  <p>
                    <strong>سکونت فعلی:</strong> {assistantView.currentProvince}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>ولسوالی فعلی:</strong> {assistantView.currentDistrict}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>قریه فعلی:</strong> {assistantView.current_village}
                  </p>
                </Col>
              </Row>
            </>
          ) : (
            <div className='row background-f4 p-5' style={{marginRight: '-2px'}}>
              <fieldset className='m-0 p-0 fieldSetBorder'>
                <legend className='fs-3 text-primary'>
                  <b>
                    &nbsp;
                    <i className='fa fa-home fs-4 text-primary me-1'></i>
                    <i className={'text-primary fs-2 ms-1'}>سایر اطلاعات سکونت</i>
                  </b>
                </legend>
                <div className='col-lg-12 row'>
                  <div
                    style={{
                      height: '100px',
                      marginTop: '20px',
                    }}
                    className='col-lg-4 col-md-3 col-sm-6'
                  >
                    <span className='label fs-4 p-4 mx-5'>{assistantView.type_residence_info}</span>
                  </div>
                </div>
              </fieldset>
            </div>
          )}
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
