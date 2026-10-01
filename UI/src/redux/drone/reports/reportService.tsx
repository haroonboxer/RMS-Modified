import axios from 'axios'

const getReport = async (params: any) => {
  const response = await axios.get('api/DroneCameraReport/index', {params})
  return response.data
}

const getWorkshopCompanies = async () => {
  const response = await axios.get('api/DroneCameraReport/listCompany')
  return response.data
}

const getMonthlyCompanyStats = async () => {
  const response = await axios.get('api/DroneCameraReport/monthlyCompanyStats')
  return response.data
}

const droneCameraReportService = {
  getReport,
  getWorkshopCompanies,
  getMonthlyCompanyStats,
}

export default droneCameraReportService
