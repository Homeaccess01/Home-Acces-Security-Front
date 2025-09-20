import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  type_message:null,
  time: 3000,
  loading: false,
};

export const errorsSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    SET_MODAL_MESSAGE: (state, action) => {
      console.log(action);
      state.message = action.payload.message;
      state.type_message = action.payload.type_message;
      state.time = action.payload.time || 3000;
    },
    CLEAR_MODAL_MESSAGE: (state) => {
      state.message = null;
      state.type_message = null;
    },
    SET_LOADING: (state) => {
      state.loading = true;
    },
    REMOVE_LOADING: (state) => {
      state.loading = false;
    },
  },
});

export const {
  SET_MODAL_MESSAGE,
  CLEAR_MODAL_MESSAGE,  
  SET_LOADING,
  REMOVE_LOADING,
} = errorsSlice.actions;

export default errorsSlice.reducer;
