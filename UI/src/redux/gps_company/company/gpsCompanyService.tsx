import axios from 'axios'

const getGpsCompany = async (params: any) => {
  const response = await axios.get(`api/gps_companies/index`, {params})
  return response.data
}

const storeGpsCompany = async (formData: any) => {
  const response = await axios.post('api/gps_companies/store', formData)
  return response.data
}

const viewCompany = async (id: number, formData: any) => {
  const response = await axios.post(`api/gps_companies/view/${id}`, formData)
  return response.data
}

const updateGpsCompany = async (formData: any) => {
  const response = await axios.post(`api/gps_companies/update`, formData)
  return response.data
}
const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/gps_companies/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const gpsCompanyService = {
  getGpsCompany,
  storeGpsCompany,
  viewCompany,
  changeStatus,
  updateGpsCompany,
}

export default gpsCompanyService
