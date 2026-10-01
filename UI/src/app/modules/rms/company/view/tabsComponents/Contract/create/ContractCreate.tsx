import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Contract, defaultContract } from '../__model'
import ContractCreateForm from './ContractCreateForm'
import { toast } from 'react-toastify'
import { storeContract } from 'redux/rms/contract/contractSlice'
import persian_fa from 'helpers/persian_fa'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'

interface ContractCreateProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void
}

const ContractCreate: React.FC<ContractCreateProps> = ({ showModal, setShowModal, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Contract>(defaultContract)
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

  const handleSubmit = async (values: Contract) => {
    setLoading(true)
    try {
      const formData = new FormData()


      formData.append('contract_source', values.contract_source)
      formData.append('contract_location', values.contract_location)
      formData.append('contract_start_date', values.contract_start_date)
      formData.append('contract_end_date', values.contract_end_date)
      formData.append('afghan_personal_count', String(values.afghan_personal_count))
      formData.append('ext_personal_count', String(values.external_personal_count))
      formData.append('ammo_count', String(values.ammo_count))
      formData.append('vehical_count', String(values.vehical_count))
      formData.append('walkie_talkie_count', String(values.walkie_talkie_count))
      formData.append('equipments_value', String(values.equipments_value))
      formData.append('other_equipments', values.other_equipments || '')

      if (id) {
        formData.append('company_id', id)
      }

      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })


      await dispatch(storeContract(formData)).unwrap()
      toast.success(t('Contract created successfully!'))
      setShowModal(false)
      onSuccess()
      setFiles([])
    } catch (error) {
      toast.error(t('Error creating contract. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ContractCreateForm
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

export default ContractCreate