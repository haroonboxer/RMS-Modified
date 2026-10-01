// -- name: assistantSlice.tsx
// -- date: 03-18-2025.
// -- desc: Redux toolkit slice for the Assistant components.
// -- author: Rahimullah Ibrahimi.
// -- email: rahimullahibrahimi79@gmail.com

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import weaponService from './weaponService'

type WeaponState = {
  weaponIndex: any
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: WeaponState = {
  weaponIndex: {data: []},
  status: 'idle',
  error: null,
  loading: false,
}

// Get Weapon from server
export const getweapon = createAsyncThunk('api/weapon/index', async (params: any, thunkAPI) => {
  try {
    return await weaponService.getWeapon(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const storeWeapon = createAsyncThunk(
  'api/weapon/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await weaponService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateWeapon = createAsyncThunk(
  'api/weapon/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await weaponService.update(id, formData)
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
  'weapon/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await weaponService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const view = createAsyncThunk('api/weapon/view', async (id: number, thunkAPI) => {
  try {
    return await weaponService.view(id)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const weaponSlice = createSlice({
  name: 'weapon',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getweapon.fulfilled, (state, action: PayloadAction<any>) => {
        state.weaponIndex = action.payload
      })
      .addCase(storeWeapon.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeWeapon.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.weaponIndex.data.push(action.payload)
      })
      .addCase(storeWeapon.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const {reset} = weaponSlice.actions
export default weaponSlice.reducer
