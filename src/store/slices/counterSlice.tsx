// src/counterSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

// Define an asynchronous thunk action
export const incrementAsync = createAsyncThunk(
  'counter/incrementAsync',
  async () => {
    // Simulate an asynchronous operation (e.g., API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 1;
  }
);

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    set: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { increment, decrement, set } = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;
export const selectStatus = (state: RootState) => state.counter.status;

export default counterSlice.reducer;
