import {Fragment, useState} from 'react'
import {Link} from 'react-router-dom'

import {useTranslation} from 'react-i18next'
import {useAuth} from 'app/modules/auth'
import DataTable from './Datatable'

const CardsList: React.FC = () => {
  const {t} = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [data, setData] = useState<any[]>([])

  const {hasPermission} = useAuth()

  const handleOpenModal = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setShowModal(true)
  }

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
              {t('global.list', {name: t('printedCard.printedCard')})}
            </h3>
          </div>
          <div className='d-flex align-items-center'>
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

        <div className='card-body p-9 table-responsive'>
          <DataTable
            key={refreshKey}
            headers={[
              {headerName: t('global.URN'), sort: 'global.id'},
              {headerName: t('printedCard.card_type'), sort: 'printed_cards.card_type'},
              {headerName: t('printedCard.project_name_dr'), sort: 'printed_cards.project_name_dr'},
              {
                headerName: t('printedCard.card_perimeter_dr'),
                sort: 'printed_cards.card_perimeter_dr',
              },
              {headerName: t('global.RECORDOWNER'), sort: 'global.created_by'},
              {headerName: t('employee.status'), sort: 'printed_cards.status'},
              {headerName: 'عمل', sort: ''},
            ]}
            columns={[
              'printed_cards.id',
              'printed_cards.card_type',
              'printed_cards.project_name_dr',
              'printed_cards.card_perimeter_dr',
              'printed_cards.created_by',
              'printed_cards.status',
            ]}
            onRecordsChange={setData}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default CardsList
