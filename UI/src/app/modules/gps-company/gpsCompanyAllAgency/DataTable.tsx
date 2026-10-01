import {debounce} from 'lodash'
import Paginator from 'app/customes/Paginator'
import UnAuthorized from 'app/customes/UnAuthorized'
import Loader from 'app/pages/loading/Loader'
import {useEffect, useMemo, useRef, useState} from 'react'
import {Dropdown, DropdownButton} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'redux/hooks'
import {useParams} from 'react-router-dom'
import {useAuth} from 'app/modules/auth'
import {getGpsCompanyAgency} from 'redux/gps_company/gps_company_agency/gpsCompanyAgencySlice'
import StatusModal from '../gpsCompanyAgency/status/StatusModal'
import ViewModal from '../gpsCompanyAgency/view/ViewModal'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const DataTable: React.FC<any> = ({headers, columns, onRecordsChange}) => {
  const [data, setData] = useState<any[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [sortColumn, setSortColumn] = useState<string>(columns[0])
  const [sortOrder, setSortOrder] = useState<string>(SORT_DESC)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
  const [pagination, setPagination] = useState<any>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [showViewModal, setShowViewModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedAssistant, setSelectedAssistant] = useState<any | null>(null)
  const [nameDr, setNameDr] = useState<string>('')
  const [agencyNameEn, setAgencyNameEn] = useState<string>('')
  const {id} = useParams<{id: string}>()
  const {assistantIndex} = useAppSelector((state) => state.gpsCompanyAgency)
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const {hasPermission} = useAuth()
  const params = useMemo(
    () => ({
      sort_field: sortColumn,
      sort_order: sortOrder,
      name_dr: nameDr,
      agencyNameEn: agencyNameEn,
      per_page: perPage,
      page: currentPage,
      search: searchQuery,
      company_id: id,
    }),
    [sortColumn, sortOrder, perPage, currentPage, searchQuery, id, nameDr, agencyNameEn]
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
  const handleSearchAssistantNameDr = useRef(
    debounce((query) => {
      setLoading(true)
      setNameDr(query)
      setCurrentPage(1)
      setSortOrder(SORT_ASC)
      setSortColumn(columns[0])
    }, 200)
  ).current

  const handleSearchByNameDr = useRef(
    debounce((query) => {
      setLoading(true)
      setAgencyNameEn(query)
      setCurrentPage(1)
      setSortOrder(SORT_ASC)
      setSortColumn(columns[0])
    }, 200)
  ).current

  useEffect(() => {
    setLoading(true)
    dispatch(getGpsCompanyAgency(params)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setLoading(false)
      } else {
        setIsAuthorized(false)
        setLoading(false)
      }
    })
  }, [params, dispatch])

  useEffect(() => {
    setData(assistantIndex.data || [])
    setPagination(assistantIndex.meta || {})
  }, [assistantIndex])

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
                    name='name_dr'
                    type='search'
                    placeholder='جستجو به نام دری'
                    className='form-control form-control-sm search-input'
                    onChange={(e: any) => {
                      handleSearchAssistantNameDr(e.target.value)
                    }}
                  />
                </div>
                <div className='col-lg-3 col-md-3 col-sm-12'>
                  <input
                    name='agency_name_en'
                    type='search'
                    placeholder='جستجو به نام '
                    className='form-control form-control-sm search-input'
                    onChange={(e: any) => {
                      handleSearchByNameDr(e.target.value)
                    }}
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
            style={{overflowX: 'auto', whiteSpace: 'nowrap'}}
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
                          className={`ms-1 fa fa-arrow-${
                            sortOrder === SORT_ASC ? 'up' : 'down'
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
                      <td className='fw-bolder text-center'>{item.id}</td>
                      <td className='fw-bolder text-center'>{item.gpsCompanyName}</td>
                      {/* <td className='text-center'>
                        <div>
                          {t('GPSCompanies.province')}: {item.mainProvinceName ?? 'N/A'}
                        </div>
                        <div>
                          {t('GPSCompanies.district')}: {item.mainDistrictName ?? 'N/A'}
                        </div>
                        <div>
                          {t('GPSCompanies.village')}: {item.main_village ?? 'N/A'}
                        </div>
                      </td> */}
                      <td className='text-center'>
                        {t('GPSCompanies.province')} : {item.mainProvinceName ?? 'N/A'} <br />
                        {t('GPSCompanies.district')} : {item.mainDistrictName ?? 'N/A'} <br />
                        {t('GPSCompanies.village')} : {item.main_village ?? 'N/A'}
                      </td>
                      {/* <td className='text-center'>{item.name_en}</td> */}
                      <td className='text-center'>{item.agency_manager}</td>
                      <td className='text-center'>{item.phone}</td>
                      <td className='text-center'>
                        <img
                          src={item.photo}
                          alt='Company Icon'
                          className='company-icon'
                          loading='eager'
                          style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '10px',
                            objectFit: 'contain',
                          }}
                          onError={(e) => (e.currentTarget.src = '/default-icon.png')}
                        />
                      </td>

                      <td className='text-center'>{item.ownerName}</td>
                      {/* <td className='text-center'>
                        <DropdownButton id='dropdown-item-button' size='sm' title='⋮'>
                          {hasPermission('gps-assistant-view') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedId(item.id)
                                setShowViewModal(true)
                              }}
                            >
                              <i className='fas fa-eye text-primary me-2'></i>
                              {t('GPSCompanies.view')}
                            </Dropdown.Item>
                          )}
                        </DropdownButton>
                      </td> */}
                    </tr>
                  ))}
                {memoizedData.length === 0 && !memoizedLoading && (
                  <tr>
                    <td colSpan={9}>
                      <p className='fs-2 text-center text-danger fw-bolder'>
                        {t('global.noRecordFound')}
                      </p>
                    </td>
                  </tr>
                )}
                {memoizedLoading && (
                  <tr>
                    <td colSpan={9}>
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
          {showStatusModal && selectedAssistant && (
            <StatusModal
              showModal={showStatusModal}
              setShowModal={setShowStatusModal}
              onSuccess={() => dispatch(getGpsCompanyAgency(params))}
              currentStatus={selectedAssistant.status}
              assistantId={selectedAssistant.id}
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
