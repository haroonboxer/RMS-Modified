import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from './DataTable'
import { useTranslation } from 'react-i18next'
import AssistantCreate from '../create/AssistantCreate'
import { useAuth } from 'app/modules/auth'

const AssistantList = () => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOpenModal = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowModal(true)
  }
  const { hasPermission } = useAuth()

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
              {t('global.list', { name: t('assistant.assistants') })}
            </h3>
          </div>
          <div>
            <div className='d-none d-lg-flex mt-5'>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center'>
                  {hasPermission('drone-assistant-create') && (
                    <Link
                      className='btn btn-sm btn-flex btn-primary fw-bolder'
                      to='#'
                      onClick={handleOpenModal}
                    >
                      <i className='fa-solid fa-plus'></i>
                      {t('global.add', { name: t('assistant.assistantName') })}
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
                headerName: `${t('assistant.name_dr')}`,
                sort: 'assistants.name_dr',
              },
              {
                headerName: `${t('assistant.last_name_dr')}`,
                sort: 'assistants.last_name_dr',
              },
              {
                headerName: `${t('assistant.name_en')}`,
                sort: 'assistants.name_en',
              },
              {
                headerName: `${t('assistant.phone')}`,
                sort: 'assistants.phone',
              },
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
              'assistants.last_name_dr',
              'assistants.name_en',
              'assistants.phone',
              'assistants.photo',
              'assistants.status',
              'assistants.created_by',
            ]}
          />
        </div>
      </div>
      <AssistantCreate
        showModal={showModal}
        setShowModal={setShowModal}
        onSuccess={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
    </Fragment>
  )
}

export default AssistantList
