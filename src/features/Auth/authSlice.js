import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  loggedUser: null,
  registeredUser: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    init: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, { payload }) => {
      state.registeredUser = payload;
      state.loading = false;
    },
    loginSuccess: (state, { payload }) => {
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

export const { init, loginSuccess, loginFailed, logout , registerSuccess } = authSlice.actions;

//#region selectors
export const selectLoggedUser = (state) => state.auth.loggedUser;
export const selectLoading = (state) => state.auth.loading;
export const selectRegisteredUser = (state) => state.auth.registeredUser;
//#endregion

export default authSlice.reducer;
