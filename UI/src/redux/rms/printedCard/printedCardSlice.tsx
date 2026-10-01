// -- name: PrintedCardSlice.tsx
// -- date: 06-04-2025.
// -- desc: Redux toolkit slice for the PrintedCard components.
// -- author: Omer Amiri.
// -- email: amiriomer6@gmail.com

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import printedCardService from './printedCardService'
import {PrintedCard} from 'app/modules/rms/company/view/tabsComponents/PrintedCard/__model'

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
  'api/printed_card/index',
  async (params: any, thunkAPI) => {
    try {
      return await printedCardService.getPrintedCard(params)
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
  'api/printed_card/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await printedCardService.store(formData)
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
  'api/printed_card/view',
  async ({id}: {id: number}, thunkAPI) => {
    try {
      const response = await printedCardService.view(id)
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

// Printed Card Update
export const updatePrintedCard = createAsyncThunk(
  'api/printed_card/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await printedCardService.update(id, formData)
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

// export const changeStatus = createAsyncThunk(
//   'printed_card/changeStatus',
//   async (data: { id: number; status: number }, thunkAPI) => {
//     try {
//       const numericId = Number(data.id)
//       if (isNaN(numericId)) {
//         return thunkAPI.rejectWithValue('Invalid printed card ID')
//       }
//       const response = await printedCardService.changeStatus({
//         id: numericId,
//         status: data.status,
//       })
//       return response.data
//     } catch (error: any) {
//       const message =
//         (error.response && error.response.data && error.response.data.message) ||
//         error.message ||
//         error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

export const changeStatus = createAsyncThunk(
  'printed_card/changeStatus',
  async (data: {id: number; status: number}, thunkAPI) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid printed card ID')
      }

      const response = await printedCardService.changeStatus({
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

export const printedCardSlice = createSlice({
  name: 'printedCard',
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
      .addCase(viewPrintedCard.fulfilled, (state, action: PayloadAction<PrintedCard>) => {
        state.loading = false
        state.printedCardView = action.payload
      })
      .addCase(viewPrintedCard.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {reset} = printedCardSlice.actions
export default printedCardSlice.reducer
