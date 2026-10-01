import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from './DataTable'
import { useTranslation } from 'react-i18next'
import LicenseCreate from '../create/LicenseCreate'
import { useAuth } from 'app/modules/auth'

const LicenseList = () => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const { hasPermission } = useAuth()
  const handleOpenModal = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowModal(true)
  }

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
              {t('global.list', { name: t('license.licenses') })}
            </h3>
          </div>
          <div>
            <div className='d-none d-lg-flex mt-5'>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center'>
                  <button
                    className='btn btn-sm btn-info fw-bolder'
                    onClick={() => {
                      setRefresh(!refresh)
                    }}
                  >
                    <span className='svg-icon svg-icon-5 svg-icon-gray-500 me-1'>
                      <i className='fa-solid fa-refresh' style={{ paddingLeft: 0 }}></i>
                    </span>
                  </button>
                </div>
                <div className='d-flex align-items-center me-2 ms-2'>
                  {hasPermission('drone-personnel-license-create') && (
                    <Link
                      className='btn btn-sm btn-flex btn-primary fw-bolder'
                      to='#'
                      onClick={handleOpenModal}
                    >
                      <i className='fa-solid fa-plus'></i>
                      {t('global.add', { name: t('license.license') })}
                    </Link>
                  )}
                </div>
                <div>
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
                sort: 'licenses.id',
              },
              {
                headerName: `${t('license.license_type')}`,
                sort: 'licenses.name',
              },
              {
                headerName: `${t('license.fee')}`,
                sort: 'licenses.fee',
              },
              {
                headerName: `${t('license.droneModel')}`,
                sort: 'licenses.droneModel',
              },
              {
                headerName: `${t('license.droneSN')}`,
                sort: 'licenses.droneSN',
              },
              {
                headerName: `${t('global.RECORDOWNER')}`,
                sort: 'global.created_by',
              },
              {
                headerName: `${t('employee.status')}`,
                sort: 'licenses.status',
              },
              {
                headerName: 'عمل',
                sort: '',
              },
            ]}
            columns={[
              'licenses.id',
              'licenses.license_type',
              'licenses.fee',
              'licenses.drone_model',
              'licenses.drone_sn',
              'licenses.created_by',
              'licenses.status',
            ]}
            refresh={refresh}
          />
        </div>
      </div>
      <LicenseCreate
        showModal={showModal}
        setShowModal={setShowModal}
        onSuccess={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
    </Fragment>
  )
}

export default LicenseList
