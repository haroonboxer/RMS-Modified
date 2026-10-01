// -- name: companySlice.
// -- date: 20-2-2026.
// -- desc: redux toolkit slice for the company components.
// -- author: Rahimullah Ibrahimi.
// -- email: rahimullahibrahimi79@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import k9LicenseService from './k9LicenseService'
import { License } from 'app/modules/k9/company/view/tabsComponents/License/__model'

type LicenseState = {
  licenseIndex: any
  licenseView: License | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: LicenseState = {
  licenseIndex: { data: [] },
  licenseView: null,
  status: 'idle',
  error: null,
  loading: false,
}

export const getLicense = createAsyncThunk(
  'api/k9-license/index',
  async (params: any, thunkAPI) => {
    try {
      return await k9LicenseService.getLicense(params)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const storeLicense = createAsyncThunk(
  'api/k9-license/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await k9LicenseService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const viewLicense = createAsyncThunk(
  'api/k9-license/view',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await k9LicenseService.view(id)
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

export const updateLicense = createAsyncThunk(
  'api/k9-license/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await k9LicenseService.update(id, formData)
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

// Get hide button
export const createButton = createAsyncThunk(
  'api/k9-license/createButton',
  async (params: any, thunkAPI) => {
    try {
      return await k9LicenseService.createButton(params)
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
  'k9-license/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await k9LicenseService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


export const changeStatusOfPrint = createAsyncThunk(
  'printedCard/changeStatusOfPrint',
  async (data: { id: number; status: number }, thunkAPI) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid License ID')
      }

      const formData = new FormData()
      formData.append('id', String(numericId))
      formData.append('printed', String(data.status)) // Backend expects "printed"

      const response = await k9LicenseService.changeStatusOfPrint(formData)

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

export const k9LicenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLicense.fulfilled, (state, action: PayloadAction<any>) => {
        state.licenseIndex = action.payload
      })
      .addCase(storeLicense.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeLicense.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.licenseIndex.data.push(action.payload)
      })
      .addCase(storeLicense.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewLicense.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(viewLicense.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.licenseView = action.payload
      })
      .addCase(viewLicense.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(changeStatus.pending, (state) => {
        state.status = 'loading'
      })
  },
})

export const { reset } = k9LicenseSlice.actions
export default k9LicenseSlice.reducer
