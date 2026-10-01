
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Assistant } from 'app/modules/rms/company/view/tabsComponents/Assistant/__model'
import gpsCompanyAssistantService from './gpsCompanyAssistantService'

type AssistantState = {
  assistantIndex: any
  assistantView: Assistant | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: AssistantState = {
  assistantIndex: { data: [] },
  assistantView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Assistant from server
export const getGpsCompanyAssistant = createAsyncThunk(
  'api/gpsCompanyAssistant/index',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyAssistantService.getAssistant(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get hide button
export const createButton = createAsyncThunk(
  'api/gpsCompanyAssistant/createButton',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyAssistantService.createButton(params)
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
export const storeGpsCompanyAssistant = createAsyncThunk(
  'api/gpsCompanyAssistant/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await gpsCompanyAssistantService.store(formData)
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
export const viewGpsCompanyAssistant = createAsyncThunk(
  'api/gpsCompanyAssistant/view',
  async ({id}: {id: number}, thunkAPI) => {
    try {
      const response = await gpsCompanyAssistantService.view(id)
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

export const updateGpsCompanyAssistant = createAsyncThunk(
  'api/gpsCompanyAssistant/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await gpsCompanyAssistantService.update(id, formData)
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
  'gpsCompanyAssistant/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await gpsCompanyAssistantService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const gpsCompanyAssistantSlice = createSlice({
  name: 'gpsCompanyAssistant',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGpsCompanyAssistant.fulfilled, (state, action: PayloadAction<any>) => {
        state.assistantIndex = {
          data: action.payload.data,
          meta: action.payload.meta, 
        }
      })
      .addCase(storeGpsCompanyAssistant.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeGpsCompanyAssistant.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.assistantIndex.data.push(action.payload)
      })
      .addCase(storeGpsCompanyAssistant.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewGpsCompanyAssistant.fulfilled, (state, action: PayloadAction<Assistant>) => {
        state.assistantView = action.payload
      })
      .addCase(viewGpsCompanyAssistant.rejected, (state, action: PayloadAction<any>) => {
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

export const { reset } = gpsCompanyAssistantSlice.actions
export default gpsCompanyAssistantSlice.reducer
