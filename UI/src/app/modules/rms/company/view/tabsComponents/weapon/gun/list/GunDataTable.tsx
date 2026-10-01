import React, {useEffect, useMemo, useState} from 'react'
import Loader from 'app/pages/loading/Loader'
import {useTranslation} from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'redux/hooks'
import {getGun} from 'redux/rms/gun/gunSlice'
import GunCreate from '../create/GunCreate'
import Paginator from 'app/customes/Paginator'
import GunEdit from '../edit/GunEdit'
import {useAuth} from 'app/modules/auth'

interface GunItem {
  id: number
  gun_no: string
  gun_type: string
  gun_diameter: string
  taedad_jabeh: string
  gun_country: string
  created_at: string
  ownerName?: string
}

interface Props {
  weaponId: number
  companyId: number
  to_jalali: (date: string, withTime: boolean) => string
}

const GunDataTable: React.FC<Props> = ({weaponId, companyId, to_jalali}) => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const {gunIndex} = useAppSelector((state) => state.gun)
  const [pagination, setPagination] = useState<any>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [sortColumn, setSortColumn] = useState<string>('guns.id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [perPage] = useState<number>(5)
  const [loading, setLoading] = useState<boolean>(true)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [selectedGunId, setSelectedGunId] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const {hasPermission} = useAuth()
  const params = useMemo(
    () => ({
      sort_field: sortColumn,
      sort_order: sortOrder,
      per_page: perPage,
      page: currentPage,
      company_id: companyId,
      weapon_id: weaponId,
    }),
    [sortColumn, sortOrder, perPage, currentPage, companyId, weaponId]
  )

  const handleOpenCreateModal = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowCreateModal(true)
  }

  const handleOpenEditModal = (id: number) => {
    setSelectedGunId(id)
    setShowEditModal(true)
  }

  const handleSuccess = () => {
    setRefreshKey((prevKey) => prevKey + 1)
    setShowCreateModal(false)
    setShowEditModal(false)
  }

  useEffect(() => {
    setLoading(true)
    dispatch(getGun(params))
      .unwrap()
      .then((response) => {
        setLoading(false)
        setPagination(response.meta)
      })
      .catch(() => setLoading(false))
  }, [params, refreshKey, dispatch])

  const handleSort = (field: string) => {
    if (sortColumn === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(field)
      setSortOrder('asc')
    }
  }

  const renderSortArrow = (field: string) => {
    if (sortColumn !== field) return null
    return sortOrder === 'asc' ? '▲' : '▼'
  }

  const selectedGunData = useMemo(() => {
    return gunIndex?.data?.find((item: GunItem) => item.id === selectedGunId) || null
  }, [selectedGunId, gunIndex])

  return (
    <div className='mt-10'>
      <div className='separator separator-dashed my-5'></div>

      <div className='d-flex justify-content-between align-items-center mb-8'>
        <h3 className='text-dark fw-bolder mb-0'>{t('weapon.detailsTableTitle')}</h3>
        {hasPermission('gun-create') && (
          <button
            type='button'
            className='btn btn-sm btn-flex btn-primary fw-bolder'
            onClick={handleOpenCreateModal}
          >
            <i className='fa-solid fa-plus me-2'></i>
            {t('global.add', {name: t('weapon.gun')})}
          </button>
        )}
      </div>

      <div
        className='table-responsive tableFixHead shadow-sm rounded border'
        dir='rtl'
        style={{overflowX: 'auto', whiteSpace: 'nowrap'}}
      >
        <table className='table table-bordered table-hover align-middle text-center bg-white'>
          <thead className='bg-light text-dark'>
            <tr className='fw-semibold fs-6'>
              <th onClick={() => handleSort('guns.id')} style={{cursor: 'pointer'}}>
                {t('global.id')} {renderSortArrow('guns.id')}
              </th>
              <th onClick={() => handleSort('guns.gun_country')} style={{cursor: 'pointer'}}>
                {t('weapon.country')} {renderSortArrow('guns.gun_country')}
              </th>
              <th onClick={() => handleSort('guns.gun_no')} style={{cursor: 'pointer'}}>
                {t('weapon.gunNumber')} {renderSortArrow('guns.gun_no')}
              </th>
              <th onClick={() => handleSort('guns.gun_type')} style={{cursor: 'pointer'}}>
                {t('weapon.typeOfGun')} {renderSortArrow('guns.gun_type')}
              </th>
              <th onClick={() => handleSort('guns.gun_diameter')} style={{cursor: 'pointer'}}>
                {t('weapon.qatar')} {renderSortArrow('guns.gun_diameter')}
              </th>
              <th onClick={() => handleSort('guns.taedad_jabeh')} style={{cursor: 'pointer'}}>
                {t('weapon.taedadJabeh')} {renderSortArrow('guns.gun_diameter')}
              </th>
              <th>{t('global.ACTION')}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && gunIndex?.data?.length > 0 ? (
              gunIndex.data.map((item: GunItem, index: number) => (
                <tr key={item.id} className='fs-6'>
                  <td className='fw-bold'>{index + 1}</td>
                  <td>{item.gun_country || '-'}</td>
                  <td>{item.gun_no || '-'}</td>
                  <td>{item.gun_type || '-'}</td>
                  <td>{item.gun_diameter || '-'}</td>
                  <td>{item.taedad_jabeh || '-'}</td>
                  <td>
                    {hasPermission('gun-edit') && (
                      <button
                        type='button'
                        className='btn btn-sm btn-outline-warning'
                        onClick={() => handleOpenEditModal(item.id)}
                      >
                        <i className='fas fa-edit me-1'></i> {t('weapon.edit')}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : loading ? (
              <tr>
                <td colSpan={6}>
                  <Loader />
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={6}>
                  <p className='fs-5 text-center text-danger fw-semibold'>
                    {t('global.noRecordFound')}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <GunCreate
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        onSuccess={handleSuccess}
      />

      {selectedGunData && (
        <GunEdit
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          onSuccess={handleSuccess}
          gunData={selectedGunData}
        />
      )}

      {pagination.total && (
        <Paginator
          pagination={pagination}
          pageChanged={setCurrentPage}
          totalItems={pagination.total}
        />
      )}
    </div>
  )
}

export default GunDataTable
