// -- name: assistantSlice.tsx
// -- date: 03-18-2025.
// -- desc: Redux toolkit slice for the Assistant components.
// -- author: Rahimullah Ibrahimi.
// -- email: rahimullahibrahimi79@gmail.com

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import gunService from './gunService'

type GunState = {
  gunIndex: any
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: GunState = {
  gunIndex: {data: []},
  status: 'idle',
  error: null,
  loading: false,
}

// Get gun from server
export const getGun = createAsyncThunk('api/gun/index', async (params: any, thunkAPI) => {
  try {
    return await gunService.getGun(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

//Store gun to server
export const storeGun = createAsyncThunk('api/gun/store', async (params: any, thunkAPI) => {
  try {
    return await gunService.store(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateGun = createAsyncThunk(
  'gun/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await gunService.update(id, formData)
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

export const gunSlice = createSlice({
  name: 'gun',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getGun.fulfilled, (state, action: PayloadAction<any>) => {
      state.gunIndex = {
        data: action.payload.data,
        meta: action.payload.meta,
      }
    })
  },
})

export const {reset} = gunSlice.actions
export default gunSlice.reducer
