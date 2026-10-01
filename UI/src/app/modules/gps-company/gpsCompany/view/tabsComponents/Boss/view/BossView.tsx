import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'redux/hooks'
import Loader from 'app/pages/loading/Loader'
import {to_jalali} from 'helpers/DateConverter'
import RecordOwnerView from 'helpers/RecordOwnerView'
import {viewBoss} from 'redux/rms/boss/bossSlice'
import BossViewForm from './BossViewForm'
import {BossView, defaultBossView} from './__model'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import CustomModal from 'app/customes/CustomModal'
import {Modal} from 'react-bootstrap'

const BossDetailsView = () => {
  const [loader, setLoader] = useState(true)
  const {id} = useParams()
  const [bossData, setBossData] = useState<BossView>(defaultBossView)
  const {bossView} = useAppSelector((state) => state.boss)
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)

  useEffect(() => {
    const formData = new FormData()
    dispatch(viewBoss({id, formData} as any))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setLoader(false)
          setIsViewModalOpen(true)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [id])

  useEffect(() => {
    setBossData((prev) => ({...prev, ...bossView}))
  }, [bossView])

  const openAttachmentModal = () => {
    setIsAttachmentModalOpen(true)
  }

  const closeAttachmentModal = () => {
    setIsAttachmentModalOpen(false)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
  }

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          <Modal
            show={isViewModalOpen}
            onHide={closeViewModal}
            size='xl'
            centered
            backdrop='static'
            scrollable
          >
            <Modal.Header closeButton>
              <Modal.Title>{t('global.view', {name: t('boss.boss')})}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <BossViewForm
                t={t}
                bossData={bossData}
                to_jalali={to_jalali}
                RecordOwnerView={RecordOwnerView}
                openModal={openAttachmentModal}
              />
            </Modal.Body>
          </Modal>

          <CustomModal
            modalContent={
              <AttachmentViewer id={id} form_code='frm-W2' onClose={closeAttachmentModal} />
            }
            show={isAttachmentModalOpen}
            onClose={closeAttachmentModal}
            modalSize='lg'
            modalTile={t('global.viewAttachment')}
          />
        </>
      )}
    </>
  )
}

export default BossDetailsView
