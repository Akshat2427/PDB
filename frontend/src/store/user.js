import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userId: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.userId = action.payload;
      state.isLoggedIn = true;
    },
    loadUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { login, loadUser } = userSlice.actions;
export default userSlice.reducer;
