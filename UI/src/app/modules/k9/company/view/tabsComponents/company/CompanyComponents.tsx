import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import Loader from 'app/pages/loading/Loader'
import { to_jalali } from 'helpers/DateConverter'
import RecordOwnerView from 'helpers/RecordOwnerView'
import CompanyComponentsForm from './CompanyComponentsForm'
import AttachmentViewer from 'app/modules/authentication/components/attachment/view-attachment/AttachmentViewer'
import { decryptId } from 'helpers/EncryptAndDecrypt'
import { CompanyView, defaultCompanyView } from '../__model'
import { viewCompanies } from 'redux/k9/company/k9CompanySlice'
import CustomModal from 'app/customes/CustomModal'
const CompanyComponents = () => {
  const [loader, setLoader] = useState(true)
  const { id } = useParams()
  const [companyData, setCompanyData] = useState<CompanyView>(defaultCompanyView)
  const { companyView } = useAppSelector((state) => state.k9Company)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
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

  useEffect(() => {
    const formData = new FormData()
    dispatch(viewCompanies({ id, formData } as any)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setLoader(false)
      }
      setLoader(false)
    })
  }, [id])
  useEffect(() => {
    setCompanyData((setCompanyData) => ({ ...setCompanyData, ...companyView }))
  }, [companyView])
  let content: JSX.Element | null = null

  switch (contentType) {
    case 'view':
      content = <AttachmentViewer id={decryptId(id)} form_code='frm-k9-company' onClose={closeModal} />
      break
    default:
      content = null
  }
  return (
    <>
      {!loader ? (
        <CompanyComponentsForm
          t={t}
          Link={Link}
          companyData={companyData}
          to_jalali={to_jalali}
          id={id}
          openModal={openModal}
          RecordOwnerView={RecordOwnerView}
          content={content}
          CustomModal={CustomModal}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
        />
      ) : (
        <Loader />
      )}
    </>
  )
}

export default CompanyComponents
