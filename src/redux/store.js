import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import messagesReducer from "./reducers/messages";
import personsReducer from "./reducers/person";
import apartmentsReducer from "./reducers/apartment";
import towersReducer from "./reducers/tower";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    persons: personsReducer,
    apartments: apartmentsReducer,
    towers: towersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
