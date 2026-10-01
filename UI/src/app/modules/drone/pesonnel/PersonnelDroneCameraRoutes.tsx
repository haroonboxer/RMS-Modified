import { Route, Routes } from 'react-router-dom'
import PersonnelDroneList from './list/PersonnelDroneList'
import PersonnelDroneCameraCompanyView from './view/PersonnelDroneCameraCompanyView'


const PersonnelDroneCameraRoutes = () => (
  <Routes>
    <Route path='view/:id' element={<PersonnelDroneCameraCompanyView />} />
    <Route path='personnel-list' element={<PersonnelDroneList />} />
    {/* <Route path='rejected-list' element={<RejectedList />} /> */}
  </Routes>
)

export default PersonnelDroneCameraRoutes
