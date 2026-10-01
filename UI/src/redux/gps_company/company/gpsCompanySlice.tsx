import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import gpsCompanyService from './gpsCompanyService'

type CompanyState = {
  companyIndex: any
  companyView: {}
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CompanyState = {
  companyIndex: {data: []},
  companyView: {},
  status: 'idle',
  error: null,
}

// Get company from server
export const getGpsCompany = createAsyncThunk(
  'api/gps_companies/index',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyService.getGpsCompany(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Store company
export const storeGpsCompany = createAsyncThunk(
  'api/gps_companies/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await gpsCompanyService.storeGpsCompany(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// View company
export const viewGpsCompany = createAsyncThunk(
  'api/gps_companies/view',
  async ({id, formData}: any, thunkAPI) => {
    try {
      return await gpsCompanyService.viewCompany(id, formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//Update Company
export const updateGpsCompany = createAsyncThunk(
  'api/gps_companies/update',
  async (formData: FormData, thunkAPI) => {
    try {
      return await gpsCompanyService.updateGpsCompany(formData)
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
  'gps_companies/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await gpsCompanyService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const gpsCompanySlice = createSlice({
  name: 'gpsCompany',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(storeGpsCompany.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeGpsCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.companyIndex.data.push(action.payload)
      })
      .addCase(storeGpsCompany.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(getGpsCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.companyIndex = action.payload
      })
      .addCase(changeStatus.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(changeStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        const updatedCompany = action.payload
        const index = state.companyIndex.data.findIndex(
          (company: any) => company.id === updatedCompany.id
        )
        if (index !== -1) {
          state.companyIndex.data[index] = updatedCompany
        }
      })
      .addCase(changeStatus.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewGpsCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.companyView = action.payload
      })
  },
})

export const {reset} = gpsCompanySlice.actions
export default gpsCompanySlice.reducer
