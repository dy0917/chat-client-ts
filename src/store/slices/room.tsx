// src/counterSlice.ts
import { AxiosError } from 'axios';
import getAxios from '../../utils/axiosFactory';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { loginWithTokenAsync } from './auth';
import { TRoom } from '../../types';

const sliceName = 'room';


type TRoomState = {
  rooms: Array<TRoom>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
}

const initialState: TRoomState = {
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

const allRooms = (state: TRoomState) => state.rooms;

// expects a number as the second argument
const selectRoomId = (_state: TRoomState, roomId: string) => roomId;

export const getRoomById = createSelector(
  [allRooms, selectRoomId],
  (allRooms, selectRoomId) => {
    const obj = allRooms.reduce((accumulator: any, value: any) => {
      return { ...accumulator, [value._id]: value };
    }, {});

    return obj[selectRoomId];
  }
);

const roomSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
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
