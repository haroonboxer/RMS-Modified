import UnAuthorized from 'app/customes/UnAuthorized'
import Loader from 'app/pages/loading/Loader'
import {useEffect, useMemo, useState} from 'react'
import {Dropdown, DropdownButton} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'redux/hooks'
import {Link, useParams} from 'react-router-dom'
import {getweapon} from 'redux/rms/weapon/weaponSlice'
import Paginator from 'app/customes/Paginator'
import WeaponEdit from '../edit/WeaponEdit'
import {toast} from 'react-toastify'
import StatusModal from '../status/StatusModal'
import {useAuth} from 'app/modules/auth'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

interface DataTableProps {
  headers: Array<{
    headerName: string
    sort: string
  }>
  columns: string[]
}

const DataTable: React.FC<DataTableProps> = ({headers, columns}) => {
  const [data, setData] = useState<any[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [sortColumn, setSortColumn] = useState<string>(columns[0])
  const [sortOrder, setSortOrder] = useState<string>(SORT_DESC)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
  const [pagination, setPagination] = useState<any>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [selectedWeapon, setSelectedWeapon] = useState<any | null>(null)
  const {id} = useParams<{id: string}>()
  const {weaponIndex} = useAppSelector((state) => state.weapon)
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false)
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

  const handleEdit = (weapon: any) => {
    setSelectedWeapon(weapon)
    setShowEditModal(true)
  }

  const {hasPermission} = useAuth()
  useEffect(() => {
    setLoading(true)
    dispatch(getweapon(params)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setLoading(false)
      } else {
        setIsAuthorized(false)
        setLoading(false)
      }
    })
  }, [params, dispatch])

  useEffect(() => {
    setData(weaponIndex.data || [])
    setPagination(weaponIndex.meta || {})
  }, [weaponIndex])

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
                  {headers.map((header) => (
                    <th
                      key={header.headerName}
                      onClick={() => header.sort && handleSort(header.sort)}
                      className='fs-6 fw-bold'
                    >
                      {header.headerName}
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
                  memoizedData.map((item) => (
                    <tr key={item.id} className='fs-5'>
                      <td className='fw-bolder text-center'>{item.id}</td>
                      <td className='text-center'>{item.number_of_weapons}</td>
                      <td className='text-center'>{item.slip_no}</td>
                      <td className='text-center'>{item.slip_date}</td>
                      <td className='text-center'>{item.money_amount}</td>
                      <td className='text-center'>
                        <span
                          className={`badge ${
                            item.status === 1 ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {item.status === 1 ? t('weapon.active') : t('weapon.pending')}
                        </span>
                      </td>
                      <td className='text-center'>{item.ownerName}</td>
                      <td className='text-center'>
                        <DropdownButton
                          id={`dropdown-actions-${item.id}`}
                          size='sm'
                          title='⋮'
                          aria-label='Actions'
                        >
                          {item.status === 1 && hasPermission('weapon-view') && (
                            <Dropdown.Item
                              as={Link}
                              to={`/company/weapon-view/${item.id}/${item.company_id}`}
                              className='dropdown-item-custom text-decoration-none text-dark'
                              style={{fontSize: '0.875rem'}}
                              aria-label='View Weapon'
                            >
                              <i className='fas fa-eye text-primary me-2'></i>
                              {t('global.view', {name: t('weapon.weap')})}
                            </Dropdown.Item>
                          )}

                          {hasPermission('weapon-edit') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => handleEdit(item)}
                              type='button'
                              aria-label='Edit Weapon'
                            >
                              <i className='fas fa-edit text-warning me-2'></i>
                              {t('global.edit', {name: t('weapon.weap')})}
                            </Dropdown.Item>
                          )}

                          {hasPermission('weapon-status') && (
                            <Dropdown.Item
                              as='button'
                              onClick={() => {
                                setSelectedWeapon(item)
                                setShowStatusModal(true)
                              }}
                              type='button'
                              aria-label='Change Weapon Status'
                            >
                              <i className='fas fa-exchange text-primary me-2'></i>
                              {t('weapon.statusChange')}
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
          {pagination.total && (
            <Paginator
              pagination={pagination}
              pageChanged={setCurrentPage}
              totalItems={pagination.total}
            />
          )}
          {showEditModal && selectedWeapon && (
            <WeaponEdit
              weaponData={selectedWeapon}
              showModal={showEditModal}
              onClose={() => setShowEditModal(false)}
              onSuccess={() => {
                setShowEditModal(false)
                dispatch(getweapon(params))
                toast.success(t('weapon.weapon_updated_successfully'))
              }}
            />
          )}
          {showStatusModal && selectedWeapon && (
            <StatusModal
              showModal={showStatusModal}
              setShowModal={setShowStatusModal}
              onSuccess={() => dispatch(getweapon(params))}
              currentStatus={selectedWeapon.status}
              weaponId={selectedWeapon.id}
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
