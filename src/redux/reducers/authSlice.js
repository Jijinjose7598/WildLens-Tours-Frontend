import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!sessionStorage.getItem("authToken"), // Initialize based on sessionStorage
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      sessionStorage.removeItem("authToken"); // Clear the token on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
