import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import licenseService from './licenseService'
import { License } from 'app/modules/rms/company/view/tabsComponents/License/__model'

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
  'api/license/index',
  async (params: any, thunkAPI) => {
    try {
      return await licenseService.getLicense(params)
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
  'api/license/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await licenseService.store(formData)
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
  'api/license/view',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await licenseService.view(id)
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
  'api/license/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await licenseService.update(id, formData)
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
  'api/license/createButton',
  async (params: any, thunkAPI) => {
    try {
      return await licenseService.createButton(params)
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
  'license/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await licenseService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const licenseSlice = createSlice({
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

export const { reset } = licenseSlice.actions
export default licenseSlice.reducer