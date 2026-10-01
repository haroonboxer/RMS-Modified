// -- name: vehicalSlice.tsx
// -- date: 06-04-2025.
// -- desc: Redux toolkit slice for the Vehical components.
// -- author: Omer Amiri.
// -- email: amiriomer6@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import vehicalService from './vehicalService'
import { Vehical } from 'app/modules/rms/company/view/tabsComponents/Vehical/__model'

type VehicalState = {
  vehicalIndex: any
  vehicalView: Vehical | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: VehicalState = {
  vehicalIndex: { data: [] },
  vehicalView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Vehical from server
export const getvehical = createAsyncThunk(
  'api/vehical/index',
  async (params: any, thunkAPI) => {
    try {
      return await vehicalService.getvehical(params)
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
  'api/vehical/createButton',
  async (params: any, thunkAPI) => {
    try {
      return await vehicalService.createButton(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Store Vehical
export const storeVehical = createAsyncThunk(
  'api/vehical/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await vehicalService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// View Vehical
export const viewVehical = createAsyncThunk(
  'api/vehical/view',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await vehicalService.view(id)
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

// Vehical Update 
export const updateVehical = createAsyncThunk(
  'api/vehical/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await vehicalService.update(id, formData)
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
  'Vehical/changeStatus',
  async (data: { id: number; status: number }, thunkAPI) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid Vehical ID')
      }
      const response = await vehicalService.changeStatus({
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

export const vehicalSlice = createSlice({
  name: 'vehical',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getvehical.fulfilled, (state, action: PayloadAction<any>) => {
        state.vehicalIndex = action.payload
      })
      .addCase(storeVehical.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeVehical.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.vehicalIndex.data.push(action.payload)
      })
      .addCase(storeVehical.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewVehical.pending, (state) => {
        state.loading = true
      })
      .addCase(viewVehical.fulfilled, (state, action: PayloadAction<Vehical>) => {
        state.loading = false
        state.vehicalView = action.payload
      })
      .addCase(viewVehical.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { reset } = vehicalSlice.actions
export default vehicalSlice.reducer
