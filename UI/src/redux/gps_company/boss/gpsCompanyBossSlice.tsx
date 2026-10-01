// -- name: BossSlice.tsx
// -- date: 03-18-2025.
// -- desc: Redux toolkit slice for the Boss components.
// -- author: Mohammad Omer Amiri.
// -- email: amiriomer6@gmail.com

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {Boss} from 'app/modules/workshop/company/view/tabsComponents/Boss/view/__model'
import gpsCompanyBossService from './gpsCompanyBossService'

type BossState = {
  bossIndex: any
  bossView: Boss | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: BossState = {
  bossIndex: {data: []},
  bossView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get company from server
export const getBoss = createAsyncThunk('api/gpsCompanyBoss/index', async (params: any, thunkAPI) => {
  try {
    return await gpsCompanyBossService.getBoss(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get status for button
export const createButton = createAsyncThunk(
  'api/gpsCompanyBoss/createButton',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyBossService.createButton(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// store Boss
export const storeBoss = createAsyncThunk('api/gpsCompanyBoss/store', async (formData: any, thunkAPI) => {
  try {
    return await gpsCompanyBossService.store(formData)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// View Boss
export const viewBoss = createAsyncThunk(
  'api/gpsCompanyBoss/view',
  async ({id, formData}: any, thunkAPI) => {
    try {
      return await gpsCompanyBossService.viewBoss(id, formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// edit Boss
export const editBoss = createAsyncThunk('api/gpsCompanyBoss/edit', async (id: any, thunkAPI) => {
  try {
    return await gpsCompanyBossService.editBoss(id)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Boss Update
export const updateBoss = createAsyncThunk(
  'api/gpsCompanyBoss/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await gpsCompanyBossService.update(id, formData)
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
  'gpsCompanyBoss/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await gpsCompanyBossService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const gpsCompanyBossSlice = createSlice({
  name: 'gpsCompanyBoss',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoss.fulfilled, (state, action: PayloadAction<any>) => {
        state.bossIndex = action.payload
      })
      .addCase(viewBoss.fulfilled, (state, action: PayloadAction<any>) => {
        state.bossView = action.payload
      })
  },
})

export const {reset} = gpsCompanyBossSlice.actions
export default gpsCompanyBossSlice.reducer
