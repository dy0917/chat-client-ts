import { createSelector, createSlice } from '@reduxjs/toolkit';
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
    builder.addCase(loginWithTokenAsync.fulfilled, (state, action) => {
      state.messages = action.payload.messages;
    });
  },
});

const selectRoomId = (_state: any, roomId: string) => roomId;

export const getMessageByRoomId = createSelector(
  [(state: contactState) => state.messages, selectRoomId],
  (messages, roomId) => {
    const selectedMessages = messages.filter(
      (message: TMessage) => message.chatRoomId == roomId
    );
    return selectedMessages;
  }
);

export const { addMessage } = contactsSlice.actions;

export default contactsSlice.reducer;
