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
import LicenseViewModal from '../view/ViewModal'
import LicenseEdit from '../edit/LicenseEdit'
import { useAuth } from 'app/modules/auth'
import Swal from 'sweetalert2'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { changeStatus, getLicense } from 'redux/k9/license/k9LicenseSlice'


const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const DataTable: React.FC<any> = ({ headers, columns, refresh }) => {
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
  const [selectedLicense, setSelectedLicense] = useState<any | null>(null)
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false)
  const [rejectReason, setRejectReason] = useState<string>('')

  const { id } = useParams<{ id: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const { licenseIndex } = useAppSelector((state) => state.k9License)
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
    [sortColumn, sortOrder, perPage, currentPage, id, searchTerm]
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

  const handleSearchLicense = useRef(
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
    dispatch(getLicense(params)).then((res) => {
      setLoading(false)
      if (res.meta.requestStatus !== 'fulfilled') setIsAuthorized(false)
    })
  }, [params, dispatch, refresh])

  useEffect(() => {
    setData(licenseIndex.data || [])
    setPagination(licenseIndex.meta || {})
  }, [licenseIndex])

  const memoizedData = useMemo(() => data, [data])
  const memoizedLoading = useMemo(() => loading, [loading])

  const RejectReasonModal: React.FC<{
    show: boolean
    onClose: () => void
    reason: string
  }> = ({ show, onClose, reason }) => {
    if (!show) return null
    return (
      <div
        className='modal fade show'
        tabIndex={-1}
        role='dialog'
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div
          className='modal-dialog modal-dialog-centered'
          role='document'
          style={{ maxWidth: '500px' }}
        >
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>{t('global.rejectReason')}</h5>
              <button type='button' className='btn-close' aria-label='Close' onClick={onClose} />
            </div>
            <div className='modal-body'>
              <p>{reason || t('global.noReasonProvided')}</p>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-danger' onClick={onClose}>
                {t('global.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                    placeholder={t('license.searchBySlipNo')}
                    className='form-control form-control-sm search-input'
                    onChange={(e) => handleSearchLicense(e.target.value)}
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
                    <tr key={index} className='fs-5'>
                      <td className='fw-bolder text-center'>{index + 1}</td>
                      <td className='text-center'>
                        {item.license_type === 'new' ? (
                          <span className='badge bg-success bg-opacity-25 text-dark'>
                            {t('license.new')}
                          </span>
                        ) : item.license_type === 'renew' ? (
                          <span className='badge bg-primary bg-opacity-25 text-dark'>
                            {t('license.renew')}
                          </span>
                        ) : item.license_type === 'extend' ? (
                          <span className='badge bg-warning bg-opacity-25 text-dark'>
                            {t('license.extend')}
                          </span>
                        ) : (
                          <span className='text-muted'>{item.license_type}</span>
                        )}
                      </td>
                      <td className='text-center'>{item.fee}</td>
                      <td className='text-center'>{item.ownerName}</td>
                      <td className='text-center'>
                        {item.printed === 1 ? (
                          <span className='badge badge-secondary'>{t('global.printed')}</span>
                        ) : item.status === 0 ? (
                          <span className='badge badge-warning'>{t('global.notSent')}</span>
                        ) : item.status === 1 ? (
                          <>
                            <span className='badge badge-info'>{t('global.sentToPrint')}</span>
                            &nbsp;&nbsp;
                            <span className='badge badge-info'>{t('global.waiting')}</span>
                          </>
                        ) : item.status === 2 ? (
                          <span className='badge badge-success'>{t('global.accept')}</span>
                        ) : item.status === 4 ? (
                          // <>
                          //   <span
                          //     className="badge badge-danger"
                          //     style={{ cursor: 'pointer' }}
                          //     onClick={() => {
                          //       setRejectReason(item.reject_reason)
                          //       setShowRejectReasonModal(true)
                          //     }}
                          //   >
                          //     {t('global.rejected')}
                          //   </span>
                          //   &nbsp;&nbsp;
                          //   <span className="badge badge-danger">{t('global.recheck')}</span>
                          // </>
                          <>
                            <OverlayTrigger
                              placement='top'
                              overlay={
                                <Tooltip id={`tooltip-rejected-${item.id}`}>
                                  {t('global.clickToViewReason')}
                                </Tooltip>
                              }
                            >
                              <span
                                className='badge badge-danger'
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setRejectReason(item.reject_reason)
                                  setShowRejectReasonModal(true)
                                }}
                                title={t('global.clickToViewReason')}
                              >
                                {t('global.rejected')}{' '}
                                <i className='text-white fas fa-info-circle ms-1' />
                              </span>
                            </OverlayTrigger>
                            &nbsp;&nbsp;
                            <OverlayTrigger
                              placement='top'
                              overlay={
                                <Tooltip id={`tooltip-recheck-${item.id}`}>
                                  {t('global.clickToViewReason')}
                                </Tooltip>
                              }
                            >
                              <span
                                className='badge badge-danger'
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setRejectReason(item.reject_reason)
                                  setShowRejectReasonModal(true)
                                }}
                                title={t('global.clickToViewReason')}
                              >
                                {t('global.recheck')}{' '}
                                <i className='text-white fas fa-info-circle ms-1' />
                              </span>
                            </OverlayTrigger>
                          </>
                        ) : null}
                      </td>

                      <td className='text-center'>
                        <DropdownButton id='dropdown-item-button' size='sm' title='⋮'>
                          {hasPermission('workshop-license-view') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedId(item.id)
                                setShowViewModal(true)
                              }}
                            >
                              <i className='fas fa-eye text-primary me-2'></i>
                              {t('global.view', { name: t('license.license') })}
                            </Dropdown.Item>
                          )}

                          {(item.status === 0 || item.status === 4) &&
                            hasPermission('workshop-license-edit') && (
                              <Dropdown.Item
                                as='button'
                                onClick={() => {
                                  setSelectedLicense(item)
                                  setShowEditModal(true)
                                }}
                              >
                                <i className='fas fa-edit text-warning me-2'></i>
                                {t('global.edit', { name: t('license.license') })}
                              </Dropdown.Item>
                            )}

                          {(item.status === 0 || item.status === 4) &&
                            hasPermission('workshop-license-send') && (
                              <Dropdown.Item
                                as='button'
                                onClick={async () => {
                                  const swalWithBootstrapButtons = Swal.mixin({
                                    customClass: {
                                      confirmButton: 'btn btn-success me-3',
                                      cancelButton: 'btn btn-danger',
                                    },
                                    buttonsStyling: false,
                                  })

                                  const result = await swalWithBootstrapButtons.fire({
                                    title: t('printedCard.sendToPrint'),
                                    text: t('printedCard.sendToPrintText'),
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: t('global.yes'),
                                    cancelButtonText: t('global.no'),
                                  })

                                  if (result.isConfirmed) {
                                    try {
                                      const formData = new FormData()
                                      formData.append('id', item.id)
                                      formData.append('status', '1')
                                      await dispatch(changeStatus(formData)).unwrap()
                                      dispatch(getLicense(params))
                                      Swal.fire({
                                        title: t('printedCard.successForSweetAlert'),
                                        icon: 'success',
                                        timer: 3000,
                                      })
                                    } catch (error) {
                                      Swal.fire({
                                        title: t('global.error'),
                                        text: t('printedCard.cardNotSentW'),
                                        icon: 'error',
                                      })
                                    }
                                  } else {
                                    swalWithBootstrapButtons.fire({
                                      title: t('printedCard.cancelled'),
                                      text: t('printedCard.cardNotSentW'),
                                      icon: 'error',
                                    })
                                  }
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
                    <td colSpan={8}>
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
            <LicenseViewModal id={selectedId} onClose={() => setShowViewModal(false)} />
          )}
          {showEditModal && selectedLicense && (
            <LicenseEdit
              licenseData={selectedLicense}
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              onSuccess={() => {
                setShowEditModal(false)
                dispatch(getLicense(params))
              }}
            />
          )}
          {showStatusModal && selectedLicense && (
            <StatusModal
              showModal={showStatusModal}
              setShowModal={setShowStatusModal}
              onSuccess={() => dispatch(getLicense(params))}
              currentStatus={selectedLicense.status}
              licenseId={selectedLicense.id}
            />
          )}

          {/* Reject Reason Modal */}
          <RejectReasonModal
            show={showRejectReasonModal}
            reason={rejectReason}
            onClose={() => setShowRejectReasonModal(false)}
          />

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
