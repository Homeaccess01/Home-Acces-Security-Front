import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  item: null,
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
};

export const personSlice = createSlice({
  name: "persons",
  initialState,
  reducers: {
    PERSONS_LIST_SUCCESS: (state, action) => {
      const { items, page, limit, total, pages } = action.payload;
      state.items = items || [];
      state.page = page || 1;
      state.limit = limit || 10;
      state.total = total || 0;
      state.pages = pages || 0;
    },
    PERSON_GET_SUCCESS: (state, action) => {
      state.item = action.payload;
    },
    PERSON_CREATE_SUCCESS: (state, action) => {
      state.items = [action.payload, ...state.items];
    },
    PERSON_UPDATE_SUCCESS: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((it) =>
        it._id === updated._id ? updated : it
      );
      if (state.item && state.item._id === updated._id) state.item = updated;
    },
    PERSON_DELETE_SUCCESS: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((it) => it._id !== id);
      if (state.item && state.item._id === id) state.item = null;
    },
  },
});

export const {
  PERSONS_LIST_SUCCESS,
  PERSON_GET_SUCCESS,
  PERSON_CREATE_SUCCESS,
  PERSON_UPDATE_SUCCESS,
  PERSON_DELETE_SUCCESS,
} = personSlice.actions;

export default personSlice.reducer;
