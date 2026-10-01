import React, { useEffect, useState, useRef, useMemo } from 'react'
import { debounce } from 'lodash'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useParams } from 'react-router-dom'
import { useAuth } from 'app/modules/auth'
import Paginator from 'app/customes/Paginator'
import UnAuthorized from 'app/customes/UnAuthorized'
import Loader from 'app/pages/loading/Loader'
import { getPrintedCard } from 'redux/rms/printedCard/printedCardSlice'
import Swal from 'sweetalert2'
import PrintedCardViewModal from '../../company/view/tabsComponents/PrintedCard/view/ViewModal'
import '../../../../../_metronic/assets/css/dataTable.css'
import axios from 'axios'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

interface Header {
  headerName: string
  sort: string
}

interface DataTableProps {
  headers: Header[]
  columns: string[]
  onRecordsChange?: (records: any[]) => void
}

const DataTable: React.FC<DataTableProps> = ({ headers, columns, onRecordsChange }) => {
  const [data, setData] = useState<any[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [sortColumn, setSortColumn] = useState<string>(columns[0])
  const [sortOrder, setSortOrder] = useState<string>(SORT_DESC)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
  const [pagination, setPagination] = useState<any>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [showViewModal, setShowViewModal] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { id } = useParams<{ id: string }>()
  const { printedCardIndex } = useAppSelector((state) => state.printedCard)
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
      search: searchTerm,
    }),
    [sortColumn, sortOrder, perPage, currentPage, id, searchTerm]
  )

  const handleSearchContract = useRef(
    debounce((query: string) => {
      setSearchTerm(query)
      setCurrentPage(1)
      setSortOrder(SORT_ASC)
      setSortColumn(columns[0])
    }, 500)
  ).current

  const handleSort = (column: string) => {
    setSortOrder((prevSortOrder) =>
      column === sortColumn ? (prevSortOrder === SORT_ASC ? SORT_DESC : SORT_ASC) : SORT_ASC
    )
    setSortColumn(column)
  }

  const handlePerPage = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  useEffect(() => {
    setLoading(true)
    dispatch(getPrintedCard(params)).then((res: any) => {
      if (res.meta?.requestStatus === 'fulfilled') {
        setLoading(false)
        if (onRecordsChange) onRecordsChange(res.payload?.data || [])
      } else {
        setIsAuthorized(false)
        setLoading(false)
      }
    })
  }, [params, dispatch, onRecordsChange])

  useEffect(() => {
    const filteredData = (printedCardIndex.data || []).filter((item: any) => item.status === 1)
    setData(filteredData)
    setPagination(printedCardIndex.meta || {})
  }, [printedCardIndex])

  const handleAfterPrint = (id: any) => {
    Swal.fire({
      title: 'تایید چاپ کارت',
      text: 'آیا کارت درست چاپ شده است؟',
      icon: 'question',
      iconHtml: '؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'بلی',
      cancelButtonText: 'نخیر',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(id + 'succcessss')
      } else {
        console.log(id + 'errorrrrr')
      }
    })
  }

  const handleServerPrint = async (id: number) => {
    try {
      axios({
        url: `/api/printed_card/generate-idcard/${id}`,
        method: 'GET',
      }).then((response) => {
        let blob: any = new Blob([response.data.html], { type: 'text/html' })
        const blobUrl = URL.createObjectURL(blob)
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = blobUrl
        document.body.appendChild(iframe)
        iframe.contentWindow?.print()
        // Wait for the iframe to load and then trigger the print action
        iframe.onload = () => {
          setTimeout(() => {
            handleAfterPrint(id)
          }, 0)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

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
                    className='form-control form-control-sm'
                    onChange={(e) => handleSearchContract(e.target.value)}
                  />
                </div>
                <div className='col-lg-3 col-md-3 col-sm-12'>
                  <div className='input-group'>
                    <label className='mt-2 me-2'>{t('global.recordsPerPage')}</label>
                    <select
                      className='form-select form-select-sm'
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
                <tr className='bg-primary text-white'>
                  {headers.map((header) => (
                    <th
                      key={header.headerName}
                      onClick={() => handleSort(header.sort)}
                      className='fs-6 fw-bold'
                      style={{ cursor: 'pointer' }}
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
                    <tr key={item.id || index} className='fs-5'>
                      <td className='fw-bolder text-center'>{index + 1}</td>
                      <td className='fw-bolder text-center'>
                        {item.card_type === 'new' ? (
                          <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '19px' }}>
                            جدید
                          </span>
                        ) : item.card_type === 'extend' ? (
                          <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '18px' }}>
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
                        <DropdownButton
                          id='dropdown-item-button'
                          size='sm'
                          title={<i className='fas fa-ellipsis-v text-muted'></i>}
                          className='dropdown-button-custom'
                        >
                          {hasPermission('contract-view') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedId(item.id)
                                setShowViewModal(true)
                              }}
                              className='dropdown-item-custom'
                            >
                              <i className='fas fa-eye text-primary me-2'></i>
                              {t('global.view', { name: t('license.license') })}
                            </Dropdown.Item>
                          )}
                          {hasPermission('company-status') && (
                            <Dropdown.Item
                              as='button'
                              className='dropdown-item-custom'
                              onClick={() => handleServerPrint(item.id)}
                            >
                              <i className='fas fa-print text-info me-2'></i>
                              {t('global.print')}
                            </Dropdown.Item>
                          )}
                        </DropdownButton>
                      </td>
                    </tr>
                  ))}
                {memoizedData.length === 0 && !memoizedLoading && (
                  <tr>
                    <td colSpan={headers.length}>
                      <p className='fs-2 text-center text-danger fw-bolder'>
                        {t('global.noRecordFound')}
                      </p>
                    </td>
                  </tr>
                )}
                {memoizedLoading && (
                  <tr>
                    <td colSpan={headers.length}>
                      <Loader />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showViewModal && selectedId && (
            <PrintedCardViewModal id={selectedId} onClose={() => setShowViewModal(false)} />
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