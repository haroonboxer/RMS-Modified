import axios from 'axios'

const getCompany = async (params: any) => {
  const response = await axios.get(`api/DroneCameraCompany/index`, { params })
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/DroneCameraCompany/store', formData)
  return response.data
}

const viewCompany = async (id: number, formData: any) => {
  const response = await axios.post(`api/DroneCameraCompany/view/${id}`, formData)
  return response.data
}

const update = async (formData: any) => {
  const response = await axios.post(`api/DroneCameraCompany/update`, formData)
  return response.data
}
const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/DroneCameraCompany/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const droneCameraCompanyService = {
  getCompany,
  store,
  viewCompany,
  changeStatus,
  update,
}

export default droneCameraCompanyService
