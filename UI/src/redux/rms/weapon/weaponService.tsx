import axios from 'axios'

const getWeapon = async (params: any) => {
  const response = await axios.get(`api/weapon/index`, {params})
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/weapon/store', formData)
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/weapon/update/${id}`, formData)
  return response.data
}

const changeStatus = async (formData: FormData) => {
  const response = await axios.post('/api/weapon/changeStatus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

const view = async (id: number) => {
  const response = await axios.get(`api/weapon/view/${id}`)
  return response.data
}

const weaponService = {
  getWeapon,
  store,
  update,
  changeStatus,
  view,
}

export default weaponService
