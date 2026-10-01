import { Route, Routes } from 'react-router-dom'
import CompanyList from './list/CompanyList'
import RejectedList from './rejected_list/CompanyList'
import BossView from './view/tabsComponents/Boss/view/BossView'
import WorkshopCompanyView from './view/WorkshopCompanyView'

const WorkshopRoutes = () => (
  <Routes>
    <Route path='list' element={<CompanyList />} />
    <Route path='view/:id' element={<WorkshopCompanyView />} />
    <Route path='boss-view/:id' element={<BossView />} />
    <Route path='rejected-list' element={<RejectedList />} />
  </Routes>
)

export default WorkshopRoutes
