import { AxiosError } from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getAxios from '../../utils/axiosFactory';
import { isFulfilledAction, isPendingAction } from '.';
import { TUser } from '../../types/user';

const sliceName = 'auth';

interface authState {
  me?: TUser;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
  token?: string;
}

const initialState: authState = {
  me: undefined,
  status: 'idle',
  error: undefined,
  token: localStorage.getItem('token') || undefined,
};

// Define an asynchronous thunk action
export const loginAsync = createAsyncThunk(
  `${sliceName}/loginAsync`,
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    // Simulate an asynchronous operation (e.g., API call)
    try {
      const response = await getAxios().post('/api/v1/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

export const loginWithTokenAsync = createAsyncThunk(
  `${sliceName}/loginWithTokenAsync`,
  async ({}:any, { rejectWithValue }) => {
    try {
      const response = await getAxios().get('/api/v1/user/me');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

const authSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    clearToken: (state) => {
      state.token = undefined;
      state.error = undefined;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = 'succeeded';
        state.me = action.payload!.user;
        state.token = action.payload!.token;
        localStorage.setItem('token', action.payload!.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(loginWithTokenAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.me = action.payload!.user;
      })
      .addCase(loginWithTokenAsync.rejected, (state) => {
        state.status = 'failed';
        state.error = 'failed to login';
      });

    builder.addMatcher(isPendingAction(sliceName), (state) => {
      console.log('isPendingAction');
      state.status = 'loading';
    });
    builder.addMatcher(isFulfilledAction(sliceName), (state) => {
      console.log('isFulfilledAction');
      state.status = 'succeeded';
    });
  },
});

export const { clearToken } = authSlice.actions;

export default authSlice.reducer;
