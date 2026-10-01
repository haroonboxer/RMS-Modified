import axios from 'axios'

const getContract = async (params: any) => {
  const response = await axios.get(`api/contract/index`, { params })
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/contract/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/contract/view/${id}`)
  return response.data
}


const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/contract/update/${id}`, formData)
  return response.data
}

const changeStatus = async (data: { id: number; status: number }) => {
  const response = await axios.post('/api/contract/changeStatus', data)
  return response
}

const contractService = {
  getContract,
  store,
  view,
  update,
  changeStatus,
}

export default contractService
