import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { t } from 'i18next'
import { AppDispatch } from 'redux/store'
import { Modal, Button, Col, Row } from 'react-bootstrap'
import { FileUploader } from 'react-drag-drop-files'
import { changeStatus } from 'redux/workshop/company/workshopCompanySlice'

interface StatusModalProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
  currentStatus: number
  companyId: number
}

export default function StatusModal({
  showModal,
  setShowModal,
  onSuccess,
  currentStatus,
  companyId,
}: StatusModalProps) {
  const [status, setStatus] = useState<number>(currentStatus || 0)
  const dispatch = useDispatch<AppDispatch>()
  const [reasonDismissed, setReasonDismissed] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }
  const handleClose = () => {
    setShowModal(false)
    setFiles([])
    setReasonDismissed('')
  }
  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleSave = () => {
    if (!companyId) {
      toast.error('Invalid company ID.')
      return
    }

    const formData = new FormData()
    formData.append('id', companyId.toString())
    formData.append('status', status.toString())
    formData.append('reason_dismissed', reasonDismissed)

    const maxFileSize = 4 * 1024 * 1024

    files.forEach((file) => {
      if (file.size <= maxFileSize) {
        formData.append('attachments[]', file)
      } else {
        toast.error(`${file.name} exceeds maximum file size (4MB).`)
      }
    })

    dispatch(changeStatus(formData as any))
      .unwrap()
      .then(() => {
        onSuccess()
        toast.success('موفقانه انجام شد.')
        handleClose()
      })
      .catch((error: any) => {
        toast.error(`Failed to update status: ${error?.message || 'Unknown error'}`)
      })
  }

  useEffect(() => {
    if (showModal) {
      const modalElement = document.getElementById('statusModal')
      if (modalElement && window.bootstrap) {
        const bootstrapModal = new window.bootstrap.Modal(modalElement)
        bootstrapModal.show()
        return () => {
          bootstrapModal.hide()
        }
      } else {
        console.error('Bootstrap Modal is not available.')
      }
    }
  }, [showModal])

  return (
    <Modal show={showModal} onHide={handleClose} backdrop='static' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('status.company_edit')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <select
              className='form-select'
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              <option value={1}>{t('company.status_active')}</option>
              <option value={0}>{t('company.status_pending')}</option>
            </select>
          </Col>
        </Row>

        <Row className='mt-4'>
          <Col>
            <label htmlFor='reason_dismissed'>{t('boss.reason_dismissed')}</label>
            <textarea
              id='reason_dismissed'
              className='form-control mt-2'
              style={{ height: '100px' }}
              value={reasonDismissed}
              onChange={(e) => setReasonDismissed(e.target.value)}
            />
          </Col>
        </Row>

        <Row className='mt-4'>
          <Col>
            <FileUploader
              multiple={true}
              handleChange={handleDrop}
              onDrop={handleDrop}
              name='file'
              types={fileType}
              required={false}
              hoverTitle='upload files'
              maxSize={4}
              label='upload files'
              onTypeError={() =>
                toast.error(<p className='fs-4 fw-bold'>Invalid file type or size</p>)
              }
            />
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <span onClick={() => handleFileRemove(index)}>
                    <i className='fas fa-times fs-4 text-danger mt-2 ms-2 bg-light-dark shadow cursor-pointer'></i>
                  </span>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className='d-flex justify-content-between'>
        <Button variant='primary' onClick={handleSave}>
          {t('status.save')}
        </Button>
        <Button variant='danger' onClick={handleClose}>
          {t('status.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
