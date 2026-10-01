import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import persian_fa from 'helpers/persian_fa'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import { defaultPrintedCard, PrintedCard } from '../__model'
import { storePrintedCard } from 'redux/rms/printedCard/printedCardSlice'
import PrintedCardCreateForm from './PrintedCardCreateForm'

interface ContractCreateProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

const PrintedCardCreate: React.FC<ContractCreateProps> = ({ showModal, setShowModal, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PrintedCard>(defaultPrintedCard)
  const [files, setFiles] = useState<File[]>([])
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOC', 'DOCX']
  const { id } = useParams<{ id: string }>()

  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleSubmit = async (values: PrintedCard) => {
    setLoading(true)
    try {
      const formData = new FormData()

      formData.append('card_type', values.card_type || '');
      formData.append('weapons', values.weapons || '');
      formData.append('project_name_dr', values.project_name_dr || '');
      formData.append('project_name_en', values.project_name_en || '');
      formData.append('card_perimeter_dr', values.card_perimeter_dr || '');
      formData.append('card_perimeter_en', values.card_perimeter_en || '');
      formData.append('issued_date', values.issued_date || '');
      formData.append('expire_date', values.expire_date || '');

      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })

      if (id) {
        formData.append('company_id', id)
      }

      await dispatch(storePrintedCard(formData)).unwrap()
      toast.success(t('Card created successfully!'))
      setShowModal(false)
      onSuccess()
      setFiles([])
    } catch (error) {
      toast.error(t('Error creating card. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PrintedCardCreateForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      initialData={formData}
      loading={loading}
      handleDrop={handleDrop}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      files={files}
      DatePicker={DatePicker}
      persian_fa={persian_fa}
      persian={persian}
      handleSubmit={handleSubmit} />
  )
}

export default PrintedCardCreate