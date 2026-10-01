import axios from 'axios'

const getBoss = async (params: any) => {
  const response = await axios.get(`api/PersonnelDroneCamera/index`, { params })
  return response.data
}

const createButton = async (params: any) => {
  const response = await axios.get(`api/PersonnelDroneCamera/createButton`, { params })
  return response.data
}

const store = async (formData: FormData) => {
  const response = await axios.post('api/PersonnelDroneCamera/store', formData)
  return response.data
}

const viewBoss = async (id: number, formData: any) => {
  const response = await axios.post(`api/PersonnelDroneCamera/view/${id}`, formData)
  return response.data
}

const editBoss = async (id: number) => {
  const response = await axios.get(`api/PersonnelDroneCamera/edit/${id}`)
  return response.data
}

const update = async (id: number, formData: FormData) => {
  formData.append('id', String(id))  // make sure backend gets the ID
  const response = await axios.post('api/PersonnelDroneCamera/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/PersonnelDroneCamera/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const getPrintedCard = async (params: any) => {
  const response = await axios.get(`api/personnelDroneCameraCardsApprove/index`, { params })
  return response.data
}


const PersonnelDroneCameraService = {
  getBoss,
  store,
  viewBoss,
  editBoss,
  changeStatus,
  createButton,
  update,
  getPrintedCard
}

export default PersonnelDroneCameraService
