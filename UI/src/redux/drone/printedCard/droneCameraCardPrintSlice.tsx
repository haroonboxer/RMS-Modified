// -- name: PrintedCardSlice.tsx
// -- date: 01-02-2026.
// -- desc: Redux toolkit slice for the PrintedCard components.
// -- author: Omer Amiri.
// -- email: amiriomer6@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import cardPrintService from './droneCameraCardPrintService'
import { PrintedCard } from 'app/modules/drone/card-print/list/__model'

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
  'api/droneCameraPrintedCard/index',
  async (params: any, thunkAPI) => {
    try {
      return await cardPrintService.getPrintedCard(params)
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
  'api/droneCameraPrintedCard/view',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await cardPrintService.view(id)
      return response
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
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

      const response = await cardPrintService.changeStatus({
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
  'droneCameraPrintedCard/changeStatusOfLicense',
  async (
    data: { id: number; status: number; reason?: string }, // updated type
    thunkAPI
  ) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid License ID')
      }

      const response = await cardPrintService.changeStatusOfLicense({
        id: numericId,
        status: data.status,
        reason: data.reason, // include reason if exists
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

export const droneCameraCardPrintSlice = createSlice({
  name: 'droneCameraCardPrint',
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

export const { reset } = droneCameraCardPrintSlice.actions
export default droneCameraCardPrintSlice.reducer
