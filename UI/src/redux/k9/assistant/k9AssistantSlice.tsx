// -- name: companySlice.
// -- date: 03-12-2025.
// -- desc: redux toolkit slice for the company components.
// -- author: Rahimullah Ibrahimi.
// -- email: rahimullahibrahimi79@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import assistantService from './k9AssistantService'
import { Assistant } from 'app/modules/k9/company/view/tabsComponents/Assistant/__model'
import k9AssistantService from './k9AssistantService'

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
export const getAssistant = createAsyncThunk(
  'api/k9-assistant/index',
  async (params: any, thunkAPI) => {
    try {
      return await k9AssistantService.getAssistant(params)
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
export const storeAssistant = createAsyncThunk(
  'api/k9-assistant/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await k9AssistantService.store(formData)
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
export const viewAssistant = createAsyncThunk(
  'api/k9-assistant/view',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await k9AssistantService.view(id)
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

export const updateAssistant = createAsyncThunk(
  'api/k9-assistant/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await assistantService.update(id, formData)
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


export const k9AssistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssistant.fulfilled, (state, action: PayloadAction<any>) => {
        state.assistantIndex = {
          data: action.payload.data,
          meta: action.payload.meta, 
        }
      })
      .addCase(storeAssistant.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeAssistant.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.assistantIndex.data.push(action.payload)
      })
      .addCase(storeAssistant.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewAssistant.fulfilled, (state, action: PayloadAction<Assistant>) => {
        state.assistantView = action.payload
      })
      .addCase(viewAssistant.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { reset } = k9AssistantSlice.actions
export default k9AssistantSlice.reducer
