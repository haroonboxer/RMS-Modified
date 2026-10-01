// -- name: employeeSlice.tsx
// -- date: 06-04-2025.
// -- desc: Redux toolkit slice for the Employee components.
// -- author: Omer Amiri.
// -- email: amiriomer6@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import employeeService from './employeeService'
import { Employee } from 'app/modules/rms/company/view/tabsComponents/Employees/__model'

type EmployeeState = {
  employeeIndex: any
  employeeView: Employee | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: EmployeeState = {
  employeeIndex: { data: [] },
  employeeView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Assistant from server
export const getEmployee = createAsyncThunk(
  'api/employee/index',
  async (params: any, thunkAPI) => {
    try {
      return await employeeService.getEmployee(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Store Assistant

export const storeEmployee = createAsyncThunk(
  'api/employee/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await employeeService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// View Employee
export const viewEmployee = createAsyncThunk(
  'api/assistant/view',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await employeeService.view(id)
      return response.data
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


export const updateEmployee = createAsyncThunk(
  'api/employee/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await employeeService.update(id, formData)
      return response.data
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const changeStatus = createAsyncThunk(
  'employee/changeStatus',
  async (data: { id: number; status: number }, thunkAPI) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid employee ID')
      }
      const response = await employeeService.changeStatus({
        id: numericId,
        status: data.status,
      })
      return response.data
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployee.fulfilled, (state, action: PayloadAction<any>) => {
        state.employeeIndex = action.payload
      })
      .addCase(storeEmployee.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeEmployee.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.employeeIndex.data.push(action.payload)
      })
      .addCase(storeEmployee.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewEmployee.pending, (state) => {
        state.loading = true
      })
      .addCase(viewEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.loading = false
        state.employeeView = action.payload
      })
      .addCase(viewEmployee.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(changeStatus.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(changeStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        const updatedEmployee = action.payload
        const index = state.employeeIndex.data.findIndex(
          (company: any) => company.id === updatedEmployee.id
        )
        if (index !== -1) {
          state.employeeIndex.data[index] = updatedEmployee
        }
      })
      .addCase(changeStatus.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { reset } = employeeSlice.actions
export default employeeSlice.reducer
