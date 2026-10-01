// -- name: PersonnelDroneCameraSlice.tsx
// -- date: 03-18-2025.
// -- desc: Redux toolkit slice for the Personnel Drone Camera components.
// -- author: Mohammad Omer Amiri.
// -- email: amiriomer6@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import PersonnelDroneCameraService from './PersonnelDroneCameraService'
import { Boss } from 'app/modules/drone/pesonnel/view/tabsComponents/PersonnelDrone/__model'


type BossState = {
  companyIndex: any
  personnelView: Boss | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: BossState = {
  companyIndex: { data: [] },
  personnelView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Personnel drone info from server
export const getPersonnelDroneBoss = createAsyncThunk('api/PersonnelDroneCamera/index', async (params: any, thunkAPI) => {
  try {
    return await PersonnelDroneCameraService.getBoss(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})


// Get status for button
export const createButton = createAsyncThunk('api/PersonnelDroneCamera/createButton', async (params: any, thunkAPI) => {
  try {
    return await PersonnelDroneCameraService.createButton(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// store Boss
export const storePersonnelDroneBoss = createAsyncThunk(
  'api/PersonnelDroneCamera/store',
  async (formData: any, thunkAPI) => {
    try {
      return await PersonnelDroneCameraService.store(formData)
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
export const viewPersonnelCameraBoss = createAsyncThunk(
  'api/PersonnelDroneCamera/view',
  async ({ id, formData }: any, thunkAPI) => {
    try {
      return await PersonnelDroneCameraService.viewBoss(id, formData)
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
export const updatePersonnelDroneBoss = createAsyncThunk(
  'api/PersonnelDroneCamera/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await PersonnelDroneCameraService.update(id, formData)
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

export const changeStatus = createAsyncThunk('DroneCameraBoss/changeStatus', async (formData: FormData, thunkAPI) => {
  try {
    const response = await PersonnelDroneCameraService.changeStatus(formData)
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get Printed Card from server
export const getPrintedCard = createAsyncThunk(
  'api/personnelDroneCameraCardsApprove/index',
  async (params: any, thunkAPI) => {
    try {
      return await PersonnelDroneCameraService.getPrintedCard(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const PersonnelDroneCameraSlice = createSlice({
  name: 'PersonnelDroneCamera',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPersonnelDroneBoss.fulfilled, (state, action: PayloadAction<any>) => {
        state.companyIndex = action.payload
      })
      .addCase(viewPersonnelCameraBoss.fulfilled, (state, action: PayloadAction<any>) => {
        state.personnelView = action.payload
      })
  },
})

export const { reset } = PersonnelDroneCameraSlice.actions
export default PersonnelDroneCameraSlice.reducer
