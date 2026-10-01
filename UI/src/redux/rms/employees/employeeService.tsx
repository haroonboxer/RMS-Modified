import axios from 'axios'

const getEmployee = async (params: any) => {
  const response = await axios.get(`api/employee/index`, { params })
  return response.data
}

const store = async (formData: any) => {
  const response = await axios.post('api/employee/store', formData)
  return response.data
}

const view = async (id: number) => {
  const response = await axios.post(`/api/employee/view/${id}`)
  return response.data
}


const update = async (id: number, formData: any) => {
  const response = await axios.post(`api/employee/update/${id}`, formData)
  return response.data
}

const changeStatus = async (data: { id: number; status: number }) => {
  const response = await axios.post('/api/employee/changeStatus', data)
  return response
}



const employeeService = {
  getEmployee,
  store,
  view,
  update,
  changeStatus,
}

export default employeeService
