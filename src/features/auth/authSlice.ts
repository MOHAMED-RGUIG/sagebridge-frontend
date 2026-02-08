import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./types";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.isLoading = false;
      state.error = null;

      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    loginError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload || "Erreur login";
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    logout(state) {
      state.isLoading = false;
      state.error = null;

      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
  },
});

export const authActions = slice.actions;
export default slice.reducer;
