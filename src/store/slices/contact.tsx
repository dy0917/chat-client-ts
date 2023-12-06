import { AxiosError } from 'axios';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import { isPendingAction, isFulfilledAction } from './index';
import getAxios from '../../utils/axiosFactory';
import { TUser } from '../../types/user';
import { loginWithTokenAsync } from './auth';
import { TRoom } from '../../types';
import { newContact } from './room';

const sliceName = 'contacts';
type TContactState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
  contacts?: Array<TUser>;
  tempContacts?: Array<TUser>;
};

const initialState: TContactState = {
  status: 'idle',
  error: undefined,
  contacts: [],
  tempContacts: [],
};

// Define an asynchronous thunk action
export const findUsersByQueryString = createAsyncThunk(
  `${sliceName}/findUsersByQueryString`,
  async ({ queryString }: { queryString: string }, { rejectWithValue }) => {
    try {
      const response = await getAxios().get('/api/v1/users/find', {
        params: {
          queryString,
        },
      });
      return response.data.users;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

const tempContacts = (state: TContactState) => state.tempContacts;

// expects a number as the second argument
const selectedContactId = (_state: TContactState, contactId: string) =>
  contactId;

const contacts = (state: TContactState) => state.contacts;

export const getExistedContactById = createSelector(
  [contacts, selectedContactId],
  (contacts, selectedContactId) => {
    const obj = contacts!.reduce((accumulator: any, value: any) => {
      return { ...accumulator, [value._id]: value };
    }, {});
    return obj[selectedContactId];
  }
);

export const getContactById = createSelector(
  [tempContacts, selectedContactId],
  (tempContacts, selectedContactId) => {
    const obj = tempContacts!.reduce((accumulator: any, value: any) => {
      return { ...accumulator, [value._id]: value };
    }, {});
    return obj[selectedContactId];
  }
);

const contactsSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    clearTempContacts: (state) => {
      state.status = 'idle';
      state.tempContacts = [];
      localStorage.clear();
    },
    addContact: (state, action) => {
      state.contacts = [...state.contacts!, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findUsersByQueryString.fulfilled, (state, action) => {
        state.tempContacts = action.payload;
        state.status = 'succeeded';

        state.tempContacts = action.payload;
      })
      .addCase(findUsersByQueryString.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(loginWithTokenAsync.fulfilled, (_state, action) => {
        _state.contacts = action.payload.rooms.reduce(
          (result: Array<TUser>, room: TRoom) => result.concat(room.users),
          []
        );
      })
      .addCase(newContact.fulfilled, (_state, action: PayloadAction<TRoom>) => {
     
        _state.contacts = [..._state.contacts!, ...action.payload.users];
      })

      .addMatcher(isPendingAction(sliceName), (state) => {
        state.status = 'loading';
      })
      .addMatcher(isFulfilledAction(sliceName), (state) => {
        state.status = 'succeeded';
      });
  },
});

export const { addContact } = contactsSlice.actions;

export default contactsSlice.reducer;
