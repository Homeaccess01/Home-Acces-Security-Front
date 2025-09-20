import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  item: null,
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
};

export const apartmentSlice = createSlice({
  name: "apartments",
  initialState,
  reducers: {
    APARTMENTS_LIST_SUCCESS: (state, action) => {
      const { items, page, limit, total, pages } = action.payload;
      state.items = items || [];
      state.page = page || 1;
      state.limit = limit || 10;
      state.total = total || 0;
      state.pages = pages || 0;
    },
    APARTMENT_GET_SUCCESS: (state, action) => {
      state.item = action.payload;
    },
    APARTMENT_CREATE_SUCCESS: (state, action) => {
      state.items = [action.payload, ...state.items];
    },
    APARTMENT_UPDATE_SUCCESS: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((it) =>
        it._id === updated._id ? updated : it
      );
      if (state.item && state.item._id === updated._id) state.item = updated;
    },
    APARTMENT_DELETE_SUCCESS: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((it) => it._id !== id);
      if (state.item && state.item._id === id) state.item = null;
    },
  },
});

export const {
  APARTMENTS_LIST_SUCCESS,
  APARTMENT_GET_SUCCESS,
  APARTMENT_CREATE_SUCCESS,
  APARTMENT_UPDATE_SUCCESS,
  APARTMENT_DELETE_SUCCESS,
} = apartmentSlice.actions;

export default apartmentSlice.reducer;
