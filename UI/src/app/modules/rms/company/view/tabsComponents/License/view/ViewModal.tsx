import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import RecordOwnerView from 'helpers/RecordOwnerView'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { provinces, districts } from 'helpers/provincesAndDistrictsJson'
import { viewLicense } from 'redux/rms/license/licenseSlice'

interface Props {
  id: number
  onClose: () => void
}

const LicenseViewModal: React.FC<Props> = ({ id, onClose }) => {
  const dispatch = useAppDispatch()
  const { licenseView, loading, error } = useAppSelector((state) => state.license)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contentType, setContentType] = useState('')

  const getProvinceName = (provinceId: string) => {
    const province = provinces.find(p => String(p.value) === String(provinceId))
    return province ? province.label : provinceId
  }

  const getDistrictName = (districtId: string) => {
    const district = districts.find(d => String(d.districtcode) === String(districtId))
    return district ? district.label : districtId
  }

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
      content = <AttachmentViewer id={id} form_code='frm-06' onClose={closeModal} />
      break
    default:
      content = null
  }

  useEffect(() => {
    if (id) {
      dispatch(viewLicense({ id }))
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('license.loadingDetails')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">{t('global.loading')}</p>
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

  if (!licenseView) {
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
          <Modal.Title>{t('global.view', { name: t('license.license') })}</Modal.Title>
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
            ownerName={licenseView.ownerName}
            departmentName={licenseView.createdDepartment}
            province={licenseView.createdLocation}
            created_at={licenseView.created_at}
          />

          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={3}>
              <p>
                <strong>{t('license.license_type')}:</strong> {t(`license.type.${licenseView.license_type}`)}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('license.slip_no')}:</strong> {licenseView.slip_no}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('license.fee')}:</strong> {licenseView.fee}
              </p>
            </Col>

            <Col md={3}>
              <p>
                <strong>{t('license.license_date')}:</strong> {licenseView.license_date}
              </p>
            </Col>
          </Row>

          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={3}>
              <p>
                <strong>{t('license.issue_date')}:</strong> {licenseView.issue_date}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('license.validity_date')}:</strong> {licenseView.validity_date}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('license.jawaz_status')}:</strong>
                <span className={`badge ${licenseView.status === 1 ? 'bg-success' : 'bg-danger'} ms-2`}>
                  {licenseView.status === 1 ? t('license.active') : t('license.inactive')}
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
      </Modal >

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

export default LicenseViewModal