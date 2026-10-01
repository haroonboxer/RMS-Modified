// -- name: BossSlice.tsx
// -- date: 03-18-2025.
// -- desc: Redux toolkit slice for the Boss components.
// -- author: Mohammad Omer Amiri.
// -- email: amiriomer6@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import bossService from './bossService'
import { Boss } from 'app/modules/rms/company/view/tabsComponents/Boss/view/__model'

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
export const getBoss = createAsyncThunk('api/boss/index', async (params: any, thunkAPI) => {
  try {
    return await bossService.getBoss(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})


// Get status for button
export const createButton = createAsyncThunk('api/boss/createButton', async (params: any, thunkAPI) => {
  try {
    return await bossService.createButton(params)
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
  'api/boss/store',
  async (formData: any, thunkAPI) => {
    try {
      return await bossService.store(formData)
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
  'api/boss/view',
  async ({ id, formData }: any, thunkAPI) => {
    try {
      return await bossService.viewBoss(id, formData)
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
  'api/boss/edit',
  async (id: any, thunkAPI) => {
    try {
      return await bossService.editBoss(id)
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
  'api/boss/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await bossService.update(id, formData)
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

export const changeStatus = createAsyncThunk('boss/changeStatus', async (formData: FormData, thunkAPI) => {
  try {
    const response = await bossService.changeStatus(formData)
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// // In your redux slice
// export const changeStatus = createAsyncThunk(
//   'company/changeStatus',
//   async (data: { id: string; status: number }, thunkAPI) => {
//     try {
//       const numericId = Number(data.id) // Ensure the ID is a number
//       if (isNaN(numericId)) {
//         return thunkAPI.rejectWithValue('Invalid Company ID')
//       }

//       const response = await companyService.changeStatus({
//         id: numericId, // Send the numeric ID
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

export const bossSlice = createSlice({
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

export const { reset } = bossSlice.actions
export default bossSlice.reducer
