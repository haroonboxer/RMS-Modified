import axios from 'axios'


const getAssistant = async (params: any) => {
  const response = await axios.get(`api/k9-assistant/index`, {params})
  return response.data
}

const createButton = async (params: any) => {
  const response = await axios.get(`api/k9-assistant/createButton`, {params})
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/k9-assistant/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/k9-assistant/view/${id}`) 
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/k9-assistant/update/${id}`, formData)
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/k9-assistant/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const k9AssistantService = {
  getAssistant,
  store,
  view,
  update,
  changeStatus,
  createButton,
}

export default k9AssistantService
