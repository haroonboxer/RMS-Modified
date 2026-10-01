import CustomModal from 'app/customes/CustomModal'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import RecordOwnerView from 'helpers/RecordOwnerView'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { viewEmployee } from 'redux/rms/employees/employeeSlice'
import { provinces, districts } from 'helpers/provincesAndDistrictsJson'

interface Props {
  id: number
  onClose: () => void
}

const EmployeeViewModal: React.FC<Props> = ({ id, onClose }) => {
  const dispatch = useAppDispatch()
  const { employeeView, loading } = useAppSelector((state) => state.employee)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contentType, setContentType] = useState('')

  // Helper functions to get province and district names
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
      content = <AttachmentViewer id={id} form_code='frm-03' onClose={closeModal} />
      break
    default:
      content = null
  }

  useEffect(() => {
    if (id) {
      dispatch(viewEmployee({ id }))
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('employee.loadingDetails')}</Modal.Title>
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

  if (!employeeView) {
    return (
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('employee.noData')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('employee.noDataAvailable')}</p>
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
          <Modal.Title>{t('global.view', { name: t('employee.employees') })}</Modal.Title>
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
            ownerName={employeeView.ownerName}
            departmentName={employeeView.createdDepartment}
            province={employeeView.createdLocation}
            created_at={employeeView.created_at}
          />

          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={3}>
              <p>
                <strong>{t('employee.name')}:</strong> {employeeView.name}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('employee.last_name')}:</strong> {employeeView.last_name}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('employee.f_name')}:</strong> {employeeView.f_name}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('employee.g_f_name')}:</strong> {employeeView.g_f_name}
              </p>
            </Col>
          </Row>

          <Row className='mt-6 background-f5 p-3 rounded'>
            <Col md={3}>
              <p>
                <strong>{t('employee.phone')}:</strong> {employeeView.phone}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('employee.country')}:</strong> {employeeView.country}
              </p>
            </Col>
            <Col md={3}>
              <p>
                <strong>{t('employee.criminalRecord')}:</strong>&nbsp;&nbsp;
                {employeeView.none_criminal_record === 'yes' ? t('global.yes') : t('global.no')}
              </p>
            </Col>
            <Col md={3}>
              {employeeView.none_criminal_record_info && (
                <p>
                  <strong>{t('employee.criminalRecordInfo')}:</strong>&nbsp;&nbsp;
                  {employeeView.none_criminal_record_info}
                </p>
              )}
            </Col>
          </Row>

          <Row className='mt-6 background-f5 p-3 rounded'>
            {(employeeView.country === "Afghanistan" || employeeView.country === "افغانستان") ? (
              <>
                {/* Main Address Row */}
                <Row className='mt-2'>
                  <Col md={4}>
                    <p>
                      <strong>{t('employee.main_province')}:</strong> {getProvinceName(employeeView.main_province)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <strong>{t('employee.main_district')}:</strong> {getDistrictName(employeeView.main_district)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <strong>{t('employee.main_village')}:</strong> {employeeView.main_village}
                    </p>
                  </Col>
                </Row>

                {/* Current Address Row */}
                <Row className='mt-2'>
                  <Col md={4}>
                    <p>
                      <strong>{t('employee.current_province')}:</strong> {getProvinceName(employeeView.current_province)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <strong>{t('employee.current_district')}:</strong> {getDistrictName(employeeView.current_district)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <strong>{t('employee.current_village')}:</strong> {employeeView.current_village}
                    </p>
                  </Col>
                </Row>
              </>
            ) : (
              /* Non-Afghanistan Case */
              <Row>
                <Col md={12}>
                  {employeeView.type_residence_info && (
                    <p>
                      <strong>{t('employee.residenceInfo')}:</strong> {employeeView.type_residence_info}
                    </p>
                  )}
                </Col>
              </Row>
            )}
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

export default EmployeeViewModal