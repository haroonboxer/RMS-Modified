import React from 'react'
import CustomModal from 'app/customes/CustomModal'
import {WeaponView} from '../__model'
import GunDataTable from '../gun/list/GunDataTable'
import {useNavigate} from 'react-router-dom'

interface Props {
  content: JSX.Element | null
  isModalOpen: boolean
  t: any
  weaponData: WeaponView & {
    weapons?: Array<{
      id: number
      type: string
      serial_number: string
      status: string
      date: string
    }>
  }
  to_jalali: (date: string, withTime: boolean) => string
  RecordOwnerView: React.ComponentType<{
    title: string
    ownerName: string
    departmentName: string
    province: string
    created_at: string
  }>
  closeModal: () => void
  openModal: (contentType?: string, weaponId?: number, companyId?: number) => void
  isLoading?: boolean
}

const WeaponViewForm = ({
  t,
  weaponData,
  to_jalali,
  RecordOwnerView,
  content,
  isModalOpen,
  openModal,
  closeModal,
  isLoading = false,
}: Props) => {
  const navigate = useNavigate()

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='d-flex justify-content-between w-100'>
          <div className='card-title'>
            <h3>{t('global.view', {name: t('weapon.weap')})}</h3>
          </div>
          <div className='card-title'>
            <button
              className='btn btn-sm btn-flex btn-primary fw-bold me-2'
              onClick={() => openModal('view')}
            >
              <i className='fas fa-camera fs-5 me-2'></i>
              {t('global.viewAttachment')}
            </button>
            <button className='btn btn-sm btn-danger fw-bold' onClick={() => navigate(-1)}>
              {t('global.back')}
            </button>
          </div>
        </div>
      </div>

      <div className='card-body'>
        <RecordOwnerView
          title={t('global.recordOwner')}
          ownerName={weaponData.createdBy}
          departmentName={weaponData.createdDepartment}
          province={weaponData.createdLocation}
          created_at={to_jalali(weaponData.created_at, true)}
        />

        <div className='col-lg-12 row mt-4 mx-4'>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>
              {t('weapon.numberOfWeapons')}:
            </label>
            <span className='label fs-4'>{weaponData.number_of_weapons}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('weapon.oizNo')}:</label>
            <span className='label fs-4'>{weaponData.slip_no}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('weapon.oizDate')}:</label>
            <span className='label fs-4'>{weaponData.slip_date}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('weapon.amount')}:</label>
            <span className='label fs-4'>{weaponData.money_amount}</span>
          </div>
        </div>

        <div className='col-lg-12 row mt-4 mx-4'>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('weapon.status')}:</label>
            <span
              className={`fs-5 badge ${
                weaponData.status === 1 ? 'badge-success' : 'badge-warning'
              }`}
            >
              {weaponData.status === 1 ? t('global.approved') : t('global.pending')}
            </span>
          </div>
          <div className='col-lg-4 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('weapon.remarks')}:</label>
            <span className='label fs-4'>{weaponData.reason_dismissed || '-'}</span>
          </div>
        </div>

        <GunDataTable
          companyId={weaponData.company_id}
          weaponId={weaponData.id}
          to_jalali={to_jalali}
        />
      </div>

      <CustomModal
        modalContent={content}
        show={isModalOpen}
        onClose={closeModal}
        modalSize='sm'
        modalTile={t('global.viewAttachment')}
      />
    </div>
  )
}

export default WeaponViewForm
