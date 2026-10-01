import axios from 'axios'

const getPrintedCard = async (params: any) => {
  const response = await axios.get(`api/k9-printed-card/index`, {params})
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/k9-printed-card/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/k9-printed-card/view/${id}`)
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/k9-printed-card/update/${id}`, formData)
  return response.data
}


const changeStatus = async (data: {id: number; status: number}) => {
  const response = await axios.post('/api/k9-printed-card/changeStatus', {
    id: data.id,
    status: data.status,
  })
  return response
}

const changeStatusOfLicense = async (data: {id: number; status: number; reason?: string}) => {
  const response = await axios.post('/api/k9-printed-card/changeStatusOfLicense', {
    id: data.id,
    status: data.status,
    reason: data.reason,
  })
  return response
}

const k9CardPrintService = {
  getPrintedCard,
  store,
  view,
  update,
  changeStatus,
  changeStatusOfLicense,
}

export default k9CardPrintService
