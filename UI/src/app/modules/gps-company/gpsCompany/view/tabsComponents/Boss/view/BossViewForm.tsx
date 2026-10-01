import {useParams} from 'react-router-dom'
import CustomModal from 'app/customes/CustomModal'

const BossViewForm = ({
  t,
  bossData,
  to_jalali,
  RecordOwnerView,
  openModal,
  content,
  isModalOpen,
  closeModal,
}: any) => {
  const {id} = useParams<{id: string}>()

  return (
    <div className='card' id='kt_profile_details_view'>
      <div className='card-header cursor-pointer'>
        <div className='card-title d-flex justify-content-between align-items-center m-0 flex-row-reverse'>
          <h3 className='fw-bolder m-0'>{t('global.view', {name: t('boss.boss')})}</h3>
        </div>
        <div className='card-title d-flex justify-content-between align-items-center m-0 flex-row-reverse'>
          <button
            className='btn btn-sm btn-flex btn-primary fw-bold'
            onClick={() => openModal('attachment')}
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
          ownerName={bossData.record.createdBy}
          departmentName={bossData.record.createdDepartment}
          province={bossData.record.createdLocation}
          created_at={to_jalali(bossData.record.created_at, true)}
        />

        <div className='col-lg-12 row mt-6'>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('boss.name_dr')}</label>
            <span className='label fs-4'>{bossData.record.name_dr}</span>
            <br />
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('boss.name_en')}</label>
            <span className='label fs-4'>{bossData.record.name_en}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>
              {t('boss.last_name_dr')}
            </label>
            <span className='label fs-4'>{bossData.record.last_name_dr}</span>
            <br />
            <label className='col-form-label label fs-4 fw-bold me-2'>
              {t('boss.last_name_en')}
            </label>
            <span className='label fs-4'>{bossData.record.last_name_en}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('boss.f_name_da')}</label>
            <span className='label fs-4'>{bossData.record.f_name_da}</span>
            <br />
            <label className='col-form-label label fs-4 fw-bold me-2'>{t('boss.email')}:</label>
            <span className='label fs-4'>{bossData.record.email}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <div
              className='image-container'
              style={{position: 'relative', width: '100px', height: '100px'}}
            >
              <label className='col-form-label label fs-4 fw-bold me-2'>{t('boss.photo')}:</label>
              <img
                src={bossData.record.photo}
                alt='Boss Photo'
                className='img-fluid rounded border'
                style={{width: '100px', height: '100px', objectFit: 'cover'}}
              />
            </div>
          </div>
        </div>

        <div className='col-lg-12 row mt-6'>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>شماره تماس:</label>
            <span className='label fs-4'>{bossData.record.phone}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>شماره پاسپورت:</label>
            <span className='label fs-4'>{bossData.record.passport_no}</span>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>کشور :</label>
            <span className='label fs-4'>{bossData.record.country}</span>
          </div>
        </div>

        {bossData.record.country === 'Afghanistan' || bossData.record.country === 'افغانستان' ? (
          <>
            <div className='row background-f4 p-5 mt-6' style={{marginRight: '-2px'}}>
              <fieldset className='m-0 p-0 fieldSetBorder'>
                <legend className='fs-3 text-primary'>
                  <b>
                    &nbsp;
                    <i className={'text-primary fs-2 ms-1'}>{t('boss.main_province')} </i>
                  </b>
                </legend>
                <div className='row m-1'>
                  <div className='col-lg-12 row'>
                    <div className='col-lg-4 col-md-3 col-sm-6'>
                      <label className='col-form-label label fs-4 fw-bold me-2'>
                        <i className='fa fa-archway fs-4 text-primary me-1'></i>{' '}
                        {t('global.province')}:
                      </label>
                      <span className='label fs-4'>{bossData.record.mainProvince}</span>
                    </div>
                    <div className='col-lg-4 col-md-3 col-sm-6'>
                      <label className='col-form-label label fs-4 fw-bold me-2'>
                        <i className='fa fa-archway fs-4 fw-bold text-primary me-1'></i>
                        {t('global.district')}:
                      </label>
                      <span className='label fs-4'>{bossData.record.mainDistrict}</span>
                    </div>
                    <div className='col-lg-4 col-md-3 col-sm-6'>
                      <label className='col-form-label label fs-4 fw-bold me-2'>
                        <i className='fa fa-archway text-primary fs-4 me-1'></i>
                        {t('global.village')}:
                      </label>
                      <span className='label fs-4'>{bossData.record.main_village}</span>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className='row background-f4 p-5 mt-6' style={{marginRight: '-2px'}}>
              <fieldset className='m-0 p-0 fieldSetBorder'>
                <legend className='fs-3 text-primary'>
                  <b>
                    &nbsp;
                    <i className={'text-primary fs-2 ms-1'}>{t('boss.current_province')} </i>
                  </b>
                </legend>
                <div className='row m-1'>
                  <div className='col-lg-12 row'>
                    <div className='col-lg-4 col-md-3 col-sm-6'>
                      <label className='col-form-label label fs-4 fw-bold me-2'>
                        <i className='fa fa-archway fs-4 text-primary me-1'></i>{' '}
                        {t('global.province')}:
                      </label>
                      <span className='label fs-4'>{bossData.record.currentProvince}</span>
                    </div>
                    <div className='col-lg-4 col-md-3 col-sm-6'>
                      <label className='col-form-label label fs-4 fw-bold me-2'>
                        <i className='fa fa-archway fs-4 fw-bold text-primary me-1'></i>
                        {t('global.district')}:
                      </label>
                      <span className='label fs-4'>{bossData.record.currentDistrict}</span>
                    </div>
                    <div className='col-lg-4 col-md-3 col-sm-6'>
                      <label className='col-form-label label fs-4 fw-bold me-2'>
                        <i className='fa fa-archway text-primary fs-4 me-1'></i>
                        {t('global.village')}:
                      </label>
                      <span className='label fs-4'>{bossData.record.current_village}</span>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </>
        ) : (
          <div className='row background-f4 p-5 mt-6' style={{marginRight: '-2px'}}>
            <fieldset className='m-0 p-0 fieldSetBorder'>
              <legend className='fs-3 text-primary'>
                <b>
                  &nbsp;
                  <i className='fa fa-home fs-4 text-primary me-1'></i>
                  <i className={'text-primary fs-2 ms-1'}>{t('boss.type_residence_info')} </i>
                </b>
              </legend>
              <div className='col-lg-12 row'>
                <div
                  style={{height: '100px', marginTop: '20px'}}
                  className='col-lg-4 col-md-3 col-sm-6'
                >
                  <span className='label fs-4 p-4 mx-5'>{bossData.record.type_residence_info}</span>
                </div>
              </div>
            </fieldset>
          </div>
        )}

        <div className='row background-f4 p-5 mt-6' style={{marginRight: '-2px'}}>
          <div className='col-lg-3 col-md-3 col-sm-6'>
            <label className='col-form-label label fs-4 fw-bold me-2'>
              {t('boss.reason_dismissed')} :
            </label>
            <span className='label fs-4'>{bossData.record.reason_dismissed}</span>
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

export default BossViewForm
