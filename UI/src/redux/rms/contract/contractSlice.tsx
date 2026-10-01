// -- name: ContractSlice.tsx
// -- date: 06-04-2025.
// -- desc: Redux toolkit slice for the Contract components.
// -- author: Omer Amiri.
// -- email: amiriomer6@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import contractService from './contractService'
import { Contract } from 'app/modules/rms/company/view/tabsComponents/Contract/__model'

type ContractState = {
  contractIndex: any
  contractView: Contract | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: ContractState = {
  contractIndex: { data: [] },
  contractView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Contract from server
export const getContract = createAsyncThunk(
  'api/contract/index',
  async (params: any, thunkAPI) => {
    try {
      return await contractService.getContract(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


// Store Contract
export const storeContract = createAsyncThunk(
  'api/contract/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await contractService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// View Contract
export const viewContract = createAsyncThunk(
  'api/contract/view',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await contractService.view(id)
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

// Contract Update 
export const updateContract = createAsyncThunk(
  'api/contract/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await contractService.update(id, formData)
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
  'contract/changeStatus',
  async (data: { id: number; status: number }, thunkAPI) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid contract ID')
      }
      const response = await contractService.changeStatus({
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

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContract.fulfilled, (state, action: PayloadAction<any>) => {
        state.contractIndex = action.payload
      })
      .addCase(storeContract.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeContract.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.contractIndex.data.push(action.payload)
      })
      .addCase(storeContract.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewContract.pending, (state) => {
        state.loading = true
      })
      .addCase(viewContract.fulfilled, (state, action: PayloadAction<Contract>) => {
        state.loading = false
        state.contractView = action.payload
      })
      .addCase(viewContract.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { reset } = contractSlice.actions
export default contractSlice.reducer
