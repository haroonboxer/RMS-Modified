import { Route, Routes } from 'react-router-dom'
import CardsList from './list/CardsList'


const DroneCameraCardPrintRoutes = () => (
  <Routes>
    <Route path='list' element={<CardsList />} />
  </Routes>
)

export default DroneCameraCardPrintRoutes
