import axios from 'axios'

const getCompany = async (params: any) => {
  const response = await axios.get(`api/k9-company/index`, { params })
  return response.data
}

const storeCompany = async (formData: any) => {
  const response = await axios.post('api/k9-company/store', formData)
  return response.data
}

const viewCompany = async (id: number, formData: any) => {
  const response = await axios.post(`api/k9-company/view/${id}`, formData)
  return response.data
}

const updateCompany = async (formData: any) => {
  const response = await axios.post(`api/k9-company/update`, formData)
  return response.data
}
const changeStatusCompany = async (formData: FormData) => {
  const response = await axios.post('/api/k9-company/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const k9CompanyService = {
  getCompany,
  storeCompany,
  viewCompany,
  changeStatusCompany,
  updateCompany,
}

export default k9CompanyService
