import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from './DataTable'
import { useAuth } from 'app/modules/auth'
import BossCreateModal from '../create/BossCreateModal'

const BossList = () => {
  const [showCreateModal, setShowCreateModal] = useState(false) 
  const { t } = useTranslation()
  const { hasPermission } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

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
              {t('global.list', {name: t('boss.boss')})}
            </h3>
          </div>
          <div>
            <div className='d-none d-lg-flex mt-5'>
              <div className='d-flex align-items-center'>
                {hasPermission('workshop-boss-create') && (
                  <button
                    className='btn btn-sm btn-flex btn-primary fw-bolder'
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className='fa-solid fa-plus'></i>
                    {t('global.add', {name: t('boss.BossCreate')})}
                  </button>
                )}
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
                sort: 'boss.id',
              },
              {
                headerName: `${t('boss.name_dr')}`,
                sort: 'boss.name_dr',
              },
              {
                headerName: `${t('boss.last_name_dr')}`,
                sort: 'boss.last_name_dr',
              },
              {
                headerName: `${t('boss.name_en')}`,
                sort: 'boss.name_en',
              },
              {
                headerName: `${t('boss.phone')}`,
                sort: 'boss.phone',
              },
              {
                headerName: `${t('boss.photo')}`,
                sort: 'boss.photo',
              },
              {
                headerName: `${t('global.RECORDOWNER')}`,
                sort: 'boss.created_by',
              },
              {
                headerName: 'عمل',
                sort: '',
              },
            ]}
            columns={[
              'boss.id',
              'boss.name_dr',
              'boss.last_name_dr',
              'boss.name_en',
              'boss.phone',
              'boss.photo',
              'boss.created_by',
            ]}
          />
        </div>
      </div>

      <BossCreateModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
    </Fragment>
  )
}

export default BossList
