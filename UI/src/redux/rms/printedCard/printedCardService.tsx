import axios from 'axios'

const getPrintedCard = async (params: any) => {
  const response = await axios.get(`api/printed_card/index`, {params})
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/printed_card/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/printed_card/view/${id}`)
  return response.data
}

const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/printed_card/update/${id}`, formData)
  return response.data
}

// const changeStatus = async (data: { id: number; status: number }) => {
//   const response = await axios.post('/api/printed_card/changeStatus', data)
//   return response
// }

const changeStatus = async (data: {id: number; status: number}) => {
  const response = await axios.post('/api/printed_card/changeStatus', {
    id: data.id,
    status: data.status,
  })
  return response
}

const printedCardService = {
  getPrintedCard,
  store,
  view,
  update,
  changeStatus,
}

export default printedCardService
