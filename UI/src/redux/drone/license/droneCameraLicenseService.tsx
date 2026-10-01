import axios from 'axios'

const getLicense = async (params: any) => {
  const response = await axios.get(`api/DroneCameraLicense/index`, { params })
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/DroneCameraLicense/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/DroneCameraLicense/view/${id}`) 
  return response.data
}


const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/DroneCameraLicense/update/${id}`, formData)
  return response.data
}


const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/DroneCameraLicense/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const changeStatusOfPrint = async (formData: FormData) => {
  const response = await axios.post('/api/DroneCameraLicense/changeStatusOfPrint', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const createButton = async (params: any) => {
  const response = await axios.get(`api/DroneCameraLicense/createButton`, { params })
  return response.data
}


const droneCameraLicenseService = {
  getLicense,
  store,
  view,
  update,
  changeStatus,
  createButton,
  changeStatusOfPrint
}

export default droneCameraLicenseService
