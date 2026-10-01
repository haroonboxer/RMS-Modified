import { debounce } from 'lodash'
import Paginator from 'app/customes/Paginator'
import UnAuthorized from 'app/customes/UnAuthorized'
import Loader from 'app/pages/loading/Loader'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import StatusModal from '../status/StatusModal'
import { useAuth } from 'app/modules/auth'
import BossEdit from '../edit/BossEdit'
import ViewModal from '../view/ViewModal'
import { getBoss, viewBoss } from 'redux/k9/boss/K9BossSlice'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const DataTable: React.FC<any> = ({ headers, columns }) => {
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewData, setViewData] = useState<any>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [sortColumn, setSortColumn] = useState(columns[0])
  const [isAuthorized, setIsAuthorized] = useState(true)
  const [sortOrder, setSortOrder] = useState(SORT_DESC)
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [perPage, setPerPage] = useState(10)
  const [pagination, setPagination] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { bossIndex } = useAppSelector((state) => state.k9Boss)
  const memoizedLoading = useMemo(() => loading, [loading])
  const memoizedData = useMemo(() => data, [data])
  const [selectedBoss, setSelectedBoss] = useState<any>(null)
  const [namedr, setNameDr] = useState('')
  const { id } = useParams<{ id: string }>()
  const { hasPermission } = useAuth()

  const params = useMemo(
    () => ({
      sort_field: sortColumn,
      sort_order: sortOrder,
      per_page: perPage,
      page: currentPage,
      company_id: id,
      name_dr: namedr,
    }),
    [sortColumn, sortOrder, perPage, currentPage, id, namedr]
  )

  const handleSort = (column: string) => {
    setLoading(true)
    if (column === sortColumn) {
      setSortOrder((prevSortOrder) => (prevSortOrder === SORT_ASC ? SORT_DESC : SORT_ASC))
    } else {
      setSortColumn(column)
      setSortOrder(SORT_ASC)
    }
  }

  const handleSearchBoss = useRef(
    debounce((query) => {
      setLoading(true)
      setNameDr(query)
      setCurrentPage(1)
      setSortOrder(SORT_ASC)
      setSortColumn(columns[0])
    }, 500)
  ).current

  const handlePerPage = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  const handleViewBoss = async (bossId: number) => {
    setViewLoading(true)
    setShowViewModal(true)
    const formData = new FormData()
    const res = await dispatch(viewBoss({ id: bossId, formData }) as any)
    if (res.meta.requestStatus === 'fulfilled') {
      setViewData(res.payload.record)
    }
    setViewLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    dispatch(getBoss(params)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setLoading(false)
      } else if (res.meta.requestStatus === 'rejected') {
        setIsAuthorized(false)
        setLoading(false)
      }
    })
  }, [params, dispatch])

  useEffect(() => {
    setData(bossIndex.data || [])
    setPagination(bossIndex.meta || {})
  }, [bossIndex])

  return (
    <div>
      {isAuthorized ? (
        <>
          <div className='form collapse' id='movementSearch'>
            <div className='row mb-3'>
              <div className='row mb-8 col-lg-12'>
                <div className='col-lg-3 col-md-3 col-sm-12'>
                  <input
                    type='search'
                    placeholder={t('global.searchPlaceholder')}
                    className='form-control form-control-sm search-input'
                    onChange={(e) => handleSearchBoss(e.target.value)}
                  />
                </div>
                <div className='col-lg-3 col-md-3 col-sm-12'>
                  <div className='input-group'>
                    <label className='mt-2 me-2'>{t('global.recordsPerPage')}</label>
                    <select
                      className='form-select form-select-sm per-page-select'
                      value={perPage}
                      onChange={(e) => handlePerPage(Number(e.target.value))}
                    >
                      {[5, 10, 20, 50].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='table-responsive tableFixHead' dir='rtl'>
            <table className='table table-hover table-striped'>
              <thead>
                <tr>
                  {headers.map((header: any) => (
                    <th
                      key={header.headerName}
                      onClick={() => handleSort(header.sort)}
                      className='fs-6 fw-bold'
                    >
                      {header.headerName.toUpperCase().replace('_', ' ')}
                      {header.sort === sortColumn && (
                        <i
                          className={`ms-1 fa fa-arrow-${sortOrder === SORT_ASC ? 'up' : 'down'
                            } text-white`}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!memoizedLoading &&
                  memoizedData.map((item, index) => (
                    <tr key={index} className='fs-5'>
                      <td className='fw-bolder' style={{ width: '10%', textAlign: 'center' }}>
                        {item.id}
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.name_dr}</td>
                      <td style={{ textAlign: 'center' }}>{item.name_en}</td>
                      <td style={{ textAlign: 'center', width: '20%' }}>
                        <span>{item.ownerName}</span>
                      </td>
                      <td style={{ textAlign: 'center', width: '20%' }}>
                        <DropdownButton
                          id='dropdown-item-button'
                          size='sm'
                          title={<i className='fas fa-ellipsis-v text-muted'></i>}
                          className='dropdown-button-custom'
                        >
                          {hasPermission('k9-boss-view') && (
                            <Dropdown.Item
                              as='button'
                              className='dropdown-item-custom'
                              onClick={() => handleViewBoss(item.id)}
                            >
                              <span className='text-dark' style={{ fontSize: '0.875rem' }}>
                                <i className='fas fa-eye text-primary me-2'></i>
                                {t('global.view', { name: t('boss.Boss') })}
                              </span>
                            </Dropdown.Item>
                          )}

                          {hasPermission('k9-boss-edit') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedBoss(item)
                                setShowEditModal(true)
                              }}
                            >
                              <i className='fas fa-edit text-warning me-2'></i>
                              {t('global.edit', { name: t('license.license') })}
                            </Dropdown.Item>
                          )}
                        </DropdownButton>
                      </td>
                    </tr>
                  ))}
                {memoizedData.length === 0 && !memoizedLoading && (
                  <tr>
                    <td colSpan={7}>
                      <p className='fs-2 text-center text-danger fw-bolder'>
                        {t('global.noRecordFound')}
                      </p>
                    </td>
                  </tr>
                )}
                {memoizedLoading && (
                  <tr>
                    <td colSpan={8}>
                      <Loader />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showStatusModal && selectedBoss && (
            <StatusModal
              showModal={showStatusModal}
              setShowModal={setShowStatusModal}
              onSuccess={() => dispatch(getBoss(params))}
              currentStatus={selectedBoss.status}
              companyId={selectedBoss.id}
            />
          )}

          {showEditModal && selectedBoss && (
            <BossEdit
              bossData={selectedBoss}
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              onSuccess={() => {
                setShowEditModal(false)
                dispatch(getBoss(params))
              }}
            />
          )}

          {showViewModal && viewData && (
            <ViewModal
              data={viewData}
              loading={viewLoading}
              onClose={() => setShowViewModal(false)}
            />
          )}

          {!memoizedLoading && data.length > 0 && (
            <Paginator
              pagination={pagination}
              pageChanged={setCurrentPage}
              totalItems={data.length}
            />
          )}
        </>
      ) : (
        <UnAuthorized />
      )}
    </div>
  )
}

export default DataTable
