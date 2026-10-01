import axios from 'axios'

const getBoss = async (params: any) => {
  const response = await axios.get(`api/workshopBoss/index`, { params })
  return response.data
}

const createButton = async (params: any) => {
  const response = await axios.get(`api/workshopBoss/createButton`, { params })
  return response.data
}

const store = async (formData: FormData) => {
  const response = await axios.post('api/workshopBoss/store', formData)
  return response.data
}

const viewBoss = async (id: number, formData: any) => {
  const response = await axios.post(`api/workshopBoss/view/${id}`, formData)
  return response.data
}

const editBoss = async (id: number) => {
  const response = await axios.get(`api/workshopBoss/edit/${id}`)
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/workshopBoss/update/${id}`, formData)
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/workshopBoss/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const workshopBossService = {
  getBoss,
  store,
  viewBoss,
  editBoss,
  changeStatus,
  createButton,
  update
}

export default workshopBossService
