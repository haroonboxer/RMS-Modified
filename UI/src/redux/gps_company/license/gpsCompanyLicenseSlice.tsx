import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {License} from 'app/modules/workshop/company/view/tabsComponents/License/__model'
import gpsCompanyLicenseService from './gpsCompanyLicenseService'

type LicenseState = {
  licenseIndex: any
  licenseView: License | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: LicenseState = {
  licenseIndex: {data: []},
  licenseView: null,
  status: 'idle',
  error: null,
  loading: false,
}

export const getLicense = createAsyncThunk(
  'api/gpsCompanyLicense/index',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyLicenseService.getLicense(params)
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
  'api/gpsCompanyLicense/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await gpsCompanyLicenseService.store(formData)
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
  'api/gpsCompanyLicense/view',
  async ({id}: {id: number}, thunkAPI) => {
    try {
      const response = await gpsCompanyLicenseService.view(id)
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
  'api/gpsCompanyLicense/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await gpsCompanyLicenseService.update(id, formData)
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
  'api/gpsCompanyLicense/createButton',
  async (params: any, thunkAPI) => {
    try {
      return await gpsCompanyLicenseService.createButton(params)
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
  'gpsCompanyLicense/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await gpsCompanyLicenseService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// export const changeStatusOfPrint = createAsyncThunk(
//   'gpsCompanyLicense/changeStatusOfPrint',
//   async (formData: FormData, thunkAPI) => {
//     try {
//       const response = await gpsCompanyLicenseService.changeStatusOfPrint(formData)
//       return response.data
//     } catch (error: any) {
//       const message = error.response?.data?.message || error.message || error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

export const changeStatusOfPrint = createAsyncThunk(
  'printedCard/changeStatusOfPrint',
  async (data: {id: number; status: number}, thunkAPI) => {
    try {
      const numericId = Number(data.id)
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid License ID')
      }

      const formData = new FormData()
      formData.append('id', String(numericId))
      formData.append('printed', String(data.status)) // Backend expects "printed"

      const response = await gpsCompanyLicenseService.changeStatusOfPrint(formData)

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

export const gpsCompanyLicenseSlice = createSlice({
  name: 'gpsCompanyLicense',
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

export const {reset} = gpsCompanyLicenseSlice.actions
export default gpsCompanyLicenseSlice.reducer
