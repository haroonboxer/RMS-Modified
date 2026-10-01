import {Route, Routes} from 'react-router-dom'
import GpsCompanyList from './gpsCompany/list/GpsCompanyList'
import GpsCompanyView from './gpsCompany/view/GpsCompanyView'
import BossDetailsView from './gpsCompany/view/tabsComponents/Boss/view/BossView'
import Report from './Reports/Report'
import RejectedList from './gpsCompany/rejected_list/RejectedList'
import CardsList from './card-print/list/CardsList'
import GpsCompanyAgencyList from './gpsCompanyAgency/list/GpsCompanyAgencyList'
import GpsCompanyAllAgencyList from './gpsCompanyAllAgency/GpsCompanyAllAgencyList'

const GpsCompanyRoutes = () => {
  return (
    <>
      <Routes>
        <Route path='list' element={<GpsCompanyList />} />
        <Route path='view/:id' element={<GpsCompanyView />} />
        <Route path='boss-view/:id' element={<BossDetailsView />} />
        <Route path='report/list' element={<Report />} />
        <Route path='rejected-list' element={<RejectedList />} />
        <Route path='card-print/list' element={<CardsList />} />
        {/* <Route path='/gps-company-agency/list' element={<GpsCompanyAgencyList />} /> */}
        <Route path='/gps-company-all-agency/list' element={<GpsCompanyAllAgencyList />} />
      </Routes>
    </>
  )
}

export default GpsCompanyRoutes
