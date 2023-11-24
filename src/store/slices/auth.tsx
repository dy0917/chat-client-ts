import axios, { AxiosError } from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { isPendingAction, isFulfilledAction } from './index';
import getAxios from '../../utils/axiosFactory';

interface authState {
  me?: any;
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
  'auth/loginAsync',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    // Simulate an asynchronous operation (e.g., API call)
    try {
      const response = await getAxios().post(
        '/api/v1/auth/login',
        {
          email,
          password,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

export const loginWithTokenAsync = createAsyncThunk(
  'auth/loginWithTokenAsync',
  async (
    { }:any,
    { rejectWithValue }
  ) => {
    try {
      const response = await getAxios().get(
        '/api/v1/user/me',
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
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
      .addCase(loginWithTokenAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = "failed to login"
      });
    
    builder.addMatcher(isPendingAction, (state, action) => {
      state.status = 'loading';
    });
    builder.addMatcher(isFulfilledAction, (state, action) => {
      state.status = 'succeeded';
    });
  },
});

export const { clearToken} = authSlice.actions;

export default authSlice.reducer;
