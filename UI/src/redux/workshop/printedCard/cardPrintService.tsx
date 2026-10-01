import axios from 'axios'

const getPrintedCard = async (params: any) => {
  const response = await axios.get(`api/printedCard/index`, { params })
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/printedCard/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/printedCard/view/${id}`)
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/printedCard/update/${id}`, formData)
  return response.data
}

// const changeStatus = async (data: { id: number; status: number }) => {
//   const response = await axios.post('/api/printedCard/changeStatus', data)
//   return response
// }

const changeStatus = async (data: { id: number; status: number }) => {
  const response = await axios.post('/api/printedCard/changeStatus', {
    id: data.id,
    status: data.status,
  })
  return response
}

const changeStatusOfLicense = async (data: { id: number; status: number; reason?: string }) => {
  const response = await axios.post('/api/printedCard/changeStatusOfLicense', {
    id: data.id,
    status: data.status,
    reason: data.reason, // include reason if exists
  })
  return response
}

const cardPrintService = {
  getPrintedCard,
  store,
  view,
  update,
  changeStatus,
  changeStatusOfLicense,
}

export default cardPrintService
