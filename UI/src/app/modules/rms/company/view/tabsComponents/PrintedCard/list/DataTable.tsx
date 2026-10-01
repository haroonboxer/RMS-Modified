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
import {changeStatus, getPrintedCard} from 'redux/rms/printedCard/printedCardSlice'
import PrintedCardViewModal from '../view/ViewModal'
import PrintedCardEdit from '../edit/PrintedCardEdit'
import Swal from 'sweetalert2'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const DataTable: React.FC<any> = ({headers, columns, onRecordsChange}) => {
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
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedPrintedCard, setSelectedPrintedCard] = useState<any | null>(null)
  const {id} = useParams<{id: string}>()
  const [searchTerm, setSearchTerm] = useState('')
  const {printedCardIndex} = useAppSelector((state) => state.printedCard)
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const {hasPermission} = useAuth()
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

  // Handle changing perPage value
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
    dispatch(getPrintedCard(params)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setLoading(false)
        // onRecordsChange(res.payload.data)
      } else {
        setIsAuthorized(false)
        setLoading(false)
      }
    })
  }, [params, dispatch])

  // Set data after fetching
  useEffect(() => {
    setData(printedCardIndex.data || [])
    setPagination(printedCardIndex.meta || {})
  }, [printedCardIndex])

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
                    placeholder={t('global.search')}
                    className='form-control form-control-sm search-input'
                    onChange={(e) => handleSearchContract(e.target.value)}
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
                      <td className='fw-bolder text-center'>{index + 1}</td>
                      <td className='fw-bolder text-center'>
                        {item.card_type === 'new' ? (
                          <span style={{color: '#28a745', fontWeight: 'bold', fontSize: '19px'}}>
                            جدید
                          </span>
                        ) : item.card_type === 'extend' ? (
                          <span style={{color: '#007bff', fontWeight: 'bold', fontSize: '18px'}}>
                            تمدید
                          </span>
                        ) : (
                          item.card_type
                        )}
                      </td>
                      <td className='text-center'>{item.project_name_dr}</td>
                      <td className='text-center'>{item.card_perimeter_dr}</td>
                      <td className='text-center'>{item.ownerName}</td>
                      <td className='text-center'>
                        {item.status === 0 ? (
                          <>
                            <span className='badge badge-warning'>در حال انتظار</span>&nbsp;&nbsp;
                            <span className='badge badge-dark'>چاپ نشده</span>
                          </>
                        ) : item.status === 1 ? (
                          <span className='badge badge-info ms-1'>ارسال شده برای چاپ</span>
                        ) : item.status === 2 ? (
                          <span className='badge badge-success ms-1'>چاپ شده</span>
                        ) : null}
                      </td>
                      <td className='text-center'>
                        <DropdownButton id='dropdown-item-button' size='sm' title='⋮'>
                          {hasPermission('contract-view') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedId(item.id)
                                setShowViewModal(true)
                              }}
                            >
                              <i className='fas fa-eye text-primary me-2'></i>
                              {t('global.view', {name: t('license.license')})}
                            </Dropdown.Item>
                          )}
                          {item.status !== 1 && hasPermission('contract-edit') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedPrintedCard(item)
                                setShowEditModal(true)
                              }}
                            >
                              <i className='fas fa-edit text-warning me-2'></i>
                              {t('global.edit', {name: t('license.license')})}
                            </Dropdown.Item>
                          )}
                          {item.status !== 1 && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                const swalWithBootstrapButtons = Swal.mixin({
                                  customClass: {
                                    confirmButton: 'btn btn-success me-3',
                                    cancelButton: 'btn btn-danger',
                                  },
                                  buttonsStyling: false,
                                })

                                swalWithBootstrapButtons
                                  .fire({
                                    title: t('printedCard.sendToPrint'),
                                    text: t('printedCard.sendToPrintText'),
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: t('global.yes'),
                                    cancelButtonText: t('global.no'),
                                    reverseButtons: false,
                                  })
                                  .then((result) => {
                                    if (result.isConfirmed) {
                                      dispatch(changeStatus({id: item.id, status: 1}))
                                        .unwrap()
                                        .then(() => {
                                          Swal.fire({
                                            title: t('printedCard.successForSweetAlert'),
                                            icon: 'success',
                                            timer: 3000,
                                          })
                                          dispatch(getPrintedCard(params))
                                        })
                                        .catch(() => {
                                          Swal.fire({
                                            title: t('global.error'),
                                            text: t('printedCard.cardNotSent'),
                                            icon: 'error',
                                          })
                                        })
                                    } else {
                                      swalWithBootstrapButtons.fire({
                                        title: t('printedCard.cancelled'),
                                        text: t('printedCard.cardNotSent'),
                                        icon: 'error',
                                      })
                                    }
                                  })
                              }}
                            >
                              <i className='fas fa-paper-plane text-danger me-2'></i>
                              {t('printedCard.sendToPrint')}
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
            <PrintedCardViewModal id={selectedId} onClose={() => setShowViewModal(false)} />
          )}

          {showEditModal && selectedPrintedCard && (
            <PrintedCardEdit
              printedCardData={selectedPrintedCard}
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              onSuccess={() => {
                setShowEditModal(false)
                dispatch(getPrintedCard(params))
              }}
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
