// -- name: companySlice.
// -- date: 03-12-2025.
// -- desc: redux toolkit slice for the company components.
// -- author: Rahimullah Ibrahimi.
// -- email: rahimullahibrahimi79@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import k9ReportService from './k9ReportService'

type ReportState = {
  reportIndex: any
  companies: Array<{ id: string; company_dr: string }>
  monthlyStats: Array<{ month: number; year: number; count: number }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: ReportState = {
  reportIndex: {},
  companies: [],
  monthlyStats: [],
  status: 'idle',
  error: null,
  loading: false,
}

export const fetchk9Report = createAsyncThunk('k9-report/getReport', async (params: any, thunkAPI) => {
  try {
    return await k9ReportService.getReport(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const fetchk9Companies = createAsyncThunk('report/listK9Company', async (_, thunkAPI) => {
  try {
    return await k9ReportService.getWorkshopCompanies()
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const fetchMonthlyCompanyStats = createAsyncThunk(
  'report/monthlyCompanyStats',
  async (_, thunkAPI) => {
    try {
      return await k9ReportService.getMonthlyCompanyStats()
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const k9reportSlice = createSlice({
  name: 'k9Report',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchk9Report.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchk9Report.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.loading = false
        state.reportIndex = action.payload
      })
      .addCase(fetchk9Report.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchk9Companies.fulfilled, (state, action: PayloadAction<any>) => {
        state.companies = action.payload
      })
      .addCase(fetchMonthlyCompanyStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMonthlyCompanyStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.monthlyStats = action.payload
      })
      .addCase(fetchMonthlyCompanyStats.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { reset } = k9reportSlice.actions
export default k9reportSlice.reducer
