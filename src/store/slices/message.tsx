import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginWithTokenAsync } from './auth';
import { TMessage } from '../../types';
import getAxios from '../../utils/axiosFactory';
import { AxiosError } from 'axios';

const sliceName = 'messages';
type TMessageState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
  messages: Array<TMessage>;
};

const initialState: TMessageState = {
  status: 'idle',
  error: undefined,
  messages: [],
};

const contactsSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages = [...state.messages!, action.payload];
    },

    updateTempMessage: (state, action) => {
      const index = state.messages.findIndex((message) => {
        return message.tempId === action.payload.tempId;
      });
      const message = state.messages[index];
      const updatedMessage = {
        ...message,
        ...action.payload,
        tempId: undefined,
      };
      state.messages[index] = updatedMessage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginWithTokenAsync.fulfilled, (state, action) => {
      state.messages = action.payload.messages;
    });
  },
});

export const getPreviousMessages = createAsyncThunk(
  `${sliceName}/messages`,
  async (
    {
      roomId,
      lastMessageDateTime,
    }: { roomId: string; lastMessageDateTime: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await getAxios().get('/api/v1/messages', {
        params: {
          roomId,
          lastMessageDateTime,
        },
      });
      return {
        roomId,
        messages: response.data.messages,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

// export const { addMessage, updateTempMessage } = contactsSlice.actions;

export default contactsSlice.reducer;
