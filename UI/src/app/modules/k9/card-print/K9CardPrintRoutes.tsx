import { Route, Routes } from 'react-router-dom'
import CardsList from './list/CardsList'


const K9CardPrintRoutes = () => (
  <Routes>
    <Route path='list' element={<CardsList />} />
  </Routes>
)

export default K9CardPrintRoutes
