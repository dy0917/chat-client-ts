import { AxiosError } from 'axios';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { isPendingAction, isFulfilledAction } from './index';
import getAxios from '../../utils/axiosFactory';
import { TUser } from '../../types/user';

const sliceName = 'contacts';
interface ContactState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
  tempContacts?: Array<TUser>;
}

const initialState: ContactState = {
  status: 'idle',
  error: undefined,
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

const allContacts = (state: ContactState) => state.tempContacts;

// expects a number as the second argument
const selectedContactId = (_state: ContactState, contactId: string) =>
  contactId;

export const getContactById = createSelector(
  [allContacts, selectedContactId],
  (allContacts, selectedContactId) => {
    const obj = allContacts!.reduce((accumulator: any, value: any) => {
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
      })

      .addMatcher(isPendingAction(sliceName), (state) => {
        state.status = 'loading';
      })
      .addMatcher(isFulfilledAction(sliceName), (state) => {
        state.status = 'succeeded';
      });
  },
});

export default contactsSlice.reducer;
