import { debounce } from 'lodash'
import Paginator from 'app/customes/Paginator'
import UnAuthorized from 'app/customes/UnAuthorized'
import Loader from 'app/pages/loading/Loader'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import ViewModal from '../view/ViewModal'
import AssistantEdit from '../edit/AssistantEdit'
import { useParams } from 'react-router-dom'
import StatusModal from '../status/StatusModal'
import { useAuth } from 'app/modules/auth'
import { getAssistant } from 'redux/drone/assistant/droneCameraAssistantSlice'

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
  const [selectedAssistant, setSelectedAssistant] = useState<any | null>(null)
  const [nameDr, setNameDr] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const { id } = useParams<{ id: string }>()
  const { assistantIndex } = useAppSelector((state) => state.droneCameraAssistant)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { hasPermission } = useAuth()
  const params = useMemo(
    () => ({
      sort_field: sortColumn,
      sort_order: sortOrder,
      name_dr: nameDr,
      email: email,
      per_page: perPage,
      page: currentPage,
      search: searchQuery,
      company_id: id,
    }),
    [sortColumn, sortOrder, perPage, currentPage, searchQuery, id, nameDr, email]
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

  const handleSearchByEmail = useRef(
    debounce((query) => {
      setLoading(true)
      setEmail(query)
      setCurrentPage(1)
      setSortOrder(SORT_ASC)
      setSortColumn(columns[0])
    }, 200)
  ).current

  useEffect(() => {
    setLoading(true)
    dispatch(getAssistant(params)).then((res) => {
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
                    name='email'
                    type='search'
                    placeholder='جستجو به نام ایمل'
                    className='form-control form-control-sm search-input'
                    onChange={(e: any) => {
                      handleSearchByEmail(e.target.value)
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
                      <td className='fw-bolder text-center'>{item.id}</td>
                      <td className='text-center'>{item.name_dr}</td>
                      <td className='text-center'>{item.last_name_dr}</td>
                      <td className='text-center'>{item.name_en}</td>
                      <td className='text-center'>{item.phone}</td>
                      <td className='text-center'><img
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
                      /></td>
                      <td className='text-center'>{item.ownerName}</td>
                      <td className='text-center'>
                        <DropdownButton id='dropdown-item-button' size='sm' title='⋮'>
                          {hasPermission('drone-assistant-view') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedId(item.id)
                                setShowViewModal(true)
                              }}
                            >
                              <i className='fas fa-eye text-primary me-2'></i>
                              {t('global.view', { name: t('assistant.assistants') })}
                            </Dropdown.Item>
                          )}
                          {hasPermission('drone-assistant-edit') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedAssistant(item)
                                setShowEditModal(true)
                              }}
                            >
                              <i className='fas fa-edit text-warning me-2'></i>
                              {t('global.edit', { name: t('assistant.assistants') })}
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
          {showEditModal && selectedAssistant && (
            <AssistantEdit
              assistantData={selectedAssistant}
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              onSuccess={() => {
                setShowEditModal(false)
                dispatch(getAssistant(params))
              }}
            />
          )}
          {showStatusModal && selectedAssistant && (
            <StatusModal
              showModal={showStatusModal}
              setShowModal={setShowStatusModal}
              onSuccess={() => dispatch(getAssistant(params))}
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
