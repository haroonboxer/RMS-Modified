import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from './Datatable'

const CardsList: React.FC = () => {
  const { t } = useTranslation()
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <Fragment>
      <div
        className='card mb-5 mb-xl-10 shadow-lg p-3 mb-5 bg-body rounded'
        id='kt_profile_details_view'
      >
        <div className='card-header cursor-pointer d-flex justify-content-between align-items-center'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>
              <i className='fas fa-list fs-4 text-primary'></i>&nbsp;
              {t('global.list', { name: t('printedCard.printedCard') })}
            </h3>
          </div>
          <div className='d-flex align-items-center'>
            <button
              className='btn btn-sm btn-info fw-bolder'
              onClick={() => {
                setRefreshKey((prev) => prev + 1)
              }}
            >
              <span className='svg-icon svg-icon-5 svg-icon-gray-500 me-1'>
                <i className='fa-solid fa-refresh' style={{ paddingLeft: 0 }}></i>
              </span>
            </button>
            <button
              className='btn btn-sm btn-flex btn-primary fw-bolder mx-4'
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

        <div className='card-body p-9 table-responsive'>
          <DataTable
            key={refreshKey}
            headers={[
              { headerName: t('global.URN'), sort: 'global.id' },
              { headerName: t('personnelDroneCamera.header_name_dr'), sort: 'printed_cards.personnelDroneCamera_name_dr' },
              {
                headerName: t('printedCard.license_type'),
                sort: 'printed_cards.license_type',
              },
              { headerName: t('global.RECORDOWNER'), sort: 'global.created_by' },
              { headerName: t('employee.status'), sort: 'printed_cards.status' },
              { headerName: 'عمل', sort: '' },
            ]}
            columns={[
              'cradPrint.id',
              'cradPrint.name_dr',
              'cradPrint.license_type',
              'cradPrint.created_by',
              'cradPrint.status',
            ]}
            refresh={refreshKey}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default CardsList
