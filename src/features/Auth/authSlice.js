import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0
};

export const authSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    }
  }
});

export const { increment, decrement, incrementByAmount } = authSlice.actions;

//#region selectors
export const selectCount = (state) => state.counter.value;
//#endregion

export default authSlice.reducer;
