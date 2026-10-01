import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import {t} from 'i18next'
import {AppDispatch} from 'redux/store'
import {changeStatus} from 'redux/rms/boss/bossSlice'
import {Modal, Button, Col, Row} from 'react-bootstrap'
import {FileUploader} from 'react-drag-drop-files'

interface StatusModalProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: (newStatus: number) => void
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
  const dispatch = useDispatch<AppDispatch>()
  const [status, setStatus] = useState<number>(currentStatus)
  const [reasonDismissed, setReasonDismissed] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])

  const fileTypes = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const maxFileSize = 4 * 1024 * 1024

  const handleDrop = (fileList: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...fileList])
  }

  const handleClose = () => {
    setShowModal(false)
    setFiles([])
    setReasonDismissed('')
  }

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!companyId) {
      toast.error('Invalid boos ID.')
      return
    }

    const formData = new FormData()
    formData.append('id', companyId.toString())
    formData.append('status', status.toString())
    formData.append('reason_dismissed', reasonDismissed)

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
        onSuccess(status)
        toast.success('موفقانه انجام شد.')
        handleClose()
      })
      .catch((error: any) => {
        toast.error(`Failed to update status: ${error?.message || 'Unknown error'}`)
      })
  }

  return (
    <Modal show={showModal} onHide={handleClose} backdrop='static' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('boss.statusChange')}</Modal.Title>
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
            <label htmlFor='reason_dismissed'>{t('boss.reason_dismissed') || 'توضیحات'}</label>
            <textarea
              id='reason_dismissed'
              className='form-control mt-2'
              style={{height: '100px'}}
              value={reasonDismissed}
              onChange={(e) => setReasonDismissed(e.target.value)}
            />
          </Col>
        </Row>

        <Row className='mt-4'>
          <Col>
            <FileUploader
              multiple
              handleChange={handleDrop}
              name='file'
              types={fileTypes}
              maxSize={4}
              label='Upload files'
              hoverTitle='Drop here'
              onTypeError={() =>
                toast.error(<p className='fs-4 fw-bold'>Invalid file type or size</p>)
              }
            />
            {files.length > 0 && (
              <ul className='mt-3 list-unstyled'>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name}
                    <span
                      className='ms-2 text-danger cursor-pointer'
                      onClick={() => handleFileRemove(index)}
                    >
                      <i className='fas fa-times fs-5'></i>
                    </span>
                  </li>
                ))}
              </ul>
            )}
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
