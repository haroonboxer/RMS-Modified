import {configureStore} from '@reduxjs/toolkit'
import departmentSlice from './authentication/department/departmentSlice'
import roleSlice from './authentication/roles/roleSlice'
import userManagementSlice from './authentication/user/userManagementSlice'
import provinceSlice from './authentication/province/provinceSlice'
import companySlice from './rms/company/companySlice'
import bossSlice from './rms/boss/bossSlice'
import assistantSlice from './rms/assistant/assistantSlice'
import employeeSlice from './rms/employees/employeeSlice'
import weaponSlice from './rms/weapon/weaponSlice'
import licenseSlice from './rms/license/licenseSlice'
import contractSlice from './rms/contract/contractSlice'
import gunSlice from './rms/gun/gunSlice'
import vehicalSlice from './rms/vehical/vehicalSlice'
import printedCardSlice from './rms/printedCard/printedCardSlice'
import reportSlice from './rms/reports/reportSlice'
import workshopCompanySlice from './workshop/company/workshopCompanySlice'
import workshopAssistantSlice from './workshop/assistant/workshopAssistantSlice'
import workshopBossSlice from './workshop/boss/workshopBossSlice'
import workshopLicenseSlice from './workshop/license/workshopLicenseSlice'
import cardPrint from './workshop/printedCard/CardPrintSlice'
import workshopReportSlice from './workshop/reports/reportSlice'
import droneCameraCompanySlice from './drone/company/droneCameraCompanySlice'
import DroneCameraBossSlice from './drone/boss/DroneCameraBossSlice'
import droneCameraAssistantSlice from './drone/assistant/droneCameraAssistantSlice'
import droneCameraLicenseSlice from './drone/license/droneCameraLicenseSlice'
import droneCameraCardPrintSlice from './drone/printedCard/droneCameraCardPrintSlice'
import droneCameraReportSlice from './drone/reports/reportSlice'
import PersonnelDroneCameraSlice from './drone/personnel/PersonnelDroneCameraSlice'
import k9CompanySlice from './k9/company/k9CompanySlice'
import K9BossSlice from './k9/boss/K9BossSlice'
import k9AssistantSlice from './k9/assistant/k9AssistantSlice'
import k9LicenseSlice from './k9/license/k9LicenseSlice'
import k9CardPrintSlice from './k9/printedCard/k9CardPrintSlice'
import k9reportSlice from './k9/reports/k9reportSlice'
import gpsCompanySlice from './gps_company/company/gpsCompanySlice'
import gpsCompanyBossSlice from './gps_company/boss/gpsCompanyBossSlice'
import gpsCompanyAssistantSlice from './gps_company/assistant/gpsCompanyAssistantSlice'
import gpsCompanyLicenseSlice from './gps_company/license/gpsCompanyLicenseSlice'
import gpsCompanyReportSlice from './gps_company/reports/gpsCompanyReportSlice'
import gpsPrintedCardSlice from './gps_company/printedCard/gpsPrintedCardSlice'
import gpsCompanyAgencySlice from './gps_company/gps_company_agency/gpsCompanyAgencySlice'

export const store = configureStore({
  reducer: {
    //==================== System Auth and province+departments Store.ts =============
    departments: departmentSlice,
    role: roleSlice,
    systems: roleSlice,
    permissions: roleSlice,
    userManagement: userManagementSlice,
    province: provinceSlice,

    //==================== RMS store.ts ==============================================
    gun: gunSlice,
    boss: bossSlice,
    weapon: weaponSlice,
    report: reportSlice,
    company: companySlice,
    license: licenseSlice,
    vehical: vehicalSlice,
    contract: contractSlice,
    employee: employeeSlice,
    assistant: assistantSlice,
    printedCard: printedCardSlice,

    //==================== Workshop Companies store.ts ================================
    workshopCompany: workshopCompanySlice,
    workshopBoss: workshopBossSlice,
    workshopAssistant: workshopAssistantSlice,
    workshopLicense: workshopLicenseSlice,
    workshopReport: workshopReportSlice,
    cardPrint: cardPrint,

    //==================== Drone Camera Store.ts ======================================
    droneCameraCompany: droneCameraCompanySlice,
    DroneCameraBoss: DroneCameraBossSlice,
    droneCameraAssistant: droneCameraAssistantSlice,
    droneCameraLicense: droneCameraLicenseSlice,
    droneCameraCardPrint: droneCameraCardPrintSlice,
    droneCameraReport: droneCameraReportSlice,
    personnelDroneCamera: PersonnelDroneCameraSlice,

    //==================== K9 Start ======================================
    k9Company: k9CompanySlice,
    k9Boss: K9BossSlice,
    k9Assistant: k9AssistantSlice,
    k9License: k9LicenseSlice,
    k9LicenseCardPrint: k9CardPrintSlice,
    k9report: k9reportSlice,
    //==================== K9 End ======================================

    ///  ==================== GPS Companies start ================================
    gpsCompany: gpsCompanySlice,
    gpsCompanyBoss: gpsCompanyBossSlice,
    gpsCompanyAssistant: gpsCompanyAssistantSlice,
    gpsCompanyLicense: gpsCompanyLicenseSlice,
    gpsCompanyReport: gpsCompanyReportSlice,
    gpsPrintedCard: gpsPrintedCardSlice,
    gpsCompanyAgency: gpsCompanyAgencySlice,
    ///  ==================== GPS Companies end ================================
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
