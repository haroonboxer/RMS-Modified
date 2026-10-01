import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import droneCameraLicenseService from './droneCameraLicenseService'
import {License} from 'app/modules/drone/company/view/tabsComponents/License/__model'

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
  'api/DroneCameraLicense/index',
  async (params: any, thunkAPI) => {
    try {
      return await droneCameraLicenseService.getLicense(params)
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
  'api/DroneCameraLicense/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await droneCameraLicenseService.store(formData)
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
  'api/DroneCameraLicense/view',
  async ({id}: {id: number}, thunkAPI) => {
    try {
      const response = await droneCameraLicenseService.view(id)
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
  'api/DroneCameraLicense/update',
  async ({id, formData}: {id: number; formData: FormData}, thunkAPI) => {
    try {
      const response = await droneCameraLicenseService.update(id, formData)
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
  'api/DroneCameraLicense/createButton',
  async (params: any, thunkAPI) => {
    try {
      return await droneCameraLicenseService.createButton(params)
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
  'DroneCameraLicense/changeStatus',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await droneCameraLicenseService.changeStatus(formData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// export const changeStatusOfPrint = createAsyncThunk(
//   'workshopLicense/changeStatusOfPrint',
//   async (formData: FormData, thunkAPI) => {
//     try {
//       const response = await droneCameraLicenseService.changeStatusOfPrint(formData)
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

      const response = await droneCameraLicenseService.changeStatusOfPrint(formData)

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

export const droneCameraLicenseSlice = createSlice({
  name: 'droneCameraLicense',
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

export const {reset} = droneCameraLicenseSlice.actions
export default droneCameraLicenseSlice.reducer
