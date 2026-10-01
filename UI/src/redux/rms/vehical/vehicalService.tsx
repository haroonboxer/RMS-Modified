import axios from 'axios'


const getvehical = async (params: any) => {
  const response = await axios.get(`api/vehical/index`, { params })
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/vehical/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/vehical/view/${id}`)
  return response.data
}


const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/vehical/update/${id}`, formData)
  return response.data
}

const changeStatus = async (data: { id: number; status: number }) => {
  const response = await axios.post('/api/vehical/changeStatus', data)
  return response
}

const createButton = async (params: any) => {
  const response = await axios.get(`api/vehical/createButton`, { params })
  return response.data
}


const vehicalService = {
  getvehical,
  store,
  view,
  update,
  changeStatus,
  createButton
}

export default vehicalService
