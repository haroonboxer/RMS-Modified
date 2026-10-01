import axios from 'axios'


const getAssistant = async (params: any) => {
  const response = await axios.get(`api/workshopAssistant/index`, {params})
  return response.data
}

const createButton = async (params: any) => {
  const response = await axios.get(`api/workshopAssistant/createButton`, {params})
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/workshopAssistant/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/workshopAssistant/view/${id}`) 
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/workshopAssistant/update/${id}`, formData)
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/workshopAssistant/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const workshopAssistantService = {
  getAssistant,
  store,
  view,
  update,
  changeStatus,
  createButton,
}

export default workshopAssistantService
