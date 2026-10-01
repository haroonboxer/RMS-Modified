import axios from 'axios'

const getLicense = async (params: any) => {
  const response = await axios.get(`api/gpsCompanyLicense/index`, {params})
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/gpsCompanyLicense/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/gpsCompanyLicense/view/${id}`) // Use GET instead of POST
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/gpsCompanyLicense/update/${id}`, formData)
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/gpsCompanyLicense/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const changeStatusOfPrint = async (formData: FormData) => {
  const response = await axios.post('/api/gpsCompanyLicense/changeStatusOfPrint', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const createButton = async (params: any) => {
  const response = await axios.get(`api/gpsCompanyLicense/createButton`, {params})
  return response.data
}

const gpsCompanyLicenseService = {
  getLicense,
  store,
  view,
  update,
  changeStatus,
  createButton,
  changeStatusOfPrint,
}

export default gpsCompanyLicenseService
