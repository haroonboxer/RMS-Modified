// -- name: companySlice.
// -- date: 03-12-2025.
// -- desc: redux toolkit slice for the company components.
// -- author: Rahimullah Ibrahimi.
// -- email: rahimullahibrahimi79@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Boss } from 'app/modules/k9/company/view/tabsComponents/Boss/view/__model'
import K9BossService from './K9BossService'

type BossState = {
  bossIndex: any
  bossView: Boss | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: BossState = {
  bossIndex: { data: [] },
  bossView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get company from server
export const getBoss = createAsyncThunk('api/k9-boss/index', async (params: any, thunkAPI) => {
  try {
    return await K9BossService.getBoss(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})


// Get status for button
export const createButton = createAsyncThunk('api/k9-boss/createButton', async (params: any, thunkAPI) => {
  try {
    return await K9BossService.createButton(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// store Boss
export const storeBoss = createAsyncThunk(
  'api/k9-boss/store',
  async (formData: any, thunkAPI) => {
    try {
      return await K9BossService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


// View Boss
export const viewBoss = createAsyncThunk(
  'api/k9-boss/view',
  async ({ id, formData }: any, thunkAPI) => {
    try {
      return await K9BossService.viewBoss(id, formData)
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
export const editBoss = createAsyncThunk(
  'api/k9-boss/edit',
  async (id: any, thunkAPI) => {
    try {
      return await K9BossService.editBoss(id)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Boss Update 
export const updateBoss = createAsyncThunk(
  'api/k9-boss/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await K9BossService.update(id, formData)
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

export const changeStatus = createAsyncThunk('k9-boss/changeStatus', async (formData: FormData, thunkAPI) => {
  try {
    const response = await K9BossService.changeStatus(formData)
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const K9BossSlice = createSlice({
  name: 'boss',
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

export const { reset } = K9BossSlice.actions
export default K9BossSlice.reducer
