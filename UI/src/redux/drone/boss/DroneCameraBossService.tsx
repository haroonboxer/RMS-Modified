import axios from 'axios'

const getBoss = async (params: any) => {
  const response = await axios.get(`api/DroneCameraBoss/index`, { params })
  return response.data
}

const createButton = async (params: any) => {
  const response = await axios.get(`api/DroneCameraBoss/createButton`, { params })
  return response.data
}

const store = async (formData: FormData) => {
  const response = await axios.post('api/DroneCameraBoss/store', formData)
  return response.data
}

const viewBoss = async (id: number, formData: any) => {
  const response = await axios.post(`api/DroneCameraBoss/view/${id}`, formData)
  return response.data
}

const editBoss = async (id: number) => {
  const response = await axios.get(`api/DroneCameraBoss/edit/${id}`)
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/DroneCameraBoss/update/${id}`, formData)
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/DroneCameraBoss/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
const DroneCameraBossService = {
  getBoss,
  store,
  viewBoss,
  editBoss,
  changeStatus,
  createButton,
  update
}

export default DroneCameraBossService
