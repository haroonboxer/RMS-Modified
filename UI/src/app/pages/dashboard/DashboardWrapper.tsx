import {FC, memo, useEffect} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import ModulesItem from '../../modules/reusable-components/ModulesItem'
import {useAuth} from '../../modules/auth'
import {useTranslation} from 'react-i18next'
import CompanyMonthlyChart from 'app/modules/rms/Reports/CompanyMonthlyChart'
import {useNavigate} from 'react-router-dom'
// const DashboardWrapper: FC = () => {
//   const {currentUser} = useAuth()
//   const {t} = useTranslation()
//  console.log(currentUser);
//   return (
//     <>
//       <PageTitle breadcrumbs={[]}>{t('global.dashboard')}</PageTitle>
//       <div className='row gy-5 g-xl-8'>
//         {/* {currentUser?.systems.map((system: any, i: number) => ( */}
//           <ModulesItem
//             key={1}
//             title={"د وسایطو ورکشاپ جواز مدیریت"}
//             text={"سیستم مدیریت جواز فعالیت ورکشاپ وسایط زرهی"}
//             link={"/workshop/list"}
//             icon={"enterprise.png"}
//           />
//          {/* ))} */}
//       </div>
//       <CompanyMonthlyChart />
//     </>
//   )
// }
// import {FC, useEffect} from 'react'
// import {PageTitle} from '../../../_metronic/layout/core'
// import {useAuth} from '../../modules/auth'
// import {useTranslation} from 'react-i18next'
// import CompanyMonthlyChart from 'app/modules/rms/Reports/CompanyMonthlyChart'


const DashboardWrapper: FC = () => {
  const {currentUser} = useAuth()
  const {t} = useTranslation()
  const navigate = useNavigate()
  console.log(currentUser);
  useEffect(() => 
    {
            const project = currentUser?.currentProject?.trim()

      if (
        project ===
        "سیستم مدیریت جواز فعالیت شرکت های نصب اله ردیاب"
      ) {
        navigate('/gps-companies/list', { replace: true })
      }
       

 
     if (project ==="سیستم مدیریت جواز فعالیت ورکشاپ وسایط زرهی") 
      {
        navigate('/workshop/list', { replace: true })
      }
      if (project ==="مدیریت کمپنی های امنیتی(مشوره دهی)")
      {
        navigate('/company/list', { replace: true })
      }
       
      
      if (project ==="سیستم جواز فعالیت موسسات کرایه دهنده سکهای تعلیمی k9")
      {
           navigate('/k9/list', { replace: true })
      }
      if (project ==="سیستم مدیریت جواز فعالیت استفاده از کمره های پروازی(Drone Camera)")
      {
          navigate('/drone-camera/list', { replace: true })
      }
  }, [navigate])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{t('global.dashboard')}</PageTitle>

      <CompanyMonthlyChart />
    </>
  )
}

export default DashboardWrapper
 

