import {Fragment,useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {useAppDispatch} from 'redux/hooks'
import DataTable from './DataTable'
import WeaponCreate from '../create/WeaponCreate'
import {useAuth} from 'app/modules/auth'

const WeaponList = () => {
  const {t} = useTranslation()
  const {id} = useParams<{id: string}>()
  const [refreshKey, setRefreshKey] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const {hasPermission} = useAuth()
  const handleOpenModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
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
              <i className='fas fa-list fs-4 text-primary'></i>
              {t('global.list', {name: t('weapon.weaps')})}
            </h3>
          </div>
          <div>
            <div className='d-none d-lg-flex mt-5'>
              <div className='d-flex align-items-center'>
                {hasPermission('weapon-create') && (
                  <Link
                    className='btn btn-sm btn-flex btn-primary fw-bolder'
                    to='#'
                    onClick={handleOpenModal}
                  >
                    <i className='fa-solid fa-plus'></i>
                    {t('global.add', {name: t('weapon.weap')})}
                  </Link>
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
              {headerName: t('global.URN'), sort: 'weapons_general_tables.id'},
              {
                headerName: t('weapon.numberOfWeapons'),
                sort: 'weapons_general_tables.number_of_weapons',
              },
              {headerName: t('weapon.oizNo'), sort: 'weapons_general_tables.slip_no'},
              {headerName: t('weapon.oizDate'), sort: 'weapons_general_tables.slip_date'},
              {headerName: t('weapon.amount'), sort: 'weapons_general_tables.money_amount'},
              {headerName: t('weapon.status'), sort: 'weapons_general_tables.status'},
              {headerName: t('global.RECORDOWNER'), sort: 'global.created_by'},
              {headerName: 'عمل', sort: ''},
            ]}
            columns={[
              'weapons_general_tables.id',
              'weapons_general_tables.number_of_weapons',
              'weapons_general_tables.slip_no',
              'weapons_general_tables.slip_date',
              'weapons_general_tables.money_amount',
              'weapons_general_tables.status',
              'weapons_general_tables.created_by',
            ]}
          />
        </div>
      </div>

      <WeaponCreate
        showModal={showModal}
        setShowModal={setShowModal}
        onSuccess={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
    </Fragment>
  )
}

export default WeaponList
