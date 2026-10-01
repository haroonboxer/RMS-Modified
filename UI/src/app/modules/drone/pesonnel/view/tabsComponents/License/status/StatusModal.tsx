import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import {t} from 'i18next'
import {AppDispatch} from 'redux/store'
import {Modal, Button, Col, Row} from 'react-bootstrap'
import {FileUploader} from 'react-drag-drop-files'
import {changeStatus} from 'redux/rms/license/licenseSlice'

interface StatusModalProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
  currentStatus: number
  licenseId: number
}

export default function StatusModal({
  showModal,
  setShowModal,
  onSuccess,
  currentStatus,
  licenseId,
}: StatusModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [status, setStatus] = useState<number>(currentStatus || 0)
  const [reasonDismissed, setReasonDismissed] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])

  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleClose = () => {
    setShowModal(false)
    setFiles([])
    setReasonDismissed('')
  }

  const handleSave = () => {
    if (!licenseId) {
      toast.error('Invalid License ID.')
      return
    }

    const formData = new FormData()
    formData.append('id', licenseId.toString())
    formData.append('status', status.toString())
    formData.append('reason_dismissed', reasonDismissed)

    files.forEach((file) => {
      formData.append('attachments[]', file)
    })

    dispatch(changeStatus(formData as any))
      .unwrap()
      .then(() => {
        onSuccess()
        toast.success(t('global.successMessage'))
        handleClose()
      })
      .catch(() => {
        toast.error(`${t('boss.toast_error_boss')}`)
      })
  }

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
              <option value={0}>{t('boss.status_pending')}</option>
              <option value={1}>{t('boss.status_active')}</option>
              <option value={2}>{t('global.expired')}</option>
              <option value={4}>{t('global.rejected')}</option>
            </select>
          </Col>
        </Row>

        <Row className='mt-4'>
          <Col>
            <label htmlFor='reason_dismissed'>{t('global.attachment')}</label>
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
