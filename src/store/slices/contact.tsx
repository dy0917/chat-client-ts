import { AxiosError } from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { isPendingAction, isFulfilledAction } from './index';
import getAxios from '../../utils/axiosFactory';

type TUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};
const sliceName = 'contacts';
interface contactState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
  tempContacts?: Array<TUser>;
}

const initialState: contactState = {
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

      .addMatcher(isPendingAction(sliceName), (state, action) => {
        state.status = 'loading';
      })
      .addMatcher(isFulfilledAction(sliceName), (state, action) => {
        state.status = 'succeeded';
      });
  },
});

// export const { clearToken} = authSlice.actions;

export default contactsSlice.reducer;
