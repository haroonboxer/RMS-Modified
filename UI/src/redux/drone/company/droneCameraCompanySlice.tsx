// -- name: companySlice.
// -- date: 03-12-2025.
// -- desc: redux toolkit slice for the company components.
// -- author: Rahimullah Ibrahimi.
// -- email: rahimullahibrahimi79@gmail.com

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import droneCameraCompanyService from './droneCameraCompanyService'

type CompanyState = {
  companyIndex: any
  companyView: {}
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CompanyState = {
  companyIndex: { data: [] },
  companyView: {},
  status: 'idle',
  error: null,
}

// Get company from server
export const getCompany = createAsyncThunk('api/DroneCameraCompany/index', async (params: any, thunkAPI) => {
  try {
    return await droneCameraCompanyService.getCompany(params)
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Store company
export const storeCompany = createAsyncThunk(
  'api/DroneCameraCompany/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await droneCameraCompanyService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// View company
export const viewCompanies = createAsyncThunk(
  'api/DroneCameraCompany/view',
  async ({ id, formData }: any, thunkAPI) => {
    try {
      return await droneCameraCompanyService.viewCompany(id, formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//Update Company
export const updateCompany = createAsyncThunk(
  'api/DroneCameraCompany/update',
  async (formData: FormData, thunkAPI) => {
    try {
      return await droneCameraCompanyService.update(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// export const changeStatus = createAsyncThunk(
//   'DroneCameraCompany/changeStatus',
//   async (formData: FormData, thunkAPI) => {
//     try {
//       const response = await droneCameraCompanyService.changeStatus(formData)
//       return response.data
//     } catch (error: any) {
//       const message = error.response?.data?.message || error.message || error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

export const droneCameraCompanySlice = createSlice({
  name: 'DroneCameraCompany',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(storeCompany.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.companyIndex.data.push(action.payload)
      })
      .addCase(storeCompany.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(getCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.companyIndex = action.payload
      })
      // .addCase(changeStatus.pending, (state) => {
      //   state.status = 'loading'
      // })
      // .addCase(changeStatus.fulfilled, (state, action: PayloadAction<any>) => {
      //   state.status = 'succeeded'
      //   const updatedCompany = action.payload
      //   const index = state.companyIndex.data.findIndex(
      //     (company: any) => company.id === updatedCompany.id
      //   )
      //   if (index !== -1) {
      //     state.companyIndex.data[index] = updatedCompany
      //   }
      // })
      // .addCase(changeStatus.rejected, (state, action: PayloadAction<any>) => {
      //   state.status = 'failed'
      //   state.error = action.payload
      // })
      .addCase(viewCompanies.fulfilled, (state, action: PayloadAction<any>) => {
        state.companyView = action.payload
      })
  },
})

export const { reset } = droneCameraCompanySlice.actions
export default droneCameraCompanySlice.reducer
