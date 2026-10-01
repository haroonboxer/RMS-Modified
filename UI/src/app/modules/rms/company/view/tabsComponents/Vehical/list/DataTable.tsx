import { debounce } from 'lodash'
import Paginator from 'app/customes/Paginator'
import UnAuthorized from 'app/customes/UnAuthorized'
import Loader from 'app/pages/loading/Loader'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useParams } from 'react-router-dom'
import { getvehical } from 'redux/rms/vehical/vehicalSlice'
import ViewModal from '../view/ViewModal'
import VehicalEdit from '../edit/VehicalEdit'
import { useAuth } from 'app/modules/auth'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const DataTable: React.FC<any> = ({ headers, columns, onRecordsChange }) => {
  const [data, setData] = useState<any[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [sortColumn, setSortColumn] = useState<string>(columns[0])
  const [sortOrder, setSortOrder] = useState<string>(SORT_DESC)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
  const [pagination, setPagination] = useState<any>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [showViewModal, setShowViewModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedVihical, setselectedVihical] = useState<any | null>(null)
  const { id } = useParams<{ id: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const { vehicalIndex } = useAppSelector((state) => state.vehical)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { hasPermission } = useAuth()
  const params = useMemo(
    () => ({
      sort_field: sortColumn,
      sort_order: sortOrder,
      per_page: perPage,
      page: currentPage,
      company_id: id,
    }),
    [sortColumn, sortOrder, perPage, currentPage, id]
  )

  const handleSort = (column: string) => {
    setLoading(true)
    setSortOrder((prevSortOrder) =>
      column === sortColumn ? (prevSortOrder === SORT_ASC ? SORT_DESC : SORT_ASC) : SORT_ASC
    )
    setSortColumn(column)
  }
  const handlePerPage = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  const handleSearchContract = useRef(
    debounce((query) => {
      setLoading(true)
      setSearchTerm(query)
      setCurrentPage(1)
      setSortOrder(SORT_ASC)
      setSortColumn(columns[0])
    }, 500)
  ).current

  useEffect(() => {
    setLoading(true)
    dispatch(getvehical(params)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setLoading(false)
      } else {
        setIsAuthorized(false)
        setLoading(false)
      }
    })
  }, [params, dispatch])
  useEffect(() => {
    setData(vehicalIndex.data || [])
    setPagination(vehicalIndex.meta || {})
  }, [vehicalIndex])

  const memoizedData = useMemo(() => data, [data])
  const memoizedLoading = useMemo(() => loading, [loading])

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
                    placeholder={t('global.search')}
                    className='form-control form-control-sm search-input'
                    onChange={(e) => handleSearchContract(e.target.value)}
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
          <div
            className='table-responsive tableFixHead'
            dir='rtl'
            style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
          >
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
                      <td className='fw-bolder text-center'>{index + 1}</td>
                      <td className='fw-bolder text-center'>{item.vehical_type}</td>
                      <td className='text-center'>{item.vehical_ownership}</td>
                      <td className='text-center'>{item.vehical_platte_no}</td>
                      <td className='text-center'>{item.ownerName}</td>
                      <td className='text-center'>
                        <DropdownButton id='dropdown-item-button' size='sm' title='⋮'>
                          {hasPermission('vehical-view') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedId(item.id)
                                setShowViewModal(true)
                              }}
                            >
                              <i className='fas fa-eye text-primary me-2'></i>
                              {t('global.view', { name: t('vehical.vehicals') })}
                            </Dropdown.Item>
                          )}
                          {hasPermission('vehical-edit') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setselectedVihical(item)
                                setShowEditModal(true)
                              }}
                            >
                              <i className='fas fa-edit text-warning me-2'></i>
                              {t('global.edit', { name: t('vehical.vehicals') })}
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
          {showViewModal && selectedId && (
            <ViewModal id={selectedId} onClose={() => setShowViewModal(false)} />
          )}

          {showEditModal && selectedVihical && (
            <VehicalEdit
              vehicalData={selectedVihical}
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              onSuccess={() => {
                setShowEditModal(false)
                dispatch(getvehical(params))
              }}
            />
          )}
          {pagination.total && (
            <Paginator
              pagination={pagination}
              pageChanged={setCurrentPage}
              totalItems={pagination.total}
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
