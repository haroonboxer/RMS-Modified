import axios from 'axios'

const getReport = async (params: any) => {
  const response = await axios.get('api/k9-report/index', {params})
  return response.data
}

const getWorkshopCompanies = async () => {
  const response = await axios.get('api/k9-report/listCompany')
  return response.data
}

const getMonthlyCompanyStats = async () => {
  const response = await axios.get('api/k9-report/monthlyCompanyStats')
  return response.data
}

const k9ReportService = {
  getReport,
  getWorkshopCompanies,
  getMonthlyCompanyStats,
}

export default k9ReportService
