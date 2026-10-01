import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Contract } from '../__model'
import ContractEditForm from './ContractEditForm'
import { updateContract } from 'redux/rms/contract/contractSlice'

interface EmployeeEditProps {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  contractData: Contract & { id: number }
  onSuccess: () => void
}

const ContractEdit: React.FC<EmployeeEditProps> = ({
  showModal,
  setShowModal,
  contractData,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const fileType = ['JPEG', 'PNG', 'JPG', 'PDF', 'DOCX']
  const [formData, setFormData] = useState<Contract & { id: number }>({
    ...contractData,
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
    if (contractData) {
      setFormData({
        ...contractData,
      })
    }
  }, [contractData])

  const handleSubmit = async (values: Contract & { id: number }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('contract_source', values.contract_source)
      formData.append('contract_location', values.contract_location)
      formData.append('contract_start_date', values.contract_start_date)
      formData.append('contract_end_date', values.contract_end_date)
      formData.append('afghan_personal_count', values.afghan_personal_count.toString())
      formData.append('ext_personal_count', values.external_personal_count.toString())
      formData.append('ammo_count', values.ammo_count.toString())
      formData.append('vehical_count', values.vehical_count.toString())
      formData.append('walkie_talkie_count', values.walkie_talkie_count.toString())
      formData.append('equipments_value', values.equipments_value.toString())
      formData.append('other_equipments', values.other_equipments || '')

      if (id) {
        formData.append('company_id', id);
      }

      files.forEach((file) => {
        formData.append('attachments[]', file);
      });

      await dispatch(updateContract({ id: contractData.id, formData })).unwrap();
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
    <ContractEditForm
      showModal={showModal}
      handleClose={() => setShowModal(false)}
      handleSubmit={handleSubmit}
      initialData={formData}
      loading={loading}
      handleFileRemove={handleFileRemove}
      fileType={fileType}
      handleDrop={handleDrop}
      files={files}
    />
  )
}

export default ContractEdit
