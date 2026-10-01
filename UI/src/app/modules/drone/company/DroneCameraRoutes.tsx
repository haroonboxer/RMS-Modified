import { Route, Routes } from 'react-router-dom'
import CompanyList from './list/CompanyList'
import DroneCameraCompanyView from './view/DroneCameraCompanyView'
import RejectedList from '../company/rejected_list/CompanyList'
import PersonnelDroneList from '../pesonnel/list/PersonnelDroneList'


const DroneCameraRoutes = () => (
  <Routes>
    <Route path='list' element={<CompanyList />} />
    <Route path='view/:id' element={<DroneCameraCompanyView />} />
    <Route path='personnel-list' element={<PersonnelDroneList />} />
    <Route path='rejected-list' element={<RejectedList />} />
  </Routes>
)

export default DroneCameraRoutes
