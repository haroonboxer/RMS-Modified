import axios from 'axios'

const getGun = async (params: any) => {
  const response = await axios.get(`api/gun/index`, {params})
  return response.data
}

const store = async (params: any) => {
  const response = await axios.post(`api/gun/store`, params)
  return response.data
}

const update = async (id: number, formData: FormData) => {
  const response = await axios.post(`api/gun/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

const gunService = {
  getGun,
  store,
  update,
}

export default gunService
