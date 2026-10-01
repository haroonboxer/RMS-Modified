import { Route, Routes } from 'react-router-dom'
import CompanyList from '../k9/company/list/CompanyList'
import K9CompanyView from './company/view/K9CompanyView'
import RejectedList from '../k9/company/rejected_list/CompanyList'

const K9Routes = () => (
    <Routes>
        <Route path='list' element={<CompanyList />} />
        <Route path='view/:id' element={<K9CompanyView />} />
        {/* <Route path='boss-view/:id' element={<BossView />} /> */}
        <Route path='rejected-list' element={<RejectedList />} />
    </Routes>
)

export default K9Routes
