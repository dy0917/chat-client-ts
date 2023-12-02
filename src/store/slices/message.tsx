import { createSelector, createSlice } from '@reduxjs/toolkit';
import { loginWithTokenAsync } from './auth';
export type TMessage = {
  _id?: string;
  context: string;
  senderId: string;
  receiverId?: string;
  chatRoomId: string;
  tempId?: string;
};
const sliceName = 'contacts';
interface MessageState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
  messages: Array<TMessage>;
}

const initialState: MessageState = {
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
        _id: action.payload._id,
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

const selectRoomId = (_state: any, roomId: string) => roomId;
const allMessages = (state: MessageState) => state.messages;

export const getMessageByRoomId = createSelector(
  [allMessages, selectRoomId],
  (messages, roomId) => {
    const selectedMessages = messages.filter(
      (message: TMessage) => message.chatRoomId == roomId
    );
    return selectedMessages;
  }
);

export const { addMessage, updateTempMessage } = contactsSlice.actions;

export default contactsSlice.reducer;
