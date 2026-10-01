// -- name: PrintedCardSlice.tsx
// -- date: 06-04-2025.
// -- desc: Redux toolkit slice for the PrintedCard components.
// -- author: Omer Amiri.
// -- email: amiriomer6@gmail.com

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {PrintedCard} from 'app/modules/workshop/card-print/list/__model'
import gpsPrintedCardService from './gpsPrintedCardService'

type PrintedCardState = {
  printedCardIndex: any
  printedCardView: PrintedCard | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: PrintedCardState = {
  printedCardIndex: {data: []},
  printedCardView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Printed Card from server
export const getPrintedCard = createAsyncThunk(
  'api/gpsPrintedCard/index',
  async (params: any, thunkAPI) => {
    try {
      return await gpsPrintedCardService.getPrintedCard(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Store printed card
export const storePrintedCard = createAsyncThunk(
  'api/gpsPrintedCard/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await gpsPrintedCardService.store(formData)
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
  'api/gpsPrintedCard/view',
  async ({id}: {id: number}, thunkAPI) => {
    try {
      const response = await gpsPrintedCardService.view(id)
      return response // ✅ fixed: already data, no `.data` needed
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Printed Card Update
export const updatePrintedCard = createAsyncThunk(
  'api/gpsPrintedCard/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await gpsPrintedCardService.update(id, formData)
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
  'api/gpsPrintedCard/changeStatus',
  async (data: {id: number; status: number}, thunkAPI) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid printed card ID')
      }

      const response = await gpsPrintedCardService.changeStatus({
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
  'api/gpsPrintedCard/changeStatusOfLicense',
  async (
    data: {id: number; status: number; reason?: string}, // updated type
    thunkAPI
  ) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid License ID')
      }

      const response = await gpsPrintedCardService.changeStatusOfLicense({
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

export const gpsPrintedCardSlice = createSlice({
  name: 'gpsPrintedCard',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrintedCard.fulfilled, (state, action: PayloadAction<any>) => {
        state.printedCardIndex = action.payload
      })
      .addCase(storePrintedCard.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storePrintedCard.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.printedCardIndex.data.push(action.payload)
      })
      .addCase(storePrintedCard.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
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

export const {reset} = gpsPrintedCardSlice.actions
export default gpsPrintedCardSlice.reducer
