import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import Loader from 'app/pages/loading/Loader'
import { to_jalali } from 'helpers/DateConverter'
import { viewPersonnelCameraBoss } from 'redux/drone/personnel/PersonnelDroneCameraSlice'

const PersonnelDroneCameraView = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { personnelView } = useAppSelector((state) => state.personnelDroneCamera)

  const [loader, setLoader] = useState(true)

  useEffect(() => {
    dispatch(viewPersonnelCameraBoss({ id } as any)).then(() => {
      setLoader(false)
    })
  }, [id])

  if (loader) return <Loader />

  const record = personnelView

  const hasAfghanistanResidence =
    record?.mainProvince ||
    record?.mainDistrict ||
    record?.main_village ||
    record?.currentProvince ||
    record?.currentDistrict ||
    record?.current_village

  // Top row: general created info (without photo)
  const topRowCards = [
    { icon: 'fa fa-user-plus', label: t('global.recordOwner'), value: record?.ownerName },
    { icon: 'fa fa-building', label: t('global.departmentName'), value: record?.createdDepartment },
    { icon: 'fa fa-map-marker-alt', label: t('global.recordLocation'), value: record?.createdLocation },
    { icon: 'fa fa-calendar', label: t('global.regDate'), value: record?.created_at ? to_jalali(record.created_at, true) : '-' },
  ];

  // Remaining info cards
  const infoCards = [
    { icon: 'fa fa-user', label: t('personnelDroneCamera.name_dr'), value: record?.name_dr },
    { icon: 'fa fa-user', label: t('personnelDroneCamera.name_en'), value: record?.name_en },
    { icon: 'fa fa-user-plus', label: t('personnelDroneCamera.f_name_da'), value: record?.f_name_da },
    { icon: 'fa fa-id-card', label: t('personnelDroneCamera.last_name_dr'), value: record?.last_name_dr },
    { icon: 'fa fa-id-card', label: t('personnelDroneCamera.last_name_en'), value: record?.last_name_en },
    { icon: 'fa fa-phone', label: t('personnelDroneCamera.phone'), value: record?.phone },
    ...(hasAfghanistanResidence
      ? [
        { icon: 'fa fa-map', label: t('personnelDroneCamera.main_province'), value: record?.mainProvince },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.main_district'), value: record?.mainDistrict },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.main_village'), value: record?.main_village },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.current_province'), value: record?.currentProvince },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.current_district'), value: record?.currentDistrict },
        { icon: 'fa fa-map', label: t('personnelDroneCamera.current_village'), value: record?.current_village },
      ]
      : [
        { icon: 'fa fa-globe', label: t('personnelDroneCamera.country'), value: record?.country },
        { icon: 'fa fa-home', label: t('personnelDroneCamera.type_residence_info'), value: record?.type_residence_info },
      ]),
    { icon: 'fa fa-passport', label: t('personnelDroneCamera.passport_no'), value: record?.passport_no },
    { icon: 'fa fa-envelope', label: t('personnelDroneCamera.email'), value: record?.email },
    { icon: 'fa fa-briefcase', label: t('personnelDroneCamera.job'), value: record?.job },
  ];

  return (
    <div className='card'>
      <div className='card-body'>
        <div className='row'>
          {/* TOP ROW — CREATED INFO (full width, without photo) */}
          <div className='row gx-4 gy-4 mb-8'>
            {topRowCards.map(({ icon, label, value }, idx) => (
              <div key={idx} className='col-md-3'>
                <div className='p-3 border rounded bg-light h-100 d-flex align-items-center' style={{ gap: '0.75rem' }}>
                  <i className={`${icon} text-primary fs-4`} />
                  <div>
                    <label className='form-label text-muted mb-1 fw-bold'>{label}:</label>
                    <div className='fs-6 text-dark' style={{ wordBreak: 'break-word' }}>
                      {value || <em>{t('global.notAvailable')}</em>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <hr />
          {/* LEFT SIDE — INFO CARDS */}
          <div className='col-md-9'>
            {/* REMAINING INFO CARDS */}
            <div className='row gx-4 gy-4 mt-6'>
              {infoCards.map(({ icon, label, value }, idx) => (
                <div key={idx} className='col-lg-4 col-md-6 col-sm-12'>
                  <div className='p-3 border rounded bg-light h-100 d-flex align-items-center' style={{ gap: '0.75rem' }}>
                    <i className={`${icon} text-primary fs-4`} />
                    <div>
                      <label className='form-label text-muted mb-1 fw-bold'>{label}:</label>
                      <div className='fs-6 text-dark' style={{ wordBreak: 'break-word' }}>
                        {value || <em>{t('global.notAvailable')}</em>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* RIGHT SIDE — PHOTO */}
          <div className='col-md-3 d-flex justify-content-center'>
            <div style={{ width: '100%', maxWidth: '240px' }}>
              <label className='form-label fw-bold text-center w-100 mb-3'>
                {t('personnelDroneCamera.photo')}
              </label>
              {record?.photo ? (
                <div className='border rounded shadow-sm d-flex justify-content-center align-items-center' style={{ height: '260px', backgroundColor: '#f8f9fa' }}>
                  <img src={record.photo} alt='Personnel' style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
              ) : (
                <div className='border rounded d-flex justify-content-center align-items-center text-muted' style={{ height: '260px', backgroundColor: '#fafafa' }}>
                  {t('global.noPhoto')}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PersonnelDroneCameraView