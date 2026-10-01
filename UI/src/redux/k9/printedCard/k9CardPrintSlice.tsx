// -- name: companySlice.
// -- date: 03-12-2025.
// -- desc: redux toolkit slice for the company components.
// -- author: Rahimullah Ibrahimi.
// -- email: rahimullahibrahimi79@gmail.com


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import k9CardPrintService from './k9CardPrintService'
import { PrintedCard } from 'app/modules/k9/card-print/list/__model'

type PrintedCardState = {
  printedCardIndex: any
  printedCardView: PrintedCard | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: PrintedCardState = {
  printedCardIndex: { data: [] },
  printedCardView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Printed Card from server
export const getPrintedCard = createAsyncThunk(
  'api/k9-printed-card',
  async (params: any, thunkAPI) => {
    try {
      return await k9CardPrintService.getPrintedCard(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// View Printed Card
export const viewPrintedCard = createAsyncThunk(
  'api/k9-licenseview',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await k9CardPrintService.view(id)
      return response
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
  'printedCard/changeStatus',
  async (data: { id: number; status: number }, thunkAPI) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid printed card ID')
      }

      const response = await k9CardPrintService.changeStatus({
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

export const changeStatusOfLicense = createAsyncThunk(
  'k9-licensechangeStatusOfLicense',
  async (
    data: { id: number; status: number; reason?: string },
    thunkAPI
  ) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid License ID')
      }

      const response = await k9CardPrintService.changeStatusOfLicense({
        id: numericId,
        status: data.status,
        reason: data.reason,
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

export const k9CardPrintSlice = createSlice({
  name: 'k9CardPrint',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(viewPrintedCard.pending, (state) => {
        state.loading = true
      })
      .addCase(viewPrintedCard.fulfilled, (state, action) => {
        state.loading = false
        state.printedCardView = action.payload
      })
      .addCase(viewPrintedCard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { reset } = k9CardPrintSlice.actions
export default k9CardPrintSlice.reducer
