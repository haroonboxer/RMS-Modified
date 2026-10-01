import axios from 'axios'

const getLicense = async (params: any) => {
  const response = await axios.get(`api/k9-license/index`, { params })
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/k9-license/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/k9-license/view/${id}`) 
  return response.data
}


const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/k9-license/update/${id}`, formData)
  return response.data
}


const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/k9-license/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const changeStatusOfPrint = async (formData: FormData) => {
  const response = await axios.post('/api/k9-license/changeStatusOfPrint', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const createButton = async (params: any) => {
  const response = await axios.get(`api/k9-license/createButton`, { params })
  return response.data
}


const k9LicenseService = {
  getLicense,
  store,
  view,
  update,
  changeStatus,
  createButton,
  changeStatusOfPrint
}

export default k9LicenseService
