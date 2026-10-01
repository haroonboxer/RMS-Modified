import {Fragment, useState, useEffect, useMemo} from 'react'
import {Link, useParams} from 'react-router-dom'
import DataTable from './DataTable'
import {useTranslation} from 'react-i18next'
import {useAppDispatch} from 'redux/hooks'
import EmployeeCreate from '../create/EmployeeCreate'
import {useAuth} from 'app/modules/auth'

const EmployeeList = () => {
  const {t} = useTranslation()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [assistantStatus, setAssistantStatus] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])
  const {id} = useParams<{id: string}>()
  const {hasPermission} = useAuth()
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
              {t('global.list', {name: t('employee.employeess')})}
            </h3>
          </div>
          <div>
            <div className='d-none d-lg-flex mt-5'>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center'>
                  {!assistantStatus && hasPermission('employee-create') && (
                    <Link
                      className='btn btn-sm btn-flex btn-primary fw-bolder'
                      to='#'
                      onClick={handleOpenModal}
                    >
                      <i className='fa-solid fa-plus'></i>
                      {t('global.add', {name: t('employee.employees')})}
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
                sort: 'employees.id',
              },
              {
                headerName: `${t('employee.name_and_last_name')}`,
                sort: 'employees.name',
              },
              {
                headerName: `${t('employee.f_name')}`,
                sort: 'employees.f_name',
              },
              {
                headerName: `${t('global.RECORDOWNER')}`,
                sort: 'global.created_by',
              },
              {
                headerName: `${t('employee.status')}`,
                sort: 'employees.status',
              },
              {
                headerName: 'عمل',
                sort: '',
              },
            ]}
            columns={[
              'employees.id',
              'employees.name' + 'employees.last_name',
              'employees.f_name',
              'employees.created_by',
              'employees.status',
            ]}
            setData={setData}
          />
        </div>
      </div>
      <EmployeeCreate
        showModal={showModal}
        setShowModal={setShowModal}
        onSuccess={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
    </Fragment>
  )
}

export default EmployeeList
