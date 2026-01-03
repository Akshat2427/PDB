import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import contactReducer from "./contact";

export const store = configureStore({
  reducer: {
    user: userReducer,
    contacts: contactReducer,
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
