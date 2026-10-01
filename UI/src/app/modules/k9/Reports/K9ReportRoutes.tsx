import {Route, Routes} from 'react-router-dom'
import Report from './Report'


const K9ReportRoutes = () => (
  <Routes>
    <Route path='list' element={<Report />} />
  </Routes>
)

export default K9ReportRoutes
