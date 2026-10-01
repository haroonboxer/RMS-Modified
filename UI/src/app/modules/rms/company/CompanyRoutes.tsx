import {Route, Routes} from 'react-router-dom'
import CompanyList from './list/CompanyList'
import CompanyView from './view/CompanyView'
import BossView from './view/tabsComponents/Boss/view/BossView'
import WeaponViewPage from './view/tabsComponents/weapon/view/WeaponViewPage'

const CompanyRoutes = () => (
  <Routes>
    <Route path='list' element={<CompanyList />} />
    <Route path='view/:id' element={<CompanyView />} />
    <Route path='boss-view/:id' element={<BossView />} />
    <Route path='weapon-view/:WeaponId/:CompanyId' element={<WeaponViewPage />} />
  </Routes>
)

export default CompanyRoutes
