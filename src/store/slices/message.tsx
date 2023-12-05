import { createSelector, createSlice } from '@reduxjs/toolkit';
import { loginWithTokenAsync } from './auth';
import { TMessage } from '../../types';
import moment from 'moment';

const sliceName = 'contacts';
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

const selectRoomId = (_state: TMessageState, roomId: string) => roomId;
const activeTime = (
  _state: TMessageState,
  _roomId: string,
  activeTime: string
) => activeTime;

const allMessages = (state: TMessageState) => state.messages;

export const getMessageByRoomId = createSelector(
  [allMessages, selectRoomId],
  (messages, roomId) => {
    const selectedMessages = messages.filter(
      (message: TMessage) => message.chatRoomId == roomId
    );
    return selectedMessages;
  }
);

export const getIncomeingMessageByRoomId = createSelector(
  [allMessages, selectRoomId, activeTime],
  (messages, roomId, activeTime) => {
    const selectedMessages = messages.filter(
      (message: TMessage) =>
        message.chatRoomId == roomId &&
        moment.utc(message.createdAt).isAfter(activeTime)
    );
    return selectedMessages;
  }
);

export const { addMessage, updateTempMessage } = contactsSlice.actions;

export default contactsSlice.reducer;
