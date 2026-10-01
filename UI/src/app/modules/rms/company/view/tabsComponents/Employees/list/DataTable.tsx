import { debounce } from 'lodash'
import Paginator from 'app/customes/Paginator'
import UnAuthorized from 'app/customes/UnAuthorized'
import Loader from 'app/pages/loading/Loader'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useParams } from 'react-router-dom'
import StatusModal from '../status/StatusModal'
import EmployeeViewModal from '../view/ViewModal'
import { getEmployee, viewEmployee } from 'redux/rms/employees/employeeSlice'
import EmployeeEdit from '../edit/EmployeeEdit'
import { useAuth } from 'app/modules/auth'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const DataTable: React.FC<any> = ({ headers, columns, onRecordsChange }) => {
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
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null)
  const { id } = useParams<{ id: string }>()
  const [name, setName] = useState('')
  const { employeeIndex } = useAppSelector((state) => state.employee)
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
      name: name,
    }),
    [sortColumn, sortOrder, perPage, currentPage, id, name]
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
  const handleSearchEmployee = useRef(
    debounce((query) => {
      setLoading(true)
      setName(query)
      setCurrentPage(1)
      setSortOrder(SORT_ASC)
      setSortColumn(columns[0])
    }, 500)
  ).current

  useEffect(() => {
    setLoading(true)
    dispatch(getEmployee(params)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setLoading(false)
      } else {
        setIsAuthorized(false)
        setLoading(false)
      }
    })
  }, [params, dispatch])

  useEffect(() => {
    setData(employeeIndex.data || [])
    setPagination(employeeIndex.meta || {})
  }, [employeeIndex])

  const memoizedData = useMemo(() => data, [data])
  const memoizedLoading = useMemo(() => loading, [loading])

  return (
    <div>
      {isAuthorized ? (
        <>
          <div className='form collapse' id='movementSearch'>
            <div className='row mb-3'>
              <div className='row mb-8 col-lg-12'>
                {/* Search Fields */}
                <div className='col-lg-3 col-md-3 col-sm-12'>
                  <input
                    type='search'
                    placeholder={t('global.searchPlaceholder')}
                    className='form-control form-control-sm search-input'
                    onChange={(e) => handleSearchEmployee(e.target.value)}
                  />
                </div>
                {/* Per Page Field */}
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
          {/* Table */}
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
                      <td className='text-center'>{item.name + ' - ' + item.last_name}</td>
                      <td className='text-center'>{item.f_name}</td>
                      <td className='text-center'>{item.ownerName}</td>
                      <td className='text-center'>
                        <span
                          className={`badge ${item.status === 1 ? 'badge-success' : 'badge-danger'
                            }`}
                        >
                          {item.status === 1 ? 'فعال' : 'برکنار شده'}
                        </span>
                      </td>
                      <td className='text-center'>
                        <DropdownButton id='dropdown-item-button' size='sm' title='⋮'>
                          {hasPermission('employee-view') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedId(item.id)
                                setShowViewModal(true)
                              }}
                            >
                              <i className='fas fa-eye text-primary me-2'></i>
                              {t('global.view', { name: t('employee.employees') })}
                            </Dropdown.Item>
                          )}
                          {hasPermission('employee-edit') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedEmployee(item)
                                setShowEditModal(true)
                              }}
                            >
                              <i className='fas fa-edit text-warning me-2'></i>
                              {t('global.edit', { name: t('employee.employees') })}
                            </Dropdown.Item>
                          )}
                          {hasPermission('employee-status') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedEmployee(item)
                                setShowStatusModal(true)
                              }}
                            >
                              <i className='fas fa-exchange text-danger me-2'></i>
                              {t('employee.statusChange')}
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

          {/* Modals */}
          {showViewModal && selectedId && (
            <EmployeeViewModal id={selectedId} onClose={() => setShowViewModal(false)} />
          )}
          {showEditModal && selectedEmployee && (
            <EmployeeEdit
              employeeData={selectedEmployee}
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              onSuccess={() => {
                setShowEditModal(false)
                dispatch(getEmployee(params))
              }}
            />
          )}
          {showStatusModal && selectedEmployee && (
            <StatusModal
              showModal={showStatusModal}
              setShowModal={setShowStatusModal}
              onSuccess={() => dispatch(getEmployee(params))}
              currentStatus={selectedEmployee.status}
              employeeId={selectedEmployee.id}
            />
          )}

          {/* Pagination */}
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
