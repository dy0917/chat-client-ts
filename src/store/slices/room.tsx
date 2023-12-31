// src/counterSlice.ts
import { AxiosError } from 'axios';
import getAxios from '../../utils/axiosFactory';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import { loginWithTokenAsync } from './auth';
import { TMessage, TRoom } from '../../types';
import { getPreviousMessages } from './message';
import moment from 'moment';

const sliceName = 'room';

type TRoomState = {
  rooms: Record<string, TRoom>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
};

const initialState: TRoomState = {
  rooms: {},
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

export const allRooms = (state: TRoomState) => state.rooms;

// expects a number as the second argument
const selectRoomId = (_state: TRoomState, roomId: string) => roomId;

export const getRoomById = createSelector(
  [allRooms, selectRoomId],
  (allRooms, selectRoomId) => {
    return allRooms[selectRoomId];
  }
);

const roomSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<TMessage>) => {
      const messages = state.rooms[action.payload.chatRoomId].messages;
      state.rooms[action.payload.chatRoomId].messages = [
        ...messages!,
        action.payload,
      ];
    },
    updateTempMessage: (state, action: PayloadAction<TMessage>) => {
      const rooms = state.rooms;
      const targetRoom = rooms[action.payload.chatRoomId];

      const index = targetRoom.messages!.findIndex((message) => {
        return message.tempId === action.payload.tempId;
      });
      const message = targetRoom.messages![index];
      const updatedMessage = {
        ...message,
        ...action.payload,
        tempId: undefined,
      };
      targetRoom.messages![index] = updatedMessage;
    },

    addRoom: (state, action: PayloadAction<TRoom>) => {
      state.rooms[action.payload._id] = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginWithTokenAsync.fulfilled, (state, action) => {
        const obj = action.payload.rooms.reduce(
          (accumulator: Record<string, TRoom>, value: TRoom) => {
            return { ...accumulator, [value._id]: value };
          },
          {}
        );
        state.rooms = obj;
      })
      .addCase(getPreviousMessages.fulfilled, (state, action) => {
        if (action.payload?.messages.length > 0) {
          const room = state.rooms[action.payload?.roomId!];
          room.messages = Array.from(
            new Set([...action.payload?.messages, ...room.messages!])
          ).sort((meesage1, message2) => {
            return moment(meesage1.createdAt).isBefore(message2.createdAt)
              ? -1
              : 1;
          });
        }
      })
      .addCase(newContact.fulfilled, (state, action) => {
        state.rooms![action.payload._id] = action.payload;
        state.status = 'succeeded';
      })
      .addCase(newContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const getMessagesByRoomId = createSelector(
  [allRooms, selectRoomId],
  (rooms, roomId) => {
    return rooms[roomId].messages;
  }
);

export const { addMessage, updateTempMessage, addRoom } = roomSlice.actions;

export default roomSlice.reducer;
