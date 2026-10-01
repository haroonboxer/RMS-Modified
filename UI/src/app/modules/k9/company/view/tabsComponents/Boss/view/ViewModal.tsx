import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import { to_jalali } from 'helpers/DateConverter'
import { decryptId } from 'helpers/EncryptAndDecrypt'
import RecordOwnerView from 'helpers/RecordOwnerView'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { viewBoss } from 'redux/k9/boss/K9BossSlice'

interface Props {
  data: any
  loading: boolean
  onClose: () => void
}

const ViewModal: React.FC<Props> = ({ data, loading, onClose }) => {
  const dispatch = useAppDispatch()
  const { bossView } = useAppSelector((state) => state.k9Boss)
  const { id } = useParams<{ id: string }>()
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



  useEffect(() => {
    if (data?.id) {
      dispatch(viewBoss({ id: data.id }))
    }
    console.log(data?.id)
  }, [dispatch, data?.id])



  let modalContent: JSX.Element | null = null

  switch (contentType) {
    case 'view':
      modalContent = <AttachmentViewer id={data.id} form_code='frm-k9-boss' onClose={closeModal} />
      break
    default:
      modalContent = null
  }
  if (loading) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Loading boss Details...</Modal.Title>
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

  if (!bossView) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>No boss Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>No data available for this boss.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const boss = (bossView as any).record

  return (
    <>
      <Modal show={true} onHide={onClose} size='xl' backdrop='static'>
        <Modal.Header>
          <Modal.Title>{t('global.view', { name: t('boss.BossCreate') })}</Modal.Title>
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
            icon='fa fa-user-plus'
            ownerName={boss.ownerName}
            departmentName={boss.createdDepartment}
            province={boss.createdLocation}
            created_at={to_jalali(boss.created_at, true)}

          />

          <Row className='mt-6'>
            <Col md={3}>
              <p>
                <strong>{t('boss.name_da')}:</strong> {boss.name_dr}
              </p>
              <p style={{ marginTop: '40px' }}>
                <strong>{t('boss.last_name_en')}:</strong> {boss.last_name_en}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('boss.last_name_dr')}:</strong> {boss.last_name_dr}
              </p>
              <p style={{ marginTop: '40px' }}>
                <strong>{t('boss.f_name_da')}:</strong> {boss.f_name_da}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('boss.name_en')}:</strong> {boss.name_en}
              </p>
              <p style={{ marginTop: '40px' }}>
                <strong>{t('boss.phone')}:</strong> {boss.phone}
              </p>
            </Col>
            <Col md={3}>
              <div
                className='image-container'
                style={{ position: 'relative', width: '100px', height: '100px', marginRight: '40px' }}
              >
                <label className='col-form-label label fs-4 fw-bold me-2'>{t('boss.photo')}:</label>
                <img
                  src={boss.photo || 'path/to/fallback/image.png'}
                  alt='bossPhoto'
                  className='img-fluid rounded border'
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            </Col>
          </Row>

          <Row className='mt-6'>
            <Col md={3}>
              <p>
                <strong>{t('boss.email')}:</strong> {boss.email}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('boss.passport_no')}:</strong> {boss.passport_no}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('boss.country')}:</strong> {boss.country}
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <p style={{ marginTop: '40px' }}>
                <strong>{t('boss.reason_dismissed')}:</strong> {boss.reason_dismissed}
              </p>
            </Col>
          </Row>

          {boss.country === 'Afghanistan' || boss.country === 'افغانستان' ? (
            <>
              <Row className='mt-6 background-f5 p-3 rounded'>
                <Col md={4}>
                  <p>
                    <strong>{t('boss.main_province')}:</strong> {boss.mainProvince}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>{t('boss.main_district')}:</strong> {boss.mainDistrict}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>{t('boss.main_village')}:</strong> {boss.main_village}
                  </p>
                </Col>
              </Row>
              <Row className='mt-6 background-f5 p-3 rounded'>
                <Col md={4}>
                  <p>
                    <strong>{t('boss.current_province')}:</strong> {boss.currentProvince}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>{t('boss.current_district')}:</strong> {boss.currentDistrict}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>{t('boss.current_village')}:</strong> {boss.current_village}
                  </p>
                </Col>
              </Row>
            </>
          ) : (
            <div className='row background-f4 p-5' style={{ marginRight: '-2px' }}>
              <fieldset className='m-0 p-0 fieldSetBorder'>
                <legend className='fs-3 text-primary'>
                  <b>
                    &nbsp;
                    <i className='fa fa-home fs-4 text-primary me-1'></i>
                    <i className='text-primary fs-2 ms-1'>{t('boss.type_residence_info')}</i>
                  </b>
                </legend>
                <div className='col-lg-12 row'>
                  <div
                    className='col-lg-4 col-md-3 col-sm-6'
                    style={{ height: '100px', marginTop: '20px' }}
                  >
                    <span className='label fs-4 p-4 mx-5'>{boss.type_residence_info}</span>
                  </div>
                </div>
              </fieldset>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={onClose}>
            {t('boss.back')}
          </Button>
        </Modal.Footer>
      </Modal>

      <CustomModal
        modalContent={modalContent}
        show={isModalOpen}
        onClose={closeModal}
        modalSize='sm'
        modalTile={t('global.viewAttachment')}
      />
    </>
  )
}

export default ViewModal
