import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import gpsCompanyAgencyService from './gpsCompanyAgencyService'
import {Assistant} from 'app/modules/gps-company/gpsCompanyAgency/__model'

type AssistantState = {
  assistantIndex: any
  assistantView: Assistant | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: AssistantState = {
  assistantIndex: {data: []},
  assistantView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Assistant from server
export const getGpsCompanyAgency = createAsyncThunk(
  'api/gpsCompanyAgency/index',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyAgencyService.getAgency(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

/// all gps company
export const allGpsCompanyAgency = createAsyncThunk(
  'gpsCompanyAgency/allGpsCompany',
  async ({id}: {id: any}, thunkAPI) => {
    try {
      return await gpsCompanyAgencyService.allGpsCompanyAgency(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

// Get hide button
export const createButton = createAsyncThunk(
  'api/gpsCompanyAgency/createButton',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyAgencyService.createButton(params)
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
export const storeGpsCompanyAgency = createAsyncThunk(
  'api/gpsCompanyAgency/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await gpsCompanyAgencyService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// View Assistant
export const viewGpsCompanyAgency = createAsyncThunk(
  'api/gpsCompanyAgency/view',
  async ({id}: {id: number}, thunkAPI) => {
    try {
      const response = await gpsCompanyAgencyService.view(id)
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

export const updateGpsCompanyAgency = createAsyncThunk(
  'api/gpsCompanyAgency/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await gpsCompanyAgencyService.update(id, formData)
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
  'gpsCompanyAgency/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await gpsCompanyAgencyService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const gpsCompanyAgencySlice = createSlice({
  name: 'gpsCompanyAgency',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGpsCompanyAgency.fulfilled, (state, action: PayloadAction<any>) => {
        state.assistantIndex = {
          data: action.payload.data,
          meta: action.payload.meta,
        }
      })
      .addCase(storeGpsCompanyAgency.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeGpsCompanyAgency.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.assistantIndex.data.push(action.payload)
      })
      .addCase(storeGpsCompanyAgency.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewGpsCompanyAgency.fulfilled, (state, action: PayloadAction<Assistant>) => {
        state.assistantView = action.payload
      })
      .addCase(viewGpsCompanyAgency.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(changeStatus.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(changeStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        const updatedAssistant = action.payload
        const index = state.assistantIndex.data.findIndex(
          (company: any) => company.id === updatedAssistant.id
        )
        if (index !== -1) {
          state.assistantIndex.data[index] = updatedAssistant
        }
      })
      .addCase(changeStatus.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const {reset} = gpsCompanyAgencySlice.actions
export default gpsCompanyAgencySlice.reducer
