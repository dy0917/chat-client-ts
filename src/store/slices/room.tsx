// src/counterSlice.ts
import { AxiosError } from 'axios';
import getAxios from '../../utils/axiosFactory';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { loginWithTokenAsync } from './auth';

const sliceName = 'room';
interface CounterState {
  rooms: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
}

const initialState: CounterState = {
  rooms: [],
  status: 'idle',
  error: undefined,
};
export const newContact = createAsyncThunk(
  `${sliceName}/newContact`,
  async ({ receiverId }: { receiverId: string }, { rejectWithValue }) => {
    try {
      const response = await getAxios().post('/api/v1/chatRoom/add', {
        receiverId,
      });
      return response.data.room;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

export const getRoomById = (id: string) => (state: any) => {
  const obj = state.room.rooms.reduce((accumulator: any, value: any) => {
    return { ...accumulator, [value._id]: value };
  }, {});

  return obj[id];
};

const roomSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // get
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginWithTokenAsync.fulfilled, (state, action) => {
        state.rooms = action.payload.rooms;
      })
      .addCase(newContact.fulfilled, (state, action) => {
        console.log('action.payload', action.payload);
        state.rooms = [...state.rooms!, action.payload];
        console.log('state.rooms', state.rooms);
        state.status = 'succeeded';
      })
      .addCase(newContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default roomSlice.reducer;
