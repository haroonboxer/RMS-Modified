import React, { useEffect, useState, useRef, useMemo } from 'react'
import { debounce } from 'lodash'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import Paginator from 'app/customes/Paginator'
import UnAuthorized from 'app/customes/UnAuthorized'
import { encryptId } from 'helpers/EncryptAndDecrypt'
import '../../../../../_metronic/assets/css/dataTable.css'
import Loader from 'app/pages/loading/Loader'
// import CompanyEditModal from '../edit/CompanyEditModal'
// import StatusModal from '../status/StatusModal'
import { useAuth } from 'app/modules/auth'
import { getPersonnelDroneBoss } from 'redux/drone/personnel/PersonnelDroneCameraSlice'
import PersonnelDroneEditModal from '../edit/PersonnelDroneEditModal'


const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const DataTable: React.FC<any> = ({ headers, columns, onRecordsChange }) => {
  const [data, setData] = useState<any[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [sortColumn, setSortColumn] = useState<string>(columns[0])
  const [sortOrder, setSortOrder] = useState<string>(SORT_DESC)
  const [companyDr, setCompanyDr] = useState<string>('')
  const [companyEn, setCompanyEn] = useState<string>('')
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
  const [pagination, setPagination] = useState<any>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { companyIndex } = useAppSelector((state) => state.personnelDroneCamera)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const [showStatusModal, setShowStatusModal] = useState<boolean>(false)

  const handleEdit = (id: number) => {
    setSelectedId(id)
    setShowEditModal(true)
  }
  const { hasPermission } = useAuth()
  const params = useMemo(
    () => ({
      sort_field: sortColumn,
      sort_order: sortOrder,
      per_page: perPage,
      page: currentPage,
      company_dr: companyDr,
      company_en: companyEn,

    }),
    [sortColumn, sortOrder, perPage, currentPage, companyDr, companyEn]
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

  const handleSearchCompanyDr = useRef(
    debounce((query) => {
      setCompanyDr(query)
      setCurrentPage(1)
    }, 500)
  ).current

  const handleSearchCompanyEn = useRef(
    debounce((query) => {
      setCompanyEn(query)
      setCurrentPage(1)
    }, 500)
  ).current

  const handlePerPage = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  useEffect(() => {
    setLoading(true)
    dispatch(getPersonnelDroneBoss(params)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setLoading(false)
      } else if (res.meta.requestStatus === 'rejected') {
        setIsAuthorized(false)
        setLoading(false)
      }
    })
  }, [params, dispatch])

  useEffect(() => {
    setData(companyIndex.data || [])
    setPagination(companyIndex.meta || {})
  }, [companyIndex, dispatch, onRecordsChange])

  const memoizedData = useMemo(() => data, [data])
  const memoizedLoading = useMemo(() => loading, [loading])

  return (
    <div>
      {isAuthorized ? (
        <>
          <div className='form collapse' id='movementSearch'>
            <div className='row mb-3'>
              <div className='row mb-8 col-lg-12'>
                <div className='col-lg-5 col-md-5 col-sm-4'>
                  <input
                    type='search'
                    placeholder='جستجو به اساس نام دری...'
                    className='form-control form-control-sm'
                    onChange={(e) => handleSearchCompanyDr(e.target.value)}
                  />
                </div>
                <div className='col-lg-5 col-md-5 col-sm-4'>
                  <input
                    type='search'
                    placeholder='جستجو به اساس نام انگلیسی...'
                    className='form-control form-control-sm'
                    onChange={(e) => handleSearchCompanyEn(e.target.value)}
                  />
                </div>
                <div className='col-lg-2 col-md-2 col-sm-4 mt-2'>
                  <div className='input-group'>
                    <label className='mt-2 me-2'>تعداد ریکارد صفحه</label>
                    <select
                      className='form-select form-select-sm'
                      value={perPage}
                      onChange={(e) => handlePerPage(Number(e.target.value))}
                    >
                      <option value='5'>5</option>
                      <option value='10'>10</option>
                      <option value='20'>20</option>
                      <option value='50'>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className='tableFixHead table-responsive'
            style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
            dir='rtl'
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
                  memoizedData.map((item, rowNumber) => (
                    <tr key={item.id}>
                      <td className='fw-bolder' style={{ width: '5%', textAlign: 'center' }}>
                        {(pagination.current_page - 1) * pagination.per_page + (rowNumber + 1)}
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.name_dr}</td>
                      <td style={{ textAlign: 'center' }}>{item.last_name_dr}</td>
                      <td style={{ textAlign: 'center' }}>{item.name_en}</td>
                      <td style={{ textAlign: 'center' }}>{item.phone}</td>
                      <td style={{ textAlign: 'center' }}>
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

                      <td style={{ textAlign: 'center', width: '10%' }}>
                        <span>{item.ownerName}</span>
                      </td>
                      <td style={{ textAlign: 'center', width: '10%' }}>
                        <DropdownButton
                          id='dropdown-item-button'
                          size='sm'
                          title={<i className='fas fa-ellipsis-v text-muted'></i>}
                          className='dropdown-button-custom'
                        >
                          {hasPermission('drone-company-view') && (
                            <Dropdown.Item as='button' className='dropdown-item-custom'>
                              <Link
                                to={'/personnel-drone-camera/view/' + encryptId(item.id)}
                                className='text-decoration-none text-dark'
                                style={{ fontSize: '0.875rem' }}
                              >
                                <i className='fas fa-eye text-primary me-2'></i>
                                {t('global.view', { name: t('company.CompanyCreate') })}
                              </Link>
                            </Dropdown.Item>
                          )}
                          {hasPermission('drone-company-edit') && (
                            <Dropdown.Item as='button' className='dropdown-item-custom'>
                              <Link
                                to='#'
                                onClick={() => {
                                  setSelectedId(item.id)
                                  setShowEditModal(true)
                                }}
                                className='text-decoration-none text-dark'
                                style={{ fontSize: '0.875rem' }}
                              >
                                <i className='fas fa-edit text-warning me-2'></i>
                                {t('global.edit', { name: t('company.CompanyCreate') })}
                              </Link>
                            </Dropdown.Item>
                          )}
                          {/* {hasPermission('company-status') && (
                            <Dropdown.Item as='button' className='dropdown-item-custom'>
                              <Link
                                to='#'
                                onClick={() => {
                                  setSelectedCompany(item)
                                  setShowStatusModal(true)
                                }}
                                className='text-decoration-none text-dark'
                                style={{fontSize: '0.875rem'}}
                              >
                                <i className='fas fa-exchange text-danger me-2'></i>
                                {t('company.statusChange')}
                              </Link>
                            </Dropdown.Item>
                          )} */}
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

          {showEditModal && selectedId && (
            <PersonnelDroneEditModal
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              personnelId={selectedId}
              onSuccess={() => dispatch(getPersonnelDroneBoss(params))}
            />
          )}
          {/* {showStatusModal && selectedCompany && (
            <StatusModal
              showModal={showStatusModal}
              setShowModal={setShowStatusModal}
              onSuccess={() => dispatch(getCompany(params))}
              currentStatus={selectedCompany.status}
              companyId={selectedCompany.id}
            />
          )} */}

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
