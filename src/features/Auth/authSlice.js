import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  loggedUser: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    init: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, payload) => {
      state.loggedUser = payload;
      state.loading = false;
    },
    loginFailed: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.loggedUser = null;
    }
  }
});

export const { init, loginSuccess, loginFailed, logout } = authSlice.actions;

//#region selectors
export const selectLoggedUser = (state) => state.auth.loggedUser;
export const selectLoading = (state) => state.auth.loading;
//#endregion

export default authSlice.reducer;
