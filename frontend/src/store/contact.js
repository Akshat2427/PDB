import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
};

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact(state, action) {
      state.contacts = [...state.contacts, ...action.payload];
    },
    loadContacts(state, action) {
      state.contacts = action.payload;
    },
  },
});

export const { addContact, loadContacts } = contactSlice.actions;
export default contactSlice.reducer;
