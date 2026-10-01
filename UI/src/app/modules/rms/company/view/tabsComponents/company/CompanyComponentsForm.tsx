import CustomModal from 'app/customes/CustomModal'

const CompanyComponentsForm = ({
  t,
  companyData,
  to_jalali,
  RecordOwnerView,
  openModal,
  content,
  isModalOpen,
  closeModal,
}: any) => {
  return (
    <div className='card' id='kt_profile_details_view'>
      <div className='card-header cursor-pointer'>
        <div className='card-title d-flex justify-content-between align-items-center m-0 flex-row-reverse'>
          <h3 className='fw-bolder m-0'>
            <i className='fas fa-list fs-3 text-primary ms-2'></i>
            {t('global.view', {name: t('company.CompanyCreate')})}
          </h3>
        </div>
        <div className='card-title d-flex justify-content-between align-items-center m-0 flex-row-reverse'>
          <button
            className='btn btn-sm btn-flex btn-primary fw-bold ms-2'
            onClick={() => openModal('view')}
          >
            <i className='fas fa-camera fs-5 me-2'></i>
            {t('global.viewAttachment')}
          </button>
        </div>
      </div>

      <div className='card-body'>
        <RecordOwnerView
          title={t('global.recordOwner')}
          icon={'fa fa-user-plus'}
          ownerName={companyData.record.createdBy}
          departmentName={companyData.record.createdDepartment}
          province={companyData.record.createdLocation}
          created_at={to_jalali(companyData.record.created_at, true)}
        />
        <div className='col-lg-12 row mt-6'>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>
              {t('company.company_en')}:
            </label>
            <span className='label fs-4'>{companyData.record.company_en}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>
              {t('company.company_pa')}:
            </label>
            <span className='label fs-4'>{companyData.record.company_pa}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>
              {t('company.company_dr')}:
            </label>
            <span className='label fs-4'>{companyData.record.company_dr}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <div
              className='image-container'
              style={{position: 'relative', width: '100px', height: '100px'}}
            >
              <label className='col-form-label label fs-4 fw-bold me-2'>{t('company.icon')}:</label>
              <img
                src={companyData.record.icon}
                alt='Company Icon'
                loading='eager'
                className='img-fluid rounded border'
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            </div>
          </div>
        </div>
        <div className='col-lg-12 row'>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('company.status')}:</label>
            <span
              className={`fs-5 badge ${
                companyData.record.status === 1 ? 'badge-success' : 'badge-warning'
              }`}
            >
              {companyData.record.status === 1 ? 'تایید شده' : 'در حال انتظار'}
            </span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>
              {t('company.royalty')}:
            </label>
            <span className='label fs-4'>
              {companyData.record.haq_alamatyaz === 'yes' ? 'دارد' : 'ندارد'}
            </span>
          </div>
        </div>

        {companyData.record.haq_alamatyaz === 'yes' && (
          <div className='col-lg-12 row mt-6'>
            <div className='col-lg-3 col-md-3 col-sm-6'>
              <label className='col-form-label label fs-4 fw-bold me-2'>
                {t('company.hanging_date')}:
              </label>
              <span className='label fs-4'>{companyData.record.hanging_date}</span>
            </div>
            <div className='col-lg-3 col-md-3 col-sm-6'>
              <label className='col-form-label label fs-4 fw-bold me-2'>
                {t('company.oizNumber')}:
              </label>
              <span className='label fs-4'>{companyData.record.bank_account_number}</span>
            </div>
            <div className='col-lg-3 col-md-3 col-sm-6'>
              <label className='col-form-label label fs-4 fw-bold me-2'>
                {t('company.amount_of_money')} :
              </label>
              <span className='label fs-4'>{companyData.record.amount_of_money}</span>
            </div>
          </div>
        )}
        <div className='col-lg-12 row mt-6'>
          <div className='col-lg-12 col-md-12 col-sm-12'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('company.remark')}:</label>
            <span className='label fs-4'>{companyData.record.reason_dismissed}</span>
          </div>
        </div>
      </div>
      <CustomModal
        modalContent={content}
        show={isModalOpen}
        onClose={closeModal}
        modalSize='lg'
        modalTile={t('global.viewAttachment')}
      />
    </div>
  )
}

export default CompanyComponentsForm
