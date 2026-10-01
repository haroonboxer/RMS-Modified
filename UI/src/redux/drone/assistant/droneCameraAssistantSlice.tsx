import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import assistantService from './droneCameraAssistantService'
import droneCameraAssistantService from './droneCameraAssistantService'
import { Assistant } from 'app/modules/drone/company/view/tabsComponents/Assistant/__model'

type AssistantState = {
  assistantIndex: any
  assistantView: Assistant | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

const initialState: AssistantState = {
  assistantIndex: { data: [] },
  assistantView: null,
  status: 'idle',
  error: null,
  loading: false,
}

// Get Assistant from server
export const getAssistant = createAsyncThunk(
  'api/DroneCameraAssistant/index',
  async (params: any, thunkAPI) => {
    try {
      return await droneCameraAssistantService.getAssistant(params)
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
// export const createButton = createAsyncThunk(
//   'api/assistant/createButton',
//   async (params: any, thunkAPI) => {
//     try {
//       return await assistantService.createButton(params)
//     } catch (error: any) {
//       const message =
//         (error.response && error.response.data && error.response.data.message) ||
//         error.message ||
//         error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

// Store Assistant
export const storeAssistant = createAsyncThunk(
  'api/DroneCameraAssistant/store',
  async (formData: FormData, thunkAPI) => {
    try {
      return await droneCameraAssistantService.store(formData)
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// View Assistant
export const viewAssistant = createAsyncThunk(
  'api/DroneCameraAssistant/view',
  async ({ id }: { id: number }, thunkAPI) => {
    try {
      const response = await droneCameraAssistantService.view(id)
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

export const updateAssistant = createAsyncThunk(
  'api/DroneCameraAssistant/update',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const response = await assistantService.update(id, formData)
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

// export const changeStatus = createAsyncThunk(
//   'assistant/changeStatus',
//   async (formData: FormData, thunkAPI) => {
//     try {
//       const response = await assistantService.changeStatus(formData)
//       return response.data
//     } catch (error: any) {
//       const message = error.response?.data?.message || error.message || error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

export const droneCameraAssistantSlice = createSlice({
  name: 'droneCameraAssistant',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssistant.fulfilled, (state, action: PayloadAction<any>) => {
        state.assistantIndex = {
          data: action.payload.data,
          meta: action.payload.meta, 
        }
      })
      .addCase(storeAssistant.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(storeAssistant.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.assistantIndex.data.push(action.payload)
      })
      .addCase(storeAssistant.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(viewAssistant.fulfilled, (state, action: PayloadAction<Assistant>) => {
        state.assistantView = action.payload
      })
      .addCase(viewAssistant.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })

//       .addCase(changeStatus.pending, (state) => {
//         state.status = 'loading'
//       })
//       .addCase(changeStatus.fulfilled, (state, action: PayloadAction<any>) => {
//         state.status = 'succeeded'
//         const updatedAssistant = action.payload
//         const index = state.assistantIndex.data.findIndex(
//           (company: any) => company.id === updatedAssistant.id
//         )
//         if (index !== -1) {
//           state.assistantIndex.data[index] = updatedAssistant
//         }
//       })
//       .addCase(changeStatus.rejected, (state, action: PayloadAction<any>) => {
//         state.status = 'failed'
//         state.error = action.payload
//       })
  },
})

export const { reset } = droneCameraAssistantSlice.actions
export default droneCameraAssistantSlice.reducer
