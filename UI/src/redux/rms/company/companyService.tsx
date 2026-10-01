import axios from 'axios'

const getCompany = async (params: any) => {
  const response = await axios.get(`api/company/index`, {params})
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/company/store', formData)
  return response.data
}

const viewCompany = async (id: number, formData: any) => {
  const response = await axios.post(`api/company/view/${id}`, formData)
  return response.data
}

const update = async (formData: any) => {
  const response = await axios.post(`api/company/update`, formData)
  return response.data
}
const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/company/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const companyService = {
  getCompany,
  store,
  viewCompany,
  changeStatus,
  update,
}

export default companyService
