import { AxiosError } from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { isPendingAction, isFulfilledAction } from './index';
import getAxios from '../../utils/axiosFactory';
import { loginWithTokenAsync } from './auth';

export type TMessage = {
  _id?: string;
  context: string;
  senderId: string;
  receiverId?: string;
  chatRoomId: string;
};
const sliceName = 'contacts';
interface contactState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
  messages: Array<TMessage>;
}

const initialState: contactState = {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithTokenAsync.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      });
  },
});

export const getMessageByRoomId = (roomId: string) => (state: any) => {

  const messages = state.message.messages.filter(
    (message: TMessage) => message.chatRoomId == roomId
  );
  return messages;
};

export const { addMessage } = contactsSlice.actions;

export default contactsSlice.reducer;
