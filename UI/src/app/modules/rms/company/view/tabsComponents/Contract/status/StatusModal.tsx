import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import {t} from 'i18next'
import {AppDispatch} from 'redux/store'
import {Modal, Button} from 'react-bootstrap'
import {changeStatus} from 'redux/rms/contract/contractSlice'

interface StatusModalProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
  currentStatus: number
  contractId: number
}

export default function StatusModal({
  showModal,
  setShowModal,
  onSuccess,
  currentStatus,
  contractId,
}: StatusModalProps) {
  const [status, setStatus] = useState<number>(currentStatus || 0)
  const dispatch = useDispatch<AppDispatch>()

  const handleClose = () => {
    setShowModal(false)
  }

  const handleSave = () => {
    if (!contractId) {
      toast.error('This is toast error')
      return
    }

    dispatch(changeStatus({id: contractId, status}))
      .unwrap()
      .then(() => {
        onSuccess()
        toast.success('موفقانه انجام شد.')
        handleClose()
      })
      .catch((error: any) => {
        toast.error(`Failed to update status: ${error}`)
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
    onSuccess()
  }, [showModal])

  return (
    <Modal show={showModal} onHide={handleClose} backdrop='static' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('contract.changeStatus')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <select
          className='form-select'
          value={status}
          onChange={(e) => setStatus(Number(e.target.value))}
        >
          <option value={1}>{t('boss.status_active')}</option>
          <option value={0}>{t('global.status_pending')}</option>
          <option value={4}>{t('global.rejected')}</option>
          <option value={2}>{t('global.expired')}</option>
        </select>
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
