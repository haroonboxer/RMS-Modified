import {Fragment, useState} from 'react'
import {Link} from 'react-router-dom'
import DataTable from './DataTable'
import {useTranslation} from 'react-i18next'
import {useAuth} from 'app/modules/auth'
import GpsCompanyAgencyCreate from '../create/GpsCompanyAgencyCreate'

const GpsCompanyAgencyList = () => {
  const {t} = useTranslation()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOpenModal = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowModal(true)
  }
  const {hasPermission} = useAuth()

  return (
    <Fragment>
      <div
        className='card mb-5 mb-xl-10 shadow-lg p-3 mb-5 bg-body rounded'
        id='kt_profile_details_view'
      >
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>
              <i className='fas fa-list fs-4 text-primary'></i>&nbsp;
              {t('GPSCompanies.gps_agency_list')}
            </h3>
          </div>
          <div>
            <div className='d-none d-lg-flex mt-5'>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center'>
                  {hasPermission('gps-assistant-create') && (
                    <Link
                      className='btn btn-sm btn-flex btn-primary fw-bolder'
                      to='#'
                      onClick={handleOpenModal}
                    >
                      <i className='fa-solid fa-plus'></i>
                      {t('GPSCompanies.gps_add_agency')}
                    </Link>
                  )}
                </div>
                <div className='me-2 ms-2'>
                  <button
                    className='btn btn-sm btn-flex btn-primary fw-bolder'
                    data-bs-toggle='collapse'
                    data-bs-target='#movementSearch'
                    aria-expanded='true'
                    aria-controls='movementSearch'
                  >
                    <span className='svg-icon svg-icon-5 svg-icon-gray-500 me-1'>
                      <i className='fa-solid fa-arrow-down-short-wide'></i>
                    </span>
                    {t('global.search')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='card-body p-9 table-responsive'>
          <DataTable
            key={refreshKey}
            headers={[
              {
                headerName: `${t('global.URN')}`,
                sort: 'assistants.id',
              },
              {
                headerName: `نام کمپنی`,
                sort: 'assistants.gpsCompanyName',
              },
              {
                headerName: `${t('GPSCompanies.location')}`,
                sort: 'assistants.name_dr',
              },
              {
                headerName: `${t('GPSCompanies.agency_agent_name')}`,
                sort: 'assistants.agency_agent_name',
              },
              {
                headerName: `${t('boss.phone')}`,
                sort: 'assistants.phone',
              },
              // {
              //   headerName: `${t('assistant.name_en')}`,
              //   sort: 'assistants.name_en',
              // },
              {
                headerName: `${t('boss.photo')}`,
                sort: 'assistants.photo',
              },
              {
                headerName: `${t('global.RECORDOWNER')}`,
                sort: 'global.created_by',
              },
              {
                headerName: 'عمل',
                sort: '',
              },
            ]}
            columns={[
              'assistants.id',
              'assistants.name_dr',
              // 'assistants.name_en',
              'assistants.agency_agent_name',
              'assistants.phone',
              'assistants.photo',
              'assistants.status',
              'assistants.created_by',
            ]}
          />
        </div>
      </div>
      <GpsCompanyAgencyCreate
        showModal={showModal}
        setShowModal={setShowModal}
        onSuccess={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
    </Fragment>
  )
}

export default GpsCompanyAgencyList
