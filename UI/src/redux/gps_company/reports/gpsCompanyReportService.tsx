import axios from 'axios'

const getReport = async (params: any) => {
  const response = await axios.get('api/gpsCompanyReport/index', {params})
  return response.data
}

const getGpsCompany = async () => {
  const response = await axios.get('api/gpsCompanyReport/listCompany')
  return response.data
}

const getMonthlyCompanyStats = async () => {
  const response = await axios.get('api/gpsCompanyReport/monthlyCompanyStats')
  return response.data
}

const gpsCompanyReportService = {
  getReport,
  getGpsCompany,
  getMonthlyCompanyStats,
}

export default gpsCompanyReportService
