import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { PrintedCard } from '../__model'
import PrintedCardEditForm from './PrintedCardEditForm'
import persian_fa from 'helpers/persian_fa'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import { updatePrintedCard } from 'redux/rms/printedCard/printedCardSlice'

interface PrintedCardEditProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  printedCardData: PrintedCard & { id: number }
  onSuccess: () => void
}

const PrintedCardEdit: React.FC<PrintedCardEditProps> = ({
  showModal,
  setShowModal,
  printedCardData,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const [formData, setFormData] = useState<PrintedCard & { id: number }>({
    ...printedCardData,
  })

  const handleFileRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }
  const handleDrop = (fileList: File[]) => {
    setFiles([...files, ...fileList])
  }

  useEffect(() => {
    if (printedCardData) {
      setFormData({
        ...printedCardData,
      })
    }
  }, [printedCardData])

  const handleSubmit = async (values: PrintedCard & { id: number }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      console.log('=======>>>>', formData)
      formData.append('weapons', values.weapons);
      formData.append('card_type', values.card_type);
      formData.append('project_name_dr', values.project_name_dr);
      formData.append('project_name_en', values.project_name_en);
      formData.append('card_perimeter_dr', values.card_perimeter_dr);
      formData.append('card_perimeter_en', values.card_perimeter_en);
      formData.append('issued_date', values.issued_date);
      formData.append('expire_date', values.expire_date);

      if (id) {
        formData.append('company_id', id);
      }

      files.forEach((file) => {
        formData.append('attachments[]', file);
      });

      await dispatch(updatePrintedCard({ id: printedCardData.id, formData })).unwrap();
      toast.success(t('contract.Contract_updated_successfully'));
      setShowModal(false);
      onSuccess();
    } catch (error) {
      toast.error(t('Error updating Contract. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrintedCardEditForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      handleSubmit={handleSubmit}
      initialData={formData}
      loading={loading}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      handleDrop={handleDrop}
      files={files}
      DatePicker={DatePicker}
      persian_fa={persian_fa}
      persian={persian}
    />
  )
}

export default PrintedCardEdit
