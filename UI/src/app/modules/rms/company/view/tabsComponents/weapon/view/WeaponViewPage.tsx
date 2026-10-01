import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {useAppDispatch} from 'redux/hooks'
import Loader from 'app/pages/loading/Loader'
import {to_jalali} from 'helpers/DateConverter'
import RecordOwnerView from 'helpers/RecordOwnerView'
import WeaponViewForm from './WeaponViewForm'
import {defaultWeaponView, WeaponView} from '../__model'
import {view} from 'redux/rms/weapon/weaponSlice'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'

const WeaponViewPage = () => {
  const {WeaponId, CompanyId} = useParams<{WeaponId: string; CompanyId: string}>()

  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const [weaponData, setWeaponData] = useState<WeaponView>(defaultWeaponView)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contentType, setContentType] = useState('')
  const [modalId, setModalId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const openModal = (contentType = '', id?: number) => {
    setContentType(contentType)
    setModalId(id || null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setContentType('')
    setModalId(null)
  }

  let content: JSX.Element | null = null
  switch (contentType) {
    case 'view':
      content = <AttachmentViewer id={WeaponId} form_code='frm-7' onClose={closeModal} />
      break
    default:
      content = null
  }

  useEffect(() => {
    const fetchWeaponData = async () => {
      if (WeaponId) {
        try {
          setLoading(true)
          const response = await dispatch(view(Number(WeaponId)))
          if (response.meta.requestStatus === 'fulfilled') {
            setWeaponData({
              ...response.payload,
              weapons: response.payload.weapons || [],
            })
          } else {
            setError(t('errors.failedToLoadData'))
          }
        } catch (err) {
          setError(t('errors.unexpectedError'))
        } finally {
          setLoading(false)
        }
      }
    }

    fetchWeaponData()
  }, [WeaponId, dispatch])

  if (loading && !weaponData.id) {
    return <Loader />
  }

  if (error) {
    return (
      <div className='alert alert-danger' role='alert'>
        {error}
      </div>
    )
  }

  return (
    <WeaponViewForm
      t={t}
      weaponData={weaponData}
      to_jalali={to_jalali}
      RecordOwnerView={RecordOwnerView}
      content={content}
      isModalOpen={isModalOpen}
      openModal={openModal}
      closeModal={closeModal}
      isLoading={loading}
    />
    
  )
}

export default WeaponViewPage
