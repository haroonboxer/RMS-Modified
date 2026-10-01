import axios from 'axios'


const getAssistant = async (params: any) => {
  const response = await axios.get(`api/gpsCompanyAssistant/index`, {params})
  return response.data
}

const createButton = async (params: any) => {
  const response = await axios.get(`api/gpsCompanyAssistant/createButton`, {params})
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/gpsCompanyAssistant/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/gpsCompanyAssistant/view/${id}`) 
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/gpsCompanyAssistant/update/${id}`, formData)
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/gpsCompanyAssistant/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const gpsCompanyAssistantService = {
  getAssistant,
  store,
  view,
  update,
  changeStatus,
  createButton,
}

export default gpsCompanyAssistantService
