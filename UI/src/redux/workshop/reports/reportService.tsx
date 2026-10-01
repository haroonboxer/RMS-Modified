import axios from 'axios'

const getReport = async (params: any) => {
  const response = await axios.get('api/workshopReport/index', {params})
  return response.data
}

const getWorkshopCompanies = async () => {
  const response = await axios.get('api/workshopReport/listCompany')
  return response.data
}

const getMonthlyCompanyStats = async () => {
  const response = await axios.get('api/workshopReport/monthlyCompanyStats')
  return response.data
}

const workshopReportService = {
  getReport,
  getWorkshopCompanies,
  getMonthlyCompanyStats,
}

export default workshopReportService
