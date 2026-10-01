import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import gpsCompanyReportService from './gpsCompanyReportService'

type ReportState = {
  reportIndex: any
  companies: Array<{id: string; company_dr: string}>
  monthlyStats: Array<{month: number; year: number; count: number}>
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

export const fetchGpsCompanyReport = createAsyncThunk(
  'gpsCompanyReport/getReport',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyReportService.getReport(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const fetchGpsCompany = createAsyncThunk(
  'report/gpsCompanyReportList',
  async (_, thunkAPI) => {
    try {
      return await gpsCompanyReportService.getGpsCompany()
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const fetchMonthlyCompanyStats = createAsyncThunk(
  'report/monthlyCompanyStats',
  async (_, thunkAPI) => {
    try {
      return await gpsCompanyReportService.getMonthlyCompanyStats()
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const gpsCompanyReportSlice = createSlice({
  name: 'gpsCompanyReport',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGpsCompanyReport.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchGpsCompanyReport.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.loading = false
        state.reportIndex = action.payload
      })
      .addCase(fetchGpsCompanyReport.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchGpsCompany.fulfilled, (state, action: PayloadAction<any>) => {
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

export const {reset} = gpsCompanyReportSlice.actions
export default gpsCompanyReportSlice.reducer
