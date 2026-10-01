import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import MasterLayout from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import DashboardWrapper from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import CardsRoutes from 'app/modules/rms/cards/CardsRoutes'
import CardPrintRoutes from 'app/modules/workshop/card-print/CardPrintRoutes'
import DroneCameraCardPrintRoutes from 'app/modules/drone/card-print/DroneCameraCardPrintRoutes'
import K9Routes from 'app/modules/k9/K9Routes'
import K9CardPrintRoutes from 'app/modules/k9/card-print/K9CardPrintRoutes'
import K9ReportRoutes from 'app/modules/k9/Reports/K9ReportRoutes'
import PersonnelDroneCameraRoutes from 'app/modules/drone/pesonnel/PersonnelDroneCameraRoutes'
import PersonnelDroneCameraCardPrintRoutes from 'app/modules/drone/personnel-card-approve/PersonnelDroneCameraCardPrintRoutes'

const PrivateRoutes = () => {
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const AuthPage = lazy(() => import('../modules/authentication/AuthPage'))
  const CompanyRoutes = lazy(() => import('../modules/rms/company/CompanyRoutes'))
  const WorkshopRoutes = lazy(() => import('../modules/workshop/company/WorkshopRoutes'))
  const DroneCameraRoutes = lazy(() => import('../modules/drone/company/DroneCameraRoutes'))
  const WorkshopReportRoutes = lazy(() => import('../modules/workshop/Reports/ReportRoutes'))
  const DroneCameraReportRoutes = lazy(() => import('../modules/drone/Reports/ReportRoutes'))
  const ReportRoutes = lazy(() => import('../modules/rms/Reports/ReportRoutes'))
  const GpsCompanyRoutes = lazy(() => import('../modules/gps-company/GpsCompanyRoutes'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        {/* Lazy Modules */}
        <Route
          path='authentication/*'
          element={
            <SuspensedView>
              <AuthPage />
            </SuspensedView>
          }
        />
        {/* ================= RMS Section Start ================== */}
        <Route
          path='company/*'
          element={
            <SuspensedView>
              <CompanyRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='report/*'
          element={
            <SuspensedView>
              <ReportRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='cards/*'
          element={
            <SuspensedView>
              <CardsRoutes />
            </SuspensedView>
          }
        />
        {/* ================= Workshop Section Start ================== */}
        <Route
          path='workshop/*'
          element={
            <SuspensedView>
              <WorkshopRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='card-print/*'
          element={
            <SuspensedView>
              <CardPrintRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='workshop/report/*'
          element={
            <SuspensedView>
              <WorkshopReportRoutes />
            </SuspensedView>
          }
        />
        {/*==================== Drone Camera Section Start =============================*/}
        <Route
          path='drone-camera/*'
          element={
            <SuspensedView>
              <DroneCameraRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='personnel-drone-camera/*'
          element={
            <SuspensedView>
              <PersonnelDroneCameraRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='drone-camera-card-print/*'
          element={
            <SuspensedView>
              <DroneCameraCardPrintRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='personnel-drone-camera-card-print/*'
          element={
            <SuspensedView>
              <PersonnelDroneCameraCardPrintRoutes />
            </SuspensedView>
          }
        />

        <Route
          path='drone-camera/report/*'
          element={
            <SuspensedView>
              <DroneCameraReportRoutes />
            </SuspensedView>
          }
        />
        {/*====================K9 Section Start =============================*/}
        <Route
          path='k9/*'
          element={
            <SuspensedView>
              <K9Routes />
            </SuspensedView>
          }
        />
        <Route
          path='k9-card-print/*'
          element={
            <SuspensedView>
              <K9CardPrintRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='k9/report/*'
          element={
            <SuspensedView>
              <K9ReportRoutes />
            </SuspensedView>
          }
        />
        {/*=================== Default Pages ===============================*/}
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />

        {/*==================== Gps-Companies Section Start =============================*/}
        <Route
          path='/gps-companies/*'
          element={
            <SuspensedView>
              <GpsCompanyRoutes />
            </SuspensedView>
          }
        />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
