import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import authReducer from './slices/auth';
import contactsReducer from './slices/contact';
import roomReducer from './slices/room';
// import _messageReducer from './slices/message';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    contacts: contactsReducer,
    room: roomReducer,
    // message: messageReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
