import axios from 'axios'

const getBoss = async (params: any) => {
  const response = await axios.get(`api/k9-boss/index`, { params })
  return response.data
}

const createButton = async (params: any) => {
  const response = await axios.get(`api/k9-boss/createButton`, { params })
  return response.data
}

const store = async (formData: FormData) => {
  const response = await axios.post('api/k9-boss/store', formData)
  return response.data
}

const viewBoss = async (id: number, formData: any) => {
  const response = await axios.post(`api/k9-boss/view/${id}`, formData)
  return response.data
}

const editBoss = async (id: number) => {
  const response = await axios.get(`api/k9-boss/edit/${id}`)
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/k9-boss/update/${id}`, formData)
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/k9-boss/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const K9BossService = {
  getBoss,
  store,
  viewBoss,
  editBoss,
  changeStatus,
  createButton,
  update
}

export default K9BossService
