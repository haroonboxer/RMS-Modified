import axios from 'axios'

const getCompany = async (params: any) => {
  const response = await axios.get(`api/workshopCompany/index`, { params })
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/workshopCompany/store', formData)
  return response.data
}

const viewCompany = async (id: number, formData: any) => {
  const response = await axios.post(`api/workshopCompany/view/${id}`, formData)
  return response.data
}

const update = async (formData: any) => {
  const response = await axios.post(`api/workshopCompany/update`, formData)
  return response.data
}
const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/workshopCompany/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const workshopCompanyService = {
  getCompany,
  store,
  viewCompany,
  changeStatus,
  update,
}

export default workshopCompanyService
